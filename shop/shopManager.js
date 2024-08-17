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

    function buyItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (item) {
        if (window.userInventory.hasItem(itemId)) {
            alert("You already own this item!");
            return;
        }

        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            alert("User not logged in!");
            return;
        }

        const userCoins = loggedInUser.coins;
        if (userCoins >= item.price) {
            const newCoins = userCoins - item.price;
            
            loggedInUser.coins = newCoins;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            localStorage.setItem(loggedInUser.username, JSON.stringify(loggedInUser));

            if (typeof window.updateUserCoinsAfterPurchase === 'function') {
                window.updateUserCoinsAfterPurchase(newCoins);
            } else {
                console.warn('updateUserCoinsAfterPurchase function not found in shop.js');
                document.getElementById('user-coins').textContent = newCoins.toLocaleString();
            }
            
            onItemPurchased(item);
            
            console.log(`Bought item: ${item.name}`);
            alert(`You bought ${item.name} for ${item.price} coins!`);
        } else {
            alert("Not enough coins!");
        }
    }
}

    function updateAvatarDisplay(type, src) {
        if (window.avatarBody && typeof window.avatarBody.updateLayer === 'function') {
            window.avatarBody.updateLayer(type, src);
        } else {
            console.warn('avatarBody.updateLayer function not found. Make sure avatarTemplate.js is loaded and contains this function.');
        }
    }

    // Expose necessary functions to the global scope
    window.shopManager = {
        toggleTryOn,
        buyItem,
        renderShopItems
    };

    // Initialize the shop
    renderShopItems();
});
