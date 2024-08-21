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
        this.eyeColor = '#3FA2FF'; // Default eye color
        this.lipColor = '#E6998F'; // Default lip color
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
        this.baseParts = ['Legs', 'Arms', 'Body', 'Head'];
        this.originalColors = {};

        this.loadSkinTone();
        this.loadEyeColor();
        this.loadLipColor();
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
        const order = ['Legs', 'Arms', 'Body', 'Shoes', 'Pants', 'Dress', 'Shirt', 'Jacket', 'Backhair', 'Head', 'Cheeks', 'Eyes', 'Mouth', 'Nose', 'Face', 'Eyebrows', 'Accessories', 'Hair'];
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
        
        const preserveColors = ['#E6958A', '#E6998F', '#BF766E'];  // add colors here to prevent colors
        
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
                    }
                    else if (color === eyeColors.main) {
                        element.setAttribute(attr, tone.main);
                    }
                    else if (color === eyeColors.shadow) {
                        element.setAttribute(attr, tone.shadow);
                    }
                    else if ((color.startsWith('#E6') || color.startsWith('#F4')) && !preserveColors.includes(color)) {
                        element.setAttribute(attr, tone.main);
                    }
                    else if (color === '#3FA2FF') {
                        element.setAttribute(attr, this.eyeColor);
                    }
                    else if (color === '#E6998F' || color === '#BF766E' || color === '#F2ADA5') {
                        element.setAttribute(attr, this.lipColor);
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
                style = style.replace(/#3FA2FF/gi, this.eyeColor);
                style = style.replace(/#E6998F/gi, this.lipColor);
                style = style.replace(/#BF766E/gi, this.lipColor);
                style = style.replace(/#F2ADA5/gi, this.lipColor);
                element.setAttribute('style', style);
            }

            Array.from(element.children).forEach(replaceColor);
        };

        replaceColor(svgDoc.documentElement);
        console.log(`Applied skin tone ${this.skinTone}, eye color ${this.eyeColor}, and lip color ${this.lipColor} to ${type}`);
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
                    this.applySkinTone(this.layers[type], type);
                    if (type === 'Eyes') {
                        setTimeout(() => this.applySkinTone(this.layers[type], type), 100);
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
