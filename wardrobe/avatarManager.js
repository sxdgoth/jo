class AvatarManager {
    constructor(username) {
        this.username = username;
        this.equippedItems = {};
        this.tempEquippedItems = {};
        this.skinTone = 'light';
        this.eyeColor = '#3FA2FF';
        this.lipColor = '#E6998F';
        this.debounceTimer = null;
        this.hairColorChanger = new HairColorChanger(this);
        this.loadEquippedItems();
    }

    initialize() {
        this.setupEyeColorPicker();
        this.setupLipColorPicker();
        this.setupHairColorPicker();
        this.updateAvatarDisplay();
        this.updateItemVisuals();
        this.loadAndApplyHighlights();
    }

    loadEquippedItems() {
        const savedItems = localStorage.getItem(`equippedItems_${this.username}`);
        if (savedItems) {
            this.equippedItems = JSON.parse(savedItems);
        }
    }

    setupEyeColorPicker() {
        const eyeColorPicker = document.getElementById('eye-color-picker');
        if (eyeColorPicker) {
            eyeColorPicker.value = this.eyeColor;
            eyeColorPicker.addEventListener('input', (event) => {
                this.changeEyeColor(event.target.value);
            });
        }
    }

    setupLipColorPicker() {
        const lipColorPicker = document.getElementById('lip-color-picker');
        if (lipColorPicker) {
            lipColorPicker.value = this.lipColor;
            lipColorPicker.addEventListener('input', (event) => {
                this.changeLipColor(event.target.value);
            });
        }
    }

    setupHairColorPicker() {
        const hairColorPicker = document.getElementById('color-picker');
        if (hairColorPicker) {
            hairColorPicker.value = this.hairColorChanger.hairColor;
            hairColorPicker.addEventListener('input', (event) => {
                this.hairColorChanger.changeHairColor(event.target.value);
            });
        }
    }

    changeEyeColor(newColor) {
        this.eyeColor = newColor;
        localStorage.setItem(`eyeColor_${this.username}`, newColor);
        this.updateAvatarDisplay();
    }

    changeLipColor(newColor) {
        this.lipColor = newColor;
        localStorage.setItem(`lipColor_${this.username}`, newColor);
        this.updateAvatarDisplay();
    }

    toggleItem(item) {
        if (this.tempEquippedItems[item.type] === item.id) {
            delete this.tempEquippedItems[item.type];
        } else {
            this.tempEquippedItems[item.type] = item.id;
        }
        
        if (item.type === 'Hair') {
            this.hairColorChanger.setSelectedHair(this.tempEquippedItems[item.type]);
        }
        
        this.updateItemVisuals();
        this.updateTempAvatarDisplay();
    }

    updateItemVisuals() {
        const items = document.querySelectorAll('.wardrobe-item');
        items.forEach(item => {
            const itemId = item.querySelector('.item-image').dataset.id;
            const itemType = item.querySelector('p').textContent.split(': ')[1];
            if (this.tempEquippedItems[itemType] === itemId) {
                item.classList.add('equipped');
            } else {
                item.classList.remove('equipped');
            }
        });
    }

    updateAvatarDisplay() {
        if (window.avatarBody) {
            window.avatarBody.clearAllLayers();
            
            this.applySkinTone();
            Object.entries(this.equippedItems).forEach(([type, itemId]) => {
                if (itemId) {
                    const item = window.userInventory.getItems().find(i => i.id === itemId);
                    if (item) {
                        if (type === 'Hair') {
                            this.hairColorChanger.updateHairColor();
                        } else {
                            this.updateLayerWithSkinTone(type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
                        }
                    }
                }
            });
        }
    }

    updateTempAvatarDisplay() {
        if (window.avatarBody) {
            window.avatarBody.clearAllLayers();
            
            this.applySkinTone();
            Object.entries(this.tempEquippedItems).forEach(([type, itemId]) => {
                if (itemId) {
                    const item = window.userInventory.getItems().find(i => i.id === itemId);
                    if (item) {
                        if (type === 'Hair') {
                            this.hairColorChanger.updateHairColor();
                        } else {
                            this.updateLayerWithSkinTone(type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
                        }
                    }
                }
            });
        }
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



loadAndApplyHighlights() {
    const highlightedItems = JSON.parse(localStorage.getItem(`highlightedItems_${this.username}`)) || [];
    document.querySelectorAll('.wardrobe-item').forEach(itemContainer => {
        const itemImage = itemContainer.querySelector('.item-image');
        const itemId = itemImage.dataset.id;
        if (highlightedItems.includes(itemId)) {
            itemContainer.classList.add('highlighted');
        }
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
