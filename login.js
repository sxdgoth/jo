async function login() {
    console.log('Login function called');
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    try {
        const users = await UserManager.fetchUsers();
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            console.log('User found:', user);
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = 'home/index.html';
        } else {
            console.log('Invalid login attempt');
            alert('Invalid username or password.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
    }
}
