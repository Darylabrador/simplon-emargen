let emargementForm   = document.querySelector('#emargementForm');
let generateBtn      = document.querySelector('#generateBtn');
let messageInterface = document.querySelector('#error');
let data;

/**
 * Show error message
 * @param {string} message 
 */
function showSuccess(message) {
    messageInterface.innerHTML = `
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
function showError(message) {
    messageInterface.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show mt-0 flashMessage" role="alert">
        <strong>${message}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    `;
}


if (emargementForm !== null){
    emargementForm.addEventListener('submit', evt =>{
        evt.preventDefault();
        const formData   = new FormData();

        let userId       = document.querySelector('#userId').value;
        let dataSheetUrl = document.querySelector('#url').value;
        let intitule     = document.querySelector('#intitule').value;
        let image        = document.querySelector('#image').files[0];
        generateBtn.classList.add('d-none');
       
        formData.set('createdBy', userId);
        formData.set('intitule', intitule);
        formData.set('dataSheetUrl', dataSheetUrl);
        formData.set('image', image);

        $.ajax({
            type: "POST",
            url: "/admin/signoffsheet",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function (response) {
                if(response != null){
                    if (response.success){
                        showSuccess(response.message);
                        generateBtn.classList.remove('d-none');
                        emargementForm.reset();
                        location.href = '/admin/dashboard';
                    }else{
                        generateBtn.classList.remove('d-none');
                        showError(response.message);
                    }
                }
            }
        })
    })
}