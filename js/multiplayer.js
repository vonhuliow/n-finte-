// Simplified Multiplayer System
(function() {
    'use strict';

    const mp = {
        enabled: false,
        roomCode: '',
        players: {},

        enable() {
            this.enabled = true;
            this.roomCode = Math.random().toString(36).substring(7).toUpperCase();
            this.createUI();
            simulation.inGameConsole(`<span style='color:#0ff'>🌐 Multiplayer enabled! Room: ${this.roomCode}</span>`);
        },

        createUI() {
            const mpDiv = document.createElement('div');
            mpDiv.id = 'mp-ui';
            mpDiv.style.cssText = `
                position: fixed;
                top: 50px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid #0ff;
                border-radius: 8px;
                padding: 10px;
                color: #0ff;
                font-family: monospace;
                z-index: 1000;
            `;

            mpDiv.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 5px;">🌐 MULTIPLAYER</div>
                <div style="font-size: 12px;">Room: ${this.roomCode}</div>
                <div style="font-size: 11px; color: #aaa; margin-top: 5px;">Players: <span id="mp-count">1</span></div>
            `;

            document.body.appendChild(mpDiv);
        }
    };

    // Enable with key M
    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyM' && !mp.enabled) {
            mp.enable();
        }
    });

    window.multiplayerSystem = mp;

    console.log('%c🌐 Simplified Multiplayer loaded! Press M to enable', 'color: #0ff; font-weight: bold');
})();