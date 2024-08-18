// itemPositioning.js

const itemPositions = {
    Jacket: { transform: 'translate(0, 40px) scale(1.1)' },
    Shirt: { transform: 'translate(0, 50px) scale(1.1)' },
    Body: { transform: 'translate(0, 20px) scale(1.05)' },
    Head: { transform: 'translate(0, -70px) scale(1)' },
    // Add more item types as needed
};

function applyItemPositioning() {
    const shopItems = document.querySelectorAll('.shop-item');
    
    shopItems.forEach(item => {
        const itemType = item.querySelector('p:nth-of-type(1)').textContent.split(': ')[1];
        const imageContainer = item.querySelector('.item-image');
        const image = imageContainer.querySelector('img');
        
        if (itemPositions[itemType]) {
            Object.assign(image.style, itemPositions[itemType]);
        }
    });
}
