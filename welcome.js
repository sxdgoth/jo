function showWelcomeMessage(username) {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('welcome-message').style.display = 'block';
    document.getElementById('user-name').textContent = username;
}

function logout() {
    sessionStorage.removeItem('loggedInUser');
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('welcome-message').style.display = 'none';
}

// Check if user is logged in when page loads
document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        showWelcomeMessage(loggedInUser.username);
    }
});
