// layerManager.js

class LayerManager {
    constructor() {
        this.svgContainer = document.getElementById('body-svg');
        this.layerOrder = ['Legs', 'Arms', 'Body', 'Jacket', 'Head'];
        this.reorderTimeout = null;
    }

    initialize() {
        if (this.svgContainer) {
            this.reorderLayers();
            const observer = new MutationObserver(() => this.scheduleReorder());
            observer.observe(this.svgContainer, { childList: true, subtree: true });
        } else {
            console.error('SVG container not found');
        }
    }

    scheduleReorder() {
        if (this.reorderTimeout) {
            clearTimeout(this.reorderTimeout);
        }
        this.reorderTimeout = setTimeout(() => this.reorderLayers(), 100);
    }

    reorderLayers() {
        if (!this.svgContainer) return;

        const headElement = this.svgContainer.querySelector('g[data-body-part="head"]');
        const hoodieElement = this.svgContainer.querySelector('g[data-body-part="hoodie"]');

        if (headElement) {
            this.svgContainer.appendChild(headElement);
        }

        if (hoodieElement && headElement) {
            this.svgContainer.insertBefore(hoodieElement, headElement);
        }
    }
}

// Initialize the LayerManager only once when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.layerManager = new LayerManager();
    window.layerManager.initialize();
});
