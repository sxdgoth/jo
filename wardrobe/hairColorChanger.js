// hairColorChanger.js

class HairColorChanger {
    constructor(avatarManager) {
        this.avatarManager = avatarManager;
        this.defaultHairColors = ['#1E1E1E', '#323232', '#464646', '#5A5A5A', '#787878'];
        this.originalColors = {};
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
                
                this.storeOriginalColors(svgDoc);
                this.applyHairColorToSVG(svgDoc, this.avatarManager.hairColor);

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

    storeOriginalColors(svgDoc) {
        this.originalColors = {};
        svgDoc.querySelectorAll('path').forEach((path, index) => {
            const color = this.getPathColor(path);
            if (color) {
                this.originalColors[index] = color;
            }
        });
    }

setupHairColorPicker() {
    const hairColorPicker = document.getElementById('hair-color-input');
    if (hairColorPicker) {
        hairColorPicker.value = this.hairColor;
        hairColorPicker.addEventListener('input', (event) => {
            this.changeHairColor(event.target.value);
        });
    } else {
        console.error('Hair color picker not found');
    }
}
    
    applyHairColorToSVG(svgDoc, newColor) {
        const paths = svgDoc.querySelectorAll('path');
        paths.forEach((path, index) => {
            const originalColor = this.originalColors[index];
            if (originalColor && this.defaultHairColors.includes(originalColor.toUpperCase())) {
                const blendedColor = this.blendColors(originalColor, newColor, 0.7);
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
}

// Initialize the HairColorChanger when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.avatarManager) {
        window.hairColorChanger = new HairColorChanger(window.avatarManager);
    } else {
        console.error('AvatarManager not found');
    }
});
