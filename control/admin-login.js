function adminLogin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    // Replace these with your actual admin credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'adminpass123';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Use a more secure method to indicate admin login
        localStorage.setItem('adminToken', btoa(username + ':' + new Date().getTime()));
        window.location.href = 'admin.html';
    } else {
        alert('Invalid admin credentials');
    }
}
