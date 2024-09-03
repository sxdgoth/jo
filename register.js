const GITHUB_REPO = 'https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO_NAME/contents/users.json';
const GITHUB_TOKEN = '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';

async function register() {
    console.log('Register function called');
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    console.log('Username:', username, 'Password:', password);

    if (username && password) {
        console.log('Checking if username exists...');
        if (await usernameExists(username)) {
            console.log('Username already exists');
            alert('Username already exists. Please choose a different username.');
            return;
        }

        const newUser = { username, password, coins: 1000 };
        
        try {
            let users = await fetchUsers();
            users.push(newUser);
            await updateUsers(users);
            
            alert('Registration successful! You have been awarded 1000 coins. You will now be redirected to the home page.');
            sessionStorage.setItem('loggedInUser', JSON.stringify(newUser));
            window.location.href = 'home/index.html';
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error registering user. Please try again.');
        }
    } else {
        console.log('Empty fields');
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
