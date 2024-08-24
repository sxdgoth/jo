document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing shop');
    const shopItemsContainer = document.querySelector('.shop-items');
    console.log('Shop items container:', shopItemsContainer);
    let currentCategory = 'All';
    let selectedItems = {};

    function renderShopItems() {
        console.log('Rendering shop items. Current category:', currentCategory);
        console.log('Total shop items:', shopItems.length);
        shopItemsContainer.innerHTML = '';
        const filteredItems = currentCategory === 'All' 
            ? shopItems 
            : shopItems.filter(item => item.type === currentCategory);
        console.log('Filtered items:', filteredItems.length);
        filteredItems.forEach(item => {
            console.log('Rendering item:', item.name);
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
        updateSelectedItems();
    }

    function updateBuyButtonState(button, itemId) {
        if (window.userInventory && window.userInventory.hasItem(itemId)) {
            button.textContent = 'Owned';
            button.disabled = true;
            button.classList.add('owned');
        }
    }

  function toggleItem(itemId) {
    console.log('toggleItem called with itemId:', itemId);
    const item = shopItems.find(i => i.id === itemId);
    if (item) {
        console.log(`Toggling item: ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        if (window.avatarDisplay && typeof window.avatarDisplay.tryOnItem === 'function') {
            console.log('Calling avatarDisplay.tryOnItem');
            window.avatarDisplay.tryOnItem(item);
        } else {
            console.error('avatarDisplay not found or tryOnItem is not a function');
        }
        updateSelectedItems();
    } else {
        console.error('Item not found for id:', itemId);
    }
}

 function updateSelectedItems() {
    console.log('Updating selected items');
    document.querySelectorAll('.shop-item').forEach(shopItem => {
        const image = shopItem.querySelector('.item-image');
        const itemId = image.dataset.id;
        const item = shopItems.find(i => i.id === itemId);
        
        if (window.avatarDisplay.currentItems[item.type]?.id === itemId) {
            console.log(`Adding 'selected' class to item: ${itemId}`);
            shopItem.classList.add('selected');
        } else {
            console.log(`Removing 'selected' class from item: ${itemId}`);
            shopItem.classList.remove('selected');
        }
    });
}
      
    function buyItem(itemId) {
        console.log('Attempting to buy item:', itemId);
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
        console.log('Resetting avatar display');
        selectedItems = {};
        if (window.avatarDisplay) {
            window.avatarDisplay.resetTriedOnItems();
        }
        updateSelectedItems();
    }

    function filterItemsByCategory(category) {
        console.log('Filtering items by category:', category);
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
        console.log('Click event triggered on:', e.target);
        if (e.target.closest('.item-image')) {
            const itemImage = e.target.closest('.item-image');
            const itemId = itemImage.dataset.id;
            console.log('ShopManager: Item clicked:', itemId);
            toggleItem(itemId);
        } else if (e.target.classList.contains('buy-btn')) {
            const itemId = e.target.dataset.id;
            console.log('ShopManager: Buy button clicked:', itemId);
            buyItem(itemId);
        } else if (e.target.classList.contains('category-btn')) {
            const category = e.target.dataset.category;
            console.log('ShopManager: Category button clicked:', category);
            filterItemsByCategory(category);
        }
    });

    window.shopManager = {
        toggleItem,
        buyItem,
        renderShopItems,
        resetAvatarDisplay,
        filterItemsByCategory
    };

    // Initialize the shop
    renderShopItems();

    // Log avatarDisplay for debugging
    console.log('avatarDisplay:', window.avatarDisplay);
});
