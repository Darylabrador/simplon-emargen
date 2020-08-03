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
        let userId       = document.querySelector('#userId').value;
        let dataSheetUrl = document.querySelector('#url').value;
        let intitule     = document.querySelector('#intitule').value;
        generateBtn.classList.add('d-none');
       
        data = {
            createdBy: userId,
            intitule: intitule,
            dataSheetUrl: dataSheetUrl
        }

        $.ajax({
            type: "POST",
            url: "/admin/signoffsheet",
            headers: {
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            data: JSON.stringify(data),
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