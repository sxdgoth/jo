// inventory.js

// Initialize the inventory system
function initializeInventorySystem() {
    if (!window.userInventory) {
        window.userInventory = {
            addToInventory,
            removeFromInventory,
            getInventory,
            hasItem,
            updateInventoryDisplay
        };
    }
}

// Add an item to the user's inventory
function addToInventory(item) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        if (!loggedInUser.inventory) {
            loggedInUser.inventory = [];
        }
        loggedInUser.inventory.push(item);
        updateUserData(loggedInUser);
        updateInventoryDisplay();
    }
}

// Remove an item from the user's inventory
function removeFromInventory(itemId) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.inventory) {
        loggedInUser.inventory = loggedInUser.inventory.filter(item => item.id !== itemId);
        updateUserData(loggedInUser);
        updateInventoryDisplay();
    }
}

// Get the user's inventory
function getInventory() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    return loggedInUser ? loggedInUser.inventory || [] : [];
}

// Check if the user has a specific item
function hasItem(itemId) {
    const inventory = getInventory();
    return inventory.some(item => item.id === itemId);
}

function addToInventory(item) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        if (!loggedInUser.inventory) {
            loggedInUser.inventory = [];
        }
        loggedInUser.inventory.push(item);
        updateUserData(loggedInUser);
        updateInventoryDisplay();
        
        // Update the shop display after adding an item
        if (typeof window.shopManager.updateShopDisplay === 'function') {
            window.shopManager.updateShopDisplay();
        }
    }
}

// Function to handle item purchase
function onItemPurchased(item) {
    addToInventory(item);
    console.log(`Added ${item.name} to inventory`);
}

// Helper function to update user data in localStorage
function updateUserData(userData) {
    localStorage.setItem('loggedInUser', JSON.stringify(userData));
    localStorage.setItem(userData.username, JSON.stringify(userData));
}

// Initialize the inventory system when the script loads
initializeInventorySystem();

// Update inventory display when the page loads
document.addEventListener('DOMContentLoaded', updateInventoryDisplay);

// Expose necessary functions to the global scope
window.onItemPurchased = onItemPurchased;
