document.addEventListener('DOMContentLoaded', () => {
    const shopItemsContainer = document.querySelector('.shop-items');
    let selectedItems = {};

    function renderShopItems() {
        shopItemsContainer.innerHTML = ''; // Clear existing items
        shopItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('shop-item');
            const imgSrc = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
            itemElement.innerHTML = `
                <img src="${imgSrc}" alt="${item.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/150'; console.error('Failed to load image: ${imgSrc}');">
                <h3>${item.name}</h3>
                <p>Type: ${item.type}</p>
                <p>Price: ${item.price} coins</p>
                <button class="toggle-btn" data-id="${item.id}">Select</button>
            `;
            shopItemsContainer.appendChild(itemElement);
        });

        // Add event listeners to toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(button => {
            button.addEventListener('click', (e) => toggleItem(e.target.dataset.id));
        });
    }

    function toggleItem(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (item) {
            if (selectedItems[item.type] === item) {
                // Item is already selected, so unselect it
                delete selectedItems[item.type];
                updateAvatarDisplay(item.type, null);
                console.log(`Unselected ${item.name}`);
            } else {
                // Select the new item
                selectedItems[item.type] = item;
                updateAvatarDisplay(item.type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
                console.log(`Selected ${item.name}`);
            }
            updateToggleButtons();
        }
    }

    function updateToggleButtons() {
        document.querySelectorAll('.toggle-btn').forEach(button => {
            const itemId = button.dataset.id;
            const item = shopItems.find(i => i.id === itemId);
            if (selectedItems[item.type] === item) {
                button.textContent = 'Unselect';
                button.classList.add('selected');
            } else {
                button.textContent = 'Select';
                button.classList.remove('selected');
            }
        });
    }

    function updateAvatarDisplay(type, src) {
        if (window.avatarBody && typeof window.avatarBody.updateLayer === 'function') {
            window.avatarBody.updateLayer(type, src);
        } else {
            console.warn('avatarBody.updateLayer function not found. Make sure avatarTemplate.js is loaded and contains this function.');
        }
    }

    // Expose necessary functions to the global scope
    window.shopManager = {
        toggleItem,
        renderShopItems
    };

    // Initialize the shop
    renderShopItems();
});
