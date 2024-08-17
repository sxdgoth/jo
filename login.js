function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'shop/index.html';
    } else {
        alert('Invalid username or password.');
    }
}

function clearLoginForm() {
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
}
