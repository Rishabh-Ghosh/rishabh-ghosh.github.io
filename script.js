/**
 * Minimalist Mandelbrot Set Trace, Dotted Lattice & Interactive Orbit Renderer
 * Features:
 * - Dotted Mandelbrot lattice background with mouse proximity lighting
 * - Smooth interactive orbit lines z_{n+1} = z_n^2 + c
 * - Multi-orbit fractal bloom on link hover
 * - Realistic 3D Orthographic Spinning Globe Widget
 * - Airplane flight animation across the lattice when hovering over the globe
 * - Conway's Game of Life cellular automata unfolding on the lattice when hovering over "Math + Bio"
 * - IMC Order Book Imbalance (OBI) liquidity animation on IMC hover
 * - Real-time randomized Gradient Boosted Decision Tree (GBDT) splitting animation on Jane Street hover
 * - Xantium Mothership & Scout Ship spinout launch animation on Xantium hover
 */

(function () {
    const canvas = document.getElementById('mandelbrot-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const nameLink = document.getElementById('linkedin-link');
    const mathBioHover = document.getElementById('math-bio-hover');
    const imcHover = document.getElementById('imc-hover');
    const janeStreetHover = document.getElementById('jane-street-hover');
    const xantiumHover = document.getElementById('xantium-hover');

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const bounds = {
        minReal: -2.15,
        maxReal: 0.95,
        minImag: -1.2,
        maxImag: 1.2
    };

    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let isHoveringName = false;
    let isHoveringGlobe = false;
    let isHoveringMathBio = false;
    let isHoveringIMC = false;
    let isHoveringJaneStreet = false;
    let isHoveringXantium = false;
    let isMouseOnScreen = false;
    let time = 0;

    let orbitHistory = [];
    const maxTrailHistory = 15;

    let latticePoints = [];

    // Conway's Game of Life state
    let gridCols = 130;
    let gridRows = 80;
    let lifeGrid = [];
    let nextLifeGrid = [];
    let lifeGridMap = [];
    let isLifeActive = false;
    let lifeFrameCounter = 0;

    // Dynamic GBDT Tree Splitting state
    let gbdtNodes = [];
    let gbdtBranches = [];
    let gbdtSplitTimer = 0;

    // Xantium Mothership & Scout Ship state
    let xantiumShip = {
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        angle: 0,
        trail: []
    };

    // Airplane flight state
    let plane = {
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        angle: 0,
        trail: []
    };

    function spawnPlane() {
        plane.active = true;
        plane.x = 45;
        plane.y = height - 45;

        const targetX = width + 80;
        const targetY = height * 0.15 + (Math.random() * 0.2 - 0.1) * height;
        const dx = targetX - plane.x;
        const dy = targetY - plane.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = 4.2;

        plane.vx = (dx / dist) * speed;
        plane.vy = (dy / dist) * speed;
        plane.angle = Math.atan2(plane.vy, plane.vx);
        plane.trail = [];
    }

    function spawnXantiumShip() {
        const msX = width * 0.32;
        const msY = height * 0.48;

        xantiumShip.active = true;
        xantiumShip.x = msX + 15;
        xantiumShip.y = msY;

        const targetX = width * 0.78;
        const targetY = height * 0.25;
        const dx = targetX - xantiumShip.x;
        const dy = targetY - xantiumShip.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = 3.2;

        xantiumShip.vx = (dx / dist) * speed;
        xantiumShip.vy = (dy / dist) * speed;
        xantiumShip.angle = Math.atan2(xantiumShip.vy, xantiumShip.vx);
        xantiumShip.trail = [];
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const aspect = width / height;
        const realRange = (bounds.maxImag - bounds.minImag) * aspect;
        const realCenter = -0.6;
        bounds.minReal = realCenter - realRange / 2;
        bounds.maxReal = realCenter + realRange / 2;

        generateLattice();
    }

    function screenToComplex(sx, sy) {
        const real = bounds.minReal + (sx / width) * (bounds.maxReal - bounds.minReal);
        const imag = bounds.minImag + (sy / height) * (bounds.maxImag - bounds.minImag);
        return { real, imag };
    }

    function complexToScreen(real, imag) {
        const sx = ((real - bounds.minReal) / (bounds.maxReal - bounds.minReal)) * width;
        const sy = ((imag - bounds.minImag) / (bounds.maxImag - bounds.minImag)) * height;
        return { sx, sy };
    }

    function generateLattice() {
        latticePoints = [];
        gridCols = 130;
        gridRows = Math.floor(gridCols / (width / height));
        const maxIter = 40;

        lifeGrid = Array(gridCols).fill(0).map(() => Array(gridRows).fill(0));
        nextLifeGrid = Array(gridCols).fill(0).map(() => Array(gridRows).fill(0));
        lifeGridMap = Array(gridCols).fill(null).map(() => Array(gridRows).fill(null));

        for (let i = 0; i < gridCols; i++) {
            for (let j = 0; j < gridRows; j++) {
                const sx = (i / gridCols) * width;
                const sy = (j / gridRows) * height;
                const c = screenToComplex(sx, sy);

                let zReal = 0;
                let zImag = 0;
                let iter = 0;

                while (zReal * zReal + zImag * zImag <= 4 && iter < maxIter) {
                    const nextReal = zReal * zReal - zImag * zImag + c.real;
                    const nextImag = 2 * zReal * zImag + c.imag;
                    zReal = nextReal;
                    zImag = nextImag;
                    iter++;
                }

                if (iter > 5) {
                    const pt = {
                        gridI: i,
                        gridJ: j,
                        x: sx,
                        y: sy,
                        iter: iter,
                        normIter: iter / maxIter,
                        baseRadius: iter === maxIter ? 1.0 : (iter > 15 ? 1.3 : 0.9)
                    };
                    latticePoints.push(pt);
                    lifeGridMap[i][j] = pt;
                }
            }
        }
    }

    function initDynamicTree() {
        gbdtNodes = [
            { id: 0, depth: 0, x: width * 0.5, y: height * 0.15, isLeaf: true, birthTime: time }
        ];
        gbdtBranches = [];
        gbdtSplitTimer = 0;
    }

    function stepDynamicTreeSplit() {
        const eligibleLeafs = gbdtNodes.filter(n => n.isLeaf && n.depth < 3);
        if (eligibleLeafs.length === 0) return false;

        const parent = eligibleLeafs[Math.floor(Math.random() * eligibleLeafs.length)];
        parent.isLeaf = false;

        const depth = parent.depth + 1;
        const spread = (width * 0.32) / Math.pow(1.75, depth) + (Math.random() * 16 - 8);
        const yGap = height * 0.18 + (Math.random() * 12 - 6);

        const childLeft = {
            id: gbdtNodes.length,
            depth: depth,
            x: Math.max(width * 0.08, parent.x - spread),
            y: parent.y + yGap,
            isLeaf: true,
            birthTime: time
        };

        const childRight = {
            id: gbdtNodes.length + 1,
            depth: depth,
            x: Math.min(width * 0.92, parent.x + spread),
            y: parent.y + yGap,
            isLeaf: true,
            birthTime: time
        };

        gbdtNodes.push(childLeft, childRight);
        gbdtBranches.push({ x1: parent.x, y1: parent.y, x2: childLeft.x, y2: childLeft.y, progress: 0 });
        gbdtBranches.push({ x1: parent.x, y1: parent.y, x2: childRight.x, y2: childRight.y, progress: 0 });

        return true;
    }

    function seedGameOfLife() {
        for (let i = 0; i < gridCols; i++) {
            for (let j = 0; j < gridRows; j++) {
                const pt = lifeGridMap[i][j];
                if (pt && pt.iter > 7 && pt.iter < 39 && Math.random() < 0.28) {
                    lifeGrid[i][j] = 1;
                } else {
                    lifeGrid[i][j] = 0;
                }
            }
        }

        const glider = [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
        glider.forEach(([di, dj]) => {
            const i = 15 + di;
            const j = 15 + dj;
            if (i < gridCols && j < gridRows) lifeGrid[i][j] = 1;
        });

        glider.forEach(([di, dj]) => {
            const i = Math.floor(gridCols / 2) + di;
            const j = Math.floor(gridRows / 2) + dj;
            if (i < gridCols && j < gridRows) lifeGrid[i][j] = 1;
        });

        isLifeActive = true;
    }

    function stepGameOfLife() {
        for (let i = 0; i < gridCols; i++) {
            for (let j = 0; j < gridRows; j++) {
                let neighbors = 0;

                for (let di = -1; di <= 1; di++) {
                    for (let dj = -1; dj <= 1; dj++) {
                        if (di === 0 && dj === 0) continue;
                        const ni = (i + di + gridCols) % gridCols;
                        const nj = (j + dj + gridRows) % gridRows;
                        if (lifeGrid[ni][nj] > 0) neighbors++;
                    }
                }

                const current = lifeGrid[i][j];
                if (current > 0) {
                    nextLifeGrid[i][j] = (neighbors === 2 || neighbors === 3) ? Math.min(current + 1, 8) : 0;
                } else {
                    nextLifeGrid[i][j] = (neighbors === 3) ? 1 : 0;
                }
            }
        }

        for (let i = 0; i < gridCols; i++) {
            for (let j = 0; j < gridRows; j++) {
                lifeGrid[i][j] = nextLifeGrid[i][j];
            }
        }
    }

    function computeOrbit(cReal, cImag, maxSteps = 35) {
        const orbit = [];
        let zReal = 0;
        let zImag = 0;

        orbit.push(complexToScreen(zReal, zImag));

        for (let i = 0; i < maxSteps; i++) {
            const nextReal = zReal * zReal - zImag * zImag + cReal;
            const nextImag = 2 * zReal * zImag + cImag;
            zReal = nextReal;
            zImag = nextImag;

            const pt = complexToScreen(zReal, zImag);
            orbit.push(pt);

            if (zReal * zReal + zImag * zImag > 16) break;
        }

        return orbit;
    }

    const keyComplexPoints = [
        { real: -0.7269, imag: 0.1889 },
        { real: -0.123, imag: 0.745 },
        { real: -0.75, imag: 0.1 },
        { real: 0.355, imag: 0.355 },
        { real: -1.25, imag: 0.0 }
    ];

    function getColors() {
        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
            return {
                boundaryBaseAlpha: 0.12,
                boundaryColor: (a) => `rgba(240, 240, 235, ${a})`,
                lifeColor: (a) => `rgba(180, 240, 210, ${a})`,
                bidColor: (a) => `rgba(180, 240, 210, ${a})`,
                askColor: (a) => `rgba(240, 240, 235, ${a})`,
                matchColor: (a) => `rgba(180, 240, 210, ${a})`,
                linePrimary: 'rgba(240, 240, 235, 0.42)',
                lineSecondary: 'rgba(180, 210, 255, 0.22)',
                node: 'rgba(255, 255, 255, 0.65)'
            };
        } else {
            return {
                boundaryBaseAlpha: 0.1,
                boundaryColor: (a) => `rgba(20, 20, 20, ${a})`,
                lifeColor: (a) => `rgba(20, 140, 90, ${a})`,
                bidColor: (a) => `rgba(20, 140, 90, ${a})`,
                askColor: (a) => `rgba(20, 20, 20, ${a})`,
                matchColor: (a) => `rgba(20, 140, 90, ${a})`,
                linePrimary: 'rgba(20, 20, 20, 0.38)',
                lineSecondary: 'rgba(60, 90, 140, 0.18)',
                node: 'rgba(20, 20, 20, 0.6)'
            };
        }
    }

    function distToSegment(px, py, x1, y1, x2, y2) {
        const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        if (l2 === 0) return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
        let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));
        const projX = x1 + t * (x2 - x1);
        const projY = y1 + t * (y2 - y1);
        return Math.sqrt((px - projX) * (px - projX) + (py - projY) * (py - projY));
    }

    function render() {
        time += 0.005;
        const colors = getColors();

        mouseX += (targetMouseX - mouseX) * 0.03;
        mouseY += (targetMouseY - mouseY) * 0.03;

        ctx.clearRect(0, 0, width, height);

        // Handle Game of Life Trigger on Math + Bio hover
        if (isHoveringMathBio) {
            if (!isLifeActive) {
                seedGameOfLife();
            }
            lifeFrameCounter++;
            if (lifeFrameCounter % 6 === 0) {
                stepGameOfLife();
            }
        }

        // Handle Jane Street Dynamic Tree Splitting Trigger
        if (isHoveringJaneStreet) {
            if (gbdtNodes.length === 0) {
                initDynamicTree();
            }

            gbdtSplitTimer++;
            if (gbdtSplitTimer % 48 === 0) {
                const didSplit = stepDynamicTreeSplit();
                if (!didSplit && gbdtSplitTimer > 320) {
                    initDynamicTree();
                }
            }

            gbdtBranches.forEach(b => {
                if (b.progress < 1.0) b.progress = Math.min(1.0, b.progress + 0.04);
            });
        }

        // Handle Xantium Mothership & Scout Ship Trigger
        if (isHoveringXantium && !xantiumShip.active) {
            spawnXantiumShip();
        }

        if (xantiumShip.active) {
            xantiumShip.x += xantiumShip.vx;
            xantiumShip.y += xantiumShip.vy;
            xantiumShip.vy += Math.sin(time * 2) * 0.02;
            xantiumShip.angle = Math.atan2(xantiumShip.vy, xantiumShip.vx);

            xantiumShip.trail.push({ x: xantiumShip.x, y: xantiumShip.y });
            if (xantiumShip.trail.length > 35) xantiumShip.trail.shift();

            if (xantiumShip.x > width * 0.85 || xantiumShip.y < height * 0.1) {
                xantiumShip.active = false;
                if (isHoveringXantium) spawnXantiumShip();
            }
        }

        // Handle Globe Hover Airplane trigger
        if (isHoveringGlobe && !plane.active) {
            spawnPlane();
        }

        // Update Airplane Position if active
        if (plane.active) {
            plane.x += plane.vx;
            plane.y += plane.vy;
            plane.vy += Math.sin(time * 3) * 0.03;
            plane.angle = Math.atan2(plane.vy, plane.vx);

            plane.trail.push({ x: plane.x, y: plane.y });
            if (plane.trail.length > 45) plane.trail.shift();

            if (plane.x > width + 70 || plane.y < -70 || plane.y > height + 70) {
                plane.active = false;
                if (isHoveringGlobe) spawnPlane();
            }
        }

        // 1. Draw Dotted Mandelbrot Lattice with Interactive Modes
        const glowRadius = 220;
        const planeGlowRadius = 150;

        const midX = (width / 2) + Math.sin(time * 3.5) * 80 + Math.sin(time * 7) * 25;
        const obiRatio = Math.sin(time * 2.8);

        const msX = width * 0.32;
        const msY = height * 0.48;

        for (let i = 0; i < latticePoints.length; i++) {
            const pt = latticePoints[i];

            if (isHoveringXantium) {
                // XANTIUM MOTHERSHIP & SCOUT SHIP SPINOUT ANIMATION
                let isMothershipNode = false;
                let isScoutShipProximity = false;

                // Check Mothership Hull Region
                const dMS = Math.hypot(pt.x - msX, pt.y - msY);
                if (dMS < 38) {
                    isMothershipNode = true;
                }

                // Check Scout Ship Proximity
                if (xantiumShip.active) {
                    if (Math.hypot(pt.x - xantiumShip.x, pt.y - xantiumShip.y) < 22) {
                        isScoutShipProximity = true;
                    }
                }

                if (isScoutShipProximity) {
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pt.baseRadius * 2.2, 0, Math.PI * 2);
                    ctx.fillStyle = colors.lifeColor(0.85);
                    ctx.fill();
                } else if (isMothershipNode) {
                    const pulse = Math.sin(time * 3 + pt.x * 0.02) * 0.5 + 0.5;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pt.baseRadius * 1.6, 0, Math.PI * 2);
                    ctx.fillStyle = colors.lifeColor(0.40 + pulse * 0.15);
                    ctx.fill();
                } else {
                    const alpha = colors.boundaryBaseAlpha * 0.7;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pt.baseRadius, 0, Math.PI * 2);
                    ctx.fillStyle = colors.boundaryColor(alpha);
                    ctx.fill();
                }
            } else if (isHoveringJaneStreet) {
                // JANE STREET GBDT TREE SPLITTING ANIMATION
                let isTreeNode = false;
                let isTreeBranch = false;
                let isLeafNode = false;

                for (let n = 0; n < gbdtNodes.length; n++) {
                    const node = gbdtNodes[n];
                    const dNode = Math.hypot(pt.x - node.x, pt.y - node.y);
                    if (dNode < 28) {
                        isTreeNode = true;
                        if (node.isLeaf) isLeafNode = true;
                    }
                }

                if (!isTreeNode) {
                    for (let b = 0; b < gbdtBranches.length; b++) {
                        const br = gbdtBranches[b];
                        const currX2 = br.x1 + (br.x2 - br.x1) * br.progress;
                        const currY2 = br.y1 + (br.y2 - br.y1) * br.progress;

                        if (distToSegment(pt.x, pt.y, br.x1, br.y1, currX2, currY2) < 16) {
                            isTreeBranch = true;
                        }
                    }
                }

                if (isLeafNode) {
                    const pulse = Math.sin(time * 6 + pt.x * 0.05) * 0.5 + 0.5;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pt.baseRadius * 1.8, 0, Math.PI * 2);
                    ctx.fillStyle = colors.lifeColor(0.40 + pulse * 0.15);
                    ctx.fill();
                } else if (isTreeNode) {
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pt.baseRadius * 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = colors.lifeColor(0.32);
                    ctx.fill();
                } else if (isTreeBranch) {
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pt.baseRadius * 1.2, 0, Math.PI * 2);
                    ctx.fillStyle = colors.lifeColor(0.18);
                    ctx.fill();
                } else {
                    const alpha = colors.boundaryBaseAlpha * 0.7;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pt.baseRadius, 0, Math.PI * 2);
                    ctx.fillStyle = colors.boundaryColor(alpha);
                    ctx.fill();
                }
            } else if (isHoveringIMC) {
                // IMC ORDER BOOK IMBALANCE (OBI)
                const distX = pt.x - midX;
                const absDistX = Math.abs(distX);
                const normDepth = absDistX / (width * 0.45);

                if (absDistX < 20) {
                    const flash = Math.sin(time * 16 + pt.y * 0.08) * 0.5 + 0.5;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pt.baseRadius * 1.6, 0, Math.PI * 2);
                    ctx.fillStyle = colors.matchColor(0.28 + flash * 0.12);
                    ctx.fill();
                } else if (distX < 0) {
                    const wave = Math.sin(normDepth * 16 - time * 5) * 0.5 + 0.5;
                    const obiBoost = obiRatio > 0 ? obiRatio * 0.12 : 0;
                    const alpha = Math.min(0.45, 0.06 + wave * 0.18 + obiBoost);

                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pt.baseRadius * 1.3, 0, Math.PI * 2);
                    ctx.fillStyle = colors.bidColor(alpha);
                    ctx.fill();
                } else {
                    const wave = Math.sin(normDepth * 16 - time * 5) * 0.5 + 0.5;
                    const obiBoost = obiRatio < 0 ? -obiRatio * 0.12 : 0;
                    const alpha = Math.min(0.45, 0.06 + wave * 0.18 + obiBoost);

                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pt.baseRadius * 1.3, 0, Math.PI * 2);
                    ctx.fillStyle = colors.askColor(alpha);
                    ctx.fill();
                }
            } else {
                // STANDARD LATTICE / GAME OF LIFE / MOUSE PROXIMITY
                let proximity = 0;
                if (isMouseOnScreen && !isHoveringGlobe && !isHoveringMathBio) {
                    const dx = mouseX - pt.x;
                    const dy = mouseY - pt.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < glowRadius) {
                        proximity = Math.pow(1 - dist / glowRadius, 2);
                    }
                }

                let planeProximity = 0;
                if (plane.active) {
                    const pdx = plane.x - pt.x;
                    const pdy = plane.y - pt.y;
                    const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
                    if (pdist < planeGlowRadius) {
                        planeProximity = Math.pow(1 - pdist / planeGlowRadius, 2);
                    }
                }

                const lifeState = (isLifeActive && pt.gridI < gridCols && pt.gridJ < gridRows) ? lifeGrid[pt.gridI][pt.gridJ] : 0;

                const pulse = Math.sin(time * 1.5 + pt.x * 0.008 + pt.y * 0.008) * 0.5 + 0.5;
                const combinedBoost = proximity + planeProximity * 1.6;

                if (lifeState > 0) {
                    const lifeAlpha = Math.min(0.95, 0.55 + (lifeState * 0.08));
                    const lifeRadius = pt.baseRadius * 2.2;

                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, lifeRadius, 0, Math.PI * 2);
                    ctx.fillStyle = colors.lifeColor(lifeAlpha);
                    ctx.fill();
                } else {
                    const alpha = Math.min(0.95, colors.boundaryBaseAlpha * (1 + combinedBoost * 4.5 + pulse * 0.35));
                    const radius = pt.baseRadius * (1 + combinedBoost * 1.4);

                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = colors.boundaryColor(alpha);
                    ctx.fill();
                }
            }
        }

        // Draw Xantium Vector Mothership & Scout Ship overlay if Xantium hovered
        if (isHoveringXantium) {
            // 1. Render Mothership Vector Hull
            ctx.save();
            ctx.translate(msX, msY);

            ctx.beginPath();
            ctx.moveTo(35, 0);          // Front Command Nose
            ctx.lineTo(-15, -24);       // Top Wing Tip
            ctx.lineTo(-28, -12);       // Port Engine
            ctx.lineTo(-20, 0);         // Rear Core
            ctx.lineTo(-28, 12);        // Starboard Engine
            ctx.lineTo(-15, 24);        // Bottom Wing Tip
            ctx.closePath();

            ctx.strokeStyle = colors.lifeColor(0.45);
            ctx.lineWidth = 1.2;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Mothership Core Reactor Node
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fillStyle = colors.lifeColor(0.75);
            ctx.fill();

            ctx.restore();

            // 2. Render Scout Ship Vector & Engine Trail
            if (xantiumShip.active) {
                // Engine Contrail
                if (xantiumShip.trail.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(xantiumShip.trail[0].x, xantiumShip.trail[0].y);
                    for (let t = 1; t < xantiumShip.trail.length; t++) {
                        ctx.lineTo(xantiumShip.trail[t].x, xantiumShip.trail[t].y);
                    }
                    ctx.strokeStyle = colors.lifeColor(0.35);
                    ctx.lineWidth = 1.0;
                    ctx.setLineDash([3, 3]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }

                // Sleek Scout Ship Geometry
                ctx.save();
                ctx.translate(xantiumShip.x, xantiumShip.y);
                ctx.rotate(xantiumShip.angle);

                ctx.beginPath();
                ctx.moveTo(10, 0);       // Nose
                ctx.lineTo(-6, -6);     // Left wing
                ctx.lineTo(-2, 0);      // Engine
                ctx.lineTo(-6, 6);      // Right wing
                ctx.closePath();

                ctx.fillStyle = colors.node;
                ctx.fill();
                ctx.strokeStyle = colors.lifeColor(0.85);
                ctx.lineWidth = 1.1;
                ctx.stroke();

                ctx.restore();
            }
        }

        // Draw Dynamic Tree Vector Branches overlay if Jane Street hovered
        if (isHoveringJaneStreet) {
            ctx.strokeStyle = colors.lifeColor(0.28);
            ctx.lineWidth = 1.0;
            ctx.setLineDash([4, 4]);

            gbdtBranches.forEach(br => {
                const currX2 = br.x1 + (br.x2 - br.x1) * br.progress;
                const currY2 = br.y1 + (br.y2 - br.y1) * br.progress;

                ctx.beginPath();
                ctx.moveTo(br.x1, br.y1);
                ctx.lineTo(currX2, currY2);
                ctx.stroke();
            });
            ctx.setLineDash([]);
        }

        // Draw IMC Mid-Price Line overlay
        if (isHoveringIMC) {
            ctx.beginPath();
            ctx.moveTo(midX, 0);
            ctx.lineTo(midX, height);
            ctx.strokeStyle = colors.matchColor(0.20);
            ctx.lineWidth = 1.0;
            ctx.setLineDash([6, 6]);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // 2. Draw Airplane Flight & Contrail if Active
        if (plane.active) {
            if (plane.trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(plane.trail[0].x, plane.trail[0].y);
                for (let t = 1; t < plane.trail.length; t++) {
                    ctx.lineTo(plane.trail[t].x, plane.trail[t].y);
                }
                ctx.strokeStyle = colors.linePrimary;
                ctx.lineWidth = 1.0;
                ctx.setLineDash([4, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            ctx.save();
            ctx.translate(plane.x, plane.y);
            ctx.rotate(plane.angle);

            ctx.beginPath();
            ctx.moveTo(11, 0);       // Nose
            ctx.lineTo(-7, -8);     // Left wing tip
            ctx.lineTo(-3, -2);     // Joint
            ctx.lineTo(-9, -6);     // Left tail
            ctx.lineTo(-9, 6);      // Right tail
            ctx.lineTo(-3, 2);      // Joint
            ctx.lineTo(-7, 8);      // Right wing tip
            ctx.closePath();

            ctx.fillStyle = colors.node;
            ctx.fill();
            ctx.strokeStyle = colors.linePrimary;
            ctx.lineWidth = 1.1;
            ctx.stroke();

            ctx.restore();
        }

        // 3. Interactive Mandelbrot Orbit Lines (Suppressed during Globe, MathBio, IMC, JaneStreet, and Xantium hovers)
        if ((isMouseOnScreen || isHoveringName) && !isHoveringGlobe && !isHoveringMathBio && !isHoveringIMC && !isHoveringJaneStreet && !isHoveringXantium) {
            let activeC = [];

            if (isHoveringName) {
                keyComplexPoints.forEach((kp, idx) => {
                    const offsetReal = Math.sin(time * 0.8 + idx) * 0.015;
                    const offsetImag = Math.cos(time * 0.8 + idx) * 0.015;
                    activeC.push({ real: kp.real + offsetReal, imag: kp.imag + offsetImag });
                });
            } else {
                const mouseC = screenToComplex(mouseX, mouseY);
                activeC.push(mouseC);

                orbitHistory.push(mouseC);
                if (orbitHistory.length > maxTrailHistory) orbitHistory.shift();

                for (let h = 0; h < orbitHistory.length; h += 4) {
                    activeC.push(orbitHistory[h]);
                }
            }

            activeC.forEach((c, cIdx) => {
                const orbit = computeOrbit(c.real, c.imag, isHoveringName ? 40 : 30);
                if (orbit.length < 2) return;

                const isMain = (cIdx === 0);

                ctx.beginPath();
                ctx.moveTo(orbit[0].sx, orbit[0].sy);

                for (let i = 1; i < orbit.length; i++) {
                    const pPrev = orbit[i - 1];
                    const pCurr = orbit[i];
                    const midX = (pPrev.sx + pCurr.sx) / 2;
                    const midY = (pPrev.sy + pCurr.sy) / 2;
                    ctx.quadraticCurveTo(pPrev.sx, pPrev.sy, midX, midY);
                }

                ctx.strokeStyle = isMain ? colors.linePrimary : colors.lineSecondary;
                ctx.lineWidth = isMain ? (isHoveringName ? 1.0 : 0.85) : 0.55;
                ctx.stroke();

                for (let i = 0; i < orbit.length; i += 3) {
                    const pt = orbit[i];
                    ctx.beginPath();
                    ctx.arc(pt.sx, pt.sy, isMain ? 1.3 : 0.9, 0, Math.PI * 2);
                    ctx.fillStyle = colors.node;
                    ctx.fill();
                }
            });
        }

        requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
        isMouseOnScreen = true;
    });

    window.addEventListener('mouseleave', () => {
        isMouseOnScreen = false;
    });

    if (nameLink) {
        nameLink.addEventListener('mouseenter', () => { isHoveringName = true; });
        nameLink.addEventListener('mouseleave', () => { isHoveringName = false; });
    }

    if (mathBioHover) {
        mathBioHover.addEventListener('mouseenter', () => {
            isHoveringMathBio = true;
            isHoveringName = false;
            isHoveringGlobe = false;
            isHoveringIMC = false;
            isHoveringJaneStreet = false;
            isHoveringXantium = false;
        });
        mathBioHover.addEventListener('mouseleave', () => {
            isHoveringMathBio = false;
            isLifeActive = false;
        });
    }

    if (imcHover) {
        imcHover.addEventListener('mouseenter', () => {
            isHoveringIMC = true;
            isHoveringName = false;
            isHoveringGlobe = false;
            isHoveringMathBio = false;
            isHoveringJaneStreet = false;
            isHoveringXantium = false;
        });
        imcHover.addEventListener('mouseleave', () => {
            isHoveringIMC = false;
        });
    }

    if (janeStreetHover) {
        janeStreetHover.addEventListener('mouseenter', () => {
            isHoveringJaneStreet = true;
            isHoveringName = false;
            isHoveringGlobe = false;
            isHoveringMathBio = false;
            isHoveringIMC = false;
            isHoveringXantium = false;
            initDynamicTree();
        });
        janeStreetHover.addEventListener('mouseleave', () => {
            isHoveringJaneStreet = false;
            gbdtNodes = [];
            gbdtBranches = [];
        });
    }

    if (xantiumHover) {
        xantiumHover.addEventListener('mouseenter', () => {
            isHoveringXantium = true;
            isHoveringName = false;
            isHoveringGlobe = false;
            isHoveringMathBio = false;
            isHoveringIMC = false;
            isHoveringJaneStreet = false;
            spawnXantiumShip();
        });
        xantiumHover.addEventListener('mouseleave', () => {
            isHoveringXantium = false;
            xantiumShip.active = false;
        });
    }

    const corpLinks = document.querySelectorAll('.corp-link');
    corpLinks.forEach(link => {
        if (link !== imcHover && link !== janeStreetHover && link !== xantiumHover) {
            link.addEventListener('mouseenter', () => { isHoveringName = true; });
            link.addEventListener('mouseleave', () => { isHoveringName = false; });
        }
    });

    const globeLink = document.querySelector('.globe-link');
    if (globeLink) {
        globeLink.addEventListener('mouseenter', () => {
            isHoveringGlobe = true;
            isHoveringName = false;
            isHoveringMathBio = false;
            isHoveringIMC = false;
            isHoveringJaneStreet = false;
            isHoveringXantium = false;
        });
        globeLink.addEventListener('mouseleave', () => {
            isHoveringGlobe = false;
        });
    }

    resize();
    render();

    // -------------------------------------------------------------
    // REALISTIC 3D ORTHOGRAPHIC GLOBE RENDERER
    // -------------------------------------------------------------
    const gCanvas = document.getElementById('globe-canvas');
    if (gCanvas) {
        const gCtx = gCanvas.getContext('2d');
        const gDpr = window.devicePixelRatio || 1;

        gCanvas.width = 36 * gDpr;
        gCanvas.height = 36 * gDpr;

        let gTime = 0;
        let gSpeed = 0.012;
        let isGlobeHovered = false;

        const tilt = 23.5 * Math.PI / 180;
        const cosTilt = Math.cos(tilt);
        const sinTilt = Math.sin(tilt);
        const R = 14;
        const cx = 18;
        const cy = 18;

        const landmasses = [
            [60, -100], [55, -115], [50, -95], [45, -75], [35, -100], [30, -90], [20, -100],
            [5, -70], [-10, -55], [-20, -65], [-35, -60], [-50, -70],
            [60, 10], [55, 30], [50, 0], [45, 15], [40, -5],
            [30, 10], [20, 0], [10, 20], [0, 40], [-10, 25], [-25, 20], [-35, 20],
            [65, 80], [60, 120], [50, 70], [45, 100], [35, 120], [25, 80], [15, 100],
            [-20, 135], [-25, 120], [-30, 145], [-35, 135]
        ];

        function project3D(latDeg, lonDeg, rotLon) {
            const lat = latDeg * Math.PI / 180;
            const lon = (lonDeg + rotLon) * Math.PI / 180;

            const x0 = Math.cos(lat) * Math.sin(lon);
            const y0 = -Math.sin(lat);
            const z0 = Math.cos(lat) * Math.cos(lon);

            const x = x0 * cosTilt - y0 * sinTilt;
            const y = x0 * sinTilt + y0 * cosTilt;
            const z = z0;

            return {
                sx: cx + x * R,
                sy: cy + y * R,
                z: z
            };
        }

        function renderGlobe() {
            gCtx.save();
            gCtx.scale(gDpr, gDpr);
            gCtx.clearRect(0, 0, 36, 36);

            const targetSpeed = isGlobeHovered ? 0.04 : 0.012;
            gSpeed += (targetSpeed - gSpeed) * 0.08;
            gTime += gSpeed;
            const rotLon = gTime * (180 / Math.PI);

            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const mainColor = isDark ? 'rgba(240, 240, 235, ' : 'rgba(20, 20, 20, ';

            gCtx.beginPath();
            gCtx.arc(cx, cy, R, 0, Math.PI * 2);
            gCtx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
            gCtx.fill();
            gCtx.strokeStyle = mainColor + '0.75)';
            gCtx.lineWidth = 1.2;
            gCtx.stroke();
            gCtx.clip();

            const lats = [-60, -30, 0, 30, 60];
            lats.forEach(latDeg => {
                gCtx.beginPath();
                let started = false;
                for (let lonDeg = 0; lonDeg <= 360; lonDeg += 10) {
                    const p = project3D(latDeg, lonDeg, rotLon);
                    if (p.z > -0.1) {
                        if (!started) { gCtx.moveTo(p.sx, p.sy); started = true; }
                        else { gCtx.lineTo(p.sx, p.sy); }
                    } else {
                        started = false;
                    }
                }
                gCtx.strokeStyle = mainColor + (latDeg === 0 ? '0.45)' : '0.22)');
                gCtx.lineWidth = latDeg === 0 ? 0.9 : 0.6;
                gCtx.stroke();
            });

            for (let lonDeg = 0; lonDeg < 360; lonDeg += 45) {
                gCtx.beginPath();
                let started = false;
                for (let latDeg = -85; latDeg <= 85; latDeg += 5) {
                    const p = project3D(latDeg, lonDeg, rotLon);
                    if (p.z > -0.1) {
                        if (!started) { gCtx.moveTo(p.sx, p.sy); started = true; }
                        else { gCtx.lineTo(p.sx, p.sy); }
                    } else {
                        started = false;
                    }
                }
                gCtx.strokeStyle = mainColor + '0.25)';
                gCtx.lineWidth = 0.6;
                gCtx.stroke();
            }

            landmasses.forEach(([latDeg, lonDeg]) => {
                const p = project3D(latDeg, lonDeg, rotLon);
                if (p.z > 0.1) {
                    gCtx.beginPath();
                    gCtx.arc(p.sx, p.sy, 1.2 * (p.z * 0.5 + 0.5), 0, Math.PI * 2);
                    gCtx.fillStyle = mainColor + (0.45 + p.z * 0.45) + ')';
                    gCtx.fill();
                }
            });

            const grad = gCtx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.2, cx, cy, R);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
            grad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
            gCtx.fillStyle = grad;
            gCtx.fillRect(0, 0, 36, 36);

            gCtx.restore();
            requestAnimationFrame(renderGlobe);
        }

        const gLink = document.querySelector('.globe-link');
        if (gLink) {
            gLink.addEventListener('mouseenter', () => { isGlobeHovered = true; });
            gLink.addEventListener('mouseleave', () => { isGlobeHovered = false; });
        }

        renderGlobe();
    }
})();
