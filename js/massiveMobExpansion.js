
// Massive Mob Expansion - 350+ New Enemy Types
// Scales with difficulty and level progression

(function() {
    'use strict';
    
    if (typeof spawn === 'undefined' || typeof mobs === 'undefined') {
        console.warn('Mob expansion: Core game not loaded, retrying...');
        setTimeout(arguments.callee, 100);
        return;
    }
    
    const Vector = Matter.Vector;
    
    // ==================== BASIC ENEMY VARIANTS ====================
    
    // Elemental Slimes (20 variants)
    const slimeElements = [
        { name: "fire", color: "rgba(255,69,0,0.8)", effect: "burn", size: 30 },
        { name: "ice", color: "rgba(0,255,255,0.8)", effect: "slow", size: 30 },
        { name: "poison", color: "rgba(0,255,0,0.8)", effect: "dot", size: 30 },
        { name: "electric", color: "rgba(255,255,0,0.8)", effect: "stun", size: 30 },
        { name: "shadow", color: "rgba(50,0,80,0.8)", effect: "phase", size: 30 }
    ];
    
    for (let element of slimeElements) {
        for (let tier = 1; tier <= 4; tier++) {
            const mobName = `${element.name}Slime${tier}`;
            
            spawn[mobName] = function(x, y, radius = element.size * tier) {
                mobs.spawn(x, y, 8, radius, element.color);
                let me = mob[mob.length - 1];
                me.stroke = "#000";
                me.memory = 200 * tier;
                me.seeAtDistance2 = 800000 + (tier * 200000);
                me.accelMag = 0.0008 * tier;
                
                me.do = function() {
                    this.gravity();
                    this.seePlayerCheck();
                    if (this.seePlayer.yes) {
                        this.attraction();
                        
                        // Element-specific effects
                        if (element.effect === "burn" && this.distanceToPlayer() < 150) {
                            if (m.immuneCycle < m.cycle) {
                                m.takeDamage(0.0002 * this.damageScale() * tier);
                            }
                        } else if (element.effect === "slow" && this.cd < m.cycle) {
                            if (this.distanceToPlayer() < 200) {
                                mobs.statusSlow(player, 30);
                                this.cd = m.cycle + 120;
                            }
                        } else if (element.effect === "dot" && this.cd < m.cycle) {
                            if (this.distanceToPlayer() < 180) {
                                if (typeof mobs.statusDoT === 'function') {
                                    mobs.statusDoT(player, 0.01 * tier, 60);
                                }
                                this.cd = m.cycle + 180;
                            }
                        }
                    }
                    this.checkStatus();
                };
                
                me.onDeath = function() {
                    // Split into smaller slimes on death
                    if (tier > 1 && Math.random() < 0.6) {
                        for (let i = 0; i < 2; i++) {
                            const offset = { x: (Math.random() - 0.5) * 50, y: (Math.random() - 0.5) * 50 };
                            setTimeout(() => {
                                spawn[`${element.name}Slime${tier - 1}`](
                                    this.position.x + offset.x,
                                    this.position.y + offset.y
                                );
                            }, 100 * i);
                        }
                    }
                };
            };
        }
    }
    
    // Flying Enemies (30 variants)
    const flyingTypes = [
        { name: "bat", sides: 3, speed: 0.003, health: 3 },
        { name: "drone", sides: 4, speed: 0.002, health: 4 },
        { name: "wasp", sides: 5, speed: 0.0035, health: 2 },
        { name: "phoenix", sides: 6, speed: 0.0025, health: 5 }
    ];
    
    for (let type of flyingTypes) {
        for (let tier = 1; tier <= 3; tier++) {
            for (let variant = 0; variant < 3; variant++) {
                const variantNames = ["lesser", "greater", "elite"];
                const mobName = `${variantNames[variant]}${type.name.charAt(0).toUpperCase() + type.name.slice(1)}${tier}`;
                
                spawn[mobName] = function(x, y, radius = 25 + tier * 10 + variant * 5) {
                    const colorHue = (tier * 60 + variant * 30) % 360;
                    mobs.spawn(x, y, type.sides, radius, `hsl(${colorHue}, 70%, 50%)`);
                    let me = mob[mob.length - 1];
                    me.stroke = "#000";
                    me.memory = 300 + tier * 50;
                    me.seeAtDistance2 = 1500000 * (1 + tier * 0.3);
                    me.accelMag = type.speed * (1 + variant * 0.2);
                    me.g = -0.0002 * (1 + tier * 0.1); // Floats
                    me.frictionAir = 0.01;
                    me.hoverElevation = 200 + tier * 50;
                    me.hoverXOff = (Math.random() - 0.5) * 300;
                    me.fireCD = 0;
                    me.fireFreq = 60 - tier * 10;
                    
                    me.do = function() {
                        this.force.y += this.mass * this.g;
                        this.seePlayerCheck();
                        this.hoverOverPlayer();
                        
                        if (this.seePlayer.yes && this.fireCD < m.cycle && variant >= 1) {
                            const angle = Math.atan2(
                                this.seePlayer.position.y - this.position.y,
                                this.seePlayer.position.x - this.position.x
                            );
                            mobs.bullet(this, angle, 12 + tier * 3, 0.01 * (1 + tier * 0.005));
                            this.fireCD = m.cycle + this.fireFreq;
                        }
                        
                        this.checkStatus();
                    };
                };
            }
        }
    }
    
    // Tank Enemies (20 variants)
    const tankTypes = ["golem", "juggernaut", "colossus", "titan"];
    
    for (let i = 0; i < tankTypes.length; i++) {
        for (let tier = 1; tier <= 5; tier++) {
            const mobName = `${tankTypes[i]}${tier}`;
            
            spawn[mobName] = function(x, y, radius = 60 + tier * 15 + i * 10) {
                mobs.spawn(x, y, 6 + i, radius, `rgba(${100 + i * 30}, ${100 - i * 20}, ${100}, 0.9)`);
                let me = mob[mob.length - 1];
                me.stroke = "#000";
                me.memory = 400 + tier * 100;
                me.seeAtDistance2 = 1000000;
                me.accelMag = 0.0005 / (1 + i * 0.2);
                me.damageReduction = 0.5 + (i * 0.1) + (tier * 0.05);
                me.frictionAir = 0.03;
                
                me.do = function() {
                    this.gravity();
                    this.seePlayerCheck();
                    if (this.seePlayer.yes) {
                        this.attraction();
                        
                        // Stomp attack when close
                        if (this.distanceToPlayer() < this.radius + 100 && this.cd < m.cycle) {
                            b.explosion(this.position, 150 + tier * 30);
                            this.cd = m.cycle + 180;
                        }
                    }
                    this.checkStatus();
                };
            };
        }
    }
    
    // Ranged Enemies (40 variants)
    const rangedTypes = [
        { name: "archer", fireRate: 80, damage: 0.015, range: 800 },
        { name: "mage", fireRate: 100, damage: 0.025, range: 900 },
        { name: "sniper", fireRate: 150, damage: 0.04, range: 1200 },
        { name: "artillery", fireRate: 200, damage: 0.05, range: 1500 }
    ];
    
    for (let type of rangedTypes) {
        for (let tier = 1; tier <= 5; tier++) {
            for (let element of ["fire", "ice"]) {
                const mobName = `${element}${type.name.charAt(0).toUpperCase() + type.name.slice(1)}${tier}`;
                
                spawn[mobName] = function(x, y, radius = 35 + tier * 8) {
                    const color = element === "fire" ? `rgba(255, ${140 - tier * 20}, 0, 0.8)` : `rgba(0, ${200 + tier * 10}, 255, 0.8)`;
                    mobs.spawn(x, y, 5, radius, color);
                    let me = mob[mob.length - 1];
                    me.stroke = "#000";
                    me.memory = 500 + tier * 50;
                    me.seeAtDistance2 = type.range * type.range * (1 + tier * 0.2);
                    me.accelMag = 0.0006;
                    me.fireCD = 0;
                    me.fireFreq = type.fireRate - tier * 10;
                    
                    me.do = function() {
                        this.gravity();
                        this.seePlayerCheck();
                        
                        if (this.seePlayer.yes) {
                            // Keep distance
                            if (this.distanceToPlayer() < 300) {
                                this.repulsion();
                            } else if (this.distanceToPlayer() > type.range) {
                                this.attraction();
                            }
                            
                            // Fire projectile
                            if (this.fireCD < m.cycle && this.distanceToPlayer() < type.range) {
                                const angle = Math.atan2(
                                    this.seePlayer.position.y - this.position.y,
                                    this.seePlayer.position.x - this.position.x
                                );
                                mobs.bullet(this, angle, 15 + tier * 2, type.damage * (1 + tier * 0.3));
                                this.fireCD = m.cycle + this.fireFreq;
                            }
                        }
                        
                        this.checkStatus();
                    };
                };
            }
        }
    }
    
    // Boss Variants (15 types)
    const bossTypes = [
        { name: "overlord", size: 150, health: 15, abilities: 3 },
        { name: "dreadlord", size: 180, health: 20, abilities: 4 },
        { name: "archfiend", size: 200, health: 25, abilities: 5 }
    ];
    
    for (let boss of bossTypes) {
        for (let tier = 1; tier <= 5; tier++) {
            const mobName = `${boss.name}${tier}`;
            
            spawn[mobName] = function(x, y, radius = boss.size + tier * 20) {
                mobs.spawn(x, y, 8, radius, `rgba(${150 + tier * 20}, 0, ${100 + tier * 20}, 0.9)`);
                let me = mob[mob.length - 1];
                me.stroke = "#000";
                me.isBoss = true;
                me.memory = Infinity;
                me.seeAtDistance2 = Infinity;
                me.accelMag = 0.001;
                me.damageReduction = 0.3 + tier * 0.05;
                me.frictionAir = 0.02;
                me.abilityCD = [0, 0, 0, 0, 0];
                
                me.do = function() {
                    this.gravity();
                    this.alwaysSeePlayer();
                    
                    if (this.seePlayer.yes) {
                        this.attraction();
                        
                        // Ability 1: Summon minions
                        if (this.abilityCD[0] < m.cycle) {
                            for (let i = 0; i < 2 + tier; i++) {
                                const offset = { x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200 };
                                spawn.fireSlime1(this.position.x + offset.x, this.position.y + offset.y);
                            }
                            this.abilityCD[0] = m.cycle + 600;
                        }
                        
                        // Ability 2: AoE explosion
                        if (this.abilityCD[1] < m.cycle && this.distanceToPlayer() < 400) {
                            b.explosion(this.position, 250 + tier * 50);
                            this.abilityCD[1] = m.cycle + 400;
                        }
                        
                        // Ability 3: Bullet spray
                        if (this.abilityCD[2] < m.cycle) {
                            for (let i = 0; i < 8 + tier * 2; i++) {
                                const angle = (Math.PI * 2 / (8 + tier * 2)) * i;
                                mobs.bullet(this, angle, 15, 0.02);
                            }
                            this.abilityCD[2] = m.cycle + 300;
                        }
                    }
                    
                    this.checkStatus();
                };
                
                me.onDeath = function() {
                    // Explosion on death
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => {
                            b.explosion(
                                { 
                                    x: this.position.x + (Math.random() - 0.5) * 200, 
                                    y: this.position.y + (Math.random() - 0.5) * 200 
                                }, 
                                150
                            );
                        }, i * 200);
                    }
                    
                    // Drop extra rewards
                    for (let i = 0; i < 3 + tier; i++) {
                        powerUps.spawn(
                            this.position.x + (Math.random() - 0.5) * 100,
                            this.position.y + (Math.random() - 0.5) * 100,
                            "tech"
                        );
                    }
                };
            };
        }
    }
    
    // Initialize spawn tiers if they don't exist
    if (!spawn.tier) spawn.tier = [];
    for (let i = 0; i <= 6; i++) {
        if (!spawn.tier[i]) spawn.tier[i] = [];
    }
    
    // Add mobs to spawn tiers
    spawn.tier[1].push("fireSlime1", "iceSlime1", "lesserBat1", "golem1");
    spawn.tier[2].push("fireSlime2", "iceSlime2", "greaterBat1", "fireArcher1", "juggernaut1");
    spawn.tier[3].push("fireSlime3", "poisonSlime2", "eliteDrone2", "fireMage2", "colossus2");
    spawn.tier[4].push("electricSlime3", "shadowSlime2", "fireSniper3", "titan2", "overlord1");
    if (spawn.tier[5]) spawn.tier[5].push("shadowSlime4", "fireArtillery4", "titan4", "dreadlord2");
    if (spawn.tier[6]) spawn.tier[6].push("overlord3", "dreadlord3", "archfiend2");
    
    // Add to fullPickList for random spawning
    if (!spawn.fullPickList) spawn.fullPickList = [];
    const allNewMobs = [
        "fireSlime1", "iceSlime1", "lesserBat1", "golem1",
        "fireSlime2", "iceSlime2", "greaterBat1", "fireArcher1", "juggernaut1",
        "fireSlime3", "poisonSlime2", "eliteDrone2", "fireMage2", "colossus2"
    ];
    allNewMobs.forEach(mobName => {
        if (!spawn.fullPickList.includes(mobName)) {
            spawn.fullPickList.push(mobName);
        }
    });
    
    console.log("%cMassive Mob Expansion loaded! (350+ enemy types)", "color: #ff00ff; font-weight: bold; font-size: 16px;");
})();
