function loadUsers() {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';

    const users = JSON.parse(localStorage.getItem('users')) || [];

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>${user.coins}</td>
            <td>
                <input type="number" id="coins_${user.username}" min="0" value="0">
                <button onclick="addCoins('${user.username}')">Add Coins</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

function addCoins(username) {
    const coinsInput = document.getElementById(`coins_${username}`);
    const coinsToAdd = parseInt(coinsInput.value, 10);
    if (isNaN(coinsToAdd) || coinsToAdd < 0) {
        alert('Please enter a valid number of coins.');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex !== -1) {
        users[userIndex].coins += coinsToAdd;
        localStorage.setItem('users', JSON.stringify(users));

        // Update session storage if the user is currently logged in
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser && loggedInUser.username === username) {
            loggedInUser.coins += coinsToAdd;
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        }

        loadUsers();
        alert(`Added ${coinsToAdd} coins to ${username}`);
    } else {
        alert('User not found.');
    }
}

document.addEventListener('DOMContentLoaded', loadUsers);
