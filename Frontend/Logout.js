function logout() {

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");

    alert("Logged out successfully!");

    window.location.href = "login.html";
}

function goBack() {

    const token = sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    window.location.href = "index.html";
}