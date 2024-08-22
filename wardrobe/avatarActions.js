// avatarActions.js

function applyAvatar() {
    if (window.avatarManager) {
        // Clear all equipped items
        window.avatarManager.equippedItems = {};
        
        // Only keep items that are currently selected in tempEquippedItems
        Object.entries(window.avatarManager.tempEquippedItems).forEach(([type, itemId]) => {
            if (itemId) {
                window.avatarManager.equippedItems[type] = itemId;
            }
        });

        // Save to localStorage
        localStorage.setItem(`equippedItems_${window.avatarManager.username}`, JSON.stringify(window.avatarManager.equippedItems));
        localStorage.setItem(`skinTone_${window.avatarManager.username}`, window.avatarManager.skinTone);
        localStorage.setItem(`eyeColor_${window.avatarManager.username}`, window.avatarManager.eyeColor);
        localStorage.setItem(`lipColor_${window.avatarManager.username}`, window.avatarManager.lipColor);
        
        // Save highlighted items
        const highlightedItems = Object.values(window.avatarManager.equippedItems);
        localStorage.setItem(`highlightedItems_${window.avatarManager.username}`, JSON.stringify(highlightedItems));

        // Update the avatar display to reflect the changes
        window.avatarManager.updateAvatarDisplay();
        window.avatarManager.updateItemVisuals();
        
        // Reset tempEquippedItems to match equippedItems
        window.avatarManager.tempEquippedItems = {...window.avatarManager.equippedItems};
        
        alert('Avatar saved successfully!');
    } else {
        console.error('Avatar manager not initialized');
    }
}

function clearAvatar() {
    if (window.avatarManager) {
        window.avatarManager.tempEquippedItems = {};
        window.avatarManager.equippedItems = {};
        localStorage.setItem(`equippedItems_${window.avatarManager.username}`, JSON.stringify({}));
        localStorage.removeItem(`highlightedItems_${window.avatarManager.username}`);
        window.avatarManager.updateItemVisuals();
        window.avatarManager.updateTempAvatarDisplay();
        document.querySelectorAll('.wardrobe-item').forEach(item => item.classList.remove('highlighted'));
    } else {
        console.error('Avatar manager not initialized');
    }
}

// Set up event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const applyAvatarBtn = document.getElementById('apply-avatar-btn');
    const clearAvatarBtn = document.getElementById('clear-avatar-btn');

    if (applyAvatarBtn) {
        applyAvatarBtn.addEventListener('click', applyAvatar);
    } else {
        console.error('Apply Avatar button not found');
    }

    if (clearAvatarBtn) {
        clearAvatarBtn.addEventListener('click', clearAvatar);
    } else {
        console.error('Clear Avatar button not found');
    }
});
