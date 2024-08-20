class AvatarManager {
    constructor(username) {
        this.username = username;
        this.equippedItems = {};
        this.tempEquippedItems = {};
        this.skinTone = 'light';
        this.itemColors = {};
        this.colorableColors = ['#346799', '#325880', '#3676b2', '#3c93e5', '#3fa2ff'];
        this.loadEquippedItems();
    }

    initialize() {
        this.setupApplyAvatarButton();
        this.setupClearAvatarButton();
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
        const savedItemColors = localStorage.getItem(`itemColors_${this.username}`);
        if (savedItemColors) {
            this.itemColors = JSON.parse(savedItemColors);
        }
    }

    applyAvatar() {
        this.equippedItems = {...this.tempEquippedItems};
        localStorage.setItem(`equippedItems_${this.username}`, JSON.stringify(this.equippedItems));
        localStorage.setItem(`skinTone_${this.username}`, this.skinTone);
        localStorage.setItem(`itemColors_${this.username}`, JSON.stringify(this.itemColors));
        this.updateAvatarDisplay();
        alert('Avatar saved successfully!');
    }

    clearAvatar() {
        this.tempEquippedItems = {};
        this.itemColors = {};
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
        document.querySelectorAll('.item-image').forEach(itemImage => {
            const itemId = itemImage.dataset.id;
            const item = window.userInventory.getItems().find(i => i.id === itemId);
            if (item && this.tempEquippedItems[item.type] === item.id) {
                itemImage.classList.add('equipped');
            } else {
                itemImage.classList.remove('equipped');
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
                
                const itemId = this.tempEquippedItems[type];
                if (itemId && this.itemColors[itemId]) {
                    this.applyItemColor(svgDoc, itemId);
                }

                const serializer = new XMLSerializer();
                const modifiedSvgString = serializer.serializeToString(svgDoc);
                
                // Log the final SVG for debugging
                console.log('Final SVG:', modifiedSvgString);

                const blob = new Blob([modifiedSvgString], {type: 'image/svg+xml'});
                const url = URL.createObjectURL(blob);
                
                window.avatarBody.updateLayer(type, url);
            })
            .catch(error => console.error(`Error updating layer ${type}:`, error));
    }

    applySkinToneToSVG(svgDoc) {
        const tone = window.skinToneManager.skinTones[this.skinTone];
        const defaultColors = {
            light: ['#FEE2CA', '#EFC1B7'],
            medium: ['#FFE0BD', '#EFD0B1'],
            tan: ['#F1C27D', '#E0B170'],
            dark: ['#8D5524', '#7C4A1E']
        };
        const preserveColors = ['#E6958A', ...this.colorableColors];

        const replaceColor = (element) => {
            ['fill', 'stroke'].forEach(attr => {
                let color = element.getAttribute(attr);
                if (color) {
                    color = color.toUpperCase();
                    if (preserveColors.includes(color)) return;
                    
                    if (defaultColors.light.includes(color)) {
                        element.setAttribute(attr, color === defaultColors.light[0] ? tone.main : tone.shadow);
                    } else if ((color.startsWith('#E6') || color.startsWith('#F4')) && !preserveColors.includes(color)) {
                        element.setAttribute(attr, tone.main);
                    }
                }
            });

            let style = element.getAttribute('style');
            if (style) {
                defaultColors.light.forEach((defaultColor, index) => {
                    style = style.replace(new RegExp(defaultColor, 'gi'), index === 0 ? tone.main : tone.shadow);
                });
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

    applyItemColor(svgDoc, itemId) {
        const newColor = this.itemColors[itemId];
        if (!newColor) return;

        const replaceColor = (element) => {
            ['fill', 'stroke'].forEach(attr => {
                let color = element.getAttribute(attr);
                if (color) {
                    color = color.toUpperCase();
                    if (this.colorableColors.includes(color)) {
                        element.setAttribute(attr, newColor);
                    }
                }
            });

            let style = element.getAttribute('style');
            if (style) {
                this.colorableColors.forEach(colorableColor => {
                    const regex = new RegExp(colorableColor, 'gi');
                    style = style.replace(regex, newColor);
                });
                element.setAttribute('style', style);
            }

            Array.from(element.children).forEach(replaceColor);
        };

        replaceColor(svgDoc.documentElement);

        // Log the modified SVG for debugging
        console.log('Modified SVG:', new XMLSerializer().serializeToString(svgDoc));
    }

    updateItemColor(itemId, newColor) {
        console.log('Updating item color:', itemId, newColor); // Add this log
        this.itemColors[itemId] = newColor;
        this.updateTempAvatarDisplay();
    }
}

// Make AvatarManager available globally
window.AvatarManager = AvatarManager;

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
