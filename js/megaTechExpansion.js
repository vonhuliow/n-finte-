
<line_number>1</line_number>
// Mega Tech Expansion - 1000+ Insane Techs
(function() {
    'use strict';
    
    if (typeof tech === 'undefined' || typeof tech.tech === 'undefined') {
        console.warn("megaTechExpansion: waiting for tech system...");
        setTimeout(arguments.callee, 100);
        return;
    }
    
    const megaTechs = [];
    
    // Category 1: Summon Allies (100 techs)
    const summonTypes = ["dragon", "phoenix", "golem", "elemental", "demon", "angel", "titan", "beast", "spirit", "construct"];
    for (let i = 0; i < 100; i++) {
        const type = summonTypes[i % 10];
        const tier = Math.floor(i / 10) + 1;
        megaTechs.push({
            name: `summon ${type} tier ${tier}`,
            description: `summon a <strong>${type}</strong> ally that fights for you<br><strong>${tier}x</strong> power, lasts <strong>${30 + tier * 10}</strong> seconds`,
            maxCount: 3,
            count: 0,
            frequency: 1,
            effect() {
                tech[`summon${type}${tier}Count`] = (tech[`summon${type}${tier}Count`] || 0) + 1;
                
                setInterval(() => {
                    if (m.alive && Math.random() < 0.05) {
                        const angle = Math.random() * Math.PI * 2;
                        const dist = 100 + Math.random() * 100;
                        spawn[type] && spawn[type](
                            m.pos.x + Math.cos(angle) * dist,
                            m.pos.y + Math.sin(angle) * dist,
                            30 + tier * 10
                        );
                        
                        if (mob.length > 0) {
                            const ally = mob[mob.length - 1];
                            ally.isPlayerAlly = true;
                            ally.damageReduction *= 0.1;
                            ally.fill = `rgba(0, 255, 0, 0.6)`;
                            ally.stroke = "#0f0";
                        }
                    }
                }, 1000);
            },
            remove() {}
        });
    }
    
    // Category 2: Reality Manipulation (100 techs)
    const realityPowers = ["time", "space", "gravity", "dimension", "probability", "causality", "entropy", "matter", "energy", "void"];
    for (let i = 0; i < 100; i++) {
        const power = realityPowers[i % 10];
        const level = Math.floor(i / 10) + 1;
        megaTechs.push({
            name: `${power} manipulation ${level}`,
            description: `manipulate <strong>${power}</strong><br><strong>${level * 1.5}x</strong> <strong class='color-d'>damage</strong>, reality warps around you`,
            maxCount: 5,
            count: 0,
            frequency: 1,
            effect() {
                m.damageDone *= 1.5 * level;
                
                tech[`${power}Warp`] = true;
                m[`${power}Power`] = level;
                
                // Add visual effects
                simulation.drawList.push({
                    x: m.pos.x,
                    y: m.pos.y,
                    radius: 50 + level * 20,
                    color: `hsla(${i * 3.6}, 100%, 50%, 0.3)`,
                    time: simulation.drawTime * 2
                });
            },
            remove() {
                if (this.count && m.alive) m.damageDone /= (1.5 * level);
            }
        });
    }
    
    // Category 3: Elemental Mastery (100 techs)
    const elements = ["fire", "ice", "lightning", "earth", "wind", "water", "light", "dark", "poison", "arcane"];
    for (let i = 0; i < 100; i++) {
        const element = elements[i % 10];
        const mastery = Math.floor(i / 10) + 1;
        megaTechs.push({
            name: `${element} mastery ${mastery}`,
            description: `master <strong>${element}</strong> element<br>shots explode with <strong>${element}</strong> dealing <strong>${mastery * 2}x</strong> AOE damage`,
            maxCount: 10,
            count: 0,
            frequency: 1,
            effect() {
                tech[`${element}Mastery`] = (tech[`${element}Mastery`] || 0) + mastery;
                
                const originalBulletDo = bullet.do || (() => {});
                bullet.do = function() {
                    originalBulletDo.call(this);
                    
                    for (let j = 0; j < bullet.length; j++) {
                        if (bullet[j].do && Math.random() < 0.1) {
                            b.explosion(bullet[j].position, 100 * mastery);
                            simulation.drawList.push({
                                x: bullet[j].position.x,
                                y: bullet[j].position.y,
                                radius: 100 * mastery,
                                color: element === 'fire' ? 'rgba(255, 100, 0, 0.5)' :
                                       element === 'ice' ? 'rgba(0, 200, 255, 0.5)' :
                                       element === 'lightning' ? 'rgba(255, 255, 0, 0.5)' :
                                       'rgba(150, 0, 255, 0.5)',
                                time: 30
                            });
                        }
                    }
                };
            },
            remove() {}
        });
    }
    
    // Category 4: Godlike Powers (100 techs)
    const godPowers = ["omnipotence", "immortality", "omniscience", "creation", "destruction", "resurrection", "transcendence", "ascension", "divinity", "supremacy"];
    for (let i = 0; i < 100; i++) {
        const godPower = godPowers[i % 10];
        const divineLevel = Math.floor(i / 10) + 1;
        megaTechs.push({
            name: `${godPower} ${divineLevel}`,
            description: `achieve <strong>${godPower}</strong><br><strong>${divineLevel * 5}x</strong> all stats, become unstoppable`,
            maxCount: 1,
            count: 0,
            frequency: 1,
            effect() {
                m.damageDone *= 5 * divineLevel;
                m.damageReduction *= 0.1;
                m.maxHealth *= 5 * divineLevel;
                m.health = m.maxHealth;
                m.setMaxHealth();
                
                // Aura effect
                setInterval(() => {
                    if (m.alive) {
                        simulation.drawList.push({
                            x: m.pos.x,
                            y: m.pos.y,
                            radius: 200 + divineLevel * 50,
                            color: `hsla(${(m.cycle * 5) % 360}, 100%, 70%, 0.2)`,
                            time: 10
                        });
                    }
                }, 100);
            },
            remove() {}
        });
    }
    
    // Category 5: Army Builders (100 techs)
    for (let i = 0; i < 100; i++) {
        const armySize = (i + 1) * 5;
        megaTechs.push({
            name: `summon army ${i + 1}`,
            description: `summon <strong>${armySize}</strong> fighters<br>they deal <strong>${Math.floor(i / 10) + 1}x</strong> damage`,
            maxCount: 10,
            count: 0,
            frequency: 1,
            effect() {
                for (let j = 0; j < armySize; j++) {
                    setTimeout(() => {
                        if (m.alive) {
                            b.drone(m.pos);
                            if (bullet.length > 0) {
                                const bot = bullet[bullet.length - 1];
                                bot.endCycle = Infinity;
                                bot.damageReduction = 0.01;
                            }
                        }
                    }, j * 50);
                }
            },
            remove() {}
        });
    }
    
    // Category 6: Field Enhancers (100 techs)
    for (let i = 0; i < 100; i++) {
        const boost = (i + 1) * 0.5;
        megaTechs.push({
            name: `field amplifier ${i + 1}`,
            description: `<strong>+${boost.toFixed(1)}x</strong> field power<br>field effects last <strong>2x</strong> longer`,
            maxCount: 20,
            count: 0,
            frequency: 1,
            effect() {
                m.fieldDamage *= 1 + boost;
                m.fieldRange *= 1.2;
            },
            remove() {}
        });
    }
    
    // Category 7: Speed Demons (100 techs)
    for (let i = 0; i < 100; i++) {
        const speedBoost = (i + 1) * 0.1;
        megaTechs.push({
            name: `hyper speed ${i + 1}`,
            description: `<strong>+${(speedBoost * 100).toFixed(0)}%</strong> movement speed<br><strong>+${(speedBoost * 100).toFixed(0)}%</strong> fire rate`,
            maxCount: 50,
            count: 0,
            frequency: 1,
            effect() {
                m.squirrelFx *= 1 + speedBoost;
                m.setMovement();
                tech.fireRate /= 1 + speedBoost * 0.5;
                b.setFireCD();
            },
            remove() {}
        });
    }
    
    // Category 8: Defense Titans (100 techs)
    for (let i = 0; i < 100; i++) {
        const defenseBoost = (i + 1) * 0.05;
        megaTechs.push({
            name: `titanium armor ${i + 1}`,
            description: `<strong>-${(defenseBoost * 100).toFixed(0)}%</strong> damage taken<br><strong>+${i * 50}</strong> max health`,
            maxCount: 100,
            count: 0,
            frequency: 1,
            effect() {
                m.damageReduction *= 1 - defenseBoost;
                tech.extraMaxHealth += i * 0.5;
                m.setMaxHealth();
                m.addHealth(i * 0.5);
            },
            remove() {}
        });
    }
    
    // Category 9: Energy Masters (100 techs)
    for (let i = 0; i < 100; i++) {
        const energyBoost = (i + 1) * 10;
        megaTechs.push({
            name: `energy core ${i + 1}`,
            description: `<strong>+${energyBoost}</strong> max energy<br>regenerate <strong>${(i + 1) * 0.5}</strong> energy per second`,
            maxCount: 200,
            count: 0,
            frequency: 1,
            effect() {
                m.maxEnergy += energyBoost;
                m.fieldRegen *= 1.1;
                m.energy = m.maxEnergy;
            },
            remove() {}
        });
    }
    
    // Category 10: Chaos Powers (100 techs)
    for (let i = 0; i < 100; i++) {
        megaTechs.push({
            name: `chaos storm ${i + 1}`,
            description: `random explosions deal <strong>${(i + 1) * 5}x</strong> damage<br>create portals that spawn allies`,
            maxCount: 50,
            count: 0,
            frequency: 1,
            effect() {
                setInterval(() => {
                    if (m.alive && Math.random() < 0.2) {
                        const angle = Math.random() * Math.PI * 2;
                        const dist = 200 + Math.random() * 400;
                        const x = m.pos.x + Math.cos(angle) * dist;
                        const y = m.pos.y + Math.sin(angle) * dist;
                        
                        b.explosion({ x, y }, 150 * (i + 1));
                        
                        if (Math.random() < 0.3) {
                            b.drone({ x, y });
                        }
                    }
                }, 1000);
            },
            remove() {}
        });
    }
    
    // Add all mega techs to the tech array
    megaTechs.forEach(t => {
        tech.tech.push(t);
    });
    
    console.log(`%c🔥 MEGA TECH EXPANSION: ${megaTechs.length} insane techs loaded!`, "color: #ff0; font-size: 20px; font-weight: bold");
})();
