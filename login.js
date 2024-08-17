function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // In a real application, you would verify credentials with a server
    // For this example, we'll just check against localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.username === username && storedUser.password === password) {
        showWelcomeMessage(username);
        clearLoginForm();
    } else {
        alert('Invalid username or password.');
    }
}

function clearLoginForm() {
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
}
