class HairColorChanger {
    constructor(avatarManager) {
        this.avatarManager = avatarManager;
        this.hairColor = '#1E1E1E'; // Default hair color
        this.tempHairColor = '#1E1E1E'; // Temporary hair color for preview
        this.selectedHairId = null;
    }

    setupHairColorPicker() {
        const colorPicker = document.getElementById('color-picker');
        if (colorPicker) {
            colorPicker.value = this.hairColor;
            colorPicker.addEventListener('input', (event) => {
                this.tempHairColor = event.target.value;
                this.updateHairColorPreview();
            });
        } else {
            console.error('Hair color picker not found');
        }
    }

    setSelectedHair(hairId) {
        this.selectedHairId = hairId;
    }

    updateHairColorPreview() {
        if (this.selectedHairId) {
            const hairLayer = window.avatarBody.layers['Hair'];
            if (hairLayer) {
                this.applyHairColorToSVG(hairLayer, this.tempHairColor);
            }
        }
    }

    updateHairColor() {
        if (this.selectedHairId) {
            const hairLayer = window.avatarBody.layers['Hair'];
            if (hairLayer) {
                this.applyHairColorToSVG(hairLayer, this.hairColor);
            }
        }
    }

    applyHairColor() {
        this.hairColor = this.tempHairColor;
        this.updateHairColor();
    }

    applyHairColorToSVG(svgElement, color) {
        const svgDoc = svgElement.contentDocument;
        if (!svgDoc) return;

        const defaultHairColors = ['#1E1E1E', '#323232', '#464646', '#5A5A5A', '#787878'];
        
        const replaceColor = (element) => {
            ['fill', 'stroke'].forEach(attr => {
                let currentColor = element.getAttribute(attr);
                if (currentColor && defaultHairColors.includes(currentColor.toUpperCase())) {
                    const blendedColor = this.blendColors(currentColor, color, 0.7);
                    element.setAttribute(attr, blendedColor);
                }
            });

            let style = element.getAttribute('style');
            if (style) {
                defaultHairColors.forEach(defaultColor => {
                    const blendedColor = this.blendColors(defaultColor, color, 0.7);
                    style = style.replace(new RegExp(defaultColor, 'gi'), blendedColor);
                });
                element.setAttribute('style', style);
            }

            Array.from(element.children).forEach(replaceColor);
        };

        replaceColor(svgDoc.documentElement);
    }

    blendColors(color1, color2, ratio) {
        const hex = (x) => {
            const hex = Math.round(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
          const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);
        const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
        const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
        const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
        return `#${hex(r)}${hex(g)}${hex(b)}`;
    }
}
