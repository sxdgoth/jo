// wardrobe.js

document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        document.getElementById('user-name').textContent = loggedInUser.username;
        document.getElementById('user-coins').textContent = loggedInUser.coins.toLocaleString();
        
        // Initialize user's inventory
        window.createUserInventory(loggedInUser.username);
        
        // Initialize AvatarManager
        window.avatarManager = new AvatarManager(loggedInUser.username);
        window.avatarManager.initialize();
        
        // Render the avatar
        if (window.avatarBody && typeof window.avatarBody.initializeAvatar === 'function') {
            window.avatarBody.initializeAvatar(loggedInUser.username);
            // Reapply all item positions after avatar initialization
            reapplyAllItemPositions();
        }
        
        // Initialize SkinToneManager after avatar is rendered
        if (window.skinToneManager) {
            window.skinToneManager.initialize();
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

        // Apply item positioning
        const itemImage = itemElement.querySelector('.item-image');
        if (typeof applyItemPosition === 'function') {
            console.log('Applying position for:', item.type);
            applyItemPosition(itemImage, item.type);
        } else {
            console.error('applyItemPosition function not found');
        }

        // Add click event listener to the item image
        itemImage.addEventListener('click', () => toggleItem(item));
    });
}

function toggleItem(item) {
    if (window.avatarManager) {
        window.avatarManager.toggleItem(item);
        
        // Reapply positioning after toggling
        const itemImage = document.querySelector(`.item-image[data-id="${item.id}"]`);
        if (itemImage && typeof applyItemPosition === 'function') {
            console.log('Reapplying position after toggle for:', item.type);
            applyItemPosition(itemImage, item.type);
        }
    } else {
        console.error('AvatarManager not initialized');
    }
}

function reapplyAllItemPositions() {
    const itemImages = document.querySelectorAll('.item-image');
    itemImages.forEach(itemImage => {
        const itemId = itemImage.dataset.id;
        const item = window.userInventory.getItems().find(i => i.id === itemId);
        if (item && typeof applyItemPosition === 'function') {
            console.log('Reapplying position for:', item.type);
            applyItemPosition(itemImage, item.type);
        }
    });
}

function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = '../index.html';
}
