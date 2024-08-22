const itemPositions = {
    eyes: {
       objectPosition: '0px 135%',
        transform: 'scale(2.0)'
    },
    shirt: {
        objectPosition: '0px 25%',
        transform: 'scale(2.0)'
    },
      jacket: {
        objectPosition: '0px 25%',
        transform: 'scale(2.0)'
    },
     pants: {
        objectPosition: '0px 25%',
        transform: 'scale(2.0)'
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
    console.log(`Applied position to ${itemType}:`, 
                `objectPosition: ${itemElement.style.objectPosition}`, 
                `transform: ${itemElement.style.transform}`);
}
