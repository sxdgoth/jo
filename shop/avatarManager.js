// avatarManager.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("Avatar manager initializing...");
    const avatarDisplay = document.getElementById('avatar-display');
    const equippedItems = new Set();
    const layerManager = new LayerManager();

    // Function to load and display the avatar
    function loadAvatar() {
        console.log("Loading avatar...");
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
        const item = shopItems.find(item => item.id === itemId);
        if (!item) {
            console.error("Item not found:", itemId);
            return;
        }

        const img = document.createElement('img');
        img.src = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
        img.alt = item.name;
        img.dataset.id = item.id;
        img.dataset.type = item.type;
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        img.onerror = () => console.error("Failed to load image:", img.src);
        avatarDisplay.appendChild(img);
    }

    // Function to toggle item equip/unequip
    function toggleItem(item) {
        console.log("Toggling item:", item.name);
        if (equippedItems.has(item.id)) {
            equippedItems.delete(item.id);
            console.log("Item unequipped:", item.name);
        } else {
            equippedItems.add(item.id);
            console.log("Item equipped:", item.name);
        }
        loadAvatar();
    }

    // Function to clear avatar
    function clearAvatar() {
        equippedItems.clear();
        loadAvatar();
    }

    // Initialize
    console.log("Avatar manager initialized.");
    loadAvatar();
    layerManager.initialize();

    // Make necessary functions and variables global
    window.equippedItems = equippedItems;
    window.loadAvatar = loadAvatar;
    window.toggleItem = toggleItem;
    window.clearAvatar = clearAvatar;
});
