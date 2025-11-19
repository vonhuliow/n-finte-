
// Pokémon Pets - Summonable companions with mobile controls
(function() {
    'use strict';
    
    if(typeof b === 'undefined' || typeof spawn === 'undefined') {
        console.warn("pokemonPets: waiting for game...");
        setTimeout(arguments.callee, 100);
        return;
    }

    const pokemonPets = {
        activePet: null,
        pets: [],
        selectedPet: 0,
        mobileControls: {
            enabled: true,
            buttons: {
                summon: { x: 0, y: 0, radius: 40, active: false, label: 'PET', key: 'KeyK' },
                attack: { x: 0, y: 0, radius: 40, active: false, label: 'ATK', key: 'KeyL' },
                switch: { x: 0, y: 0, radius: 35, active: false, label: '⇄', key: 'KeyJ' }
            },
            touchIds: {}
        },
        
        init() {
            this.setupPets();
            this.positionButtons();
            this.addEventListeners();
            this.addToGameLoop();
            console.log('%cPokémon Pets System initialized!', 'color: #ffcb05; font-weight: bold');
        },
        
        setupPets() {
            this.pets = [
                {
                    name: "Pikachu",
                    color: "#ffd700",
                    size: 25,
                    speed: 8,
                    damage: 0.2,
                    attackType: "electric",
                    cooldown: 0
                },
                {
                    name: "Charmander",
                    color: "#ff4500",
                    size: 28,
                    speed: 6,
                    damage: 0.25,
                    attackType: "fire",
                    cooldown: 0
                },
                {
                    name: "Squirtle",
                    color: "#1e90ff",
                    size: 26,
                    speed: 7,
                    damage: 0.18,
                    attackType: "water",
                    cooldown: 0
                },
                {
                    name: "Bulbasaur",
                    color: "#32cd32",
                    size: 27,
                    speed: 5,
                    damage: 0.15,
                    attackType: "grass",
                    cooldown: 0
                },
                {
                    name: "Eevee",
                    color: "#d2691e",
                    size: 24,
                    speed: 9,
                    damage: 0.12,
                    attackType: "normal",
                    cooldown: 0
                }
            ];
        },
        
        positionButtons() {
            const w = canvas.width;
            const h = canvas.height;
            
            this.mobileControls.buttons.summon.x = w / 2;
            this.mobileControls.buttons.summon.y = h - 80;
            
            this.mobileControls.buttons.attack.x = w / 2 + 90;
            this.mobileControls.buttons.attack.y = h - 80;
            
            this.mobileControls.buttons.switch.x = w / 2 - 90;
            this.mobileControls.buttons.switch.y = h - 80;
        },
        
        addEventListeners() {
            // Keyboard controls
            window.addEventListener('keydown', (e) => {
                if (e.code === 'KeyK') this.summonPet();
                if (e.code === 'KeyL') this.petAttack();
                if (e.code === 'KeyJ') this.switchPet();
            });
            
            // Touch/Mouse controls
            const handleStart = (e) => {
                e.preventDefault();
                const touches = e.changedTouches || [{ clientX: e.clientX, clientY: e.clientY, identifier: 'mouse' }];
                
                for (let touch of touches) {
                    const x = touch.clientX;
                    const y = touch.clientY;
                    
                    Object.keys(this.mobileControls.buttons).forEach(key => {
                        const btn = this.mobileControls.buttons[key];
                        if (Math.hypot(x - btn.x, y - btn.y) < btn.radius) {
                            btn.active = true;
                            this.mobileControls.touchIds[touch.identifier] = key;
                            
                            if (key === 'summon') this.summonPet();
                            if (key === 'attack') this.petAttack();
                            if (key === 'switch') this.switchPet();
                        }
                    });
                }
            };
            
            const handleEnd = (e) => {
                e.preventDefault();
                const touches = e.changedTouches || [{ clientX: e.clientX, clientY: e.clientY, identifier: 'mouse' }];
                
                for (let touch of touches) {
                    const action = this.mobileControls.touchIds[touch.identifier];
                    if (action) {
                        this.mobileControls.buttons[action].active = false;
                        delete this.mobileControls.touchIds[touch.identifier];
                    }
                }
            };
            
            canvas.addEventListener('touchstart', handleStart, { passive: false });
            canvas.addEventListener('touchend', handleEnd, { passive: false });
            canvas.addEventListener('mousedown', handleStart, { passive: false });
            canvas.addEventListener('mouseup', handleEnd, { passive: false });
        },
        
        summonPet() {
            if (!m.alive) return;
            
            const pet = this.pets[this.selectedPet];
            
            if (this.activePet) {
                this.despawnPet();
            } else {
                this.activePet = {
                    ...pet,
                    pos: { x: m.pos.x, y: m.pos.y - 100 },
                    vel: { x: 0, y: 0 },
                    active: true,
                    spawnTime: m.cycle
                };
                
                simulation.inGameConsole(`<span style='color:${pet.color}'>${pet.name} summoned!</span>`);
            }
        },
        
        despawnPet() {
            if (this.activePet) {
                simulation.inGameConsole(`<span style='color:${this.activePet.color}'>${this.activePet.name} returned!</span>`);
                this.activePet = null;
            }
        },
        
        switchPet() {
            this.selectedPet = (this.selectedPet + 1) % this.pets.length;
            const pet = this.pets[this.selectedPet];
            simulation.inGameConsole(`<span style='color:${pet.color}'>Selected ${pet.name}</span>`);
            
            if (this.activePet) {
                this.despawnPet();
                this.summonPet();
            }
        },
        
        petAttack() {
            if (!this.activePet || this.activePet.cooldown > m.cycle) return;
            
            const pet = this.activePet;
            pet.cooldown = m.cycle + 40;
            
            // Find nearest enemy
            let target = null;
            let minDist = Infinity;
            
            for (let i = 0; i < mob.length; i++) {
                if (mob[i].alive) {
                    const dist = Vector.magnitude(Vector.sub(mob[i].position, pet.pos));
                    if (dist < minDist && dist < 500) {
                        minDist = dist;
                        target = mob[i];
                    }
                }
            }
            
            if (target) {
                this.executeAttack(pet, target);
            }
        },
        
        executeAttack(pet, target) {
            switch(pet.attackType) {
                case "electric":
                    // Thunderbolt
                    for(let i = 0; i < 5; i++) {
                        ctx.beginPath();
                        ctx.moveTo(pet.pos.x, pet.pos.y);
                        for(let j = 0; j < 6; j++) {
                            ctx.lineTo(
                                pet.pos.x + (target.position.x - pet.pos.x) * (j / 6) + (Math.random() - 0.5) * 30,
                                pet.pos.y + (target.position.y - pet.pos.y) * (j / 6) + (Math.random() - 0.5) * 30
                            );
                        }
                        ctx.lineTo(target.position.x, target.position.y);
                        ctx.strokeStyle = "#ffd700";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                    target.damage(pet.damage * m.dmgScale);
                    break;
                    
                case "fire":
                    // Ember
                    const angle = Math.atan2(target.position.y - pet.pos.y, target.position.x - pet.pos.x);
                    for(let i = 0; i < 3; i++) {
                        const fireball = Bodies.circle(
                            pet.pos.x + Math.cos(angle) * 30,
                            pet.pos.y + Math.sin(angle) * 30,
                            8,
                            spawn.propsIsNotHoldable
                        );
                        Composite.add(engine.world, fireball);
                        fireball.collisionFilter.category = cat.bullet;
                        fireball.collisionFilter.mask = cat.mob;
                        fireball.classType = "bullet";
                        fireball.dmg = pet.damage * m.dmgScale;
                        fireball.minDmgSpeed = 3;
                        Body.setVelocity(fireball, {
                            x: Math.cos(angle + (Math.random() - 0.5) * 0.3) * 15,
                            y: Math.sin(angle + (Math.random() - 0.5) * 0.3) * 15
                        });
                        fireball.endCycle = m.cycle + 45;
                        fireball.do = function() {
                            ctx.beginPath();
                            ctx.arc(this.position.x, this.position.y, 8, 0, Math.PI * 2);
                            ctx.fillStyle = "#ff4500";
                            ctx.fill();
                        };
                        bullet.push(fireball);
                    }
                    break;
                    
                case "water":
                    // Water Gun
                    const wAngle = Math.atan2(target.position.y - pet.pos.y, target.position.x - pet.pos.x);
                    for(let i = 0; i < 8; i++) {
                        simulation.drawList.push({
                            x: pet.pos.x + Math.cos(wAngle) * i * 40,
                            y: pet.pos.y + Math.sin(wAngle) * i * 40,
                            radius: 12,
                            color: "rgba(30, 144, 255, 0.6)",
                            time: 6
                        });
                    }
                    target.damage(pet.damage * m.dmgScale);
                    break;
                    
                case "grass":
                    // Vine Whip
                    target.damage(pet.damage * m.dmgScale);
                    if (typeof mobs.statusSlow === 'function') {
                        mobs.statusSlow(target, 120);
                    }
                    ctx.beginPath();
                    ctx.moveTo(pet.pos.x, pet.pos.y);
                    ctx.lineTo(target.position.x, target.position.y);
                    ctx.strokeStyle = "#32cd32";
                    ctx.lineWidth = 6;
                    ctx.stroke();
                    break;
                    
                case "normal":
                    // Tackle
                    target.damage(pet.damage * m.dmgScale * 1.5);
                    const tackleAngle = Math.atan2(target.position.y - pet.pos.y, target.position.x - pet.pos.x);
                    pet.vel.x = Math.cos(tackleAngle) * 20;
                    pet.vel.y = Math.sin(tackleAngle) * 20;
                    break;
            }
        },
        
        update() {
            if (!this.activePet || !m.alive) {
                if (this.activePet) this.despawnPet();
                return;
            }
            
            const pet = this.activePet;
            
            // Follow player
            const dx = m.pos.x - pet.pos.x;
            const dy = m.pos.y - 80 - pet.pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > 100) {
                pet.vel.x = (dx / dist) * pet.speed;
                pet.vel.y = (dy / dist) * pet.speed;
            } else {
                pet.vel.x *= 0.9;
                pet.vel.y *= 0.9;
            }
            
            pet.pos.x += pet.vel.x;
            pet.pos.y += pet.vel.y;
        },
        
        draw() {
            if (!this.activePet) return;
            
            const pet = this.activePet;
            
            // Draw pet
            ctx.save();
            ctx.translate(pet.pos.x, pet.pos.y);
            
            // Shadow
            ctx.beginPath();
            ctx.ellipse(0, pet.size, pet.size * 0.8, pet.size * 0.3, 0, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fill();
            
            // Body
            ctx.beginPath();
            ctx.arc(0, 0, pet.size, 0, Math.PI * 2);
            ctx.fillStyle = pet.color;
            ctx.fill();
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Eyes
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(-8, -5, 3, 0, Math.PI * 2);
            ctx.arc(8, -5, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Name tag
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#000";
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "center";
            ctx.lineWidth = 3;
            ctx.strokeText(pet.name, 0, -pet.size - 10);
            ctx.fillText(pet.name, 0, -pet.size - 10);
            
            ctx.restore();
            
            // Draw mobile buttons
            if (this.mobileControls.enabled) {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.globalAlpha = 0.6;
                
                Object.keys(this.mobileControls.buttons).forEach(key => {
                    const btn = this.mobileControls.buttons[key];
                    
                    ctx.beginPath();
                    ctx.arc(btn.x, btn.y, btn.radius, 0, Math.PI * 2);
                    ctx.fillStyle = btn.active ? "#ffcc44" : "#666";
                    ctx.fill();
                    ctx.strokeStyle = "#fff";
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    
                    ctx.fillStyle = "#fff";
                    ctx.font = "bold 14px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(btn.label, btn.x, btn.y);
                });
                
                ctx.restore();
            }
        },
        
        addToGameLoop() {
            if (simulation.ephemera) {
                simulation.ephemera.push({
                    name: 'pokemonPets',
                    do() {
                        pokemonPets.update();
                        pokemonPets.draw();
                    }
                });
            }
        }
    };
    
    // Initialize when ready
    function initPets() {
        if (typeof simulation !== 'undefined' && typeof canvas !== 'undefined' && typeof m !== 'undefined') {
            pokemonPets.init();
        } else {
            setTimeout(initPets, 100);
        }
    }
    
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initPets);
    } else {
        initPets();
    }
    
    // Expose globally
    window.pokemonPets = pokemonPets;
})();
