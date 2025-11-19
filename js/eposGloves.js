
// EPOS Gloves - Dodge-based melee combat gloves
javascript:(function() {
    const e = {
        name: "EPOS gloves",
        descriptionFunction() { 
            return `agile <b style="color:#00d4ff">EPOS gloves</b> for close combat<br>dodge projectiles to fill <strong class='color-f'>dodge meter</strong><br>timed perfect dodges enable devastating combos<br>doesn't use <b>ammo</b>`
        },
        ammo: Infinity,
        ammoPack: Infinity,
        defaultAmmoPack: Infinity,
        have: false,
        fire() {},
        cycle: 0,
        dodgeMeter: 0,
        maxDodgeMeter: 100,
        perfectDodgeWindow: 10,
        lastDodgeCycle: 0,
        isPerfectDodge: false,
        comboCount: 0,
        leftGlove: undefined,
        rightGlove: undefined,
        haveEphemera: false,
        punchSide: "left",
        
        do() {
            if(!this.haveEphemera) {
                this.haveEphemera = true;
                simulation.ephemera.push({
                    name: "eposGloves",
                    do() {
                        if(b.guns[b.activeGun].name !== 'EPOS gloves') {
                            for (let i = 0; i < b.inventory.length; i++) {
                                if(b.guns[b.inventory[i]].name === "EPOS gloves") {
                                    if(b.guns[b.inventory[i]].leftGlove) {
                                        Composite.remove(engine.world, b.guns[b.inventory[i]].leftGlove);
                                        b.guns[b.inventory[i]].leftGlove = undefined;
                                    }
                                    if(b.guns[b.inventory[i]].rightGlove) {
                                        Composite.remove(engine.world, b.guns[b.inventory[i]].rightGlove);
                                        b.guns[b.inventory[i]].rightGlove = undefined;
                                    }
                                }
                            }
                        }
                        
                        // Display dodge meter
                        if(b.guns[b.activeGun].name === 'EPOS gloves') {
                            const gun = b.guns[b.activeGun];
                            ctx.save();
                            ctx.fillStyle = "#00d4ff";
                            ctx.fillRect(20, 120, 200 * (gun.dodgeMeter / gun.maxDodgeMeter), 20);
                            ctx.strokeStyle = "#fff";
                            ctx.strokeRect(20, 120, 200, 20);
                            ctx.fillStyle = "#fff";
                            ctx.font = "14px Arial";
                            ctx.fillText(`Dodge: ${Math.floor(gun.dodgeMeter)}%`, 25, 135);
                            if(gun.isPerfectDodge) {
                                ctx.fillStyle = "#ffd700";
                                ctx.fillText("PERFECT!", 230, 135);
                            }
                            ctx.restore();
                        }
                    }
                });
            }
            
            this.cycle++;
            
            // Decay dodge meter slowly
            if(this.dodgeMeter > 0 && m.cycle % 3 === 0) {
                this.dodgeMeter = Math.max(0, this.dodgeMeter - 0.3);
            }
            
            // Check for bullet dodging
            this.checkDodge();
            
            // Perfect dodge timer
            if(this.isPerfectDodge && m.cycle > this.lastDodgeCycle + 180) {
                this.isPerfectDodge = false;
            }
            
            // Create gloves if firing
            if (b.activeGun !== null && input.fire && b.guns[b.activeGun].name === 'EPOS gloves') {
                if (!this.leftGlove || !this.rightGlove) {
                    this.createGloves();
                }
                
                // Rapid punching
                if(m.fireCDcycle < m.cycle) {
                    this.punch();
                    m.fireCDcycle = m.cycle + (this.isPerfectDodge ? 3 : 6);
                }
            } else {
                if(this.leftGlove || this.rightGlove) {
                    this.removeGloves();
                }
            }
            
            // Update glove positions
            if(this.leftGlove && this.rightGlove) {
                const punchOffset = this.punchSide === "left" ? 50 : 30;
                const restOffset = this.punchSide === "left" ? 30 : 50;
                
                Matter.Body.setPosition(this.leftGlove, {
                    x: m.pos.x + Math.cos(m.angle) * punchOffset - 15,
                    y: m.pos.y + Math.sin(m.angle) * punchOffset
                });
                
                Matter.Body.setPosition(this.rightGlove, {
                    x: m.pos.x + Math.cos(m.angle) * restOffset + 15,
                    y: m.pos.y + Math.sin(m.angle) * restOffset
                });
                
                // Render gloves
                this.renderGloves();
                
                // Check damage
                this.checkPunchDamage();
            }
        },
        
        checkDodge() {
            if(!bullet || bullet.length === 0) return;
            
            for(let i = 0; i < bullet.length; i++) {
                if(bullet[i].classType === "mobBullet") {
                    const dist = Math.hypot(bullet[i].position.x - m.pos.x, bullet[i].position.y - m.pos.y);
                    
                    // Near miss detection
                    if(dist < 80 && dist > 40) {
                        const relativeVel = Vector.sub(bullet[i].velocity, player.velocity);
                        const closing = Vector.dot(
                            Vector.normalise(Vector.sub(m.pos, bullet[i].position)),
                            Vector.normalise(relativeVel)
                        );
                        
                        if(closing > 0.8) {
                            // Check if player is actively moving
                            if(Math.abs(player.velocity.x) > 3 || Math.abs(player.velocity.y) > 3) {
                                this.dodgeMeter = Math.min(this.maxDodgeMeter, this.dodgeMeter + 15);
                                
                                // Perfect dodge window
                                if(dist < 55) {
                                    this.isPerfectDodge = true;
                                    this.lastDodgeCycle = m.cycle;
                                    this.dodgeMeter = this.maxDodgeMeter;
                                    
                                    // Visual feedback
                                    for(let j = 0; j < 12; j++) {
                                        simulation.drawList.push({
                                            x: m.pos.x + (Math.random() - 0.5) * 100,
                                            y: m.pos.y + (Math.random() - 0.5) * 100,
                                            radius: 15,
                                            color: "rgba(255, 215, 0, 0.7)",
                                            time: 20
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        
        createGloves() {
            const x = m.pos.x;
            const y = m.pos.y;
            
            this.leftGlove = Bodies.circle(x - 15, y, 12, spawn.propsIsNotHoldable);
            this.rightGlove = Bodies.circle(x + 15, y, 12, spawn.propsIsNotHoldable);
            
            Composite.add(engine.world, this.leftGlove);
            Composite.add(engine.world, this.rightGlove);
            
            this.leftGlove.collisionFilter.category = cat.bullet;
            this.leftGlove.collisionFilter.mask = cat.mob;
            this.rightGlove.collisionFilter.category = cat.bullet;
            this.rightGlove.collisionFilter.mask = cat.mob;
        },
        
        removeGloves() {
            if(this.leftGlove) {
                Composite.remove(engine.world, this.leftGlove);
                this.leftGlove = undefined;
            }
            if(this.rightGlove) {
                Composite.remove(engine.world, this.rightGlove);
                this.rightGlove = undefined;
            }
            this.comboCount = 0;
        },
        
        punch() {
            this.punchSide = this.punchSide === "left" ? "right" : "left";
            
            // Trail effect
            simulation.drawList.push({
                x: m.pos.x + Math.cos(m.angle) * 40,
                y: m.pos.y + Math.sin(m.angle) * 40,
                radius: 20,
                color: this.isPerfectDodge ? "rgba(255, 215, 0, 0.5)" : "rgba(0, 212, 255, 0.4)",
                time: 8
            });
        },
        
        renderGloves() {
            if(!this.leftGlove || !this.rightGlove) return;
            
            ctx.save();
            
            // Left glove
            ctx.beginPath();
            ctx.arc(this.leftGlove.position.x, this.leftGlove.position.y, 12, 0, Math.PI * 2);
            ctx.fillStyle = this.isPerfectDodge ? "#ffd700" : "#00d4ff";
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Right glove
            ctx.beginPath();
            ctx.arc(this.rightGlove.position.x, this.rightGlove.position.y, 12, 0, Math.PI * 2);
            ctx.fillStyle = this.isPerfectDodge ? "#ffd700" : "#00d4ff";
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.restore();
        },
        
        checkPunchDamage() {
            const activeGlove = this.punchSide === "left" ? this.leftGlove : this.rightGlove;
            if(!activeGlove) return;
            
            for(let i = 0; i < mob.length; i++) {
                if(Matter.Query.collides(activeGlove, [mob[i]]).length > 0) {
                    this.comboCount++;
                    
                    const baseDmg = 0.08;
                    const dodgeBonus = 1 + (this.dodgeMeter / 100);
                    const perfectBonus = this.isPerfectDodge ? 3 : 1;
                    const comboBonus = 1 + (this.comboCount * 0.1);
                    
                    const totalDmg = baseDmg * dodgeBonus * perfectBonus * comboBonus * m.dmgScale;
                    
                    mob[i].damage(totalDmg, true);
                    
                    simulation.drawList.push({
                        x: mob[i].position.x,
                        y: mob[i].position.y,
                        radius: Math.sqrt(totalDmg) * 60,
                        color: this.isPerfectDodge ? "rgba(255, 215, 0, 0.6)" : "rgba(0, 212, 255, 0.5)",
                        time: 12
                    });
                    
                    // Knockback
                    const angle = Math.atan2(mob[i].position.y - activeGlove.position.y, mob[i].position.x - activeGlove.position.x);
                    mob[i].force.x += Math.cos(angle) * 0.02 * mob[i].mass;
                    mob[i].force.y += Math.sin(angle) * 0.02 * mob[i].mass;
                    
                    break;
                }
            }
        }
    };
    
    b.guns.push(e);
    const gunArray = b.guns.filter((obj, index, self) => index === self.findIndex((item) => item.name === obj.name));
    b.guns = gunArray;
    
    console.log("%cEPOS Gloves weapon loaded!", "color: #00d4ff");
})();
