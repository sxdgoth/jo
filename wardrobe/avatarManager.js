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
            { name: 'Shirt', file: '', type: 'Shirt', isBase: false },
            { name: 'Pants', file: '', type: 'Pants', isBase: false },
            { name: 'Eyes', file: '', type: 'Eyes', isBase: false },
            { name: 'Shoes', file: '', type: 'Shoes', isBase: false },
            { name: 'Face', file: '', type: 'Face', isBase: false },
            { name: 'Accessories', file: '', type: 'Accessories', isBase: false }
        ];
        this.layers = {};
        this.skinTone = 'light';
        this.skinTones = {
            light: { main: '#FEE2CA', shadow: '#EFC1B7' },
            medium: { main: '#FFE0BD', shadow: '#EFD0B1' },
            tan: { main: '#F1C27D', shadow: '#E0B170' },
            dark: { main: '#8D5524', shadow: '#7C4A1E' }
        };
    }

    loadAvatar() {
        console.log("Loading avatar body parts...");
        this.container.innerHTML = '';
        this.container.style.position = 'relative';
        this.container.style.width = '100%';
        this.container.style.height = '100%';

        this.bodyParts.forEach(part => {
            console.log('Creating layer for:', part.type);
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
        this.applyCurrentSkinTone();
    }

    updateLayer(type, src) {
        console.log('Updating layer:', type, src);
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
        const order = ['Legs', 'Arms', 'Body', 'Shoes', 'Pants', 'Dress', 'Shirt', 'Jacket', 'Backhair', 'Head', 'Eyes', 'Mouth', 'Nose', 'Face', 'Eyebrows', 'Accessories', 'Hair'];
        order.forEach((type, index) => {
            if (this.layers[type]) {
                this.layers[type].style.zIndex = index + 1;
            }
        });
    }

    changeSkinTone(newTone) {
        console.log(`Changing skin tone to: ${newTone}`);
        this.skinTone = newTone;
        this.applyCurrentSkinTone();
    }

    applyCurrentSkinTone() {
        const tone = this.skinTones[this.skinTone];
        if (!tone) {
            console.error(`Invalid skin tone: ${this.skinTone}`);
            return;
        }

        ['Head', 'Arms', 'Legs'].forEach(partName => {
            const part = this.layers[partName];
            if (part) {
                this.applySkinToneToSVG(part, tone);
            }
        });
    }

    applySkinToneToSVG(img, tone) {
        fetch(img.src)
            .then(response => response.text())
            .then(svgText => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                
                const paths = svgDoc.querySelectorAll('path, circle, ellipse, rect');
                paths.forEach(path => {
                    const currentFill = path.getAttribute('fill');
                    if (currentFill && currentFill.toLowerCase() !== 'none') {
                        path.setAttribute('fill', tone.main);
                    }
                });

                const serializer = new XMLSerializer();
                const modifiedSvgString = serializer.serializeToString(svgDoc);
                const blob = new Blob([modifiedSvgString], {type: 'image/svg+xml'});
                const url = URL.createObjectURL(blob);
                img.src = url;
            })
            .catch(error => console.error(`Error applying skin tone:`, error));
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
}

document.addEventListener('DOMContentLoaded', function() {
    window.avatarBody = new AvatarBody('avatar-display');
    window.avatarBody.loadAvatar();
});
