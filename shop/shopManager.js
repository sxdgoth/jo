// shopManager.js

document.addEventListener('DOMContentLoaded', () => {
    const shopItemsContainer = document.querySelector('.shop-items');
    let triedOnItems = {};

    function renderShopItems() {
        // ... (keep existing renderShopItems function unchanged)
    }

    function toggleTryOn(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (item) {
            const equippedItems = JSON.parse(localStorage.getItem('equippedItems') || '{}');
            
            if (triedOnItems[item.type] === item) {
                // Item is already tried on, so remove it
                delete triedOnItems[item.type];
                
                // If this was an equipped item, revert to the original equipped item
                if (equippedItems[item.type] === item.id) {
                    updateAvatarDisplay(item.type, null);
                } else {
                    // If it wasn't equipped, just remove it from display
                    updateAvatarDisplay(item.type, null);
                }
                console.log(`Removed ${item.name}`);
            } else {
                // Try on the new item
                triedOnItems[item.type] = item;
                updateAvatarDisplay(item.type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
                console.log(`Tried on ${item.name}`);
            }
            updateItemImages();
        }
    }

    function updateItemImages() {
        const equippedItems = JSON.parse(localStorage.getItem('equippedItems') || '{}');
        document.querySelectorAll('.item-image').forEach(image => {
            const itemId = image.dataset.id;
            const item = shopItems.find(i => i.id === itemId);
            if (triedOnItems[item.type] === item) {
                image.classList.add('selected');
            } else if (equippedItems[item.type] === item.id && !triedOnItems[item.type]) {
                image.classList.add('equipped');
            } else {
                image.classList.remove('selected');
                image.classList.remove('equipped');
            }
        });
    }

    function updateAvatarDisplay(type, src) {
        const layerElement = document.querySelector(`#avatar-display [data-type="${type}"]`);
        if (layerElement) {
            if (src) {
                layerElement.data = src;
                layerElement.style.display = 'block';
            } else {
                // If src is null, revert to the original equipped item or hide if none
                const equippedItems = JSON.parse(localStorage.getItem('equippedItems') || '{}');
                const equippedItem = equippedItems[type];
                if (equippedItem) {
                    const item = shopItems.find(item => item.id === equippedItem);
                    if (item) {
                        layerElement.data = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
                        layerElement.style.display = 'block';
                    } else {
                        layerElement.style.display = 'none';
                    }
                } else {
                    layerElement.style.display = 'none';
                }
            }
        }
    }

    function buyItem(itemId) {
        // ... (keep existing buyItem function unchanged)
    }

    function resetAvatarDisplay() {
        triedOnItems = {};
        const equippedItems = JSON.parse(localStorage.getItem('equippedItems') || '{}');
        Object.keys(equippedItems).forEach(type => {
            updateAvatarDisplay(type, null);
        });
        updateItemImages();
    }

    // Expose necessary functions to the global scope
    window.shopManager = {
        toggleTryOn,
        buyItem,
        renderShopItems,
        resetAvatarDisplay
    };

    // Initialize the shop
    renderShopItems();
});
