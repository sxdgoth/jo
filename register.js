function register() {
    console.log('Register function called');

    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    console.log('Username:', username, 'Password:', password);

    if (username && password) {
        console.log('Checking if username exists...');
        if (usernameExists(username)) {
            console.log('Username already exists');
            alert('Username already exists. Please choose a different username.');
            return;
        }

        const newUser = { username, password, coins: 1000 };
        
        let users = getUsersFromStorage();
        console.log('Existing users:', users);
        
        users.push(newUser);
        
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Updated users:', users);
        
        alert('Registration successful! You have been awarded 1000 coins. You will now be redirected to the home page.');
        sessionStorage.setItem('loggedInUser', JSON.stringify(newUser));
        window.location.href = 'home/index.html';
    } else {
        console.log('Empty fields');
        alert('Please fill in all fields.');
    }
}

function usernameExists(username) {
    const users = getUsersFromStorage();
    console.log('Users in usernameExists:', users);
    console.log('Type of users:', typeof users);
    if (!Array.isArray(users)) {
        console.error('Users is not an array:', users);
        return false;
    }
    return users.some(user => user.username === username);
}

function getUsersFromStorage() {
    const usersData = localStorage.getItem('users');
    if (!usersData) return [];
    try {
        const users = JSON.parse(usersData);
        return Array.isArray(users) ? users : [];
    } catch (error) {
        console.error('Error parsing users data:', error);
        return [];
    }
}

function usernameExists(username) {
    const users = getUsersFromStorage();
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            return true;
        }
    }
    return false;
}


// Clear users data (use this carefully)
function clearUsersData() {
    localStorage.removeItem('users');
    console.log('Users data cleared');
}

// Expose the function globally
window.clearUsersData = clearUsersData;
