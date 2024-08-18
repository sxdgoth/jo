// skinTone.js

class SkinToneManager {
    constructor() {
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

        Object.values(this.skinTones).forEach(tone => {
            const button = document.createElement('button');
            button.className = 'skin-tone-button';
            button.style.width = '30px';
            button.style.height = '30px';
            button.style.background = `linear-gradient(135deg, ${tone.main} 50%, ${tone.shadow} 50%)`;
            button.style.margin = '0 5px';
            button.style.border = '2px solid #000';
            button.style.borderRadius = '50%';
            button.style.cursor = 'pointer';
            button.title = tone.name;
            button.onclick = () => this.selectSkinTone(tone);
            container.appendChild(button);
        });

        document.body.appendChild(container);
        console.log("Skin tone buttons created and added to body");
    }

    selectSkinTone(tone) {
        this.currentSkinTone = tone;
        console.log(`Selected skin tone: ${tone.name}`);
        
        // Update button styles
        const buttons = document.querySelectorAll('.skin-tone-button');
        buttons.forEach(button => {
            if (button.title === tone.name) {
                button.style.borderColor = '#ff4500';
                button.style.boxShadow = '0 0 5px #ff4500';
            } else {
                button.style.borderColor = '#000';
                button.style.boxShadow = 'none';
            }
        });

        // Apply skin tone to avatar
        this.applySkinTone(tone);
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
                    const originalSrc = this.originalColors[part];
                    this.applySkinToneToSVG(layer, tone, originalSrc);
                } else {
                    console.warn(`Layer ${part} not found`);
                }
            });
        } else {
            console.error('Avatar body or layers not found');
        }
    }

    applySkinToneToSVG(img, tone, originalSrc) {
        fetch(originalSrc)
            .then(response => response.text())
            .then(svgText => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                
                // Create a linear gradient definition
                const defs = svgDoc.createElementNS("http://www.w3.org/2000/svg", "defs");
                const gradient = svgDoc.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
                gradient.setAttribute("id", "skinToneGradient");
                gradient.innerHTML = `
                    <stop offset="0%" stop-color="${tone.main}" />
                    <stop offset="100%" stop-color="${tone.shadow}" />
                `;
                defs.appendChild(gradient);
                svgDoc.documentElement.appendChild(defs);

                const paths = svgDoc.querySelectorAll('path, circle, ellipse, rect');
                paths.forEach(path => {
                    const currentFill = path.getAttribute('fill');
                    if (currentFill && currentFill.toLowerCase() !== 'none') {
                        path.setAttribute('fill', 'url(#skinToneGradient)');
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
});
