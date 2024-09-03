const GITHUB_TOKEN = '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';

async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    if (username && password) {
        try {
            const response = await fetch('/api/register', {
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
                alert('Registration successful! You have been awarded 1000 coins.');
                window.location.href = 'home/index.html';
            } else {
                alert(data.message || 'Error registering user. Please try again.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Error registering user. Please try again.');
        }
    } else {
        alert('Please fill in all fields.');
    }
}

async function usernameExists(username) {
    const users = await fetchUsers();
    return users.some(user => user.username === username);
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



async function updateUsers(users) {
    console.log('Attempting to update users:', users);
    alert('User registration successful! However, automatic updating of the users file is not possible. Please manually update the users.json file in your GitHub repository.');
    // In a real application, you would send this data to a server to update the file
}

