// skinToneApplier.js

class SkinToneApplier {
    constructor() {
        this.skinToneItems = ['Eyes', 'Nose', 'Mouth', 'Face'];
    }

    applySkinToneToItems(currentSkinTone) {
        this.skinToneItems.forEach(itemType => {
            const layer = document.querySelector(`[data-type="${itemType}"]`);
            if (layer && layer.style.display !== 'none') {
                this.applySkinToneToSVG(layer, currentSkinTone);
            }
        });
    }

    applySkinToneToSVG(obj, currentSkinTone) {
        const svgDoc = obj.contentDocument;
        if (svgDoc && window.avatarDisplay.skinTones[currentSkinTone]) {
            const paths = svgDoc.querySelectorAll('path, circle, ellipse, rect');
            const tone = window.avatarDisplay.skinTones[currentSkinTone];

            paths.forEach(path => {
                const currentFill = path.getAttribute('fill');
                if (currentFill && currentFill.toLowerCase() !== 'none') {
                    const newColor = this.getNewColor(currentFill, tone);
                    path.setAttribute('fill', newColor);
                }
            });
        }
    }

    getNewColor(currentColor, tone) {
        const currentLuminance = this.getLuminance(currentColor);
        const mainLuminance = this.getLuminance(tone.main);
        const luminanceDiff = currentLuminance - mainLuminance;

        if (Math.abs(luminanceDiff) < 0.1) {
            return tone.main;
        } else if (luminanceDiff < 0) {
            return tone.shadow;
        } else {
            return this.lightenColor(tone.main, luminanceDiff);
        }
    }

    getLuminance(hex) {
        const rgb = this.hexToRgb(hex);
        return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    }

    hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }

    lightenColor(color, amount) {
        const rgb = this.hexToRgb(color);
        const newRgb = rgb.map(c => Math.min(255, c + Math.round(amount * 255)));
        return `rgb(${newRgb[0]}, ${newRgb[1]}, ${newRgb[2]})`;
    }
}

// Initialize the SkinToneApplier
window.skinToneApplier = new SkinToneApplier();
