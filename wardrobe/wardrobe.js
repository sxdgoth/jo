document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded");
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        console.log("Logged in user:", loggedInUser);
        displayUserInfo(loggedInUser);
        loadInventory(loggedInUser.username);
    } else {
        console.log("No logged in user found");
        window.location.href = 'https://sxdgoth.github.io/jo/login/index.html';
    }
});

function displayUserInfo(user) {
    console.log("Displaying user info");
    document.getElementById('user-name').textContent = user.username;
    document.getElementById('user-coins').textContent = user.coins;
}

function loadInventory(username) {
    console.log("Loading inventory for:", username);
    const inventory = JSON.parse(localStorage.getItem(`inventory_${username}`)) || [];
    console.log("Inventory:", inventory);
    const wardrobeItems = document.querySelector('.wardrobe-items');
    
    if (inventory.length === 0) {
        console.log("Inventory is empty");
        wardrobeItems.innerHTML = '<p>No items in inventory</p>';
    } else {
        inventory.forEach(item => {
            const itemElement = createItemElement(item);
            wardrobeItems.appendChild(itemElement);
        });
    }
}

function createItemElement(item) {
    console.log("Creating item element:", item);
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    
    const img = document.createElement('img');
    img.src = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
    img.alt = item.name;
    img.classList.add('item-image');
    img.dataset.id = item.id;
    
    img.addEventListener('click', () => {
        console.log("Item clicked:", item);
        if (window.avatarManager) {
            window.avatarManager.toggleItem(item);
        } else {
            console.error("avatarManager not found");
        }
    });
    
    itemDiv.appendChild(img);
    return itemDiv;
}

function logout() {
    console.log("Logging out");
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'https://sxdgoth.github.io/jo/login/index.html';
}
