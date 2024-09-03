function loadUsers() {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('user_')) {
            const userData = JSON.parse(localStorage.getItem(key));
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${userData.username}</td>
                <td>${userData.coins}</td>
                <td>
                    <input type="number" id="coins_${userData.username}" min="0" value="0">
                    <button onclick="addCoins('${userData.username}')">Add Coins</button>
                </td>
            `;
            userTableBody.appendChild(row);
        }
    }
}

function addCoins(username) {
    const coinsInput = document.getElementById(`coins_${username}`);
    const coinsToAdd = parseInt(coinsInput.value, 10);
    if (isNaN(coinsToAdd) || coinsToAdd < 0) {
        alert('Please enter a valid number of coins.');
        return;
    }

    const userData = JSON.parse(localStorage.getItem(`user_${username}`));
    userData.coins += coinsToAdd;
    localStorage.setItem(`user_${username}`, JSON.stringify(userData));

    loadUsers();
    alert(`Added ${coinsToAdd} coins to ${username}`);
}

document.addEventListener('DOMContentLoaded', loadUsers);
