const GITHUB_REPO = 'https://api.github.com/repos/sxdgoth/sxdgoth/contents/users.json';
const GITHUB_TOKEN = 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN';

async function login() {
    console.log('Login function called');
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    console.log('Username:', username, 'Password:', password);

    try {
        const users = await fetchUsers();
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

async function fetchUsers() {
    const response = await fetch(GITHUB_REPO, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    });
    const data = await response.json();
    const content = atob(data.content);
    return JSON.parse(content);
}
