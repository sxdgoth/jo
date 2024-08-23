// shopManager.js

document.addEventListener('DOMContentLoaded', () => {
    const shopItemsContainer = document.querySelector('.shop-items');
    let currentCategory = 'All';
    let selectedItems = {};

    function renderShopItems() {
        shopItemsContainer.innerHTML = '';

        const filteredItems = currentCategory === 'All' 
            ? shopItems 
            : shopItems.filter(item => item.type === currentCategory);

        filteredItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('shop-item');
            const imgSrc = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
            itemElement.innerHTML = `
                <div class="item-image" data-id="${item.id}">
                    <img src="${imgSrc}" alt="${item.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/150'; console.error('Failed to load image: ${imgSrc}');">
                </div>
                <h3>${item.name}</h3>
                <p>${item.price} coins</p>
                <button class="buy-btn" data-id="${item.id}">Buy</button>
            `;
            shopItemsContainer.appendChild(itemElement);

            const buyButton = itemElement.querySelector('.buy-btn');
            updateBuyButtonState(buyButton, item.id);

            const imgElement = itemElement.querySelector('.item-image img');
            if (window.applyItemPosition) {
                window.applyItemPosition(imgElement, item.type.toLowerCase());
            }
        });
        updateCategoryButtons();
        updateItemImages();
    }

    function updateBuyButtonState(button, itemId) {
        if (window.userInventory && window.userInventory.hasItem(itemId)) {
            button.textContent = 'Owned';
            button.disabled = true;
            button.classList.add('owned');
        }
    }

    function selectItem(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (item && window.avatarDisplay) {
            // Remove previously selected item of the same type, if any
            if (selectedItems[item.type]) {
                window.avatarDisplay.removeItem(item.type);
            }
            // Select the new item
            console.log(`Applying item: ${item.name} (ID: ${item.id}, Type: ${item.type})`);
            window.avatarDisplay.tryOnItem(item);
            selectedItems[item.type] = itemId;
            updateItemImages();
        }
    }

    function toggleTryOn(itemId) {
        console.log('toggleTryOn called with itemId:', itemId);
        const item = shopItems.find(i => i.id === itemId);
        if (item && window.avatarDisplay) {
            if (selectedItems[item.type] === itemId) {
                // Unselect the item
                console.log(`Unselecting item: ${item.name} (ID: ${item.id}, Type: ${item.type})`);
                window.avatarDisplay.removeItem(item.type);
                delete selectedItems[item.type];
            } else {
                // Select the new item
                selectItem(itemId);
            }
            updateItemImages();
        } else {
            console.error('Item not found or avatarDisplay is not defined');
        }
    }

    function updateItemImages() {
        document.querySelectorAll('.shop-item').forEach(shopItem => {
            const image = shopItem.querySelector('.item-image');
            const itemId = image.dataset.id;
            const item = shopItems.find(i => i.id === itemId);
            
            if (selectedItems[item.type] === item.id) {
                shopItem.classList.add('highlighted');
            } else {
                shopItem.classList.remove('highlighted');
            }
        });
    }

    function buyItem(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (!item) {
            console.error('Item not found');
            return;
        }
        const currentCoins = UserManager.getUserCoins();
        if (currentCoins < item.price) {
            alert('Not enough coins to buy this item!');
            return;
        }
        const newCoins = currentCoins - item.price;
        if (UserManager.updateUserCoins(newCoins)) {
            if (window.userInventory) {
                window.userInventory.addItem(item);
            }
            updateUserCoinsDisplay(newCoins);
            const buyButton = document.querySelector(`.buy-btn[data-id="${itemId}"]`);
            if (buyButton) {
                updateBuyButtonState(buyButton, itemId);
            }
            const itemImage = document.querySelector(`.item-image[data-id="${itemId}"]`);
            if (itemImage) {
                itemImage.classList.add('equipped');
                itemImage.classList.remove('selected');
            }
            alert(`You have successfully purchased ${item.name}!`);
        } else {
            alert('Error updating user coins. Please try again.');
        }
    }

    function resetAvatarDisplay() {
        if (window.avatarDisplay) {
            window.avatarDisplay.resetTriedOnItems();
            selectedItems = {};
            updateItemImages();
        }
    }

    function filterItemsByCategory(category) {
        currentCategory = category;
        renderShopItems();
    }

    function updateCategoryButtons() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === currentCategory);
        });
    }

    function updateUserCoinsDisplay(newCoins) {
        const coinsDisplay = document.getElementById('user-coins');
        if (coinsDisplay) {
            coinsDisplay.textContent = newCoins;
        }
    }

    // Event delegation for item clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('.item-image')) {
            const itemId = e.target.closest('.item-image').dataset.id;
            console.log('Item clicked:', itemId);
            toggleTryOn(itemId);
        } else if (e.target.classList.contains('buy-btn')) {
            const itemId = e.target.dataset.id;
            buyItem(itemId);
        } else if (e.target.classList.contains('category-btn')) {
            const category = e.target.dataset.category;
            filterItemsByCategory(category);
        }
    });

    window.shopManager = {
        toggleTryOn,
        buyItem,
        renderShopItems,
        resetAvatarDisplay,
        filterItemsByCategory
    };

    // Initialize the shop
    renderShopItems();
});
