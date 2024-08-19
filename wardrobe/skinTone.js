class SkinToneManager {
    constructor(avatarBody) {
        this.avatarBody = avatarBody;
        this.skinTones = {
            light: {
                name: 'Light',
                main: '#FEE2CA',
                shadow: '#EFC1B7'
            },
            medium: {
                name: 'Medium',
                main: '#FFE0BD',
                shadow: '#EFD0B1'
            },
            tan: {
                name: 'Tan',
                main: '#F1C27D',
                shadow: '#E0B170'
            },
            dark: {
                name: 'Dark',
                main: '#8D5524',
                shadow: '#7C4A1E'
            }
        };
        this.currentSkinTone = this.skinTones.light;
    }

    initialize() {
        console.log("SkinToneManager initializing...");
        this.setupSkinToneButtons();
    }

    setupSkinToneButtons() {
        const container = document.getElementById('skin-tone-buttons');
        if (!container) {
            console.error("Skin tone buttons container not found");
            return;
        }

        Object.keys(this.skinTones).forEach(toneName => {
            const tone = this.skinTones[toneName];
            const button = document.createElement('button');
            button.classList.add('skin-tone-button');
            button.dataset.tone = toneName;
            button.style.background = `linear-gradient(135deg, ${tone.main} 50%, ${tone.shadow} 50%)`;
            button.onclick = () => this.selectSkinTone(toneName);
            container.appendChild(button);
        });

        console.log("Skin tone buttons set up");
    }

    selectSkinTone(toneName) {
        const tone = this.skinTones[toneName];
        if (!tone) {
            console.error(`Invalid skin tone: ${toneName}`);
            return;
        }

        this.currentSkinTone = tone;
        console.log(`Selected skin tone: ${tone.name}`);

        // Update button styles
        const buttons = document.querySelectorAll('.skin-tone-button');
        buttons.forEach(button => {
            if (button.dataset.tone === toneName) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });

        // Apply skin tone to avatar
        if (this.avatarBody) {
            this.avatarBody.changeSkinTone(toneName);
        } else {
            console.error('AvatarBody not found');
        }
    }
}

// Initialize the SkinToneManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing SkinToneManager");
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser && window.avatarBody) {
        window.skinToneManager = new SkinToneManager(window.avatarBody);
        window.skinToneManager.initialize();
        // Set initial skin tone based on AvatarBody
        if (window.avatarBody.skinTone) {
            window.skinToneManager.selectSkinTone(window.avatarBody.skinTone);
        }
    } else {
        console.error('No logged in user found or AvatarBody not initialized');
    }
});
