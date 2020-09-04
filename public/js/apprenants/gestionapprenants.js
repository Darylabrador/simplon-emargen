$(function () {
    $('#apprenanTable').DataTable({
        "language": {
            "sSearch": "Rechercher",
            "infoEmpty": "Aucune donnée disponible",
            "zeroRecords": "Aucun élément n'a été trouvé"
        },
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
    var resetPassBtn      = document.querySelectorAll(".resetPassBtn");
    var learnerId         = document.querySelector("#learnerId");
    var learnerIdReset    = document.querySelector("#learnerIdReinit");

    // handle click on edit button
    if (editLearnersBtn.length != 0) {
        editLearnersBtn.forEach(editBtn => {
            editBtn.addEventListener("click", () =>{
                var learnersIdEdit = editBtn.getAttribute("data-id");
                $.ajax({
                    type: "GET",
                    url: `/admin/apprenants/${learnersIdEdit}`,
                    dataType: "json",
                    success: function (response) {
                        if (response != null) {
                            $('#learnerIdUpdate').val(response.apprenant._id);
                            $('#nomEdit').val(response.apprenant.name);
                            $('#prenomEdit').val(response.apprenant.surname);
                            $('#emailEdit').val(response.apprenant.email);
                            
                            var promOptions = document.querySelector("#promotionEdit");
                            for (let i = 0; i < promOptions.options.length; i++ ){
                                if (promOptions.options[i].value == response.apprenant.promoId) {
                                    promOptions.options[i].selected = true;
                                }
                            }
                        }
                    }
                });
                $('#modalEdit').modal('toggle');
            });
        });
    };

    // Handle click on reset pass button
    if (resetPassBtn.length != 0) {
        resetPassBtn.forEach(resetBtn => {
            resetBtn.addEventListener('click', evt => {
                var learnerIdReinitPass = resetBtn.getAttribute("data-id");
                learnerIdReset.value = learnerIdReinitPass;
                $('#modalReinit').modal('toggle');
            });
        });
    };

    // Handle click on delete button
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