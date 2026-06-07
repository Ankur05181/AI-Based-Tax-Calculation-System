async function login() {

    const username =
        document.getElementById("username")
            .value
            .trim();

    const password =
        document.getElementById("password")
            .value
            .trim();

    const msgBox =
        document.getElementById("msg");

    // Validation
    if (!username || !password) {

        if (msgBox) {
            msgBox.innerText =
                "Please enter username and password";
        } else {
            alert(
                "Please enter username and password"
            );
        }

        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            }
        );

        const token =
            await response.text();

        if (!response.ok) {

            if (msgBox) {
                msgBox.innerText =
                    "Login failed: " + token;
            } else {
                alert(
                    "Login failed: " + token
                );
            }

            return;
        }

        // Store token for current session only
        sessionStorage.setItem(
            "token",
            token.trim()
        );

        sessionStorage.setItem(
            "username",
            username
        );

        msgBox.className = "message success";
        msgBox.innerText = "Login successful! Redirecting...";

        setTimeout(() => {
        window.location.href = "index.html";
        }, 1500);
    } catch (error) {

        console.error(error);

        if (msgBox) {
            msgBox.innerText =
                "Server not responding";
        } else {
            alert(
                "Server not responding"
            );
        }
    }
}