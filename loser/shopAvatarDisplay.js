class ShopAvatarDisplay {
    constructor() {
        this.avatarContainer = document.getElementById('shop-avatar-display');
        this.avatarManager = null;
        this.currentUser = null;
    }

    initialize() {
        console.log('Initializing ShopAvatarDisplay');
        this.currentUser = this.getCurrentUser();
        if (this.currentUser) {
            console.log('Current user:', this.currentUser);
            this.avatarManager = new AvatarManager(this.currentUser.username);
            this.avatarManager.initialize();
            this.createAvatarDisplay();
        } else {
            console.error('No user logged in');
            this.avatarContainer.innerHTML = '<p>Please log in to view your avatar.</p>';
        }
    }

    getCurrentUser() {
        const userJson = sessionStorage.getItem('loggedInUser');
        return userJson ? JSON.parse(userJson) : null;
    }

    createAvatarDisplay() {
        console.log('Creating avatar display');
        this.avatarContainer.innerHTML = `
            <div id="avatar-image"></div>
            <p id="user-coins">Coins: ${this.currentUser.coins || 0}</p>
        `;
        
        // Create AvatarBody instance
        window.avatarBody = new AvatarBody('avatar-image');
        window.avatarBody.initializeAvatar();
    }
}

// Initialize the ShopAvatarDisplay when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ShopAvatarDisplay');
    window.shopAvatarDisplay = new ShopAvatarDisplay();
    window.shopAvatarDisplay.initialize();
});
