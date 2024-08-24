document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        // Initialize AvatarDisplay
        window.avatarDisplay = new AvatarDisplay('avatar-display', loggedInUser.username);
        window.avatarDisplay.loadAvatar();
        
        // Display user coins
        updateUserCoinsDisplay(loggedInUser.coins);
        
        // Render shop items (for display purposes only)
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
    if (!shopItemsContainer) {
        console.error('Shop items container not found');
        return;
    }
    
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
        `;
        shopItemsContainer.appendChild(itemElement);
    });
}
