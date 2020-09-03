document.addEventListener('deviceready', function() {

    document.querySelector("#prepare").addEventListener("touchend", function () {
        if (!localStorage.getItem(signImage)) {
            window.QRScanner.prepare(onDone); // show the prompt
        } else {
            location.href = "signature.html";
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

    function displayContents(err, text) {
        if (err) {
            // an error occurred, or the scan was canceled (error code `6`)
        } else {
            // The scan completed, display the contents of the QR code:
            document.querySelector('body').classList.remove('bg-transparent');
            document.querySelector('html').classList.remove('bg-transparent');
            alert(text);
        }
    }
});
