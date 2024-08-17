function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.username === username && storedUser.password === password) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(storedUser));
        window.location.href = 'shop/index.html';
    } else {
        alert('Invalid username or password.');
    }
}

function clearLoginForm() {
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
}
