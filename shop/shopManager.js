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
                <button class="try-on-btn" data-id="${item.id}">Try On</button>
                <button class="buy-btn" data-id="${item.id}">Buy</button>
            `;
            shopItemsContainer.appendChild(itemElement);
        });

        // Add event listeners to try-on buttons
        document.querySelectorAll('.try-on-btn').forEach(button => {
            button.addEventListener('click', (e) => toggleTryOn(e.target.dataset.id));
        });

        // Add event listeners to buy buttons
        document.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', (e) => buyItem(e.target.dataset.id));
        });

        // Initialize inventory state
        initializeInventoryState();
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
            updateTryOnButtons();
        }
    }

    function updateTryOnButtons() {
        document.querySelectorAll('.try-on-btn').forEach(button => {
            const itemId = button.dataset.id;
            const item = shopItems.find(i => i.id === itemId);
            if (triedOnItems[item.type] === item) {
                button.textContent = 'Remove';
            } else {
                button.textContent = 'Try On';
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
        updateTryOnButtons();
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
