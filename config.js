const GITHUB_REPO = 'https://api.github.com/repos/sxdgoth/jo/contents/users.json';
const GITHUB_TOKEN = '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';

async function fetchUsers() {
    try {
        const response = await fetch(GITHUB_REPO, {
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const content = Base64.decode(data.content);
        return JSON.parse(content);
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

async function updateUsers(users) {
    try {
        const content = Base64.encode(JSON.stringify(users, null, 2));
        const sha = await getFileSha();
        const response = await fetch(GITHUB_REPO, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Update users',
                content: content,
                sha: sha
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Users file updated successfully');
    } catch (error) {
        console.error('Error updating users file:', error);
        throw error;
    }
}

async function getFileSha() {
    try {
        const response = await fetch(GITHUB_REPO, {
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.sha;
    } catch (error) {
        console.error('Error getting file SHA:', error);
        throw error;
    }
}
