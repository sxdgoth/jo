document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        document.getElementById('user-coins').textContent = `Coins: ${loggedInUser.coins.toLocaleString()}`;
        
        // Initialize user's inventory
        window.createUserInventory(loggedInUser.username);
        
        // Render shop items
        renderShopItems();
    } else {
        window.location.href = '../index.html';
    }
});

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
    // Implement buying logic here
    console.log(`Buying item: ${itemId}`);
}
