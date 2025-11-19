
// DC & Marvel Powers System
(function() {
    'use strict';
    
    if (typeof tech === 'undefined' || typeof b === 'undefined') {
        console.warn("Waiting for game systems...");
        setTimeout(arguments.callee, 100);
        return;
    }
    
    const dcMarvelPowers = {
        // Lantern Corps Rings
        lanternRings: {
            green: { emotion: "willpower", color: "#0f0", power: 1.5 },
            yellow: { emotion: "fear", color: "#ff0", power: 1.4 },
            red: { emotion: "rage", color: "#f00", power: 2.0 },
            blue: { emotion: "hope", color: "#00f", power: 1.3 },
            orange: { emotion: "avarice", color: "#f80", power: 1.6 },
            indigo: { emotion: "compassion", color: "#4b0082", power: 1.2 },
            violet: { emotion: "love", color: "#f0f", power: 1.4 },
            white: { emotion: "life", color: "#fff", power: 2.5 },
            black: { emotion: "death", color: "#000", power: 2.5 }
        },
        
        // Initialize all powers
        init() {
            this.addLanternRings();
            this.addSupermanPowers();
            this.addBatmanGadgets();
            this.addFlashPowers();
            this.addWonderWomanPowers();
            this.addGreenLanternAbilities();
            this.addIronManSuit();
            this.addThorPowers();
            this.addHulkPowers();
            this.addSpiderManAbilities();
            this.addDoctorStrangeMagic();
            this.addDeadpoolPowers();
            console.log("%c✓ DC/Marvel powers loaded!", "color: #00f; font-size: 16px; font-weight: bold");
        },
        
        addLanternRings() {
            for (let [color, ring] of Object.entries(this.lanternRings)) {
                b.guns.push({
                    name: `${color} lantern ring`,
                    description: `harness ${ring.emotion}<br><strong>${ring.power}x</strong> damage, construct creation`,
                    ammo: Infinity,
                    ammoPack: Infinity,
                    defaultAmmoPack: Infinity,
                    have: false,
                    charge: 0,
                    maxCharge: 100,
                    fire() {},
                    do() {
                        if (input.fire) {
                            this.charge = Math.min(this.charge + 2, this.maxCharge);
                            
                            // Aura effect
                            simulation.drawList.push({
                                x: m.pos.x,
                                y: m.pos.y,
                                radius: 50 + this.charge * 0.5,
                                color: ring.color + "33",
                                time: 3
                            });
                            
                            if (this.charge >= this.maxCharge) {
                                // Fire construct
                                const angle = m.angle;
                                const constructType = Math.floor(Math.random() * 4);
                                
                                if (constructType === 0) {
                                    // Energy beam
                                    const range = 1500;
                                    const start = { x: m.pos.x + Math.cos(angle) * 50, y: m.pos.y + Math.sin(angle) * 50 };
                                    const end = { x: start.x + Math.cos(angle) * range, y: start.y + Math.sin(angle) * range };
                                    
                                    ctx.strokeStyle = ring.color;
                                    ctx.lineWidth = 10;
                                    ctx.beginPath();
                                    ctx.moveTo(start.x, start.y);
                                    ctx.lineTo(end.x, end.y);
                                    ctx.stroke();
                                    
                                    // Damage mobs in path
                                    for (let i = 0; i < mob.length; i++) {
                                        if (mob[i].alive) {
                                            const hit = vertexCollision(start, end, [[mob[i]]]);
                                            if (hit.who) {
                                                mob[i].damage(0.5 * ring.power * m.dmgScale);
                                            }
                                        }
                                    }
                                } else if (constructType === 1) {
                                    // Giant fist
                                    b.explosion(
                                        { x: m.pos.x + Math.cos(angle) * 200, y: m.pos.y + Math.sin(angle) * 200 },
                                        300 * ring.power,
                                        ring.color + "66"
                                    );
                                } else if (constructType === 2) {
                                    // Shield barrier
                                    m.immuneCycle = m.cycle + 120;
                                    for (let i = 0; i < 60; i++) {
                                        simulation.drawList.push({
                                            x: m.pos.x,
                                            y: m.pos.y,
                                            radius: 80,
                                            color: ring.color + "44",
                                            time: 120
                                        });
                                    }
                                } else {
                                    // Orbital constructs
                                    for (let i = 0; i < 8; i++) {
                                        const orbitAngle = (Math.PI * 2 / 8) * i;
                                        const id = bullet.length;
                                        bullet[id] = Bodies.circle(
                                            m.pos.x + Math.cos(orbitAngle) * 150,
                                            m.pos.y + Math.sin(orbitAngle) * 150,
                                            15,
                                            { isSensor: true }
                                        );
                                        bullet[id].collisionFilter.category = cat.bullet;
                                        bullet[id].collisionFilter.mask = cat.mob;
                                        bullet[id].classType = "bullet";
                                        bullet[id].dmg = 0.3 * ring.power * m.dmgScale;
                                        bullet[id].endCycle = m.cycle + 180;
                                        bullet[id].orbitAngle = orbitAngle;
                                        bullet[id].orbitSpeed = 0.05;
                                        
                                        bullet[id].do = function() {
                                            this.orbitAngle += this.orbitSpeed;
                                            const x = m.pos.x + Math.cos(this.orbitAngle) * 150;
                                            const y = m.pos.y + Math.sin(this.orbitAngle) * 150;
                                            Matter.Body.setPosition(this, { x, y });
                                            
                                            simulation.drawList.push({
                                                x: this.position.x,
                                                y: this.position.y,
                                                radius: 20,
                                                color: ring.color + "88",
                                                time: 3
                                            });
                                        };
                                        
                                        Composite.add(engine.world, bullet[id]);
                                    }
                                }
                                
                                this.charge = 0;
                                m.fireCDcycle = m.cycle + 30;
                            }
                        } else {
                            this.charge = Math.max(0, this.charge - 1);
                        }
                    }
                });
            }
        },
        
        addSupermanPowers() {
            b.guns.push({
                name: "kryptonian powers",
                description: "heat vision, super strength, flight<br>infinite power under yellow sun",
                ammo: Infinity,
                ammoPack: Infinity,
                defaultAmmoPack: Infinity,
                have: false,
                fire() {},
                do() {
                    // Flight (reduced gravity)
                    player.force.y -= player.mass * simulation.g * 0.8;
                    
                    // Enhanced speed
                    if (input.left || input.right) {
                        const boost = input.left ? -0.5 : 0.5;
                        player.force.x += boost * player.mass;
                    }
                    
                    if (input.fire && m.fireCDcycle < m.cycle) {
                        // Heat vision
                        const range = 2000;
                        const start = { x: m.pos.x + Math.cos(m.angle) * 40, y: m.pos.y + Math.sin(m.angle) * 40 };
                        const end = { x: start.x + Math.cos(m.angle) * range, y: start.y + Math.sin(m.angle) * range };
                        
                        ctx.strokeStyle = "#f00";
                        ctx.lineWidth = 8;
                        ctx.shadowBlur = 20;
                        ctx.shadowColor = "#f00";
                        ctx.beginPath();
                        ctx.moveTo(start.x, start.y);
                        ctx.lineTo(end.x, end.y);
                        ctx.stroke();
                        ctx.shadowBlur = 0;
                        
                        for (let i = 0; i < mob.length; i++) {
                            if (mob[i].alive) {
                                const hit = vertexCollision(start, end, [[mob[i]]]);
                                if (hit.who) {
                                    mob[i].damage(0.8 * m.dmgScale);
                                }
                            }
                        }
                        
                        m.fireCDcycle = m.cycle + 5;
                    }
                }
            });
        },
        
        addBatmanGadgets() {
            const gadgets = ["batarang", "grapple gun", "smoke bomb", "explosive gel", "batclaw"];
            
            for (let gadget of gadgets) {
                b.guns.push({
                    name: `batman ${gadget}`,
                    description: `${gadget} utility<br>tactical advantage`,
                    ammo: 50,
                    ammoPack: 10,
                    defaultAmmoPack: 10,
                    have: false,
                    fire() {
                        const angle = m.angle;
                        
                        if (gadget === "batarang") {
                            const id = bullet.length;
                            bullet[id] = Bodies.polygon(m.pos.x + Math.cos(angle) * 40, m.pos.y + Math.sin(angle) * 40, 3, 12, spawn.propsIsNotHoldable);
                            Matter.Body.setVelocity(bullet[id], { x: Math.cos(angle) * 30, y: Math.sin(angle) * 30 });
                            Matter.Body.setAngularVelocity(bullet[id], 0.3);
                            bullet[id].collisionFilter.category = cat.bullet;
                            bullet[id].collisionFilter.mask = cat.mob;
                            bullet[id].dmg = 0.25 * m.dmgScale;
                            bullet[id].endCycle = m.cycle + 120;
                            Composite.add(engine.world, bullet[id]);
                        } else if (gadget === "smoke bomb") {
                            b.explosion(m.pos, 200, "rgba(0,0,0,0.5)");
                            m.isCloak = true;
                            setTimeout(() => { m.isCloak = false; }, 3000);
                        } else if (gadget === "explosive gel") {
                            setTimeout(() => {
                                b.explosion({ x: m.pos.x + Math.cos(angle) * 150, y: m.pos.y + Math.sin(angle) * 150 }, 250);
                            }, 1000);
                        }
                        
                        m.fireCDcycle = m.cycle + 30;
                    },
                    do() {}
                });
            }
        },
        
        addFlashPowers() {
            b.guns.push({
                name: "speed force",
                description: "super speed, time manipulation<br>fastest man alive",
                ammo: Infinity,
                ammoPack: Infinity,
                defaultAmmoPack: Infinity,
                have: false,
                speedBoost: 0,
                fire() {},
                do() {
                    if (input.fire) {
                        this.speedBoost = Math.min(this.speedBoost + 0.1, 5);
                        
                        // Speed force lightning
                        for (let i = 0; i < 3; i++) {
                            simulation.drawList.push({
                                x: m.pos.x + (Math.random() - 0.5) * 50,
                                y: m.pos.y + (Math.random() - 0.5) * 50,
                                radius: 10,
                                color: "#ff0",
                                time: 2
                            });
                        }
                        
                        // Enhanced movement
                        m.squirrelFx *= 1 + this.speedBoost * 0.2;
                        m.setMovement();
                        
                        // Damage nearby mobs from speed
                        for (let i = 0; i < mob.length; i++) {
                            if (mob[i].alive && Vector.magnitude(Vector.sub(mob[i].position, m.pos)) < 100) {
                                mob[i].damage(0.1 * this.speedBoost * m.dmgScale);
                            }
                        }
                    } else {
                        if (this.speedBoost > 0) {
                            m.squirrelFx /= 1 + this.speedBoost * 0.2;
                            m.setMovement();
                            this.speedBoost = 0;
                        }
                    }
                }
            });
        },
        
        addWonderWomanPowers() {
            b.guns.push({
                name: "lasso of truth",
                description: "bind and damage enemies<br>amazon warrior strength",
                ammo: Infinity,
                ammoPack: Infinity,
                defaultAmmoPack: Infinity,
                have: false,
                target: null,
                fire() {},
                do() {
                    if (input.fire && m.fireCDcycle < m.cycle) {
                        // Find nearest mob
                        let nearest = null;
                        let nearestDist = Infinity;
                        
                        for (let i = 0; i < mob.length; i++) {
                            if (mob[i].alive) {
                                const dist = Vector.magnitude(Vector.sub(mob[i].position, m.pos));
                                if (dist < nearestDist && dist < 500) {
                                    nearest = mob[i];
                                    nearestDist = dist;
                                }
                            }
                        }
                        
                        if (nearest) {
                            this.target = nearest;
                            
                            // Draw lasso
                            ctx.strokeStyle = "#ffd700";
                            ctx.lineWidth = 4;
                            ctx.beginPath();
                            ctx.moveTo(m.pos.x, m.pos.y);
                            ctx.lineTo(nearest.position.x, nearest.position.y);
                            ctx.stroke();
                            
                            // Bind and damage
                            Matter.Body.setVelocity(nearest, { x: 0, y: 0 });
                            nearest.damage(0.3 * m.dmgScale);
                            if (typeof mobs.statusStun === 'function') {
                                mobs.statusStun(nearest, 30);
                            }
                        }
                        
                        m.fireCDcycle = m.cycle + 15;
                    }
                }
            });
        },
        
        addGreenLanternAbilities() {
            // Already covered in lantern rings section
        },
        
        addIronManSuit() {
            b.guns.push({
                name: "iron man armor",
                description: "repulsor rays, unibeam, missiles<br>genius billionaire playboy philanthropist",
                ammo: 200,
                ammoPack: 50,
                defaultAmmoPack: 50,
                have: false,
                fire() {
                    const angle = m.angle;
                    const attackType = Math.floor(Math.random() * 3);
                    
                    if (attackType === 0) {
                        // Repulsor ray
                        const id = bullet.length;
                        bullet[id] = Bodies.circle(m.pos.x + Math.cos(angle) * 40, m.pos.y + Math.sin(angle) * 40, 10, spawn.propsIsNotHoldable);
                        Matter.Body.setVelocity(bullet[id], { x: Math.cos(angle) * 35, y: Math.sin(angle) * 35 });
                        bullet[id].collisionFilter.category = cat.bullet;
                        bullet[id].collisionFilter.mask = cat.mob;
                        bullet[id].dmg = 0.4 * m.dmgScale;
                        bullet[id].endCycle = m.cycle + 100;
                        bullet[id].do = function() {
                            simulation.drawList.push({ x: this.position.x, y: this.position.y, radius: 15, color: "#0cf", time: 3 });
                        };
                        Composite.add(engine.world, bullet[id]);
                    } else if (attackType === 1) {
                        // Unibeam
                        const range = 1200;
                        const start = { x: m.pos.x, y: m.pos.y };
                        const end = { x: start.x + Math.cos(angle) * range, y: start.y + Math.sin(angle) * range };
                        
                        ctx.strokeStyle = "#fff";
                        ctx.lineWidth = 30;
                        ctx.shadowBlur = 30;
                        ctx.shadowColor = "#0cf";
                        ctx.beginPath();
                        ctx.moveTo(start.x, start.y);
                        ctx.lineTo(end.x, end.y);
                        ctx.stroke();
                        ctx.shadowBlur = 0;
                        
                        for (let i = 0; i < mob.length; i++) {
                            if (mob[i].alive) {
                                const hit = vertexCollision(start, end, [[mob[i]]]);
                                if (hit.who) mob[i].damage(1.2 * m.dmgScale);
                            }
                        }
                    } else {
                        // Micro missiles
                        for (let i = 0; i < 5; i++) {
                            setTimeout(() => {
                                const spread = (i - 2) * 0.2;
                                const id = bullet.length;
                                bullet[id] = Bodies.rectangle(m.pos.x, m.pos.y, 8, 3, spawn.propsIsNotHoldable);
                                Matter.Body.setVelocity(bullet[id], {
                                    x: Math.cos(angle + spread) * 25,
                                    y: Math.sin(angle + spread) * 25
                                });
                                bullet[id].collisionFilter.category = cat.bullet;
                                bullet[id].collisionFilter.mask = cat.mob;
                                bullet[id].dmg = 0.15 * m.dmgScale;
                                bullet[id].endCycle = m.cycle + 80;
                                bullet[id].onEnd = function() {
                                    b.explosion(this.position, 80);
                                };
                                Composite.add(engine.world, bullet[id]);
                            }, i * 50);
                        }
                    }
                    
                    m.fireCDcycle = m.cycle + 20;
                },
                do() {
                    // Flight assistance
                    if (input.up) player.force.y -= player.mass * simulation.g * 0.5;
                }
            });
        },
        
        addThorPowers() {
            b.guns.push({
                name: "mjolnir",
                description: "god of thunder<br>lightning strikes and hammer throws",
                ammo: Infinity,
                ammoPack: Infinity,
                defaultAmmoPack: Infinity,
                have: false,
                charge: 0,
                fire() {},
                do() {
                    if (input.fire) {
                        this.charge = Math.min(this.charge + 1, 100);
                        
                        if (this.charge % 10 === 0) {
                            simulation.drawList.push({
                                x: m.pos.x,
                                y: m.pos.y,
                                radius: 80 + this.charge * 0.5,
                                color: "rgba(135, 206, 250, 0.3)",
                                time: 5
                            });
                        }
                    } else if (this.charge > 0) {
                        // Lightning strike
                        const numStrikes = Math.ceil(this.charge / 20);
                        
                        for (let i = 0; i < numStrikes; i++) {
                            const target = mob[Math.floor(Math.random() * mob.length)];
                            if (target && target.alive) {
                                ctx.strokeStyle = "#fff";
                                ctx.lineWidth = 5;
                                ctx.shadowBlur = 20;
                                ctx.shadowColor = "#87ceeb";
                                ctx.beginPath();
                                ctx.moveTo(m.pos.x, m.pos.y - 500);
                                ctx.lineTo(target.position.x, target.position.y);
                                ctx.stroke();
                                ctx.shadowBlur = 0;
                                
                                target.damage(0.6 * m.dmgScale);
                                b.explosion(target.position, 100, "rgba(135, 206, 250, 0.6)");
                            }
                        }
                        
                        this.charge = 0;
                        m.fireCDcycle = m.cycle + 40;
                    }
                }
            });
        },
        
        addHulkPowers() {
            b.guns.push({
                name: "hulk smash",
                description: "incredible strength<br>angrier = stronger",
                ammo: Infinity,
                ammoPack: Infinity,
                defaultAmmoPack: Infinity,
                have: false,
                rage: 0,
                fire() {},
                do() {
                    // Build rage when taking damage
                    if (m.lastHarmCycle + 60 > m.cycle) {
                        this.rage = Math.min(this.rage + 0.5, 100);
                    } else {
                        this.rage = Math.max(this.rage - 0.2, 0);
                    }
                    
                    // Damage boost from rage
                    const rageBoost = 1 + (this.rage * 0.03);
                    
                    if (input.fire && m.fireCDcycle < m.cycle) {
                        // Ground pound
                        b.explosion(m.pos, 300 * rageBoost, "rgba(0, 128, 0, 0.6)");
                        
                        // Shockwave
                        for (let i = 0; i < mob.length; i++) {
                            if (mob[i].alive) {
                                const dist = Vector.magnitude(Vector.sub(mob[i].position, m.pos));
                                if (dist < 400) {
                                    const knockback = Vector.mult(
                                        Vector.normalise(Vector.sub(mob[i].position, m.pos)),
                                        20 * rageBoost
                                    );
                                    Matter.Body.setVelocity(mob[i], knockback);
                                    mob[i].damage(0.5 * rageBoost * m.dmgScale);
                                }
                            }
                        }
                        
                        m.fireCDcycle = m.cycle + 45;
                    }
                }
            });
        },
        
        addSpiderManAbilities() {
            b.guns.push({
                name: "web shooters",
                description: "web slinging, wall crawling<br>spider-sense danger detection",
                ammo: 100,
                ammoPack: 25,
                defaultAmmoPack: 25,
                have: false,
                fire() {
                    const angle = m.angle;
                    const range = 800;
                    const start = { x: m.pos.x, y: m.pos.y };
                    const end = { x: start.x + Math.cos(angle) * range, y: start.y + Math.sin(angle) * range };
                    
                    const hit = vertexCollision(start, end, [map, mob]);
                    
                    if (hit.who) {
                        // Draw web
                        ctx.strokeStyle = "#fff";
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.moveTo(start.x, start.y);
                        ctx.lineTo(hit.x, hit.y);
                        ctx.stroke();
                        
                        if (hit.who.alive) {
                            // Web bind
                            Matter.Body.setVelocity(hit.who, { x: 0, y: 0 });
                            if (typeof mobs.statusSlow === 'function') {
                                mobs.statusSlow(hit.who, 120);
                            }
                        } else {
                            // Pull to wall
                            const pullForce = Vector.mult(
                                Vector.normalise(Vector.sub({ x: hit.x, y: hit.y }, m.pos)),
                                0.3
                            );
                            player.force.x += pullForce.x * player.mass;
                            player.force.y += pullForce.y * player.mass;
                        }
                    }
                    
                    m.fireCDcycle = m.cycle + 20;
                },
                do() {}
            });
        },
        
        addDoctorStrangeMagic() {
            const spells = ["eldritch blast", "crimson bands", "mirror dimension", "time stone", "astral projection"];
            
            for (let spell of spells) {
                b.guns.push({
                    name: `${spell}`,
                    description: `mystical ${spell}<br>master of mystic arts`,
                    ammo: 50,
                    ammoPack: 10,
                    defaultAmmoPack: 10,
                    have: false,
                    fire() {
                        const angle = m.angle;
                        
                        if (spell === "eldritch blast") {
                            const id = bullet.length;
                            bullet[id] = Bodies.polygon(m.pos.x, m.pos.y, 8, 15, spawn.propsIsNotHoldable);
                            Matter.Body.setVelocity(bullet[id], { x: Math.cos(angle) * 25, y: Math.sin(angle) * 25 });
                            bullet[id].collisionFilter.category = cat.bullet;
                            bullet[id].collisionFilter.mask = cat.mob;
                            bullet[id].dmg = 0.6 * m.dmgScale;
                            bullet[id].endCycle = m.cycle + 120;
                            bullet[id].do = function() {
                                ctx.save();
                                ctx.translate(this.position.x, this.position.y);
                                ctx.rotate(simulation.cycle * 0.1);
                                ctx.strokeStyle = "#ff8c00";
                                ctx.lineWidth = 3;
                                for (let i = 0; i < 3; i++) {
                                    ctx.strokeRect(-15 - i * 5, -15 - i * 5, 30 + i * 10, 30 + i * 10);
                                }
                                ctx.restore();
                            };
                            Composite.add(engine.world, bullet[id]);
                        } else if (spell === "time stone") {
                            simulation.timePlayerSkip(60);
                        } else if (spell === "mirror dimension") {
                            m.isCloak = true;
                            m.immuneCycle = m.cycle + 180;
                            setTimeout(() => { m.isCloak = false; }, 3000);
                        }
                        
                        m.fireCDcycle = m.cycle + 35;
                    },
                    do() {}
                });
            }
        },
        
        addDeadpoolPowers() {
            b.guns.push({
                name: "deadpool arsenal",
                description: "katanas, guns, regeneration<br>maximum effort!",
                ammo: Infinity,
                ammoPack: Infinity,
                defaultAmmoPack: Infinity,
                have: false,
                fire() {
                    const angle = m.angle;
                    const weaponChoice = Math.floor(Math.random() * 3);
                    
                    if (weaponChoice === 0) {
                        // Katana slash
                        for (let i = 0; i < mob.length; i++) {
                            if (mob[i].alive && Vector.magnitude(Vector.sub(mob[i].position, m.pos)) < 120) {
                                mob[i].damage(0.7 * m.dmgScale);
                            }
                        }
                        
                        ctx.save();
                        ctx.translate(m.pos.x, m.pos.y);
                        ctx.rotate(angle);
                        ctx.strokeStyle = "#c0c0c0";
                        ctx.lineWidth = 5;
                        ctx.beginPath();
                        ctx.arc(0, 0, 100, -0.5, 0.5);
                        ctx.stroke();
                        ctx.restore();
                    } else {
                        // Guns akimbo
                        for (let i = -1; i <= 1; i += 2) {
                            const id = bullet.length;
                            bullet[id] = Bodies.circle(
                                m.pos.x + Math.cos(angle + i * 0.3) * 30,
                                m.pos.y + Math.sin(angle + i * 0.3) * 30,
                                6,
                                spawn.propsIsNotHoldable
                            );
                            Matter.Body.setVelocity(bullet[id], {
                                x: Math.cos(angle + i * 0.1) * 32,
                                y: Math.sin(angle + i * 0.1) * 32
                            });
                            bullet[id].collisionFilter.category = cat.bullet;
                            bullet[id].collisionFilter.mask = cat.mob;
                            bullet[id].dmg = 0.3 * m.dmgScale;
                            bullet[id].endCycle = m.cycle + 90;
                            Composite.add(engine.world, bullet[id]);
                        }
                    }
                    
                    m.fireCDcycle = m.cycle + 12;
                },
                do() {
                    // Healing factor
                    if (m.cycle % 60 === 0 && m.health < m.maxHealth) {
                        m.addHealth(0.02);
                    }
                }
            });
        }
    };
    
    // Initialize when in experiment mode
    if (build.isExperimentSelection) {
        dcMarvelPowers.init();
    } else {
        // Wait for experiment mode
        const checkExperiment = setInterval(() => {
            if (build.isExperimentSelection) {
                dcMarvelPowers.init();
                clearInterval(checkExperiment);
            }
        }, 1000);
    }
})();
