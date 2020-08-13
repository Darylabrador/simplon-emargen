let templateForm = document.querySelector('#templateForm');
let errorTemplateMessage = document.querySelector('#errorTemplate');
let generateTemplateBtn  = document.querySelector('#generateTemplateBtn');

/**
 * Show message for template
 * @name showMessgeTemplate
 * @function
 * @param {string} message 
 */
function showMessgeTemplate(message, type) {
    errorTemplateMessage.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show mt-0 flashMessage" role="alert">
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
                        showMessgeTemplate(response.message, 'success');
                        generateTemplateBtn.classList.remove('d-none');
                        templateForm.reset();
                        location.href = '/admin/templates';
                    } else {
                        generateTemplateBtn.classList.remove('d-none');
                        showMessgeTemplate(response.message, 'danger');
                    }
                }
            }
        })
    });
};