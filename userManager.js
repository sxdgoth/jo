const GITHUB_TOKEN = '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';

class UserManager {
    static getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('loggedInUser'));
    }

    static async updateUserCoins(newCoins) {
        const loggedInUser = this.getCurrentUser();
        if (loggedInUser) {
            try {
                const response = await fetch('/api/updateCoins', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: loggedInUser.username, coins: newCoins }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    loggedInUser.coins = newCoins;
                    sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
                    console.log('Coins updated successfully');
                    return true;
                } else {
                    throw new Error(data.message || 'Failed to update coins');
                }
            } catch (error) {
                console.error('Error updating coins:', error);
                alert('Failed to update coins. Please try again.');
                return false;
            }
        }
        return false;
    }

    static getUserCoins() {
        const user = this.getCurrentUser();
        return user ? user.coins : 0;
    }
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
