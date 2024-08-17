document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        document.getElementById('user-name').textContent = loggedInUser.username;
        document.getElementById('user-coins').textContent = loggedInUser.coins.toLocaleString();
        
        // Initialize user's inventory
        window.createUserInventory(loggedInUser.username);
        
        // Render the avatar
        if (window.avatarBody && typeof window.avatarBody.initializeAvatar === 'function') {
            window.avatarBody.initializeAvatar();
        }
        
        // Render owned items
        renderOwnedItems();
    } else {
        window.location.href = '../index.html';
    }
});

function renderOwnedItems() {
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
        `;
        wardrobeItemsContainer.appendChild(itemElement);

        // Add click event listener to the item image
        const itemImage = itemElement.querySelector('.item-image');
        itemImage.addEventListener('click', () => toggleItem(item));
    });

    // Initialize equipped items
    updateEquippedItems();
}

function toggleItem(item) {
    const itemImage = document.querySelector(`.item-image[data-id="${item.id}"]`);
    
    if (itemImage.classList.contains('selected')) {
        // Unselect the item
        itemImage.classList.remove('selected');
    } else {
        // Unselect any other item of the same type
        const selectedItemOfSameType = document.querySelector(`.item-image.selected[data-id^="${item.type}"]`);
        if (selectedItemOfSameType) {
            selectedItemOfSameType.classList.remove('selected');
        }

        // Select the clicked item
        itemImage.classList.add('selected');
    }

    // Update the avatarManager's selectedItems
    if (window.avatarManager) {
        window.avatarManager.updateSelectedItems(item);
    }
}

function saveEquippedItems() {
    const equippedItems = {};
    document.querySelectorAll('.item-image.equipped').forEach(itemImage => {
        const itemId = itemImage.dataset.id;
        const item = window.userInventory.getItems().find(i => i.id === itemId);
        if (item) {
            equippedItems[item.type] = item.id;
        }
    });
    sessionStorage.setItem('equippedItems', JSON.stringify(equippedItems));
}

function updateEquippedItems() {
    const equippedItems = JSON.parse(sessionStorage.getItem('equippedItems')) || {};
    Object.entries(equippedItems).forEach(([type, itemId]) => {
        const itemImage = document.querySelector(`.item-image[data-id="${itemId}"]`);
        if (itemImage) {
            itemImage.classList.add('equipped');
            const item = window.userInventory.getItems().find(i => i.id === itemId);
            if (item) {
                window.avatarBody.updateLayer(type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
            }
        }
    });
}

function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = '../index.html';
}
