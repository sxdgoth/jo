function createLipPalette(baseColor) {
    const rgb = parseInt(baseColor.slice(1), 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    
    return [
        `#${baseColor.slice(1)}`, // Main color
        `#${Math.max(0, r - 40).toString(16).padStart(2, '0')}${Math.max(0, g - 40).toString(16).padStart(2, '0')}${Math.max(0, b - 40).toString(16).padStart(2, '0')}`, // Darker shade
        `#${Math.min(255, r + 20).toString(16).padStart(2, '0')}${Math.min(255, g + 20).toString(16).padStart(2, '0')}${Math.min(255, b + 20).toString(16).padStart(2, '0')}` // Lighter shade
    ];
}

class AvatarManager {
    constructor(username) {
        this.username = username;
        this.equippedItems = {};
        this.tempEquippedItems = {};
        this.skinTone = 'light';
        this.eyeColor = '#3FA2FF'; // Default eye color
        this.lipColor = '#E6998F'; // Default lip color
        this.debounceTimer = null;
        this.loadEquippedItems();
    }

    initialize() {
        this.setupApplyAvatarButton();
        this.setupClearAvatarButton();
        this.setupEyeColorPicker();
        this.setupLipColorPicker();
        this.updateAvatarDisplay();
    }

    setupApplyAvatarButton() {
        const applyAvatarBtn = document.getElementById('apply-avatar-btn');
        if (applyAvatarBtn) {
            applyAvatarBtn.addEventListener('click', () => this.applyAvatar());
        } else {
            console.error('Apply Avatar button not found');
        }
    }

    setupClearAvatarButton() {
        const clearAvatarBtn = document.getElementById('clear-avatar-btn');
        if (clearAvatarBtn) {
            clearAvatarBtn.addEventListener('click', () => this.clearAvatar());
        } else {
            console.error('Clear Avatar button not found');
        }
    }

    setupEyeColorPicker() {
        const eyeColorPicker = document.getElementById('eye-color-input');
        if (eyeColorPicker) {
            eyeColorPicker.value = this.eyeColor;
            eyeColorPicker.addEventListener('input', (event) => {
                this.debounceChangeEyeColor(event.target.value);
            });
        } else {
            console.error('Eye color picker not found');
        }
    }

    setupLipColorPicker() {
        const lipColorPicker = document.getElementById('lip-color-input');
        if (lipColorPicker) {
            lipColorPicker.value = this.lipColor;
            lipColorPicker.addEventListener('input', (event) => {
                this.debounceChangeLipColor(event.target.value);
            });
        } else {
            console.error('Lip color picker not found');
        }
    }

    loadEquippedItems() {
        const savedItems = localStorage.getItem(`equippedItems_${this.username}`);
        if (savedItems) {
            this.equippedItems = JSON.parse(savedItems);
            this.tempEquippedItems = {...this.equippedItems};
        }
        const savedSkinTone = localStorage.getItem(`skinTone_${this.username}`);
        if (savedSkinTone) {
            this.skinTone = savedSkinTone;
        }
        const savedEyeColor = localStorage.getItem(`eyeColor_${this.username}`);
        if (savedEyeColor) {
            this.eyeColor = savedEyeColor;
        }
        const savedLipColor = localStorage.getItem(`lipColor_${this.username}`);
        if (savedLipColor) {
            this.lipColor = savedLipColor;
        }
    }

    applyAvatar() {
        // Only update equippedItems with non-null values from tempEquippedItems
        Object.keys(this.tempEquippedItems).forEach(key => {
            if (this.tempEquippedItems[key]) {
                this.equippedItems[key] = this.tempEquippedItems[key];
            } else {
                delete this.equippedItems[key];
            }
        });

        // Remove any equipped items that are not in tempEquippedItems
        Object.keys(this.equippedItems).forEach(key => {
            if (!(key in this.tempEquippedItems)) {
                delete this.equippedItems[key];
            }
        });

        localStorage.setItem(`equippedItems_${this.username}`, JSON.stringify(this.equippedItems));
        localStorage.setItem(`skinTone_${this.username}`, this.skinTone);
        localStorage.setItem(`eyeColor_${this.username}`, this.eyeColor);
        localStorage.setItem(`lipColor_${this.username}`, this.lipColor);

        this.updateAvatarDisplay();
        alert('Avatar saved successfully!');
    }

    clearAvatar() {
        this.tempEquippedItems = {};
        this.updateItemVisuals();
        this.updateTempAvatarDisplay();
    }

    updateAvatarDisplay() {
        if (window.avatarBody) {
            window.avatarBody.clearAllLayers();
            
            this.applySkinTone();
            Object.entries(this.equippedItems).forEach(([type, itemId]) => {
                if (itemId) {
                    const item = window.userInventory.getItems().find(i => i.id === itemId);
                    if (item) {
                        this.updateLayerWithSkinTone(type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
                    }
                }
            });
        }
    }

    toggleItem(item) {
        if (this.tempEquippedItems[item.type] === item.id) {
            delete this.tempEquippedItems[item.type];
        } else {
            this.tempEquippedItems[item.type] = item.id;
        }
        this.updateItemVisuals();
        this.updateTempAvatarDisplay();
    }

    updateItemVisuals() {
        document.querySelectorAll('.wardrobe-item').forEach(itemContainer => {
            const itemId = itemContainer.querySelector('.item-image').dataset.id;
            const item = window.userInventory.getItems().find(i => i.id === itemId);
            if (item && this.tempEquippedItems[item.type] === item.id) {
                itemContainer.classList.add('highlighted');
            } else {
                itemContainer.classList.remove('highlighted');
            }
        });
    }

    updateTempAvatarDisplay() {
        if (window.avatarBody) {
            window.avatarBody.clearAllLayers();
            
            this.applySkinTone();
            Object.entries(this.tempEquippedItems).forEach(([type, itemId]) => {
                if (itemId) {
                    const item = window.userInventory.getItems().find(i => i.id === itemId);
                    if (item) {
                        this.updateLayerWithSkinTone(type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
                    }
                }
            });
        }
    }

    changeSkinTone(newTone) {
        this.skinTone = newTone;
        this.updateTempAvatarDisplay();
    }

    debounceChangeEyeColor(newColor) {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
            this.changeEyeColor(newColor);
        }, 50); // 50ms debounce time
    }

    changeEyeColor(newColor) {
        this.eyeColor = newColor;
        const eyeColorPicker = document.getElementById('eye-color-input');
        if (eyeColorPicker) {
            eyeColorPicker.value = newColor;
        }
        requestAnimationFrame(() => {
            this.updateTempAvatarDisplay();
        });
    }

    debounceChangeLipColor(newColor) {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
            this.changeLipColor(newColor);
        }, 50); // 50ms debounce time
    }

    changeLipColor(newColor) {
        this.lipColor = newColor;
        const lipColorPicker = document.getElementById('lip-color-input');
        if (lipColorPicker) {
            lipColorPicker.value = newColor;
        }
        const lipPalette = createLipPalette(newColor);
        console.log(`New lip color palette: ${lipPalette.join(', ')}`);
        requestAnimationFrame(() => {
            this.updateTempAvatarDisplay();
        });
    }

    applySkinTone() {
        if (window.skinToneManager) {
            const tone = window.skinToneManager.skinTones[this.skinTone];
            window.skinToneManager.applySkinTone(tone);
        }
    }

    updateLayerWithSkinTone(type, src) {
        fetch(src)
            .then(response => response.text())
            .then(svgText => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                
                this.applySkinToneToSVG(svgDoc);
                this.applyEyeColorToSVG(svgDoc);
                this.applyLipColorToSVG(svgDoc);
                const serializer = new XMLSerializer();
                const modifiedSvgString = serializer.serializeToString(svgDoc);
                const blob = new Blob([modifiedSvgString], {type: 'image/svg+xml'});
                const url = URL.createObjectURL(blob);
                
                requestAnimationFrame(() => {
                    window.avatarBody.updateLayer(type, url);
                });
            })
            .catch(error => console.error(`Error updating layer ${type} with skin tone:`, error));
    }

    applySkinToneToSVG(svgDoc) {
        const tone = window.skinToneManager.skinTones[this.skinTone];
        const defaultColors = {
            light: ['#FEE2CA', '#EFC1B7', '#B37E78'],
            medium: ['#FFE0BD', '#EFD0B1', '#C4A28A'],
            tan: ['#F1C27D', '#E0B170', '#B39059'],
            dark: ['#8D5524', '#7C4A1E', '#5E3919']
        };
        const eyeColors = {
            main: '#F4D5BF',
            shadow: '#E6BBA8'
        };
        const preserveColors = ['#E6958A', '#E6998F', '#BF766E']; // Add more colors here if needed
        const replaceColor = (element) => {
            ['fill', 'stroke'].forEach(attr => {
                let color = element.getAttribute(attr);
                if (color) {
                    color = color.toUpperCase();
                    if (preserveColors.includes(color)) return;
                    
                    if (defaultColors.light.includes(color)) {
                        if (color === defaultColors.light[0]) {
                            element.setAttribute(attr, tone.main);
                        } else if (color === defaultColors.light[1]) {
                            element.setAttribute(attr, tone.shadow);
                        } else if (color === defaultColors.light[2]) {
                            element.setAttribute(attr, tone.highlight);
                        }
                    } else if (color === eyeColors.main) {
                        element.setAttribute(attr, tone.main);
                    } else if (color === eyeColors.shadow) {
                        element.setAttribute(attr, tone.shadow);
                    } else if ((color.startsWith('#E6') || color.startsWith('#F4')) && !preserveColors.includes(color)) {
                        element.setAttribute(attr, tone.main);
                    }
                }
            });
            let style = element.getAttribute('style');
            if (style) {
                defaultColors.light.forEach((defaultColor, index) => {
                    style = style.replace(new RegExp(defaultColor, 'gi'), 
                        index === 0 ? tone.main : (index === 1 ? tone.shadow : tone.highlight));
                });
                style = style.replace(new RegExp(eyeColors.main, 'gi'), tone.main);
                style = style.replace(new RegExp(eyeColors.shadow, 'gi'), tone.shadow);
                preserveColors.forEach(color => {
                    style = style.replace(new RegExp(color, 'gi'), color);
                });
                if (!preserveColors.some(color => style.includes(color))) {
                    style = style.replace(/#E6[0-9A-F]{4}/gi, tone.main);
                    style = style.replace(/#F4[0-9A-F]{4}/gi, tone.main);
                }
                element.setAttribute('style', style);
            }
            Array.from(element.children).forEach(replaceColor);
        };
        replaceColor(svgDoc.documentElement);
    }

    applyEyeColorToSVG(svgDoc) {
        const eyeElements = svgDoc.querySelectorAll('path[fill="#3FA2FF"], path[fill="#3fa2ff"]');
        eyeElements.forEach(element => {
            element.setAttribute('fill', this.eyeColor);
        });
    }
    
    applyLipColorToSVG(svgDoc) {
        const originalLipColors = ['#E6998F', '#BF766E', '#F2ADA5'];
        const lipPalette = createLipPalette(this.lipColor);
        const lipElements = svgDoc.querySelectorAll('path[fill="#E6998F"], path[fill="#BF766E"], path[fill="#F2ADA5"]');
        lipElements.forEach(element => {
            const currentColor = element.getAttribute('fill').toUpperCase();
            const index = originalLipColors.indexOf(currentColor);
            if (index !== -1) {
                element.setAttribute('fill', lipPalette[index]);
            }
        });
        // Also update lip colors in style attributes
        const allElements = svgDoc.getElementsByTagName('*');
        for (let element of allElements) {
            let style = element.getAttribute('style');
            if (style) {
                originalLipColors.forEach((color, index) => {
                    style = style.replace(new RegExp(color, 'gi'), lipPalette[index]);
                });
                element.setAttribute('style', style);
            }
        }
    }
}
// Initialize the AvatarManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        window.avatarManager = new AvatarManager(loggedInUser.username);
        window.avatarManager.initialize();
    } else {
        console.error('No logged in user found');
    }
});

// Add event listeners for skin tone buttons
document.querySelectorAll('.skin-tone-button').forEach(button => {
    button.addEventListener('click', function() {
        const newTone = this.dataset.tone;
        if (window.avatarManager) {
            window.avatarManager.changeSkinTone(newTone);
            // Update button styles
            document.querySelectorAll('.skin-tone-button').forEach(btn => {
                btn.classList.remove('selected');
            });
            this.classList.add('selected');
        }
    });
});

// Add event listener for wardrobe items
document.addEventListener('click', function(event) {
    const itemImage = event.target.closest('.item-image');
    if (itemImage && window.avatarManager) {
        const itemId = itemImage.dataset.id;
        const item = window.userInventory.getItems().find(i => i.id === itemId);
        if (item) {
            window.avatarManager.toggleItem(item);
        }
    }
});

// Function to update the user's coin display
function updateCoinDisplay(coins) {
    const coinDisplay = document.getElementById('user-coins');
    if (coinDisplay) {
        coinDisplay.textContent = coins;
    }
}

// Function to handle item purchase
function purchaseItem(itemId, price) {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.coins >= price) {
        // Deduct coins and update the display
        loggedInUser.coins -= price;
        sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        updateCoinDisplay(loggedInUser.coins);

        // Add item to inventory (you'll need to implement this part)
        // window.userInventory.addItem(itemId);

        // Update the UI to show the item as owned
        const itemElement = document.querySelector(`.item-image[data-id="${itemId}"]`);
        if (itemElement) {
            itemElement.classList.remove('locked');
            itemElement.classList.add('owned');
        }

        alert('Item purchased successfully!');
    } else {
        alert('Not enough coins to purchase this item.');
    }
}

// Add event listeners for purchase buttons
document.querySelectorAll('.purchase-button').forEach(button => {
    button.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent triggering the item toggle
        const itemId = this.closest('.wardrobe-item').querySelector('.item-image').dataset.id;
        const price = parseInt(this.dataset.price, 10);
        purchaseItem(itemId, price);
    });
});

// Initialize coin display
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        updateCoinDisplay(loggedInUser.coins);
    }
});
