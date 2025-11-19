// Settings Popup System
(function() {
    'use strict';

    // Wait for dependencies to load
    function waitForDependencies(callback) {
        const checkDeps = setInterval(() => {
            // Wait for core dependencies only (characterCustomization is optional)
            if (typeof b === 'undefined' || typeof spawn === 'undefined' ||
                typeof mobs === 'undefined' || typeof m === 'undefined') {
                console.log('%cWaiting for core dependencies...', 'color: #ffa500');
                setTimeout(arguments.callee, 100);
                return;
            }

            // Check for optional dependencies
            const hasMarketplace = typeof marketplace !== 'undefined';
            const hasCharCustom = typeof characterCustomization !== 'undefined';

            if (typeof b !== 'undefined' &&
                typeof spawn !== 'undefined' &&
                typeof mobs !== 'undefined' &&
                typeof m !== 'undefined') {
                clearInterval(checkDeps);
                callback(hasMarketplace, hasCharCustom);
            }
        }, 100);
    }

    waitForDependencies(initSettings);

    function initSettings(hasMarketplace, hasCharCustom) {
    // Create settings button
    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'settings-btn';
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 50px;
        height: 50px;
        font-size: 28px;
        background: rgba(0, 0, 0, 0.7);
        border: 2px solid #0ff;
        border-radius: 50%;
        color: #0ff;
        cursor: pointer;
        z-index: 10000;
        transition: all 0.3s;
    `;

    settingsBtn.onmouseover = () => {
        settingsBtn.style.background = 'rgba(0, 255, 255, 0.3)';
        settingsBtn.style.transform = 'rotate(90deg) scale(1.1)';
    };

    settingsBtn.onmouseout = () => {
        settingsBtn.style.background = 'rgba(0, 0, 0, 0.7)';
        settingsBtn.style.transform = 'rotate(0deg) scale(1)';
    };

    document.body.appendChild(settingsBtn);

    // Create settings popup
    const settingsPopup = document.createElement('div');
    settingsPopup.id = 'settings-popup';
    settingsPopup.style.cssText = `
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 800px;
        max-height: 80vh;
        background: rgba(0, 0, 0, 0.95);
        border: 3px solid #0ff;
        border-radius: 15px;
        padding: 30px;
        z-index: 10001;
        overflow-y: auto;
        box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
    `;

    settingsPopup.innerHTML = `
        <h2 style="color: #0ff; text-align: center; margin-bottom: 20px; font-size: 32px;">⚙️ GAME SETTINGS ⚙️</h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="settings-section">
                <h3 style="color: #ff0; border-bottom: 2px solid #ff0; padding-bottom: 10px;">Graphics</h3>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    <input type="checkbox" id="setting-particles" checked> Particle Effects
                </label>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    <input type="checkbox" id="setting-shadows" checked> Shadows
                </label>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    <input type="checkbox" id="setting-glow" checked> Glow Effects
                </label>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    Quality: <input type="range" id="setting-quality" min="1" max="10" value="8" style="width: 60%;">
                </label>
            </div>

            <div class="settings-section">
                <h3 style="color: #0f0; border-bottom: 2px solid #0f0; padding-bottom: 10px;">Audio</h3>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    Master Volume: <input type="range" id="setting-volume" min="0" max="100" value="50" style="width: 60%;">
                </label>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    <input type="checkbox" id="setting-music" checked> Background Music
                </label>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    <input type="checkbox" id="setting-sfx" checked> Sound Effects
                </label>
            </div>

            <div class="settings-section">
                <h3 style="color: #f0f; border-bottom: 2px solid #f0f; padding-bottom: 10px;">Gameplay</h3>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    Difficulty: 
                    <select id="setting-difficulty" style="background: #222; color: #fff; padding: 5px;">
                        <option value="1">Easy</option>
                        <option value="2" selected>Normal</option>
                        <option value="3">Hard</option>
                        <option value="4">Extreme</option>
                    </select>
                </label>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    <input type="checkbox" id="setting-autosave" checked> Auto-Save
                </label>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    <input type="checkbox" id="setting-tutorials" checked> Show Tutorials
                </label>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    <input type="checkbox" id="setting-blixer"> 🎸 Blixer Mode
                </label>
            </div>

            <div class="settings-section">
                <h3 style="color: #f80; border-bottom: 2px solid #f80; padding-bottom: 10px;">Controls</h3>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    Mouse Sensitivity: <input type="range" id="setting-sensitivity" min="1" max="20" value="10" style="width: 60%;">
                </label>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    <input type="checkbox" id="setting-inverty" > Invert Y-Axis
                </label>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    <input type="checkbox" id="setting-autoaim"> Auto-Aim Assist
                </label>
            </div>

            <div class="settings-section">
                <h3 style="color: #0cf; border-bottom: 2px solid #0cf; padding-bottom: 10px;">Performance</h3>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    FPS Limit: 
                    <select id="setting-fps" style="background: #222; color: #fff; padding: 5px;">
                        <option value="30">30 FPS</option>
                        <option value="60" selected>60 FPS</option>
                        <option value="144">144 FPS</option>
                        <option value="0">Unlimited</option>
                    </select>
                </label>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    <input type="checkbox" id="setting-vsync" checked> V-Sync
                </label>
                <label style="color: #fff; display: block; margin: 10px 0;">
                    <input type="checkbox" id="setting-lowpower"> Low Power Mode
                </label>
            </div>

            <div class="settings-section">
                <h3 style="color: #f66; border-bottom: 2px solid #f66; padding-bottom: 10px;">Cheats (Experiment Mode)</h3>
                <button onclick="if(typeof tech !== 'undefined') tech.tech.forEach((t,i) => { if(t.allowed && t.allowed()) tech.giveTech(i); });" style="width: 100%; padding: 10px; margin: 5px 0; background: #f00; color: #fff; border: none; cursor: pointer; border-radius: 5px;">
                    Give All Techs
                </button>
                <button onclick="if(typeof b !== 'undefined') b.guns.forEach((g,i) => { if(!g.have) b.giveGuns(i); });" style="width: 100%; padding: 10px; margin: 5px 0; background: #0f0; color: #000; border: none; cursor: pointer; border-radius: 5px;">
                    Give All Weapons
                </button>
                <button onclick="if(typeof m !== 'undefined') { m.health = m.maxHealth; m.energy = m.maxEnergy; }" style="width: 100%; padding: 10px; margin: 5px 0; background: #0ff; color: #000; border: none; cursor: pointer; border-radius: 5px;">
                    Full Health/Energy
                </button>
                <button onclick="if(typeof spawn !== 'undefined') { for(let i=0;i<50;i++) spawn.randomMob(m.pos.x + (Math.random()-0.5)*500, m.pos.y + (Math.random()-0.5)*500); }" style="width: 100%; padding: 10px; margin: 5px 0; background: #f0f; color: #fff; border: none; cursor: pointer; border-radius: 5px;">
                    Spawn 50 Mobs
                </button>
                <button id="enable-weapon-upgrades" style="width: 100%; padding: 10px; margin: 5px 0; background: #fa0; color: #000; border: none; cursor: pointer; border-radius: 5px;">
                    Enable Weapon Upgrade Techs
                </button>
            </div>

            <div class="settings-section" style="grid-column: 1 / -1;">
                <h3 style="color: #9f9; border-bottom: 2px solid #9f9; padding-bottom: 10px;">Developer Console</h3>
                <button id="toggle-console" style="width: 100%; padding: 10px; margin: 5px 0; background: #080; color: #fff; border: none; cursor: pointer; border-radius: 5px;">
                    Open Console (Press / to toggle)
                </button>
                <div style="margin-top: 10px; color: #aaa; font-size: 12px;">
                    <p>Available commands:</p>
                    <code style="display: block; background: #222; padding: 10px; border-radius: 5px; margin: 5px 0;">
                        tech.giveTech("tech name")<br>
                        b.giveGuns("gun name")<br>
                        m.setField(index)<br>
                        spawn.randomMob(x, y)<br>
                        simulation.paused = true/false
                    </code>
                </div>
            </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <button id="settings-apply" style="padding: 15px 40px; font-size: 18px; background: #0f0; color: #000; border: none; cursor: pointer; border-radius: 10px; margin: 0 10px;">
                Apply Settings
            </button>
            <button id="settings-close" style="padding: 15px 40px; font-size: 18px; background: #f00; color: #fff; border: none; cursor: pointer; border-radius: 10px; margin: 0 10px;">
                Close
            </button>
        </div>
    `;

    document.body.appendChild(settingsPopup);

    // Toggle popup
    settingsBtn.onclick = () => {
        settingsPopup.style.display = settingsPopup.style.display === 'none' ? 'block' : 'none';
    };

    // Close button
    document.getElementById('settings-close').onclick = () => {
        settingsPopup.style.display = 'none';
    };

    // Apply settings
    document.getElementById('settings-apply').onclick = () => {
        const difficulty = parseInt(document.getElementById('setting-difficulty').value);
        const fps = parseInt(document.getElementById('setting-fps').value);
        const blixerEnabled = document.getElementById('setting-blixer').checked;

        try {
            if (typeof simulation !== 'undefined') {
                simulation.difficultyMode = difficulty;
                if (fps > 0) simulation.fpsCap = fps;

                // Update difficulty-related systems
                if (typeof level !== 'undefined' && level.updateDifficulty) {
                    level.updateDifficulty();
                }
            }

            // Toggle Blixer Mode
            if (typeof blixerMode !== 'undefined' && blixerMode.enabled !== blixerEnabled) {
                blixerMode.toggle();
            }

            alert('Settings applied successfully!');
        } catch (error) {
            console.error('Settings error:', error);
            alert('Some settings could not be applied. Check console for details.');
        }

        settingsPopup.style.display = 'none';
    };

    // Close on outside click
    settingsPopup.onclick = (e) => {
        if (e.target === settingsPopup) {
            settingsPopup.style.display = 'none';
        }
    };

    // Toggle console button
    document.getElementById('toggle-console')?.addEventListener('click', function() {
        if (typeof devConsole !== 'undefined') {
            if (devConsole.isOpen) {
                devConsole.close();
                this.textContent = 'Open Console (Press / to toggle)';
            } else {
                devConsole.open();
                this.textContent = 'Close Console';
            }
        } else {
            alert('Developer console not available. Press "/" during gameplay to open it.');
        }
    });

    // Enable weapon upgrade techs
    document.getElementById('enable-weapon-upgrades')?.addEventListener('click', function() {
        if (typeof tech === 'undefined' || typeof b === 'undefined') return;

        const weaponUpgrades = [];
        const mainWeapons = ['laser', 'nail gun', 'super balls', 'missiles', 'grenades', 'foam', 'harpoon', 'wave', 'shotgun', 'spores', 'drones', 'mine'];

        mainWeapons.forEach(weaponName => {
            for (let tier = 1; tier <= 5; tier++) {
                weaponUpgrades.push({
                    name: `${weaponName} upgrade ${tier}`,
                    description: `<strong>Tier ${tier}</strong> upgrade for ${weaponName}<br><strong>+${tier * 20}%</strong> damage, <strong>+${tier * 15}%</strong> fire rate, new abilities`,
                    maxCount: 1,
                    count: 0,
                    frequency: 2,
                    isGunTech: true,
                    allowed() {
                        return tech.haveGunCheck(weaponName);
                    },
                    requires: weaponName,
                    effect() {
                        const dmgBoost = 1 + (tier * 0.2);
                        const fireBoost = 1 - (tier * 0.15);
                        m.damageDone *= dmgBoost;
                        b.setFireCD();

                        // Add special abilities based on tier
                        if (tier >= 3 && weaponName === 'laser') tech.isLaserReflect = true;
                        if (tier >= 3 && weaponName === 'missiles') tech.isHomingMissiles = true;
                        if (tier >= 4 && weaponName === 'shotgun') tech.isShotgunExplosive = true;
                        if (tier === 5) tech[`is${weaponName}Master`] = true;
                    },
                    remove() {
                        if (this.count > 0) {
                            const dmgBoost = 1 + (tier * 0.2);
                            m.damageDone /= Math.pow(dmgBoost, this.count);
                            b.setFireCD();
                        }
                    }
                });
            }
        });

        weaponUpgrades.forEach(upgrade => tech.tech.push(upgrade));
        alert(`Added ${weaponUpgrades.length} weapon upgrade techs!`);
        this.style.background = '#0f0';
        this.textContent = '✓ Weapon Upgrades Enabled';
        this.disabled = true;
    });

    console.log("%c✓ Settings popup loaded!", "color: #0ff; font-size: 16px; font-weight: bold");
    }
})();