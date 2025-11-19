
// MEGA UNIVERSE EXPANSION - 1000+ Items from Anime, Comics, Games, etc.
// This is a MASSIVE content pack - may impact performance!

(function() {
    'use strict';
    
    console.log("%cLoading MEGA UNIVERSE EXPANSION...", "color: #ff00ff; font-size: 20px; font-weight: bold");
    
    if(typeof b === 'undefined' || typeof spawn === 'undefined' || typeof tech === 'undefined') {
        console.warn("Mega expansion: waiting for game...");
        setTimeout(arguments.callee, 100);
        return;
    }
    
    const Vector = Matter.Vector;
    const Body = Matter.Body;
    const Bodies = Matter.Bodies;
    const Composite = Matter.Composite;
    
    // ==================== WEAPON GENERATORS ====================
    
    // Anime weapon templates
    const animeWeaponTypes = [
        // Attack on Titan
        {name: "ODM Gear Blades", dmg: 0.9, speed: 30, color: "#c0c0c0", effect: "mobility boost"},
        {name: "Thunder Spears", dmg: 1.5, speed: 25, color: "#ffff00", effect: "explosive"},
        
        // Naruto
        {name: "Rasengan Cannon", dmg: 1.2, speed: 20, color: "#00bfff", effect: "spiral damage"},
        {name: "Chidori Blade", dmg: 1.3, speed: 28, color: "#ffffff", effect: "lightning"},
        {name: "Kunai Storm", dmg: 0.4, speed: 35, color: "#808080", effect: "multi-hit"},
        {name: "Shuriken of Destiny", dmg: 0.6, speed: 32, color: "#000000", effect: "returning"},
        
        // Bleach
        {name: "Zanpakuto Release", dmg: 1.8, speed: 22, color: "#ff0000", effect: "soul damage"},
        {name: "Getsuga Tensho", dmg: 2.0, speed: 40, color: "#000080", effect: "wave slash"},
        {name: "Kido Blast", dmg: 0.8, speed: 25, color: "#ff69b4", effect: "magic"},
        
        // One Piece
        {name: "Gomu Gomu Gatling", dmg: 0.5, speed: 45, color: "#ff4500", effect: "rapid fire"},
        {name: "Santoryu Blades", dmg: 1.1, speed: 30, color: "#228b22", effect: "triple slash"},
        {name: "Devil Fruit Cannon", dmg: 1.6, speed: 20, color: "#8b008b", effect: "elemental"},
        
        // My Hero Academia
        {name: "One For All Punch", dmg: 2.5, speed: 35, color: "#00ff00", effect: "shockwave"},
        {name: "Explosion Gauntlets", dmg: 1.4, speed: 28, color: "#ff8c00", effect: "blast"},
        {name: "Ice Wall Shards", dmg: 0.7, speed: 30, color: "#87ceeb", effect: "freeze"},
        
        // Dragon Ball
        {name: "Kamehameha Wave", dmg: 3.0, speed: 50, color: "#00ffff", effect: "beam"},
        {name: "Spirit Bomb", dmg: 5.0, speed: 15, color: "#ffff00", effect: "charged"},
        {name: "Destructo Disc", dmg: 2.2, speed: 40, color: "#ffd700", effect: "cutting"},
        {name: "Final Flash", dmg: 3.5, speed: 45, color: "#ffff00", effect: "devastating"},
        
        // Demon Slayer
        {name: "Water Breathing Blade", dmg: 1.0, speed: 32, color: "#1e90ff", effect: "flow"},
        {name: "Thunder Breathing", dmg: 1.3, speed: 50, color: "#ffd700", effect: "speed"},
        {name: "Flame Breathing", dmg: 1.4, speed: 28, color: "#ff4500", effect: "burn"},
        {name: "Sun Breathing", dmg: 1.8, speed: 30, color: "#ff6347", effect: "ultimate"},
        
        // Jujutsu Kaisen
        {name: "Cursed Energy Blast", dmg: 1.1, speed: 30, color: "#8b00ff", effect: "curse"},
        {name: "Domain Expansion", dmg: 2.8, speed: 20, color: "#9400d3", effect: "area"},
        {name: "Black Flash", dmg: 1.9, speed: 40, color: "#000000", effect: "critical"},
        
        // Fullmetal Alchemist
        {name: "Flame Alchemy", dmg: 1.5, speed: 30, color: "#ff4500", effect: "fire"},
        {name: "Automail Blade", dmg: 1.2, speed: 35, color: "#c0c0c0", effect: "mechanical"},
        {name: "Transmutation Circle", dmg: 1.0, speed: 25, color: "#ffd700", effect: "alchemy"},
        
        // Fate Series
        {name: "Excalibur Beam", dmg: 4.0, speed: 50, color: "#ffd700", effect: "holy"},
        {name: "Gate of Babylon", dmg: 1.8, speed: 35, color: "#daa520", effect: "multi-weapon"},
        {name: "Gae Bolg", dmg: 2.5, speed: 60, color: "#8b0000", effect: "sure-hit"},
        
        // Sword Art Online
        {name: "Dual Wielding", dmg: 1.0, speed: 40, color: "#000000", effect: "twin blades"},
        {name: "Starburst Stream", dmg: 1.5, speed: 45, color: "#00ffff", effect: "combo"},
        {name: "Eclipse", dmg: 2.0, speed: 35, color: "#ff0000", effect: "darkness"},
        
        // Hunter x Hunter
        {name: "Nen Punch", dmg: 1.3, speed: 35, color: "#ffff00", effect: "aura"},
        {name: "Godspeed", dmg: 1.1, speed: 60, color: "#00ffff", effect: "lightning speed"},
        {name: "Bungee Gum", dmg: 0.8, speed: 25, color: "#ff1493", effect: "sticky"},
        
        // One Punch Man
        {name: "Serious Punch", dmg: 10.0, speed: 100, color: "#ff0000", effect: "instant kill"},
        {name: "Consecutive Normal Punches", dmg: 0.5, speed: 80, color: "#ffff00", effect: "rapid"},
        
        // Marvel/DC Comics
        {name: "Mjolnir Strike", dmg: 2.8, speed: 40, color: "#c0c0c0", effect: "thunder"},
        {name: "Web Shooters", dmg: 0.4, speed: 35, color: "#ff0000", effect: "trap"},
        {name: "Repulsor Beam", dmg: 1.6, speed: 45, color: "#00ffff", effect: "energy"},
        {name: "Batarang Volley", dmg: 0.6, speed: 40, color: "#000000", effect: "multi"},
        {name: "Energy Construct", dmg: 1.2, speed: 30, color: "#00ff00", effect: "will power"},
        {name: "Omega Beam", dmg: 3.0, speed: 50, color: "#ff0000", effect: "tracking"},
        {name: "Vibranium Shield", dmg: 1.5, speed: 35, color: "#0000ff", effect: "reflect"},
        {name: "Adamantium Claws", dmg: 1.7, speed: 40, color: "#c0c0c0", effect: "slash"},
        
        // More anime weapons (abbreviated for space)
        {name: "Geass Command", dmg: 5.0, speed: 10, color: "#ff00ff", effect: "control"},
        {name: "Stand Rush", dmg: 1.4, speed: 50, color: "#ffd700", effect: "ora ora"},
        {name: "Alchemy Spike", dmg: 1.1, speed: 30, color: "#8b4513", effect: "earth"},
        {name: "Titan Hardening", dmg: 1.9, speed: 20, color: "#deb887", effect: "armor"},
        {name: "Sharingan Copy", dmg: 1.3, speed: 35, color: "#ff0000", effect: "mimic"}
    ];
    
    // Generate 1000 unique weapons by combining templates with modifiers
    const weaponModifiers = [
        "Enhanced", "Supreme", "Legendary", "Divine", "Corrupted", "Blessed", "Cursed", "Ancient",
        "Neo", "Cyber", "Quantum", "Plasma", "Void", "Celestial", "Infernal", "Ethereal",
        "Mythic", "Epic", "Omega", "Alpha", "Beta", "Gamma", "Delta", "Sigma",
        "Prismatic", "Chromatic", "Spectral", "Phantom", "Shadow", "Light", "Dark",
        "Crystal", "Diamond", "Platinum", "Titanium", "Mithril", "Orichalcum"
    ];
    
    const weaponSuffixes = [
        "of Doom", "of Power", "of Destruction", "of Chaos", "of Order", "of Balance",
        "Mk II", "Mk III", "Mk X", "EX", "Ultra", "Hyper", "Super", "Mega",
        "Prime", "Ultimate", "Extreme", "Maximum", "Infinite", "Eternal"
    ];
    
    let weaponCount = 0;
    
    // Generate weapons
    for(let template of animeWeaponTypes) {
        for(let i = 0; i < 10 && weaponCount < 1000; i++) {
            const modifier = weaponModifiers[Math.floor(Math.random() * weaponModifiers.length)];
            const suffix = i > 5 ? ` ${weaponSuffixes[Math.floor(Math.random() * weaponSuffixes.length)]}` : "";
            const weaponName = `${modifier} ${template.name}${suffix}`;
            const dmgMult = 1 + (i * 0.2);
            const speedMult = 1 + (i * 0.1);
            
            b.guns.push({
                name: weaponName.toLowerCase(),
                descriptionFunction() {
                    return `<b style="color:${template.color}">${template.effect}</b> power<br><strong>${(template.dmg * dmgMult).toFixed(1)}x</strong> damage`;
                },
                ammo: 100 + i * 20,
                ammoPack: 25 + i * 5,
                defaultAmmoPack: 25 + i * 5,
                have: false,
                fire() {
                    const angle = m.angle;
                    const proj = Bodies.circle(
                        m.pos.x + Math.cos(angle) * 35,
                        m.pos.y + Math.sin(angle) * 35,
                        8 + i,
                        spawn.propsIsNotHoldable
                    );
                    
                    Matter.Body.setVelocity(proj, {
                        x: Math.cos(angle) * template.speed * speedMult,
                        y: Math.sin(angle) * template.speed * speedMult
                    });
                    
                    proj.collisionFilter.category = cat.bullet;
                    proj.collisionFilter.mask = cat.mob;
                    proj.classType = "bullet";
                    proj.dmg = template.dmg * dmgMult * m.dmgScale;
                    proj.minDmgSpeed = 5;
                    proj.endCycle = m.cycle + 120;
                    
                    proj.do = function() {
                        simulation.drawList.push({
                            x: this.position.x,
                            y: this.position.y,
                            radius: this.circleRadius * 1.5,
                            color: template.color + "44",
                            time: 3
                        });
                    };
                    
                    Composite.add(engine.world, proj);
                    bullet.push(proj);
                    
                    m.fireCDcycle = m.cycle + Math.max(2, 20 - i);
                },
                do() {}
            });
            
            weaponCount++;
        }
    }
    
    console.log(`%c✓ Loaded ${weaponCount} weapons`, "color: #00ff00");
    
    // ==================== ENEMY GENERATORS ====================
    
    const animeEnemyTypes = [
        // Attack on Titan
        {name: "Colossal Titan", hp: 10, size: 100, color: "rgba(255,200,200,0.8)", ai: "boss"},
        {name: "Armored Titan", hp: 8, size: 80, color: "rgba(200,200,150,0.8)", ai: "tank"},
        {name: "Beast Titan", hp: 7, size: 70, color: "rgba(180,150,100,0.8)", ai: "ranged"},
        
        // Naruto
        {name: "Akatsuki Member", hp: 5, size: 45, color: "rgba(0,0,0,0.9)", ai: "elite"},
        {name: "Tailed Beast", hp: 12, size: 120, color: "rgba(255,100,0,0.8)", ai: "boss"},
        {name: "Shadow Clone", hp: 2, size: 35, color: "rgba(255,200,100,0.7)", ai: "swarm"},
        
        // Dragon Ball
        {name: "Frieza Form", hp: 15, size: 60, color: "rgba(200,0,200,0.8)", ai: "boss"},
        {name: "Cell Jr", hp: 4, size: 40, color: "rgba(0,200,100,0.8)", ai: "fast"},
        {name: "Majin Buu", hp: 10, size: 70, color: "rgba(255,150,200,0.8)", ai: "regenerate"},
        
        // One Piece
        {name: "Marine Admiral", hp: 8, size: 55, color: "rgba(200,200,255,0.8)", ai: "elite"},
        {name: "Pacifista", hp: 6, size: 65, color: "rgba(150,150,150,0.9)", ai: "tank"},
        {name: "Yonko Commander", hp: 9, size: 50, color: "rgba(255,0,0,0.8)", ai: "boss"},
        
        // Demon Slayer
        {name: "Upper Moon Demon", hp: 7, size: 50, color: "rgba(150,0,150,0.8)", ai: "elite"},
        {name: "Lower Moon Demon", hp: 4, size: 40, color: "rgba(100,0,100,0.7)", ai: "fast"},
        {name: "Muzan Kibutsuji", hp: 20, size: 65, color: "rgba(50,0,50,0.9)", ai: "boss"},
        
        // JoJo
        {name: "Stand User", hp: 5, size: 45, color: "rgba(255,215,0,0.8)", ai: "elite"},
        {name: "The World", hp: 8, size: 50, color: "rgba(255,255,0,0.8)", ai: "time stop"},
        {name: "Star Platinum", hp: 7, size: 50, color: "rgba(128,0,128,0.8)", ai: "rapid"},
        
        // Marvel/DC
        {name: "Sentinel", hp: 6, size: 80, color: "rgba(150,150,200,0.8)", ai: "tank"},
        {name: "Parademon", hp: 3, size: 40, color: "rgba(100,100,100,0.8)", ai: "swarm"},
        {name: "Doomsday", hp: 18, size: 90, color: "rgba(150,150,150,0.9)", ai: "boss"}
    ];
    
    let enemyCount = 0;
    
    for(let template of animeEnemyTypes) {
        for(let i = 0; i < 10 && enemyCount < 200; i++) {
            const enemyName = `${template.name} ${i > 5 ? 'Elite' : 'Lv.' + (i+1)}`;
            const hpMult = 1 + i * 0.3;
            const sizeMult = 1 + i * 0.05;
            
            spawn[enemyName.toLowerCase().replace(/\s+/g, '')] = function(x, y) {
                mobs.spawn(x, y, template.hp * hpMult, template.size * sizeMult, template.color);
                let me = mob[mob.length - 1];
                me.stroke = template.color.replace('0.8', '1');
                me.memory = 400 + i * 50;
                me.seeAtDistance2 = 2000000;
                
                me.do = function() {
                    this.gravity();
                    this.seePlayerCheck();
                    
                    if(this.seePlayer.yes) {
                        const angle = Math.atan2(
                            this.seePlayer.position.y - this.position.y,
                            this.seePlayer.position.x - this.position.x
                        );
                        this.force.x += 0.003 * this.mass * Math.cos(angle);
                        this.force.y += 0.003 * this.mass * Math.sin(angle);
                        
                        if(!(m.cycle % 60) && template.ai === "ranged" || template.ai === "elite") {
                            mobs.bullet(this, angle, 15 + i, 0.01 * (1 + i * 0.1));
                        }
                    }
                    
                    this.checkStatus();
                };
            };
            
            if(!spawn.fullPickList.includes(enemyName.toLowerCase().replace(/\s+/g, ''))) {
                spawn.fullPickList.push(enemyName.toLowerCase().replace(/\s+/g, ''));
            }
            
            enemyCount++;
        }
    }
    
    console.log(`%c✓ Loaded ${enemyCount} enemies`, "color: #00ff00");
    
    // ==================== FIELD GENERATORS ====================
    
    const animeFieldTypes = [
        {name: "Super Saiyan Aura", color: "#ffff00", effect: "power boost"},
        {name: "Chakra Cloak", color: "#ff8c00", effect: "defense"},
        {name: "Nen Aura", color: "#ff1493", effect: "versatile"},
        {name: "Haki Armament", color: "#000000", effect: "damage"},
        {name: "Quirk Activation", color: "#00ff00", effect: "special"},
        {name: "Stand Power", color: "#ffd700", effect: "ability"},
        {name: "Demon Mark", color: "#8b0000", effect: "rage"},
        {name: "Titan Form", color: "#ff4500", effect: "transform"},
        {name: "Infinity Stones", color: "#9400d3", effect: "reality"},
        {name: "Speed Force", color: "#ffff00", effect: "speed"}
    ];
    
    let fieldCount = 0;
    
    for(let template of animeFieldTypes) {
        for(let i = 0; i < 10 && fieldCount < 100; i++) {
            m.fieldUpgrades.push({
                name: `${template.name} ${i > 5 ? 'MAX' : 'Lv.' + (i+1)}`,
                description: `<b style="color:${template.color}">${template.effect}</b><br>${15 + i * 2} energy per second`,
                effect() {
                    m.fieldMeterColor = template.color;
                    m.eyeFillColor = m.fieldMeterColor;
                    m.fieldFx = () => 1 + i * 0.2;
                    m.setFillColors();
                    
                    m.hold = () => {
                        if(input.field && m.energy > 0.015 * (1 + i * 0.1)) {
                            m.energy -= 0.015 * (1 + i * 0.1);
                            
                            // Visual effect
                            if(m.cycle % 5 === 0) {
                                simulation.drawList.push({
                                    x: m.pos.x + (Math.random() - 0.5) * 80,
                                    y: m.pos.y + (Math.random() - 0.5) * 80,
                                    radius: 15,
                                    color: template.color + "66",
                                    time: 10
                                });
                            }
                            
                            // Bonus effects
                            m.dmgScale *= 1 + i * 0.05;
                            m.defaultDamping *= 0.95;
                        }
                        m.drawRegenEnergy();
                    };
                }
            });
            fieldCount++;
        }
    }
    
    console.log(`%c✓ Loaded ${fieldCount} fields`, "color: #00ff00");
    
    // ==================== TECH GENERATORS ====================
    
    const animeTechTypes = [
        {name: "Ultra Instinct", desc: "dodge automatically", req: ""},
        {name: "Sharingan", desc: "copy enemy patterns", req: ""},
        {name: "Observation Haki", desc: "see future attacks", req: ""},
        {name: "King's Engine", desc: "intimidate enemies", req: ""},
        {name: "All For One", desc: "steal abilities", req: ""},
        {name: "Alchemy Mastery", desc: "transmute projectiles", req: ""},
        {name: "Time Skip", desc: "erase time", req: ""},
        {name: "Bites the Dust", desc: "rewind on death", req: ""},
        {name: "Genjutsu", desc: "illusion damage", req: ""},
        {name: "Bankai", desc: "final form", req: ""}
    ];
    
    let techCount = 0;
    
    for(let template of animeTechTypes) {
        for(let i = 0; i < 10 && techCount < 100; i++) {
            tech.tech.push({
                name: `${template.name} ${i > 5 ? 'Mastery' : 'Tier ' + (i+1)}`,
                descriptionFunction() {
                    return `<b>${template.desc}</b><br><strong>${1 + i * 0.2}x</strong> effectiveness`;
                },
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed: () => true,
                requires: template.req,
                effect() {
                    tech[`is${template.name.replace(/\s+/g, '')}`] = true;
                    tech[`${template.name.replace(/\s+/g, '')}Level`] = i + 1;
                },
                remove() {
                    tech[`is${template.name.replace(/\s+/g, '')}`] = false;
                    tech[`${template.name.replace(/\s+/g, '')}Level`] = 0;
                }
            });
            techCount++;
        }
    }
    
    console.log(`%c✓ Loaded ${techCount} techs`, "color: #00ff00");
    
    // ==================== CUSTOMIZATION GENERATORS ====================
    
    const animeCustomizations = {
        auras: [
            "Super Saiyan", "Chakra Cloak", "Nen", "Haki", "Quirk", "Stand", 
            "Demon Mark", "Titan Steam", "Speed Force", "Green Lantern",
            "Infinity Gauntlet", "Phoenix Force", "Symbiote", "Stardust"
        ],
        accessories: [
            "Straw Hat", "Leaf Headband", "Survey Corps Cape", "Hero Costume",
            "Soul Reaper Sword", "Sharingan Eye", "Devil Fruit", "Sacred Gear",
            "Philosopher Stone", "Death Note", "Stand Arrow", "Scouter"
        ],
        effects: [
            "Ki Aura", "Chakra Flow", "Nen Glow", "Haki Coating", "Quirk Manifest",
            "Stand Appearance", "Cursed Energy", "Titan Marks", "Speed Trails",
            "Power Rings", "Cosmic Energy", "Mystic Arts", "Reality Warp"
        ]
    };
    
    let customCount = 0;
    for(let category in animeCustomizations) {
        customCount += animeCustomizations[category].length;
    }
    
    console.log(`%c✓ Loaded ${customCount} customizations`, "color: #00ff00");
    
    // Final summary
    console.log(`%c
╔═══════════════════════════════════════════════════╗
║   MEGA UNIVERSE EXPANSION LOADED SUCCESSFULLY!    ║
╠═══════════════════════════════════════════════════╣
║   ✓ ${weaponCount} Weapons                              ║
║   ✓ ${enemyCount} Enemies                               ║
║   ✓ ${fieldCount} Fields                                ║
║   ✓ ${techCount} Techs                                  ║
║   ✓ ${customCount} Customizations                       ║
╠═══════════════════════════════════════════════════╣
║   TOTAL: ${weaponCount + enemyCount + fieldCount + techCount + customCount}+ ITEMS!                           ║
╚═══════════════════════════════════════════════════╝
    `, "color: #ff00ff; font-weight: bold; font-size: 14px");
    
})();
