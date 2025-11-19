// Full Power Expansion - Complete arsenal for every ability, field, and form
(function() {
    'use strict';
    
    if (typeof m === 'undefined' || typeof b === 'undefined' || typeof tech === 'undefined') {
        console.warn('Full Power Expansion: Game not ready, retrying...');
        setTimeout(arguments.callee, 100);
        return;
    }
    
    // ==========================================
    // FIELD-BASED WEAPONS
    // ==========================================
    
    // QUANTUM ENTANGLEMENT GUN
    b.guns.push({
        name: "quantum entangler",
        descriptionFunction() {
            return `fires <b style="color:#a0f">quantum-linked bullets</b><br>creates <strong>teleport nodes</strong> on impact<br>teleport between nodes with field button<br><strong>120</strong> ammo`
        },
        ammo: 120,
        ammoPack: 30,
        defaultAmmoPack: 30,
        have: false,
        teleportNodes: [],
        fire() {
            const dir = m.angle;
            const me = bullet.length;
            bullet[me] = Bodies.rectangle(
                m.pos.x + 30 * Math.cos(dir),
                m.pos.y + 30 * Math.sin(dir),
                12, 12
            );
            
            bullet[me].do = function() {
                ctx.save();
                ctx.translate(this.position.x, this.position.y);
                ctx.rotate(this.angle);
                for (let i = 0; i < 4; i++) {
                    const angle = (Math.PI / 2) * i + m.cycle * 0.1;
                    ctx.fillStyle = `rgba(160, 0, 255, ${0.5 + 0.3 * Math.sin(m.cycle * 0.1)})`;
                    ctx.fillRect(Math.cos(angle) * 8, Math.sin(angle) * 8, 4, 4);
                }
                ctx.restore();
            };
            
            const gun = b.guns[b.activeGun];
            bullet[me].onEnd = function() {
                gun.teleportNodes.push({
                    x: this.position.x,
                    y: this.position.y,
                    life: 300
                });
                if (gun.teleportNodes.length > 3) gun.teleportNodes.shift();
                
                simulation.drawList.push({
                    x: this.position.x,
                    y: this.position.y,
                    radius: 60,
                    color: "rgba(160, 0, 255, 0.4)",
                    time: 30
                });
            };
            
            bullet[me].explodeRad = 50;
            Matter.Body.setVelocity(bullet[me], {
                x: 0.5 * player.velocity.x + 35 * Math.cos(dir),
                y: 0.5 * player.velocity.y + 35 * Math.sin(dir)
            });
            
            World.add(engine.world, bullet[me]);
            b.muzzleFlash(40);
            b.activeGun.ammo--;
        },
        do() {
            if (input.field && this.teleportNodes.length > 0) {
                const node = this.teleportNodes[this.teleportNodes.length - 1];
                Matter.Body.setPosition(player, {x: node.x, y: node.y});
                Matter.Body.setVelocity(player, {x: 0, y: 0});
                
                simulation.drawList.push({
                    x: node.x,
                    y: node.y,
                    radius: 100,
                    color: "rgba(160, 0, 255, 0.6)",
                    time: 20
                });
            }
            
            for (let i = this.teleportNodes.length - 1; i >= 0; i--) {
                this.teleportNodes[i].life--;
                if (this.teleportNodes[i].life <= 0) {
                    this.teleportNodes.splice(i, 1);
                }
            }
        }
    });
    
    // CHRONO CANNON
    b.guns.push({
        name: "chrono cannon",
        descriptionFunction() {
            return `fires <b style="color:#0cf">time-slowing projectiles</b><br><strong>slows enemies</strong> hit by bullets<br>creates <strong>slow zones</strong> on impact<br><strong>80</strong> ammo`
        },
        ammo: 80,
        ammoPack: 20,
        defaultAmmoPack: 20,
        have: false,
        fire() {
            const dir = m.angle;
            const me = bullet.length;
            bullet[me] = Bodies.circle(
                m.pos.x + 30 * Math.cos(dir),
                m.pos.y + 30 * Math.sin(dir),
                15
            );
            
            bullet[me].do = function() {
                ctx.beginPath();
                ctx.arc(this.position.x, this.position.y, 15, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 200, 255, ${0.6 + 0.2 * Math.sin(m.cycle * 0.15)})`;
                ctx.fill();
                
                ctx.strokeStyle = "rgba(0, 200, 255, 0.8)";
                ctx.lineWidth = 2;
                ctx.stroke();
                
                for (let i = 0; i < mob.length; i++) {
                    const dist = Math.hypot(this.position.x - mob[i].position.x, this.position.y - mob[i].position.y);
                    if (dist < 80 && mob[i].alive) {
                        mobs.statusSlow(mob[i], 30);
                    }
                }
            };
            
            bullet[me].onEnd = function() {
                const slowZone = {
                    x: this.position.x,
                    y: this.position.y,
                    radius: 200,
                    duration: 120
                };
                
                const endCycle = m.cycle + slowZone.duration;
                simulation.ephemera.push({
                    name: "chronoSlowZone",
                    do() {
                        if (m.cycle >= endCycle) {
                            const index = simulation.ephemera.findIndex(e => e.name === "chronoSlowZone");
                            if (index !== -1) simulation.ephemera.splice(index, 1);
                            return;
                        }
                        
                        ctx.beginPath();
                        ctx.arc(slowZone.x, slowZone.y, slowZone.radius, 0, Math.PI * 2);
                        ctx.strokeStyle = "rgba(0, 200, 255, 0.3)";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        
                        for (let i = 0; i < mob.length; i++) {
                            const dist = Math.hypot(slowZone.x - mob[i].position.x, slowZone.y - mob[i].position.y);
                            if (dist < slowZone.radius && mob[i].alive) {
                                mobs.statusSlow(mob[i], 10);
                            }
                        }
                    }
                });
            };
            
            Matter.Body.setVelocity(bullet[me], {
                x: 0.5 * player.velocity.x + 25 * Math.cos(dir),
                y: 0.5 * player.velocity.y + 25 * Math.sin(dir)
            });
            
            World.add(engine.world, bullet[me]);
            b.muzzleFlash(35);
            b.activeGun.ammo--;
        },
        do() {}
    });
    
    // GRAVITY WELL LAUNCHER
    b.guns.push({
        name: "gravity well launcher",
        descriptionFunction() {
            return `launches <b style="color:#84f">gravity wells</b><br><strong>pulls enemies</strong> into center<br>damages mobs at core<br><strong>60</strong> ammo`
        },
        ammo: 60,
        ammoPack: 15,
        defaultAmmoPack: 15,
        have: false,
        fire() {
            const dir = m.angle;
            const me = bullet.length;
            bullet[me] = Bodies.circle(
                m.pos.x + 30 * Math.cos(dir),
                m.pos.y + 30 * Math.sin(dir),
                18
            );
            
            bullet[me].gravityWellActive = false;
            
            bullet[me].do = function() {
                ctx.save();
                ctx.translate(this.position.x, this.position.y);
                ctx.rotate(m.cycle * 0.1);
                
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI * 2 / 6) * i;
                    ctx.fillStyle = `rgba(130, 70, 255, ${0.6 + 0.3 * Math.sin(m.cycle * 0.1)})`;
                    ctx.fillRect(Math.cos(angle) * 10, Math.sin(angle) * 10, 6, 6);
                }
                ctx.restore();
            };
            
            bullet[me].onEnd = function() {
                this.gravityWellActive = true;
                const wellX = this.position.x;
                const wellY = this.position.y;
                const endCycle = m.cycle + 180;
                
                simulation.ephemera.push({
                    name: "gravityWell",
                    do() {
                        if (m.cycle >= endCycle) {
                            const index = simulation.ephemera.findIndex(e => e.name === "gravityWell");
                            if (index !== -1) simulation.ephemera.splice(index, 1);
                            return;
                        }
                        
                        const radius = 250;
                        ctx.beginPath();
                        ctx.arc(wellX, wellY, radius, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(130, 70, 255, ${(endCycle - m.cycle) / 180 * 0.5})`;
                        ctx.lineWidth = 3;
                        ctx.stroke();
                        
                        for (let i = 0; i < mob.length; i++) {
                            const dist = Math.hypot(wellX - mob[i].position.x, wellY - mob[i].position.y);
                            if (dist < radius && mob[i].alive) {
                                const pull = Vector.mult(
                                    Vector.normalise(Vector.sub({x: wellX, y: wellY}, mob[i].position)),
                                    0.003 * mob[i].mass
                                );
                                mob[i].force.x += pull.x;
                                mob[i].force.y += pull.y;
                                
                                if (dist < 70) {
                                    mob[i].damage(0.1 * m.dmgScale);
                                }
                            }
                        }
                    }
                });
            };
            
            Matter.Body.setVelocity(bullet[me], {
                x: 0.5 * player.velocity.x + 28 * Math.cos(dir),
                y: 0.5 * player.velocity.y + 28 * Math.sin(dir)
            });
            
            World.add(engine.world, bullet[me]);
            b.muzzleFlash(40);
            b.activeGun.ammo--;
        },
        do() {}
    });
    
    // EMP PULSE RIFLE
    b.guns.push({
        name: "EMP pulse rifle",
        descriptionFunction() {
            return `fires <b style="color:#ffd700">electromagnetic pulses</b><br><strong>destroys enemy bullets</strong><br>stuns enemies briefly<br><strong>100</strong> ammo`
        },
        ammo: 100,
        ammoPack: 25,
        defaultAmmoPack: 25,
        have: false,
        fire() {
            const dir = m.angle;
            const me = bullet.length;
            bullet[me] = Bodies.rectangle(
                m.pos.x + 30 * Math.cos(dir),
                m.pos.y + 30 * Math.sin(dir),
                20, 8
            );
            
            bullet[me].do = function() {
                ctx.save();
                ctx.translate(this.position.x, this.position.y);
                ctx.rotate(this.angle);
                
                const pulseRadius = 40 + 10 * Math.sin(m.cycle * 0.2);
                ctx.beginPath();
                ctx.arc(0, 0, pulseRadius, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
                ctx.lineWidth = 3;
                ctx.stroke();
                
                ctx.fillStyle = "rgba(255, 215, 0, 0.4)";
                ctx.fillRect(-10, -4, 20, 8);
                ctx.restore();
                
                for (let i = bullet.length - 1; i >= 0; i--) {
                    if (bullet[i].classType === "mobBullet" && bullet[i] !== this) {
                        const dist = Math.hypot(this.position.x - bullet[i].position.x, this.position.y - bullet[i].position.y);
                        if (dist < 100) {
                            Matter.Composite.remove(engine.world, bullet[i]);
                            bullet.splice(i, 1);
                        }
                    }
                }
                
                for (let i = 0; i < mob.length; i++) {
                    const dist = Math.hypot(this.position.x - mob[i].position.x, this.position.y - mob[i].position.y);
                    if (dist < 100 && mob[i].alive) {
                        mobs.statusStun(mob[i], 20);
                    }
                }
            };
            
            Matter.Body.setVelocity(bullet[me], {
                x: 0.5 * player.velocity.x + 32 * Math.cos(dir),
                y: 0.5 * player.velocity.y + 32 * Math.sin(dir)
            });
            
            World.add(engine.world, bullet[me]);
            b.muzzleFlash(45);
            b.activeGun.ammo--;
        },
        do() {}
    });
    
    // NANITE SWARM GUN
    b.guns.push({
        name: "nanite swarm gun",
        descriptionFunction() {
            return `deploys <b style="color:#0f0">healing nanobots</b><br>restores <strong class="color-h">health</strong> over time<br>nanites attack nearby enemies<br><strong>50</strong> ammo`
        },
        ammo: 50,
        ammoPack: 10,
        defaultAmmoPack: 10,
        have: false,
        fire() {
            const dir = m.angle;
            
            for (let i = 0; i < 8; i++) {
                const me = bullet.length;
                const spreadAngle = dir + (Math.random() - 0.5) * 0.6;
                bullet[me] = Bodies.circle(
                    m.pos.x + 30 * Math.cos(dir),
                    m.pos.y + 30 * Math.sin(dir),
                    4
                );
                
                bullet[me].naniteLife = 150;
                bullet[me].seeking = null;
                
                bullet[me].do = function() {
                    this.naniteLife--;
                    
                    ctx.beginPath();
                    ctx.arc(this.position.x, this.position.y, 4, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 255, 0, ${this.naniteLife / 150})`;
                    ctx.fill();
                    
                    const healRadius = 60;
                    if (Math.hypot(this.position.x - m.pos.x, this.position.y - m.pos.y) < healRadius) {
                        if (!(m.cycle % 15)) {
                            m.addHealth(0.005);
                        }
                    }
                    
                    if (!this.seeking || !this.seeking.alive) {
                        let closestDist = Infinity;
                        this.seeking = null;
                        for (let j = 0; j < mob.length; j++) {
                            if (mob[j].alive) {
                                const dist = Math.hypot(this.position.x - mob[j].position.x, this.position.y - mob[j].position.y);
                                if (dist < closestDist && dist < 400) {
                                    closestDist = dist;
                                    this.seeking = mob[j];
                                }
                            }
                        }
                    }
                    
                    if (this.seeking && this.seeking.alive) {
                        const angle = Math.atan2(this.seeking.position.y - this.position.y, this.seeking.position.x - this.position.x);
                        const force = 0.00008;
                        this.force.x += Math.cos(angle) * force;
                        this.force.y += Math.sin(angle) * force;
                        
                        const dist = Math.hypot(this.position.x - this.seeking.position.x, this.position.y - this.seeking.position.y);
                        if (dist < 30) {
                            this.seeking.damage(0.05 * m.dmgScale);
                        }
                    }
                    
                    if (this.naniteLife <= 0) {
                        this.endCycle = m.cycle;
                    }
                };
                
                Matter.Body.setVelocity(bullet[me], {
                    x: 0.5 * player.velocity.x + (20 + Math.random() * 15) * Math.cos(spreadAngle),
                    y: 0.5 * player.velocity.y + (20 + Math.random() * 15) * Math.sin(spreadAngle)
                });
                
                World.add(engine.world, bullet[me]);
            }
            
            b.muzzleFlash(30);
            b.activeGun.ammo--;
        },
        do() {}
    });
    
    // PHASE SHIFT RIFLE
    b.guns.push({
        name: "phase shift rifle",
        descriptionFunction() {
            return `fires <b style="color:#0ff">phasing bullets</b><br>bullets <strong>pass through walls</strong><br>player becomes <strong>intangible</strong> briefly after firing<br><strong>80</strong> ammo`
        },
        ammo: 80,
        ammoPack: 20,
        defaultAmmoPack: 20,
        have: false,
        phaseEndCycle: 0,
        fire() {
            const dir = m.angle;
            const me = bullet.length;
            bullet[me] = Bodies.rectangle(
                m.pos.x + 30 * Math.cos(dir),
                m.pos.y + 30 * Math.sin(dir),
                14, 14
            );
            
            bullet[me].collisionFilter.mask = cat.mob | cat.mobBullet;
            
            bullet[me].do = function() {
                ctx.save();
                ctx.translate(this.position.x, this.position.y);
                ctx.rotate(this.angle + m.cycle * 0.15);
                ctx.fillStyle = `rgba(0, 255, 255, ${0.5 + 0.3 * Math.sin(m.cycle * 0.2)})`;
                ctx.fillRect(-7, -7, 14, 14);
                ctx.strokeStyle = "rgba(0, 255, 255, 0.8)";
                ctx.lineWidth = 2;
                ctx.strokeRect(-7, -7, 14, 14);
                ctx.restore();
                
                for (let i = 0; i < 3; i++) {
                    simulation.drawList.push({
                        x: this.position.x + (Math.random() - 0.5) * 20,
                        y: this.position.y + (Math.random() - 0.5) * 20,
                        radius: 3,
                        color: "rgba(0, 255, 255, 0.4)",
                        time: 3
                    });
                }
            };
            
            Matter.Body.setVelocity(bullet[me], {
                x: 0.5 * player.velocity.x + 40 * Math.cos(dir),
                y: 0.5 * player.velocity.y + 40 * Math.sin(dir)
            });
            
            World.add(engine.world, bullet[me]);
            
            this.phaseEndCycle = m.cycle + 30;
            player.collisionFilter.mask = cat.map;
            
            b.muzzleFlash(35);
            b.activeGun.ammo--;
        },
        do() {
            if (m.cycle >= this.phaseEndCycle && player.collisionFilter.mask === cat.map) {
                player.collisionFilter.mask = cat.body | cat.map | cat.mob | cat.mobBullet | cat.mobShield;
            }
            
            if (m.cycle < this.phaseEndCycle) {
                ctx.globalAlpha = 0.4;
            }
        }
    });
    
    // KINETIC AMPLIFIER CANNON
    b.guns.push({
        name: "kinetic amplifier",
        descriptionFunction() {
            return `fires <b style="color:#f40">velocity-charged shots</b><br>damage increases with <strong>player speed</strong><br>hitting enemies grants <strong>momentum boost</strong><br><strong>90</strong> ammo`
        },
        ammo: 90,
        ammoPack: 22,
        defaultAmmoPack: 22,
        have: false,
        fire() {
            const dir = m.angle;
            const playerSpeed = Math.hypot(player.velocity.x, player.velocity.y);
            const speedBonus = 1 + playerSpeed / 10;
            
            const me = bullet.length;
            bullet[me] = Bodies.circle(
                m.pos.x + 30 * Math.cos(dir),
                m.pos.y + 30 * Math.sin(dir),
                10 + speedBonus * 3
            );
            
            bullet[me].speedMultiplier = speedBonus;
            
            bullet[me].do = function() {
                const intensity = Math.min(this.speedMultiplier / 3, 1);
                ctx.beginPath();
                ctx.arc(this.position.x, this.position.y, 10 + this.speedMultiplier * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, ${70 * (1 - intensity)}, 0, 0.7)`;
                ctx.fill();
                
                for (let i = 0; i < 3; i++) {
                    simulation.drawList.push({
                        x: this.position.x - this.velocity.x * i * 0.3,
                        y: this.position.y - this.velocity.y * i * 0.3,
                        radius: 8 + this.speedMultiplier * 2,
                        color: `rgba(255, 70, 0, ${0.4 - i * 0.1})`,
                        time: 2
                    });
                }
            };
            
            bullet[me].onDamage = function(target) {
                const boost = Vector.mult(Vector.normalise(this.velocity), 5 * this.speedMultiplier);
                player.force.x += boost.x * player.mass;
                player.force.y += boost.y * player.mass;
            };
            
            bullet[me].dmg = 0.5 * speedBonus;
            
            Matter.Body.setVelocity(bullet[me], {
                x: player.velocity.x + (30 + playerSpeed * 0.5) * Math.cos(dir),
                y: player.velocity.y + (30 + playerSpeed * 0.5) * Math.sin(dir)
            });
            
            World.add(engine.world, bullet[me]);
            b.muzzleFlash(40);
            b.activeGun.ammo--;
        },
        do() {}
    });
    
    // VOID ZONE PROJECTOR
    b.guns.push({
        name: "void zone projector",
        descriptionFunction() {
            return `creates <b style="color:#808">void zones</b><br>damages enemies in area<br>zones <strong>stack damage</strong> over time<br><strong>40</strong> ammo`
        },
        ammo: 40,
        ammoPack: 10,
        defaultAmmoPack: 10,
        have: false,
        fire() {
            const dir = m.angle;
            const me = bullet.length;
            bullet[me] = Bodies.circle(
                m.pos.x + 30 * Math.cos(dir),
                m.pos.y + 30 * Math.sin(dir),
                12
            );
            
            bullet[me].do = function() {
                ctx.beginPath();
                ctx.arc(this.position.x, this.position.y, 12, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(128, 0, 128, 0.8)";
                ctx.fill();
            };
            
            bullet[me].onEnd = function() {
                const zoneX = this.position.x;
                const zoneY = this.position.y;
                const endCycle = m.cycle + 240;
                let damagePerTick = 0.02;
                
                simulation.ephemera.push({
                    name: "voidZone",
                    do() {
                        if (m.cycle >= endCycle) {
                            const index = simulation.ephemera.findIndex(e => e.name === "voidZone");
                            if (index !== -1) simulation.ephemera.splice(index, 1);
                            return;
                        }
                        
                        damagePerTick += 0.0005;
                        const radius = 180;
                        
                        ctx.save();
                        ctx.globalAlpha = 0.3;
                        ctx.beginPath();
                        ctx.arc(zoneX, zoneY, radius, 0, Math.PI * 2);
                        ctx.fillStyle = "rgba(128, 0, 128, 0.4)";
                        ctx.fill();
                        ctx.restore();
                        
                        for (let i = 0; i < 8; i++) {
                            const angle = (Math.PI * 2 / 8) * i + m.cycle * 0.05;
                            ctx.beginPath();
                            ctx.moveTo(zoneX, zoneY);
                            ctx.lineTo(zoneX + Math.cos(angle) * radius, zoneY + Math.sin(angle) * radius);
                            ctx.strokeStyle = "rgba(128, 0, 128, 0.2)";
                            ctx.lineWidth = 2;
                            ctx.stroke();
                        }
                        
                        for (let i = 0; i < mob.length; i++) {
                            const dist = Math.hypot(zoneX - mob[i].position.x, zoneY - mob[i].position.y);
                            if (dist < radius && mob[i].alive) {
                                mob[i].damage(damagePerTick * m.dmgScale);
                            }
                        }
                    }
                });
            };
            
            Matter.Body.setVelocity(bullet[me], {
                x: 0.5 * player.velocity.x + 20 * Math.cos(dir),
                y: 0.5 * player.velocity.y + 20 * Math.sin(dir)
            });
            
            World.add(engine.world, bullet[me]);
            b.muzzleFlash(35);
            b.activeGun.ammo--;
        },
        do() {}
    });
    
    console.log("%cFull Power Expansion loaded! (Field weapons complete)", "color: #a0f; font-weight: bold; font-size: 14px");
    
})();
