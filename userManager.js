const GITHUB_REPO = 'https://raw.githubusercontent.com/sxdgoth/jo/main/users.json';
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
                users = users.map(user => 
                    user.username === loggedInUser.username ? {...user, coins: newCoins} : user
                );
                await this.updateUsers(users);
                return true;
            } catch (error) {
                console.error('Error updating user coins:', error);
                return false;
            }
        }
        return false;
    }

    static getUserCoins() {
        const user = this.getCurrentUser();
        return user ? user.coins : 0;
    }

    static async fetchUsers() {
        const response = await fetch(GITHUB_REPO, {
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        });
        const data = await response.json();
        const content = atob(data.content);
        return JSON.parse(content);
    }

    static async updateUsers(users) {
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
                sha: await this.getFileSha()
            })
        });
    }

    static async getFileSha() {
        const response = await fetch(GITHUB_REPO, {
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        });
        const data = await response.json();
        return data.sha;
    }
}
