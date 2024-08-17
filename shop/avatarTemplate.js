// avatarTemplate.js

class AvatarBody {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.baseUrl = 'https://sxdgoth.github.io/mwahbaby/assets/legendary/';
        this.bodyParts = [
            { name: 'Legs', file: 'avatar-legsandfeet.svg' },
            { name: 'Arms', file: 'avatar-armsandhands.svg' },
            { name: 'Body', file: 'avatar-body.svg' },
            { name: 'Head', file: 'avatar-head.svg' }
        ];
    }

    loadAvatar() {
        console.log("Loading avatar body parts...");
        this.container.innerHTML = '';
        this.bodyParts.forEach(part => {
            const img = document.createElement('img');
            img.src = this.baseUrl + part.file;
            img.alt = part.name;
            img.style.position = 'absolute';
            img.style.top = '0';
            img.style.left = '0';
            img.style.width = '100%';
            img.style.height = '100%';
            img.onload = () => console.log(`Loaded ${part.name}`);
            img.onerror = () => console.error(`Failed to load ${part.name}: ${img.src}`);
            this.container.appendChild(img);
        });
    }
}

// Create and load the avatar body when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const avatarBody = new AvatarBody('avatar-display');
    avatarBody.loadAvatar();
});
