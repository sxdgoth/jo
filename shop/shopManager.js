// shopManager.js

document.addEventListener('DOMContentLoaded', () => {
    const shopItemsContainer = document.querySelector('.shop-items');
    let triedOnItems = {};

    function renderShopItems() {
        shopItemsContainer.innerHTML = ''; // Clear existing items
        shopItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('shop-item');
            const imgSrc = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
            itemElement.innerHTML = `
                <div class="item-image" data-id="${item.id}">
                    <img src="${imgSrc}" alt="${item.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/150'; console.error('Failed to load image: ${imgSrc}');">
                </div>
                <h3>${item.name}</h3>
                <p>Type: ${item.type}</p>
                <p>Price: ${item.price} coins</p>
                <button class="buy-btn" data-id="${item.id}">Buy</button>
            `;
            shopItemsContainer.appendChild(itemElement);
        });

        // Add event listeners to item images for try on/off
        document.querySelectorAll('.item-image').forEach(image => {
            image.addEventListener('click', (e) => toggleTryOn(e.currentTarget.dataset.id));
        });

        // Add event listeners to buy buttons
        document.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', (e) => buyItem(e.target.dataset.id));
        });

        // Initialize inventory state
        initializeInventoryState();

        // Initialize avatar display
        initializeAvatarDisplay();
    }

    function initializeAvatarDisplay() {
        const avatarDisplay = new AvatarDisplay('avatar-display');
        avatarDisplay.loadAvatar();
    }

    function toggleTryOn(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (item) {
            if (triedOnItems[item.type] === item) {
                // Item is already tried on, so remove it
                delete triedOnItems[item.type];
                updateAvatarDisplay(item.type, null);
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
        document.querySelectorAll('.item-image').forEach(image => {
            const itemId = image.dataset.id;
            const item = shopItems.find(i => i.id === itemId);
            if (triedOnItems[item.type] === item) {
                image.classList.add('tried-on');
            } else {
                image.classList.remove('tried-on');
            }
        });
    }

    function updateAvatarDisplay(type, src) {
        const avatarDisplay = new AvatarDisplay('avatar-display');
        avatarDisplay.updateLayer(type, src);
    }

    function buyItem(itemId) {
        // ... (keep existing buyItem function unchanged)
    }

    function resetAvatarDisplay() {
        triedOnItems = {};
        const avatarDisplay = new AvatarDisplay('avatar-display');
        avatarDisplay.loadAvatar();
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
