function login() {
    let username = document.getElementById("username");
    let password = document.getElementById("password");

    if (!(username.value == 0)) {
        username.className = "input-login";
        username.placeholder = "Username";
        if (password.value.length >= 5) {
            password.className = "input-login";
            password.placeholder = "Password";
            return true;
        }
        else {
            password.className = "error";
            password.placeholder = "Invalid password";
            return false;
        }
    }
    else {
        username.className = "error";
        username.placeholder = "Invalid username";
        if (password.value.length >= 5) {
            password.className = "input-login";
            password.placeholder = "Password";
            return true;
        }
        else {
            password.className = "error";
            password.placeholder = "Invalid password";
            return false;
        }
    }
}