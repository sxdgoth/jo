// skinTone.js

class SkinToneManager {
    constructor() {
        this.skinTones = [
            { name: 'Light', color: '#FFD5B8' },
            { name: 'Medium', color: '#E5B887' },
            { name: 'Tan', color: '#C68642' },
            { name: 'Dark', color: '#8D5524' }
        ];
        this.currentSkinTone = this.skinTones[0].color;
        this.baseParts = ['Legs', 'Arms', 'Body', 'Head'];
        this.originalColors = {};
    }

    initialize() {
        console.log("SkinToneManager initializing...");
        this.createSkinToneButtons();
        this.saveOriginalColors();
    }

    createSkinToneButtons() {
        console.log("Creating skin tone buttons...");
        const container = document.createElement('div');
        container.id = 'skin-tone-buttons';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.zIndex = '1000';
        container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        container.style.padding = '5px';
        container.style.borderRadius = '5px';

        this.skinTones.forEach(tone => {
            const button = document.createElement('button');
            button.className = 'skin-tone-button';
            button.style.width = '30px';
            button.style.height = '30px';
            button.style.backgroundColor = tone.color;
            button.style.margin = '0 5px';
            button.style.border = '2px solid #000';
            button.style.borderRadius = '50%';
            button.style.cursor = 'pointer';
            button.title = tone.name;
            button.onclick = () => this.selectSkinTone(tone.color);
            container.appendChild(button);
        });

        document.body.appendChild(container);
        console.log("Skin tone buttons created and added to body");
    }

    selectSkinTone(color) {
        this.currentSkinTone = color;
        console.log(`Selected skin tone: ${color}`);
        
        // Update button styles
        const buttons = document.querySelectorAll('.skin-tone-button');
        buttons.forEach(button => {
            if (button.style.backgroundColor === color) {
                button.style.borderColor = '#ff4500';
                button.style.boxShadow = '0 0 5px #ff4500';
            } else {
                button.style.borderColor = '#000';
                button.style.boxShadow = 'none';
            }
        });

        // Apply skin tone to avatar
        this.applySkinTone(color);
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

    applySkinTone(color) {
        console.log(`Applying skin tone: ${color}`);
        if (window.avatarBody && window.avatarBody.layers) {
            this.baseParts.forEach(part => {
                const layer = window.avatarBody.layers[part];
                if (layer) {
                    // Always start from the original SVG
                    const originalSrc = this.originalColors[part];
                    this.applySkinToneToSVG(layer, color, originalSrc);
                } else {
                    console.warn(`Layer ${part} not found`);
                }
            });
        } else {
            console.error('Avatar body or layers not found');
        }
    }

    applySkinToneToSVG(img, newColor, originalSrc) {
        fetch(originalSrc)
            .then(response => response.text())
            .then(svgText => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                
                const paths = svgDoc.querySelectorAll('path, circle, ellipse, rect');
                paths.forEach(path => {
                    const currentFill = path.getAttribute('fill');
                    if (currentFill && currentFill.toLowerCase() !== 'none') {
                        const newFill = this.blendColors(currentFill, newColor);
                        path.setAttribute('fill', newFill);
                    }
                });

                const serializer = new XMLSerializer();
                const modifiedSvgString = serializer.serializeToString(svgDoc);
                const blob = new Blob([modifiedSvgString], {type: 'image/svg+xml'});
                const url = URL.createObjectURL(blob);
                img.src = url;
            })
            .catch(error => console.error('Error applying skin tone:', error));
    }

    blendColors(color1, color2) {
        const [r1, g1, b1] = this.hexToRgb(color1);
        const [r2, g2, b2] = this.hexToRgb(color2);
        
        const r = Math.round((r1 + r2) / 2);
        const g = Math.round((g1 + g2) / 2);
        const b = Math.round((b1 + b2) / 2);
        
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
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
});
