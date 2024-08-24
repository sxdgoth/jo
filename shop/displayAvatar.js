// displayAvatar.js

class AvatarDisplay {
    constructor(containerId, username) {
        this.containerId = containerId;
        this.username = username;
        this.baseUrl = 'https://sxdgoth.github.io/jo/';
        this.currentItems = {};
        this.equippedItems = {};
        this.baseParts = ['Body', 'Head', 'Eyes', 'Nose', 'Mouth'];
        this.skinTone = '#F5D0C5';
        this.eyeColor = '#000000';
        this.lipColor = '#D35D6E';

        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }

        this.svgContainer = document.getElementById('body-svg');
        if (!this.svgContainer) {
            console.log('SVG container not found, creating one');
            this.svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.svgContainer.id = 'body-svg';
            this.container.appendChild(this.svgContainer);
        }

        this.layerManager = new LayerManager(this.svgContainer);
    }

    loadAvatar() {
        console.log('Loading avatar for user:', this.username);
        // Load base parts
        this.baseParts.forEach(part => {
            this.updateAvatarDisplay(part, `${this.baseUrl}home/assets/body/avatar-${part.toLowerCase()}.svg`);
        });

        // Load equipped items (you'll need to implement this based on your data structure)
        // For example:
        // Object.keys(this.equippedItems).forEach(type => {
        //     const itemId = this.equippedItems[type];
        //     this.updateAvatarDisplay(type, `${this.baseUrl}home/assets/${type.toLowerCase()}/${itemId}`);
        // });

        this.layerManager.initialize();
    }

    tryOnItem(item) {
        console.log(`AvatarDisplay: Trying on ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        
        if (this.currentItems[item.type] && this.currentItems[item.type].id === item.id) {
            // If the item is already tried on, remove it
            console.log(`AvatarDisplay: Removing item ${item.id} of type ${item.type}`);
            this.removeItem(item.type);
        } else {
            // Apply the new item
            console.log(`AvatarDisplay: Applying new item ${item.id} of type ${item.type}`);
            this.currentItems[item.type] = item;
            this.updateAvatarDisplay(item.type, `${this.baseUrl}${item.path}${item.id}`);
        }
        this.layerManager.scheduleReorder();
    }

    removeItem(type) {
        console.log(`AvatarDisplay: Removing item of type ${type}`);
        const layerElement = this.svgContainer.querySelector(`g[data-body-part="${type.toLowerCase()}"]`);
        
        if (layerElement) {
            layerElement.style.display = 'none';
            layerElement.innerHTML = '';
        }
        
        delete this.currentItems[type];

        if (this.baseParts.includes(type)) {
            // If it's a base part, show the default
            this.updateAvatarDisplay(type, `${this.baseUrl}home/assets/body/avatar-${type.toLowerCase()}.svg`);
        } else if (this.equippedItems[type]) {
            // If there's an equipped item, show it
            const equippedItem = shopItems.find(item => item.id === this.equippedItems[type]);
            if (equippedItem) {
                this.updateAvatarDisplay(type, `${this.baseUrl}${equippedItem.path}${equippedItem.id}`);
            }
        }

        this.layerManager.scheduleReorder();
    }

    updateAvatarDisplay(type, src) {
        console.log(`AvatarDisplay: Updating avatar display for ${type} with src: ${src}`);
        if (!this.svgContainer) {
            console.error('SVG container not found');
            return;
        }
        
        let layerElement = this.svgContainer.querySelector(`g[data-body-part="${type.toLowerCase()}"]`);
        
        if (!layerElement) {
            console.log(`AvatarDisplay: Creating new layer for ${type}`);
            layerElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
            layerElement.setAttribute('data-body-part', type.toLowerCase());
            this.svgContainer.appendChild(layerElement);
        }

        if (src) {
            console.log(`AvatarDisplay: Fetching SVG content for ${type} from ${src}`);
            fetch(src)
                .then(response => response.text())
                .then(svgContent => {
                    console.log(`AvatarDisplay: SVG content loaded for ${type}`);
                    layerElement.innerHTML = svgContent;
                    layerElement.style.display = 'block';
                    this.applySkinTone(layerElement, type);
                    this.layerManager.scheduleReorder();
                })
                .catch(error => console.error(`AvatarDisplay: Failed to load SVG for ${type}:`, error));
        } else {
            console.log(`AvatarDisplay: Hiding layer for ${type}`);
            layerElement.style.display = 'none';
            layerElement.innerHTML = '';
        }
    }

    applySkinTone(element, type) {
        if (type === 'Body' || type === 'Head') {
            const paths = element.querySelectorAll('path');
            paths.forEach(path => {
                path.setAttribute('fill', this.skinTone);
            });
        } else if (type === 'Eyes') {
            const eyePaths = element.querySelectorAll('path:not([fill="#ffffff"])');
            eyePaths.forEach(path => {
                path.setAttribute('fill', this.eyeColor);
            });
        } else if (type === 'Mouth') {
            const lipPaths = element.querySelectorAll('path');
            lipPaths.forEach(path => {
                path.setAttribute('fill', this.lipColor);
            });
        }
    }

    setSkinTone(color) {
        this.skinTone = color;
        this.updateSkinTone();
    }

    setEyeColor(color) {
        this.eyeColor = color;
        this.updateEyeColor();
    }

    setLipColor(color) {
        this.lipColor = color;
        this.updateLipColor();
    }

    updateSkinTone() {
        ['Body', 'Head'].forEach(type => {
            const element = this.svgContainer.querySelector(`g[data-body-part="${type.toLowerCase()}"]`);
            if (element) {
                this.applySkinTone(element, type);
            }
        });
    }

    updateEyeColor() {
        const eyesElement = this.svgContainer.querySelector('g[data-body-part="eyes"]');
        if (eyesElement) {
            this.applySkinTone(eyesElement, 'Eyes');
        }
    }

    updateLipColor() {
        const mouthElement = this.svgContainer.querySelector('g[data-body-part="mouth"]');
        if (mouthElement) {
            this.applySkinTone(mouthElement, 'Mouth');
        }
    }
}

class LayerManager {
    constructor(svgContainer) {
        this.svgContainer = svgContainer;
        this.layerOrder = [
            'legs', 
            'arms', 
            'body', 
            'jacket', 
            'shirt',
            'pants',
            'shoes',
            'head',
            'eyes',
            'nose',
            'mouth',
            'eyebrows',
            'hair',
            'accessories'
        ];
        this.reorderTimeout = null;
    }

    initialize() {
        this.reorderLayers();
    }

    scheduleReorder() {
        if (this.reorderTimeout) {
            clearTimeout(this.reorderTimeout);
        }
        this.reorderTimeout = setTimeout(() => this.reorderLayers(), 100);
    }

    reorderLayers() {
        this.layerOrder.forEach(type => {
            const element = this.svgContainer.querySelector(`g[data-body-part="${type}"]`);
            if (element) {
                this.svgContainer.appendChild(element);
            }
        });
    }
}

// Initialize the AvatarDisplay when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing AvatarDisplay");
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        window.avatarDisplay = new AvatarDisplay('avatar-display', loggedInUser.username);
        window.avatarDisplay.loadAvatar();
    } else {
        console.error('No logged in user found');
    }
});
