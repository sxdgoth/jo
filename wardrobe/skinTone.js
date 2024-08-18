// skinTone.js

document.addEventListener('DOMContentLoaded', function() {
    const skinToneButtons = document.querySelectorAll('.skin-tone-btn');
    const avatarContainer = document.getElementById('avatar-container');

    const skinToneColors = {
        default: {
            main: '#FEE2CA',
            shadow: '#EFC1B7'
        },
        light: {
            main: '#FFE0BD',
            shadow: '#EFD0B1'
        },
        medium: {
            main: '#F1C27D',
            shadow: '#E0B170'
        },
        dark: {
            main: '#8D5524',
            shadow: '#7C4A1E'
        }
    };

    let currentColors = {...skinToneColors.default};

    function changeSkinTone(tone) {
    const avatarSVG = document.querySelector('#avatar-container svg');
    if (!avatarSVG) {
        console.error('Avatar SVG not found');
        return;
    }

        const newColors = skinToneColors[tone];

        // Change main skin color
        avatarSVG.querySelectorAll(`[fill="${currentColors.main}"]`).forEach(el => {
            el.setAttribute('fill', newColors.main);
        });

        // Change shadow color
        avatarSVG.querySelectorAll(`[fill="${currentColors.shadow}"]`).forEach(el => {
            el.setAttribute('fill', newColors.shadow);
        });

        // Update current colors
        currentColors = {...newColors};

        // Dispatch an event to notify that the skin tone has changed
        const event = new CustomEvent('skinToneChanged', { detail: { tone: tone } });
        document.dispatchEvent(event);

        console.log('Skin tone changed to:', tone);
    }

    skinToneButtons.forEach(button => {
        button.addEventListener('click', function() {
            const skinTone = this.dataset.skinTone;
            changeSkinTone(skinTone);
        });
    });

    // Function to get the current skin tone
    window.getCurrentSkinTone = function() {
        for (let tone in skinToneColors) {
            if (skinToneColors[tone].main === currentColors.main) {
                return tone;
            }
        }
        return 'default';
    };

    // Function to set skin tone (can be called from outside)
    window.setSkinTone = changeSkinTone;

    // Initialize with default skin tone
    changeSkinTone('default');
});

// Add this initialization function
window.initializeSkinToneButtons = function() {
    const skinToneButtons = document.querySelectorAll('.skin-tone-btn');
    skinToneButtons.forEach(button => {
        button.addEventListener('click', function() {
            const skinTone = this.dataset.skinTone;
            window.setSkinTone(skinTone);
        });
    });
};
