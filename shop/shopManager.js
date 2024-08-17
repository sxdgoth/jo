// shopManager.js

class ShopManager {
    constructor(items) {
        this.items = items;
        this.equippedItems = new Set();
        this.layerOrder = ['Legs', 'Arms', 'Body', 'Jacket', 'Head'];
    }

    initShop() {
        const shopItemsContainer = document.querySelector('.shop-items');
        this.items.forEach(item => {
            const button = document.createElement('button');
            button.textContent = `${item.name} ($${item.price})`;
            button.classList.add('item-button');
            button.addEventListener('click', () => this.toggleItem(item));
            shopItemsContainer.appendChild(button);
        });
    }

    toggleItem(item) {
        console.log(`Toggling item: ${item.name}`); // Debug log
        if (this.equippedItems.has(item.id)) {
            this.unequipItem(item);
        } else {
            this.equipItem(item);
        }
        this.updateUserCoins(item);
        this.reorderLayers();
    }

       equipItem(item) {
        console.log(`Equipping item: ${item.name}`); // Debug log
        const avatarDisplay = document.getElementById('avatar-display');
        const img = document.createElement('img');
        img.src = `https://sxdgoth.github.io/jo/${item.path}${item.id}`; // Update this line
        img.alt = item.name;
        img.dataset.id = item.id;
        img.dataset.type = item.type;
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        avatarDisplay.appendChild(img);
        this.equippedItems.add(item.id);
    }

    unequipItem(item) {
        console.log(`Unequipping item: ${item.name}`); // Debug log
        const avatarDisplay = document.getElementById('avatar-display');
        const existingItem = avatarDisplay.querySelector(`[data-id="${item.id}"]`);
        if (existingItem) {
            existingItem.remove();
            this.equippedItems.delete(item.id);
        }
    }

    updateUserCoins(item) {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            if (this.equippedItems.has(item.id)) {
                loggedInUser.coins -= item.price;
            } else {
                loggedInUser.coins += item.price;
            }
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            document.getElementById('user-coins').textContent = loggedInUser.coins.toLocaleString();
        }
    }

    reorderLayers() {
        const avatarDisplay = document.getElementById('avatar-display');
        const items = Array.from(avatarDisplay.children);
        items.sort((a, b) => {
            const aIndex = this.layerOrder.indexOf(a.dataset.type);
            const bIndex = this.layerOrder.indexOf(b.dataset.type);
            return aIndex - bIndex;
        });
        items.forEach(item => avatarDisplay.appendChild(item));
    }
}
