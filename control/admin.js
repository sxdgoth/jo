const GITHUB_REPO = 'https://raw.githubusercontent.com/sxdgoth/jo/main/users.json';
const GITHUB_TOKEN = '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';

async function loadUsers() {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';

    try {
        const users = await fetchUsers();
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.password}</td>
                <td>${user.coins}</td>
                <td>
                    <input type="number" id="coins_${user.username}" min="0" value="0">
                    <button onclick="addCoins('${user.username}')">Add Coins</button>
                    <button onclick="deleteUser('${user.username}')">Delete User</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Error loading users. Please check the console for details.');
    }
}

async function fetchUsers() {
    const response = await fetch(GITHUB_REPO, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    });
    const data = await response.json();
    const content = atob(data.content);
    return JSON.parse(content);
}

async function updateUsers(users) {
    const content = btoa(JSON.stringify(users));
    await fetch(GITHUB_REPO, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'Update users',
            content: content,
            sha: await getFileSha()
        })
    });
}

async function getFileSha() {
    const response = await fetch(GITHUB_REPO, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    });
    const data = await response.json();
    return data.sha;
}

async function addCoins(username) {
    const coinsInput = document.getElementById(`coins_${username}`);
    const coinsToAdd = parseInt(coinsInput.value, 10);
    if (isNaN(coinsToAdd) || coinsToAdd < 0) {
        alert('Please enter a valid number of coins.');
        return;
    }

  try {
        let users = await fetchUsers();
        const userIndex = users.findIndex(user => user.username === username);
        if (userIndex !== -1) {
            users[userIndex].coins += coinsToAdd;
            await updateUsers(users);
            await loadUsers();
            alert(`Added ${coinsToAdd} coins to ${username}`);
        } else {
            alert('User not found.');
        }
    } catch (error) {
        console.error('Error adding coins:', error);
        alert('Error adding coins. Please check the console for details.');
    }
}

async function deleteUser(username) {
    if (confirm(`Are you sure you want to delete user ${username}?`)) {
        try {
            let users = await fetchUsers();
            users = users.filter(user => user.username !== username);
            await updateUsers(users);
            await loadUsers();
            alert(`User ${username} has been deleted.`);
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please check the console for details.');
        }
    }
}

document.addEventListener('DOMContentLoaded', loadUsers);
