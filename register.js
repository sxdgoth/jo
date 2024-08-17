function register() {
    console.log('Register function called');

    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    console.log('Username:', username, 'Password:', password);

    if (username && password) {
        if (usernameExists(username)) {
            console.log('Username already exists');
            alert('Username already exists. Please choose a different username.');
            return;
        }

        const newUser = { username, password, coins: 1000 };
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        console.log('Existing users:', users);
        
        users.push(newUser);
        
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Updated users:', users);
        
        alert('Registration successful! You have been awarded 1000 coins. You can now log in.');
        clearRegisterForm();
    } else {
        console.log('Empty fields');
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
