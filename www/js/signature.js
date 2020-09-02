let canvas   = document.getElementById('signature-pad');
let savedBtn = document.getElementById('save-png');
let clearBtn = document.getElementById('clear');

let signaturePad = new SignaturePad(canvas);

savedBtn.addEventListener('click', function () {
    if (signaturePad.isEmpty()) {
        return alert("Please provide a signature first.");
    }

    let data = signaturePad.toDataURL('image/png');
    console.log(data);
    window.open(data);
});

clearBtn.addEventListener('click', function () {
    signaturePad.clear();
});