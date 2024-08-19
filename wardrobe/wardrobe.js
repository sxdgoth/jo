document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        displayUserInfo(loggedInUser);
        loadInventory(loggedInUser.username);
    } else {
        window.location.href = 'https://sxdgoth.github.io/jo/login/index.html';
    }
});

function displayUserInfo(user) {
    document.getElementById('user-name').textContent = user.username;
    document.getElementById('user-coins').textContent = user.coins;
}

function loadInventory(username) {
    const inventory = JSON.parse(localStorage.getItem(`inventory_${username}`)) || [];
    const wardrobeItems = document.querySelector('.wardrobe-items');
    
    inventory.forEach(item => {
        const itemElement = createItemElement(item);
        wardrobeItems.appendChild(itemElement);
    });
}

function createItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    
    const img = document.createElement('img');
    img.src = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
    img.alt = item.name;
    img.classList.add('item-image');
    img.dataset.id = item.id;
    
    img.addEventListener('click', () => {
        window.avatarManager.toggleItem(item);
    });
    
    itemDiv.appendChild(img);
    return itemDiv;
}

function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'https://sxdgoth.github.io/jo/login/index.html';
}
