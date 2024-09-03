const GITHUB_REPO = 'https://api.github.com/repos/sxdgoth/jo/contents/users.json';
const GITHUB_TOKEN = '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';

async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    if (username && password) {
        try {
            let users = await fetchUsers();
            if (users.some(user => user.username === username)) {
                alert('Username already exists. Please choose a different username.');
                return;
            }
            users.push({ username, password, coins: 1000 });
            await updateUsers(users);
            alert('Registration successful!');
            // Redirect or update UI as needed
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
    const response = await fetch(GITHUB_REPO, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    });
    const data = await response.json();
    const content = atob(data.content);
    return JSON.parse(content);
}

async function updateUsers(users) {
    const content = btoa(JSON.stringify(users));
    await fetch(GITHUB_REPO, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'Update users',
            content: content,
            sha: await getFileSha()
        })
    });
}

async function getFileSha() {
    const response = await fetch(GITHUB_REPO, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    });
    const data = await response.json();
    return data.sha;
}
