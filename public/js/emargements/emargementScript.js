$(function() {
    let btnSynchroInfo = document.querySelectorAll('.btnSynchroInfo');
    let emargementId = document.getElementById("emargementId");
    let emargementIdSign = document.getElementById("emargementIdSign");
    let linkBtn = document.querySelectorAll('.linkBtn');

    if (btnSynchroInfo.length != 0) {
        btnSynchroInfo.forEach(btn => {
            btn.addEventListener("click", () => {
                emargementId.value = btn.getAttribute("data-id");
            })
        })
    }

    if (linkBtn.length != 0) {
        for (let i = 0; i < linkBtn.length; i++) {
            linkBtn[i].addEventListener("click", () => {
                emargementIdSign.value = linkBtn[i].getAttribute("data-id")
                $('#modalSignature').modal('toggle');
            })
        }
    }
})