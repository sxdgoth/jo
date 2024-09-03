document.addEventListener('DOMContentLoaded', function() {
    if (!isAdminLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('admin-container').style.display = 'block';
    loadUsers();
});

function isAdminLoggedIn() {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) return false;
    
    // Add additional checks here if needed
    // For example, you could check if the token is expired
    
    return true;
}

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
    localStorage.removeItem('adminToken');
    window.location.href = 'index.html';
}
