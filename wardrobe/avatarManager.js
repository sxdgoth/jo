// avatarManager.js

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
        this.eyeColor = '#3FA2FF';
        this.lipColor = '#E6998F';
        this.hairColor = '#1E1E1E';
        this.debounceTimer = null;
        this.loadEquippedItems();
    }

    initialize() {
        this.setupEyeColorPicker();
        this.setupLipColorPicker();
        this.setupHairColorPicker();
        this.setupSkinTonePicker();
        this.updateAvatarDisplay();
        this.updateItemVisuals();
        this.loadAndApplyHighlights();
        this.displayOwnedItems();
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
        const hairColorPicker = document.getElementById('hair-color-input');
        if (hairColorPicker) {
            hairColorPicker.value = this.hairColor;
            hairColorPicker.addEventListener('input', (event) => {
                this.changeHairColor(event.target.value);
            });
        } else {
            console.error('Hair color picker not found');
        }
    }

    setupSkinTonePicker() {
        const skinToneButtons = document.querySelectorAll('.skin-tone-button');
        skinToneButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.changeSkinTone(button.dataset.tone);
            });
        });
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
                    if (type === 'Hair') {
                        this.updateHairColor();
                    } else {
                        this.updateLayerWithSkinTone(type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
                    }
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
        localStorage.setItem(`skinTone_${this.username}`, newTone);
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
        localStorage.setItem(`eyeColor_${this.username}`, newColor);
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
        localStorage.setItem(`lipColor_${this.username}`, newColor);
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
        localStorage.setItem(`hairColor_${this.username}`, newColor);
        this.updateHairColor();
    }

     updateHairColor() {
        const hairItem = this.equippedItems['Hair'];
        if (hairItem) {
            const item = window.userInventory.getItems().find(i => i.id === hairItem);
            if (item) {
                this.updateLayerWithHairColor('Hair', `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
            }
        }
    }

    applySkinTone() {
        if (window.skinToneManager) {
            const tone = window.skinToneManager.skinTones[this.skinTone];
            window.skinToneManager.applySkinTone(tone);
        }
    }
    
    updateLayerWithHairColor(type, src) {
        fetch(src)
            .then(response => response.text())
            .then(svgText => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                
                this.applyHairColorToSVG(svgDoc);
                
                const serializer = new XMLSerializer();
                const modifiedSvgString = serializer.serializeToString(svgDoc);
                const blob = new Blob([modifiedSvgString], {type: 'image/svg+xml'});
                const url = URL.createObjectURL(blob);
                
                requestAnimationFrame(() => {
                    window.avatarBody.updateLayer(type, url);
                });
            })
            .catch(error => console.error(`Error updating hair color:`, error));
    }

  applyHairColorToSVG(svgDoc) {
        const defaultHairColors = ['#1E1E1E', '#323232', '#464646', '#5A5A5A', '#787878'];
        const paths = svgDoc.querySelectorAll('path');
        paths.forEach(path => {
            const currentColor = path.getAttribute('fill');
            if (currentColor && defaultHairColors.includes(currentColor.toUpperCase())) {
                const blendedColor = this.blendColors(currentColor, this.hairColor, 0.7);
                path.setAttribute('fill', blendedColor);
            }
        });
    }

    blendColors(color1, color2, ratio) {
        const hex = (x) => {
            x = x.toString(16);
            return (x.length === 1) ? '0' + x : x;
        };
        
        const r1 = parseInt(color1.substring(1, 3), 16);
        const g1 = parseInt(color1.substring(3, 5), 16);
        const b1 = parseInt(color1.substring(5, 7), 16);
        
        const r2 = parseInt(color2.substring(1, 3), 16);
        const g2 = parseInt(color2.substring(3, 5), 16);
        const b2 = parseInt(color2.substring(5, 7), 16);
        
        const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
        const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
        const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
        
        return `#${hex(r)}${hex(g)}${hex(b)}`;
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

    displayOwnedItems() {
        const ownedItems = window.userInventory.getItems();
        const wardrobeContainer = document.getElementById('wardrobe-container');
        
        if (!wardrobeContainer) {
            console.error('Wardrobe container not found');
            return;
        }

        wardrobeContainer.innerHTML = ''; // Clear existing items

        ownedItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'wardrobe-item';
            itemElement.innerHTML = `
                <img src="https://sxdgoth.github.io/jo/${item.path}${item.id}" alt="${item.name}" class="item-image" data-id="${item.id}">
                <p>${item.name}</p>
            `;
            itemElement.addEventListener('click', () => this.toggleItem(item));
            wardrobeContainer.appendChild(itemElement);
        });

        this.updateItemVisuals();
    }

    saveEquippedItems() {
        localStorage.setItem(`equippedItems_${this.username}`, JSON.stringify(this.equippedItems));
    }

    applyChanges() {
        this.equippedItems = {...this.tempEquippedItems};
        this.saveEquippedItems();
        this.updateAvatarDisplay();
    }

    cancelChanges() {
        this.tempEquippedItems = {...this.equippedItems};
        this.updateItemVisuals();
        this.updateAvatarDisplay();
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
