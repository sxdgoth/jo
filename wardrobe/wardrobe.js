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
        }
        
        // Initialize SkinToneManager after avatar is rendered
        if (window.skinToneManager) {
            window.skinToneManager.initialize();
        }
        
        // Render owned items
        renderOwnedItems();

        // Setup eye color picker
        const eyeColorInput = document.getElementById('eye-color-input');
        if (eyeColorInput) {
            // Set initial value from localStorage or default
            const savedEyeColor = localStorage.getItem(`eyeColor_${loggedInUser.username}`);
            eyeColorInput.value = savedEyeColor || '#3FA2FF';

            eyeColorInput.addEventListener('change', function(e) {
                const newColor = e.target.value;
                if (window.avatarManager) {
                    window.avatarManager.changeEyeColor(newColor);
                }
            });
        }

        // Setup lip color picker
        const lipColorInput = document.getElementById('lip-color-input');
        if (lipColorInput) {
            const savedLipColor = localStorage.getItem(`lipColor_${loggedInUser.username}`);
            lipColorInput.value = savedLipColor || '#dea296';

            lipColorInput.addEventListener('change', function(e) {
                const newColor = e.target.value;
                if (window.avatarManager) {
                    window.avatarManager.changeLipColor(newColor);
                }
            });
        }
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
