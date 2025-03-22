function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var error = document.getElementById('error');

    if (username === 'admin' && password === 'admin') {
        // Save login state and redirect to main page
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        error.textContent = 'Invalid username or password';
    }
}
