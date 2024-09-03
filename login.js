const GITHUB_TOKEN = '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';

async function login() {
    console.log('Login function called');
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

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
    try {
        const response = await fetch(GITHUB_REPO);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        console.log('Fetched content:', content);
        const users = JSON.parse(content);
        console.log('Parsed users:', users);
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

