// =========================
// AUTH CHECK
// =========================
(function authCheck() {

    const currentPage =
        window.location.pathname;

    const token =
        sessionStorage.getItem("token");

    // Protected Pages
    if (
        currentPage.includes("index.html")
    ) {

        if (
            !token ||
            token === "null" ||
            token.trim() === ""
        ) {

            alert("Please login first");

            window.location.href =
                "login.html";
        }
    }

})();


// =========================
// LOGIN FUNCTION
// =========================
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

    if (!username || !password) {

        if (msgBox) {

            msgBox.innerText =
                "Please enter username and password";
        }

        return;
    }

    try {

        const response =
            await fetch(
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
                    token;
            }

            return;
        }

        // Save JWT
        sessionStorage.setItem(
            "token",
            token.trim()
        );

        sessionStorage.setItem(
            "username",
            username
        );

        alert("Login Successful");

        window.location.href =
            "index.html";

    } catch (error) {

        console.error(error);

        if (msgBox) {

            msgBox.innerText =
                "Server not responding";
        }
    }
}


// =========================
// REGISTER FUNCTION
// =========================
async function register() {

    const username =
        document.getElementById("username")
            .value
            .trim();

    const email =
        document.getElementById("email")
            .value
            .trim();

    const password =
        document.getElementById("password")
            .value
            .trim();

    if (
        !username ||
        !email ||
        !password
    ) {

        alert(
            "Please fill all fields"
        );

        return;
    }

    try {

        const response =
            await fetch(
                "http://localhost:8080/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    })
                }
            );

        const result =
            await response.text();

        if (!response.ok) {

            alert(result);

            return;
        }

        alert(result);

        window.location.href =
            "login.html";

    } catch (error) {

        console.error(error);

        alert(
            "Server not responding"
        );
    }
}


// =========================
// LOGOUT
// =========================
function logout() {

    sessionStorage.clear();

    alert(
        "Logged out successfully"
    );

    window.location.href =
        "login.html";
}


// =========================
// CANCEL LOGOUT
// =========================
function goBack() {

    window.location.href =
        "index.html";
}


// =========================
// JWT USERNAME EXTRACTION
// =========================
function getUsernameFromToken(
    token
) {

    if (!token) return null;

    try {

        const payload =
            JSON.parse(
                atob(
                    token.split(".")[1]
                )
            );

        return payload.sub;

    } catch (error) {

        console.error(
            "Invalid token",
            error
        );

        return null;
    }
}