// Lightweight Chess Logic & FEN Parsing Engine
class MiniChessEngine {
    constructor(fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
        this.load(fen);
    }

    reset() {
        this.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    }

    load(fen, preserveHistory = false) {
        const parts = fen.split(' ');
        this.board = new Array(64).fill(null);
        
        const rows = parts[0].split('/');
        for (let r = 0; r < 8; r++) {
            let col = 0;
            for (let char of rows[r]) {
                if (!isNaN(char)) {
                    col += parseInt(char);
                } else {
                    const color = char === char.toUpperCase() ? 'w' : 'b';
                    const type = char.toLowerCase();
                    this.board[r * 8 + col] = { type, color };
                    col++;
                }
            }
        }
        this.turn = parts[1] || 'w';
        this.castling = parts[2] || 'KQkq';
        this.ep = parts[3] || '-';
        this.halfMoves = parseInt(parts[4] || '0');
        this.fullMoves = parseInt(parts[5] || '1');
        if (!preserveHistory) {
            this.history = [];
        }
    }

    getFen() {
        let fen = '';
        for (let r = 0; r < 8; r++) {
            let empty = 0;
            for (let c = 0; c < 8; c++) {
                const piece = this.board[r * 8 + c];
                if (!piece) {
                    empty++;
                } else {
                    if (empty > 0) {
                        fen += empty;
                        empty = 0;
                    }
                    fen += piece.color === 'w' ? piece.type.toUpperCase() : piece.type;
                }
            }
            if (empty > 0) fen += empty;
            if (r < 7) fen += '/';
        }
        return `${fen} ${this.turn} ${this.castling} ${this.ep} ${this.halfMoves} ${this.fullMoves}`;
    }

    getPiece(square) {
        const idx = this.squareToIdx(square);
        return this.board[idx];
    }

    squareToIdx(sq) {
        const col = sq.charCodeAt(0) - 97;
        const row = 8 - parseInt(sq[1]);
        return row * 8 + col;
    }

    idxToSquare(idx) {
        const col = String.fromCharCode(97 + (idx % 8));
        const row = 8 - Math.floor(idx / 8);
        return `${col}${row}`;
    }

    isSquareAttacked(sq, byColor) {
        const targetIdx = this.squareToIdx(sq);
        const tRow = Math.floor(targetIdx / 8);
        const tCol = targetIdx % 8;

        // Check pawn attacks
        const pDir = byColor === 'w' ? 1 : -1; // Pawns attack downwards (+1 row) if White, upwards (-1 row) if Black
        for (let dc of [-1, 1]) {
            const pR = tRow + pDir;
            const pC = tCol + dc;
            if (pR >= 0 && pR < 8 && pC >= 0 && pC < 8) {
                const p = this.board[pR * 8 + pC];
                if (p && p.color === byColor && p.type === 'p') return true;
            }
        }

        // Check knight attacks
        const nOffsets = [-17, -15, -10, -6, 6, 10, 15, 17];
        for (let off of nOffsets) {
            const nIdx = targetIdx + off;
            if (nIdx >= 0 && nIdx < 64) {
                const nR = Math.floor(nIdx / 8);
                const nC = nIdx % 8;
                if (Math.abs(nR - tRow) <= 2 && Math.abs(nC - tCol) <= 2) {
                    const p = this.board[nIdx];
                    if (p && p.color === byColor && p.type === 'n') return true;
                }
            }
        }

        // Check sliding attacks (Bishop, Rook, Queen, King)
        const dirs = [
            { dr: -1, dc: -1, diag: true }, { dr: -1, dc: 1, diag: true },
            { dr: 1, dc: -1, diag: true }, { dr: 1, dc: 1, diag: true },
            { dr: -1, dc: 0, diag: false }, { dr: 1, dc: 0, diag: false },
            { dr: 0, dc: -1, diag: false }, { dr: 0, dc: 1, diag: false }
        ];

        for (let d of dirs) {
            for (let step = 1; step < 8; step++) {
                const r = tRow + d.dr * step;
                const c = tCol + d.dc * step;
                if (r < 0 || r >= 8 || c < 0 || c >= 8) break;
                const p = this.board[r * 8 + c];
                if (p) {
                    if (p.color === byColor) {
                        if (d.diag && (p.type === 'b' || p.type === 'q')) return true;
                        if (!d.diag && (p.type === 'r' || p.type === 'q')) return true;
                        if (step === 1 && p.type === 'k') return true;
                    }
                    break; // Blocked by another piece
                }
            }
        }

        return false;
    }

    isInCheck(color) {
        // Find king square
        let kingSq = null;
        for (let i = 0; i < 64; i++) {
            const p = this.board[i];
            if (p && p.color === color && p.type === 'k') {
                kingSq = this.idxToSquare(i);
                break;
            }
        }
        if (!kingSq) return false;
        const enemyColor = color === 'w' ? 'b' : 'w';
        return this.isSquareAttacked(kingSq, enemyColor);
    }

    makeMove(fromSq, toSq, promotion = 'q') {
        const fromIdx = this.squareToIdx(fromSq);
        const toIdx = this.squareToIdx(toSq);
        const piece = this.board[fromIdx];

        if (!piece) return false;
        if (piece.color !== this.turn) return false;

        const fromRow = Math.floor(fromIdx / 8);
        const fromCol = fromIdx % 8;
        const toRow = Math.floor(toIdx / 8);
        const toCol = toIdx % 8;
        let captured = this.board[toIdx];

        // Handle En-Passant capture
        if (piece.type === 'p' && toSq === this.ep && fromCol !== toCol && !captured) {
            const epPawnIdx = fromRow * 8 + toCol;
            captured = this.board[epPawnIdx];
            this.board[epPawnIdx] = null;
        }

        // Move piece
        this.board[toIdx] = piece;
        this.board[fromIdx] = null;

        // Handle Pawn Promotion
        if (piece.type === 'p' && (toRow === 0 || toRow === 7)) {
            this.board[toIdx] = { type: promotion.toLowerCase(), color: piece.color };
        }

        // Handle Castling moves
        if (piece.type === 'k' && Math.abs(fromCol - toCol) === 2) {
            if (toSq === 'g1') { this.board[this.squareToIdx('f1')] = this.board[this.squareToIdx('h1')]; this.board[this.squareToIdx('h1')] = null; }
            if (toSq === 'c1') { this.board[this.squareToIdx('d1')] = this.board[this.squareToIdx('a1')]; this.board[this.squareToIdx('a1')] = null; }
            if (toSq === 'g8') { this.board[this.squareToIdx('f8')] = this.board[this.squareToIdx('h8')]; this.board[this.squareToIdx('h8')] = null; }
            if (toSq === 'c8') { this.board[this.squareToIdx('d8')] = this.board[this.squareToIdx('a8')]; this.board[this.squareToIdx('a8')] = null; }
        }

        // Update En-Passant square
        if (piece.type === 'p' && Math.abs(fromRow - toRow) === 2) {
            const epRow = (fromRow + toRow) / 2;
            this.ep = this.idxToSquare(epRow * 8 + fromCol);
        } else {
            this.ep = '-';
        }

        // Update Castling Rights
        if (piece.type === 'k') {
            if (piece.color === 'w') this.castling = this.castling.replace('K', '').replace('Q', '');
            else this.castling = this.castling.replace('k', '').replace('q', '');
        }
        if (fromSq === 'a1' || toSq === 'a1') this.castling = this.castling.replace('Q', '');
        if (fromSq === 'h1' || toSq === 'h1') this.castling = this.castling.replace('K', '');
        if (fromSq === 'a8' || toSq === 'a8') this.castling = this.castling.replace('q', '');
        if (fromSq === 'h8' || toSq === 'h8') this.castling = this.castling.replace('k', '');
        if (this.castling === '') this.castling = '-';

        // Check King safety after move
        if (this.isInCheck(piece.color)) {
            // Revert state if in check
            this.load(this.getFen(), true);
            return false;
        }

        this.history.push({ from: fromSq, to: toSq, piece, captured });
        this.turn = this.turn === 'w' ? 'b' : 'w';
        if (this.turn === 'w') this.fullMoves++;
        return true;
    }

    // Dynamic Legal Move Generator with King Safety & Full Rules Validation
    generateLegalMoves() {
        const legalMoves = [];
        const turn = this.turn;
        const isWhite = turn === 'w';
        const enemyColor = isWhite ? 'b' : 'w';

        for (let i = 0; i < 64; i++) {
            const piece = this.board[i];
            if (!piece || piece.color !== turn) continue;

            const fromSq = this.idxToSquare(i);
            const col = i % 8;
            const row = Math.floor(i / 8);
            const targets = [];

            if (piece.type === 'p') {
                const dir = isWhite ? -1 : 1;
                const startRow = isWhite ? 6 : 1;

                // 1-step forward
                const f1 = (row + dir) * 8 + col;
                if (f1 >= 0 && f1 < 64 && !this.board[f1]) {
                    targets.push(this.idxToSquare(f1));
                    // 2-step forward
                    const f2 = (row + 2 * dir) * 8 + col;
                    if (row === startRow && !this.board[f2]) {
                        targets.push(this.idxToSquare(f2));
                    }
                }

                // Normal & En-Passant Captures
                for (let dc of [-1, 1]) {
                    const cCol = col + dc;
                    if (cCol >= 0 && cCol < 8) {
                        const cIdx = (row + dir) * 8 + cCol;
                        if (cIdx >= 0 && cIdx < 64) {
                            const targetSq = this.idxToSquare(cIdx);
                            const targetPiece = this.board[cIdx];
                            if ((targetPiece && targetPiece.color !== turn) || targetSq === this.ep) {
                                targets.push(targetSq);
                            }
                        }
                    }
                }
            } else if (piece.type === 'n') {
                const nOffsets = [-17, -15, -10, -6, 6, 10, 15, 17];
                for (let off of nOffsets) {
                    const tIdx = i + off;
                    if (tIdx >= 0 && tIdx < 64) {
                        const tCol = tIdx % 8;
                        const tRow = Math.floor(tIdx / 8);
                        if (Math.abs(tCol - col) <= 2 && Math.abs(tRow - row) <= 2) {
                            const tPiece = this.board[tIdx];
                            if (!tPiece || tPiece.color !== turn) {
                                targets.push(this.idxToSquare(tIdx));
                            }
                        }
                    }
                }
            } else if (piece.type === 'b' || piece.type === 'r' || piece.type === 'q' || piece.type === 'k') {
                const dirs = [];
                if (piece.type === 'b' || piece.type === 'q') dirs.push([-1,-1], [-1,1], [1,-1], [1,1]);
                if (piece.type === 'r' || piece.type === 'q') dirs.push([-1,0], [1,0], [0,-1], [0,1]);
                if (piece.type === 'k') dirs.push([-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]);

                const maxSteps = piece.type === 'k' ? 1 : 7;
                for (let [dr, dc] of dirs) {
                    for (let step = 1; step <= maxSteps; step++) {
                        const r = row + dr * step;
                        const c = col + dc * step;
                        if (r < 0 || r >= 8 || c < 0 || c >= 8) break;
                        const tIdx = r * 8 + c;
                        const tPiece = this.board[tIdx];
                        if (!tPiece) {
                            targets.push(this.idxToSquare(tIdx));
                        } else {
                            if (tPiece.color !== turn) targets.push(this.idxToSquare(tIdx));
                            break;
                        }
                    }
                }

                // Castling Candidate Targets
                if (piece.type === 'k' && !this.isInCheck(turn)) {
                    if (isWhite) {
                        if (this.castling.includes('K') && !this.board[61] && !this.board[62] && !this.isSquareAttacked('f1', enemyColor) && !this.isSquareAttacked('g1', enemyColor)) {
                            targets.push('g1');
                        }
                        if (this.castling.includes('Q') && !this.board[59] && !this.board[58] && !this.board[57] && !this.isSquareAttacked('d1', enemyColor) && !this.isSquareAttacked('c1', enemyColor)) {
                            targets.push('c1');
                        }
                    } else {
                        if (this.castling.includes('k') && !this.board[5] && !this.board[6] && !this.isSquareAttacked('f8', enemyColor) && !this.isSquareAttacked('g8', enemyColor)) {
                            targets.push('g8');
                        }
                        if (this.castling.includes('q') && !this.board[3] && !this.board[2] && !this.board[1] && !this.isSquareAttacked('d8', enemyColor) && !this.isSquareAttacked('c8', enemyColor)) {
                            targets.push('c8');
                        }
                    }
                }
            }

            for (let toSq of targets) {
                const fenBackup = this.getFen();
                const historyBackup = [...this.history];
                
                const isCapture = !!this.board[this.squareToIdx(toSq)] || (piece.type === 'p' && toSq === this.ep);
                const isCastling = piece.type === 'k' && Math.abs(col - (toSq.charCodeAt(0) - 97)) === 2;

                const success = this.makeMove(fromSq, toSq);
                if (success) {
                    let sanStr = '';
                    if (isCastling) {
                        sanStr = toSq[0] === 'g' ? 'O-O' : 'O-O-O';
                    } else {
                        const pPrefix = piece.type === 'p' ? (fromSq[0] !== toSq[0] ? `${fromSq[0]}x` : '') : `${piece.type.toUpperCase()}${isCapture ? 'x' : ''}`;
                        const isPromo = piece.type === 'p' && (toSq[1] === '8' || toSq[1] === '1');
                        sanStr = `${pPrefix}${toSq}${isPromo ? '=Q' : ''}`;
                    }

                    legalMoves.push({ from: fromSq, to: toSq, san: sanStr });
                }

                // Restore state without wiping history
                this.load(fenBackup, true);
                this.history = historyBackup;
            }
        }
        return legalMoves;
    }
}
