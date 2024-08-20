class AvatarManager {
    constructor(username) {
        this.username = username;
        this.equippedItems = {};
        this.tempEquippedItems = {};
        this.skinTone = 'light';
        this.eyeColor = '#3FA2FF'; // Default eye color
        this.debounceTimer = null;
        this.loadEquippedItems();
    }

    initialize() {
        this.setupApplyAvatarButton();
        this.setupClearAvatarButton();
        this.setupEyeColorPicker();
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
    }

    applyAvatar() {
        this.equippedItems = {...this.tempEquippedItems};
        localStorage.setItem(`equippedItems_${this.username}`, JSON.stringify(this.equippedItems));
        localStorage.setItem(`skinTone_${this.username}`, this.skinTone);
        localStorage.setItem(`eyeColor_${this.username}`, this.eyeColor);
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
            light: ['#FEE2CA', '#EFC1B7'],
            medium: ['#FFE0BD', '#EFD0B1'],
            tan: ['#F1C27D', '#E0B170'],
            dark: ['#8D5524', '#7C4A1E']
        };
        const eyeColors = {
            main: '#F4D5BF',
            shadow: '#E6BBA8'
        };
        const preserveColors = ['#E6958A'];
        const replaceColor = (element) => {
            ['fill', 'stroke'].forEach(attr => {
                let color = element.getAttribute(attr);
                if (color) {
                    color = color.toUpperCase();
                    if (preserveColors.includes(color)) return;
                    
                    if (defaultColors.light.includes(color)) {
                        element.setAttribute(attr, color === defaultColors.light[0] ? tone.main : tone.shadow);
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
                    style = style.replace(new RegExp(defaultColor, 'gi'), index === 0 ? tone.main : tone.shadow);
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
