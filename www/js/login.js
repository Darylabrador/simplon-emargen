let errorMessage        = document.getElementById('error');
let loginFormContainer  = document.getElementById('loginFormContainer');
let email               = document.getElementById("email");
let password            = document.getElementById("password");

let req = new XMLHttpRequest();
let url = "http://192.168.1.15:3000/api/login";
let method, data, dataSend;


function displayMessagelogin(type, message) {
    errorMessage.innerHTML = `
        <div class="alert alert-${type} fade show my-0" role="alert">
            <strong style="font-size: 12px !important;"> ${message} </strong>
        </div>
    `;

    setTimeout(() => {
        errorMessage.innerHTML = "";
    }, 4000);
}

loginFormContainer.addEventListener('submit', evt => {
    evt.preventDefault();
    method = "POST";
    data = {
        email: email.value,
        password: password.value
    }

    dataSend = JSON.stringify(data);
    req.open(method, url);
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.responseType = "json";
    req.send(dataSend);

    req.onload = () => {
        if(req.readyState === XMLHttpRequest.DONE) {

            if (req.status === 200) {
                let reponse = req.response;
                if (reponse != null) {
                    if (reponse.success) {
                        localStorage.setItem('token', reponse.token);
                        localStorage.setItem('identite', reponse.identite);
                        localStorage.setItem('email', reponse.email);
                        localStorage.setItem('firstCo', reponse.firstConnection);
                        localStorage.setItem('signImage', reponse.signImage);
                        localStorage.setItem('message', reponse.message);

                        if (localStorage.getItem('token') != null) {
                            location.href = "accueil.html";
                        }
                    } else {
                        displayMessagelogin('danger', reponse.message);
                    }
                }
            } else {
                let reponse = req.response;
                if (reponse != null) {
                    if (!reponse.success) {
                        displayMessagelogin('danger', reponse.message);
                    }
                }
            }
        }
    }
})