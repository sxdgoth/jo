function login() {
    console.log('Login function called');

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    console.log('Username:', username, 'Password:', password);

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        console.log('User found:', user);
        
        // Load user-specific data
        const storedUser = JSON.parse(localStorage.getItem(username));
        if (storedUser) {
            // Use the stored data, including inventory
            user.coins = storedUser.coins;
            user.inventory = storedUser.inventory || [];
        } else {
            // If no stored data, initialize with default values
            user.coins = user.coins || 1000; // Default to 1000 if not set
            user.inventory = [];
            localStorage.setItem(username, JSON.stringify(user));
        }

        // Update the logged in user in localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        
        window.location.href = 'home/index.html';
    } else {
        console.log('Invalid login attempt');
        alert('Invalid username or password.');
    }
}



