// File: layerManager.js

class LayerManager {
    constructor() {
        this.avatarContainer = document.getElementById('avatar-display');
        this.layerOrder = ['Legs', 'Arms', 'Body', 'Jacket', 'Head'];
        this.reorderTimeout = null;
    }

    initialize() {
        this.reorderLayers();
        const observer = new MutationObserver(() => this.scheduleReorder());
        observer.observe(this.avatarContainer, { childList: true, subtree: true });
    }

    scheduleReorder() {
        if (this.reorderTimeout) {
            clearTimeout(this.reorderTimeout);
        }
        this.reorderTimeout = setTimeout(() => this.reorderLayers(), 100);
    }

    reorderLayers() {
        this.layerOrder.forEach(layerType => {
            const elements = this.avatarContainer.querySelectorAll(`svg[data-type="${layerType}"]`);
            elements.forEach(element => this.avatarContainer.appendChild(element));
        });
    }
}
