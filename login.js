function login() {
    console.log('Login function called');

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    console.log('Username:', username, 'Password:', password);

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        console.log('User found:', user);
        
        // Check if the user has a stored coin balance
        const storedUser = JSON.parse(localStorage.getItem(username));
        if (storedUser) {
            // Use the stored coin balance
            user.coins = storedUser.coins;
        } else {
            // If no stored balance, initialize with the value from registration
            localStorage.setItem(username, JSON.stringify(user));
        }

        // Update the logged in user in localStorage instead of sessionStorage
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        
        window.location.href = 'home/index.html';
    } else {
        console.log('Invalid login attempt');
        alert('Invalid username or password.');
    }
}

function clearLoginForm() {
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
}
