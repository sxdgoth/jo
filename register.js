function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    if (username && password) {
        // Check if the username already exists
        if (usernameExists(username)) {
            alert('Username already exists. Please choose a different username.');
            return;
        }

        const newUser = { username, password, coins: 1000 };
        
        // Get existing users or initialize an empty array
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Add the new user
        users.push(newUser);
        
        // Save the updated users array
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Registration successful! You have been awarded 1000 coins. You can now log in.');
        clearRegisterForm();
    } else {
        alert('Please fill in all fields.');
    }
}

function usernameExists(username) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(user => user.username === username);
}

function clearRegisterForm() {
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
}
