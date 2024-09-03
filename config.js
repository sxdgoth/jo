const GITHUB_REPO = 'https://raw.githubusercontent.com/sxdgoth/jo/main/users.json';

function fetchUsers() {
    return fetch(GITHUB_REPO)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(content => {
            console.log('Fetched content:', content);
            const users = JSON.parse(content);
            console.log('Parsed users:', users);
            return users;
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            throw error;
        });
}
