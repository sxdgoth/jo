// avatarManager.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    const avatarBody = new AvatarBody('avatar-display');
    const shopItems = document.querySelector('.shop-items');
    const equippedItems = new Set();

    // Function to load and display the avatar
    function loadAvatar() {
        console.log("Loading avatar...");
        avatarBody.loadAvatar();

        // Load other equipped items
        equippedItems.forEach(itemId => {
            addItemToAvatar(itemId);
        });
    }

    // Function to add an item to the avatar display
    function addItemToAvatar(itemId) {
        console.log("Adding item to avatar:", itemId);
        const img = document.createElement('img');
        img.src = avatarBody.baseUrl + itemId;
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        img.onerror = () => console.error("Failed to load image:", img.src);
        avatarBody.container.appendChild(img);
    }

    // Function to create shop items
    function createShopItems() {
        console.log("Creating shop items...");
        // This function should be implemented to create shop items
        // You'll need to define the shop items elsewhere or fetch them from a server
    }

    // Function to toggle item equip/unequip
    function toggleItem(item) {
        console.log("Toggling item:", item.name);
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        
        if (equippedItems.has(item.id)) {
            equippedItems.delete(item.id);
            loggedInUser.coins += item.price;
            console.log("Item unequipped:", item.name);
        } else {
            if (loggedInUser.coins >= item.price) {
                equippedItems.add(item.id);
                loggedInUser.coins -= item.price;
                console.log("Item equipped:", item.name);
            } else {
                console.log("Not enough coins to equip:", item.name);
                alert('Not enough coins!');
                return;
            }
        }

        sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        document.getElementById('user-coins').textContent = loggedInUser.coins.toLocaleString();
        
        loadAvatar();
    }

    // Initialize
    console.log("Initializing avatar manager...");
    createShopItems();
    loadAvatar();
});
