
// Enhanced Marketplace Popup - Closeable menu with all weapons
(function() {
    'use strict';
    
    if(typeof b === 'undefined') {
        console.warn("enhancedMarketplacePopup: waiting for game...");
        setTimeout(arguments.callee, 100);
        return;
    }

    const marketplacePopup = {
        isOpen: false,
        currency: 1000,
        
        createUI() {
            const popupDiv = document.createElement('div');
            popupDiv.id = 'marketplace-popup';
            popupDiv.style.cssText = `
                display: none;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 85%;
                max-width: 1400px;
                height: 80%;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 3px solid #ffd700;
                border-radius: 15px;
                z-index: 10001;
                overflow: hidden;
                box-shadow: 0 0 50px rgba(255, 215, 0, 0.8);
            `;
            
            popupDiv.innerHTML = `
                <div style="padding: 20px; height: 100%; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h1 style="color: #ffd700; margin: 0; font-size: 32px;">💰 WEAPON MARKETPLACE 💰</h1>
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <span style="color: #ffd700; font-size: 24px;">Currency: <span id="marketplace-currency">${this.currency}</span></span>
                            <button onclick="marketplacePopup.close()" style="background: #e94560; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">✕ Close</button>
                        </div>
                    </div>
                    
                    <div style="flex: 1; overflow-y: auto; padding-right: 10px;" id="marketplace-items">
                        <!-- Items populated here -->
                    </div>
                </div>
            `;
            
            document.body.appendChild(popupDiv);
            this.populateItems();
        },
        
        populateItems() {
            const container = document.getElementById('marketplace-items');
            if (!container) return;
            
            const items = [];
            
            // Add all guns with prices
            for (let i = 0; i < b.guns.length; i++) {
                items.push({
                    index: i,
                    name: b.guns[i].name,
                    price: Math.floor(100 + Math.random() * 400),
                    description: typeof b.guns[i].descriptionFunction === 'function' ? 
                                b.guns[i].descriptionFunction() : 'Weapon',
                    owned: b.guns[i].have,
                    type: 'gun'
                });
            }
            
            container.innerHTML = items.map((item, idx) => {
                const rarityColor = item.price < 200 ? '#aaa' : 
                                   item.price < 300 ? '#00d4ff' : 
                                   item.price < 400 ? '#9b59b6' : '#ffd700';
                
                return `
                    <div style="background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.8) 100%); margin-bottom: 12px; padding: 18px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border-left: 5px solid ${rarityColor}; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
                        <div style="flex: 1;">
                            <h3 style="color: ${rarityColor}; margin: 0 0 8px 0; font-size: 20px;">
                                ${item.owned ? '✓ ' : ''}${item.name}
                            </h3>
                            <p style="color: #ccc; margin: 0; font-size: 14px;">
                                ${item.description.replace(/<[^>]*>/g, '')}
                            </p>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; min-width: 120px;">
                            <span style="color: #ffd700; font-size: 22px; font-weight: bold;">
                                💰 ${item.price}
                            </span>
                            <button onclick="marketplacePopup.purchase(${idx})" style="background: ${item.owned ? '#666' : 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)'}; color: ${item.owned ? '#ccc' : '#000'}; border: none; padding: 10px 20px; border-radius: 8px; cursor: ${item.owned ? 'not-allowed' : 'pointer'}; font-weight: bold;" ${item.owned ? 'disabled' : ''}>
                                ${item.owned ? 'OWNED' : 'BUY NOW'}
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            this.items = items;
        },
        
        open() {
            this.isOpen = true;
            document.getElementById('marketplace-popup').style.display = 'block';
        },
        
        close() {
            this.isOpen = false;
            document.getElementById('marketplace-popup').style.display = 'none';
        },
        
        purchase(index) {
            const item = this.items[index];
            
            if (item.owned || this.currency < item.price) {
                simulation.inGameConsole('<span style="color:#ff0000">Not enough currency!</span>');
                return;
            }
            
            this.currency -= item.price;
            item.owned = true;
            
            if (item.type === 'gun') {
                b.guns[item.index].have = true;
                b.giveGuns(item.index);
            }
            
            document.getElementById('marketplace-currency').textContent = this.currency;
            simulation.inGameConsole(`<span style="color:#00ff00">Purchased: ${item.name}</span>`);
            
            this.populateItems();
        },
        
        addCurrency(amount) {
            this.currency += amount;
            const display = document.getElementById('marketplace-currency');
            if (display) display.textContent = this.currency;
        }
    };
    
    // Add keybind to open marketplace
    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyB' && m.alive) {
            if (marketplacePopup.isOpen) {
                marketplacePopup.close();
            } else {
                marketplacePopup.open();
            }
        }
    });
    
    window.marketplacePopup = marketplacePopup;
    marketplacePopup.createUI();
    
    console.log('%cMarketplace Popup loaded! Press B to open', 'color: #ffd700; font-weight: bold');
})();
