// displayAvatar.js

class AvatarDisplay {
    constructor(containerId, username) {
        this.username = username;
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }
        this.baseUrl = 'https://sxdgoth.github.io/jo/';
        this.layers = {};
        this.triedOnItems = {};
        this.equippedItems = {};
        this.lastAction = {}; // Track the last action for each item type
        this.hiddenEquippedItems = new Set();
        this.skinTone = 'light'; // Default skin tone
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
        this.baseParts = ['Legs', 'Arms', 'Body', 'Head'];
        this.originalColors = {};
        this.loadSkinTone();
    }

    loadSkinTone() {
        const savedSkinTone = localStorage.getItem(`skinTone_${this.username}`);
        if (savedSkinTone) {
            this.skinTone = savedSkinTone;
        }
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
    { name: 'Jacket', file: '', type: 'Jacket', isBase: false },
    { name: 'Shirt', file: '', type: 'Shirt', isBase: false },
    { name: 'Pants', file: '', type: 'Pants', isBase: false },
    { name: 'Eyes', file: '', type: 'Eyes', isBase: false },
    { name: 'Shoes', file: '', type: 'Shoes', isBase: false }
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

            if (part.isBase) {
                obj.addEventListener('load', () => {
                    this.saveOriginalColors(obj, part.type);
                    this.applySkinTone(obj, part.type);
                });
            }
        });

        this.reorderLayers();
    }

   reorderLayers() {
    const order = ['Legs', 'Arms', 'Body', 'Shoes', 'Pants', 'Dress', 'Shirt', 'Jacket', 'Backhair', 'Head', 'Eyes', 'Mouth', 'Nose', 'Eyebrows', 'Accessories', 'Hair'];
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
            const paths = svgDoc.querySelectorAll('path, circle, ellipse, rect');
            const tone = this.skinTones[this.skinTone];
            const colors = this.getUniqueColors(paths);
            const mainColor = this.findMainSkinColor(colors);
            
            paths.forEach((path, index) => {
                const currentFill = path.getAttribute('fill');
                if (currentFill && currentFill.toLowerCase() !== 'none') {
                    const newColor = this.getNewColor(currentFill, mainColor, tone);
                    path.setAttribute('fill', newColor);
                }
            });
        }
    }

    getUniqueColors(paths) {
        const colors = new Set();
        paths.forEach(path => {
            const fill = path.getAttribute('fill');
            if (fill && fill.toLowerCase() !== 'none') {
                colors.add(fill.toLowerCase());
            }
        });
        return Array.from(colors);
    }

    findMainSkinColor(colors) {
        return colors.reduce((a, b) => this.getLuminance(a) > this.getLuminance(b) ? a : b);
    }

    getNewColor(currentColor, mainColor, tone) {
        const currentLuminance = this.getLuminance(currentColor);
        const mainLuminance = this.getLuminance(mainColor);
        const luminanceDiff = currentLuminance - mainLuminance;
        
        if (Math.abs(luminanceDiff) < 0.1) {
            return tone.main;
        } else if (luminanceDiff < 0) {
            return tone.shadow;
        } else {
            // For colors lighter than the main color, we'll create a lighter version of the main tone
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

 tryOnItem(item) {
    if (this.layers[item.type]) {
        console.log(`Trying on ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        this.layers[item.type].data = `${this.baseUrl}${item.path}${item.id}`;
        this.layers[item.type].style.display = 'block';
        this.triedOnItems[item.type] = item;
        this.lastAction[item.type] = 'triedOn';

        // Special handling for shirt and jacket
        if (item.type === 'Shirt' || item.type === 'Jacket') {
            const otherType = item.type === 'Shirt' ? 'Jacket' : 'Shirt';
            if (!this.triedOnItems[otherType]) {
                this.layers[otherType].style.display = 'none';
            }
        }
    }
}


removeTriedOnItem(type) {
    if (this.layers[type]) {
        console.log(`Removing tried on item of type: ${type}`);
        delete this.triedOnItems[type];
        this.layers[type].style.display = 'none';
        this.lastAction[type] = 'removed';

        // Special handling for shirt and jacket
        if (type === 'Jacket' || type === 'Shirt') {
            ['Jacket', 'Shirt'].forEach(itemType => {
                if (this.equippedItems[itemType] && !this.hiddenEquippedItems.has(itemType)) {
                    const equippedItem = shopItems.find(item => item.id === this.equippedItems[itemType]);
                    if (equippedItem) {
                        this.layers[itemType].data = `${this.baseUrl}${equippedItem.path}${equippedItem.id}`;
                        this.layers[itemType].style.display = 'block';
                    }
                }
            });
        }
    }
}

    updateAvatarDisplay(type, src) {
    if (this.layers[type]) {
        if (src) {
            this.layers[type].data = src;
            this.layers[type].style.display = 'block';
        } else {
            this.layers[type].style.display = 'none';
        }
        this.reorderLayers();
    }
}

    toggleEquippedItem(type) {
        if (this.layers[type] && this.equippedItems[type]) {
            if (this.layers[type].style.display === 'none') {
                // Show the equipped item
                const equippedItem = shopItems.find(item => item.id === this.equippedItems[type]);
                if (equippedItem) {
                    this.layers[type].data = `${this.baseUrl}${equippedItem.path}${equippedItem.id}`;
                    this.layers[type].style.display = 'block';
                    this.lastAction[type] = 'shown';
                    this.hiddenEquippedItems.delete(type); // Remove from hidden set
                }
            } else {
                // Hide the equipped item
                this.layers[type].style.display = 'none';
                this.lastAction[type] = 'hidden';
                this.hiddenEquippedItems.add(type); // Add to hidden set
            }
        }
    }

    isItemEquipped(item) {
        return this.equippedItems[item.type] === item.id;
    }

    updateEquippedItems() {
        const savedItems = localStorage.getItem('equippedItems');
        this.equippedItems = savedItems ? JSON.parse(savedItems) : {};
    }
}

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
