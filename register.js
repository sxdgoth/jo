async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    if (username && password) {
        try {
            let users = await UserManager.fetchUsers();
            if (users.some(user => user.username === username)) {
                alert('Username already exists. Please choose a different username.');
                return;
            }
            users.push({ username, password, coins: 1000 });
            await UserManager.updateUsers(users);
            alert('Registration successful! You have been awarded 1000 coins.');
            window.location.href = 'home/index.html';
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Error registering user. Please try again.');
        }
    } else {
        alert('Please fill in all fields.');
    }
}

// These functions are no longer needed as they're handled by UserManager
// async function usernameExists(username) { ... }
// async function fetchUsers() { ... }
// async function updateUsers(users) { ... }
