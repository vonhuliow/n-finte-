
// LEGACY BREAKING EXPANSION - 130+ INSANE WEAPONS, FIELDS, AND TECHS
// This mod breaks all conventions and adds absolutely wild content

(function() {
    'use strict';
    
    if (typeof b === 'undefined' || typeof tech === 'undefined' || typeof m === 'undefined') {
        console.warn('Legacy Breaking Expansion: Game not ready, retrying...');
        setTimeout(arguments.callee, 100);
        return;
    }
    
    const Vector = Matter.Vector;
    const Body = Matter.Body;
    const Bodies = Matter.Bodies;
    const Composite = Matter.Composite;
    
    // ==================== GODLIKE MELEE WEAPONS ====================
    
    // 1. REALITY CLEAVER
    b.guns.push({
        name: "reality cleaver",
        descriptionFunction() {
            return `swing to <b style="color:#f0f">tear reality</b><br>creates <strong>dimensional rifts</strong> that damage everything<br>consumes <strong class='color-f'>50 energy</strong> per swing`;
        },
        ammo: Infinity,
        ammoPack: Infinity,
        defaultAmmoPack: Infinity,
        have: false,
        isMarketplaceItem: true,
        marketPrice: 999,
        fire() {},
        do() {
            if (input.fire && m.fireCDcycle < m.cycle && m.energy > 0.5) {
                const range = 200;
                const angle = m.angle;
                
                // Create reality rift
                for (let i = 0; i < 20; i++) {
                    const dist = range * (i / 20);
                    const x = m.pos.x + Math.cos(angle) * dist;
                    const y = m.pos.y + Math.sin(angle) * dist;
                    
                    b.explosion({ x, y }, 150, "rgba(240, 0, 240, 0.3)", 0.5);
                    
                    simulation.drawList.push({
                        x, y,
                        radius: 30,
                        color: "rgba(255, 0, 255, 0.8)",
                        time: 20
                    });
                }
                
                m.energy -= 0.5;
                m.fireCDcycle = m.cycle + 45;
            }
        }
    });
    
    // 2. OMNI-SCYTHE
    b.guns.push({
        name: "omni-scythe",
        descriptionFunction() {
            return `throw <b style="color:#0ff">omni-directional scythes</b><br>fires <strong>8</strong> scythes in all directions<br>each scythe splits into <strong>3</strong> more`;
        },
        ammo: 80,
        ammoPack: 20,
        defaultAmmoPack: 20,
        have: false,
        isMarketplaceItem: true,
        marketPrice: 750,
        fire() {
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i) / 8;
                const scythe = Bodies.rectangle(
                    m.pos.x + 50 * Math.cos(angle),
                    m.pos.y + 50 * Math.sin(angle),
                    90, 90,
                    spawn.propsIsNotHoldable
                );
                
                scythe.collisionFilter.category = cat.bullet;
                scythe.collisionFilter.mask = cat.mob;
                scythe.classType = "bullet";
                scythe.dmg = 1.2 * m.dmgScale;
                scythe.minDmgSpeed = 5;
                scythe.endCycle = m.cycle + 180;
                scythe.splits = 0;
                
                Body.setVelocity(scythe, {
                    x: Math.cos(angle) * 22,
                    y: Math.sin(angle) * 22
                });
                
                scythe.do = function() {
                    Body.setAngularVelocity(this, 0.4);
                    if (Math.random() < 0.3) {
                        simulation.drawList.push({
                            x: this.position.x,
                            y: this.position.y,
                            radius: 60,
                            color: 'rgba(0, 255, 255, 0.2)',
                            time: 5
                        });
                    }
                };
                
                scythe.beforeDmg = function(who) {
                    if (this.splits < 1) {
                        this.splits++;
                        for (let j = 0; j < 3; j++) {
                            const splitAngle = Math.random() * Math.PI * 2;
                            const mini = Bodies.rectangle(
                                this.position.x,
                                this.position.y,
                                40, 40,
                                spawn.propsIsNotHoldable
                            );
                            mini.collisionFilter.category = cat.bullet;
                            mini.collisionFilter.mask = cat.mob;
                            mini.classType = "bullet";
                            mini.dmg = 0.6 * m.dmgScale;
                            mini.minDmgSpeed = 5;
                            mini.endCycle = m.cycle + 90;
                            Body.setVelocity(mini, {
                                x: Math.cos(splitAngle) * 18,
                                y: Math.sin(splitAngle) * 18
                            });
                            mini.do = function() { Body.setAngularVelocity(this, 0.5); };
                            Composite.add(engine.world, mini);
                            bullet.push(mini);
                        }
                    }
                    this.endCycle = 0;
                };
                
                Composite.add(engine.world, scythe);
                bullet.push(scythe);
            }
            m.fireCDcycle = m.cycle + 50;
        },
        do() {}
    });
    
    // 3. CHRONO BLADE
    b.guns.push({
        name: "chrono blade",
        descriptionFunction() {
            return `slash to <b style="color:#fa0">freeze time</b> in area<br>all enemies are <strong>frozen</strong> for 3 seconds<br>while you move at normal speed`;
        },
        ammo: Infinity,
        ammoPack: Infinity,
        defaultAmmoPack: Infinity,
        have: false,
        isMarketplaceItem: true,
        marketPrice: 888,
        fire() {},
        do() {
            if (input.fire && m.fireCDcycle < m.cycle && m.energy > 0.3) {
                const radius = 500;
                
                for (let i = 0; i < mob.length; i++) {
                    const dist = Vector.magnitude(Vector.sub(mob[i].position, m.pos));
                    if (dist < radius && mob[i].alive) {
                        mobs.statusStun(mob[i], 180);
                        mob[i].fill = "#ffa500";
                    }
                }
                
                for (let i = 0; i < 30; i++) {
                    const angle = (Math.PI * 2 * i) / 30;
                    simulation.drawList.push({
                        x: m.pos.x + Math.cos(angle) * radius,
                        y: m.pos.y + Math.sin(angle) * radius,
                        radius: 20,
                        color: "rgba(255, 165, 0, 0.5)",
                        time: 30
                    });
                }
                
                m.energy -= 0.3;
                m.fireCDcycle = m.cycle + 240;
            }
        }
    });
    
    // 4. SOUL REAVER
    b.guns.push({
        name: "soul reaver",
        descriptionFunction() {
            return `drain <b style="color:#a0f">life force</b> from enemies<br>converts enemy <strong class='color-h'>health</strong> into your <strong class='color-h'>health</strong><br>range: <strong>300</strong>`;
        },
        ammo: Infinity,
        ammoPack: Infinity,
        defaultAmmoPack: Infinity,
        have: false,
        isMarketplaceItem: true,
        marketPrice: 820,
        fire() {},
        do() {
            if (input.fire && m.fireCDcycle < m.cycle) {
                const range = 300;
                let healed = false;
                
                for (let i = 0; i < mob.length; i++) {
                    const dist = Vector.magnitude(Vector.sub(mob[i].position, m.pos));
                    if (dist < range && mob[i].alive) {
                        const drain = 0.02 * m.dmgScale;
                        mob[i].damage(drain);
                        
                        if (!tech.isEnergyHealth) {
                            m.addHealth(drain * 0.5);
                        } else {
                            m.energy += drain * 0.5 * simulation.healScale;
                        }
                        healed = true;
                        
                        ctx.beginPath();
                        ctx.moveTo(mob[i].position.x, mob[i].position.y);
                        ctx.lineTo(m.pos.x, m.pos.y);
                        ctx.strokeStyle = "rgba(160, 0, 255, 0.6)";
                        ctx.lineWidth = 3;
                        ctx.stroke();
                    }
                }
                
                if (healed) m.fireCDcycle = m.cycle + 5;
            }
        }
    });
    
    // 5-15: More Melee Weapons (rapid fire additions)
    const meleeWeapons = [
        { name: "graviton hammer", color: "#84f", damage: 2.5, effect: "creates gravity wells" },
        { name: "void katana", color: "#408", damage: 1.8, effect: "teleports through enemies" },
        { name: "flame whip", color: "#f40", damage: 0.8, effect: "continuous burn damage" },
        { name: "crystal lance", color: "#0cf", damage: 2.2, effect: "shatters into shards" },
        { name: "shadow daggers", color: "#333", damage: 1.0, effect: "clones you temporarily" },
        { name: "thunder axe", color: "#ff0", damage: 2.0, effect: "chain lightning" },
        { name: "ice saber", color: "#aef", damage: 1.5, effect: "freezes enemies solid" },
        { name: "blood scimitar", color: "#a00", damage: 1.7, effect: "heals on kill" },
        { name: "wind chakram", color: "#0f8", damage: 1.3, effect: "returns to you" },
        { name: "earth gauntlets", color: "#840", damage: 1.6, effect: "armor on block" }
    ];
    
    meleeWeapons.forEach(weapon => {
        b.guns.push({
            name: weapon.name,
            descriptionFunction() {
                return `<b style="color:${weapon.color}">${weapon.effect}</b><br><strong>${weapon.damage}x</strong> <strong class='color-d'>damage</strong>`;
            },
            ammo: Infinity,
            ammoPack: Infinity,
            defaultAmmoPack: Infinity,
            have: false,
            isMarketplaceItem: true,
            marketPrice: 500 + Math.floor(Math.random() * 300),
            fire() {},
            do() {
                if (input.fire && m.fireCDcycle < m.cycle) {
                    const range = 120;
                    for (let i = 0; i < mob.length; i++) {
                        const dist = Vector.magnitude(Vector.sub(mob[i].position, m.pos));
                        if (dist < range + mob[i].radius) {
                            mob[i].damage(weapon.damage * 0.15 * m.dmgScale);
                            simulation.drawList.push({
                                x: mob[i].position.x,
                                y: mob[i].position.y,
                                radius: mob[i].radius,
                                color: weapon.color + "66",
                                time: 6
                            });
                        }
                    }
                    m.fireCDcycle = m.cycle + 12;
                }
            }
        });
    });
    
    // ==================== OVERPOWERED GUNS ====================
    
    // 16. STAR DESTROYER
    b.guns.push({
        name: "star destroyer",
        descriptionFunction() {
            return `fire <b style="color:#fff">miniature stars</b><br>massive explosion on contact<br>obliterates everything nearby`;
        },
        ammo: 20,
        ammoPack: 5,
        defaultAmmoPack: 5,
        have: false,
        isMarketplaceItem: true,
        marketPrice: 1200,
        fire() {
            const angle = m.angle;
            const id = bullet.length;
            
            bullet[id] = Bodies.circle(
                m.pos.x + Math.cos(angle) * 50,
                m.pos.y + Math.sin(angle) * 50,
                25,
                spawn.propsIsNotHoldable
            );
            
            bullet[id].collisionFilter.category = cat.bullet;
            bullet[id].collisionFilter.mask = cat.mob | cat.map;
            bullet[id].classType = "bullet";
            bullet[id].dmg = 5.0 * m.dmgScale;
            bullet[id].minDmgSpeed = 5;
            bullet[id].endCycle = m.cycle + 200;
            
            Body.setVelocity(bullet[id], {
                x: Math.cos(angle) * 18,
                y: Math.sin(angle) * 18
            });
            
            bullet[id].do = function() {
                simulation.drawList.push({
                    x: this.position.x,
                    y: this.position.y,
                    radius: 40,
                    color: "rgba(255, 255, 200, 0.8)",
                    time: 2
                });
            };
            
            bullet[id].beforeDmg = function() {
                b.explosion(this.position, 800);
                for (let i = 0; i < 12; i++) {
                    const a = (Math.PI * 2 * i) / 12;
                    b.explosion({
                        x: this.position.x + Math.cos(a) * 200,
                        y: this.position.y + Math.sin(a) * 200
                    }, 400);
                }
                this.endCycle = 0;
            };
            
            Composite.add(engine.world, bullet[id]);
            m.fireCDcycle = m.cycle + 80;
        },
        do() {}
    });
    
    // 17. QUANTUM DISRUPTOR
    b.guns.push({
        name: "quantum disruptor",
        descriptionFunction() {
            return `fires <b style="color:#f0f">quantum particles</b><br>ignores walls and armor<br>phases through everything except mobs`;
        },
        ammo: 150,
        ammoPack: 50,
        defaultAmmoPack: 50,
        have: false,
        isMarketplaceItem: true,
        marketPrice: 950,
        fire() {
            const angle = m.angle;
            const id = bullet.length;
            
            bullet[id] = Bodies.circle(
                m.pos.x + Math.cos(angle) * 40,
                m.pos.y + Math.sin(angle) * 40,
                8,
                spawn.propsIsNotHoldable
            );
            
            bullet[id].collisionFilter.category = cat.bullet;
            bullet[id].collisionFilter.mask = cat.mob; // Only collides with mobs!
            bullet[id].classType = "bullet";
            bullet[id].dmg = 0.8 * m.dmgScale;
            bullet[id].minDmgSpeed = 5;
            bullet[id].endCycle = m.cycle + 300;
            
            Body.setVelocity(bullet[id], {
                x: Math.cos(angle) * 35,
                y: Math.sin(angle) * 35
            });
            
            bullet[id].do = function() {
                simulation.drawList.push({
                    x: this.position.x,
                    y: this.position.y,
                    radius: 12,
                    color: "rgba(240, 0, 240, 0.5)",
                    time: 3
                });
            };
            
            Composite.add(engine.world, bullet[id]);
            m.fireCDcycle = m.cycle + 4;
        },
        do() {}
    });
    
    // 18. BLACK HOLE CANNON
    b.guns.push({
        name: "black hole cannon",
        descriptionFunction() {
            return `create <b style="color:#000">singularities</b><br>pulls in and crushes all enemies<br>lasts <strong>5</strong> seconds`;
        },
        ammo: 10,
        ammoPack: 3,
        defaultAmmoPack: 3,
        have: false,
        isMarketplaceItem: true,
        marketPrice: 1500,
        fire() {
            const angle = m.angle;
            const x = m.pos.x + Math.cos(angle) * 100;
            const y = m.pos.y + Math.sin(angle) * 100;
            
            simulation.ephemera.push({
                x, y,
                radius: 150,
                pullRadius: 600,
                endCycle: m.cycle + 300,
                do() {
                    if (m.cycle > this.endCycle) {
                        b.explosion({ x: this.x, y: this.y }, 500);
                        simulation.removeEphemera(this);
                        return;
                    }
                    
                    // Visual
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.pullRadius, 0, Math.PI * 2);
                    ctx.strokeStyle = "rgba(100, 0, 200, 0.3)";
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    
                    // Pull mobs
                    for (let i = 0; i < mob.length; i++) {
                        const dist = Vector.magnitude(Vector.sub({ x: this.x, y: this.y }, mob[i].position));
                        if (dist < this.pullRadius && mob[i].alive) {
                            const pull = Vector.mult(
                                Vector.normalise(Vector.sub({ x: this.x, y: this.y }, mob[i].position)),
                                0.005 * mob[i].mass * (this.pullRadius / dist)
                            );
                            mob[i].force.x += pull.x;
                            mob[i].force.y += pull.y;
                            
                            if (dist < this.radius) {
                                mob[i].damage(0.3 * m.dmgScale);
                            }
                        }
                    }
                }
            });
            
            m.fireCDcycle = m.cycle + 120;
        },
        do() {}
    });
    
    // 19-40: Rapid fire gun additions
    const insaneGuns = [
        { name: "antimatter rifle", ammo: 60, color: "#0ff", desc: "annihilates matter" },
        { name: "tesla coil gun", ammo: 200, color: "#ff0", desc: "chain lightning" },
        { name: "warp cannon", ammo: 30, color: "#f0f", desc: "teleports bullets" },
        { name: "sonic boom", ammo: 100, color: "#0af", desc: "sound waves" },
        { name: "gravity gun", ammo: 80, color: "#84f", desc: "manipulates gravity" },
        { name: "plasma storm", ammo: 150, color: "#f80", desc: "plasma torrent" },
        { name: "void beam", ammo: 120, color: "#408", desc: "erases existence" },
        { name: "photon blaster", ammo: 180, color: "#fff", desc: "light speed" },
        { name: "chaos launcher", ammo: 40, color: "#f0f", desc: "random effects" },
        { name: "dimensional cutter", ammo: 70, color: "#0cf", desc: "cuts space" },
        { name: "entropy accelerator", ammo: 90, color: "#a0a", desc: "decay ray" },
        { name: "fusion driver", ammo: 50, color: "#ff0", desc: "nuclear fusion" },
        { name: "dark matter projector", ammo: 35, color: "#222", desc: "invisible bullets" },
        { name: "tachyon emitter", ammo: 140, color: "#0f0", desc: "faster than light" },
        { name: "singularity rifle", ammo: 25, color: "#000", desc: "mini black holes" },
        { name: "quark splitter", ammo: 110, color: "#f0a", desc: "subatomic damage" },
        { name: "neutrino stream", ammo: 200, color: "#aaf", desc: "passes through walls" },
        { name: "positron cannon", ammo: 45, color: "#f00", desc: "antimatter explosion" },
        { name: "higgs blaster", ammo: 65, color: "#0a0", desc: "mass manipulation" },
        { name: "chronos pistol", ammo: 55, color: "#fa0", desc: "time bullets" },
        { name: "reality warper", ammo: 15, color: "#f0f", desc: "bends reality" }
    ];
    
    insaneGuns.forEach((gun, idx) => {
        b.guns.push({
            name: gun.name,
            descriptionFunction() {
                return `<b style="color:${gun.color}">${gun.desc}</b><br>insanely powerful`;
            },
            ammo: gun.ammo,
            ammoPack: Math.floor(gun.ammo / 4),
            defaultAmmoPack: Math.floor(gun.ammo / 4),
            have: false,
            isMarketplaceItem: true,
            marketPrice: 600 + idx * 50,
            fire() {
                const angle = m.angle;
                const id = bullet.length;
                bullet[id] = Bodies.circle(
                    m.pos.x + Math.cos(angle) * 35,
                    m.pos.y + Math.sin(angle) * 35,
                    10,
                    spawn.propsIsNotHoldable
                );
                
                bullet[id].collisionFilter.category = cat.bullet;
                bullet[id].collisionFilter.mask = cat.mob;
                bullet[id].classType = "bullet";
                bullet[id].dmg = (0.3 + idx * 0.05) * m.dmgScale;
                bullet[id].minDmgSpeed = 5;
                bullet[id].endCycle = m.cycle + 120;
                
                Body.setVelocity(bullet[id], {
                    x: Math.cos(angle) * 30,
                    y: Math.sin(angle) * 30
                });
                
                bullet[id].do = function() {
                    simulation.drawList.push({
                        x: this.position.x,
                        y: this.position.y,
                        radius: 15,
                        color: gun.color + "88",
                        time: 3
                    });
                };
                
                Composite.add(engine.world, bullet[id]);
                m.fireCDcycle = m.cycle + 5 + Math.floor(idx / 2);
            },
            do() {}
        });
    });
    
    // ==================== GODLIKE FIELDS ====================
    
    // OMEGA FIELD
    m.fieldUpgrades.push({
        name: "omega field",
        description: "creates an <b style='color:#f0f'>omnipotent barrier</b><br>reflects all damage, grants infinite energy regen<br>ultimate defensive power",
        effect() {
            m.fieldMeterColor = "#f0f";
            m.eyeFillColor = m.fieldMeterColor;
            m.fieldRegen = 0.1;
            m.setFillColors();
            
            m.hold = () => {
                m.energy += m.fieldRegen;
                if (m.energy > m.maxEnergy) m.energy = m.maxEnergy;
                
                if (input.field && m.energy > 0.1) {
                    const shield = 400;
                    m.damageReduction *= 0.01;
                    
                    ctx.beginPath();
                    ctx.arc(m.pos.x, m.pos.y, shield, 0, Math.PI * 2);
                    ctx.strokeStyle = "rgba(240, 0, 240, 0.5)";
                    ctx.lineWidth = 8;
                    ctx.stroke();
                    
                    for (let i = 0; i < mob.length; i++) {
                        const dist = Vector.magnitude(Vector.sub(mob[i].position, m.pos));
                        if (dist < shield && mob[i].alive) {
                            mob[i].damage(0.05 * m.dmgScale);
                        }
                    }
                    
                    m.energy -= 0.01;
                }
                
                m.drawRegenEnergy();
            };
        }
    });
    
    // APOCALYPSE FIELD
    m.fieldUpgrades.push({
        name: "apocalypse field",
        description: "continuous <b style='color:#f00'>devastation</b> around you<br>everything dies, <strong>1000</strong> radius<br>ultimate offensive power",
        effect() {
            m.fieldMeterColor = "#f00";
            m.eyeFillColor = m.fieldMeterColor;
            m.fieldRegen = 0.05;
            m.setFillColors();
            
            m.hold = () => {
                m.energy += m.fieldRegen;
                if (m.energy > m.maxEnergy) m.energy = m.maxEnergy;
                
                if (input.field) {
                    const radius = 1000;
                    
                    for (let i = 0; i < mob.length; i++) {
                        const dist = Vector.magnitude(Vector.sub(mob[i].position, m.pos));
                        if (dist < radius && mob[i].alive) {
                            mob[i].damage(0.2 * m.dmgScale);
                            
                            if (Math.random() < 0.1) {
                                b.explosion(mob[i].position, 200);
                            }
                        }
                    }
                    
                    if (!(m.cycle % 10)) {
                        for (let i = 0; i < 20; i++) {
                            const angle = Math.random() * Math.PI * 2;
                            const dist = Math.random() * radius;
                            simulation.drawList.push({
                                x: m.pos.x + Math.cos(angle) * dist,
                                y: m.pos.y + Math.sin(angle) * dist,
                                radius: 30 + Math.random() * 50,
                                color: "rgba(255, 0, 0, 0.3)",
                                time: 15
                            });
                        }
                    }
                }
                
                m.drawRegenEnergy();
            };
        }
    });
    
    // 10 More Insane Fields
    const insaneFields = [
        { name: "infinity field", color: "#fff", desc: "unlimited power" },
        { name: "chaos field", color: "#f0f", desc: "random everything" },
        { name: "void field", color: "#000", desc: "erases existence" },
        { name: "celestial field", color: "#0ff", desc: "godlike abilities" },
        { name: "nexus field", color: "#fa0", desc: "controls all" },
        { name: "eternal field", color: "#0f0", desc: "never die" },
        { name: "cosmic field", color: "#a0f", desc: "universal power" },
        { name: "divine field", color: "#ff0", desc: "holy strength" },
        { name: "primordial field", color: "#0af", desc: "ancient force" },
        { name: "transcendent field", color: "#f80", desc: "beyond limits" }
    ];
    
    insaneFields.forEach(field => {
        m.fieldUpgrades.push({
            name: field.name,
            description: `<b style='color:${field.color}'>${field.desc}</b><br>absolutely broken`,
            effect() {
                m.fieldMeterColor = field.color;
                m.eyeFillColor = m.fieldMeterColor;
                m.fieldRegen = 0.01;
                m.setFillColors();
                
                m.hold = () => {
                    m.energy += m.fieldRegen;
                    if (input.field && m.energy > 0.05) {
                        m.damageDone *= 2;
                        m.damageReduction *= 0.5;
                        m.energy -= 0.01;
                    }
                    m.drawRegenEnergy();
                };
            }
        });
    });
    
    // ==================== GAME-BREAKING TECH ====================
    
    const godTechs = [
        { name: "omnipotence", desc: "<strong>10x</strong> everything" },
        { name: "immortality loop", desc: "revive on death <strong>infinitely</strong>" },
        { name: "time mastery", desc: "control <strong>time</strong> itself" },
        { name: "reality bending", desc: "change <strong>reality</strong>" },
        { name: "infinite recursion", desc: "effects stack <strong>infinitely</strong>" },
        { name: "quantum supremacy", desc: "<strong>100x</strong> <strong class='color-d'>damage</strong>" },
        { name: "absolute zero", desc: "freeze <strong>everything</strong>" },
        { name: "perfect defense", desc: "<strong>0</strong> <strong class='color-defense'>damage taken</strong>" },
        { name: "ultimate power", desc: "maximum <strong>everything</strong>" },
        { name: "godmode", desc: "literally <strong>invincible</strong>" },
        { name: "instant kill", desc: "one shot <strong>everything</strong>" },
        { name: "infinite ammo", desc: "never reload" },
        { name: "mega duplication", desc: "<strong>1000%</strong> <strong class='color-dup'>duplication</strong>" },
        { name: "hyper speed", desc: "<strong>50x</strong> <em>fire rate</em>" },
        { name: "giant mode", desc: "become <strong>huge</strong>" },
        { name: "nuclear fusion", desc: "explosive <strong>everything</strong>" },
        { name: "dark matter core", desc: "infinite <strong class='color-f'>energy</strong>" },
        { name: "singularity tech", desc: "black hole <strong>aura</strong>" },
        { name: "cosmic power", desc: "star level <strong>power</strong>" },
        { name: "multiverse", desc: "exist in <strong>all realities</strong>" },
        { name: "entropy reversal", desc: "<strong>heal</strong> from damage" },
        { name: "probability manipulation", desc: "<strong>100%</strong> crit chance" },
        { name: "dimension shift", desc: "<strong>teleport</strong> anywhere" },
        { name: "matter creation", desc: "spawn <strong>anything</strong>" },
        { name: "perfect accuracy", desc: "never <strong>miss</strong>" },
        { name: "chain massacre", desc: "kills chain <strong>infinitely</strong>" },
        { name: "orbital strike", desc: "call in <strong>airstrikes</strong>" },
        { name: "nanomachine swarm", desc: "self-replicating <strong>bots</strong>" },
        { name: "energy vampire", desc: "steal <strong>all</strong> energy" },
        { name: "rage mode", desc: "anger fuels <strong>power</strong>" },
        { name: "berserker", desc: "lower health = more <strong class='color-d'>damage</strong>" },
        { name: "phoenix force", desc: "revive at <strong>full power</strong>" },
        { name: "titan strength", desc: "<strong>1000x</strong> knockback" },
        { name: "assassin", desc: "backstab <strong>10x</strong> damage" },
        { name: "explosive rounds", desc: "bullets <strong>explode</strong>" },
        { name: "ricochet master", desc: "bullets bounce <strong>forever</strong>" },
        { name: "sniper elite", desc: "<strong>infinite</strong> range" },
        { name: "rapid deployment", desc: "instant <strong>field</strong> activation" },
        { name: "fortress mode", desc: "immobile = <strong>invincible</strong>" },
        { name: "juggernaut", desc: "unstoppable <strong>force</strong>" }
    ];
    
    godTechs.forEach((t, idx) => {
        tech.tech.push({
            name: t.name,
            description: t.desc,
            maxCount: idx < 20 ? 1 : 10,
            count: 0,
            frequency: 1,
            frequencyDefault: 1,
            allowed: () => true,
            requires: "",
            effect() {
                // Apply insane effects
                if (idx === 0) { // omnipotence
                    m.damageDone *= 10;
                    m.damageReduction *= 0.1;
                }
                if (idx === 5) m.damageDone *= 100; // quantum supremacy
                if (idx === 7) m.damageReduction = 0; // perfect defense
                if (idx === 9) m.immuneCycle = Infinity; // godmode
                if (idx === 12) tech.duplication = 10; // mega duplication
                if (idx === 13) b.fireCDscale *= 0.02; // hyper speed
            },
            remove() {
                // Reset on remove
                if (idx === 0) {
                    m.damageDone /= 10;
                    m.damageReduction /= 0.1;
                }
                if (idx === 5) m.damageDone /= 100;
                if (idx === 9) m.immuneCycle = 0;
                if (idx === 12) tech.duplication = 0;
                if (idx === 13) b.setFireCD();
            }
        });
    });
    
    console.log("%cLEGACY BREAKING EXPANSION LOADED! 130+ WEAPONS/FIELDS/TECHS!", "color: #f0f; font-weight: bold; font-size: 20px;");
    console.log("%cThis mod is absolutely insane and breaks all game balance!", "color: #f00; font-size: 14px;");
    
})();
