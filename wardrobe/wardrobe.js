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
        
        // Initialize AvatarManager
        window.avatarManager = new AvatarManager();
        window.avatarManager.initialize();
        
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
    window.avatarManager.toggleItem(item);
    saveEquippedItems();
}

function saveEquippedItems() {
    const equippedItems = window.avatarManager.equippedItems;
    sessionStorage.setItem('equippedItems', JSON.stringify(equippedItems));
}

function updateEquippedItems() {
    const equippedItems = JSON.parse(sessionStorage.getItem('equippedItems')) || {};
    window.avatarManager.equippedItems = equippedItems;
    window.avatarManager.updateAvatarDisplay();
    window.avatarManager.updateItemVisuals();
}

function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = '../index.html';
}
