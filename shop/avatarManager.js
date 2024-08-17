// avatarManager.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("Avatar manager initializing...");
    const shopItemsContainer = document.querySelector('.shop-items');
    const equippedItems = new Set();
    const userCoinsElement = document.getElementById('user-coins');
    let selectedItem = null;
    const layerManager = new LayerManager();

    // Function to load and display the avatar
    function loadAvatar() {
        console.log("Loading avatar...");
        const avatarDisplay = document.getElementById('avatar-display');
        avatarDisplay.innerHTML = ''; // Clear existing items

        // Add base avatar template
        const baseAvatar = document.createElement('div');
        baseAvatar.innerHTML = avatarTemplate; // Make sure avatarTemplate is defined in avatarTemplate.js
        avatarDisplay.appendChild(baseAvatar);

        // Add equipped items
        equippedItems.forEach(itemId => {
            addItemToAvatar(itemId);
        });

        layerManager.reorderLayers();
    }

    // Function to add an item to the avatar display
    function addItemToAvatar(itemId) {
        console.log("Adding item to avatar:", itemId);
        const avatarDisplay = document.getElementById('avatar-display');
        const img = document.createElement('img');
        img.src = 'https://sxdgoth.github.io/mwahbaby/assets/legendary/' + itemId;
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        img.dataset.id = itemId;
        img.onerror = () => console.error("Failed to load image:", img.src);
        avatarDisplay.appendChild(img);
    }

    // Function to create shop items
    function createShopItems() {
        console.log("Creating shop items...");
        shopItems.forEach(item => {
            const button = document.createElement('button');
            button.textContent = `${item.name} ($${item.price})`;
            button.classList.add('item-button');
            button.onclick = () => selectItem(item);
            shopItemsContainer.appendChild(button);
        });
    }

    // Function to select an item
    function selectItem(item) {
        selectedItem = item;
        document.querySelectorAll('.item-button').forEach(el => el.classList.remove('selected'));
        event.target.classList.add('selected');
    }

    // Function to toggle item equip/unequip
    function toggleItem(item) {
        console.log("Toggling item:", item.name);
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        
        if (equippedItems.has(item.id)) {
            equippedItems.delete(item.id);
            loggedInUser.coins += item.price;
            console.log("Item unequipped:", item.name);
        } else {
            if (loggedInUser.coins >= item.price) {
                equippedItems.add(item.id);
                loggedInUser.coins -= item.price;
                console.log("Item equipped:", item.name);
            } else {
                console.log("Not enough coins to equip:", item.name);
                alert('Not enough coins!');
                return;
            }
        }
        sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        userCoinsElement.textContent = loggedInUser.coins.toLocaleString();
        
        loadAvatar();
    }

    // Function to update user information display
    function updateUserInfo() {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            document.getElementById('user-name').textContent = loggedInUser.username;
            userCoinsElement.textContent = loggedInUser.coins.toLocaleString();
        }
    }

    // Function to set up buttons
    function setupButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const buyButton = document.createElement('button');
        buyButton.textContent = 'Buy';
        buyButton.addEventListener('click', buySelectedItem);

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Avatar';
        clearButton.addEventListener('click', clearAvatar);

        buttonContainer.appendChild(buyButton);
        buttonContainer.appendChild(clearButton);
        document.querySelector('.shop-section').appendChild(buttonContainer);
    }

    // Function to buy selected item
    function buySelectedItem() {
        if (!selectedItem) {
            alert("Please select an item to buy.");
            return;
        }
        toggleItem(selectedItem);
    }

    // Function to clear avatar
    function clearAvatar() {
        equippedItems.clear();
        loadAvatar();
    }

    // Initialize
    console.log("Avatar manager initialized.");
    updateUserInfo();
    createShopItems();
    setupButtons();
    loadAvatar();
    layerManager.initialize();

    // Make necessary functions and variables global
    window.equippedItems = equippedItems;
    window.loadAvatar = loadAvatar;
    window.toggleItem = toggleItem;
});
