// avatarActions.js

function applyAvatar() {
    if (window.avatarManager) {
        console.log("Applying avatar changes");
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
        
        // Apply and save hair color
        if (window.avatarManager.hairColorChanger) {
            window.avatarManager.hairColorChanger.applyHairColor();
        }
        // Update the avatar display to reflect the changes
        window.avatarManager.updateAvatarDisplay();
        window.avatarManager.updateItemVisuals();
        
        // Reset tempEquippedItems to match equippedItems
        window.avatarManager.tempEquippedItems = {...window.avatarManager.equippedItems};
        
        console.log("Avatar saved successfully");
        alert('Avatar saved successfully!');
    } else {
        console.error('Avatar manager not initialized');
    }
}

function clearAvatar() {
    if (window.avatarManager) {
        console.log("Clearing avatar items");
        
        // Clear all temp equipped items
        window.avatarManager.tempEquippedItems = {};
        
        // Update the avatar display to reflect the changes
        window.avatarManager.updateTempAvatarDisplay();
        window.avatarManager.updateItemVisuals();
        
        console.log("Avatar items cleared successfully (colors preserved)");
    } else {
        console.error('Avatar manager not initialized');
    }
}

// Make sure this event listener is set up correctly
document.addEventListener('DOMContentLoaded', () => {
    const applyAvatarBtn = document.getElementById('apply-avatar-btn');
    if (applyAvatarBtn) {
        applyAvatarBtn.addEventListener('click', applyAvatar);
        console.log("Apply avatar button listener set up");
    } else {
        console.error('Apply Avatar button not found');
    }

    const clearAvatarBtn = document.getElementById('clear-avatar-btn');
    if (clearAvatarBtn) {
        clearAvatarBtn.addEventListener('click', clearAvatar);
        console.log("Clear avatar button listener set up");
    } else {
        console.error('Clear Avatar button not found');
    }
});
