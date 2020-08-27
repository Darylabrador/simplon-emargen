$(function () {
    $('#apprenanTable').DataTable({
        responsive: true,
        pageLength: 6,
    });
    $("#apprenanTable_filter").parent().addClass(["d-flex", "justify-content-start", "ml-3"]);
    $("#apprenanTable_filter").addClass(["d-flex", "justify-content-start"]);
    $("#apprenanTable_info").parent().remove();
    $("#apprenanTable_length").parent().remove();
    $("#apprenanTable_paginate").parent().removeClass("col-md-7").addClass("col-md-12");
    $("#apprenanTable_paginate").addClass("mt-2");

    var editLearnersBtn   = document.querySelectorAll(".editLearnersBtn");
    var deleteLearnersBtn = document.querySelectorAll(".deleteLearnersBtn");
    var learnerId         = document.querySelector("#learnerId");

    if (editLearnersBtn.length != 0) {
        editLearnersBtn.forEach(editBtn => {
            editBtn.addEventListener("click", () =>{
                var learnersIdEdit = editBtn.getAttribute("data-id");
                $('#modalEdit').modal('toggle');
            });
        });
    };

    if (deleteLearnersBtn.length != 0) {
        deleteLearnersBtn.forEach(deleteBtn => {
            deleteBtn.addEventListener("click", () =>{
                var learnersIdDelete = deleteBtn.getAttribute("data-id");
                learnerId.value = learnersIdDelete;
                $('#modalDelete').modal('toggle');
            });
        });
    };
});