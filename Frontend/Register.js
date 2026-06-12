async function register() {

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!username || !email || !password) {
        alert("Please fill all fields");
        return;
    }
    const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{2,19}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!usernameRegex.test(username)) {
    alert("Username must start with a letter and be 3-20 characters long.");
    return;
}

if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
}

if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
}
    try {

        const response = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        if (!response.ok) {
            if (response.status === 400) {
    alert("Invalid username or email format.");
    return;
}

const error = await response.text();
alert(error);
            return;
        }

        const msg = await response.text();

       const msgBox =
    document.getElementById("msg");

msgBox.className = "message success";
msgBox.innerText =
    "Registration successful! Redirecting to login...";

    setTimeout(() => {
    window.location.href = "login.html";
    }, 1500);
    } catch (error) {
        console.error(error);
        alert("Server not responding");
    }
}