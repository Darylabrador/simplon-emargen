let btnSynchroInfo = document.querySelectorAll('.btnSynchroInfo');
let emargementId   = document.getElementById("emargementId");

if (btnSynchroInfo.length != 0) {
    btnSynchroInfo.forEach(btn => {
        btn.addEventListener("click", evnt => {
            emargementId.value = btn.getAttribute("data-id");
        })
    })
}