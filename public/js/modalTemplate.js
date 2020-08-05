let templateForm = document.querySelector('#templateForm');

// Compléments d'informations
let errorTemplateMessage = document.querySelector('#errorTemplate');
let generateTemplateBtn  = document.querySelector('#generateTemplateBtn');

/**
 * Show error message
 * @param {string} message 
 */
function showSuccessTemplate(message) {
    errorTemplateMessage.innerHTML = `
    <div class="alert alert-success alert-dismissible fade show mt-0 flashMessage" role="alert">
        <strong>${message}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    `;
}

/**
 * Show success message
 * @param {string} message 
 */
function showErrorTemplate(message) {
    errorTemplateMessage.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show mt-0 flashMessage" role="alert">
        <strong>${message}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    `;
}

if (templateForm) {
    templateForm.addEventListener('submit', evt => {
        evt.preventDefault();
        const formDataTemplate = new FormData();

        let templateNom        = document.querySelector('#name').value;
        let templateIntitule   = document.querySelector('#intitule').value;
        let templateOrganisme  = document.querySelector('#organisme').value;
        let templateImage      = document.querySelector('#image').files[0];

        formDataTemplate.set('name', templateNom);
        formDataTemplate.set('intitule', templateIntitule);
        formDataTemplate.set('organisme', templateOrganisme);
        formDataTemplate.set('image', templateImage);

        $.ajax({
            type: "POST",
            url: "/admin/addtemplate",
            data: formDataTemplate,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    if (response.success) {
                        showSuccessTemplate(response.message);
                        generateTemplateBtn.classList.remove('d-none');
                        templateForm.reset();
                        location.href = '/admin/dashboard';
                    } else {
                        generateTemplateBtn.classList.remove('d-none');
                        showErrorTemplate(response.message);
                    }
                }
            }
        })
    });
};