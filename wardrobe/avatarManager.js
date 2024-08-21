class AvatarManager {
    constructor(username) {
        this.username = username;
        this.equippedItems = {};
        this.tempEquippedItems = {};
        this.skinTone = 'light';
        this.eyeColor = '#3FA2FF'; // Default eye color
        this.lipColor = '#E6998F'; // Default lip color
        this.debounceTimer = null;
        this.loadEquippedItems();
    }

    initialize() {
        this.setupApplyAvatarButton();
        this.setupClearAvatarButton();
        this.setupEyeColorPicker();
        this.setupLipColorPicker();
        this.updateAvatarDisplay();
    }

    setupApplyAvatarButton() {
        const applyAvatarBtn = document.getElementById('apply-avatar-btn');
        if (applyAvatarBtn) {
            applyAvatarBtn.addEventListener('click', () => this.applyAvatar());
        } else {
            console.error('Apply Avatar button not found');
        }
    }

    setupClearAvatarButton() {
        const clearAvatarBtn = document.getElementById('clear-avatar-btn');
        if (clearAvatarBtn) {
            clearAvatarBtn.addEventListener('click', () => this.clearAvatar());
        } else {
            console.error('Clear Avatar button not found');
        }
    }

    setupEyeColorPicker() {
        const eyeColorPicker = document.getElementById('eye-color-input');
        if (eyeColorPicker) {
            eyeColorPicker.value = this.eyeColor;
            eyeColorPicker.addEventListener('input', (event) => {
                this.debounceChangeEyeColor(event.target.value);
            });
        } else {
            console.error('Eye color picker not found');
        }
    }

    setupLipColorPicker() {
        const lipColorPicker = document.getElementById('lip-color-input');
        if (lipColorPicker) {
            lipColorPicker.value = this.lipColor;
            lipColorPicker.addEventListener('input', (event) => {
                this.debounceChangeLipColor(event.target.value);
            });
        } else {
            console.error('Lip color picker not found');
        }
    }

    loadEquippedItems() {
        const savedItems = localStorage.getItem(`equippedItems_${this.username}`);
        if (savedItems) {
            this.equippedItems = JSON.parse(savedItems);
            this.tempEquippedItems = {...this.equippedItems};
        }
        const savedSkinTone = localStorage.getItem(`skinTone_${this.username}`);
        if (savedSkinTone) {
            this.skinTone = savedSkinTone;
        }
        const savedEyeColor = localStorage.getItem(`eyeColor_${this.username}`);
        if (savedEyeColor) {
            this.eyeColor = savedEyeColor;
        }
        const savedLipColor = localStorage.getItem(`lipColor_${this.username}`);
        if (savedLipColor) {
            this.lipColor = savedLipColor;
        }
    }

    applyAvatar() {
        this.equippedItems = {...this.tempEquippedItems};
        localStorage.setItem(`equippedItems_${this.username}`, JSON.stringify(this.equippedItems));
        localStorage.setItem(`skinTone_${this.username}`, this.skinTone);
        localStorage.setItem(`eyeColor_${this.username}`, this.eyeColor);
        localStorage.setItem(`lipColor_${this.username}`, this.lipColor);
        this.updateAvatarDisplay();
        alert('Avatar saved successfully!');
    }

    clearAvatar() {
        this.tempEquippedItems = {};
        this.updateItemVisuals();
        this.updateTempAvatarDisplay();
    }

    updateAvatarDisplay() {
        if (window.avatarDisplay) {
            window.avatarDisplay.loadAvatar();
        }
    }

    toggleItem(item) {
        if (this.tempEquippedItems[item.type] === item.id) {
            delete this.tempEquippedItems[item.type];
        } else {
            this.tempEquippedItems[item.type] = item.id;
        }
        this.updateItemVisuals();
        this.updateTempAvatarDisplay();
    }

    updateItemVisuals() {
        document.querySelectorAll('.item-image').forEach(itemImage => {
            const itemId = itemImage.dataset.id;
            const item = window.userInventory.getItems().find(i => i.id === itemId);
            if (item && this.tempEquippedItems[item.type] === item.id) {
                itemImage.classList.add('equipped');
            } else {
                itemImage.classList.remove('equipped');
            }
        });
    }

    updateTempAvatarDisplay() {
        if (window.avatarDisplay) {
            window.avatarDisplay.loadAvatar();
        }
    }

    changeSkinTone(newTone) {
        this.skinTone = newTone;
        if (window.avatarDisplay) {
            window.avatarDisplay.changeSkinTone(newTone);
        }
    }

    debounceChangeEyeColor(newColor) {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
            this.changeEyeColor(newColor);
        }, 50); // 50ms debounce time
    }

    changeEyeColor(newColor) {
        this.eyeColor = newColor;
        const eyeColorPicker = document.getElementById('eye-color-input');
        if (eyeColorPicker) {
            eyeColorPicker.value = newColor;
        }
        if (window.avatarDisplay) {
            window.avatarDisplay.changeEyeColor(newColor);
        }
    }

    debounceChangeLipColor(newColor) {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
            this.changeLipColor(newColor);
        }, 50); // 50ms debounce time
    }

    changeLipColor(newColor) {
        this.lipColor = newColor;
        const lipColorPicker = document.getElementById('lip-color-input');
        if (lipColorPicker) {
            lipColorPicker.value = newColor;
        }
        if (window.avatarDisplay) {
            window.avatarDisplay.changeLipColor(newColor);
        }
    }
}

// Initialize the AvatarManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        window.avatarManager = new AvatarManager(loggedInUser.username);
        window.avatarManager.initialize();
    } else {
        console.error('No logged in user found');
    }
});
