// initShop.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    if (typeof shopItems !== 'undefined' && Array.isArray(shopItems)) {
        console.log('Shop items loaded:', shopItems);
        const shopManager = new ShopManager(shopItems);
        shopManager.initShop();
    } else {
        console.error('Shop items not found or not an array');
    }
});
