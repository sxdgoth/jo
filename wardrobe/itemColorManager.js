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
        colorPicker.style.position = 'absolute';
        colorPicker.style.zIndex = '1000';
        colorPicker.style.background = 'white';
        colorPicker.style.border = '1px solid black';
        colorPicker.style.padding = '10px';

        Object.entries(this.colorOptions).forEach(([name, hex]) => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.width = '30px';
            colorOption.style.height = '30px';
            colorOption.style.backgroundColor = hex;
            colorOption.style.display = 'inline-block';
            colorOption.style.margin = '5px';
            colorOption.style.cursor = 'pointer';
            colorOption.setAttribute('data-color', hex);
            colorOption.onclick = () => this.changeItemColor(hex);
            colorPicker.appendChild(colorOption);
        });

        document.body.appendChild(colorPicker);
    }

    showColorPicker(item, event) {
        const colorPicker = document.getElementById('color-picker');
        colorPicker.style.display = 'block';
        colorPicker.style.left = `${event.clientX}px`;
        colorPicker.style.top = `${event.clientY}px`;
        colorPicker.setAttribute('data-item-id', item.id);
        event.stopPropagation();
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
        if (window.avatarManager) {
            console.log('Updating item color:', itemId, newColor); // Add this log
            window.avatarManager.updateItemColor(itemId, newColor);
        } else {
            console.error('AvatarManager not found');
        }
    }
}

// Initialize the ItemColorManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.itemColorManager = new ItemColorManager();
    window.itemColorManager.initialize();

    // Close color picker when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('#color-picker')) {
            window.itemColorManager.hideColorPicker();
        }
    });
});
