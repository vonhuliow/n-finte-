
javascript:(function() {
    const e = {
        name: "bow",
        descriptionFunction() { 
            return `charge and release a <b>bow</b> to fire <b style="color: brown;">arrows</b><br>hold fire to charge for more damage<br>uses <strong class='color-h'>energy</strong> instead of ammo`
        },
        ammo: Infinity,
        ammoPack: Infinity,
        defaultAmmoPack: Infinity,
        have: false,
        charge: 0,
        maxCharge: 60,
        arrow: undefined,
        haveEphemera: false,
        fire() {},
        do() {
            if(!this.haveEphemera) {
                this.haveEphemera = true;
                simulation.ephemera.push({
                    name: "bow",
                    do() {
                        if(b.guns[b.activeGun].name !== 'bow') {
                            for (let i = 0; i < b.inventory.length; i++) {
                                if(b.guns[b.inventory[i]].name === "bow" && b.guns[b.inventory[i]].arrow) {
                                    Composite.remove(engine.world, b.guns[b.inventory[i]].arrow);
                                    b.guns[b.inventory[i]].arrow = undefined;
                                }
                            }
                        }
                    }
                });
            }

            if(input.fire && (tech.isEnergyHealth ? m.energy >= 0.05 : m.health >= 0.05) && b.guns[b.activeGun].name === 'bow') {
                if(this.charge < this.maxCharge) {
                    this.charge++;
                    if(tech.isEnergyHealth) {
                        m.energy -= 0.001;
                    } else {
                        m.health -= 0.0005;
                        m.displayHealth();
                    }
                }
                
                // Draw charge indicator
                const chargePercent = this.charge / this.maxCharge;
                ctx.beginPath();
                ctx.arc(m.pos.x, m.pos.y - 50, 20, -Math.PI/2, -Math.PI/2 + (Math.PI * 2 * chargePercent));
                ctx.strokeStyle = `rgba(139, 69, 19, ${chargePercent})`;
                ctx.lineWidth = 4;
                ctx.stroke();
            }

            if(!input.fire && this.charge > 10 && b.guns[b.activeGun].name === 'bow') {
                const arrowSpeed = 15 + (this.charge / this.maxCharge) * 25;
                const arrowDamage = 0.2 + (this.charge / this.maxCharge) * 0.6;
                
                this.arrow = Bodies.rectangle(
                    m.pos.x + Math.cos(m.angle) * 50,
                    m.pos.y + Math.sin(m.angle) * 50,
                    60, 8,
                    spawn.propsIsNotHoldable
                );
                
                Composite.add(engine.world, this.arrow);
                this.arrow.collisionFilter.category = cat.bullet;
                this.arrow.collisionFilter.mask = cat.mob;
                this.arrow.classType = "bullet";
                this.arrow.dmg = arrowDamage * (m.damageDone ? m.damageDone : m.dmgScale);
                
                Matter.Body.setVelocity(this.arrow, {
                    x: Math.cos(m.angle) * arrowSpeed,
                    y: Math.sin(m.angle) * arrowSpeed
                });
                Matter.Body.setAngle(this.arrow, m.angle);
                
                this.arrow.endCycle = m.cycle + 120;
                this.arrow.do = function() {
                    ctx.save();
                    ctx.translate(this.position.x, this.position.y);
                    ctx.rotate(this.angle);
                    ctx.fillStyle = "#8B4513";
                    ctx.fillRect(-30, -4, 60, 8);
                    ctx.fillStyle = "#654321";
                    ctx.beginPath();
                    ctx.moveTo(30, 0);
                    ctx.lineTo(20, -6);
                    ctx.lineTo(20, 6);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                };
                
                bullet.push(this.arrow);
                
                for(let i = 0; i < mob.length; i++) {
                    if(Matter.Query.collides(this.arrow, [mob[i]]).length > 0) {
                        mob[i].damage(this.arrow.dmg);
                        this.arrow.endCycle = 0;
                    }
                }
                
                this.charge = 0;
                this.arrow = undefined;
                m.fireCDcycle = m.cycle + 20;
            }

            if(!input.fire && this.charge <= 10) {
                this.charge = 0;
            }
        }
    };
    b.guns.push(e);
    console.log("%cBow weapon loaded!", "color: #8B4513");
})();
