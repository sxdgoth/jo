// displayAvatar.js

class AvatarDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.baseUrl = 'https://sxdgoth.github.io/jo/home/assets/body/';
        this.layers = {};
    }

    loadAvatar() {
        const savedItems = localStorage.getItem('equippedItems');
        const equippedItems = savedItems ? JSON.parse(savedItems) : {};

        this.container.innerHTML = '';
        this.container.style.position = 'relative';
        this.container.style.width = '100%';
        this.container.style.height = '100%';

        const bodyParts = [
            { name: 'Legs', file: 'avatar-legsandfeet.svg', type: 'Legs', isBase: true },
            { name: 'Arms', file: 'avatar-armsandhands.svg', type: 'Arms', isBase: true },
            { name: 'Body', file: 'avatar-body.svg', type: 'Body', isBase: true },
            { name: 'Head', file: 'avatar-head.svg', type: 'Head', isBase: true },
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
            } else if (equippedItems[part.type]) {
                img.src = `https://sxdgoth.github.io/jo/${equippedItems[part.type]}`;
                img.style.display = 'block';
            } else {
                img.style.display = 'none';
            }

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
    const avatarDisplay = new AvatarDisplay('avatar-display');
    avatarDisplay.loadAvatar();
});
