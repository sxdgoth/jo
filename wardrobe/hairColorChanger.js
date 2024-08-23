// hairColorChanger.js

class HairColorChanger {
    constructor(avatarManager) {
        this.avatarManager = avatarManager;
        this.hairColor = '#1E1E1E'; // Default hair color
        this.selectedHairId = null;
        this.setupHairColorPicker();
    }

    setupHairColorPicker() {
        const hairColorPicker = document.getElementById('color-picker');
        if (hairColorPicker) {
            this.hairColor = localStorage.getItem(`hairColor_${this.avatarManager.username}`) || this.hairColor;
            hairColorPicker.value = this.hairColor;
            hairColorPicker.addEventListener('input', (event) => {
                this.changeHairColor(event.target.value);
            });
        } else {
            console.error('Hair color picker not found');
        }
    }

    setSelectedHair(hairId) {
        this.selectedHairId = hairId;
        this.updateHairColor();
    }

    changeHairColor(newColor) {
        this.hairColor = newColor;
        localStorage.setItem(`hairColor_${this.avatarManager.username}`, newColor);
        this.updateHairColor();
    }

    updateHairColor() {
        if (this.selectedHairId) {
            const item = window.userInventory.getItems().find(i => i.id === this.selectedHairId);
            if (item) {
                this.updateLayerWithHairColor('Hair', `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
            }
        }
    }

    updateLayerWithHairColor(type, src) {
        fetch(src)
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
                    window.avatarBody.updateLayer(type, url);
                });
            })
            .catch(error => console.error(`Error updating hair color:`, error));
    }


    applyHairColorToSVG(svgDoc) {
        const defaultHairColors = ['#1E1E1E', '#323232', '#464646', '#5A5A5A', '#787878'];
        const paths = svgDoc.querySelectorAll('path');
        paths.forEach(path => {
            const currentColor = this.getPathColor(path);
            if (currentColor && defaultHairColors.includes(currentColor.toUpperCase())) {
                const blendedColor = this.blendColors(currentColor, this.hairColor, 0.7);
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
            style = style.replace(/fill:\s*(#[A-Fa-f0-9]{6})/, `fill: ${color}`);
            path.setAttribute('style', style);
        }
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }

    blendColors(color1, color2, ratio) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        const brightness1 = (rgb1[0] * 299 + rgb1[1] * 587 + rgb1[2] * 114) / 1000;
        const brightness2 = (rgb2[0] * 299 + rgb2[1] * 587 + rgb2[2] * 114) / 1000;
        
        let blendRatio = ratio;
        if (brightness2 > brightness1) {
            // For lighter colors, reduce the blend ratio to maintain highlights
            blendRatio = ratio * 0.7;
        } else {
            // For darker colors, increase the blend ratio for a more dramatic change
            blendRatio = Math.min(ratio * 1.3, 1);
        }

        const blended = rgb1.map((channel, i) => 
            Math.round(channel * (1 - blendRatio) + rgb2[i] * blendRatio)
        );
        return this.rgbToHex(...blended);
    }
}
