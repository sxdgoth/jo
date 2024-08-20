class ItemColorManager {
    constructor() {
        this.colorableColors = ['#346799', '#325880', '#3676b2', '#3c93e5', '#3fa2ff'];
        this.colorOptions = {
            'black': '#000000',
            'green': '#00FF00',
            'red': '#FF0000',
            'pink': '#FFC0CB',
            'purple': '#800080',
            'gray': '#808080'
        };
        this.currentItemColors = {};
    }

    initialize() {
        this.setupColorPicker();
    }

    setupColorPicker() {
        const colorPicker = document.createElement('div');
        colorPicker.id = 'color-picker';
        colorPicker.style.display = 'none';

        Object.entries(this.colorOptions).forEach(([name, hex]) => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = hex;
            colorOption.setAttribute('data-color', hex);
            colorOption.onclick = () => this.changeItemColor(hex);
            colorPicker.appendChild(colorOption);
        });

        document.body.appendChild(colorPicker);
    }

    showColorPicker(item, event) {
        const colorPicker = document.getElementById('color-picker');
        colorPicker.style.display = 'block';
        colorPicker.style.position = 'absolute';
        colorPicker.style.left = `${event.clientX}px`;
        colorPicker.style.top = `${event.clientY}px`;
        colorPicker.setAttribute('data-item-id', item.id);
    }

    hideColorPicker() {
        const colorPicker = document.getElementById('color-picker');
        colorPicker.style.display = 'none';
    }

    changeItemColor(newColor) {
        const colorPicker = document.getElementById('color-picker');
        const itemId = colorPicker.getAttribute('data-item-id');
        this.currentItemColors[itemId] = newColor;
        this.hideColorPicker();
        window.avatarManager.updateTempAvatarDisplay();
    }

    applyItemColor(svgDoc, itemId) {
        const newColor = this.currentItemColors[itemId];
        if (!newColor) return;

        const replaceColor = (element) => {
            ['fill', 'stroke'].forEach(attr => {
                let color = element.getAttribute(attr);
                if (color && this.colorableColors.includes(color.toUpperCase())) {
                    element.setAttribute(attr, newColor);
                }
            });

            let style = element.getAttribute('style');
            if (style) {
                this.colorableColors.forEach(colorableColor => {
                    style = style.replace(new RegExp(colorableColor, 'gi'), newColor);
                });
                element.setAttribute('style', style);
            }

            Array.from(element.children).forEach(replaceColor);
        };

        replaceColor(svgDoc.documentElement);
    }
}

// Initialize the ItemColorManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.itemColorManager = new ItemColorManager();
    window.itemColorManager.initialize();
});
