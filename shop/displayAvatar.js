class AvatarDisplay {
    constructor(containerId, username) {
        console.log('AvatarDisplay: Initializing for user', username);
        this.username = username;
        this.container = document.getElementById(containerId);
        this.triedOnItems = {};
        this.currentItems = {};
        
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }
        this.baseUrl = 'https://sxdgoth.github.io/jo/';
        this.layers = {};
        this.equippedItems = {};
        this.lastAction = {};
        this.hiddenEquippedItems = new Set();
        this.skinTone = 'light';
        this.eyeColor = '#3FA2FF'; // Default eye color
        this.lipColor = '#E6998F'; // Default lip color
        this.hairColor = '#1E1E1E'; // Default hair color
        this.skinTones = {
            light: {
                name: 'Light',
                main: '#FEE2CA',
                shadow: '#EFC1B7',
                highlight: '#B37E78'  
            },
            medium: {
                name: 'Medium',
                main: '#FFE0BD',
                shadow: '#EFD0B1',
                highlight: '#C4A28A'
            },
            tan: {
                name: 'Tan',
                main: '#F1C27D',
                shadow: '#E0B170',
                highlight: '#B39059'
            },
            dark: {
                name: 'Dark',
                main: '#8D5524',
                shadow: '#7C4A1E',
                highlight: '#5E3919'
            }
        };
        this.facialFeatures = ['Eyes', 'Nose', 'Mouth'];
        this.baseParts = ['Legs', 'Arms', 'Body', 'Neck', 'Head'];
        this.originalColors = {};
        this.loadSkinTone();
        this.loadEyeColor();
        this.loadLipColor();
        this.loadHairColor();
        this.loadEquippedItems();
    }

    loadSkinTone() {
        const savedSkinTone = localStorage.getItem(`skinTone_${this.username}`);
        if (savedSkinTone) {
            this.skinTone = savedSkinTone;
        }
    }

    loadEyeColor() {
        const savedEyeColor = localStorage.getItem(`eyeColor_${this.username}`);
        if (savedEyeColor) {
            this.eyeColor = savedEyeColor;
        }
    }

    loadLipColor() {
        const savedLipColor = localStorage.getItem(`lipColor_${this.username}`);
        if (savedLipColor) {
            this.lipColor = savedLipColor;
        }
    }

    loadHairColor() {
        const savedHairColor = localStorage.getItem(`hairColor_${this.username}`);
        if (savedHairColor) {
            this.hairColor = savedHairColor;
        }
    }

    loadEquippedItems() {
        const savedItems = localStorage.getItem(`equippedItems_${this.username}`);
        this.equippedItems = savedItems ? JSON.parse(savedItems) : {};
    }

    loadAvatar() {
        console.log("Loading avatar...");
        const savedItems = localStorage.getItem(`equippedItems_${this.username}`);
        console.log("Saved items:", savedItems);
        const equippedItems = savedItems ? JSON.parse(savedItems) : {};
        this.skinTone = localStorage.getItem(`skinTone_${this.username}`) || 'light';
        this.eyeColor = localStorage.getItem(`eyeColor_${this.username}`) || '#3FA2FF';
        this.lipColor = localStorage.getItem(`lipColor_${this.username}`) || '#E6998F';
        this.hairColor = localStorage.getItem(`hairColor_${this.username}`) || '#1E1E1E';

        this.container.innerHTML = '';
        this.container.style.position = 'relative';
        this.container.style.width = '100%';
        this.container.style.height = '100%';

        const bodyParts = [
            { name: 'Legs', file: 'home/assets/body/avatar-legsandfeet.svg', type: 'Legs', isBase: true },
            { name: 'Arms', file: 'home/assets/body/avatar-armsandhands.svg', type: 'Arms', isBase: true },
            { name: 'Body', file: 'home/assets/body/avatar-body.svg', type: 'Body', isBase: true },
            { name: 'Head', file: 'home/assets/body/avatar-head.svg', type: 'Head', isBase: true },
            { name: 'Eyes', file: '', type: 'Eyes', isBase: false },
            { name: 'Nose', file: '', type: 'Nose', isBase: false },
            { name: 'Mouth', file: '', type: 'Mouth', isBase: false },
            { name: 'Jacket', file: '', type: 'Jacket', isBase: false },
            { name: 'Shirt', file: '', type: 'Shirt', isBase: false },
            { name: 'Pants', file: '', type: 'Pants', isBase: false },
            { name: 'Shoes', file: '', type: 'Shoes', isBase: false },
            { name: 'Eyebrows', file: '', type: 'Eyebrows', isBase: false },
            { name: 'Cheeks', file: '', type: 'Cheeks', isBase: false },
            { name: 'Accessories', file: '', type: 'Accessories', isBase: false },
            { name: 'Hair', file: '', type: 'Hair', isBase: false }
        ];

        bodyParts.forEach(part => {
            const obj = document.createElement('object');
            obj.type = 'image/svg+xml';
            obj.data = '';
            obj.alt = part.name;
            obj.dataset.type = part.type;
            obj.style.position = 'absolute';
            obj.style.top = '0';
            obj.style.left = '0';
            obj.style.width = '100%';
            obj.style.height = '100%';

            if (part.isBase) {
                obj.data = this.baseUrl + part.file;
                obj.style.display = 'block';
                console.log(`Loading base part: ${part.name}, src: ${obj.data}`);
            } else if (equippedItems[part.type]) {
                const item = shopItems.find(item => item.id === equippedItems[part.type]);
                if (item) {
                    obj.data = `${this.baseUrl}${item.path}${item.id}`;
                    obj.style.display = 'block';
                    console.log(`Loading equipped part: ${part.name}, src: ${obj.data}`);
                } else {
                    console.warn(`Item not found: ${equippedItems[part.type]}`);
                    obj.style.display = 'none';
                }
            } else {
                obj.style.display = 'none';
                console.log(`No equipped item for: ${part.name}`);
            }

            obj.onload = () => {
                this.applySkinTone(obj, part.type);
            };
            obj.onerror = () => console.error(`Failed to load SVG: ${obj.data}`);

            this.container.appendChild(obj);
            this.layers[part.type] = obj;
        });

        this.reorderLayers();
    }

    reorderLayers() {
        const order = ['Legs', 'Arms', 'Body', 'Shoes', 'Pants', 'Dress', 'Shirt', 'Jacket', 'Backhair',  'Neck', 'Hoodie', 'Head', 'Cheeks', 'Eyes', 'Mouth', 'Nose', 'Face', 'Eyebrows', 'Accessories', 'Hair'];
        order.forEach((type, index) => {
            if (this.layers[type]) {
                this.layers[type].style.zIndex = index + 1;
            }
        });
    }

    applySkinTone(obj, type) {
        const svgDoc = obj.contentDocument;
        if (!svgDoc || !this.skinTones[this.skinTone]) return;

        const tone = this.skinTones[this.skinTone];
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
        
        const preserveColors = ['#E6958A', '#F4F4F4'];  // Add colors here to prevent changes
        const originalLipColors = ['#E6998F', '#BF766E', '#F2ADA5'];
        
        // Function to create a lip color palette
        const createLipPalette = (baseColor) => {
            const rgb = parseInt(baseColor.slice(1), 16);
            const r = (rgb >> 16) & 255;
            const g = (rgb >> 8) & 255;
            const b = rgb & 255;
            
            return [
                `#${baseColor.slice(1)}`, // Main color
                `#${Math.max(0, r - 40).toString(16).padStart(2, '0')}${Math.max(0, g - 40).toString(16).padStart(2, '0')}${Math.max(0, b - 40).toString(16).padStart(2, '0')}`, // Darker shade
                `#${Math.min(255, r + 20).toString(16).padStart(2, '0')}${Math.min(255, g + 20).toString(16).padStart(2, '0')}${Math.min(255, b + 20).toString(16).padStart(2, '0')}` // Lighter shade
            ];
        };
        const lipPalette = createLipPalette(this.lipColor);
        
        const replaceColor = (element) => {
            ['fill', 'stroke'].forEach(attr => {
                let color = element.getAttribute(attr);
                if (color) {
                    color = color.toUpperCase();
                    
                    if (preserveColors.includes(color)) {
                        return; // Skip preserved colors
                    } else if (originalLipColors.includes(color)) {
                        const index = originalLipColors.indexOf(color);
                        element.setAttribute(attr, lipPalette[index]);
                    } else if (defaultColors.light.includes(color)) {
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
                    } else if ((color.startsWith('#E6') || color.startsWith('#F4')) && !originalLipColors.includes(color)) {
                        element.setAttribute(attr, tone.main);
                    } else if (color === '#3FA2FF') {
                        element.setAttribute(attr, this.eyeColor);
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
                originalLipColors.forEach((color, index) => {
                    if (!preserveColors.includes(color)) {
                        style = style.replace(new RegExp(color, 'gi'), lipPalette[index]);
                    }
                });
                if (!preserveColors.some(color => style.includes(color)) && !originalLipColors.some(color => style.includes(color))) {
                    style = style.replace(/#E6[0-9A-F]{4}/gi, tone.main);
                    style = style.replace(/#F4[0-9A-F]{4}/gi, tone.main);
                }
                style = style.replace(/#3FA2FF/gi, this.eyeColor);
                element.setAttribute('style', style);
            }
            Array.from(element.children).forEach(replaceColor);
        };

        if (type === 'Hair') {
            this.applyHairColor(obj);
        } else {
            replaceColor(svgDoc.documentElement);
        }
          console.log(`Applied skin tone ${this.skinTone}, eye color ${this.eyeColor}, and lip color palette ${lipPalette.join(', ')} to ${type}`);
    }

    applyHairColor(obj) {
        const svgDoc = obj.contentDocument;
        if (!svgDoc) return;
        const defaultHairColors = ['#1E1E1E', '#323232', '#464646', '#5A5A5A', '#787878'];
        
        const replaceColor = (element) => {
            ['fill', 'stroke'].forEach(attr => {
                let color = element.getAttribute(attr);
                if (color && defaultHairColors.includes(color.toUpperCase())) {
                    const blendedColor = this.blendColors(color, this.hairColor, 0.7);
                    element.setAttribute(attr, blendedColor);
                }
            });
            let style = element.getAttribute('style');
            if (style) {
                defaultHairColors.forEach(defaultColor => {
                    const blendedColor = this.blendColors(defaultColor, this.hairColor, 0.7);
                    style = style.replace(new RegExp(defaultColor, 'gi'), blendedColor);
                });
                element.setAttribute('style', style);
            }
            Array.from(element.children).forEach(replaceColor);
        };
        replaceColor(svgDoc.documentElement);
    }

blendColors(color1, color2, ratio) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        const brightness1 = (rgb1[0] * 299 + rgb1[1] * 587 + rgb1[2] * 114) / 1000;
        const brightness2 = (rgb2[0] * 299 + rgb2[1] * 587 + rgb2[2] * 114) / 1000;
        
        let blendRatio = ratio;
        if (brightness2 > brightness1) {
            // For lighter colors, reduce the blend ratio to maintain highlights
            blendRatio = ratio * 0.7;
        } else {
            // For darker colors, increase the blend ratio for a more dramatic change
            blendRatio = Math.min(ratio * 1.3, 1);
        }
        const blended = rgb1.map((channel, i) => 
            Math.round(channel * (1 - blendRatio) + rgb2[i] * blendRatio)
        );
        return this.rgbToHex(...blended);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    changeSkinTone(newTone) {
        this.skinTone = newTone;
        Object.values(this.layers).forEach(obj => {
            if (obj.contentDocument) {
                this.applySkinTone(obj, obj.dataset.type);
            }
        });
        localStorage.setItem(`skinTone_${this.username}`, newTone);
    }
  changeEyeColor(newColor) {
        this.eyeColor = newColor;
        Object.values(this.layers).forEach(obj => {
            if (obj.contentDocument) {
                this.applySkinTone(obj, obj.dataset.type);
            }
        });
        localStorage.setItem(`eyeColor_${this.username}`, newColor);
    }

    changeLipColor(newColor) {
        this.lipColor = newColor;
        Object.values(this.layers).forEach(obj => {
            if (obj.contentDocument) {
                this.applySkinTone(obj, obj.dataset.type);
            }
        });
        localStorage.setItem(`lipColor_${this.username}`, newColor);
    }

    changeHairColor(newColor) {
        this.hairColor = newColor;
        Object.values(this.layers).forEach(obj => {
            if (obj.contentDocument && obj.dataset.type === 'Hair') {
                this.applyHairColor(obj);
            }
        });
        localStorage.setItem(`hairColor_${this.username}`, newColor);
    }

  tryOnItem(item) {
        console.log(`Trying on ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        
        if (this.currentItems[item.type] && this.currentItems[item.type].id === item.id) {
            // If the item is already tried on, remove it
            this.removeItem(item.type);
        } else {
            // Apply the new item
            this.currentItems[item.type] = item;
            this.updateAvatarDisplay(item.type, `${this.baseUrl}${item.path}${item.id}`);
        }
        this.reorderLayers();
    }

    removeItem(type) {
    console.log(`Removing item of type: ${type}`);
    if (this.layers[type]) {
        this.layers[type].style.display = 'none';
        this.layers[type].data = ''; // Clear the source
    }
    delete this.currentItems[type];
    
    // If this is a base part, make sure it's visible
    if (this.baseParts.includes(type)) {
        if (this.layers[type]) {
            this.layers[type].style.display = 'block';
            this.layers[type].data = `${this.baseUrl}home/assets/body/avatar-${type.toLowerCase()}.svg`;
        }
    } else {
        // If it's not a base part, check if there's an equipped item to display
        if (this.equippedItems[type]) {
            const equippedItem = shopItems.find(item => item.id === this.equippedItems[type]);
            if (equippedItem) {
                this.updateAvatarDisplay(type, `${this.baseUrl}${equippedItem.path}${equippedItem.id}`);
            }
        } else {
            // If there's no equipped item, ensure the layer is hidden
            if (this.layers[type]) {
                this.layers[type].style.display = 'none';
            }
        }
    }
    this.reorderLayers(); // Make sure to reorder layers after removing an item
}
    updateAvatarDisplay(type, src) {
    console.log(`AvatarDisplay: Updating avatar display for ${type} with src: ${src}`);
    if (this.layers[type]) {
        if (src) {
            this.layers[type].data = src;
            this.layers[type].style.display = 'block';
            this.layers[type].onload = () => {
                console.log(`AvatarDisplay: Layer ${type} loaded successfully`);
                this.applySkinTone(this.layers[type], type);
                if (type === 'Eyes') {
                    setTimeout(() => this.applySkinTone(this.layers[type], type), 100);
                }
            };
            this.layers[type].onerror = () => {
                console.error(`AvatarDisplay: Failed to load layer ${type} from ${src}`);
            };
        } else {
            this.layers[type].style.display = 'none';
            this.layers[type].data = '';
        }
    } else {
        console.warn(`AvatarDisplay: Layer not found for type: ${type}`);
    }
}

    toggleEquippedItem(type) {
        if (this.layers[type] && this.equippedItems[type]) {
            if (this.layers[type].style.display === 'none') {
                const equippedItem = shopItems.find(item => item.id === this.equippedItems[type]);
                if (equippedItem) {
                    this.layers[type].data = `${this.baseUrl}${equippedItem.path}${equippedItem.id}`;
                    this.layers[type].style.display = 'block';
                    this.lastAction[type] = 'shown';
                    this.hiddenEquippedItems.delete(type);
                    this.layers[type].onload = () => {
                        this.applySkinTone(this.layers[type], type);
                    };
                }
            } else {
                this.layers[type].style.display = 'none';
                this.lastAction[type] = 'hidden';
                this.hiddenEquippedItems.add(type);
            }
        }
    }

    isItemEquipped(item) {
        return this.equippedItems[item.type] === item.id;
    }

    updateEquippedItems() {
        const savedItems = localStorage.getItem(`equippedItems_${this.username}`);
        this.equippedItems = savedItems ? JSON.parse(savedItems) : {};
    }

    resetTriedOnItems() {
        console.log('Resetting tried on items');
        Object.keys(this.currentItems).forEach(type => {
            this.removeItem(type);
        });
        this.currentItems = {};
        this.loadEquippedItems();
        this.loadAvatar();
    }
}

// Initialize the avatar display when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing AvatarDisplay");
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        window.avatarDisplay = new AvatarDisplay('avatar-display', loggedInUser.username);
        window.avatarDisplay.loadAvatar();
        window.avatarManager = window.avatarDisplay; // For compatibility with existing code
    } else {
        console.error('No logged in user found');
    }
});
