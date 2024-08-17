// avatarTemplate.js

class AvatarBody {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.baseUrl = 'https://sxdgoth.github.io/jo/home/assets/body/';
        this.bodyParts = [
            { name: 'Legs', file: 'avatar-legsandfeet.svg', type: 'Legs' },
            { name: 'Arms', file: 'avatar-armsandhands.svg', type: 'Arms' },
            { name: 'Body', file: 'avatar-body.svg', type: 'Body' },
            { name: 'Head', file: 'avatar-head.svg', type: 'Head' },
            { name: 'Jacket', file: '', type: 'Jacket' },
            { name: 'Shirt', file: '', type: 'Shirt' }
        ];
        this.layers = {};
    }

    loadAvatar() {
        console.log("Loading avatar body parts...");
        this.container.innerHTML = '';
        this.bodyParts.forEach(part => {
            const img = document.createElement('img');
            img.src = part.file ? this.baseUrl + part.file : '';
            img.alt = part.name;
            img.dataset.type = part.type;
            img.style.position = 'absolute';
            img.style.top = '0';
            img.style.left = '0';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.display = part.file ? 'block' : 'none';
            img.onload = () => console.log(`Loaded ${part.name}`);
            img.onerror = () => console.error(`Failed to load ${part.name}: ${img.src}`);
            this.container.appendChild(img);
            this.layers[part.type] = img;
        });
        this.reorderLayers();
    }

    updateLayer(type, newSrc) {
        if (this.layers[type]) {
            this.layers[type].src = newSrc;
            this.layers[type].style.display = 'block';
            console.log(`Updated ${type} layer with ${newSrc}`);
        } else {
            console.warn(`Layer ${type} not found`);
        }
        this.reorderLayers();
    }

    reorderLayers() {
        const order = ['Legs', 'Body', 'Shirt', 'Jacket', 'Arms', 'Head'];
        order.forEach((type, index) => {
            if (this.layers[type]) {
                this.layers[type].style.zIndex = index + 1;
            }
        });
    }
}

// Create and load the avatar body when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    window.avatarBody = new AvatarBody('avatar-display');
    window.avatarBody.loadAvatar();
});
