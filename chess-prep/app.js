// Main Application Controller for Chess Opening Prep & Analyzer
let currentMode = 'theory'; // 'theory' or 'practice'
let currentOpeningKey = 'black_rossolimo';
let currentTreePointer = null;
let moveHistory = [];
let evalEnabled = true;
let userSide = 'black'; // 'white' or 'black'
let masterGames = [];

let chessEngine = null;
let evaluator = null;
let boardUI = null;

let fenHistory = [];
let treeHistory = [];
let currentFenIndex = 0;
let oppResponseTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    try {
        chessEngine = new MiniChessEngine();
        evaluator = new StockfishEngineController(updateEvalBar);
        boardUI = new ChessBoardUI('boardContainer', handleUserMove);

        initOpeningList();
        loadOpening(currentOpeningKey);
        setupControls();
        loadMasterGamesJSON();
    } catch (err) {
        console.error('Initialization error:', err);
    }
});

function clearOpponentTimer() {
    if (oppResponseTimer) {
        clearTimeout(oppResponseTimer);
        oppResponseTimer = null;
    }
}

function initOpeningList() {
    const container = document.getElementById('openingList');
    if (!container) return;
    container.innerHTML = '';
    for (let key in OPENINGS_DATA) {
        const item = OPENINGS_DATA[key];
        const div = document.createElement('div');
        div.className = `opening-item ${key === currentOpeningKey ? 'active' : ''}`;
        div.innerHTML = `<strong>${item.name}</strong> <span style="font-size: 11px; opacity: 0.7;">(${item.side.toUpperCase()})</span>`;
        div.onclick = () => loadOpening(key);
        container.appendChild(div);
    }
}

function loadOpening(key) {
    clearOpponentTimer();
    currentOpeningKey = key;
    const data = OPENINGS_DATA[key];
    if (!data) return;

    // Load starting FEN for opening setup position
    const startFen = data.fen || (data.tree ? data.tree.fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    chessEngine.load(startFen);
    
    userSide = data.side || 'black';
    boardUI.setFlipped(userSide === 'black');

    currentTreePointer = data.tree;
    moveHistory = [];
    fenHistory = [startFen];
    treeHistory = [data.tree];
    currentFenIndex = 0;

    document.getElementById('openingTitle').textContent = data.name;
    document.getElementById('commentaryBox').textContent = data.description;
    renderPlans(data.tree ? data.tree.plans : []);

    initOpeningList();
    updateUI();
}

function handleUserMove(fromSq, toSq) {
    clearOpponentTimer();
    // Ensure user only moves on their turn!
    const isUserTurn = (userSide === 'white' && chessEngine.turn === 'w') || (userSide === 'black' && chessEngine.turn === 'b');
    if (!isUserTurn) {
        return false;
    }

    const prevFen = chessEngine.getFen();

    // Check if move strictly matches theory tree (fromSq AND toSq matching)
    let match = null;
    if (currentTreePointer && currentTreePointer.children) {
        match = currentTreePointer.children.find(child => child.from === fromSq && child.to === toSq);
    }

    const success = chessEngine.makeMove(fromSq, toSq);
    if (!success) return false;

    const newFen = chessEngine.getFen();
    moveHistory.push({ from: fromSq, to: toSq, text: `${fromSq}-${toSq}` });

    // Check Engine Evaluation Delta (0.2 pawn threshold)
    let isAcceptableMove = false;
    let evalDeltaInfo = null;
    if (evaluator && typeof evaluator.evaluateUserMoveDelta === 'function') {
        evalDeltaInfo = evaluator.evaluateUserMoveDelta(prevFen, newFen);
        if (evalDeltaInfo.isAcceptable) {
            isAcceptableMove = true;
        }
    }

    if (match || isAcceptableMove) {
        if (match) {
            currentTreePointer = match;
        } else {
            // Dynamic branching node for custom moves!
            currentTreePointer = {
                from: fromSq,
                to: toSq,
                san: `${fromSq}-${toSq}`,
                comment: "Custom good move! Dynamically generating opponent responses...",
                children: []
            };
        }
        
        const deltaText = evalDeltaInfo ? ` (Delta: ${evalDeltaInfo.deltaPawns} pawns)` : '';
        setFeedback(`🟢 GOOD MOVE!${deltaText}`, match ? (match.comment || "Solid repertoire theory move.") : "Within 0.20 pawns of engine top move.", 'green');
        if (match) renderPlans(match.plans || []);

        // Schedule automatic opponent response safely!
        oppResponseTimer = setTimeout(makeOpponentResponse, 450);
    } else {
        const deltaText = evalDeltaInfo ? ` (-${evalDeltaInfo.deltaPawns} pawns from top move)` : '';
        const expected = (currentTreePointer && currentTreePointer.children && currentTreePointer.children[0]) ? currentTreePointer.children[0].san : 'main line';
        setFeedback(`🔴 INACCURACY!${deltaText}`, `Lost more than 0.20 pawns in evaluation. Recommended move: ${expected}.`, 'red');
    }

    updateUI();
    return true;
}

// Generate Opponent Candidates On-The-Fly (Dynamic Tree Expansion)
function generateDynamicOpponentCandidates() {
    if (!chessEngine || typeof chessEngine.generateLegalMoves !== 'function') return [];

    const legalMoves = chessEngine.generateLegalMoves();
    if (!legalMoves || !legalMoves.length) return [];

    const candidates = [];
    
    // 1. Solid / Main line candidate
    const mainMove = legalMoves[0];
    candidates.push({
        from: mainMove.from,
        to: mainMove.to,
        san: mainMove.san,
        comment: `Dynamic Engine Line: Opponent plays ${mainMove.san}. Solid development.`
    });

    // 2. Sub-optimal candidate (for capitalizing practice!)
    if (legalMoves.length > 1) {
        const subOptIdx = Math.floor(legalMoves.length / 2);
        const subOptMove = legalMoves[subOptIdx];
        candidates.push({
            from: subOptMove.from,
            to: subOptMove.to,
            san: subOptMove.san,
            comment: `⚠️ DYNAMIC SUB-OPTIMAL MOVE (${subOptMove.san}): Passive placement! Capitalize by seizing central control!`,
            plans: ["Capitalize on passive move", "Seize central control", "Develop active pieces"]
        });
    }

    // 3. Poor candidate move (blunder / structural mistake)
    if (legalMoves.length > 2) {
        const poorMove = legalMoves[legalMoves.length - 1];
        candidates.push({
            from: poorMove.from,
            to: poorMove.to,
            san: poorMove.san,
            comment: `🔴 DYNAMIC POOR MOVE (${poorMove.san}): Weakens opponent structure! Capitalize by striking at the target!`,
            plans: ["Exploit structural weakness", "Punish unprovoked move"]
        });
    }

    if (currentTreePointer) {
        currentTreePointer.children = candidates;
    }

    return candidates;
}

function makeOpponentResponse(specificChildIndex = -1) {
    if (!currentTreePointer) return;

    // Dynamically generate candidate moves if no static tree children exist!
    if (!currentTreePointer.children || !currentTreePointer.children.length) {
        generateDynamicOpponentCandidates();
    }

    if (!currentTreePointer.children || !currentTreePointer.children.length) {
        renderCandidates([]);
        return;
    }

    renderCandidates(currentTreePointer.children);

    // Pick candidate or randomly sample from candidate moves (main line vs poor moves)
    let chosenIdx = specificChildIndex;
    if (chosenIdx < 0 || chosenIdx >= currentTreePointer.children.length) {
        chosenIdx = Math.floor(Math.random() * currentTreePointer.children.length);
    }

    const oppChild = currentTreePointer.children[chosenIdx];
    if (!oppChild) return;

    if (oppChild.from && oppChild.to) {
        chessEngine.makeMove(oppChild.from, oppChild.to);
    }

    currentTreePointer = oppChild;
    moveHistory.push({ from: oppChild.from, to: oppChild.to, text: `opp-${oppChild.san}` });

    if (typeof soundFX !== 'undefined') soundFX.playMoveSound();
    document.getElementById('commentaryBox').textContent = oppChild.comment || `Opponent played ${oppChild.san}. Your move!`;
    renderPlans(oppChild.plans || []);
    updateUI();
}

function renderCandidates(children) {
    const card = document.getElementById('candidatesCard');
    const list = document.getElementById('candidatesList');
    if (!card || !list) return;

    list.innerHTML = '';

    if (!children || children.length <= 1) {
        card.style.display = 'none';
        return;
    }

    card.style.display = 'block';
    children.forEach((child, idx) => {
        const btn = document.createElement('div');
        btn.className = 'opening-item';
        const isPoor = child.comment && (child.comment.includes('🔴') || child.comment.includes('⚠️') || child.comment.includes('POOR') || child.comment.includes('SUB-OPTIMAL'));
        btn.innerHTML = `<strong>${child.san}</strong> <span style="font-size: 11px; opacity: 0.85; color: ${isPoor ? '#e74c3c' : '#2ecc71'};">(${isPoor ? 'Mistake Line' : 'Main Line'})</span>`;
        btn.onclick = () => makeOpponentResponse(idx);
        list.appendChild(btn);
    });
}

function setFeedback(title, desc, color) {
    const card = document.getElementById('practiceFeedbackCard');
    const box = document.getElementById('practiceFeedback');
    if (!card || !box) return;
    card.style.display = 'block';
    box.innerHTML = `<strong style="color: var(--cc-${color === 'green' ? 'green' : 'red'}); font-size: 14px;">${title}</strong><p style="margin-top: 4px; color: var(--cc-text-primary);">${desc}</p>`;
}

function updateUI(recordFen = true) {
    if (boardUI && chessEngine) {
        const lastMoveObj = moveHistory.length ? moveHistory[moveHistory.length - 1] : null;
        boardUI.renderBoard(chessEngine, lastMoveObj);
    }
    updateMoveHistoryBox();

    if (recordFen && chessEngine) {
        const currentFen = chessEngine.getFen();
        if (fenHistory[currentFenIndex] !== currentFen) {
            if (currentFenIndex < fenHistory.length - 1) {
                fenHistory = fenHistory.slice(0, currentFenIndex + 1);
                treeHistory = treeHistory.slice(0, currentFenIndex + 1);
            }
            fenHistory.push(currentFen);
            treeHistory.push(currentTreePointer);
            currentFenIndex = fenHistory.length - 1;
        }
    }

    if (evalEnabled && evaluator && chessEngine) {
        evaluator.evaluatePosition(chessEngine.getFen());
    }
}

function updateEvalBar(evalData) {
    const textBadge = document.getElementById('evalText');
    const fill = document.getElementById('evalBarFill');
    if (!textBadge || !fill) return;

    textBadge.textContent = evalData.display;
    const cp = Math.max(-1000, Math.min(1000, evalData.cp));
    const pct = 50 + (cp / 1000) * 45;
    fill.style.height = `${pct}%`;
}

function renderPlans(plans) {
    const list = document.getElementById('plansList');
    if (!list) return;
    list.innerHTML = '';
    if (plans && plans.length) {
        plans.forEach(plan => {
            const li = document.createElement('li');
            li.textContent = `🎯 ${plan}`;
            list.appendChild(li);
        });
    }
}

function updateMoveHistoryBox() {
    const box = document.getElementById('moveHistoryBox');
    if (!box) return;
    box.innerHTML = '';
    if (!moveHistory.length) {
        box.innerHTML = '<span class="move-chip">Start of Game</span>';
        return;
    }
    moveHistory.forEach((m) => {
        const chip = document.createElement('span');
        chip.className = 'move-chip';
        chip.textContent = typeof m === 'string' ? m : (m.text || `${m.from}-${m.to}`);
        box.appendChild(chip);
    });
}

async function loadMasterGamesJSON() {
    try {
        const res = await fetch('master_games.json');
        masterGames = await res.json();
        renderMasterGamesList(masterGames);
    } catch (err) {
        console.warn('Failed to load master_games.json', err);
    }
}

function renderMasterGamesList(games) {
    const list = document.getElementById('masterGamesList');
    if (!list) return;
    list.innerHTML = '';
    games.slice(0, 50).forEach(g => {
        const item = document.createElement('div');
        item.className = 'opening-item';
        item.innerHTML = `<div><strong>${g.white} vs ${g.black}</strong><div style="font-size: 11px; opacity: 0.7;">${g.opening} (${g.year}) - ${g.result}</div></div>`;
        item.onclick = () => replayMasterGame(g);
        list.appendChild(item);
    });
}

function replayMasterGame(game) {
    clearOpponentTimer();
    chessEngine.reset();
    moveHistory = [];
    currentTreePointer = null;
    document.getElementById('openingTitle').textContent = `${game.white} vs ${game.black} (${game.year})`;
    document.getElementById('commentaryBox').textContent = game.notes || `Event: ${game.event}. Opening: ${game.opening}. Result: ${game.result}`;
    renderPlans([`White ELO: ${game.white_elo || 'N/A'}`, `Black ELO: ${game.black_elo || 'N/A'}`, `Result: ${game.result}`]);

    if (game.moves) {
        game.moves.forEach((sanMove, idx) => {
            moveHistory.push({ from: '', to: '', text: `${idx + 1}. ${sanMove}` });
        });
    }
    updateUI();
}

function exportRepertoireJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(OPENINGS_DATA, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "chess_opening_repertoire.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function startDrill() {
    clearOpponentTimer();
    loadOpening(currentOpeningKey);
    setFeedback('▶ DRILL STARTED!', `Training ${userSide.toUpperCase()} repertoire. Play your prepped move!`, 'green');
    
    // Trigger computer response if computer turn
    const isCompTurn = (userSide === 'black' && chessEngine.turn === 'w') || (userSide === 'white' && chessEngine.turn === 'b');
    if (isCompTurn) {
        oppResponseTimer = setTimeout(makeOpponentResponse, 400);
    }
}

function stepPrevMove() {
    clearOpponentTimer();
    if (currentFenIndex > 0) {
        currentFenIndex--;
        chessEngine.load(fenHistory[currentFenIndex]);
        if (treeHistory[currentFenIndex]) {
            currentTreePointer = treeHistory[currentFenIndex];
        }
        if (typeof soundFX !== 'undefined') soundFX.playMoveSound();
        updateUI(false);
    }
}

function stepNextMove() {
    clearOpponentTimer();
    if (currentFenIndex < fenHistory.length - 1) {
        currentFenIndex++;
        chessEngine.load(fenHistory[currentFenIndex]);
        if (treeHistory[currentFenIndex]) {
            currentTreePointer = treeHistory[currentFenIndex];
        }
        if (typeof soundFX !== 'undefined') soundFX.playMoveSound();
        updateUI(false);
    }
}

function setupControls() {
    document.getElementById('startDrillBtn').onclick = startDrill;
    document.getElementById('prevMoveBtn').onclick = stepPrevMove;
    document.getElementById('nextMoveBtn').onclick = stepNextMove;

    document.getElementById('modeTheoryBtn').onclick = () => setMode('theory');
    document.getElementById('modePracticeBtn').onclick = () => setMode('practice');
    document.getElementById('resetLineBtn').onclick = () => loadOpening(currentOpeningKey);
    document.getElementById('flipBoardBtn').onclick = () => {
        boardUI.setFlipped(!boardUI.flipped);
    };
    document.getElementById('toggleEvalBtn').onclick = () => {
        evalEnabled = !evalEnabled;
        document.getElementById('toggleEvalBtn').textContent = `⚡ Engine Eval: ${evalEnabled ? 'ON' : 'OFF'}`;
    };
    document.getElementById('exportJsonBtn').onclick = exportRepertoireJSON;
    
    const fileInput = document.getElementById('jsonFileInput');
    document.getElementById('importJsonBtn').onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const parsed = JSON.parse(evt.target.result);
                if (Array.isArray(parsed)) {
                    masterGames = parsed;
                    renderMasterGamesList(masterGames);
                    alert(`Loaded ${parsed.length} custom games from JSON!`);
                } else if (typeof parsed === 'object') {
                    Object.assign(OPENINGS_DATA, parsed);
                    initOpeningList();
                    const firstKey = Object.keys(parsed)[0];
                    if (firstKey) loadOpening(firstKey);
                    alert('Loaded custom JSON repertoire!');
                }
            } catch (err) {
                alert('Invalid JSON file format: ' + err.message);
            }
        };
        reader.readAsText(file);
    };

    // Keyboard Arrow Keys Navigation
    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            stepPrevMove();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            stepNextMove();
        }
    });
}

function setMode(mode) {
    currentMode = mode;
    document.getElementById('modeTheoryBtn').classList.toggle('active', mode === 'theory');
    document.getElementById('modePracticeBtn').classList.toggle('active', mode === 'practice');
}
