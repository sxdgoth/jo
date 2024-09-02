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

function calculateTotalValue() {
    let totalValue = 0;
    Object.values(selectedItems).forEach(itemId => {
        const item = shopItems.find(i => i.id === itemId);
        if (item && !window.userInventory.hasItem(itemId)) {
            totalValue += item.price;
        }
    });
    return totalValue;
}

function updateTotalValueDisplay() {
    const totalValue = calculateTotalValue();
    const totalValueElement = document.getElementById('total-value');
    if (totalValueElement) {
        totalValueElement.textContent = totalValue.toLocaleString();
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

        // Update selectedItems
        if (selectedItems[item.type] === itemId) {
            delete selectedItems[item.type];
        } else {
            selectedItems[item.type] = itemId;
        }

        updateSelectedItems();
        updateTotalValueDisplay();
        console.log('Updated selectedItems:', selectedItems);
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
        
        if (selectedItems[item.type] === itemId) {
            console.log(`Adding 'selected' class to item: ${itemId}`);
            shopItem.classList.add('selected');
        } else {
            console.log(`Removing 'selected' class from item: ${itemId}`);
            shopItem.classList.remove('selected');
        }
    });
    updateTotalValueDisplay();
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
    updateTotalValueDisplay();
    console.log('Reset selectedItems:', selectedItems);
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
    const coinsValueElement = document.getElementById('coins-value');
    if (coinsValueElement) {
        coinsValueElement.textContent = newCoins.toLocaleString();
    } else {
        console.error('Coins value element not found');
    }
}
    
    function buySelectedItems() {
        console.log('Buying selected items');
        const selectedItemIds = Object.values(selectedItems);
        let totalCost = 0;
        let itemsToBuy = [];

        selectedItemIds.forEach(itemId => {
            const item = shopItems.find(i => i.id === itemId);
            if (item && !window.userInventory.hasItem(itemId)) {
                totalCost += item.price;
                itemsToBuy.push(item);
            }
        });

        const currentCoins = UserManager.getUserCoins();
        if (currentCoins < totalCost) {
            alert('Not enough coins to buy all selected items!');
            return;
        }

        const newCoins = currentCoins - totalCost;
        if (UserManager.updateUserCoins(newCoins)) {
            itemsToBuy.forEach(item => {
                window.userInventory.addItem(item);
                updateBuyButtonState(document.querySelector(`.buy-btn[data-id="${item.id}"]`), item.id);
            });

            updateUserCoinsDisplay(newCoins);
            alert(`You have successfully purchased ${itemsToBuy.length} item(s)!`);
            resetAvatarDisplay();
        } else {
            alert('Error updating user coins. Please try again.');
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

    // Add event listener for the new button
    const buySelectedItemsButton = document.getElementById('buy-selected-items-button');
    if (buySelectedItemsButton) {
        buySelectedItemsButton.addEventListener('click', buySelectedItems);
    }

    window.shopManager = {
        toggleItem,
        buyItem,
        renderShopItems,
        resetAvatarDisplay,
        filterItemsByCategory,
        selectedItems
    };

   // Initialize the shop
renderShopItems();
updateTotalValueDisplay(); // Add this line

// Log avatarDisplay for debugging
console.log('avatarDisplay:', window.avatarDisplay);
});
