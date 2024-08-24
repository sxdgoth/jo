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

// Initialize the LayerManager only once when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const layerManager = new LayerManager();
    layerManager.initialize();
});
