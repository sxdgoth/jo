function applySkinToneToAvatar() {
    const avatarDisplay = window.avatarDisplay;
    if (!avatarDisplay) {
        console.error('Avatar display not found');
        return;
    }

    const currentSkinTone = avatarDisplay.skinTone;
    const skinToneColors = avatarDisplay.skinTones[currentSkinTone];

    if (!skinToneColors) {
        console.error('Invalid skin tone');
        return;
    }

    const svgElements = document.querySelectorAll('#avatar-display object');
    svgElements.forEach(svgElement => {
        if (svgElement.contentDocument) {
            replaceSkinToneInSVG(svgElement.contentDocument, skinToneColors, svgElement.dataset.type);
        } else {
            svgElement.addEventListener('load', () => {
                replaceSkinToneInSVG(svgElement.contentDocument, skinToneColors, svgElement.dataset.type);
            });
        }
    });
}

function replaceSkinToneInSVG(svgDoc, newColors, itemType) {
    const elements = svgDoc.querySelectorAll('*');
    elements.forEach(el => {
        ['fill', 'stroke'].forEach(attr => {
            const color = el.getAttribute(attr);
            if (color) {
                let newColor = null;
                switch (itemType.toLowerCase()) {
                    case 'eyes':
                    case 'nose':
                    case 'mouth':
                    case 'face':
                        newColor = getFacialFeatureColor(color, newColors);
                        break;
                    default:
                        newColor = getBodyColor(color, newColors);
                }
                if (newColor) {
                    el.setAttribute(attr, newColor);
                }
            }
        });
    });
}

function getBodyColor(currentColor, newColors) {
    switch (currentColor.toLowerCase()) {
        case '#fee2ca': return newColors.main;
        case '#efc1b7': return newColors.shadow;
        default: return null;
    }
}

function getFacialFeatureColor(currentColor, newColors) {
    // Define color mappings for facial features
    const colorMap = {
        '#fee2ca': newColors.main,
        '#efc1b7': newColors.shadow,
        // Add more mappings for lips, cheeks, etc.
        '#ffcab5': adjustColor(newColors.main, -20),  // Slightly darker for lips
        '#ffd3c2': adjustColor(newColors.main, 10),   // Slightly lighter for cheeks
    };
    return colorMap[currentColor.toLowerCase()] || null;
}

function adjustColor(color, amount) {
    const rgb = hexToRgb(color);
    const newRgb = rgb.map(c => Math.max(0, Math.min(255, c + amount)));
    return rgbToHex(newRgb[0], newRgb[1], newRgb[2]);
}

function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Call this function after the avatar is loaded
document.addEventListener('DOMContentLoaded', () => {
    const checkAvatarLoaded = setInterval(() => {
        if (window.avatarDisplay && window.avatarDisplay.loadAvatar) {
            clearInterval(checkAvatarLoaded);
            const originalLoadAvatar = window.avatarDisplay.loadAvatar;
            window.avatarDisplay.loadAvatar = function() {
                originalLoadAvatar.call(this);
                setTimeout(applySkinToneToAvatar, 500); // Wait for SVGs to load
            };
        }
    }, 100);
});

// Override the tryOnItem method to apply skin tone after trying on an item
document.addEventListener('DOMContentLoaded', () => {
    const checkAvatarLoaded = setInterval(() => {
        if (window.avatarDisplay && window.avatarDisplay.tryOnItem) {
            clearInterval(checkAvatarLoaded);
            const originalTryOnItem = window.avatarDisplay.tryOnItem;
            window.avatarDisplay.tryOnItem = function(item) {
                originalTryOnItem.call(this, item);
                setTimeout(applySkinToneToAvatar, 500); // Wait for SVG to load
            };
        }
    }, 100);
});
