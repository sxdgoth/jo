// shopInteraction.js

const shopItemsContainer = document.getElementById('shop-items');
let currentItems = {};

function createShopItem(item) {
    const shopItem = document.createElement('div');
    shopItem.className = 'shop-item';
    shopItem.innerHTML = `
        <img src="https://sxdgoth.github.io/jo/${item.path}${item.id}" alt="${item.name}">
        <p>${item.name}</p>
        <p>Price: $${item.price}</p>
    `;
    shopItem.addEventListener('click', () => toggleItem(item, shopItem));
    return shopItem;
}

function toggleItem(item, shopItemElement) {
    if (window.avatarDisplay) {
        if (currentItems[item.type] && currentItems[item.type].id === item.id) {
            // If the item is already selected, remove it
            window.avatarDisplay.updateAvatarDisplay(item.type, '');
            delete currentItems[item.type];
            shopItemElement.classList.remove('selected');
        } else {
            // If a different item of the same type is already selected, remove it first
            if (currentItems[item.type]) {
                const oldItem = currentItems[item.type];
                const oldShopItem = findShopItemElement(oldItem);
                if (oldShopItem) {
                    oldShopItem.classList.remove('selected');
                }
            }
            
            // Add the new item
            window.avatarDisplay.updateAvatarDisplay(item.type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
            currentItems[item.type] = item;
            shopItemElement.classList.add('selected');
        }
        updateShopItemSelection();
    } else {
        console.error('avatarDisplay not found');
    }
}

function findShopItemElement(item) {
    return Array.from(shopItemsContainer.querySelectorAll('.shop-item')).find(shopItem => {
        const itemName = shopItem.querySelector('p').textContent;
        return itemName === item.name;
    });
}

function updateShopItemSelection() {
    shopItemsContainer.querySelectorAll('.shop-item').forEach(shopItem => {
        const itemName = shopItem.querySelector('p').textContent;
        const item = shopItems.find(i => i.name === itemName);
        if (currentItems[item.type] && currentItems[item.type].id === item.id) {
            shopItem.classList.add('selected');
        } else {
            shopItem.classList.remove('selected');
        }
    });
}

// Initialize shop items
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing shop items');
    shopItems.forEach(item => {
        const shopItem = createShopItem(item);
        shopItemsContainer.appendChild(shopItem);
    });
});
