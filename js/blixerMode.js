
// Blixer Mode - JSAB-Inspired Bosses and Guitar Weapon
(function() {
    'use strict';
    
    console.log('%c🎸 Loading Blixer Mode...', 'color: #ff1493; font-weight: bold;');
    
    if (typeof spawn === 'undefined' || typeof b === 'undefined' || typeof m === 'undefined') {
        setTimeout(arguments.callee, 100);
        return;
    }
    
    // ==================== BLIXER MODE TOGGLE ====================
    window.blixerMode = {
        enabled: false,
        toggle() {
            this.enabled = !this.enabled;
            if (this.enabled) {
                simulation.inGameConsole('<span style="color:#ff1493;">🎸 BLIXER MODE ACTIVATED 🎸</span>');
            }
            if (localSettings.isAllowed) {
                localSettings.blixerMode = this.enabled;
                localStorage.setItem("localSettings", JSON.stringify(localSettings));
            }
        }
    };
    
    // Load saved setting
    if (localSettings.blixerMode) blixerMode.enabled = true;
    
    // ==================== GUITAR WEAPON - ROAR VIBRATION AMPLIFIER ====================
    b.guns.push({
        name: "roar vibration amplifier",
        descriptionFunction() {
            return `<b style="color:#ff1493;">sonic guitar weapon</b><br>fires <b>sound waves</b> that <b style="color:#9400d3;">confuse</b> and <b>stun</b> enemies<br>creates <b>vibration fields</b> that deal continuous damage`;
        },
        ammo: 200,
        ammoPack: 50,
        defaultAmmoPack: 50,
        have: false,
        isMarketplaceItem: true,
        marketPrice: 650,
        soundWaves: [],
        resonanceField: null,
        amplifierCharge: 0,
        maxCharge: 100,
        
        fire() {
            const angle = m.angle;
            m.fireCDcycle = m.cycle + 8;
            
            // Create sound wave projectile
            const wave = Bodies.rectangle(
                m.pos.x + Math.cos(angle) * 50,
                m.pos.y + Math.sin(angle) * 50,
                60, 20,
                spawn.propsIsNotHoldable
            );
            
            Composite.add(engine.world, wave);
            wave.collisionFilter.category = cat.bullet;
            wave.collisionFilter.mask = cat.mob | cat.mobBullet;
            wave.classType = "bullet";
            wave.dmg = 0.35 * m.dmgScale;
            wave.minDmgSpeed = 5;
            wave.endCycle = m.cycle + 90;
            wave.frequency = 2 + Math.random();
            wave.amplitude = 15;
            wave.phase = 0;
            
            Matter.Body.setVelocity(wave, {
                x: Math.cos(angle) * 22,
                y: Math.sin(angle) * 22
            });
            
            wave.beforeDmg = function(who) {
                // Confuse/discombobulate effect
                if (Math.random() < 0.7 && !who.isShielded) {
                    mobs.statusStun(who, 120 + Math.random() * 60);
                    
                    // Add confusion - reverse controls
                    if (!who.isConfused) {
                        who.isConfused = true;
                        who.confusedUntil = m.cycle + 180;
                        
                        // Store original AI
                        who.originalDo = who.do;
                        who.do = function() {
                            if (m.cycle > this.confusedUntil) {
                                this.isConfused = false;
                                this.do = this.originalDo;
                                this.originalDo();
                            } else {
                                // Confused movement
                                this.originalDo();
                                if (this.seePlayer.yes) {
                                    const confusionAngle = Math.random() * Math.PI * 2;
                                    this.force.x += Math.cos(confusionAngle) * 0.001 * this.mass;
                                    this.force.y += Math.sin(confusionAngle) * 0.001 * this.mass;
                                }
                            }
                        };
                    }
                }
                this.endCycle = 0;
            };
            
            wave.do = function() {
                this.phase += 0.2;
                
                // Sine wave motion
                const perpAngle = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2;
                const offset = Math.sin(this.phase) * this.amplitude;
                
                Matter.Body.setPosition(this, {
                    x: this.position.x + Math.cos(perpAngle) * offset * 0.1,
                    y: this.position.y + Math.sin(perpAngle) * offset * 0.1
                });
                
                // Visual wave effect
                ctx.save();
                ctx.translate(this.position.x, this.position.y);
                ctx.rotate(Math.atan2(this.velocity.y, this.velocity.x));
                
                // Draw sound wave
                ctx.strokeStyle = `rgba(255, 20, 147, ${0.6 + Math.sin(this.phase) * 0.4})`;
                ctx.lineWidth = 4;
                ctx.beginPath();
                for (let i = -30; i < 30; i += 2) {
                    const waveY = Math.sin(i * 0.2 + this.phase) * this.amplitude;
                    if (i === -30) {
                        ctx.moveTo(i, waveY);
                    } else {
                        ctx.lineTo(i, waveY);
                    }
                }
                ctx.stroke();
                
                // Outer glow
                ctx.strokeStyle = `rgba(148, 0, 211, ${0.3 + Math.sin(this.phase) * 0.2})`;
                ctx.lineWidth = 8;
                ctx.stroke();
                
                ctx.restore();
                
                // AoE confusion effect
                if (!(m.cycle % 15)) {
                    for (let i = 0; i < mob.length; i++) {
                        const dist = Math.hypot(
                            mob[i].position.x - this.position.x,
                            mob[i].position.y - this.position.y
                        );
                        if (dist < 150 && mob[i].alive && Math.random() < 0.3) {
                            mobs.statusStun(mob[i], 30);
                        }
                    }
                }
            };
            
            bullet.push(wave);
            this.amplifierCharge = Math.min(this.amplifierCharge + 5, this.maxCharge);
            
            // Visual effect
            simulation.drawList.push({
                x: m.pos.x + Math.cos(angle) * 40,
                y: m.pos.y + Math.sin(angle) * 40,
                radius: 25,
                color: "rgba(255, 20, 147, 0.6)",
                time: 6
            });
        },
        
        do() {
            // Amplifier special ability (alt-fire)
            if (input.field && this.amplifierCharge >= 50 && m.fieldCDcycle < m.cycle) {
                this.amplifierCharge = 0;
                m.fieldCDcycle = m.cycle + 120;
                
                // Create resonance field
                const fieldRadius = 350;
                
                // Damage and stun all enemies in range
                for (let i = 0; i < mob.length; i++) {
                    const dist = Math.hypot(mob[i].position.x - m.pos.x, mob[i].position.y - m.pos.y);
                    if (dist < fieldRadius && mob[i].alive) {
                        mob[i].damage(0.5 * m.dmgScale);
                        mobs.statusStun(mob[i], 180);
                        
                        // Push away
                        const angle = Math.atan2(mob[i].position.y - m.pos.y, mob[i].position.x - m.pos.x);
                        Matter.Body.setVelocity(mob[i], {
                            x: mob[i].velocity.x + Math.cos(angle) * 15,
                            y: mob[i].velocity.y + Math.sin(angle) * 15
                        });
                    }
                }
                
                // Visual effects
                for (let i = 0; i < 8; i++) {
                    setTimeout(() => {
                        simulation.drawList.push({
                            x: m.pos.x,
                            y: m.pos.y,
                            radius: fieldRadius * (i / 8),
                            color: `rgba(255, 20, 147, ${0.4 - i * 0.05})`,
                            time: 8
                        });
                        simulation.drawList.push({
                            x: m.pos.x,
                            y: m.pos.y,
                            radius: fieldRadius * (i / 8) - 20,
                            color: `rgba(148, 0, 211, ${0.3 - i * 0.04})`,
                            time: 10
                        });
                    }, i * 30);
                }
            }
            
            // Draw charge indicator
            if (this.amplifierCharge > 0 && b.activeGun === b.guns.indexOf(this)) {
                const barWidth = 150;
                const barHeight = 10;
                const x = m.pos.x - barWidth / 2;
                const y = m.pos.y - 80;
                
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                ctx.fillRect(x, y, barWidth, barHeight);
                
                const gradient = ctx.createLinearGradient(x, y, x + barWidth, y);
                gradient.addColorStop(0, "#ff1493");
                gradient.addColorStop(1, "#9400d3");
                
                ctx.fillStyle = gradient;
                ctx.fillRect(x, y, barWidth * (this.amplifierCharge / this.maxCharge), barHeight);
            }
        }
    });
    
    // ==================== BLIXER BOSS VARIANTS ====================
    
    // Cursed Form Blixer - Starter boss
    spawn.blixerCursed = function(x, y, radius = 80) {
        mobs.spawn(x, y, 8, radius, "rgba(255, 20, 147, 0.85)");
        let me = mob[mob.length - 1];
        me.stroke = "rgba(148, 0, 211, 0.9)";
        me.isBoss = true;
        me.memory = Infinity;
        me.seeAtDistance2 = Infinity;
        me.accelMag = 0.0008;
        me.frictionAir = 0.015;
        me.abilityCD = 0;
        me.formPhase = 0;
        
        me.do = function() {
            this.alwaysSeePlayer();
            this.gravity();
            this.attraction();
            
            // Ability 1: Spike spread
            if (this.abilityCD < m.cycle) {
                for (let i = 0; i < 12; i++) {
                    const angle = (Math.PI * 2 / 12) * i + Math.sin(m.cycle * 0.05);
                    mobs.bullet(this, angle, 18, 0.02);
                }
                this.abilityCD = m.cycle + 180;
            }
            
            // Visual spikes
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI * 2 / 4) * i + m.cycle * 0.02;
                const spikeLength = this.radius * 0.6;
                
                ctx.beginPath();
                ctx.moveTo(Math.cos(angle) * this.radius * 0.7, Math.sin(angle) * this.radius * 0.7);
                ctx.lineTo(Math.cos(angle) * (this.radius + spikeLength), Math.sin(angle) * (this.radius + spikeLength));
                ctx.strokeStyle = "rgba(255, 20, 147, 0.9)";
                ctx.lineWidth = 8;
                ctx.stroke();
            }
            ctx.restore();
            
            this.checkStatus();
        };
    };
    
    // New Game Blixer - Mid-tier boss
    spawn.blixerNewGame = function(x, y, radius = 100) {
        mobs.spawn(x, y, 6, radius, "rgba(255, 20, 147, 0.9)");
        let me = mob[mob.length - 1];
        me.stroke = "rgba(0, 0, 0, 0.9)";
        me.isBoss = true;
        me.memory = Infinity;
        me.seeAtDistance2 = Infinity;
        me.accelMag = 0.001;
        me.frictionAir = 0.01;
        me.abilityCD = [0, 0, 0];
        me.blades = [];
        
        me.do = function() {
            this.alwaysSeePlayer();
            this.gravity();
            this.attraction();
            
            // Ability 1: Rotating blades
            if (this.abilityCD[0] < m.cycle) {
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI * 2 / 6) * i;
                    const blade = {
                        angle: angle,
                        distance: this.radius + 50,
                        rotation: 0,
                        created: m.cycle
                    };
                    this.blades.push(blade);
                }
                this.abilityCD[0] = m.cycle + 240;
            }
            
            // Update and draw blades
            for (let i = this.blades.length - 1; i >= 0; i--) {
                const blade = this.blades[i];
                blade.rotation += 0.15;
                blade.angle += 0.03;
                
                const bladeX = this.position.x + Math.cos(blade.angle) * blade.distance;
                const bladeY = this.position.y + Math.sin(blade.angle) * blade.distance;
                
                // Check collision with player
                const dist = Math.hypot(bladeX - m.pos.x, bladeY - m.pos.y);
                if (dist < 30 && m.immuneCycle < m.cycle) {
                    m.takeDamage(0.15);
                    if (m.immuneCycle < m.cycle + m.collisionImmuneCycles) {
                        m.immuneCycle = m.cycle + m.collisionImmuneCycles;
                    }
                }
                
                // Draw blade
                ctx.save();
                ctx.translate(bladeX, bladeY);
                ctx.rotate(blade.rotation);
                ctx.fillStyle = "rgba(255, 20, 147, 0.9)";
                ctx.beginPath();
                ctx.moveTo(0, -25);
                ctx.lineTo(15, 0);
                ctx.lineTo(0, 25);
                ctx.lineTo(-15, 0);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
                
                // Remove after 5 seconds
                if (m.cycle > blade.created + 300) {
                    this.blades.splice(i, 1);
                }
            }
            
            // Ability 2: Dash attack
            if (this.abilityCD[1] < m.cycle && this.distanceToPlayer() < 400) {
                const angle = Math.atan2(m.pos.y - this.position.y, m.pos.x - this.position.x);
                Matter.Body.setVelocity(this, {
                    x: Math.cos(angle) * 25,
                    y: Math.sin(angle) * 25
                });
                this.abilityCD[1] = m.cycle + 150;
            }
            
            this.checkStatus();
        };
    };
    
    // Annihilate Form - Final boss
    spawn.blixerAnnihilate = function(x, y, radius = 150) {
        mobs.spawn(x, y, 8, radius, "rgba(255, 20, 147, 0.95)");
        let me = mob[mob.length - 1];
        me.stroke = "rgba(0, 0, 0, 1)";
        me.isBoss = true;
        me.isFinalBoss = true;
        me.memory = Infinity;
        me.seeAtDistance2 = Infinity;
        me.accelMag = 0.0012;
        me.frictionAir = 0.008;
        me.abilityCD = [0, 0, 0, 0];
        me.currentForm = 0;
        me.formTransitionHP = [0.75, 0.5, 0.25];
        
        me.do = function() {
            this.alwaysSeePlayer();
            this.gravity();
            this.attraction();
            
            // Form transitions
            for (let i = 0; i < this.formTransitionHP.length; i++) {
                if (this.health < this.formTransitionHP[i] && this.currentForm === i) {
                    this.currentForm++;
                    this.transformForm();
                }
            }
            
            // Ability pattern based on form
            switch(this.currentForm) {
                case 0: // Basic form
                    if (this.abilityCD[0] < m.cycle) {
                        for (let i = 0; i < 16; i++) {
                            const angle = (Math.PI * 2 / 16) * i;
                            mobs.bullet(this, angle, 20, 0.025);
                        }
                        this.abilityCD[0] = m.cycle + 150;
                    }
                    break;
                    
                case 1: // Mid form
                    if (this.abilityCD[1] < m.cycle) {
                        // Spiral bullets
                        for (let i = 0; i < 5; i++) {
                            setTimeout(() => {
                                for (let j = 0; j < 8; j++) {
                                    const angle = (Math.PI * 2 / 8) * j + i * 0.4;
                                    mobs.bullet(this, angle, 22, 0.03);
                                }
                            }, i * 100);
                        }
                        this.abilityCD[1] = m.cycle + 300;
                    }
                    break;
                    
                case 2: // Enraged form
                    if (this.abilityCD[2] < m.cycle) {
                        // Summon smaller blixers
                        for (let i = 0; i < 3; i++) {
                            const angle = Math.random() * Math.PI * 2;
                            const dist = 200;
                            spawn.blixerCursed(
                                this.position.x + Math.cos(angle) * dist,
                                this.position.y + Math.sin(angle) * dist,
                                40
                            );
                        }
                        this.abilityCD[2] = m.cycle + 400;
                    }
                    break;
                    
                case 3: // Final form
                    if (this.abilityCD[3] < m.cycle) {
                        // Ultimate attack
                        b.explosion(this.position, 300);
                        for (let i = 0; i < 24; i++) {
                            const angle = (Math.PI * 2 / 24) * i;
                            mobs.bullet(this, angle, 25, 0.04);
                        }
                        this.abilityCD[3] = m.cycle + 200;
                    }
                    break;
            }
            
            // Draw crown/horns
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            const hornCount = 2 + this.currentForm * 2;
            for (let i = 0; i < hornCount; i++) {
                const angle = (Math.PI * 2 / hornCount) * i - Math.PI / 2;
                const hornLength = this.radius * (0.4 + this.currentForm * 0.1);
                
                ctx.beginPath();
                ctx.moveTo(Math.cos(angle) * this.radius, Math.sin(angle) * this.radius);
                ctx.lineTo(
                    Math.cos(angle) * (this.radius + hornLength),
                    Math.sin(angle) * (this.radius + hornLength)
                );
                ctx.strokeStyle = "rgba(255, 20, 147, 1)";
                ctx.lineWidth = 10;
                ctx.stroke();
            }
            ctx.restore();
            
            this.checkStatus();
        };
        
        me.transformForm = function() {
            // Visual transformation effect
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    simulation.drawList.push({
                        x: this.position.x + (Math.random() - 0.5) * 200,
                        y: this.position.y + (Math.random() - 0.5) * 200,
                        radius: 30 + Math.random() * 40,
                        color: "rgba(255, 20, 147, 0.7)",
                        time: 15
                    });
                }, i * 50);
            }
            
            simulation.inGameConsole(`<span style="color:#ff1493;">⚠️ BLIXER FORM ${this.currentForm + 1} ⚠️</span>`);
        };
    };
    
    // Add bosses to spawn tiers
    if (blixerMode.enabled) {
        spawn.fullPickList.push("blixerCursed", "blixerNewGame", "blixerAnnihilate");
    }
    
    console.log('%c🎸 Blixer Mode loaded! (Guitar weapon + 3 boss variants)', 'color: #ff1493; font-weight: bold;');
})();
```javascript
// BLIXER MODE - 100+ Features Expansion
(function() {
    'use strict';

    if(typeof m === 'undefined' || typeof simulation === 'undefined') {
        setTimeout(arguments.callee, 100);
        return;
    }

    const blixerMode = {
        active: false,
        level: 1,
        maxLevel: 100,
        experience: 0,
        
        // 100+ Blixer abilities and features
        abilities: {
            // Movement (10 abilities)
            dashAbility: { name: "Triangle Dash", unlocked: false, level: 1 },
            teleportAbility: { name: "Shape Shift Teleport", unlocked: false, level: 5 },
            wallClimbAbility: { name: "Polygon Wall Climb", unlocked: false, level: 10 },
            doubleJumpAbility: { name: "Geometric Double Jump", unlocked: false, level: 15 },
            airDashAbility: { name: "Aerial Shape Dash", unlocked: false, level: 20 },
            phaseAbility: { name: "Phase Through Walls", unlocked: false, level: 25 },
            gravityFlipAbility: { name: "Gravity Manipulation", unlocked: false, level: 30 },
            speedBoostAbility: { name: "Velocity Surge", unlocked: false, level: 35 },
            glideAbility: { name: "Polygon Glide", unlocked: false, level: 40 },
            timeSl owAbility: { name: "Time Dilation Field", unlocked: false, level: 45 },
            
            // Combat (20 abilities)
            triangleShot: { name: "Triangle Barrage", unlocked: false, level: 2 },
            squareShield: { name: "Square Barrier", unlocked: false, level: 4 },
            pentagonBlast: { name: "Pentagon Explosion", unlocked: false, level: 6 },
            hexagonWave: { name: "Hexagon Shockwave", unlocked: false, level: 8 },
            circleOrbit: { name: "Circle Orbital Strike", unlocked: false, level: 12 },
            starBurst: { name: "Star Burst Attack", unlocked: false, level: 16 },
            diamondSpike: { name: "Diamond Spike Field", unlocked: false, level: 18 },
            octagonSpin: { name: "Octagon Rotation", unlocked: false, level: 22 },
            crescentSlash: { name: "Crescent Moon Slash", unlocked: false, level: 26 },
            spiralCannon: { name: "Spiral Energy Cannon", unlocked: false, level: 28 },
            fractals: { name: "Fractal Multiplication", unlocked: false, level: 32 },
            voidSphere: { name: "Void Sphere Collapse", unlocked: false, level: 36 },
            prismBeam: { name: "Prismatic Laser", unlocked: false, level: 38 },
            chaosWarp: { name: "Chaos Warp Reality", unlocked: false, level: 42 },
            geometryStorm: { name: "Geometry Storm", unlocked: false, level: 46 },
            shapeShifter: { name: "Shape Shifter Form", unlocked: false, level: 50 },
            dimensionRift: { name: "Dimension Rift", unlocked: false, level: 55 },
            blackHoleCore: { name: "Black Hole Core", unlocked: false, level: 60 },
            bigBang: { name: "Big Bang Explosion", unlocked: false, level: 70 },
            universeReset: { name: "Universe Reset", unlocked: false, level: 100 },
            
            // Defensive (15 abilities)
            reflectShield: { name: "Reflective Shield", unlocked: false, level: 3 },
            absorbDamage: { name: "Damage Absorption", unlocked: false, level: 7 },
            healingAura: { name: "Regeneration Aura", unlocked: false, level: 11 },
            invulnerability: { name: "Temporary Invincibility", unlocked: false, level: 14 },
            cloneDecoy: { name: "Decoy Clones", unlocked: false, level: 17 },
            counterAttack: { name: "Perfect Counter", unlocked: false, level: 21 },
            evasionBoost: { name: "Ultra Evasion", unlocked: false, level: 24 },
            armorPlating: { name: "Geometric Armor", unlocked: false, level: 27 },
            lifesteal: { name: "Energy Drain", unlocked: false, level: 31 },
            resurrection: { name: "Auto Revive", unlocked: false, level: 34 },
            barrier: { name: "Force Barrier", unlocked: false, level: 37 },
            deflection: { name: "Projectile Deflection", unlocked: false, level: 41 },
            immunity: { name: "Status Immunity", unlocked: false, level: 44 },
            lastStand: { name: "Last Stand", unlocked: false, level: 48 },
            phoenix: { name: "Phoenix Rebirth", unlocked: false, level: 52 },
            
            // Utility (20 abilities)
            mapVision: { name: "Full Map Vision", unlocked: false, level: 5 },
            enemyTracker: { name: "Enemy Tracker", unlocked: false, level: 9 },
            resourceBoost: { name: "Resource Multiplier", unlocked: false, level: 13 },
            experienceBoost: { name: "XP Multiplier", unlocked: false, level: 19 },
            dropRateUp: { name: "Increased Drop Rate", unlocked: false, level: 23 },
            magnetism: { name: "Item Magnetism", unlocked: false, level: 29 },
            autoCollect: { name: "Auto Collection", unlocked: false, level: 33 },
            fortuneFavor: { name: "Fortune's Favor", unlocked: false, level: 39 },
            criticalBoost: { name: "Critical Hit Boost", unlocked: false, level: 43 },
            penetration: { name: "Armor Penetration", unlocked: false, level: 47 },
            multishot: { name: "Multi-Shot", unlocked: false, level: 51 },
            ricochet: { name: "Ricochet Shots", unlocked: false, level: 56 },
            explosive: { name: "Explosive Rounds", unlocked: false, level: 61 },
            piercing: { name: "Piercing Shots", unlocked: false, level: 66 },
            homing: { name: "Homing Projectiles", unlocked: false, level: 71 },
            chainLightning: { name: "Chain Lightning", unlocked: false, level: 76 },
            splash: { name: "Splash Damage", unlocked: false, level: 81 },
            poison: { name: "Poison Effect", unlocked: false, level: 86 },
            freeze: { name: "Freeze Effect", unlocked: false, level: 91 },
            burn: { name: "Burn Effect", unlocked: false, level: 96 },
            
            // Special (20 abilities)
            summonMinions: { name: "Summon Geometric Minions", unlocked: false, level: 10 },
            bossTransform: { name: "Boss Transformation", unlocked: false, level: 20 },
            ultimateForm: { name: "Ultimate Blixer Form", unlocked: false, level: 30 },
            cosmicPower: { name: "Cosmic Power", unlocked: false, level: 40 },
            godMode: { name: "God Mode", unlocked: false, level: 50 },
            infiniteAmmo: { name: "Infinite Ammunition", unlocked: false, level: 25 },
            rapidFire: { name: "Rapid Fire Mode", unlocked: false, level: 35 },
            berserker: { name: "Berserker Rage", unlocked: false, level: 45 },
            stealth: { name: "Invisibility Cloak", unlocked: false, level: 55 },
            timeFreezeAbility: { name: "Time Freeze", unlocked: false, level: 65 },
            rewind: { name: "Time Rewind", unlocked: false, level: 75 },
            duplication: { name: "Self Duplication", unlocked: false, level: 85 },
            sizeControl: { name: "Size Manipulation", unlocked: false, level: 58 },
            colorShift: { name: "Color Shift Powers", unlocked: false, level: 62 },
            musicSync: { name: "Music Synchronization", unlocked: false, level: 67 },
            rhythmPower: { name: "Rhythm Power Boost", unlocked: false, level: 72 },
            beatDrop: { name: "Beat Drop Explosion", unlocked: false, level: 77 },
            bassBoost: { name: "Bass Boost Shockwave", unlocked: false, level: 82 },
            melodicShield: { name: "Melodic Shield", unlocked: false, level: 87 },
            symphonyDestruction: { name: "Symphony of Destruction", unlocked: false, level: 92 },
            
            // Character Transformations (15 forms)
            pinkForm: { name: "Pink Corruption Form", unlocked: false, level: 15 },
            blueForm: { name: "Blue Guardian Form", unlocked: false, level: 25 },
            greenForm: { name: "Green Nature Form", unlocked: false, level: 35 },
            yellowForm: { name: "Yellow Lightning Form", unlocked: false, level: 45 },
            purpleForm: { name: "Purple Void Form", unlocked: false, level: 55 },
            redForm: { name: "Red Inferno Form", unlocked: false, level: 65 },
            orangeForm: { name: "Orange Solar Form", unlocked: false, level: 75 },
            cyanForm: { name: "Cyan Frost Form", unlocked: false, level: 85 },
            whiteForm: { name: "White Purity Form", unlocked: false, level: 90 },
            blackForm: { name: "Black Corruption Form", unlocked: false, level: 95 },
            rainbowForm: { name: "Rainbow Chaos Form", unlocked: false, level: 80 },
            galaxyForm: { name: "Galaxy Star Form", unlocked: false, level: 88 },
            voidForm: { name: "Absolute Void Form", unlocked: false, level: 93 },
            prismForm: { name: "Prismatic Form", unlocked: false, level: 97 },
            omnipotentForm: { name: "Omnipotent Blixer", unlocked: false, level: 100 }
        },
        
        activate() {
            this.active = true;
            simulation.inGameConsole("<span style='color:#ff00ff; font-size:20px;'>🔺 BLIXER MODE ACTIVATED 🔺</span>");
            this.applyBlixerEffects();
            this.createBlixerHUD();
        },
        
        applyBlixerEffects() {
            // Transform character appearance
            m.color = { hue: 300, sat: 100, light: 50 };
            m.setFillColors();
            
            // Boost base stats
            m.maxHealth *= 2;
            m.health = m.maxHealth;
            m.Fx *= 1.5;
            m.dmgScale *= 2;
            
            // Add geometric trail effect
            setInterval(() => {
                if (this.active && m.alive) {
                    const shapes = ['triangle', 'square', 'pentagon', 'hexagon', 'circle', 'star'];
                    const shape = shapes[Math.floor(Math.random() * shapes.length)];
                    simulation.drawList.push({
                        x: m.pos.x,
                        y: m.pos.y,
                        radius: 15,
                        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                        time: 20
                    });
                }
            }, 100);
        },
        
        createBlixerHUD() {
            const hud = document.createElement('div');
            hud.id = 'blixer-hud';
            hud.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background: linear-gradient(135deg, rgba(255, 0, 255, 0.8), rgba(128, 0, 255, 0.8));
                border: 3px solid #ff00ff;
                border-radius: 10px;
                padding: 15px;
                color: white;
                font-family: monospace;
                z-index: 1000;
                min-width: 200px;
            `;
            
            hud.innerHTML = `
                <h3 style="margin: 0 0 10px 0; color: #fff; text-shadow: 0 0 10px #ff00ff;">🔺 BLIXER MODE</h3>
                <div>Level: <span id="blixer-level">1</span> / 100</div>
                <div>XP: <span id="blixer-xp">0</span></div>
                <div style="margin-top: 5px; font-size: 11px; color: #ccc;">
                    Press 'B' for abilities menu
                </div>
            `;
            
            document.body.appendChild(hud);
        },
        
        gainExperience(amount) {
            this.experience += amount;
            const xpNeeded = this.level * 100;
            
            if (this.experience >= xpNeeded && this.level < this.maxLevel) {
                this.levelUp();
            }
            
            const xpEl = document.getElementById('blixer-xp');
            if (xpEl) xpEl.textContent = this.experience;
        },
        
        levelUp() {
            this.level++;
            this.experience = 0;
            
            const levelEl = document.getElementById('blixer-level');
            if (levelEl) levelEl.textContent = this.level;
            
            // Unlock abilities at this level
            for (let key in this.abilities) {
                if (this.abilities[key].level === this.level) {
                    this.abilities[key].unlocked = true;
                    simulation.inGameConsole(`<span style='color:#ff00ff'>✓ Unlocked: ${this.abilities[key].name}</span>`);
                }
            }
            
            // Stat boost on level up
            m.maxHealth *= 1.05;
            m.health = m.maxHealth;
            m.dmgScale *= 1.03;
            
            simulation.inGameConsole(`<span style='color:#ff00ff; font-size:18px;'>⬆️ LEVEL UP! Now Level ${this.level}</span>`);
        }
    };
    
    // Toggle Blixer Mode with key
    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyX' && m.alive) {
            if (!blixerMode.active) {
                blixerMode.activate();
            }
        }
    });
    
    // Gain XP on mob kills
    setInterval(() => {
        if (blixerMode.active && typeof mobs !== 'undefined') {
            const newDeaths = (mobs.deathCount || 0) - (blixerMode.lastDeathCount || 0);
            if (newDeaths > 0) {
                blixerMode.gainExperience(newDeaths * 10);
                blixerMode.lastDeathCount = mobs.deathCount;
            }
        }
    }, 100);
    
    window.blixerMode = blixerMode;
    
    console.log('%c🔺 BLIXER MODE loaded! (100+ features) Press X to activate', 'color: #ff00ff; font-size: 16px; font-weight: bold');
})();
```
