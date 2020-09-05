let logoutBtn    = document.querySelector('#logoutBtn');
let loginMessage = document.getElementById('error');

/**
 * Display message on the screen
 * @param {String} type 
 * @param {String} message 
 */
function displayMessagelogin(type, message) {
    loginMessage.innerHTML = `
        <div class="alert alert-${type} fade show my-0" role="alert" style="margin-bottom: -45px !important; margin-top: 10px !important;">
            <strong style="font-size: 12px !important;"> ${message} </strong>
        </div>`;
    setTimeout(() => {
        loginMessage.innerHTML = "";
        localStorage.removeItem('message');
    }, 4000);
}

// handle disconnecting action
logoutBtn.addEventListener('click', evt => {
    localStorage.clear();
    location.href = "index.html";
})

// Verify if we have a token
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('token') == null) {
        location.href = "index.html";
    }
});

// Display a message from localStorage
if (localStorage.getItem('message') != null) {
    let messageSuccessLogin = localStorage.getItem('message');
    displayMessagelogin('success', messageSuccessLogin);
    localStorage.removeItem('message');
}

// Display user's informations in sidenav
if (localStorage.getItem('identite') != null && localStorage.getItem('email') != null) {
    let identite = localStorage.getItem('identite');
    let email    = localStorage.getItem('email');
    document.querySelector('.identityName').textContent  = identite;
    document.querySelector('.identityEmail').textContent = email;
}