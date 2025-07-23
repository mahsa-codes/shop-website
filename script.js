const welcomel = document.getElementById('welcome');
const logoutBtn = document.getElementById('logoutBtn');

let currentUser = localStorage.getItem("user");
if (currentUser && welcomel) {
    let parsedUser = JSON.parse(currentUser);
    welcomel.innerHTML = `Hello ${parsedUser.name}`;
    if (logoutBtn) logoutBtn.classList.remove('hidden');
} else if (welcomel) {
    welcomel.innerHTML = `Hello Please <a href='login.html'>login</a>`;
}


if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem("user");
        window.location.href = "login.html";
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        let users = JSON.parse(localStorage.getItem("users")) || {};
        let user = users[username];

        if (user) {
            if (user.password === password) {
                localStorage.setItem("user", JSON.stringify(user));
                window.location.href = "index.html";
            } else {
                alert("Password is Incorrect");
            }
        } else {
            alert("Username not found");
        }
    });
}


const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert("The Passwords do not match");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || {};
        if (users[username]) {
            alert("Username already exists");
            return;
        }

        const user = { name, username, password };
        users[username] = user;
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registering is successful. Please Login!");
        window.location.href = "login.html";
    });
}