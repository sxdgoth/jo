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
    }

 function toggleTryOn(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (item) {
        if (window.avatarDisplay.triedOnItems[item.type] === item) {
            // Item is being tried on, so remove it
            window.avatarDisplay.removeTriedOnItem(item.type);
            console.log(`Removed ${item.name}`);
        } else if (window.avatarDisplay.isItemEquipped(item)) {
            // Item is equipped, so remove it temporarily
            window.avatarDisplay.removeTriedOnItem(item.type);
            console.log(`Temporarily removed equipped item ${item.name}`);
        } else {
            // Try on the new item
            window.avatarDisplay.tryOnItem(item);
            console.log(`Tried on ${item.name}`);
        }
        updateItemImages();
    }
}

function updateItemImages() {
    document.querySelectorAll('.item-image').forEach(image => {
        const itemId = image.dataset.id;
        const item = shopItems.find(i => i.id === itemId);
        if (window.avatarDisplay.triedOnItems[item.type] === item) {
            image.classList.add('selected');
        } else if (window.avatarDisplay.isItemEquipped(item) && !window.avatarDisplay.triedOnItems[item.type]) {
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
        const item = shopItems.find(i => i.id === itemId);
        if (!item) {
            console.error('Item not found');
            return;
        }

        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            console.error('User not logged in');
            return;
        }

        if (loggedInUser.coins < item.price) {
            alert('Not enough coins to buy this item!');
            return;
        }

        // Deduct coins from user
        loggedInUser.coins -= item.price;
        sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        // Add item to user's inventory
        if (window.userInventory) {
            window.userInventory.addItem(item);
        }

        // Update user's coins display
        updateUserCoinsAfterPurchase(loggedInUser.coins);

        // Update buy button state
        updateBuyButtonState(itemId);

        alert(`You have successfully purchased ${item.name}!`);
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
