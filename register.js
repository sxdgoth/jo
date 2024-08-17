function register() {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (username && email && password) {
        // In a real application, you would send this data to a server
        // For this example, we'll just store it in localStorage
        localStorage.setItem('user', JSON.stringify({ username, email, password }));
        alert('Registration successful! You can now log in.');
        clearRegisterForm();
    } else {
        alert('Please fill in all fields.');
    }
}

function clearRegisterForm() {
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-password').value = '';
}
