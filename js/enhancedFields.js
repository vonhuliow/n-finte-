
// Enhanced Fields System - New visuals and properties for all fields
(function() {
    'use strict';
    
    if (typeof m === 'undefined' || typeof m.fieldUpgrades === 'undefined') {
        console.warn("Waiting for field system...");
        setTimeout(arguments.callee, 100);
        return;
    }

    // Enhanced Field Emitter
    const originalFieldEmitter = m.fieldUpgrades[0];
    m.fieldUpgrades[0].description = `<strong>classic field</strong> with <strong>enhanced visuals</strong><br>press <strong class='color-f'>FIELD</strong> to spawn <strong class='color-d'>repulsive mass</strong><br><strong>energy drain:</strong> spawned blocks <strong>+1/s</strong> base drain`;
    m.fieldUpgrades[0].do = function() {
        ctx.fillStyle = `rgba(0, 200, 255, ${0.3 + 0.1 * Math.sin(m.cycle * 0.1)})`;
        ctx.beginPath();
        ctx.arc(m.fieldPosition.x, m.fieldPosition.y, m.fieldRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Enhanced glow effect
        const gradient = ctx.createRadialGradient(m.fieldPosition.x, m.fieldPosition.y, 0, m.fieldPosition.x, m.fieldPosition.y, m.fieldRadius);
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
        gradient.addColorStop(0.5, 'rgba(0, 200, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
    };

    // Enhanced Grappling Hook
    if (m.fieldUpgrades[1]) {
        m.fieldUpgrades[1].description = `<strong>energy tether</strong> with <strong>visual trail</strong><br>pulls you to <strong>grapple point</strong><br><strong>energy drain:</strong> distance × <strong>0.0001</strong> per use`;
    }

    // Enhanced Negative Mass
    if (m.fieldUpgrades[2]) {
        m.fieldUpgrades[2].description = `<strong>gravity well</strong> with <strong>particle effects</strong><br>attracts <strong class='color-d'>everything</strong> in radius<br><strong>energy drain:</strong> <strong>0.006</strong> per second × attracted mass`;
        const originalNegativeDo = m.fieldUpgrades[2].do;
        m.fieldUpgrades[2].do = function() {
            if (originalNegativeDo) originalNegativeDo.call(this);
            
            // Add swirling particles
            for (let i = 0; i < 3; i++) {
                const angle = (m.cycle * 0.05 + i * 2.094) % 6.28;
                const radius = m.fieldRadius * 0.8;
                const x = m.fieldPosition.x + Math.cos(angle) * radius;
                const y = m.fieldPosition.y + Math.sin(angle) * radius;
                ctx.fillStyle = 'rgba(200, 100, 255, 0.6)';
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        };
    }

    // Enhanced Wormhole
    if (m.fieldUpgrades[3]) {
        m.fieldUpgrades[3].description = `<strong>portal vortex</strong> with <strong>space distortion</strong><br>teleports to <strong>wormhole exit</strong><br><strong>energy drain:</strong> <strong>0.003</strong> per second`;
        const originalWormholeDo = m.fieldUpgrades[3].do;
        m.fieldUpgrades[3].do = function() {
            if (originalWormholeDo) originalWormholeDo.call(this);
            
            // Add portal effect
            ctx.strokeStyle = 'rgba(100, 255, 200, 0.8)';
            ctx.lineWidth = 3;
            for (let i = 0; i < 3; i++) {
                const scale = 1 - (i * 0.2) + Math.sin(m.cycle * 0.1 + i) * 0.1;
                ctx.beginPath();
                ctx.arc(m.fieldPosition.x, m.fieldPosition.y, m.fieldRadius * scale, 0, 2 * Math.PI);
                ctx.stroke();
            }
        };
    }

    // Enhanced Molecular Assembler
    if (m.fieldUpgrades[4]) {
        m.fieldUpgrades[4].description = `<strong>matter fabricator</strong> with <strong>assembly animation</strong><br>spawns <strong>projectiles/blocks/ice/drones</strong><br><strong>energy drain:</strong> varies by mode`;
    }

    // Enhanced Pilot Wave
    if (m.fieldUpgrades[5]) {
        m.fieldUpgrades[5].description = `<strong>quantum shield</strong> with <strong>wave patterns</strong><br>blocks <strong class='color-defense'>damage</strong>, reflects bullets<br><strong>energy drain:</strong> <strong>0.002</strong> per second + damage absorbed`;
        const originalPilotDo = m.fieldUpgrades[5].do;
        m.fieldUpgrades[5].do = function() {
            if (originalPilotDo) originalPilotDo.call(this);
            
            // Add wave pattern
            ctx.strokeStyle = 'rgba(255, 200, 0, 0.4)';
            ctx.lineWidth = 2;
            for (let i = 0; i < 5; i++) {
                const offset = (m.cycle * 0.1 + i * 20) % 100;
                ctx.beginPath();
                ctx.arc(m.fieldPosition.x, m.fieldPosition.y, offset, 0, 2 * Math.PI);
                ctx.stroke();
            }
        };
    }

    // Enhanced Plasma Torch
    if (m.fieldUpgrades[6]) {
        m.fieldUpgrades[6].description = `<strong>plasma beam</strong> with <strong>fire particles</strong><br>continuous <strong class='color-d'>damage beam</strong><br><strong>energy drain:</strong> <strong>0.033</strong> per second`;
    }

    // Enhanced Time Dilation
    if (m.fieldUpgrades[7]) {
        m.fieldUpgrades[7].description = `<strong>temporal bubble</strong> with <strong>time ripples</strong><br>slows <strong>time</strong> for everything<br><strong>energy drain:</strong> <strong>0.006</strong> per second`;
        const originalTimeDo = m.fieldUpgrades[7].do;
        m.fieldUpgrades[7].do = function() {
            if (originalTimeDo) originalTimeDo.call(this);
            
            // Add time ripples
            ctx.strokeStyle = 'rgba(150, 150, 255, 0.3)';
            ctx.lineWidth = 2;
            const ripples = 4;
            for (let i = 0; i < ripples; i++) {
                const phase = (m.cycle * 0.05 + i * (6.28 / ripples)) % 6.28;
                const radius = m.fieldRadius * (0.5 + 0.5 * Math.sin(phase));
                ctx.beginPath();
                ctx.arc(m.fieldPosition.x, m.fieldPosition.y, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        };
    }

    // Enhanced Standing Wave
    if (m.fieldUpgrades[8]) {
        m.fieldUpgrades[8].description = `<strong>harmonic resonance</strong> with <strong>wave interference</strong><br>reduces <strong class='color-f'>max energy</strong>, increases <strong class='color-h'>max health</strong><br>blocks gain <strong>coupling</strong> energy`;
    }

    // Enhanced Metamaterial Cloaking
    if (m.fieldUpgrades[9]) {
        m.fieldUpgrades[9].description = `<strong>invisibility field</strong> with <strong>shimmer effect</strong><br>become <strong>invisible</strong> to mobs<br><strong>energy drain:</strong> <strong>0.004</strong> per second`;
        const originalCloakDo = m.fieldUpgrades[9].do;
        m.fieldUpgrades[9].do = function() {
            if (originalCloakDo) originalCloakDo.call(this);
            
            // Add shimmer effect
            ctx.strokeStyle = `rgba(200, 200, 255, ${0.2 + 0.1 * Math.sin(m.cycle * 0.2)})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(m.pos.x, m.pos.y, 60, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.setLineDash([]);
        };
    }

    // Enhanced Perfect Diamagnetism
    if (m.fieldUpgrades[10]) {
        m.fieldUpgrades[10].description = `<strong>magnetic shield</strong> with <strong>force lines</strong><br>repels <strong>bullets</strong> and <strong>power ups</strong><br><strong>energy drain:</strong> <strong>0.004</strong> per second`;
    }

    console.log("%c✓ Enhanced Fields loaded with new visuals!", "color: #0cf; font-size: 16px; font-weight: bold");
})();
