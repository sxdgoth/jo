document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'index.html';
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

function exportData() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "users_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importData() {
    const fileInput = document.getElementById('import-file');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const users = JSON.parse(e.target.result);
                localStorage.setItem('users', JSON.stringify(users));
                loadUsers();
                alert('Data imported successfully!');
            } catch (error) {
                alert('Error importing data. Please make sure the file is valid JSON.');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please select a file to import.');
    }
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'index.html';
}

