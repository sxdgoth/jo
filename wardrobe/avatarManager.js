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
        this.hairColor = '#1E1E1E'; // Default hair color
        this.debounceTimer = null;
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

    setupHairColorPicker() {
        const hairColorPicker = document.getElementById('color-picker');
        if (hairColorPicker) {
            hairColorPicker.value = this.hairColor;
            hairColorPicker.addEventListener('input', (event) => {
                this.changeHairColor(event.target.value);
            });
        } else {
            console.error('Hair color picker not found');
        }
    }

    loadEquippedItems() {
        const savedItems = localStorage.getItem(`equippedItems_${this.username}`);
        if (savedItems) {
            this.equippedItems = JSON.parse(savedItems);
            this.equippedItems = Object.fromEntries(
                Object.entries(this.equippedItems).filter(([_, value]) => value)
            );
        } else {
            this.equippedItems = {};
        }
        this.tempEquippedItems = {...this.equippedItems};
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
        const savedHairColor = localStorage.getItem(`hairColor_${this.username}`);
        if (savedHairColor) {
            this.hairColor = savedHairColor;
        }
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
            const itemImage = itemContainer.querySelector('.item-image');
            const itemId = itemImage.dataset.id;
            const item = window.userInventory.getItems().find(i => i.id === itemId);
            if (item && this.tempEquippedItems[item.type] === item.id) {
                itemImage.classList.add('equipped');
                itemContainer.classList.add('highlighted');
            } else {
                itemImage.classList.remove('equipped');
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
        }, 50);
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
        }, 50);
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

    changeHairColor(newColor) {
        this.hairColor = newColor;
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
                if (type === 'Hair') {
                    this.applyHairColorToSVG(svgDoc);
                }

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
        const preserveColors = ['#E6958A', '#E6998F', '#BF766E'];
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

    applyHairColorToSVG(svgDoc) {
        const defaultHairColors = ['#1E1E1E', '#323232', '#464646', '#5A5A5A', '#787878'];
        const hairPaths = svgDoc.querySelectorAll('path');
        hairPaths.forEach((path) => {
            const color = this.getPathColor(path);
            if (color && defaultHairColors.includes(color.toUpperCase())) {
                const blendedColor = this.blendColors(color, this.hairColor, 0.7);
                this.setPathColor(path, blendedColor);
            }
        });
    }
  getPathColor(path) {
        if (path.hasAttribute('fill')) {
            return path.getAttribute('fill');
        }
         if (path.hasAttribute('style')) {
            const match = path.getAttribute('style').match(/fill:\s*(#[A-Fa-f0-9]{6})/);
            if (match) return match[1];
        }
        return null;
    }

    blendColors(color1, color2, ratio) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        const blended = rgb1.map((channel, i) => 
            Math.round(channel * (1 - ratio) + rgb2[i] * ratio)
        );
        return this.rgbToHex(...blended);
    }

    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    setPathColor(path, color) {
        if (path.hasAttribute('fill')) {
            path.setAttribute('fill', color);
        }
        if (path.hasAttribute('style')) {
            let style = path.getAttribute('style');
            style = style.replace(/fill:[^;]+;?/, `fill:${color};`);
            path.setAttribute('style', style);
        }
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
