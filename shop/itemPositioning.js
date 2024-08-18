// itemPositioning.js

const itemPositions = {
    Shirt: 'translate(0, 50px) scale(1.1)',
    Jacket: 'translate(0, 40px) scale(1.2)',
    Head: 'translate(0, -70px) scale(1)',
    Body: 'translate(0, 20px) scale(1.05)',
    // Add more item types and their positions as needed
};

function applyItemPositioning() {
    const shopItems = document.querySelectorAll('.shop-item');
    
    shopItems.forEach(item => {
        const itemType = item.querySelector('p:nth-of-type(1)').textContent.split(': ')[1];
        const imageContainer = item.querySelector('.item-image');
        
        if (itemPositions[itemType]) {
            imageContainer.style.transform = itemPositions[itemType];
        }
    });
}

// Expose the function to the global scope
window.applyItemPositioning = applyItemPositioning;
