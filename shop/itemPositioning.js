// itemPositioning.js

const itemPositions = {
    eyes: {
        translateX: '-20px',
        translateY: '150px',
        scale: 5.0
    },
    accessories: {
        translateX: '-20px',
        translateY: '50px',
        scale: 1.5
    },
    shirt: {
        translateX: '0px',
        translateY: '0px',
        scale: 2.5
    },
    pants: {
        translateX: '0px',
        translateY: '-40px',
        scale: 2.0
    },
    jacket: {
        translateX: '0px',
        translateY: '0px',
        scale: 2.5
    },
    eyebrows: {
        translateX: '-20px',
        translateY: '150px',
        scale: 5.0
    },
    mouth: {
        translateX: '-40px',
        translateY: '150px',
        scale: 7.0
    },
    cheeks: {
        translateX: '-20px',
        translateY: '120px',
        scale: 5.0
    },
    nose: {
        translateX: '-40px',
        translateY: '180px',
        scale: 7.0
    },
    hair: {
        translateX: '0px',
        translateY: '30px',
        scale: 1.5
    },
    // Add more item types as needed
};

itemPositions.default = {
    translateX: '0px',
    translateY: '0px',
    scale: 1.2
};

function applyItemPosition(itemElement, itemType) {
    const position = itemPositions[itemType.toLowerCase()] || itemPositions.default;
    itemElement.style.transform = `
        translateX(${position.translateX})
        translateY(${position.translateY})
        scale(${position.scale})
    `;
    itemElement.style.transformOrigin = 'center';
    console.log(`Applied position to ${itemType}:`, itemElement.style.transform);
}

// Make itemPositions and applyItemPosition globally accessible
window.itemPositions = itemPositions;
window.applyItemPosition = applyItemPosition;
