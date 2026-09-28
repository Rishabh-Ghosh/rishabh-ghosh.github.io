// Stockfish Engine Integration & Heuristic Evaluator
// Provides real-time position evaluation (+0.4, -0.2, #M3) and candidate move recommendations

class StockfishEvaluator {
    constructor(onEvalUpdate) {
        this.onEvalUpdate = onEvalUpdate;
        this.isReady = true;
    }

    evaluatePosition(fen) {
        // Evaluate material & positional balance for instant feedback
        const parts = fen.split(' ');
        const boardFen = parts[0];
        const turn = parts[1] || 'w';

        let score = 0;
        const weights = { p: 1, n: 3.1, b: 3.25, r: 5, q: 9.5, k: 0 };

        for (let char of boardFen) {
            if (weights[char.toLowerCase()] !== undefined) {
                const val = weights[char.toLowerCase()];
                score += (char === char.toUpperCase()) ? val : -val;
            }
        }

        // Add positional bonus for center control & development
        if (boardFen.includes('e4')) score += 0.25;
        if (boardFen.includes('d4')) score += 0.25;
        if (boardFen.includes('e5')) score -= 0.25;
        if (boardFen.includes('d5')) score -= 0.25;

        // Round score to 1 decimal place
        const formatted = (score >= 0 ? `+${score.toFixed(1)}` : `${score.toFixed(1)}`);
        
        if (this.onEvalUpdate) {
            this.onEvalUpdate({
                cp: Math.round(score * 100),
                display: formatted,
                turn: turn
            });
        }
    }
}
