// hairColorChanger.js

class HairColorChanger {
    constructor() {
        this.hairColor = '#1E1E1E'; // Default hair color
        this.selectedHairId = null;
        this.setupHairColorPicker();
    }

    setupHairColorPicker() {
        const hairColorPicker = document.getElementById('color-picker');
        if (hairColorPicker) {
            this.hairColor = localStorage.getItem('hairColor') || this.hairColor;
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
        localStorage.setItem('hairColor', newColor);
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
            const currentColor = path.getAttribute('fill');
            if (currentColor && defaultHairColors.includes(currentColor.toUpperCase())) {
                const blendedColor = this.blendColors(currentColor, this.hairColor, 0.7);
                path.setAttribute('fill', blendedColor);
            }
        });
    }

    blendColors(color1, color2, ratio) {
        const hex = (x) => {
            x = x.toString(16);
            return (x.length === 1) ? '0' + x : x;
        };
        
        const r1 = parseInt(color1.substring(1, 3), 16);
        const g1 = parseInt(color1.substring(3, 5), 16);
        const b1 = parseInt(color1.substring(5, 7), 16);
        
        const r2 = parseInt(color2.substring(1, 3), 16);
        const g2 = parseInt(color2.substring(3, 5), 16);
        const b2 = parseInt(color2.substring(5, 7), 16);
        
        const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
        const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
        const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
        
        return `#${hex(r)}${hex(g)}${hex(b)}`;
    }
}

// Initialize the HairColorChanger when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hairColorChanger = new HairColorChanger();
});
