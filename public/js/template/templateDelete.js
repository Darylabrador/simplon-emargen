let btnDeleteInfo = document.querySelectorAll('.btnDeleteInfo');
let templateId    = document.getElementById("templateId");

if(btnDeleteInfo.length != 0){
    btnDeleteInfo.forEach(btn => {
        btn.addEventListener("click", evnt =>{
            templateId.value = btn.getAttribute("data-id");
        })
    })
}