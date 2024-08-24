document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        // Initialize AvatarDisplay
        window.avatarDisplay = new AvatarDisplay('avatar-display', loggedInUser.username);
        window.avatarDisplay.loadAvatar();
        
        // Update user coins display
        updateUserCoinsDisplay(loggedInUser.coins);
        
        // Initialize user's inventory
        window.createUserInventory(loggedInUser.username);
        
        // Render shop items
        renderShopItems();
    } else {
        window.location.href = '../index.html';
    }
});

function updateUserCoinsDisplay(coins) {
    const userCoinsElement = document.getElementById('user-coins');
    if (userCoinsElement) {
        userCoinsElement.textContent = `Coins: ${coins.toLocaleString()}`;
    }
}

function renderShopItems() {
    const shopItemsContainer = document.getElementById('shop-items');
    
    shopItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('shop-item');
        const imgSrc = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
        itemElement.innerHTML = `
            <div class="item-image">
                <img src="${imgSrc}" alt="${item.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/150'; console.error('Failed to load image: ${imgSrc}');">
            </div>
            <h3>${item.name}</h3>
            <p>Price: ${item.price} coins</p>
            <button onclick="buyItem('${item.id}')">Buy</button>
        `;
        shopItemsContainer.appendChild(itemElement);
    });
}

function buyItem(itemId) {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const item = shopItems.find(i => i.id === itemId);
    
    if (!item) {
        console.error('Item not found');
        return;
    }
    
    if (loggedInUser.coins >= item.price) {
        // Deduct coins
        loggedInUser.coins -= item.price;
        sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        
        // Add item to inventory
        window.userInventory.addItem(item);
        
        // Update avatar display
        window.avatarDisplay.equippedItems[item.type] = item.id;
        window.avatarDisplay.updateAvatarDisplay(item.type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
        
        // Save equipped items
        localStorage.setItem(`equippedItems_${loggedInUser.username}`, JSON.stringify(window.avatarDisplay.equippedItems));
        
        // Update coins display
        updateUserCoinsDisplay(loggedInUser.coins);
        
        console.log(`Bought item: ${item.name}`);
    } else {
        console.log("Not enough coins to buy this item");
        // You might want to show a message to the user here
    }
}
