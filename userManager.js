// userManager.js

class UserManager {
    static getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('loggedInUser'));
    }

    static updateUserCoins(newCoins) {
        const loggedInUser = this.getCurrentUser();
        if (loggedInUser) {
            loggedInUser.coins = newCoins;
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            // Update in localStorage
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users = users.map(user => 
                user.username === loggedInUser.username ? {...user, coins: newCoins} : user
            );
            localStorage.setItem('users', JSON.stringify(users));

            return true;
        }
        return false;
    }

    static getUserCoins() {
        const user = this.getCurrentUser();
        return user ? user.coins : 0;
    }
}
