// skinTone.js

class SkinToneManager {
    constructor() {
       this.skinTones = {
    light: {
        name: 'Light',
        main: '#FEE2CA',
        shadow: '#EFC1B7',
        highlight: '#B37E78'  
    },
    medium: {
        name: 'Medium',
        main: '#FFE0BD',
        shadow: '#EFD0B1',
        highlight: '#C4A28A'  // New darker highlight tone
    },
    tan: {
        name: 'Tan',
        main: '#F1C27D',
        shadow: '#E0B170',
        highlight: '#B39059'  // New darker highlight tone
    },
    dark: {
        name: 'Dark',
        main: '#8D5524',
        shadow: '#7C4A1E',
        highlight: '#5E3919'  // New darker highlight tone
    }
};
        this.currentSkinTone = this.skinTones.light;
        this.baseParts = ['Legs', 'Arms', 'Body', 'Neck', 'Head'];
        this.originalColors = {};
    }

    initialize() {
        console.log("SkinToneManager initializing...");
        this.setupSkinToneButtons();
        this.saveOriginalColors();
    }

    setupSkinToneButtons() {
        const container = document.getElementById('skin-tone-buttons');
        if (!container) {
            console.error("Skin tone buttons container not found");
            return;
        }

        const buttons = container.querySelectorAll('.skin-tone-button');
        buttons.forEach(button => {
            const toneName = button.dataset.tone;
            const tone = this.skinTones[toneName];
            if (tone) {
                button.style.background = `linear-gradient(135deg, ${tone.main} 50%, ${tone.shadow} 50%)`;
                button.onclick = () => this.selectSkinTone(tone);
            }
        });

        console.log("Skin tone buttons set up");
    }

    selectSkinTone(tone) {
        this.currentSkinTone = tone;
        console.log(`Selected skin tone: ${tone.name}`);
        
        // Update button styles
        const buttons = document.querySelectorAll('.skin-tone-button');
        buttons.forEach(button => {
            if (button.dataset.tone === this.getSkinToneKey(tone)) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });

        // Apply skin tone to avatar
        this.applySkinTone(tone);

        // Update AvatarManager if it exists
        if (window.avatarManager) {
            window.avatarManager.changeSkinTone(this.getSkinToneKey(tone));
        }
    }

    getSkinToneKey(tone) {
        return Object.keys(this.skinTones).find(key => this.skinTones[key] === tone);
    }

    saveOriginalColors() {
        if (window.avatarBody && window.avatarBody.layers) {
            this.baseParts.forEach(part => {
                const layer = window.avatarBody.layers[part];
                if (layer) {
                    this.originalColors[part] = layer.src;
                }
            });
        }
    }

    applySkinTone(tone) {
        console.log(`Applying skin tone: ${tone.name}`);
        if (window.avatarBody && window.avatarBody.layers) {
            this.baseParts.forEach(part => {
                const layer = window.avatarBody.layers[part];
                if (layer) {
                    console.log(`Applying skin tone to ${part}`);
                    const originalSrc = this.originalColors[part];
                    this.applySkinToneToSVG(layer, tone, originalSrc, part);
                } else {
                    console.warn(`Layer ${part} not found`);
                }
            });
        } else {
            console.error('Avatar body or layers not found');
        }
    }

    applySkinToneToSVG(img, tone, originalSrc, partName) {
        fetch(originalSrc)
            .then(response => response.text())
            .then(svgText => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                
                const paths = svgDoc.querySelectorAll('path, circle, ellipse, rect');
                const colors = this.getUniqueColors(paths);
                const mainColor = this.findMainSkinColor(colors);
                
                paths.forEach(path => {
                    const currentFill = path.getAttribute('fill');
                    if (currentFill && currentFill.toLowerCase() !== 'none') {
                        const newColor = this.getNewColor(currentFill, mainColor, tone);
                        path.setAttribute('fill', newColor);
                    }
                });

                console.log(`Skin tone applied to ${partName}`);

                const serializer = new XMLSerializer();
                const modifiedSvgString = serializer.serializeToString(svgDoc);
                const blob = new Blob([modifiedSvgString], {type: 'image/svg+xml'});
                const url = URL.createObjectURL(blob);
                img.src = url;
            })
            .catch(error => console.error(`Error applying skin tone to ${partName}:`, error));
    }

    getUniqueColors(paths) {
        const colors = new Set();
        paths.forEach(path => {
            const fill = path.getAttribute('fill');
            if (fill && fill.toLowerCase() !== 'none') {
                colors.add(fill.toLowerCase());
            }
        });
        return Array.from(colors);
    }

    findMainSkinColor(colors) {
        return colors.reduce((a, b) => this.getLuminance(a) > this.getLuminance(b) ? a : b);
    }

    getNewColor(currentColor, mainColor, tone) {
        const currentLuminance = this.getLuminance(currentColor);
        const mainLuminance = this.getLuminance(mainColor);
        const luminanceDiff = currentLuminance - mainLuminance;
        
        if (Math.abs(luminanceDiff) < 0.1) {
            return tone.main;
        } else if (luminanceDiff < 0) {
            return tone.shadow;
        } else {
            return this.lightenColor(tone.main, luminanceDiff);
        }
    }

    lightenColor(color, amount) {
        const rgb = this.hexToRgb(color);
        const newRgb = rgb.map(c => Math.min(255, c + Math.round(amount * 255)));
        return `rgb(${newRgb[0]}, ${newRgb[1]}, ${newRgb[2]})`;
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
}

// Create and initialize the SkinToneManager
document.addEventListener('DOMContentLoaded', () => {
    window.skinToneManager = new SkinToneManager();
    window.skinToneManager.initialize();

    // Set initial skin tone based on AvatarManager if it exists
    if (window.avatarManager && window.avatarManager.skinTone) {
        const initialTone = window.skinToneManager.skinTones[window.avatarManager.skinTone];
        if (initialTone) {
            window.skinToneManager.selectSkinTone(initialTone);
        }
    }
});
