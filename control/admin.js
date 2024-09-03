document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
        return;
    }

    loadUsers();
});

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userList = document.getElementById('users');
    userList.innerHTML = '';

    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.username} - Coins: ${user.coins}`;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteUser(user.username);
        
        li.appendChild(deleteButton);
        userList.appendChild(li);
    });
}

function deleteUser(username) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(user => user.username !== username);
    localStorage.setItem('users', JSON.stringify(users));
    loadUsers();
}

function sendCoins() {
    const recipient = document.getElementById('recipient').value;
    const amount = parseInt(document.getElementById('amount').value);

    if (!recipient || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid recipient and amount.');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const recipientUser = users.find(user => user.username === recipient);

    if (!recipientUser) {
        alert('Recipient not found.');
        return;
    }

    recipientUser.coins += amount;
    localStorage.setItem('users', JSON.stringify(users));
    loadUsers();
    alert(`Successfully sent ${amount} coins to ${recipient}.`);
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin-login.html';
}
