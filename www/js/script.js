let logoutBtn = document.querySelector('#logoutBtn');

logoutBtn.addEventListener('click', evt => {
    localStorage.clear();
    location.href = "index.html";
})

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('token') == null) {
        location.href = "index.html";
    }
});
