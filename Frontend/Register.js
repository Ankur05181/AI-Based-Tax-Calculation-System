async function register() {

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!username || !email || !password) {
        alert("Please fill all fields");
        return;
    }
    if (password.length < 6) {
    alert("Password must be at least 6 characters");
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
            const error = await response.text();
            alert("Error: " + error);
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