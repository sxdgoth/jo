class Inventory {
    constructor(username) {
        this.username = username;
        this.items = [];
        this.loadInventory();
    }

    loadInventory() {
        const savedInventory = localStorage.getItem(`inventory_${this.username}`);
        if (savedInventory) {
            this.items = JSON.parse(savedInventory);
        }
    }

    saveInventory() {
        localStorage.setItem(`inventory_${this.username}`, JSON.stringify(this.items));
    }

    addItem(item) {
        this.items.push(item);
        this.saveInventory();
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveInventory();
    }

    getItems() {
        return this.items;
    }
}

// Initialize the inventory when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        window.userInventory = new Inventory(loggedInUser.username);
    } else {
        console.error('No logged in user found');
    }
});
