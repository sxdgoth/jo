// wardrobe.js

document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        document.getElementById('user-name').textContent = loggedInUser.username;
        document.getElementById('coins-value').textContent = loggedInUser.coins.toLocaleString();
        
        // Initialize user's inventory
        window.createUserInventory(loggedInUser.username);
        
        // Initialize AvatarManager
        window.avatarManager = new AvatarManager(loggedInUser.username);
        window.avatarManager.initialize();
        
        // Render the avatar
        if (window.avatarBody && typeof window.avatarBody.initializeAvatar === 'function') {
            window.avatarBody.initializeAvatar(loggedInUser.username);
        }
        
        // Initialize SkinToneManager after avatar is rendered
        if (window.skinToneManager) {
            window.skinToneManager.initialize();
        }
        
        // Render owned items
        renderOwnedItems();

        // Initialize category buttons
        initializeCategoryButtons();
    } else {
        window.location.href = '../index.html';
    }
});

function renderOwnedItems(category = 'All') {
    const wardrobeItemsContainer = document.querySelector('.wardrobe-items');
    const ownedItems = window.userInventory.getItems();
    
    wardrobeItemsContainer.innerHTML = ''; // Clear existing items
    
    ownedItems.forEach(item => {
        if (category === 'All' || item.category === category) {
            const itemElement = document.createElement('div');
            itemElement.classList.add('wardrobe-item');
            const imgSrc = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
            itemElement.innerHTML = `
                <div class="item-image" data-id="${item.id}">
                    <img src="${imgSrc}" alt="${item.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/150'; console.error('Failed to load image: ${imgSrc}');">
                </div>
                <h3>${item.name}</h3>
                <p>${item.category}</p>
            `;
            wardrobeItemsContainer.appendChild(itemElement);
            
            // Apply positioning to the preview image
            const itemImage = itemElement.querySelector('.item-image img');
            if (typeof window.applyItemPosition === 'function') {
                window.applyItemPosition(itemImage, item.type);
            }
            
            // Add click event listener to the item element
            itemElement.addEventListener('click', () => toggleItem(item));
        }
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

function initializeCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderOwnedItems(this.dataset.category);
        });
    });
}
