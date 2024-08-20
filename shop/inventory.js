// inventory.js

class Inventory {
    constructor(username) {
        this.username = username;
        this.items = this.loadInventory();
        console.log(`Inventory created for ${username}:`, this.items);
    }

    loadInventory() {
        const savedInventory = localStorage.getItem(`userInventory_${this.username}`);
        console.log(`Loading inventory for ${this.username}:`, savedInventory);
        return savedInventory ? JSON.parse(savedInventory) : [];
    }

    saveInventory() {
        localStorage.setItem(`userInventory_${this.username}`, JSON.stringify(this.items));
        console.log(`Saved inventory for ${this.username}:`, this.items);
    }

    addItem(item) {
        if (!this.hasItem(item.id)) {
            this.items.push(item);
            this.saveInventory();
            console.log(`Added item to inventory:`, item);
            return true;
        }
        console.log(`Item already in inventory:`, item);
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
    console.log(`Created user inventory for ${username}`);

    // Add a test item if the inventory is empty (for debugging)
    if (window.userInventory.getItems().length === 0) {
        console.log("Adding test item to inventory");
        window.userInventory.addItem({
            id: 'test-item',
            name: 'Test Item',
            type: 'Shirt',
            price: 100,
            path: 'home/assets/shirts/'
        });
        window.userInventory.saveInventory();
    }
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
        console.log("Inventory initialized for logged-in user");
    } else {
        console.log("No logged-in user found");
    }
});

// Function to render owned items in the wardrobe
function renderOwnedItems() {
    console.log("Rendering owned items");
    const wardrobeItemsContainer = document.querySelector('.wardrobe-items');
    if (!wardrobeItemsContainer) {
        console.error("Wardrobe items container not found");
        return;
    }

    const ownedItems = window.userInventory.getItems();
    console.log("Owned items:", ownedItems);

    wardrobeItemsContainer.innerHTML = ''; // Clear existing items

    ownedItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('wardrobe-item');
        const imgSrc = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
        itemElement.innerHTML = `
            <div class="item-image" data-id="${item.id}">
                <img src="${imgSrc}" alt="${item.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/150'; console.error('Failed to load image: ${imgSrc}');">
            </div>
            <h3>${item.name}</h3>
            <p>Type: ${item.type}</p>
        `;
        wardrobeItemsContainer.appendChild(itemElement);
        
        // Add click event listener to the item image
        const itemImage = itemElement.querySelector('.item-image');
        itemImage.addEventListener('click', () => toggleItem(item));
    });

    console.log("Finished rendering owned items");
}

// Make sure to call renderOwnedItems after the inventory is loaded
document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        window.createUserInventory(loggedInUser.username);
        initializeInventoryState();
        renderOwnedItems(); // Call this function to display the items
        console.log("Inventory initialized and items rendered for logged-in user");
    } else {
        console.log("No logged-in user found");
    }
});
