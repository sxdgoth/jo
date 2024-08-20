// SkinToneManager.js

class SkinToneManager {
    constructor() {
        this.skinTones = {
            light: {
                name: 'Light',
                main: '#FEE2CA',
                shadow: '#EFC1B7'
            },
            medium: {
                name: 'Medium',
                main: '#FFE0BD',
                shadow: '#EFD0B1'
            },
            tan: {
                name: 'Tan',
                main: '#F1C27D',
                shadow: '#E0B170'
            },
            dark: {
                name: 'Dark',
                main: '#8D5524',
                shadow: '#7C4A1E'
            }
        };
        this.currentSkinTone = this.skinTones.light;
        this.baseParts = ['Legs', 'Arms', 'Body', 'Head'];
        this.originalColors = {};
    }

    initialize() {
        console.log("SkinToneManager initializing...");
        this.setupSkinToneButtons();
        this.saveOriginalColors();
        this.loadSavedSkinTone();
    }

    setupSkinToneButtons() {
        const container = document.getElementById('skin-tone-buttons');
        if (!container) {
            console.error("Skin tone buttons container not found");
            return;
        }
        const buttons = container.querySelectorAll('.skin-tone-button');
        buttons.forEach(button => {
            const toneName = button.dataset.tone;
            const tone = this.skinTones[toneName];
            if (tone) {
                button.style.background = `linear-gradient(135deg, ${tone.main} 50%, ${tone.shadow} 50%)`;
                button.onclick = () => this.selectSkinTone(tone);
            }
        });
        console.log("Skin tone buttons set up");
    }

    selectSkinTone(tone) {
        this.currentSkinTone = tone;
        console.log(`Selected skin tone: ${tone.name}`);
        
        // Update button styles
        const buttons = document.querySelectorAll('.skin-tone-button');
        buttons.forEach(button => {
            if (button.dataset.tone === this.getSkinToneKey(tone)) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });

        // Apply skin tone to avatar
        this.applySkinTone(tone);

        // Update AvatarManager if it exists
        if (window.avatarManager) {
            window.avatarManager.changeSkinTone(this.getSkinToneKey(tone));
        }

        // Save the selected skin tone
        this.saveSkinTone(this.getSkinToneKey(tone));

        // Update shop display if it exists
        if (window.shopManager && window.shopManager.updateShopDisplay) {
            window.shopManager.updateShopDisplay();
        }
    }

    getSkinToneKey(tone) {
        return Object.keys(this.skinTones).find(key => this.skinTones[key] === tone);
    }

    saveOriginalColors() {
        if (window.avatarBody && window.avatarBody.layers) {
            this.baseParts.forEach(part => {
                const layer = window.avatarBody.layers[part];
                if (layer) {
                    this.originalColors[part] = layer.src;
                }
            });
        }
    }

    applySkinTone(tone) {
        console.log(`Applying skin tone: ${tone.name}`);
        if (window.avatarBody && window.avatarBody.layers) {
            this.baseParts.forEach(part => {
                const layer = window.avatarBody.layers[part];
                if (layer) {
                    console.log(`Applying skin tone to ${part}`);
                    const originalSrc = this.originalColors[part];
                    this.applySkinToneToSVG(layer, tone, originalSrc, part);
                } else {
                    console.warn(`Layer ${part} not found`);
                }
            });
        } else {
            console.error('Avatar body or layers not found');
        }
    }

    applySkinToneToSVG(img, tone, originalSrc, partName) {
        fetch(originalSrc)
            .then(response => response.text())
            .then(svgText => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                
                const elements = svgDoc.querySelectorAll('path, circle, ellipse, rect');
                
                elements.forEach(element => {
                    const currentFill = element.getAttribute('fill');
                    const currentStroke = element.getAttribute('stroke');
                    
                    if (currentFill && currentFill.toLowerCase() !== 'none') {
                        element.setAttribute('fill', tone.main);
                    }
                    
                    if (currentStroke && currentStroke.toLowerCase() !== 'none') {
                        element.setAttribute('stroke', tone.shadow);
                    }
                });

                console.log(`Skin tone applied to ${partName}`);
                const serializer = new XMLSerializer();
                const modifiedSvgString = serializer.serializeToString(svgDoc);
                const blob = new Blob([modifiedSvgString], {type: 'image/svg+xml'});
                const url = URL.createObjectURL(blob);
                img.src = url;
            })
            .catch(error => console.error(`Error applying skin tone to ${partName}:`, error));
    }

    applySkinToneToShopItem(imgElement, item) {
        if (['Eyes', 'Face', 'Accessories', 'Mouth', 'Nose'].includes(item.type)) {
            imgElement.addEventListener('load', () => {
                const svgDoc = imgElement.contentDocument;
                if (svgDoc) {
                    const elements = svgDoc.querySelectorAll('path, circle, ellipse, rect');
                    elements.forEach(element => {
                        const currentFill = element.getAttribute('fill');
                        const currentStroke = element.getAttribute('stroke');
                        
                        if (currentFill && currentFill.toLowerCase() !== 'none') {
                            element.setAttribute('fill', this.currentSkinTone.main);
                        }
                        
                        if (currentStroke && currentStroke.toLowerCase() !== 'none') {
                            element.setAttribute('stroke', this.currentSkinTone.shadow);
                        }
                    });
                }
            });
        }
    }

    saveSkinTone(toneKey) {
        localStorage.setItem('currentSkinTone', toneKey);
    }

    loadSavedSkinTone() {
        const savedTone = localStorage.getItem('currentSkinTone');
        if (savedTone && this.skinTones[savedTone]) {
            this.selectSkinTone(this.skinTones[savedTone]);
        }
    }
}

// Create and initialize the SkinToneManager
document.addEventListener('DOMContentLoaded', () => {
    window.skinToneManager = new SkinToneManager();
    window.skinToneManager.initialize();
});

// ShopManager.js

class ShopManager {
    constructor(username) {
        this.username = username;
        this.baseUrl = 'https://sxdgoth.github.io/jo/';
        this.shopItems = shopItems;
        this.inventory = [];
        this.loadInventory();
    }

    loadInventory() {
        const savedInventory = localStorage.getItem(`inventory_${this.username}`);
        if (savedInventory) {
            this.inventory = JSON.parse(savedInventory);
        }
    }

    saveInventory() {
        localStorage.setItem(`inventory_${this.username}`, JSON.stringify(this.inventory));
    }

    updateShopDisplay() {
        const shopContainer = document.getElementById('shop-container');
        shopContainer.innerHTML = '';

        this.shopItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';

            const img = document.createElement('object');
            img.type = 'image/svg+xml';
            img.data = `${this.baseUrl}${item.path}${item.id}`;
            img.className = 'item-image';
            img.dataset.id = item.id;

            // Apply skin tone to shop item
            if (window.skinToneManager) {
                window.skinToneManager.applySkinToneToShopItem(img, item);
            }

            const nameElement = document.createElement('p');
            nameElement.textContent = item.name;

            const priceElement = document.createElement('p');
            priceElement.textContent = `Price: ${item.price}`;

            const buyButton = document.createElement('button');
            buyButton.textContent = 'Buy';
            buyButton.addEventListener('click', () => this.buyItem(item));

            const tryOnButton = document.createElement('button');
            tryOnButton.textContent = 'Try On';
            tryOnButton.addEventListener('click', () => this.tryOnItem(item));

            itemElement.appendChild(img);
            itemElement.appendChild(nameElement);
            itemElement.appendChild(priceElement);
            itemElement.appendChild(buyButton);
            itemElement.appendChild(tryOnButton);

            shopContainer.appendChild(itemElement);
        });
    }

    buyItem(item) {
        if (this.inventory.some(invItem => invItem.id === item.id)) {
            alert('You already own this item!');
            return;
        }

        this.inventory.push(item);
        this.saveInventory();
        alert(`You bought ${item.name}!`);

        if (window.inventoryManager) {
            window.inventoryManager.updateInventoryDisplay();
        }
    }

    tryOnItem(item) {
        if (window.avatarDisplay) {
            window.avatarDisplay.tryOnItem(item);
        } else {
            console.error('Avatar display not found');
        }
    }

    filterItems(category) {
        const filteredItems = category === 'all' 
            ? this.shopItems 
            : this.shopItems.filter(item => item.type === category);
        
        this.updateShopDisplay(filteredItems);
    }

    updateShopDisplay(items = this.shopItems) {
        const shopContainer = document.getElementById('shop-container');
        shopContainer.innerHTML = '';

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';

            const img = document.createElement('object');
            img.type = 'image/svg+xml';
            img.data = `${this.baseUrl}${item.path}${item.id}`;
            img.className = 'item-image';
            img.dataset.id = item.id;

            // Apply skin tone to shop item
            if (window.skinToneManager) {
                window.skinToneManager.applySkinToneToShopItem(img, item);
            }

            const nameElement = document.createElement('p');
            nameElement.textContent = item.name;

            const priceElement = document.createElement('p');
            priceElement.textContent = `Price: ${item.price}`;

            const buyButton = document.createElement('button');
            buyButton.textContent = 'Buy';
            buyButton.addEventListener('click', () => this.buyItem(item));

            const tryOnButton = document.createElement('button');
            tryOnButton.textContent = 'Try On';
            tryOnButton.addEventListener('click', () => this.tryOnItem(item));

            itemElement.appendChild(img);
            itemElement.appendChild(nameElement);
            itemElement.appendChild(priceElement);
            itemElement.appendChild(buyButton);
            itemElement.appendChild(tryOnButton);

            shopContainer.appendChild(itemElement);
        });
    }
}

// Initialize the ShopManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        window.shopManager = new ShopManager(loggedInUser.username);
        window.shopManager.updateShopDisplay();

        // Set up category filter buttons
        const categoryButtons = document.querySelectorAll('.category-button');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                window.shopManager.filterItems(category);
            });
        });
    } else {
        console.error('No logged in user found');
    }
});
