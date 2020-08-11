let emargementForm   = document.querySelector('#emargementForm');
let generateBtn      = document.querySelector('#generateBtn');
let messageInterface = document.querySelector('#error');
let data, dataSend;

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

        let templateName = document.querySelector('#templateName').value;
        let dataSheetUrl = document.querySelector('#url').value;
        let number       = document.querySelector('#number').value;

        generateBtn.classList.add('d-none');
       
        dataSend = {
            template: templateName,
            dataSheet: dataSheetUrl, 
            number
        }

        $.ajax({
            type: "POST",
            url: "/admin/signoffsheet",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: JSON.stringify(dataSend),
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