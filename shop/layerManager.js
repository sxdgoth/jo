// layerManager.js

class LayerManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.layerOrder = [
            'Legs', 'Arms', 'Body', 'Shoes', 'Pants', 'Dress', 'Shirt', 
            'Jacket', 'Backhair', 'Neck', 'Hoodie', 'Head', 'Cheeks', 
            'Eyes', 'Mouth', 'Nose', 'Face', 'Eyebrows', 'Accessories', 'Hair'
        ];
        this.reorderTimeout = null;
    }

    initialize() {
        if (!this.container) {
            console.error(`Container with id "${this.containerId}" not found`);
            return;
        }
        this.reorderLayers();
        const observer = new MutationObserver(() => this.scheduleReorder());
        observer.observe(this.container, { childList: true, subtree: true });
    }

    scheduleReorder() {
        if (this.reorderTimeout) {
            clearTimeout(this.reorderTimeout);
        }
        this.reorderTimeout = setTimeout(() => this.reorderLayers(), 100);
    }

    reorderLayers() {
        this.layerOrder.forEach((type, index) => {
            const element = this.container.querySelector(`[data-type="${type}"]`);
            if (element) {
                element.style.zIndex = index + 1;
            }
        });
    }
}

// Export the LayerManager class if using modules
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = LayerManager;
}

// Initialize the LayerManager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing LayerManager');
    if (window.avatarDisplay) {
        window.layerManager = new LayerManager('avatar-display');
        window.layerManager.initialize();
    } else {
        console.warn('AvatarDisplay not found. LayerManager initialization delayed.');
        // Attempt to initialize after a short delay
        setTimeout(() => {
            if (window.avatarDisplay) {
                window.layerManager = new LayerManager('avatar-display');
                window.layerManager.initialize();
            } else {
                console.error('AvatarDisplay still not found. LayerManager not initialized.');
            }
        }, 1000);
    }
});
