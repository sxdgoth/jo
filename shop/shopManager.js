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
            <p>${item.price} coins</p>
            <button class="buy-btn" data-id="${item.id}">Buy</button>
        `;
        shopItemsContainer.appendChild(itemElement);
        // Update buy button state
        const buyButton = itemElement.querySelector('.buy-btn');
        updateBuyButtonState(buyButton, item.id);

        // Apply item positioning
        const imgElement = itemElement.querySelector('.item-image img');
        if (window.applyItemPosition) {
            window.applyItemPosition(imgElement, item.type.toLowerCase());
        }
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

    function updateBuyButtonState(button, itemId) {
    if (window.userInventory && window.userInventory.hasItem(itemId)) {
        button.textContent = 'Owned';
        button.disabled = true;
        button.classList.add('owned');
    }
}
    
function toggleTryOn(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (item) {
        console.log(`Toggling item: ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        
        // Remove highlight from all items of the same type
        document.querySelectorAll(`.shop-item .item-image[data-id]`).forEach(el => {
            const itemType = shopItems.find(i => i.id === el.dataset.id).type;
            if (itemType === item.type) {
                el.closest('.shop-item').classList.remove('highlighted');
            }
        });
        
        // Add highlight to the clicked item
        const clickedItem = document.querySelector(`.shop-item .item-image[data-id="${itemId}"]`).closest('.shop-item');
        
        window.avatarDisplay.updateEquippedItems(); // Update equipped items from localStorage
        if (window.avatarDisplay.triedOnItems[item.type] === item) {
            // Item is being tried on, so remove it
            window.avatarDisplay.removeTriedOnItem(item.type);
            console.log(`Removed ${item.name}`);
            // Remove highlight when item is removed
            clickedItem.classList.remove('highlighted');
        } else {
            // Try on the new item
            window.avatarDisplay.tryOnItem(item);
            console.log(`Tried on ${item.name}`);
            clickedItem.classList.add('highlighted');
        }
        
        updateItemImages();
    }
}
function updateItemImages() {
    document.querySelectorAll('.shop-item').forEach(shopItem => {
        const image = shopItem.querySelector('.item-image');
        const itemId = image.dataset.id;
        const item = shopItems.find(i => i.id === itemId);
        if (window.avatarDisplay.triedOnItems[item.type] === item) {
            shopItem.classList.add('highlighted');
        } else if (window.avatarDisplay.isItemEquipped(item) && !window.avatarDisplay.hiddenEquippedItems.has(item.type)) {
            shopItem.classList.add('highlighted');
        } else {
            shopItem.classList.remove('highlighted');
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
    const currentCoins = UserManager.getUserCoins();
    if (currentCoins < item.price) {
        alert('Not enough coins to buy this item!');
        return;
    }
    // Deduct coins from user
    const newCoins = currentCoins - item.price;
    if (UserManager.updateUserCoins(newCoins)) {
        // Add item to user's inventory
        if (window.userInventory) {
            window.userInventory.addItem(item);
        }
        // Update user's coins display
        updateUserCoinsAfterPurchase(newCoins);
        // Update buy button state immediately
        const buyButton = document.querySelector(`.buy-btn[data-id="${itemId}"]`);
        if (buyButton) {
            updateBuyButtonState(buyButton, itemId);
        }
        // Update item image state
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

let currentCategory = 'All';

function filterItemsByCategory(category) {
    currentCategory = category;
    renderShopItems();
}

function renderShopItems() {
    shopItemsContainer.innerHTML = ''; // Clear existing items
    const filteredItems = currentCategory === 'All' 
        ? shopItems 
        : shopItems.filter(item => item.type === currentCategory);

    filteredItems.forEach(item => {
        // ... (rest of your existing renderShopItems code)
    });

    // Update category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === currentCategory);
    });
}

// Add this to your existing DOMContentLoaded event listener
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => filterItemsByCategory(btn.dataset.category));
});
