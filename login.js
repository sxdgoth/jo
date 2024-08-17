function login() {
    console.log('Login function called');
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    console.log('Username:', username, 'Password:', password);

    const users = JSON.parse(localStorage.getItem('users')) || []; // Changed to localStorage
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        console.log('User found:', user);
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'home/index.html';
    } else {
        console.log('Invalid login attempt');
        alert('Invalid username or password.');
    }
}





