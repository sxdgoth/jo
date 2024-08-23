// wardrobe.js

document.addEventListener('DOMContentLoaded', function() {
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
        
        // Attach button listeners
        attachButtonListeners();
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
        
        // Add click event listener to the entire item element
        itemElement.addEventListener('click', () => toggleItem(item));
    });
}

function toggleItem(item) {
    if (window.avatarManager) {
        window.avatarManager.toggleItem(item);
    } else {
        console.error('AvatarManager not initialized');
    }
}

function attachButtonListeners() {
    const applyAvatarBtn = document.getElementById('apply-avatar-btn');
    if (applyAvatarBtn) {
        applyAvatarBtn.addEventListener('click', applyAvatar);
    }

    const clearAvatarBtn = document.getElementById('clear-avatar-btn');
    if (clearAvatarBtn) {
        clearAvatarBtn.addEventListener('click', clearAvatar);
    }

    // Add more button listeners here if needed
}

function applyAvatar() {
    if (window.avatarManager) {
        window.avatarManager.applyAvatar();
        console.log("Avatar changes applied");
        alert('Avatar saved successfully!');
    } else {
        console.error('AvatarManager not initialized');
    }
}

function clearAvatar() {
    if (window.avatarManager) {
        window.avatarManager.clearAvatar();
        console.log("Avatar cleared");
        renderOwnedItems(); // Re-render items to update visual state
    } else {
        console.error('AvatarManager not initialized');
    }
}

// Function to update highlights based on equipped items
function updateHighlights() {
    if (window.avatarManager) {
        const equippedItems = window.avatarManager.getEquippedItems();
        document.querySelectorAll('.wardrobe-item').forEach(itemElement => {
            const itemId = itemElement.querySelector('.item-image').dataset.id;
            if (Object.values(equippedItems).includes(itemId)) {
                itemElement.classList.add('highlighted');
            } else {
                itemElement.classList.remove('highlighted');
            }
        });
    }
}

// Call this function after toggling items and applying avatar
function updateWardrobeDisplay() {
    renderOwnedItems();
    updateHighlights();
}

// You might want to call this function after certain actions
// For example, after applying avatar changes:
// applyAvatar() {
//     // ... existing code ...
//     updateWardrobeDisplay();
// }
