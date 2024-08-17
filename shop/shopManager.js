document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items-container');
    const selectedItemsList = document.getElementById('selected-items-list');
    const totalPriceElement = document.getElementById('total-price');
    const buyButton = document.getElementById('buy-button');

    let selectedItems = [];

    function renderShopItems() {
        shopItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('shop-item');
            itemElement.innerHTML = `
                <img src="${item.path}${item.id}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Type: ${item.type}</p>
                <p>Price: $${item.price}</p>
            `;
            itemElement.addEventListener('click', () => toggleItemSelection(item, itemElement));
            itemsContainer.appendChild(itemElement);
        });
    }

    function toggleItemSelection(item, itemElement) {
        const index = selectedItems.findIndex(i => i.id === item.id);
        if (index === -1) {
            selectedItems.push(item);
            itemElement.classList.add('selected');
        } else {
            selectedItems.splice(index, 1);
            itemElement.classList.remove('selected');
        }
        updateSelectedItemsList();
    }

    function updateSelectedItemsList() {
        selectedItemsList.innerHTML = '';
        let total = 0;
        selectedItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price}`;
            selectedItemsList.appendChild(li);
            total += item.price;
        });
        totalPriceElement.textContent = total;
    }

    buyButton.addEventListener('click', () => {
        if (selectedItems.length > 0) {
            alert(`Thank you for your purchase! Total: $${totalPriceElement.textContent}`);
            selectedItems = [];
            updateSelectedItemsList();
            document.querySelectorAll('.shop-item.selected').forEach(item => item.classList.remove('selected'));
        } else {
            alert('Please select at least one item before buying.');
        }
    });

    renderShopItems();
});
