// avatarManager.js

document.addEventListener('DOMContentLoaded', function() {
    const avatarDisplay = document.getElementById('avatar-display');
    const shopItems = document.querySelector('.shop-items');
    const equippedItems = new Set();

    // Function to load and display the avatar
    function loadAvatar() {
        avatarDisplay.innerHTML = '';
        
        // Always load the body first
        const bodyItem = avatarConfig.wearableItems.find(item => item.type === 'body');
        if (bodyItem) {
            addItemToAvatar(bodyItem.id);
        }

        // Then load other equipped items
        equippedItems.forEach(itemId => {
            if (itemId !== bodyItem.id) {
                addItemToAvatar(itemId);
            }
        });
    }

    // Function to add an item to the avatar display
    function addItemToAvatar(itemId) {
        const img = document.createElement('img');
        img.src = avatarConfig.baseUrl + itemId;
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        avatarDisplay.appendChild(img);
    }

    // Function to create shop items
    function createShopItems() {
        avatarConfig.wearableItems.forEach(item => {
            const button = document.createElement('button');
            button.textContent = `${item.name} ($${item.price})`;
            button.classList.add('item-button');
            button.onclick = () => toggleItem(item);
            shopItems.appendChild(button);
        });
    }

    // Function to toggle item equip/unequip
    function toggleItem(item) {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        
        if (equippedItems.has(item.id)) {
            equippedItems.delete(item.id);
            loggedInUser.coins += item.price;
        } else {
            if (loggedInUser.coins >= item.price) {
                equippedItems.add(item.id);
                loggedInUser.coins -= item.price;
            } else {
                alert('Not enough coins!');
                return;
            }
        }

        sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        document.getElementById('user-coins').textContent = loggedInUser.coins.toLocaleString();
        
        loadAvatar();
    }

    // Initialize
    createShopItems();
    loadAvatar();
});
