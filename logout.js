function logout() {
    sessionStorage.removeItem('loggedInUser');
    localStorage.removeItem('equippedItems');
    window.location.href = '../index.html';
}
