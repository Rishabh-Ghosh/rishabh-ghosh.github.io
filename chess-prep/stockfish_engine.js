// Real Stockfish WebAssembly/JS Engine UCI Controller
// Interfacing with official stockfish.js Web Worker for real-time depth-12 position evaluation

class StockfishEngineController {
    constructor(onEvalUpdate) {
        this.onEvalUpdate = onEvalUpdate;
        this.worker = null;
        this.currentFen = '';
        this.bestScoreCp = 0;
        this.prevScoreCp = 0;
        this.bestMove = '';
        this.isEvaluating = false;
        this.initStockfishWorker();
    }

    initStockfishWorker() {
        try {
            this.worker = new Worker('stockfish.js');

            this.worker.onmessage = (e) => {
                const line = typeof e.data === 'string' ? e.data : (e.data ? e.data.toString() : '');
                this.parseUciLine(line);
            };

            this.worker.postMessage('uci');
            this.worker.postMessage('isready');
            this.worker.postMessage('ucinewgame');
        } catch (err) {
            console.warn('Stockfish Web Worker initialization fallback:', err.message);
        }
    }

    evaluatePosition(fen) {
        this.prevScoreCp = this.bestScoreCp;
        this.currentFen = fen;
        this.isEvaluating = true;

        if (this.worker) {
            this.worker.postMessage('stop');
            this.worker.postMessage(`position fen ${fen}`);
            this.worker.postMessage('go depth 12');
        } else if (typeof StockfishEvaluator !== 'undefined') {
            const fallbackEval = StockfishEvaluator.evaluateFen(fen);
            this.bestScoreCp = fallbackEval.cp;
            if (this.onEvalUpdate) {
                this.onEvalUpdate(fallbackEval);
            }
        }
    }

    parseUciLine(line) {
        if (line.includes('info depth') && line.includes('score')) {
            const parts = line.split(' ');
            const cpIndex = parts.indexOf('cp');
            const mateIndex = parts.indexOf('mate');
            const turn = (this.currentFen.split(' ')[1]) || 'w';

            if (cpIndex !== -1 && parts[cpIndex + 1]) {
                let cp = parseInt(parts[cpIndex + 1]);
                const scoreForWhite = turn === 'w' ? cp : -cp;
                this.bestScoreCp = scoreForWhite;
                const display = (scoreForWhite >= 0 ? '+' : '') + (scoreForWhite / 100).toFixed(2);

                if (this.onEvalUpdate) {
                    this.onEvalUpdate({
                        cp: scoreForWhite,
                        display: display
                    });
                }
            } else if (mateIndex !== -1 && parts[mateIndex + 1]) {
                let mateIn = parseInt(parts[mateIndex + 1]);
                const mateScore = turn === 'w' ? (mateIn > 0 ? 1000 : -1000) : (mateIn > 0 ? -1000 : 1000);
                this.bestScoreCp = mateScore;
                const display = `M${mateIn}`;

                if (this.onEvalUpdate) {
                    this.onEvalUpdate({
                        cp: mateScore,
                        display: display
                    });
                }
            }
        }
    }

    evaluateUserMoveDelta(prevFen, newFen) {
        // Evaluate score drop in centipawns
        const scoreChange = Math.abs(this.bestScoreCp - this.prevScoreCp);
        const deltaPawns = (scoreChange / 100).toFixed(2);

        // 0.20 pawns (20 centipawns) inaccuracy threshold rule
        const isAcceptable = scoreChange <= 20;

        return {
            isAcceptable: isAcceptable,
            deltaCp: scoreChange,
            deltaPawns: deltaPawns
        };
    }
}
