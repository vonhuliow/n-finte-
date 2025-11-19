
javascript:(function() {
    const e = {
        name: "hammer",
        descriptionFunction() {
            return `swing a massive <b>hammer</b> with <b style="color: gray;">ground slam</b><br>hold to charge a devastating AoE attack<br>uses <strong class='color-h'>stamina</strong> for attacks`;
        },
        ammo: Infinity,
        ammoPack: Infinity,
        defaultAmmoPack: Infinity,
        have: false,
        hammer: undefined,
        headSegments: undefined,
        headTrails: [],
        angle: 0,
        charge: 0,
        maxCharge: 80,
        haveEphemera: false,
        fire() {},
        do() {
            if(!this.haveEphemera) {
                this.haveEphemera = true;
                simulation.ephemera.push({
                    name: "hammer",
                    do() {
                        if(b.guns[b.activeGun].name !== 'hammer') {
                            for (let i = 0; i < b.inventory.length; i++) {
                                if(b.guns[b.inventory[i]].name === "hammer" && b.guns[b.inventory[i]].hammer) {
                                    Composite.remove(engine.world, b.guns[b.inventory[i]].hammer);
                                    b.guns[b.inventory[i]].hammer = undefined;
                                    b.guns[b.inventory[i]].headTrails = [];
                                }
                            }
                        }
                    }
                });
            }

            if(input.fire && (tech.isEnergyHealth ? m.energy >= 0.1 : m.health >= 0.1) && b.guns[b.activeGun].name === 'hammer') {
                if(!this.hammer) {
                    this.angle = m.angle;
                    ({ hammer: this.hammer, headSegments: this.headSegments } = this.createHammer());
                }
                
                if(this.charge < this.maxCharge) {
                    this.charge++;
                }
            }

            if(this.hammer && !input.fire) {
                const slamPower = this.charge / this.maxCharge;
                
                if(slamPower > 0.3) {
                    const explosionRadius = 150 + slamPower * 200;
                    b.explosion(this.hammer.position, explosionRadius);
                    
                    for(let i = 0; i < mob.length; i++) {
                        const dist = Vector.magnitude(Vector.sub(this.hammer.position, mob[i].position));
                        if(dist < explosionRadius) {
                            mob[i].damage((0.3 + slamPower * 0.7) * (m.damageDone ? m.damageDone : m.dmgScale));
                        }
                    }
                }
                
                Composite.remove(engine.world, this.hammer);
                this.hammer = undefined;
                this.headTrails = [];
                this.charge = 0;
                m.fireCDcycle = m.cycle + 40;
                
                if(tech.isEnergyHealth) {
                    m.energy -= 0.08;
                } else {
                    m.health -= 0.04;
                    m.displayHealth();
                }
            }

            if(this.hammer) {
                Matter.Body.setAngularVelocity(this.hammer, 0.15);
                Matter.Body.setPosition(this.hammer, {
                    x: m.pos.x + Math.cos(m.angle) * 80,
                    y: m.pos.y + Math.sin(m.angle) * 80
                });

                for(let i = 0; i < this.headSegments.length; i++) {
                    const head = this.headSegments[i];
                    const trail = this.headTrails[i] || [];
                    const vertices = head.vertices.map(v => ({ x: v.x, y: v.y }));
                    trail.push(vertices);
                    if(trail.length > 8) trail.shift();
                    this.headTrails[i] = trail;
                }

                for(let i = 0; i < this.headTrails.length; i++) {
                    const trail = this.headTrails[i];
                    let alpha = 0;
                    const alphaStep = 1 / trail.length;
                    for(let j = 0; j < trail.length; j++) {
                        const vertices = trail[j];
                        ctx.beginPath();
                        ctx.moveTo(vertices[0].x, vertices[0].y);
                        for(let k = 1; k < vertices.length; k++) ctx.lineTo(vertices[k].x, vertices[k].y);
                        alpha += alphaStep;
                        ctx.closePath();
                        ctx.fillStyle = `rgba(128, 128, 128, ${alpha})`;
                        ctx.fill();
                    }
                }

                for(let i = 0; i < this.headSegments.length; i++) {
                    ctx.beginPath();
                    ctx.strokeStyle = "#696969";
                    ctx.lineWidth = 5;
                    ctx.fillStyle = "#A9A9A9";
                    ctx.moveTo(this.headSegments[i].vertices[0].x, this.headSegments[i].vertices[0].y);
                    for(let j = 0; j < this.headSegments[i].vertices.length; j++) {
                        ctx.lineTo(this.headSegments[i].vertices[j].x, this.headSegments[i].vertices[j].y);
                    }
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fill();
                }

                for(let i = 0; i < mob.length; i++) {
                    if(Matter.Query.collides(this.hammer, [mob[i]]).length > 0) {
                        mob[i].damage(0.25 * (m.damageDone ? m.damageDone : m.dmgScale));
                    }
                }
            }
        },
        createHammer() {
            const x = m.pos.x + Math.cos(m.angle) * 50;
            const y = m.pos.y + Math.sin(m.angle) * 50;
            
            const handle = Bodies.rectangle(x, y, 15, 120, spawn.propsIsNotHoldable);
            const head = Bodies.rectangle(x, y - 80, 80, 60, spawn.propsIsNotHoldable);
            
            const hammer = Body.create({
                parts: [handle, head],
                inertia: Infinity,
                friction: 0.002,
                frictionAir: 0.01,
                restitution: 0,
                collisionFilter: {
                    group: 0,
                    category: cat.bullet,
                    mask: cat.mob
                }
            });
            
            Composite.add(engine.world, hammer);
            Matter.Body.setAngle(hammer, m.angle + Math.PI/2);
            
            return { hammer: hammer, headSegments: [head] };
        }
    };
    b.guns.push(e);
    console.log("%cHammer weapon loaded!", "color: #696969");
})();
