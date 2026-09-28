// Fluid Chess.com-style Board UI Engine
class ChessBoardUI {
    constructor(containerId, onMoveCallback) {
        this.container = document.getElementById(containerId);
        this.onMoveCallback = onMoveCallback;
        this.selectedSquare = null;
        this.flipped = false;
        this.draggedSquare = null;
        this.renderBoard();
    }

    setFlipped(flipped) {
        this.flipped = flipped;
        this.renderBoard();
    }

    renderBoard(chessEngine, lastMove = null) {
        this.container.innerHTML = '';
        const boardTable = document.createElement('div');
        boardTable.className = 'chess-board-grid' + (this.flipped ? ' flipped' : '');

        const ranks = this.flipped ? [1,2,3,4,5,6,7,8] : [8,7,6,5,4,3,2,1];
        const files = this.flipped ? ['h','g','f','e','d','c','b','a'] : ['a','b','c','d','e','f','g','h'];

        for (let rIdx = 0; rIdx < 8; rIdx++) {
            for (let fIdx = 0; fIdx < 8; fIdx++) {
                const r = ranks[rIdx];
                const f = files[fIdx];
                const sq = `${f}${r}`;
                // Correct Chess Board Color Formula: a1 (f=a -> 0, r=1) 0+1=1 -> dark. a2 (0+2=2) -> light.
                const isLight = (f.charCodeAt(0) - 97 + r) % 2 === 0;

                const sqDiv = document.createElement('div');
                sqDiv.className = `square ${isLight ? 'light' : 'dark'}`;
                sqDiv.dataset.square = sq;

                // Rank & File notations (Chess.com style)
                if (fIdx === 0) {
                    const rankLabel = document.createElement('span');
                    rankLabel.className = 'coord rank-coord';
                    rankLabel.textContent = r;
                    sqDiv.appendChild(rankLabel);
                }
                if (rIdx === 7) {
                    const fileLabel = document.createElement('span');
                    fileLabel.className = 'coord file-coord';
                    fileLabel.textContent = f;
                    sqDiv.appendChild(fileLabel);
                }

                if (lastMove && (lastMove.from === sq || lastMove.to === sq)) {
                    sqDiv.classList.add('last-move');
                }

                if (this.selectedSquare === sq) {
                    sqDiv.classList.add('selected');
                }

                // Render Piece SVG
                if (chessEngine) {
                    const piece = chessEngine.getPiece(sq);
                    if (piece) {
                        const pieceWrapper = document.createElement('div');
                        pieceWrapper.className = 'piece-wrapper';
                        pieceWrapper.draggable = true;
                        const key = `${piece.color}${piece.type.toUpperCase()}`;
                        pieceWrapper.innerHTML = SVG_PIECES[key] || '';

                        // Drag handlers
                        pieceWrapper.ondragstart = (e) => {
                            if (chessEngine && piece.color !== chessEngine.turn) {
                                e.preventDefault();
                                return;
                            }
                            this.draggedSquare = sq;
                            e.dataTransfer.setData('text/plain', sq);
                            sqDiv.classList.add('selected');
                        };

                        pieceWrapper.ondragend = () => {
                            this.draggedSquare = null;
                            this.renderBoard(chessEngine, lastMove);
                        };

                        sqDiv.appendChild(pieceWrapper);
                    }
                }

                // Drag over / drop handlers
                sqDiv.ondragover = (e) => e.preventDefault();
                sqDiv.ondrop = (e) => {
                    e.preventDefault();
                    const fromSq = e.dataTransfer.getData('text/plain') || this.draggedSquare;
                    this.draggedSquare = null;
                    if (fromSq && fromSq !== sq) {
                        this.selectedSquare = null;
                        this.executeMove(fromSq, sq, chessEngine);
                    }
                };

                sqDiv.onclick = () => this.handleSquareClick(sq, chessEngine);
                boardTable.appendChild(sqDiv);
            }
        }
        this.container.appendChild(boardTable);
    }

    handleSquareClick(sq, chessEngine) {
        if (!chessEngine) return;
        const clickedPiece = chessEngine.getPiece(sq);

        if (!this.selectedSquare) {
            // Only allow selecting friendly pieces of current turn
            if (clickedPiece && clickedPiece.color === chessEngine.turn) {
                this.selectedSquare = sq;
                this.renderBoard(chessEngine);
            }
        } else {
            if (this.selectedSquare === sq) {
                this.selectedSquare = null;
                this.renderBoard(chessEngine);
            } else if (clickedPiece && clickedPiece.color === chessEngine.turn) {
                // Switch selection to another friendly piece
                this.selectedSquare = sq;
                this.renderBoard(chessEngine);
            } else {
                const from = this.selectedSquare;
                this.selectedSquare = null;
                this.executeMove(from, sq, chessEngine);
            }
        }
    }

    executeMove(fromSq, toSq, chessEngine) {
        const isCapture = chessEngine.getPiece(toSq) !== null;
        if (this.onMoveCallback) {
            const result = this.onMoveCallback(fromSq, toSq);
            if (result !== false) {
                if (isCapture) soundFX.playCaptureSound();
                else soundFX.playMoveSound();
            }
        }
    }
}
