// avatarButtons.js

document.addEventListener('DOMContentLoaded', function() {
    createAvatarButtons();
});

function createAvatarButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'avatar-buttons';

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply Avatar';
    applyButton.onclick = applyAvatar;

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear Items from Avatar';
    clearButton.onclick = clearAvatar;

    buttonContainer.appendChild(applyButton);
    buttonContainer.appendChild(clearButton);

    const avatarContainer = document.querySelector('.avatar-container');
    if (avatarContainer) {
        avatarContainer.insertBefore(buttonContainer, avatarContainer.firstChild);
    } else {
        console.error('Avatar container not found');
    }
}

function applyAvatar() {
    const equippedItems = {};
    document.querySelectorAll('.item-image.equipped').forEach(itemImage => {
        const itemId = itemImage.dataset.id;
        const item = window.userInventory.getItems().find(i => i.id === itemId);
        if (item) {
            equippedItems[item.type] = item.id;
        }
    });

    localStorage.setItem('equippedItems', JSON.stringify(equippedItems));
    alert('Avatar saved successfully!');
}

function clearAvatar() {
    document.querySelectorAll('.item-image.equipped').forEach(itemImage => {
        itemImage.classList.remove('equipped');
        const itemId = itemImage.dataset.id;
        const item = window.userInventory.getItems().find(i => i.id === itemId);
        if (item) {
            window.avatarBody.updateLayer(item.type, null);
        }
    });

    localStorage.removeItem('equippedItems');
    alert('Avatar cleared successfully!');
}
