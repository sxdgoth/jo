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
        const img = document.createElement('img');
        img.src = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
        img.alt = item.name;
        img.dataset.id = item.id;
        img.dataset.type = item.type;
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        avatarDisplay.appendChild(img);
    }

    // Remove item from avatar
    function removeItemFromAvatar(itemId) {
        const img = avatarDisplay.querySelector(`img[data-id="${itemId}"]`);
        if (img) {
            img.remove();
        }
    }

    // Initialize
    loadBaseAvatar();
    createShopItems();
    layerManager.initialize();
});
