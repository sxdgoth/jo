// layerManager.js

class LayerManager {
    constructor() {
        this.avatarDisplay = document.getElementById('avatar-display');
        this.layerOrder = [
            'Legs', 
            'Arms', 
            'Body', 
            'Shirt',
            'Jacket', 
            'Head'
        ];
        this.reorderTimeout = null;
    }

    reorderLayers() {
        clearTimeout(this.reorderTimeout);
        this.reorderTimeout = setTimeout(() => {
            const items = Array.from(this.avatarDisplay.children);
            items.sort((a, b) => {
                const aIndex = this.getLayerIndex(a.dataset.type);
                const bIndex = this.getLayerIndex(b.dataset.type);
                return aIndex - bIndex;
            });
            items.forEach(item => this.avatarDisplay.appendChild(item));
        }, 50);
    }

    getLayerIndex(type) {
        const index = this.layerOrder.indexOf(type);
        return index === -1 ? this.layerOrder.length : index;
    }

    addLayer(element) {
        this.avatarDisplay.appendChild(element);
        this.reorderLayers();
    }

    removeLayer(elementId) {
        const element = this.avatarDisplay.querySelector(`[data-id="${elementId}"]`);
        if (element) {
            element.remove();
        }
    }
}

// Create a global instance of LayerManager
const layerManager = new LayerManager();
