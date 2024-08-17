// File: inventory.js

class Inventory {
    constructor() {
        this.items = this.loadInventory();
    }

    loadInventory() {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        return loggedInUser && loggedInUser.inventory ? loggedInUser.inventory : [];
    }

    saveInventory() {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            loggedInUser.inventory = this.items;
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        }
    }

    addItem(item) {
        if (!this.items.some(i => i.id === item.id)) {
            this.items.push(item);
            this.saveInventory();
        }
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveInventory();
    }

    hasItem(itemId) {
        return this.items.some(item => item.id === itemId);
    }
}

const inventory = new Inventory();
