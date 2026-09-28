// Classic High-Resolution Vector SVG Piece Icons (Chess.com / Lichess standard set)
const SVG_PIECES = {
    wP: `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    wN: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="#ffffff"/><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,8.5 C 14.5,9.5 16.5,9.5 18,10 C 18,10 18.9,8.5 21,8.5 C 21.5,9.5 22,10 22,10 Z" fill="#ffffff"/><circle cx="15" cy="15.5" r="1.5" fill="#000"/><path d="M 9.5,25.5 A 0.5,0.5 0 1,1 8.5,25.5 A 0.5,0.5 0 1,1 9.5,25.5 Z" fill="#000"/></g></svg>`,
    wB: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#ffffff"><path d="M 9,36 C 12.39,35.03 19.11,36.46 22.5,34 C 25.89,36.46 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.54 9,36 9,36 Z"/><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,30 27.5,26 27.5,21 C 27.5,15.5 25,10 22.5,10 C 20,10 17.5,15.5 17.5,21 C 17.5,26 15,30 15,30 C 15,30 14.5,30.5 15,32 Z"/><path d="M 25 8 A 2.5 2.5 0 1 1 20,8 A 2.5 2.5 0 1 1 25 8 Z"/></g><path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18"/></g></svg>`,
    wR: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 Z M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 Z M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 Z M 12,14 L 33,14 L 31,32 L 14,32 L 12,14 Z" fill="#ffffff"/><path d="M 12,14 L 33,14 M 14,29 L 31,29 M 14,25 L 31,25 M 14,21 L 31,21 M 14,17 L 31,17"/></g></svg>`,
    wQ: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 8,26 C 17.5,24.5 30,24.5 37,26 C 37,23 37,11 37,11 L 31,22 L 22.5,10 L 14,22 L 8,11 L 8,26 Z" fill="#ffffff"/><path d="M 8,26 C 9,28 10.5,28 11.5,30 C 12.5,32 12.5,32.5 12,34 C 11.5,35.5 11.5,36 12,37 C 13,38 15.5,38 17.5,38.5 C 19.5,39 25.5,39 27.5,38.5 C 29.5,38 32,38 33,37 C 33.5,36 33.5,35.5 33,34 C 32.5,32.5 32.5,32 33.5,30 C 34.5,28 36,28 37,26 C 27,27.5 18,27.5 8,26 Z" fill="#ffffff"/><circle cx="6" cy="12" r="2" fill="#fff"/><circle cx="14" cy="9" r="2" fill="#fff"/><circle cx="22.5" cy="8" r="2" fill="#fff"/><circle cx="31" cy="9" r="2" fill="#fff"/><circle cx="39" cy="12" r="2" fill="#fff"/></g></svg>`,
    wK: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,11.63 L 22.5,6 M 20,8 L 25,8" stroke="#000"/><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 24,11.5 21,11.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25 Z" fill="#ffffff"/><path d="M 11.5,37 C 17,40.5 28,40.5 33.5,37 C 37.5,30.5 37.5,21 37.5,21 C 37.5,21 34.5,23.5 31,23.5 C 27.5,23.5 26.5,21.5 22.5,21.5 C 18.5,21.5 17.5,23.5 14,23.5 C 10.5,23.5 7.5,21 7.5,21 C 7.5,21 7.5,30.5 11.5,37 Z" fill="#ffffff"/><path d="M 11.5,30 C 17,27 28,27 33.5,30 M 11.5,33.5 C 17,30.5 28,30.5 33.5,33.5 M 11.5,37 C 17,34 28,34 33.5,37"/></g></svg>`,
    
    bP: `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#363431" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    bN: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="#363431"/><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,8.5 C 14.5,9.5 16.5,9.5 18,10 C 18,10 18.9,8.5 21,8.5 C 21.5,9.5 22,10 22,10 Z" fill="#363431"/><circle cx="15" cy="15.5" r="1.5" fill="#fff"/><path d="M 9.5,25.5 A 0.5,0.5 0 1,1 8.5,25.5 A 0.5,0.5 0 1,1 9.5,25.5 Z" fill="#fff"/></g></svg>`,
    bB: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#363431"><path d="M 9,36 C 12.39,35.03 19.11,36.46 22.5,34 C 25.89,36.46 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.54 9,36 9,36 Z"/><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,30 27.5,26 27.5,21 C 27.5,15.5 25,10 22.5,10 C 20,10 17.5,15.5 17.5,21 C 17.5,26 15,30 15,30 C 15,30 14.5,30.5 15,32 Z"/><path d="M 25 8 A 2.5 2.5 0 1 1 20,8 A 2.5 2.5 0 1 1 25 8 Z"/></g><path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" stroke="#fff"/></g></svg>`,
    bR: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 Z M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 Z M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 Z M 12,14 L 33,14 L 31,32 L 14,32 L 12,14 Z" fill="#363431"/><path d="M 12,14 L 33,14 M 14,29 L 31,29 M 14,25 L 31,25 M 14,21 L 31,21 M 14,17 L 31,17" stroke="#fff"/></g></svg>`,
    bQ: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 8,26 C 17.5,24.5 30,24.5 37,26 C 37,23 37,11 37,11 L 31,22 L 22.5,10 L 14,22 L 8,11 L 8,26 Z" fill="#363431"/><path d="M 8,26 C 9,28 10.5,28 11.5,30 C 12.5,32 12.5,32.5 12,34 C 11.5,35.5 11.5,36 12,37 C 13,38 15.5,38 17.5,38.5 C 19.5,39 25.5,39 27.5,38.5 C 29.5,38 32,38 33,37 C 33.5,36 33.5,35.5 33,34 C 32.5,32.5 32.5,32 33.5,30 C 34.5,28 36,28 37,26 C 27,27.5 18,27.5 8,26 Z" fill="#363431"/><circle cx="6" cy="12" r="2" fill="#000"/><circle cx="14" cy="9" r="2" fill="#000"/><circle cx="22.5" cy="8" r="2" fill="#000"/><circle cx="31" cy="9" r="2" fill="#000"/><circle cx="39" cy="12" r="2" fill="#000"/></g></svg>`,
    bK: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,11.63 L 22.5,6 M 20,8 L 25,8" stroke="#fff"/><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 24,11.5 21,11.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25 Z" fill="#363431"/><path d="M 11.5,37 C 17,40.5 28,40.5 33.5,37 C 37.5,30.5 37.5,21 37.5,21 C 37.5,21 34.5,23.5 31,23.5 C 27.5,23.5 26.5,21.5 22.5,21.5 C 18.5,21.5 17.5,23.5 14,23.5 C 10.5,23.5 7.5,21 7.5,21 C 7.5,21 7.5,30.5 11.5,37 Z" fill="#363431"/><path d="M 11.5,30 C 17,27 28,27 33.5,30 M 11.5,33.5 C 17,30.5 28,30.5 33.5,33.5 M 11.5,37 C 17,34 28,34 33.5,37" stroke="#fff"/></g></svg>`
};

// Web Audio API Move Sound Synthesizer (Zero External File Dependency)
class ChessSoundFX {
    constructor() {
        this.ctx = null;
    }
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }
    playMoveSound() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }
    playCaptureSound() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }
}

const soundFX = new ChessSoundFX();
