class AvatarDisplay {
    constructor(containerId, username) {
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
        this.facialFeatures = ['Eyes', 'Nose', 'Mouth'];
        this.baseParts = ['Legs', 'Arms', 'Body', 'Head'];
        this.originalColors = {};

        this.loadSkinTone();
        this.loadEquippedItems();
    }

    loadSkinTone() {
        const savedSkinTone = localStorage.getItem(`skinTone_${this.username}`);
        if (savedSkinTone) {
            this.skinTone = savedSkinTone;
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
            { name: 'Face', file: '', type: 'Face', isBase: false }
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

            obj.onerror = () => console.error(`Failed to load SVG: ${obj.data}`);
            this.container.appendChild(obj);
            this.layers[part.type] = obj;

            if (part.isBase || this.facialFeatures.includes(part.type)) {
                obj.addEventListener('load', () => {
                    this.saveOriginalColors(obj, part.type);
                    this.applySkinTone(obj, part.type);
                });
            }
        });

        this.reorderLayers();
    }

    reorderLayers() {
        const order = ['Legs', 'Arms', 'Body', 'Shoes', 'Pants', 'Dress', 'Shirt', 'Jacket', 'Backhair', 'Head', 'Eyes', 'Mouth', 'Nose', 'Face', 'Eyebrows', 'Accessories', 'Hair'];
        order.forEach((type, index) => {
            if (this.layers[type]) {
                this.layers[type].style.zIndex = index + 1;
            }
        });
    }

    saveOriginalColors(obj, type) {
        const svgDoc = obj.contentDocument;
        if (svgDoc) {
            const paths = svgDoc.querySelectorAll('path, circle, ellipse, rect');
            this.originalColors[type] = Array.from(paths).map(path => path.getAttribute('fill'));
        }
    }

  applySkinTone(obj, type) {
    const svgDoc = obj.contentDocument;
    if (svgDoc && this.skinTones[this.skinTone]) {
        const elements = svgDoc.querySelectorAll('*');
        const tone = this.skinTones[this.skinTone];
        
        elements.forEach((element) => {
            ['fill', 'stroke'].forEach(attr => {
                const currentColor = element.getAttribute(attr);
                if (currentColor) {
                    const upperCaseColor = currentColor.toUpperCase();
                    if (upperCaseColor === '#FEE2CA') {
                        element.setAttribute(attr, tone.main);
                    } else if (upperCaseColor === '#EFC1B7') {
                        element.setAttribute(attr, tone.shadow);
                    }
                }
            });
        });
    }
}

    isCloseTo(color1, color2) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        const threshold = 30; // Adjust this value to change the sensitivity

        return Math.abs(rgb1[0] - rgb2[0]) < threshold &&
               Math.abs(rgb1[1] - rgb2[1]) < threshold &&
               Math.abs(rgb1[2] - rgb2[2]) < threshold;
    }

    getNewColor(currentColor, tone) {
        const currentLuminance = this.getLuminance(currentColor);
        const mainLuminance = this.getLuminance(tone.main);
        const luminanceDiff = currentLuminance - mainLuminance;
        
        if (Math.abs(luminanceDiff) < 0.1) {
            return tone.main;
        } else if (luminanceDiff < 0) {
            return tone.shadow;
        } else {
            return this.lightenColor(tone.main, luminanceDiff);
        }
    }

    getLuminance(hex) {
        const rgb = this.hexToRgb(hex);
        return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    }

    hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }

    lightenColor(color, amount) {
        const rgb = this.hexToRgb(color);
        const newRgb = rgb.map(c => Math.min(255, c + Math.round(amount * 255)));
        return `rgb(${newRgb[0]}, ${newRgb[1]}, ${newRgb[2]})`;
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

  tryOnItem(item) {
    console.log(`Trying on ${item.name} (ID: ${item.id}, Type: ${item.type})`);
    
    if (!this.triedOnItems) this.triedOnItems = {};
    if (!this.currentItems) this.currentItems = {};

    if (this.currentItems[item.type] && this.currentItems[item.type].id === item.id) {
        this.removeItem(item.type);
    } else {
        this.currentItems[item.type] = item;
        this.updateAvatarDisplay(item.type, `${this.baseUrl}${item.path}${item.id}`);
    }

    this.reorderLayers();
}

    removeItem(type) {
        console.log(`Removing item of type: ${type}`);
        delete this.currentItems[type];
        this.updateAvatarDisplay(type, null);
    }

  updateAvatarDisplay(type, src) {
    console.log(`Updating avatar display for ${type} with src: ${src}`);
    if (this.layers[type]) {
        if (src) {
            this.layers[type].data = src;
            this.layers[type].style.display = 'block';
            this.layers[type].onload = () => {
                if (this.baseParts.includes(type) || this.facialFeatures.includes(type)) {
                    this.applySkinTone(this.layers[type], type);
                }
            };
        } else {
            this.layers[type].style.display = 'none';
        }
    } else {
        console.warn(`Layer not found for type: ${type}`);
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
                    if (this.baseParts.includes(type) || this.facialFeatures.includes(type)) {
                        this.applySkinTone(this.layers[type], type);
                    }
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
        this.currentItems = {};
        Object.keys(this.layers).forEach(type => {
            this.updateAvatarDisplay(type, null);
        });
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
