function showWelcomeMessage(username) {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('welcome-message').style.display = 'block';
    document.getElementById('user-name').textContent = username;
}

function logout() {
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('welcome-message').style.display = 'none';
}
