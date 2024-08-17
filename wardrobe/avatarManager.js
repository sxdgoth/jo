// In avatarManager.js

createButtons() {
    const existingButtonContainer = document.querySelector('.avatar-buttons');
    if (existingButtonContainer) {
        // Buttons already exist, no need to create them again
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
        avatarContainer.insertBefore(buttonContainer, avatarContainer.firstChild);
    } else {
        console.warn('Avatar container not found. Unable to add buttons.');
    }
}



This change will prevent the creation of duplicate buttons if they already exist on the page.

Now, to ensure that we're not creating these buttons elsewhere in your code, please check your wardrobe.js and any other relevant files to remove any other code that might be creating these buttons.

If you still see duplicate buttons after making this change, it's possible that the AvatarManager is being

Avatar for lalajrf-hinsj





