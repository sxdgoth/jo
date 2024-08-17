document.addEventListener('DOMContentLoaded', () => {
    const shopItemsContainer = document.querySelector('.shop-items');
    let selectedItems = [];

    function renderShopItems() {
        shopItemsContainer.innerHTML = ''; // Clear existing items
        shopItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('shop-item');
            const imgSrc = `${item.path}${item.id}`;
            itemElement.innerHTML = `
                <img src="${imgSrc}" alt="${item.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/150'; console.error('Failed to load image: ${imgSrc}');">
                <h3>${item.name}</h3>
                <p>Type: ${item.type}</p>
                <p>Price: ${item.price} coins</p>
                <button class="buy-btn" data-id="${item.id}">Buy</button>
            `;
            shopItemsContainer.appendChild(itemElement);
        });

        // Add event listeners to buy buttons
        document.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', (e) => buyItem(e.target.dataset.id));
        });
    }

    function buyItem(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (item) {
            // Get the logged-in user from sessionStorage
            const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                alert("User not logged in!");
                return;
            }

            // Use the actual coin value from the user object
            const userCoins = loggedInUser.coins;

            if (userCoins >= item.price) {
                // Deduct coins and update display
                const newCoins = userCoins - item.price;
                
                // Update the user object in sessionStorage
                loggedInUser.coins = newCoins;
                sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                // Update the displayed coins
                if (typeof window.updateUserCoinsAfterPurchase === 'function') {
                    window.updateUserCoinsAfterPurchase(newCoins);
                } else {
                    console.warn('updateUserCoinsAfterPurchase function not found in shop.js');
                    document.getElementById('user-coins').textContent = newCoins.toLocaleString();
                }
                
                // Add item to selected items
                selectedItems.push(item);
                
                // Update avatar display
                updateAvatarDisplay(item);
                
                console.log(`Bought item: ${item.name}`);
                alert(`You bought ${item.name} for ${item.price} coins!`);
            } else {
                alert("Not enough coins!");
            }
        }
    }

    function updateAvatarDisplay(item) {
        if (window.avatarBody && typeof window.avatarBody.updateLayer === 'function') {
            window.avatarBody.updateLayer(item.type, `${item.path}${item.id}`);
        } else {
            console.warn('avatarBody.updateLayer function not found. Make sure avatarTemplate.js is loaded and contains this function.');
        }
    }

    function getSelectedItems() {
        return selectedItems;
    }

    function clearSelectedItems() {
        selectedItems = [];
    }

    // Expose necessary functions to the global scope
    window.shopManager = {
        buyItem,
        getSelectedItems,
        clearSelectedItems,
        renderShopItems
    };

    // Initialize the shop
    renderShopItems();
});
