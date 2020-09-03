document.addEventListener('deviceready', function() {

    let signMessage  = document.getElementById('error');
    var isConfigSign = localStorage.getItem('notConfigSign');
    
    function displaySignMsg(type, message) {
        signMessage.innerHTML = `
        <div class="alert alert-${type} fade show my-0" role="alert" style="margin-bottom: -45px !important; margin-top: 10px !important;">
            <strong style="font-size: 12px !important;"> ${message} </strong>
        </div>
    `;

        setTimeout(() => {
            loginMessage.innerHTML = "";
            localStorage.removeItem('message');
        }, 4000);
    }

    document.querySelector("#prepare").addEventListener("touchend", function () {
        if (isConfigSign == 'false') {
            localStorage.setItem('message', 'Vous devez configuré votre signature');
            location.href = "signature.html";
        } else {
            window.QRScanner.prepare(onDone); // show the prompt
        }
    });

    document.querySelector("#scan").addEventListener("touchend", function () {
        window.QRScanner.scan(displayContents);
    });

    function onDone(err, status) {
        if (err) {
            // here we can handle errors and clean up any loose ends.
            console.error(err);
        }
        if (status.authorized) {
            // W00t, you have camera access and the scanner is initialized.
            // QRscanner.show() should feel very fast.
            window.QRScanner.show();
            document.querySelector('body').classList.add('bg-transparent');
            document.querySelector('html').classList.add('bg-transparent');
        } else if (status.denied) {
            // The video preview will remain black, and scanning is disabled. We can
            // try to ask the user to change their mind, but we'll have to send them
            // to their device settings with `QRScanner.openSettings()`.
        } else {
            // we didn't get permission, but we didn't get permanently denied. (On
            // Android, a denial isn't permanent unless the user checks the "Don't
            // ask again" box.) We can ask again at the next relevant opportunity.
        }
    }

    function signDoc(urlSend) {
        let request = new XMLHttpRequest();
        let methods = "GET";
        request.open(methods, urlSend);
        request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
        request.responseType = "json";
        request.send();

        request.onload = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    let reponse = request.response;
                    if (reponse != null) {
                        if (reponse.success) {
                            displaySignMsg('success', reponse.message);
                        } else {
                            displaySignMsg('danger', reponse.message);
                        }
                    }
                } else {
                    let reponse = request.response;
                    if (reponse != null) {
                        if (!reponse.success) {
                            displaySignMsg('danger', reponse.message);
                        }
                    }
                }
            }
        }
    }

    function displayContents(err, text) {
        if (err) {
            // an error occurred, or the scan was canceled (error code `6`)
        } else {
            // The scan completed, display the contents of the QR code:
            document.querySelector('body').classList.remove('bg-transparent');
            document.querySelector('html').classList.remove('bg-transparent');
            signDoc(text); 
        }
    }
});
