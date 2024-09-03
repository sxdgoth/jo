const GITHUB_REPO = 'https://api.github.com/repos/sxdgoth/jo/contents/users.json';
const GITHUB_TOKEN = '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';

class UserManager {
    static getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('loggedInUser'));
    }

    static async updateUserCoins(newCoins) {
        const loggedInUser = this.getCurrentUser();
        if (loggedInUser) {
            loggedInUser.coins = newCoins;
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            
            try {
                let users = await this.fetchUsers();
                const updatedUsers = users.map(user => 
                    user.username === loggedInUser.username ? {...user, coins: newCoins} : user
                );
                await this.updateUsers(updatedUsers);
                console.log('Users file updated with new coin balance');
            } catch (error) {
                console.error('Error updating users file:', error);
                alert('Coins updated locally. Failed to update the users.json file in the GitHub repository.');
            }
            
            return true;
        }
        return false;
    }

    static getUserCoins() {
        const user = this.getCurrentUser();
        return user ? user.coins : 0;
    }

    static async fetchUsers() {
        try {
            const response = await fetch(GITHUB_REPO, {
                headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const content = atob(data.content);
            return JSON.parse(content);
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    static async updateUsers(users) {
        try {
            const content = btoa(JSON.stringify(users, null, 2)); // Pretty print JSON
            const sha = await this.getFileSha();
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

    static async getFileSha() {
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
}
