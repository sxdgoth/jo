// layerManager.js

class LayerManager {
    constructor() {
        this.avatarDisplay = document.getElementById('avatar-display');
        this.layerOrder = [
            'Legs', 
            'Arms', 
            'Body', 
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
                const aIndex = this.layerOrder.indexOf(a.dataset.type);
                const bIndex = this.layerOrder.indexOf(b.dataset.type);
                return aIndex - bIndex;
            });
            items.forEach(item => this.avatarDisplay.appendChild(item));
        }, 50);
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
