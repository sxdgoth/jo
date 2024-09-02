document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        initializeUserInfo(loggedInUser);
        window.createUserInventory(loggedInUser.username);
        
        // Initialize AvatarManager
        window.avatarManager = new AvatarManager();
        window.avatarManager.initialize();
        
        // Call shopManager to render items after user is verified
        if (window.shopManager && typeof window.shopManager.renderShopItems === 'function') {
            window.shopManager.renderShopItems();
        }

        // Add reset button for tried-on items
        addResetButton();
    } else {
        window.location.href = '../index.html';
    }
});

function updateUserCoins(coins) {
    const coinsValueElement = document.getElementById('coins-value');
    if (coinsValueElement) {
        coinsValueElement.textContent = coins.toLocaleString();
    } else {
        console.error('Coins value element not found');
    }
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

function initializeUserInfo(user) {
    document.getElementById('user-name').textContent = user.username;
    const coinsValueElement = document.getElementById('coins-value');
    if (coinsValueElement) {
        coinsValueElement.textContent = user.coins.toLocaleString();
    } else {
        console.error('Coins value element not found');
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
