const GITHUB_TOKEN = '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';

async function login() {
    console.log('Login function called');
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            console.log('User logged in:', data.user);
            sessionStorage.setItem('loggedInUser', JSON.stringify(data.user));
            window.location.href = 'home/index.html';
        } else {
            console.log('Invalid login attempt');
            alert(data.message || 'Invalid username or password.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
    }
}
