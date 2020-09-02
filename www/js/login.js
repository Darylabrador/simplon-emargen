let errorMessage        = document.getElementById('error');
let loginFormContainer  = document.getElementById('loginFormContainer');

loginFormContainer.addEventListener('submit', evt => {
    evt.preventDefault();
    errorMessage.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show my-0" role="alert">
            <strong>Message de test </strong>
        </div>
    `;

    setTimeout(() => {
        location.href = 'accueil.html';
    }, 2000);
})