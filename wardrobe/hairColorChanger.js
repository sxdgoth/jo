class HairColorChanger {
    constructor() {
        this.colors = [
            '#1E1E1E',
            '#323232',
            '#464646',
            '#5A5A5A',
            '#1E1E1E',
            '#787878'
        ];
        this.setupColorButtons();
        this.setupCustomColorPicker();
    }

    setupColorButtons() {
        const container = document.getElementById('hair-color-buttons');
        if (!container) {
            console.error("Hair color buttons container not found");
            return;
        }

        this.colors.forEach((color, index) => {
            const button = document.createElement('button');
            button.textContent = `Color ${index + 1}`;
            button.style.backgroundColor = color;
            button.onclick = () => this.changeHairColor(index);
            container.appendChild(button);
        });
    }

    setupCustomColorPicker() {
        const picker = document.getElementById('hair-color-input');
        if (!picker) {
            console.error("Hair color picker not found");
            return;
        }

        picker.addEventListener('input', (event) => {
            const color = event.target.value;
            this.changeCustomHairColor(color);
        });
    }

    changeHairColor(index) {
        console.log('Changing to color index:', index);
        if (window.avatarManager) {
            window.avatarManager.changeHairColor(index);
        } else {
            console.error('AvatarManager not initialized');
        }
    }

    changeCustomHairColor(color) {
        console.log('Changing to custom color:', color);
        if (window.avatarManager) {
            window.avatarManager.changeCustomHairColor(color);
        } else {
            console.error('AvatarManager not initialized');
        }
    }
}

// Initialize the HairColorChanger when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hairColorChanger = new HairColorChanger();
});



