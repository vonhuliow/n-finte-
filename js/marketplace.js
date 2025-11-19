
// Marketplace System for n-gon
// Provides a scrollable shop interface for purchasing weapons, upgrades, and customizations

const marketplace = {
    isOpen: false,
    currency: 0,
    scrollOffset: 0,
    maxScroll: 0,
    categories: ['weapons', 'melee', 'upgrades', 'cosmetics', 'characters'],
    currentCategory: 'weapons',
    
    addCurrencyOnKill() {
        // Hook into mob death to add currency
        const originalMobDeath = Matter.Events._listeners['collisionEnd'];
        const self = this;
        
        // Add currency when mobs die
        setInterval(() => {
            if (typeof mobs !== 'undefined' && mobs.deathCount !== undefined) {
                const newDeaths = mobs.deathCount - (self.lastDeathCount || 0);
                if (newDeaths > 0) {
                    self.currency += newDeaths * 10;
                    self.lastDeathCount = mobs.deathCount;
                    const currencyDisplay = document.querySelector('#marketplace-container span[style*="ffd700"]');
                    if (currencyDisplay) {
                        currencyDisplay.textContent = `💰 ${self.currency}`;
                    }
                }
            }
        }, 100);
    },
    lastDeathCount: 0,
    
    items: {
        weapons: [],
        melee: [],
        upgrades: [],
        cosmetics: [],
        characters: []
    },
    
    init() {
        this.populateItems();
        this.createMarketplaceUI();
    },
    
    populateItems() {
        // Weapons
        if (typeof b !== 'undefined' && b.guns) {
            for (let i = 0; i < b.guns.length; i++) {
                this.items.weapons.push({
                    index: i,
                    name: b.guns[i].name,
                    price: 100 + i * 50,
                    description: b.guns[i].descriptionFunction ? b.guns[i].descriptionFunction() : 'A powerful weapon',
                    owned: b.guns[i].have
                });
            }
        }
        
        // Melee weapons
        const meleeWeapons = ['Scythe', 'Sword', 'Spear', 'Katana', 'Battle Axe', 'Trident', 'Hammer', 'Chain Scythe'];
        meleeWeapons.forEach((name, i) => {
            this.items.melee.push({
                name: name,
                price: 200 + i * 75,
                description: `Powerful ${name} for close combat`,
                owned: false
            });
        });
        
        // Upgrades
        for (let i = 0; i < 20; i++) {
            this.items.upgrades.push({
                name: `Upgrade Tier ${i + 1}`,
                price: 150 + i * 100,
                description: `+${(i + 1) * 10}% damage and stats`,
                owned: false
            });
        }
        
        // Cosmetics
        const cosmetics = ['Fire Aura', 'Ice Aura', 'Lightning Aura', 'Shadow Aura', 'Holy Aura', 'Rainbow Trail', 'Sparkle Effect', 'Glow Effect', 'Wings', 'Crown', 'Cape', 'Halo'];
        cosmetics.forEach((name, i) => {
            this.items.cosmetics.push({
                name: name,
                price: 300 + i * 50,
                description: `Visual effect: ${name}`,
                owned: false
            });
        });
        
        // Characters
        if (typeof characterCustomization !== 'undefined' && characterCustomization.characters) {
            Object.keys(characterCustomization.characters).forEach((key, i) => {
                const char = characterCustomization.characters[key];
                this.items.characters.push({
                    key: key,
                    name: char.name,
                    price: 500 + i * 200,
                    description: `Speed: ${char.stats.speed}x, Jump: ${char.stats.jump}x, HP: ${char.stats.health}x`,
                    owned: false
                });
            });
        }
    },
    
    createMarketplaceUI() {
        const marketDiv = document.createElement('div');
        marketDiv.id = 'marketplace-container';
        marketDiv.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 1200px;
            height: 80%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 3px solid #0f3460;
            border-radius: 15px;
            z-index: 10000;
            overflow: hidden;
            box-shadow: 0 0 50px rgba(15, 52, 96, 0.8);
        `;
        
        marketDiv.innerHTML = `
            <div style="padding: 20px; height: 100%; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h1 style="color: #00d4ff; margin: 0; font-size: 32px;">⚔️ ARSENAL MARKETPLACE ⚔️</h1>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <span style="color: #ffd700; font-size: 24px;">💰 ${this.currency}</span>
                        <button onclick="marketplace.close()" style="background: #e94560; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">✕ Close</button>
                    </div>
                </div>
                
                <div id="marketplace-categories" style="display: flex; gap: 10px; margin-bottom: 20px;">
                    ${this.categories.map(cat => `
                        <button onclick="marketplace.switchCategory('${cat}')" 
                                class="category-btn" 
                                data-category="${cat}"
                                style="flex: 1; padding: 12px; background: ${cat === this.currentCategory ? '#00d4ff' : '#0f3460'}; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold; transition: all 0.3s;">
                            ${cat.toUpperCase()}
                        </button>
                    `).join('')}
                </div>
                
                <div id="marketplace-items" style="flex: 1; overflow-y: auto; padding-right: 10px;">
                    <!-- Items will be populated here -->
                </div>
            </div>
        `;
        
        document.body.appendChild(marketDiv);
    },
    
    open() {
        this.isOpen = true;
        document.getElementById('marketplace-container').style.display = 'block';
        this.renderItems();
        simulation.paused = true;
    },
    
    close() {
        this.isOpen = false;
        document.getElementById('marketplace-container').style.display = 'none';
        simulation.paused = false;
    },
    
    switchCategory(category) {
        this.currentCategory = category;
        this.scrollOffset = 0;
        
        // Update button styles
        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.style.background = '#00d4ff';
            } else {
                btn.style.background = '#0f3460';
            }
        });
        
        this.renderItems();
    },
    
    renderItems() {
        const container = document.getElementById('marketplace-items');
        const items = this.items[this.currentCategory];
        
        container.innerHTML = items.map((item, index) => `
            <div style="background: rgba(15, 52, 96, 0.5); margin-bottom: 10px; padding: 15px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid ${item.owned ? '#00ff00' : '#00d4ff'};">
                <div style="flex: 1;">
                    <h3 style="color: ${item.owned ? '#00ff00' : '#00d4ff'}; margin: 0 0 5px 0;">${item.owned ? '✓ ' : ''}${item.name}</h3>
                    <p style="color: #ccc; margin: 0; font-size: 14px;">${item.description}</p>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                    <span style="color: #ffd700; font-size: 18px; font-weight: bold;">💰 ${item.price}</span>
                    <button onclick="marketplace.purchase('${this.currentCategory}', ${index})" 
                            style="background: ${item.owned ? '#666' : '#00d4ff'}; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: ${item.owned ? 'not-allowed' : 'pointer'}; font-weight: bold;"
                            ${item.owned ? 'disabled' : ''}>
                        ${item.owned ? 'OWNED' : 'BUY'}
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    purchase(category, index) {
        const item = this.items[category][index];
        
        if (item.owned) {
            return;
        }
        
        if (this.currency >= item.price) {
            this.currency -= item.price;
            item.owned = true;
            
            // Grant the item based on category
            if (category === 'weapons' || category === 'melee') {
                b.guns[item.index].have = true;
                b.giveGuns(item.index);
            }
            
            simulation.inGameConsole(`<span style='color:#00ff00'>Purchased: ${item.name}</span>`);
            this.renderItems();
        } else {
            simulation.inGameConsole(`<span style='color:#ff0000'>Not enough currency!</span>`);
        }
    },
    
    addCurrency(amount) {
        this.currency += amount;
        const currencyDisplay = document.querySelector('#marketplace-container span[style*="ffd700"]');
        if (currencyDisplay) {
            currencyDisplay.textContent = `💰 ${this.currency}`;
        }
    }
};

// Initialize marketplace when game loads
window.addEventListener('load', () => {
    marketplace.init();
    marketplace.addCurrencyOnKill();
});

// Add key binding to open marketplace
window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyM' && !marketplace.isOpen && m.alive) {
        marketplace.open();
    }
});
