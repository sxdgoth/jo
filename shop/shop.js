// shop.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");

    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    console.log("Logged in user:", loggedInUser);

    if (loggedInUser) {
        document.getElementById('user-name').textContent = loggedInUser.username;
        updateUserCoins(loggedInUser.coins);
        window.createUserInventory(loggedInUser.username);

        // Initialize ShopAvatarDisplay
        console.log('Initializing ShopAvatarDisplay');
        window.shopAvatarDisplay = new ShopAvatarDisplay('avatar-display', loggedInUser.username);
        window.shopAvatarDisplay.loadAvatar();

        // Initialize ShopManager
        console.log("Initializing ShopManager");
        window.shopManager = new ShopManager(shopItems);
        window.shopManager.renderShopItems();
        
     
   } else {
        console.error("No logged in user found");
        window.location.href = '../index.html';
    }
});

function updateUserCoins(coins) {
    document.getElementById('user-coins').textContent = coins.toLocaleString();
}

function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = '../index.html';
}

function updateUserCoinsAfterPurchase(newCoins) {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        loggedInUser.coins = newCoins;
        sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        updateUserCoins(newCoins);
        // Update the user's coins in localStorage as well
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.map(user => 
            user.username === loggedInUser.username ? {...user, coins: newCoins} : user
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
}

function addResetButton() {
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Tried-On Items';
    resetButton.addEventListener('click', () => {
        if (window.shopManager) {
            window.shopManager.resetAvatarDisplay();
        }
    });
    document.querySelector('.shop-container').prepend(resetButton);
}

function addCategoryListeners() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to clicked button
            this.classList.add('active');

            const category = this.dataset.category;
            if (window.shopManager) {
                window.shopManager.filterItemsByCategory(category);
            }
        });
    });
}

// Function to handle item purchase
function buyItem(itemId) {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const item = shopItems.find(i => i.id === itemId);

    if (loggedInUser && item) {
        if (loggedInUser.coins >= item.price) {
            // Deduct coins
            const newCoins = loggedInUser.coins - item.price;
            updateUserCoinsAfterPurchase(newCoins);

            // Add item to user's inventory
            if (window.userInventory) {
                window.userInventory.addItem(item);
                console.log(`Item ${item.name} added to inventory`);
            }

            // Update the shop display
            if (window.shopManager) {
                window.shopManager.renderShopItems();
            }

            console.log(`Item ${item.name} purchased successfully!`);
        } else {
            console.log("Not enough coins to purchase this item.");
            alert("Not enough coins to purchase this item.");
        }
    }
}

// Expose necessary functions to the global scope
window.updateUserCoinsAfterPurchase = updateUserCoinsAfterPurchase;
window.buyItem = buyItem;
