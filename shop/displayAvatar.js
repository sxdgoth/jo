// displayAvatar.js

class AvatarDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }
        this.baseUrl = 'https://sxdgoth.github.io/jo/';
        this.layers = {};
        this.triedOnItems = {};
        this.equippedItems = {};
this.lastAction = {}; // Add this line to track the last action for each item type
    }

    loadAvatar() {
        console.log("Loading avatar...");
        const savedItems = localStorage.getItem('equippedItems');
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
            { name: 'Shirt', file: '', type: 'Shirt', isBase: false }
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
        });

        this.reorderLayers();
    }

    reorderLayers() {
        const order = ['Legs', 'Arms', 'Body', 'Shirt', 'Jacket', 'Head'];
        order.forEach((type, index) => {
            if (this.layers[type]) {
                this.layers[type].style.zIndex = index + 1;
            }
        });
    }

    // Add these new methods
 tryOnItem(item) {
        if (this.layers[item.type]) {
            console.log(`Trying on ${item.name} (ID: ${item.id}, Type: ${item.type})`);
            this.layers[item.type].data = `${this.baseUrl}${item.path}${item.id}`;
            this.layers[item.type].style.display = 'block';
            this.triedOnItems[item.type] = item;
            this.lastAction[item.type] = 'triedOn';

            // Hide conflicting items
            if (item.type === 'Shirt') this.layers['Jacket'].style.display = 'none';
            if (item.type === 'Jacket') this.layers['Shirt'].style.display = 'none';
        }
    }
    
    removeTriedOnItem(type) {
        if (this.layers[type]) {
            console.log(`Removing tried on item of type: ${type}`);
            delete this.triedOnItems[type];

            if (this.lastAction[type] === 'hidden') {
                // If the last action was to hide the equipped item, keep it hidden
                this.layers[type].style.display = 'none';
            } else if (this.equippedItems[type]) {
                // Show equipped item if exists
                const equippedItem = shopItems.find(item => item.id === this.equippedItems[type]);
                if (equippedItem) {
                    this.layers[type].data = `${this.baseUrl}${equippedItem.path}${equippedItem.id}`;
                    this.layers[type].style.display = 'block';
                }
            } else {
                // If no equipped item, hide the layer
                this.layers[type].style.display = 'none';
            }

            this.lastAction[type] = 'removed';
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
                }
            } else {
                // Hide the equipped item
                this.layers[type].style.display = 'none';
                this.lastAction[type] = 'hidden';
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

// Initialize the avatar display when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing AvatarDisplay");
    window.avatarDisplay = new AvatarDisplay('avatar-display');
    window.avatarDisplay.loadAvatar();
});
