document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        document.getElementById('user-name').textContent = loggedInUser.username;
        updateUserCoins(loggedInUser.coins);
        window.createUserInventory(loggedInUser.username);
        
        // Initialize AvatarDisplay
        window.avatarDisplay = new AvatarDisplay('avatar-display');
        window.avatarDisplay.loadAvatar();
        
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

function createUserInventory(username) {
    window.userInventory = {
        username: username,
        items: [],
        addItem: function(item) {
            this.items.push(item);
            this.saveInventory();
        },
        removeItem: function(itemId) {
            this.items = this.items.filter(item => item.id !== itemId);
            this.saveInventory();
        },
        hasItem: function(itemId) {
            return this.items.some(item => item.id === itemId);
        },
        getItems: function() {
            return this.items;
        },
        saveInventory: function() {
            localStorage.setItem(`inventory_${this.username}`, JSON.stringify(this.items));
        },
        loadInventory: function() {
            const savedInventory = localStorage.getItem(`inventory_${this.username}`);
            if (savedInventory) {
                this.items = JSON.parse(savedInventory);
            }
        }
    };
    window.userInventory.loadInventory();
}

// Function to handle item purchase
function onItemPurchased(item) {
    window.userInventory.addItem(item);
    console.log(`Item added to inventory: ${item.name}`);
}

// Expose necessary functions to the global scope
window.updateUserCoinsAfterPurchase = updateUserCoinsAfterPurchase;
window.createUserInventory = createUserInventory;
window.onItemPurchased = onItemPurchased;
