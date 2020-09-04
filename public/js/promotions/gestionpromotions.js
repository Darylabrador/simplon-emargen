$(function () {
    $('#promotionTable').DataTable({
        "language": {
            "sSearch": "Rechercher",
            "infoEmpty" : "Aucune donnée disponible",
            "zeroRecords" : "Aucun élément n'a été trouvé"
        },
        responsive: true,
        pageLength: 6,
    });

    $("#promotionTable_info").parent().remove();
    $("#promotionTable_length").parent().remove();
    $("#promotionTable_previous").remove();
    $("#promotionTable_next").remove();

    $("#promotionTable_filter").parent().addClass(["d-flex", "justify-content-start", "ml-3"]);
    $("#promotionTable_filter").addClass(["d-flex", "justify-content-start"]);
    $("#promotionTable_paginate").parent().removeClass("col-md-7").addClass("col-md-12");
    $("#promotionTable_paginate").addClass("mt-2");
    $(".pagination").addClass("justify-content-center");

    var editPromotionBtn    = document.querySelectorAll(".editPromotionBtn");
    var deletePromotionBtn  = document.querySelectorAll(".deletePromotionBtn");
    var promotionId         = document.querySelector("#promotionId");

    // handle click on edit btn
    if (editPromotionBtn.length != 0) {
        editPromotionBtn.forEach(editBtn => {
            editBtn.addEventListener("click", () => {
                var promoId = editBtn.getAttribute("data-id");
                $.ajax({
                    type: "GET",
                    url: `/admin/promotionInfo/${promoId}`,
                    dataType: "json",
                    success: function (response) {
                        if(response != null) {
                            $('#promotionIdEdit').val(response.specificPromo._id);
                            $('#promotionUpdate').val(response.specificPromo.label);
                        }
                    }
                });
                $('#modalEdit').modal('toggle');
            });
        });
    };

    // handle click on delete btn
    if (deletePromotionBtn.length != 0) {
        deletePromotionBtn.forEach(deleteBtn => {
            deleteBtn.addEventListener("click", () => {
                var promoId = deleteBtn.getAttribute("data-id");
                promotionId.value = promoId;
                $('#modalDelete').modal('toggle');
            });
        });
    };
});