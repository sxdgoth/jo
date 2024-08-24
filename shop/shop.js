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
        if (typeof ShopAvatarDisplay !== 'undefined') {
            console.log("Initializing ShopAvatarDisplay");
            window.shopAvatarDisplay = new ShopAvatarDisplay('avatar-display', loggedInUser.username);
            window.shopAvatarDisplay.loadAvatar();
        } else {
            console.error("ShopAvatarDisplay class is not defined");
        }

        // Initialize ShopManager
        if (typeof ShopManager !== 'undefined') {
            console.log("Initializing ShopManager");
            window.shopManager = new ShopManager();
            window.shopManager.renderShopItems();
        } else {
            console.error("ShopManager class is not defined");
        }

        // Add reset button for tried-on items
        addResetButton();
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
        if (window.shopManager && typeof window.shopManager.resetAvatarDisplay === 'function') {
            window.shopManager.resetAvatarDisplay();
        }
    });
    document.querySelector('.shop-container').prepend(resetButton);
}

// Expose the function to the global scope
window.updateUserCoinsAfterPurchase = updateUserCoinsAfterPurchase;
