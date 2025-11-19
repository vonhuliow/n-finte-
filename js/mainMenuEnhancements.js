
```javascript
// Enhanced Main Menu
(function() {
    'use strict';

    window.addEventListener('load', () => {
        // Add version info
        const versionDiv = document.createElement('div');
        versionDiv.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            color: #666;
            font-size: 12px;
            font-family: monospace;
        `;
        versionDiv.textContent = 'v2.0 - Ultimate Edition';
        document.body.appendChild(versionDiv);

        // Add quick access buttons to info section
        const infoSection = document.getElementById('info');
        if (infoSection) {
            const quickPanel = document.createElement('details');
            quickPanel.innerHTML = `
                <summary style="font-size: 18px; font-weight: bold; color: #00d4ff;">⚡ Quick Access</summary>
                <div class="details-div" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 10px;">
                    <button onclick="if(typeof arsenalSystem !== 'undefined') document.getElementById('arsenal-toggle-btn').click();" style="padding: 10px; background: #00d4ff; color: #000; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        ⚔️ Arsenal
                    </button>
                    <button onclick="if(typeof blixerMode !== 'undefined') blixerMode.activate();" style="padding: 10px; background: #ff00ff; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        🔺 Blixer Mode
                    </button>
                    <button onclick="if(typeof characterCustomization !== 'undefined') characterCustomization.open();" style="padding: 10px; background: #e94560; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        👤 Character
                    </button>
                    <button onclick="if(typeof multiplayerSystem !== 'undefined') multiplayerSystem.enable();" style="padding: 10px; background: #0ff; color: #000; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        🌐 Multiplayer
                    </button>
                </div>
            `;
            infoSection.insertBefore(quickPanel, infoSection.firstChild);
        }
    });

    console.log('%c✨ Main Menu Enhanced!', 'color: #0f0; font-weight: bold');
})();
```
