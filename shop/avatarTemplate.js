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
            this.applySkinToneToSVG(layer, color);
        } else {
            console.warn(`Layer ${part} not found`);
        }
    });
}

applySkinToneToSVG(img, newColor) {
    fetch(img.src)
        .then(response => response.text())
        .then(svgText => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            
            const paths = svgDoc.querySelectorAll('path, circle, ellipse, rect');
            paths.forEach(path => {
                const currentFill = path.getAttribute('fill');
                if (currentFill && currentFill.toLowerCase() !== 'none') {
                    const newFill = this.blendColors(currentFill, newColor);
                    path.setAttribute('fill', newFill);
                }
            });

            const serializer = new XMLSerializer();
            const modifiedSvgString = serializer.serializeToString(svgDoc);
            const blob = new Blob([modifiedSvgString], {type: 'image/svg+xml'});
            const url = URL.createObjectURL(blob);
            img.src = url;
        })
        .catch(error => console.error('Error applying skin tone:', error));
}

blendColors(color1, color2) {
    const [r1, g1, b1] = this.hexToRgb(color1);
    const [r2, g2, b2] = this.hexToRgb(color2);
    
    const r = Math.round((r1 + r2) / 2);
    const g = Math.round((g1 + g2) / 2);
    const b = Math.round((b1 + b2) / 2);
    
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
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


// Create and load the avatar body when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    window.avatarBody = new AvatarBody('avatar-display');
    window.avatarBody.initializeAvatar();
});
