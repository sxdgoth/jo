function renderOwnedItems() {
    console.log('Rendering owned items');
    const wardrobeItemsContainer = document.querySelector('.wardrobe-items');
    const ownedItems = window.userInventory.getItems();
    
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
            <button class="change-color-btn" data-id="${item.id}">Change Color</button>
        `;
        wardrobeItemsContainer.appendChild(itemElement);
        
        // Add click event listener to the item image
        const itemImage = itemElement.querySelector('.item-image');
        itemImage.addEventListener('click', () => toggleItem(item));
        
        // Add click event listener to the change color button
        const changeColorBtn = itemElement.querySelector('.change-color-btn');
        changeColorBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log('Change color button clicked for item:', item);
            if (window.itemColorManager) {
                window.itemColorManager.showColorPicker(item, event);
            } else {
                console.error('ItemColorManager not found. window.itemColorManager:', window.itemColorManager);
            }
        });
    });
}

function toggleItem(item) {
    if (window.avatarManager) {
        window.avatarManager.toggleItem(item);
    } else {
        console.error('AvatarManager not initialized');
    }
}

function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = '../index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded in wardrobe.js');
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        document.getElementById('user-name').textContent = loggedInUser.username;
        document.getElementById('user-coins').textContent = loggedInUser.coins.toLocaleString();
        
        // Initialize user's inventory
        window.createUserInventory(loggedInUser.username);
        
        // Initialize AvatarManager
        if (window.AvatarManager) {
            window.avatarManager = new window.AvatarManager(loggedInUser.username);
            window.avatarManager.initialize();
        } else {
            console.error('AvatarManager class not found');
        }
        
        // Check if ItemColorManager is available
        if (window.ItemColorManager) {
            console.log('ItemColorManager is available');
        } else {
            console.error('ItemColorManager is not available');
        }
        
        // Render owned items
        renderOwnedItems();

        // Setup logout button
        const logoutButton = document.getElementById('logout-btn');
        if (logoutButton) {
            logoutButton.addEventListener('click', logout);
        }
    } else {
        console.error('No logged in user found');
        window.location.href = '../index.html';
    }
});

// Add any additional functions or event listeners here if needed
