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

    tryOnItem(item) {
        if (this.layers[item.type]) {
            if (this.triedOnItems[item.type] === item) {
                // Item is already tried on, so remove it
                this.removeTriedOnItem(item.type);
            } else {
                // Try on the new item
                this.triedOnItems[item.type] = item;
                this.updateLayerDisplay(item.type, `${this.baseUrl}${item.path}${item.id}`);
                console.log(`Tried on ${item.name}`);

                // Handle conflicting items
                if (item.type === 'Shirt') {
                    this.hideLayer('Jacket');
                } else if (item.type === 'Jacket') {
                    this.hideLayer('Shirt');
                }
            }
        }
    }

    removeTriedOnItem(type) {
        if (this.layers[type]) {
            delete this.triedOnItems[type];
            this.updateLayerDisplay(type, null);
            console.log(`Removed ${type}`);

            // Show conflicting items if they were equipped
            if (type === 'Shirt') {
                this.showLayerIfEquipped('Jacket');
            } else if (type === 'Jacket') {
                this.showLayerIfEquipped('Shirt');
            }
        }
    }

    updateLayerDisplay(type, src) {
        const layerElement = this.layers[type];
        if (layerElement) {
            if (src) {
                layerElement.data = src;
                layerElement.style.display = 'block';
            } else {
                // If src is null, revert to the original equipped item or hide if none
                const equippedItems = JSON.parse(localStorage.getItem('equippedItems') || '{}');
                const equippedItem = equippedItems[type];
                if (equippedItem) {
                    const item = shopItems.find(item => item.id === equippedItem);
                    if (item) {
                        layerElement.data = `${this.baseUrl}${item.path}${item.id}`;
                        layerElement.style.display = 'block';
                    } else {
                        layerElement.style.display = 'none';
                    }
                } else {
                    layerElement.style.display = 'none';
                }
            }
        }
    }

    hideLayer(type) {
        if (this.layers[type]) {
            this.layers[type].style.display = 'none';
        }
    }

    showLayerIfEquipped(type) {
        const equippedItems = JSON.parse(localStorage.getItem('equippedItems') || '{}');
        if (equippedItems[type] && this.layers[type]) {
            const item = shopItems.find(item => item.id === equippedItems[type]);
            if (item) {
                this.layers[type].data = `${this.baseUrl}${item.path}${item.id}`;
                this.layers[type].style.display = 'block';
            }
        }
    }

    isItemEquipped(item) {
        const equippedItems = JSON.parse(localStorage.getItem('equippedItems') || '{}');
        return equippedItems[item.type] === item.id;
    }
}

// Initialize the avatar display when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing AvatarDisplay");
    window.avatarDisplay = new AvatarDisplay('avatar-display');
    window.avatarDisplay.loadAvatar();
});
