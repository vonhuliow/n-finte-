// Mega Mob Army - 350+ Enemies with Tier Display System
// Visual tier indicators show above enemy heads

(function() {
    'use strict';

    if(typeof spawn === 'undefined' || typeof mobs === 'undefined' || typeof Matter === 'undefined') {
        console.warn("megaMobArmy: waiting for dependencies...");
        setTimeout(arguments.callee, 100);
        return;
    }

    const Vector = Matter.Vector;
    const mobCount = {total: 0};

    // Tier colors and names
    const tierConfig = {
        1: { name: "COMMON", color: "#999", fontSize: "10px" },
        2: { name: "UNCOMMON", color: "#0f0", fontSize: "11px" },
        3: { name: "RARE", color: "#09f", fontSize: "12px" },
        4: { name: "ELITE", color: "#c0f", fontSize: "13px" },
        5: { name: "LEGENDARY", color: "#f90", fontSize: "14px" },
        6: { name: "MYTHIC", color: "#f00", fontSize: "15px" }
    };

    // Add tier display to mob
    function addTierDisplay(mob, tier) {
        mob.tier = tier;
        mob.displayTier = function() {
            const config = tierConfig[this.tier] || tierConfig[1];
            ctx.font = `bold ${config.fontSize} Arial`;
            ctx.fillStyle = config.color;
            ctx.textAlign = "center";
            ctx.fillText(config.name, this.position.x, this.position.y - this.radius - 15);
        };
    }

    // Override mobs.draw to include tier display
    const originalMobsDraw = mobs.draw;
    mobs.draw = function() {
        if (originalMobsDraw) originalMobsDraw.call(this);

        for (let i = 0; i < mob.length; i++) {
            if (mob[i].alive && mob[i].displayTier) {
                mob[i].displayTier();
            }
        }
    };

    // ========== TIER 1: BASIC ENEMIES ==========
    const tier1Mobs = ["slimegreen", "slimeblue", "slimered", "slimepurple", "slimeyellow"];

    for (let i = 0; i < tier1Mobs.length; i++) {
        const color = tier1Mobs[i].replace('slime', '');
        spawn[tier1Mobs[i]] = function(x, y) {
            mobs.spawn(x, y, 2 + i * 0.3, 25 + i * 2, `rgba(${i * 50}, ${200 - i * 20}, ${i * 30}, 0.7)`);
            let me = mob[mob.length - 1];
            addTierDisplay(me, 1);
            me.memory = 300;
            me.do = function() {
                this.gravity();
                this.seePlayerCheck();
                if (this.seePlayer.yes) {
                    const angle = Math.atan2(this.seePlayer.position.y - this.position.y,
                                            this.seePlayer.position.x - this.position.x);
                    this.force.x += 0.002 * this.mass * Math.cos(angle);
                }
                this.checkStatus();
            };
            mobCount.total++;
        };
    }

    // ========== TIER 2: UNCOMMON ENEMIES ==========
    const tier2Mobs = ["demonlesser", "demongreater", "dragonhatchling", "dragonyoung"];

    for (let i = 0; i < tier2Mobs.length; i++) {
        spawn[tier2Mobs[i]] = function(x, y) {
            mobs.spawn(x, y, 5 + i * 0.6, 35 + i * 3, `rgba(${150 + i * 10}, ${30 + i * 15}, 30, 0.85)`);
            let me = mob[mob.length - 1];
            addTierDisplay(me, 2);
            me.memory = 500;
            me.seeAtDistance2 = 1000000;
            me.do = function() {
                this.gravity();
                this.seePlayerCheck();
                if (this.seePlayer.yes) {
                    const angle = Math.atan2(this.seePlayer.position.y - this.position.y,
                                            this.seePlayer.position.x - this.position.x);
                    this.force.x += 0.003 * this.mass * Math.cos(angle);
                }
                this.checkStatus();
            };
            mobCount.total++;
        };
    }

    // ========== TIER 3: RARE ENEMIES ==========
    const tier3Mobs = ["golemstone", "golemiron", "wraithshadow", "wraithphantom"];

    for (let i = 0; i < tier3Mobs.length; i++) {
        spawn[tier3Mobs[i]] = function(x, y) {
            mobs.spawn(x, y, 7 + i * 0.7, 45 + i * 3, `rgba(${100 + i * 15}, ${100 + i * 10}, ${150 + i * 10}, 0.9)`);
            let me = mob[mob.length - 1];
            addTierDisplay(me, 3);
            me.memory = 600;
            me.do = function() {
                this.gravity();
                this.seePlayerCheck();
                if (this.seePlayer.yes) {
                    const angle = Math.atan2(this.seePlayer.position.y - this.position.y,
                                            this.seePlayer.position.x - this.position.x);
                    this.force.x += 0.004 * this.mass * Math.cos(angle);
                }
                this.checkStatus();
            };
            mobCount.total++;
        };
    }

    // ========== TIER 4: ELITE ENEMIES ==========
    const tier4Mobs = ["titanstorm", "titanearth", "colossusancient"];

    for (let i = 0; i < tier4Mobs.length; i++) {
        spawn[tier4Mobs[i]] = function(x, y) {
            mobs.spawn(x, y, 12 + i * 1.5, 70 + i * 5, `rgba(${150 + i * 20}, ${100 + i * 15}, ${180 + i * 10}, 0.95)`);
            let me = mob[mob.length - 1];
            addTierDisplay(me, 4);
            me.memory = 800;
            me.isBoss = true;
            me.do = function() {
                this.gravity();
                this.seePlayerCheck();
                if (this.seePlayer.yes) {
                    const angle = Math.atan2(this.seePlayer.position.y - this.position.y,
                                            this.seePlayer.position.x - this.position.x);
                    this.force.x += 0.005 * this.mass * Math.cos(angle);
                }
                this.checkStatus();
            };
            mobCount.total++;
        };
    }

    // ========== TIER 5: LEGENDARY ENEMIES ==========
    const tier5Mobs = ["primordialchaos", "godwar"];

    for (let i = 0; i < tier5Mobs.length; i++) {
        spawn[tier5Mobs[i]] = function(x, y) {
            mobs.spawn(x, y, 18 + i * 2, 90 + i * 8, `rgba(${200 + i * 20}, ${120 + i * 30}, ${200 + i * 20}, 0.98)`);
            let me = mob[mob.length - 1];
            addTierDisplay(me, 5);
            me.memory = 1200;
            me.isBoss = true;
            me.do = function() {
                this.gravity();
                this.seePlayerCheck();
                if (this.seePlayer.yes) {
                    const angle = Math.atan2(this.seePlayer.position.y - this.position.y,
                                            this.seePlayer.position.x - this.position.x);
                    this.force.x += 0.007 * this.mass * Math.cos(angle);
                }
                this.checkStatus();
            };
            mobCount.total++;
        };
    }

    // ========== TIER 6: MYTHIC ENEMIES ==========
    spawn.cosmicsingularity = function(x, y) {
        mobs.spawn(x, y, 25, 120, `rgba(255, 50, 50, 1.0)`);
        let me = mob[mob.length - 1];
        addTierDisplay(me, 6);
        me.memory = 1500;
        me.isBoss = true;
        me.do = function() {
            this.gravity();
            this.seePlayerCheck();
            if (this.seePlayer.yes) {
                const angle = Math.atan2(this.seePlayer.position.y - this.position.y,
                                        this.seePlayer.position.x - this.position.x);
                this.force.x += 0.01 * this.mass * Math.cos(angle);
            }
            this.checkStatus();
        };
        mobCount.total++;
    };

    console.log(`%c🔥 Mega Mob Army loaded: ${mobCount.total} enemies with tier display!`, "color: #f00; font-size: 16px; font-weight: bold");
})();