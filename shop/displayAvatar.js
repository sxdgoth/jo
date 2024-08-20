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
        this.baseParts = ['Legs', 'Arms', 'Body', 'Head'];
        this.originalColors = {};
        this.loadSkinTone();
        this.loadEquippedItems();
    }

    loadSkinTone() {
        const savedSkinTone = localStorage.getItem(`skinTone_${this.username}`);
        if (savedSkinTone && this.skinTones[savedSkinTone]) {
            this.skinTone = savedSkinTone;
        }
        console.log("Loaded skin tone:", this.skinTone, "Color:", this.skinTones[this.skinTone].main);
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
            { name: 'Jacket', file: '', type: 'Jacket', isBase: false },
            { name: 'Shirt', file: '', type: 'Shirt', isBase: false },
            { name: 'Pants', file: '', type: 'Pants', isBase: false },
            { name: 'Eyes', file: '', type: 'Eyes', isBase: false },
            { name: 'Shoes', file: '', type: 'Shoes', isBase: false },
            { name: 'Nose', file: '', type: 'Nose', isBase: false },
            { name: 'Mouth', file: '', type: 'Mouth', isBase: false },
            { name: 'Eyebrows', file: '', type: 'Eyebrows', isBase: false },
            { name: 'Face', file: '', type: 'Face', isBase: false },
            { name: 'Accessories', file: '', type: 'Accessories', isBase: false }
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

 applySkinTone(obj, type) {
        if (!['Eyes', 'Face', 'Mouth', 'Nose'].includes(type)) return;

        const svgDoc = obj.contentDocument;
        if (svgDoc && this.skinTones[this.skinTone]) {
            const tone = this.skinTones[this.skinTone];
            this.applySkinToneToSpecificParts(svgDoc, type, tone);
        }
    }

   applySkinToneToElement(element, color) {
        ['fill', 'stroke'].forEach((attr) => {
            const originalColor = element.getAttribute(attr);
            if (originalColor && originalColor.toLowerCase() !== 'none') {
                element.setAttribute(attr, color);
                console.log(`Changed ${attr} from ${originalColor} to ${color}`);
            }
        });
    }
    

    isSkinTone(color) {
        const skinTones = Object.values(this.skinTones).map(t => t.main.toLowerCase());
        return skinTones.includes(color.toLowerCase()) || this.isCloseToSkinTone(color);
    }

    isShadowTone(color) {
        const shadowTones = Object.values(this.skinTones).map(t => t.shadow.toLowerCase());
        return shadowTones.includes(color.toLowerCase()) || this.isCloseToShadowTone(color);
    }

    isCloseToSkinTone(color) {
        const rgb = this.hexToRgb(color);
        return Object.values(this.skinTones).some(tone => {
            const toneRgb = this.hexToRgb(tone.main);
            return this.colorDistance(rgb, toneRgb) < 30; // Adjust threshold as needed
        });
    }

    isCloseToShadowTone(color) {
        const rgb = this.hexToRgb(color);
        return Object.values(this.skinTones).some(tone => {
            const toneRgb = this.hexToRgb(tone.shadow);
            return this.colorDistance(rgb, toneRgb) < 30; // Adjust threshold as needed
        });
    }

    colorDistance(rgb1, rgb2) {
        return Math.sqrt(
            Math.pow(rgb1[0] - rgb2[0], 2) +
            Math.pow(rgb1[1] - rgb2[1], 2) +
            Math.pow(rgb1[2] - rgb2[2], 2)
        );
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }

   tryOnItem(item) {
        console.log(`Trying on ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        
        if (!this.triedOnItems) this.triedOnItems = {};
        if (!this.currentItems) this.currentItems = {};
        
        if (this.currentItems[item.type] && this.currentItems[item.type].id === item.id) {
            this.removeItem(item.type);
        } else {
            this.currentItems[item.type] = item;
            const itemSrc = `${this.baseUrl}${item.path}${item.id}`;
            this.updateAvatarDisplay(item.type, itemSrc);
            
            const itemLayer = this.layers[item.type];
            if (itemLayer) {
                itemLayer.addEventListener('load', () => {
                    if (['Eyes', 'Face', 'Mouth', 'Nose'].includes(item.type)) {
                        this.applySkinTone(itemLayer, item.type);
                    }
                }, { once: true });
            }
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
                this.layers[type].dispatchEvent(new Event('load'));
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

    reapplySkinTone() {
        Object.values(this.layers).forEach(layer => {
            if (layer.contentDocument) {
                this.applySkinTone(layer, layer.dataset.type);
            }
        });
    }

    changeSkinTone(newTone) {
        if (this.skinTones[newTone]) {
            this.skinTone = newTone;
            this.reapplySkinTone();
            localStorage.setItem(`skinTone_${this.username}`, newTone);
            console.log("Skin tone changed to:", newTone);
        } else {
            console.error("Invalid skin tone:", newTone);
        }
    }

     applySkinToneToShopItem(imgElement, item) {
        if (['Eyes', 'Face', 'Mouth', 'Nose'].includes(item.type)) {
            imgElement.addEventListener('load', () => {
                const svgDoc = imgElement.contentDocument;
                if (svgDoc) {
                    const tone = this.skinTones[this.skinTone];
                    this.applySkinToneToSpecificParts(svgDoc, item.type, tone);
                }
            });
        }
    }

    applySkinToneToSpecificParts(svgDoc, itemType, tone) {
        const partsToColor = {
            'Eyes': {
                main: ['eyelid', 'under-eye'],
                shadow: ['eyelid-crease', 'eye-socket']
            },
            'Face': {
                main: ['cheek', 'forehead', 'chin'],
                shadow: ['cheekbone', 'jaw-shadow']
            },
            'Mouth': {
                main: ['lip', 'inner-mouth'],
                shadow: ['lip-shadow']
            },
            'Nose': {
                main: ['nose-bridge', 'nostril'],
                shadow: ['nose-shadow']
            }
        };
        
         const parts = partsToColor[itemType] || { main: [], shadow: [] };
        
        parts.main.forEach(part => {
            const elements = svgDoc.querySelectorAll(`[id*="${part}"], [class*="${part}"]`);
            elements.forEach(element => {
                this.applySkinToneToElement(element, tone.main);
            });
        });

        parts.shadow.forEach(part => {
            const elements = svgDoc.querySelectorAll(`[id*="${part}"], [class*="${part}"]`);
            elements.forEach(element => {
                this.applySkinToneToElement(element, tone.shadow);
            });
        });
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
