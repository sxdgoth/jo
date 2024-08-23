// hairColorChanger.js

class HairColorChanger {
    constructor(avatarManager) {
        this.avatarManager = avatarManager;
        this.colorInput = document.getElementById('hair-color-input');
        this.defaultHairColors = ['#1E1E1E', '#323232', '#464646', '#5A5A5A', '#787878'];
        this.initialize();
    }

    initialize() {
        if (this.colorInput) {
            this.colorInput.value = this.avatarManager.hairColor;
            this.colorInput.addEventListener('input', (e) => {
                this.changeColor(e.target.value);
            });
        } else {
            console.error('Hair color input not found');
        }
    }

    changeColor(newColor) {
        this.avatarManager.hairColor = newColor;
        localStorage.setItem(`hairColor_${this.avatarManager.username}`, newColor);
        this.updateHairColor();
    }

    updateHairColor() {
        const equippedHair = this.avatarManager.equippedItems['Hair'];
        if (equippedHair) {
            const hairItem = window.userInventory.getItems().find(i => i.id === equippedHair);
            if (hairItem) {
                this.applyHairColor(hairItem);
            }
        }
    }

    applyHairColor(hairItem) {
        fetch(`https://sxdgoth.github.io/jo/${hairItem.path}${hairItem.id}`)
            .then(response => response.text())
            .then(svgText => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                
                this.applyHairColorToSVG(svgDoc);

                const serializer = new XMLSerializer();
                const modifiedSvgString = serializer.serializeToString(svgDoc);
                const blob = new Blob([modifiedSvgString], {type: 'image/svg+xml'});
                const url = URL.createObjectURL(blob);
                
                requestAnimationFrame(() => {
                    window.avatarBody.updateLayer('Hair', url);
                });
            })
            .catch(error => console.error('Error updating hair color:', error));
    }

    applyHairColorToSVG(svgDoc) {
        const paths = svgDoc.querySelectorAll('path');
        paths.forEach((path) => {
            const currentColor = this.getPathColor(path);
            if (currentColor && this.defaultHairColors.includes(currentColor.toUpperCase())) {
                const blendedColor = this.blendColors(currentColor, this.avatarManager.hairColor, 0.7);
                this.setPathColor(path, blendedColor);
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

    blendColors(color1, color2, ratio) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        const blended = rgb1.map((channel, i) => 
            Math.round(channel * (1 - ratio) + rgb2[i] * ratio)
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
}

// Initialize the HairColorChanger when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.avatarManager) {
        window.hairColorChanger = new HairColorChanger(window.avatarManager);
    } else {
        console.error('AvatarManager not found');
    }
});
