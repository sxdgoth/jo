function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = '/index.html'; // Adjust this path if needed
}
