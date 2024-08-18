// avatarTemplate.js

class AvatarBody {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.baseUrl = 'https://sxdgoth.github.io/jo/home/assets/body/';
        this.bodyParts = [
            { name: 'Legs', file: 'avatar-legsandfeet.svg', type: 'Legs', isBase: true },
            { name: 'Arms', file: 'avatar-armsandhands.svg', type: 'Arms', isBase: true },
            { name: 'Body', file: 'avatar-body.svg', type: 'Body', isBase: true },
            { name: 'Head', file: 'avatar-head.svg', type: 'Head', isBase: true },
            { name: 'Jacket', file: '', type: 'Jacket', isBase: false },
            { name: 'Shirt', file: '', type: 'Shirt', isBase: false }
        ];
        this.layers = {};
    }

    loadAvatar() {
        console.log("Loading avatar body parts...");
        this.container.innerHTML = '';
        this.container.style.position = 'relative';
        this.container.style.width = '100%';
        this.container.style.height = '100%';

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
            img.style.display = part.isBase ? 'block' : 'none';
            img.onload = () => console.log(`Loaded ${part.name}`);
            img.onerror = () => console.error(`Failed to load ${part.name}: ${img.src}`);
            this.container.appendChild(img);
            this.layers[part.type] = img;
        });

        this.reorderLayers();
    }

    updateLayer(type, src) {
        if (this.layers[type]) {
            const bodyPart = this.bodyParts.find(part => part.type === type);
            if (src) {
                this.layers[type].src = src;
                this.layers[type].style.display = 'block';
                console.log(`Updated ${type} layer with ${src}`);
            } else if (!bodyPart.isBase) {
                this.layers[type].style.display = 'none';
                console.log(`Removed ${type} layer`);
            } else {
                // If it's a base part, revert to the original image
                this.layers[type].src = this.baseUrl + bodyPart.file;
                this.layers[type].style.display = 'block';
                console.log(`Reverted ${type} to base layer`);
            }
        } else {
            console.warn(`Layer ${type} not found`);
        }
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

    initializeAvatar() {
        this.loadAvatar();
        if (window.avatarManager) {
            window.avatarManager.updateAvatarDisplay();
        }
    }

    clearAllLayers() {
        Object.entries(this.layers).forEach(([type, layer]) => {
            const bodyPart = this.bodyParts.find(part => part.type === type);
            if (!bodyPart.isBase) {
                layer.style.display = 'none';
                layer.src = '';
            }
        });
        this.reorderLayers();
    }

    // New methods for skin tone
    updateSkinTone(color) {
        console.log(`Updating skin tone to: ${color}`);
        const baseParts = ['Legs', 'Arms', 'Body', 'Head'];
        baseParts.forEach(part => {
            const layer = this.layers[part];
            if (layer) {
                layer.style.filter = this.createSkinToneFilter(color);
            } else {
                console.warn(`Layer ${part} not found`);
            }
        });
    }

    createSkinToneFilter(hexColor) {
        // Convert hex to RGB
        const r = parseInt(hexColor.slice(1, 3), 16) / 255;
        const g = parseInt(hexColor.slice(3, 5), 16) / 255;
        const b = parseInt(hexColor.slice(5, 7), 16) / 255;

        // Create and return the filter string
        return `brightness(0) saturate(100%) invert(${r}) sepia(${g}) saturate(${b}) hue-rotate(0deg)`;
    }
}

// Create and load the avatar body when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    window.avatarBody = new AvatarBody('avatar-display');
    window.avatarBody.initializeAvatar();
});
