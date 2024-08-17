function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    if (username && password) {
        const newUser = { username, password, coins: 1000 }; // Here we set 1000 coins
        localStorage.setItem('user', JSON.stringify(newUser));
        alert('Registration successful! You can now log in.');
        clearRegisterForm();
    } else {
        alert('Please fill in all fields.');
    }
}
