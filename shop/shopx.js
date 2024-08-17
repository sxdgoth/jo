// shop.js

document.addEventListener('DOMContentLoaded', function() {
    const avatarDisplay = document.getElementById('avatar-display');
    const shopItemsContainer = document.querySelector('.shop-items');
    const equippedItems = new Set();
    const layerManager = new LayerManager();

    // Load base avatar
    function loadBaseAvatar() {
        const baseAvatar = new AvatarBody('avatar-display');
        baseAvatar.loadAvatar();
    }

    // Create shop items
    function createShopItems() {
        shopItems.forEach(item => {
            const button = document.createElement('button');
            button.textContent = `${item.name} ($${item.price})`;
            button.classList.add('item-button');
            button.addEventListener('click', () => toggleItem(item));
            shopItemsContainer.appendChild(button);
        });
    }

    // Toggle item on/off
    function toggleItem(item) {
        if (equippedItems.has(item.id)) {
            equippedItems.delete(item.id);
            removeItemFromAvatar(item.id);
        } else {
            equippedItems.add(item.id);
            addItemToAvatar(item);
        }
        layerManager.reorderLayers();
    }

    // Add item to avatar
    function addItemToAvatar(item) {
        fetch(`https://sxdgoth.github.io/jo/${item.path}${item.id}`)
            .then(response => response.text())
            .then(svgContent => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
                const svgElement = svgDoc.documentElement;
                
                svgElement.dataset.id = item.id;
                svgElement.dataset.type = item.type;
                svgElement.style.position = 'absolute';
                svgElement.style.top = '0';
                svgElement.style.left = '0';
                svgElement.style.width = '100%';
                svgElement.style.height = '100%';
                
                avatarDisplay.appendChild(svgElement);
            })
            .catch(error => console.error(`Failed to load SVG: ${error}`));
    }

    // Remove item from avatar
    function removeItemFromAvatar(itemId) {
        const svg = avatarDisplay.querySelector(`svg[data-id="${itemId}"]`);
        if (svg) {
            svg.remove();
        }
    }

    // Initialize
    loadBaseAvatar();
    createShopItems();
    layerManager.initialize();

    // Log equipped items for debugging
    window.logEquippedItems = function() {
        console.log("Equipped items:", Array.from(equippedItems));
    };
});
