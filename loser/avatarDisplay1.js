class AvatarDisplay {
    constructor(containerId, username) {
        console.log('AvatarDisplay: Initializing for user', username);
        this.username = username;
        this.container = document.getElementById(containerId);
        this.baseUrl = 'https://sxdgoth.github.io/jo/';
        this.layers = {};
        this.equippedItems = {};
        this.skinTone = 'light';
        this.eyeColor = '#3FA2FF';
        this.lipColor = '#E6998F';
        this.hairColor = '#1E1E1E';
        this.loadSavedState();
    }

    loadSavedState() {
        this.skinTone = localStorage.getItem(`skinTone_${this.username}`) || 'light';
        this.eyeColor = localStorage.getItem(`eyeColor_${this.username}`) || '#3FA2FF';
        this.lipColor = localStorage.getItem(`lipColor_${this.username}`) || '#E6998F';
        this.hairColor = localStorage.getItem(`hairColor_${this.username}`) || '#1E1E1E';
        const savedItems = localStorage.getItem(`equippedItems_${this.username}`);
        this.equippedItems = savedItems ? JSON.parse(savedItems) : {};
        console.log('Loaded equipped items:', this.equippedItems);
    }

    loadAvatar() {
        console.log("Loading avatar...");
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
            obj.data = part.isBase ? this.baseUrl + part.file : '';
            obj.alt = part.name;
            obj.dataset.type = part.type;
            obj.style.position = 'absolute';
            obj.style.top = '0';
            obj.style.left = '0';
            obj.style.width = '100%';
            obj.style.height = '100%';
            obj.style.display = part.isBase ? 'block' : 'none';

            if (!part.isBase && this.equippedItems[part.type]) {
                const itemId = this.equippedItems[part.type];
                const item = shopItems.find(item => item.id === itemId);
                if (item) {
                    obj.data = `${this.baseUrl}${item.path}${item.id}`;
                    obj.style.display = 'block';
                    console.log(`Loaded equipped item: ${part.type} - ${item.name}`);
                }
            }

            obj.onload = () => {
                console.log(`${part.name} loaded, applying colors`);
                this.applySkinTone(obj, part.type);
            };
            obj.onerror = () => console.error(`Failed to load SVG: ${obj.data}`);
            this.container.appendChild(obj);
            this.layers[part.type] = obj;
        });

        this.reorderLayers();
    }

    applySkinTone(obj, type) {
        console.log(`Applying colors to ${type}`);
        const svgDoc = obj.contentDocument;
        if (!svgDoc) {
            console.error(`SVG document not loaded for ${type}`);
            return;
        }

        const skinTones = {
            light: '#FEE2CA',
            medium: '#FFE0BD',
            tan: '#F1C27D',
            dark: '#8D5524'
        };

        const skinColor = skinTones[this.skinTone] || skinTones.light;

        if (type === 'Head' || type === 'Arms' || type === 'Legs' || type === 'Body') {
            const skinElements = svgDoc.querySelectorAll('.skin, .bodySkin');
            skinElements.forEach(element => {
                element.style.fill = skinColor;
            });
        }

        if (type === 'Eyes') {
            const eyeElements = svgDoc.querySelectorAll('.eye, .iris');
            eyeElements.forEach(element => {
                element.style.fill = this.eyeColor;
            });
        }

        if (type === 'Mouth') {
            const lipElements = svgDoc.querySelectorAll('.lips, .mouth');
            lipElements.forEach(element => {
                element.style.fill = this.lipColor;
            });
        }

        if (type === 'Hair') {
            const hairElements = svgDoc.querySelectorAll('.hair');
            hairElements.forEach(element => {
                element.style.fill = this.hairColor;
            });
        }

        console.log(`Applied colors to ${type}`);
        console.log(`Skin Tone: ${skinColor}`);
        console.log(`Eye Color: ${this.eyeColor}`);
        console.log(`Lip Color: ${this.lipColor}`);
        console.log(`Hair Color: ${this.hairColor}`);
    }

    reorderLayers() {
        const order = ['Legs', 'Arms', 'Body', 'Shoes', 'Pants', 'Dress', 'Shirt', 'Jacket', 'Backhair', 'Neck', 'Hoodie', 'Head', 'Cheeks', 'Eyes', 'Mouth', 'Nose', 'Face', 'Eyebrows', 'Accessories', 'Hair'];
        order.forEach((type, index) => {
            if (this.layers[type]) {
                this.layers[type].style.zIndex = index + 1;
            }
        });
    }

    updateAvatarDisplay(type, src) {
        if (this.layers[type]) {
            if (src) {
                this.layers[type].data = src;
                this.layers[type].style.display = 'block';
                this.layers[type].onload = () => this.applySkinTone(this.layers[type], type);
            } else {
                this.layers[type].style.display = 'none';
                this.layers[type].data = '';
            }
        }
    }

    isItemEquipped(item) {
        return this.equippedItems[item.type] === item.id;
    }
}
