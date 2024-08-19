document.addEventListener('DOMContentLoaded', () => {
    const shopItemsContainer = document.querySelector('.shop-items');
    let currentCategory = 'All';

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

      document.querySelectorAll('.item-image').forEach(image => {
            image.addEventListener('click', (e) => {
                console.log('Item clicked:', e.currentTarget.dataset.id);
                toggleTryOn(e.currentTarget.dataset.id);
            });
        });
        
        document.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', (e) => buyItem(e.target.dataset.id));
        });

        initializeInventoryState();

        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === currentCategory);
        });
    }

    function updateBuyButtonState(button, itemId) {
        if (window.userInventory && window.userInventory.hasItem(itemId)) {
            button.textContent = 'Owned';
            button.disabled = true;
            button.classList.add('owned');
        }
    }

    function toggleTryOn(itemId) {
    console.log('toggleTryOn called with itemId:', itemId);
    const item = shopItems.find(i => i.id === itemId);
    if (item) {
        console.log(`Toggling item: ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        
        if (window.avatarDisplay) {
            window.avatarDisplay.tryOnItem(item);
        } else {
            console.error('window.avatarDisplay is not defined');
        }
        
        updateItemImages();
    } else {
        console.error('Item not found for id:', itemId);
    }
}

  function updateItemImages() {
        document.querySelectorAll('.shop-item').forEach(shopItem => {
            const image = shopItem.querySelector('.item-image');
            const itemId = image.dataset.id;
            const item = shopItems.find(i => i.id === itemId);
            
            if (window.avatarDisplay.currentItems[item.type] && window.avatarDisplay.currentItems[item.type].id === item.id) {
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
            updateUserCoinsAfterPurchase(newCoins);
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
        window.avatarDisplay.resetTriedOnItems();
        updateItemImages();
    }

    function filterItemsByCategory(category) {
        currentCategory = category;
        renderShopItems();
    }

    window.shopManager = {
        toggleTryOn,
        buyItem,
        renderShopItems,
        resetAvatarDisplay,
        filterItemsByCategory
    };

    renderShopItems();

     document.querySelectorAll('.item-image').forEach(image => {
        image.addEventListener('click', (e) => {
            console.log('Item clicked:', e.currentTarget.dataset.id);
            if (e.currentTarget.dataset.id) {
                toggleTryOn(e.currentTarget.dataset.id);
            } else {
                console.error('No data-id found on clicked element');
            }
        });
    });
