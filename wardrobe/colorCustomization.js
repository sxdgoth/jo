document.addEventListener('DOMContentLoaded', function() {
    const customizeColorsBtn = document.getElementById('customize-colors-btn');
    const colorCustomization = document.getElementById('color-customization');

    customizeColorsBtn.addEventListener('click', function() {
        if (colorCustomization.style.display === 'none') {
            colorCustomization.style.display = 'block';
            customizeColorsBtn.textContent = 'Hide Color Options';
        } else {
            colorCustomization.style.display = 'none';
            customizeColorsBtn.textContent = 'Customize Colors';
        }
    });
});
