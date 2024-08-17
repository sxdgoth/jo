document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        document.getElementById('user-name').textContent = loggedInUser.username;
        updateUserCoins(loggedInUser.coins);
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
    localStorage.removeItem('loggedInUser');
    window.location.href = '../index.html';
}

function updateUserCoinsAfterPurchase(newCoins) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        loggedInUser.coins = newCoins;
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        localStorage.setItem(loggedInUser.username, JSON.stringify(loggedInUser));
        updateUserCoins(newCoins);
    }
}

window.updateUserCoinsAfterPurchase = updateUserCoinsAfterPurchase;
