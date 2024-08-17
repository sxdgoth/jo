// displayAvatar.js

class AvatarDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }
        this.baseUrl = 'https://sxdgoth.github.io/jo/home/assets/';
        this.layers = {};
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
            { name: 'Legs', file: 'body/avatar-legsandfeet.svg', type: 'Legs', isBase: true },
            { name: 'Arms', file: 'body/avatar-armsandhands.svg', type: 'Arms', isBase: true },
            { name: 'Body', file: 'body/avatar-body.svg', type: 'Body', isBase: true },
            { name: 'Head', file: 'body/avatar-head.svg', type: 'Head', isBase: true },
            { name: 'Jacket', file: '', type: 'Jacket', isBase: false },
            { name: 'Shirt', file: '', type: 'Shirt', isBase: false }
        ];

        bodyParts.forEach(part => {
            const img = document.createElement('img');
            img.alt = part.name;
            img.dataset.type = part.type;
            img.style.position = 'absolute';
            img.style.top = '0';
            img.style.left = '0';
            img.style.width = '100%';
            img.style.height = '100%';

            if (part.isBase) {
                img.src = this.baseUrl + part.file;
                img.style.display = 'block';
                console.log(`Loading base part: ${part.name}, src: ${img.src}`);
            } else if (equippedItems[part.type]) {
                img.src = `${this.baseUrl}${part.type.toLowerCase()}s/${equippedItems[part.type]}`;
                img.style.display = 'block';
                console.log(`Loading equipped part: ${part.name}, src: ${img.src}`);
            } else {
                img.style.display = 'none';
                console.log(`No equipped item for: ${part.name}`);
            }

            img.onerror = () => console.error(`Failed to load image: ${img.src}`);

            this.container.appendChild(img);
            this.layers[part.type] = img;
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
}

// Initialize the avatar display when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing AvatarDisplay");
    const avatarDisplay = new AvatarDisplay('avatar-display');
    avatarDisplay.loadAvatar();
});
