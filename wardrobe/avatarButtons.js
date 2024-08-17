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
    if (window.avatarManager) {
        window.avatarManager.applySelectedItems();
        alert('Avatar applied and saved successfully!');
    } else {
        console.error('Avatar manager not found');
    }
}

function clearAvatar() {
    if (window.avatarManager) {
        window.avatarManager.clearAvatar();
        alert('Avatar cleared successfully!');
    } else {
        console.error('Avatar manager not found');
    }
}
