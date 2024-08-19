class Inventory {
    constructor(username) {
        this.username = username;
        this.items = this.loadInventory();
    }

    loadInventory() {
        const savedInventory = localStorage.getItem(`userInventory_${this.username}`);
        return savedInventory ? JSON.parse(savedInventory) : [];
    }

    saveInventory() {
        localStorage.setItem(`userInventory_${this.username}`, JSON.stringify(this.items));
    }

    addItem(item) {
        if (!this.hasItem(item.id)) {
            this.items.push(item);
            this.saveInventory();
            return true;
        }
        return false;
    }

    hasItem(itemId) {
        return this.items.some(item => item.id === itemId);
    }

    getItems() {
        return this.items;
    }
}

// Create a global inventory instance
window.createUserInventory = function(username) {
    window.userInventory = new Inventory(username);
};

// Function to update button state based on inventory
function updateBuyButtonState(button, itemId) {
    if (window.userInventory && window.userInventory.hasItem(itemId)) {
        button.textContent = 'Owned';
        button.disabled = true;
        button.classList.add('owned');
    }
}

// Function to be called when an item is successfully purchased
function onItemPurchased(item) {
    if (window.userInventory && window.userInventory.addItem(item)) {
        console.log(`Added ${item.name} to inventory`);
        // Update the button state for this item
        const buyButton = document.querySelector(`.buy-btn[data-id="${item.id}"]`);
        if (buyButton) {
            updateBuyButtonState(buyButton, item.id);
        }
    } else {
        console.log(`${item.name} is already in the inventory`);
    }
}

// Function to initialize inventory state for shop items
function initializeInventoryState() {
    if (window.userInventory) {
        document.querySelectorAll('.buy-btn').forEach(button => {
            const itemId = button.dataset.id;
            updateBuyButtonState(button, itemId);
        });
    }
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        window.createUserInventory(loggedInUser.username);
        initializeInventoryState();
    }
});
