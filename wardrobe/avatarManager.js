// avatarManager.js

class AvatarManager {
    constructor() {
        this.equippedItems = {};
        this.displayedItems = {};
    }

    initialize() {
        this.loadEquippedItems();
        this.createButtons();
    }

    createButtons() {
        console.log("Creating buttons");
        if (document.querySelector('.avatar-buttons')) {
            console.log("Buttons already exist");
            return;
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'avatar-buttons';

        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply Avatar';
        applyButton.onclick = () => this.applyAvatar();

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Avatar';
        clearButton.onclick = () => this.clearAvatar();

        buttonContainer.appendChild(applyButton);
        buttonContainer.appendChild(clearButton);

        const avatarContainer = document.querySelector('.avatar-container');
        if (avatarContainer) {
            avatarContainer.appendChild(buttonContainer);
            console.log("Buttons added to avatar container");
        } else {
            console.log("Avatar container not found");
        }
    }

    applyAvatar() {
        this.equippedItems = {...this.displayedItems};
        localStorage.setItem('equippedItems', JSON.stringify(this.equippedItems));
        alert('Avatar saved successfully!');
    }

         clearAvatar() {
        this.displayedItems = {};
        this.updateAvatarDisplay();
        this.updateItemVisuals();
        console.log("Avatar cleared");

        // Add a small delay before showing the alert
        setTimeout(() => {
            alert('Avatar cleared successfully!');
        }, 100);
    }

    updateAvatarDisplay() {
        if (window.avatarBody) {
            console.log("Updating avatar display");
            const allLayers = ['base', 'eyes', 'mouth', 'hair', 'clothes', 'accessories'];
            
            allLayers.forEach(layer => {
                const itemId = this.displayedItems[layer];
                if (itemId) {
                    const item = window.userInventory.getItems().find(i => i.id === itemId);
                    if (item) {
                        console.log(`Applying item: ${item.name} to layer: ${layer}`);
                        window.avatarBody.updateLayer(layer, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
                    }
                } else {
                    console.log(`Clearing layer: ${layer}`);
                    window.avatarBody.updateLayer(layer, null);
                }
            });
        } else {
            console.error("avatarBody is not available");
        }
    }

    toggleItem(item) {
        if (this.displayedItems[item.type] === item.id) {
            delete this.displayedItems[item.type];
        } else {
            this.displayedItems[item.type] = item.id;
        }
        this.updateAvatarDisplay();
        this.updateItemVisuals();
    }


    loadEquippedItems() {
        const savedItems = localStorage.getItem('equippedItems');
        if (savedItems) {
            this.equippedItems = JSON.parse(savedItems);
            this.displayedItems = {...this.equippedItems};
            this.updateAvatarDisplay();
        }
    }

    
    updateItemVisuals() {
        document.querySelectorAll('.item-image').forEach(itemImage => {
            const itemId = itemImage.dataset.id;
            const item = window.userInventory.getItems().find(i => i.id === itemId);
            if (item && this.displayedItems[item.type] === item.id) {
                itemImage.classList.add('equipped');
            } else {
                itemImage.classList.remove('equipped');
            }
        });
    }
}
