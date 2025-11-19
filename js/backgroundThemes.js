
javascript:(function() {
    'use strict';
    
    if(typeof simulation === 'undefined') {
        console.warn("backgroundThemes: waiting for game...");
        setTimeout(arguments.callee, 100);
        return;
    }

    const themes = {
        current: 'default',
        mapSizeMultiplier: 1,
        
        backgrounds: {
            default: { bg: '#ddd', color: '#444' },
            night: { bg: '#0a0a1a', color: '#8888ff' },
            forest: { bg: '#1a3d1a', color: '#90ee90' },
            space: { bg: '#000011', color: '#ffffff' },
            desert: { bg: '#f4a460', color: '#8b4513' },
            ocean: { bg: '#006994', color: '#00bfff' },
            volcano: { bg: '#1a0000', color: '#ff4500' },
            ice: { bg: '#e0ffff', color: '#4682b4' },
            cyberpunk: { bg: '#0d0221', color: '#ff006e' },
            sunset: { bg: '#ff6b35', color: '#f7931e' },
            aurora: { bg: '#1a1a2e', color: '#00ff88' },
            cave: { bg: '#2c2416', color: '#8b7355' },
            toxic: { bg: '#1a3d0a', color: '#00ff00' },
            neon: { bg: '#000000', color: '#ff00ff' },
            blood: { bg: '#330000', color: '#8b0000' },
            gold: { bg: '#ffd700', color: '#b8860b' },
            silver: { bg: '#c0c0c0', color: '#696969' },
            matrix: { bg: '#000000', color: '#00ff00' },
            void: { bg: '#0a0014', color: '#6a0dad' },
            dream: { bg: '#ffb6c1', color: '#ff69b4' },
            nightmare: { bg: '#1a0033', color: '#8b008b' },
            underwater: { bg: '#001f3f', color: '#0074d9' },
            sky: { bg: '#87ceeb', color: '#4169e1' },
            autumn: { bg: '#8b4513', color: '#ff8c00' },
            spring: { bg: '#98fb98', color: '#32cd32' },
            winter: { bg: '#f0f8ff', color: '#4682b4' },
            summer: { bg: '#ffff99', color: '#ffd700' },
            steampunk: { bg: '#8b7355', color: '#cd853f' },
            apocalypse: { bg: '#3d2817', color: '#8b4513' },
            heaven: { bg: '#f0f8ff', color: '#ffd700' },
            hell: { bg: '#330000', color: '#ff0000' },
            carnival: { bg: '#ff1493', color: '#ffff00' },
            pastel: { bg: '#ffe4e1', color: '#ffb6c1' },
            sepia: { bg: '#704214', color: '#f4a460' },
            noir: { bg: '#1a1a1a', color: '#ffffff' },
            rainbow: { bg: '#ffffff', color: 'rainbow' },
            crystal: { bg: '#e6f2ff', color: '#4da6ff' },
            shadow: { bg: '#0d0d0d', color: '#333333' },
            light: { bg: '#ffffed', color: '#ffff00' },
            dark: { bg: '#000000', color: '#1a1a1a' },
            retro: { bg: '#1a1a1a', color: '#00ff00' },
            vapor: { bg: '#ff71ce', color: '#01cdfe' },
            synthwave: { bg: '#2b0d45', color: '#ff00ff' },
            glitch: { bg: '#0a0014', color: '#00ff00' },
            pixel: { bg: '#2d2d2d', color: '#00ff00' },
            comic: { bg: '#ffff00', color: '#ff0000' },
            anime: { bg: '#ffe4e1', color: '#ff69b4' },
            gothic: { bg: '#1a0033', color: '#8b008b' },
            solar: { bg: '#ff8c00', color: '#ffd700' },
            lunar: { bg: '#191970', color: '#e0e0e0' }
        },
        
        applyTheme(name) {
            if(!this.backgrounds[name]) name = 'default';
            this.current = name;
            const theme = this.backgrounds[name];
            document.body.style.backgroundColor = theme.bg;
            color.map = theme.color;
            color.block = theme.color;
            console.log(`%cTheme changed to: ${name}`, "color: " + theme.color);
        },
        
        setMapSize(multiplier) {
            this.mapSizeMultiplier = Math.max(0.5, Math.min(multiplier, 5));
            console.log(`%cMap size multiplier: ${this.mapSizeMultiplier}x`, "color: #0af");
        },
        
        createUI() {
            const themeUI = document.createElement('div');
            themeUI.id = 'theme-selector';
            themeUI.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                z-index: 10000;
                background: rgba(0,0,0,0.8);
                padding: 15px;
                border-radius: 10px;
                color: white;
                max-width: 300px;
            `;
            
            themeUI.innerHTML = `
                <h3 style="margin: 0 0 10px 0;">Themes & Settings</h3>
                <label>Background Theme:</label>
                <select id="theme-select" style="width: 100%; margin-bottom: 10px;">
                    ${Object.keys(this.backgrounds).map(t => `<option value="${t}">${t}</option>`).join('')}
                </select>
                <label>Map Size: <span id="map-size-value">1.0x</span></label>
                <input type="range" id="map-size-slider" min="0.5" max="5" step="0.1" value="1" style="width: 100%;">
                <button id="apply-theme" style="width: 100%; margin-top: 10px; padding: 8px; background: #0af; border: none; border-radius: 5px; color: white; cursor: pointer;">Apply</button>
                <button id="close-theme-ui" style="width: 100%; margin-top: 5px; padding: 8px; background: #f44; border: none; border-radius: 5px; color: white; cursor: pointer;">Close</button>
            `;
            
            document.body.appendChild(themeUI);
            
            document.getElementById('map-size-slider').addEventListener('input', (e) => {
                document.getElementById('map-size-value').textContent = parseFloat(e.target.value).toFixed(1) + 'x';
            });
            
            document.getElementById('apply-theme').addEventListener('click', () => {
                const selectedTheme = document.getElementById('theme-select').value;
                const mapSize = parseFloat(document.getElementById('map-size-slider').value);
                this.applyTheme(selectedTheme);
                this.setMapSize(mapSize);
            });
            
            document.getElementById('close-theme-ui').addEventListener('click', () => {
                themeUI.style.display = 'none';
            });
        }
    };
    
    // Add to settings
    const settingsDetails = document.getElementById('settings-details');
    if(settingsDetails) {
        const themeButton = document.createElement('button');
        themeButton.textContent = '🎨 Themes & Backgrounds';
        themeButton.style.cssText = 'width: 100%; padding: 10px; margin: 10px 0; background: #0af; color: white; border: none; border-radius: 5px; cursor: pointer;';
        themeButton.onclick = () => {
            if(!document.getElementById('theme-selector')) {
                themes.createUI();
            } else {
                document.getElementById('theme-selector').style.display = 'block';
            }
        };
        settingsDetails.querySelector('.details-div').appendChild(themeButton);
    }
    
    window.backgroundThemes = themes;
    console.log("%c50+ Background Themes Loaded!", "color: #0af");
})();
