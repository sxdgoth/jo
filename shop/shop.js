document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        document.getElementById('user-name').textContent = loggedInUser.username;
        document.getElementById('user-coins').textContent = loggedInUser.coins;
    } else {
        window.location.href = '../index.html';
    }
});

function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = '../index.html';
}
