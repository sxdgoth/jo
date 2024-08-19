const itemPositions = {
    face: {
        objectPosition: '-20px 10%',
        transform: 'scale(1.2)'
    },
    shirt: {
        objectPosition: '20px 25%',
        transform: 'scale(1.5)'
    },
      jacket: {
        objectPosition: '20px 25%',
        transform: 'scale(1.5)'
    },
    // Add more item types as needed
};

itemPositions.default = {
    objectPosition: '0px 50%',
    transform: 'scale(1.2)'
};

function applyItemPosition(itemElement, itemType) {
    const position = itemPositions[itemType] || itemPositions.default;
    itemElement.style.objectPosition = position.objectPosition;
    itemElement.style.transform = position.transform;
    console.log(`Applied position to ${itemType}:`, position.objectPosition, position.transform);
}
