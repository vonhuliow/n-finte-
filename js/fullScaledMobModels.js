// Full-Scaled Mob Models
// Creates properly scaled 3D-like models for all custom mobs

(function() {
    'use strict';

    if(typeof spawn === 'undefined' || typeof mobs === 'undefined' || typeof Matter === 'undefined') {
        setTimeout(arguments.callee, 100);
        return;
    }

    const Vector = Matter.Vector;

    // Store original mob draw function
    const originalMobsDraw = mobs.draw;

    // Advanced mob rendering system
    mobs.draw = function() {
        ctx.save();

        for (let i = 0; i < mob.length; i++) {
            if (!mob[i].alive) continue;

            const m = mob[i];
            const name = m.mobType || "slasher";

            // Draw based on mob type
            if (name.includes("slime")) {
                drawSlime(m);
            } else if (name.includes("bat") || name.includes("drone")) {
                drawFlying(m);
            } else if (name.includes("golem") || name.includes("titan") || name.includes("colossus")) {
                drawTank(m);
            } else if (name.includes("archer") || name.includes("mage") || name.includes("sniper")) {
                drawRanged(m);
            } else if (name.includes("boss") || name.includes("lord") || name.includes("fiend")) {
                drawBoss(m);
            } else if (name.includes("dragon") || name.includes("wyvern")) {
                drawDragon(m);
            } else if (name.includes("demon") || name.includes("devil")) {
                drawDemon(m);
            } else if (name.includes("knight") || name.includes("warrior")) {
                drawKnight(m);
            } else if (name.includes("spider") || name.includes("arachnid")) {
                drawSpider(m);
            } else if (name.includes("ghost") || name.includes("spirit")) {
                drawGhost(m);
            } else {
                // Default enhanced drawing
                drawDefault(m);
            }
        }

        ctx.restore();
    };

    // Drawing functions for each mob type
    function drawSlime(m) {
        ctx.save();
        ctx.translate(m.position.x, m.position.y);

        // Animated wobble
        const wobble = Math.sin(simulation.cycle * 0.1) * 0.1;
        ctx.scale(1 + wobble, 1 - wobble);

        // Gradient body
        const gradient = ctx.createRadialGradient(0, -m.radius * 0.3, 0, 0, 0, m.radius);
        gradient.addColorStop(0, m.fill.replace('0.8', '1'));
        gradient.addColorStop(1, m.fill.replace('0.8', '0.3'));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, m.radius, 0, Math.PI * 2);
        ctx.fill();

        // Shine effect
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.arc(-m.radius * 0.3, -m.radius * 0.3, m.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(-m.radius * 0.3, -m.radius * 0.2, m.radius * 0.15, 0, Math.PI * 2);
        ctx.arc(m.radius * 0.3, -m.radius * 0.2, m.radius * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawFlying(m) {
        ctx.save();
        ctx.translate(m.position.x, m.position.y);
        ctx.rotate(m.angle);

        // Wings animation
        const wingFlap = Math.sin(simulation.cycle * 0.2) * 0.5;

        // Left wing
        ctx.fillStyle = m.fill;
        ctx.beginPath();
        ctx.ellipse(-m.radius * 0.5, 0, m.radius * 0.8, m.radius * 0.4 * (1 + wingFlap), Math.PI * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Right wing
        ctx.beginPath();
        ctx.ellipse(m.radius * 0.5, 0, m.radius * 0.8, m.radius * 0.4 * (1 + wingFlap), -Math.PI * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Body
        const gradient = ctx.createLinearGradient(-m.radius * 0.5, 0, m.radius * 0.5, 0);
        gradient.addColorStop(0, m.fill.replace('0.8', '0.6'));
        gradient.addColorStop(0.5, m.fill);
        gradient.addColorStop(1, m.fill.replace('0.8', '0.6'));

        ctx.fillStyle = gradient;
        ctx.fillRect(-m.radius * 0.4, -m.radius * 0.3, m.radius * 0.8, m.radius * 0.6);

        ctx.restore();
    }

    function drawTank(m) {
        ctx.save();
        ctx.translate(m.position.x, m.position.y);

        // Layered armor plates
        for (let i = 3; i >= 0; i--) {
            const size = m.radius * (1 - i * 0.15);
            const alpha = 0.3 + i * 0.2;

            ctx.fillStyle = m.fill.replace(/[\d.]+\)/, `${alpha})`);
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 3;

            ctx.beginPath();
            for (let j = 0; j < 6; j++) {
                const angle = (Math.PI * 2 / 6) * j;
                const x = Math.cos(angle) * size;
                const y = Math.sin(angle) * size;
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // Core glow
        ctx.fillStyle = "rgba(255, 100, 100, 0.6)";
        ctx.beginPath();
        ctx.arc(0, 0, m.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawRanged(m) {
        ctx.save();
        ctx.translate(m.position.x, m.position.y);
        ctx.rotate(m.angle);

        // Body
        ctx.fillStyle = m.fill;
        ctx.fillRect(-m.radius * 0.4, -m.radius * 0.5, m.radius * 0.8, m.radius);

        // Weapon
        ctx.fillStyle = "#666";
        ctx.fillRect(m.radius * 0.3, -m.radius * 0.2, m.radius * 0.8, m.radius * 0.15);

        // Scope/sight
        ctx.fillStyle = "#f00";
        ctx.beginPath();
        ctx.arc(m.radius * 1.2, -m.radius * 0.1, m.radius * 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawBoss(m) {
        ctx.save();
        ctx.translate(m.position.x, m.position.y);

        // Rotating aura
        const auraRotation = (simulation.cycle * 0.05) % (Math.PI * 2);

        for (let i = 0; i < 8; i++) {
            const angle = auraRotation + (Math.PI * 2 / 8) * i;
            const x = Math.cos(angle) * m.radius * 1.5;
            const y = Math.sin(angle) * m.radius * 1.5;

            ctx.fillStyle = "rgba(255, 0, 255, 0.3)";
            ctx.beginPath();
            ctx.arc(x, y, m.radius * 0.2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Main body with gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, m.radius);
        gradient.addColorStop(0, "rgba(150, 0, 150, 1)");
        gradient.addColorStop(0.7, m.fill);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.8)");

        ctx.fillStyle = gradient;
        ctx.strokeStyle = "#f0f";
        ctx.lineWidth = 5;

        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const radius = m.radius * (i % 2 === 0 ? 1 : 0.8);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pulsing core
        const pulse = 0.5 + Math.sin(simulation.cycle * 0.1) * 0.3;
        ctx.fillStyle = `rgba(255, 255, 0, ${pulse})`;
        ctx.beginPath();
        ctx.arc(0, 0, m.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawDragon(m) {
        ctx.save();
        ctx.translate(m.position.x, m.position.y);
        ctx.rotate(m.angle);

        // Tail (segmented)
        for (let i = 0; i < 5; i++) {
            const tailX = -m.radius * (0.5 + i * 0.3);
            const tailY = Math.sin(simulation.cycle * 0.1 + i) * m.radius * 0.3;
            const tailSize = m.radius * (0.4 - i * 0.05);

            ctx.fillStyle = m.fill;
            ctx.beginPath();
            ctx.arc(tailX, tailY, tailSize, 0, Math.PI * 2);
            ctx.fill();
        }

        // Wings
        const wingFlap = Math.sin(simulation.cycle * 0.15);
        ctx.fillStyle = m.fill.replace('0.8', '0.5');

        // Left wing
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-m.radius * 2, -m.radius * (2 + wingFlap), -m.radius * 1.5, -m.radius * 0.5);
        ctx.fill();

        // Right wing
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-m.radius * 2, m.radius * (2 + wingFlap), -m.radius * 1.5, m.radius * 0.5);
        ctx.fill();

        // Body
        ctx.fillStyle = m.fill;
        ctx.fillRect(-m.radius * 0.6, -m.radius * 0.4, m.radius * 1.2, m.radius * 0.8);

        // Head
        ctx.beginPath();
        ctx.arc(m.radius * 0.8, 0, m.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = "#ff0";
        ctx.beginPath();
        ctx.arc(m.radius, -m.radius * 0.2, m.radius * 0.1, 0, Math.PI * 2);
        ctx.arc(m.radius, m.radius * 0.2, m.radius * 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawDemon(m) {
        ctx.save();
        ctx.translate(m.position.x, m.position.y);

        // Shadow/aura
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.beginPath();
        ctx.arc(0, m.radius * 0.2, m.radius * 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Horns
        ctx.strokeStyle = "#800";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-m.radius * 0.5, -m.radius * 0.8);
        ctx.quadraticCurveTo(-m.radius * 0.8, -m.radius * 1.5, -m.radius * 0.6, -m.radius * 1.8);
        ctx.moveTo(m.radius * 0.5, -m.radius * 0.8);
        ctx.quadraticCurveTo(m.radius * 0.8, -m.radius * 1.5, m.radius * 0.6, -m.radius * 1.8);
        ctx.stroke();

        // Body
        ctx.fillStyle = m.fill;
        ctx.beginPath();
        ctx.arc(0, 0, m.radius, 0, Math.PI * 2);
        ctx.fill();

        // Glowing eyes
        ctx.fillStyle = "#f00";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#f00";
        ctx.beginPath();
        ctx.arc(-m.radius * 0.3, -m.radius * 0.3, m.radius * 0.15, 0, Math.PI * 2);
        ctx.arc(m.radius * 0.3, -m.radius * 0.3, m.radius * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
    }

    function drawKnight(m) {
        ctx.save();
        ctx.translate(m.position.x, m.position.y);
        ctx.rotate(m.angle);

        // Shield
        ctx.fillStyle = "#aaa";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(-m.radius * 0.5, 0, m.radius * 0.6, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.fill();
        ctx.stroke();

        // Body/armor
        ctx.fillStyle = m.fill;
        ctx.fillRect(-m.radius * 0.4, -m.radius * 0.6, m.radius * 0.8, m.radius * 1.2);

        // Helmet
        ctx.fillStyle = "#666";
        ctx.beginPath();
        ctx.arc(0, -m.radius * 0.7, m.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Visor
        ctx.fillStyle = "#000";
        ctx.fillRect(-m.radius * 0.3, -m.radius * 0.7, m.radius * 0.6, m.radius * 0.15);

        // Sword
        ctx.fillStyle = "#ccc";
        ctx.fillRect(m.radius * 0.3, -m.radius * 0.5, m.radius * 0.15, m.radius * 1.5);
        ctx.fillStyle = "#444";
        ctx.fillRect(m.radius * 0.25, m.radius * 0.3, m.radius * 0.25, m.radius * 0.15);

        ctx.restore();
    }

    function drawSpider(m) {
        ctx.save();
        ctx.translate(m.position.x, m.position.y);

        // Legs (8 animated)
        ctx.strokeStyle = m.fill;
        ctx.lineWidth = 4;

        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const legWave = Math.sin(simulation.cycle * 0.2 + i) * 0.3;

            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * m.radius * 0.5, Math.sin(angle) * m.radius * 0.5);
            ctx.quadraticCurveTo(
                Math.cos(angle) * m.radius * (1.5 + legWave),
                Math.sin(angle) * m.radius * (1.5 + legWave),
                Math.cos(angle) * m.radius * 2,
                Math.sin(angle) * m.radius * 2 + m.radius * 0.5
            );
            ctx.stroke();
        }

        // Body
        ctx.fillStyle = m.fill;
        ctx.beginPath();
        ctx.ellipse(0, 0, m.radius * 0.8, m.radius * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Abdomen
        ctx.beginPath();
        ctx.ellipse(0, m.radius * 0.7, m.radius * 0.6, m.radius * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (multiple)
        ctx.fillStyle = "#f00";
        for (let i = 0; i < 4; i++) {
            const x = (i - 1.5) * m.radius * 0.2;
            const y = -m.radius * 0.3;
            ctx.beginPath();
            ctx.arc(x, y, m.radius * 0.08, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    function drawGhost(m) {
        ctx.save();
        ctx.translate(m.position.x, m.position.y);

        // Transparency effect
        const phase = Math.sin(simulation.cycle * 0.1) * 0.3 + 0.5;
        ctx.globalAlpha = phase;

        // Ethereal trail
        for (let i = 0; i < 5; i++) {
            const trailY = i * m.radius * 0.3;
            const trailAlpha = (5 - i) * 0.1;

            ctx.fillStyle = m.fill.replace(/[\d.]+\)/, `${trailAlpha})`);
            ctx.beginPath();
            ctx.arc(0, trailY, m.radius * (1 - i * 0.1), 0, Math.PI * 2);
            ctx.fill();
        }

        // Main body
        ctx.fillStyle = m.fill;
        ctx.beginPath();
        ctx.arc(0, 0, m.radius, 0, Math.PI);

        // Wavy bottom
        for (let i = 0; i < 6; i++) {
            const x = -m.radius + (m.radius * 2 / 6) * i;
            const y = m.radius + Math.sin(simulation.cycle * 0.1 + i) * m.radius * 0.2;
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        // Glowing eyes
        ctx.fillStyle = "#0ff";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#0ff";
        ctx.beginPath();
        ctx.arc(-m.radius * 0.3, -m.radius * 0.2, m.radius * 0.15, 0, Math.PI * 2);
        ctx.arc(m.radius * 0.3, -m.radius * 0.2, m.radius * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawDefault(m) {
        ctx.save();
        ctx.translate(m.position.x, m.position.y);

        // Enhanced default with gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, m.radius);
        gradient.addColorStop(0, m.fill);
        gradient.addColorStop(1, m.fill.replace('0.8', '0.4'));

        ctx.fillStyle = gradient;
        ctx.strokeStyle = m.stroke || "#000";
        ctx.lineWidth = 2;

        ctx.beginPath();
        const vertices = m.vertices;
        ctx.moveTo(vertices[0].x - m.position.x, vertices[0].y - m.position.y);
        for (let j = 1; j < vertices.length; j++) {
            ctx.lineTo(vertices[j].x - m.position.x, vertices[j].y - m.position.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    console.log("%c✓ Full-scaled mob models loaded!", "color: #0f0; font-size: 16px; font-weight: bold");
})();