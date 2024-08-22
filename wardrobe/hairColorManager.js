
// hairColorManager.js

class HairColorManager {
    constructor(avatarManager) {
        this.avatarManager = avatarManager;
        this.defaultHairColors = ['#1E1E1E', '#323232', '#464646', '#5A5A5A', '#787878'];
        this.originalColors = {};
    }

    initialize() {
        this.setupColorPicker();
        this.storeOriginalColors();
    }

    setupColorPicker() {
        const colorPicker = document.getElementById('hair-color-picker');
        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                this.changeHairColor(e.target.value);
            });
        } else {
            console.error('Hair color picker not found');
        }
    }

    storeOriginalColors() {
        const hairPaths = document.querySelectorAll('#hair-svg path');
        hairPaths.forEach((path, index) => {
            const color = this.getPathColor(path);
            if (color && this.defaultHairColors.includes(color.toUpperCase())) {
                this.originalColors[index] = color;
            }
        });
    }

    getPathColor(path) {
        if (path.hasAttribute('fill')) {
            return path.getAttribute('fill');
        }
        if (path.hasAttribute('style')) {
            const match = path.getAttribute('style').match(/fill:\s*(#[A-Fa-f0-9]{6})/);
            if (match) return match[1];
        }
        return null;
    }

    changeHairColor(newColor) {
        const hairPaths = document.querySelectorAll('#hair-svg path');
        hairPaths.forEach((path, index) => {
            const originalColor = this.originalColors[index];
            if (originalColor) {
                const blendedColor = this.blendColors(originalColor, newColor, 0.7);
                this.setPathColor(path, blendedColor);
            }
        });
        this.avatarManager.updateTempAvatarDisplay();
    }

    blendColors(color1, color2, ratio) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        const brightness1 = (rgb1[0] * 299 + rgb1[1] * 587 + rgb1[2] * 114) / 1000;
        const brightness2 = (rgb2[0] * 299 + rgb2[1] * 587 + rgb2[2] * 114) / 1000;
        
        let blendRatio = ratio;
        if (brightness2 > brightness1) {
            blendRatio = ratio * 0.7;
        } else {
            blendRatio = Math.min(ratio * 1.3, 1);
        }

        const blended = rgb1.map((channel, i) => 
            Math.round(channel * (1 - blendRatio) + rgb2[i] * blendRatio)
        );
        return this.rgbToHex(...blended);
    }

    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    setPathColor(path, color) {
        if (path.hasAttribute('fill')) {
            path.setAttribute('fill', color);
        }
        if (path.hasAttribute('style')) {
            let style = path.getAttribute('style');
            style = style.replace(/fill:[^;]+;?/, `fill:${color};`);
            path.setAttribute('style', style);
        }
    }
}
