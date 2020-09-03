let errorMessage        = document.getElementById('error');
let resetFormContainer  = document.getElementById('resetFormContainer');

let oldpass         = document.getElementById('oldpass');
let newpass         = document.getElementById('newpass');
let newpassconfirm  = document.getElementById('newpassconfirm');

let req = new XMLHttpRequest();
let url = "http://192.168.1.15:3000/api/reinitialisation";
let method, data, dataSend;

function displayMessageReset(type, message) {
    errorMessage.innerHTML = "";
    errorMessage.innerHTML = `
         <div class="alert alert-${type} fade show my-0" role="alert">
            <strong style="font-size: 12px !important;"> ${message} </strong>
        </div>
    `;

    setTimeout(() => {
        errorMessage.innerHTML = "";
    }, 4000);
}

resetFormContainer.addEventListener('submit', evt => {
    evt.preventDefault();
    method = "POST";
    data = {
        oldpass: oldpass.value,
        newpass: newpass.value,
        newpassconfirm: newpassconfirm.value
    }

    dataSend = JSON.stringify(data);
    req.open(method, url);
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token')); 
    req.responseType = "json";
    req.send(dataSend);

    req.onload = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                let reponse = req.response;
                if (reponse != null) {
                    if (reponse.success) {
                        localStorage.removeItem('firstCo');
                        localStorage.setItem('firstCo', reponse.firstConnection);
                        resetFormContainer.reset();
                        displayMessagelogin('success', reponse.message);
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