const itemPositions = {
    eyes: {
        translateX: '0px',
        translateY: '60px',
        scale: 3.5
    },
    face: {
        translateX: '0px',
        translateY: '0px',
        scale: 1.5
    },
    shirt: {
        translateX: '10px',
        translateY: '0px',
        scale: 2.0
    },
    pants: {
        translateX: '10px',
        translateY: '0px',
        scale: 2.0
    },
    // Add more item types as needed
};

itemPositions.default = {
    translateX: '0px',
    translateY: '0px',
    scale: 1.2
};

function applyItemPosition(itemElement, itemType) {
    const position = itemPositions[itemType] || itemPositions.default;
    itemElement.style.transform = `
        translateX(${position.translateX})
        translateY(${position.translateY})
        scale(${position.scale})
    `;
    console.log(`Applied position to ${itemType}:`, itemElement.style.transform);
}
