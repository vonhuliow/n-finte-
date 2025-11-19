
```javascript
// Enhanced Marketplace - Compact & Expandable Arsenal Menu
(function() {
    'use strict';

    if(typeof b === 'undefined') {
        setTimeout(arguments.callee, 100);
        return;
    }

    // Compact arsenal button
    const arsenalBtn = document.createElement("button");
    arsenalBtn.id = "arsenal-toggle-btn";
    arsenalBtn.innerHTML = "⚔️";
    arsenalBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        font-size: 28px;
        background: rgba(0, 212, 255, 0.9);
        border: 2px solid #fff;
        border-radius: 50%;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        transition: all 0.3s;
    `;

    arsenalBtn.onmouseover = () => {
        arsenalBtn.style.transform = "scale(1.1)";
        arsenalBtn.style.boxShadow = "0 6px 12px rgba(0, 212, 255, 0.8)";
    };
    arsenalBtn.onmouseout = () => {
        arsenalBtn.style.transform = "scale(1)";
        arsenalBtn.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.5)";
    };

    document.body.appendChild(arsenalBtn);

    // Compact expandable menu
    const arsenalMenu = document.createElement("div");
    arsenalMenu.id = "arsenal-compact-menu";
    arsenalMenu.style.cssText = `
        display: none;
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 300px;
        max-height: 400px;
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid #00d4ff;
        border-radius: 10px;
        padding: 10px;
        z-index: 9998;
        overflow-y: auto;
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
    `;

    arsenalMenu.innerHTML = `
        <h3 style="color: #00d4ff; margin: 0 0 10px 0; text-align: center;">⚔️ FREE ARSENAL</h3>
        <div id="arsenal-weapons-list" style="max-height: 300px; overflow-y: auto;"></div>
        <button id="unlock-all-weapons" style="width: 100%; margin-top: 10px; padding: 8px; background: #00d4ff; color: #000; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
            🎁 UNLOCK ALL
        </button>
    `;

    document.body.appendChild(arsenalMenu);

    let isExpanded = false;

    arsenalBtn.onclick = () => {
        isExpanded = !isExpanded;
        arsenalMenu.style.display = isExpanded ? 'block' : 'none';
        if (isExpanded) populateArsenalList();
    };

    function populateArsenalList() {
        const list = document.getElementById('arsenal-weapons-list');
        if (!list) return;

        list.innerHTML = b.guns.map((gun, i) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px; margin: 3px 0; background: ${gun.have ? 'rgba(0, 212, 255, 0.2)' : 'rgba(30, 30, 30, 0.5)'}; border-radius: 5px; border-left: 3px solid ${gun.have ? '#00d4ff' : '#666'};">
                <span style="color: ${gun.have ? '#00d4ff' : '#fff'}; font-size: 12px;">${gun.have ? '✓ ' : ''}${gun.name}</span>
                <button onclick="arsenalSystem.toggle(${i})" style="padding: 3px 8px; font-size: 11px; background: ${gun.have ? '#e94560' : '#00d4ff'}; color: ${gun.have ? '#fff' : '#000'}; border: none; border-radius: 3px; cursor: pointer;">
                    ${gun.have ? 'DROP' : 'GET'}
                </button>
            </div>
        `).join('');
    }

    window.arsenalSystem = {
        toggle(gunIndex) {
            const gun = b.guns[gunIndex];
            if (gun.have) {
                gun.have = false;
                b.inventory = b.inventory.filter(idx => idx !== gunIndex);
                if (b.activeGun === gunIndex) {
                    b.activeGun = b.inventory.length > 0 ? b.inventory[0] : null;
                    b.inventoryGun = 0;
                }
            } else {
                gun.have = true;
                b.inventory.push(gunIndex);
                if (gun.ammo !== Infinity && gun.ammo === 0) {
                    gun.ammo = gun.ammoPack * 10;
                }
                if (b.activeGun === null) {
                    b.activeGun = gunIndex;
                    b.inventoryGun = b.inventory.length - 1;
                }
            }
            simulation.makeGunHUD();
            populateArsenalList();
        }
    };

    document.getElementById('unlock-all-weapons')?.addEventListener('click', function() {
        for (let i = 0; i < b.guns.length; i++) {
            if (!b.guns[i].have) {
                b.guns[i].have = true;
                b.inventory.push(i);
                if (b.guns[i].ammo !== Infinity && b.guns[i].ammo === 0) {
                    b.guns[i].ammo = b.guns[i].ammoPack * 10;
                }
            }
        }
        if (b.activeGun === null && b.inventory.length > 0) {
            b.activeGun = b.inventory[0];
            b.inventoryGun = 0;
        }
        simulation.makeGunHUD();
        populateArsenalList();
        simulation.inGameConsole("<span style='color:#0f0'>✓ All weapons unlocked!</span>");
    });

    console.log("%c⚔️ Compact Arsenal Menu loaded!", "color: #00d4ff; font-weight: bold");
})();
```
