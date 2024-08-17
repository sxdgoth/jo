document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        document.getElementById('user-name').textContent = loggedInUser.username;
        updateUserCoins(loggedInUser.coins);
        window.createUserInventory(loggedInUser.username);
        // Call shopManager to render items after user is verified
        if (window.shopManager && typeof window.shopManager.renderShopItems === 'function') {
            window.shopManager.renderShopItems();
        }
    } else {
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
    }
}

// Expose the function to the global scope
window.updateUserCoinsAfterPurchase = updateUserCoinsAfterPurchase;
