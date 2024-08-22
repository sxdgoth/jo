const itemPositions = {
    eyes: {
        translateX: '-20px',
        translateY: '100px',
        scale: 5.0
    },
    face: {
        translateX: '0px',
        translateY: '0px',
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
        translateX: '10px',
        translateY: '0px',
        scale: 2.0
    },
      mouth: {
        translateX: '10px',
        translateY: '0px',
        scale: 2.0
    },
       cheeks: {
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
