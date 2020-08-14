let generatePdfBtn = document.querySelectorAll('.generatePdfBtn');
let waitingMessage = document.querySelector('#waitingMessage');
let alertmsgInfo   = document.querySelector('#alertmsg')
/**
 * Show waiting message
 * @name showWaitingMessage
 * @function
 * @param {string} message 
 * @param {string} type
 */
function showWaitingMessage(message, type) {
    waitingMessage.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show mt-0 flashMessage w-25 mx-auto" role="alert">
        <strong>${message}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    `;
}

if (generatePdfBtn.length != 0) {
    for (let i = 0; i < generatePdfBtn.length; i++){
        generatePdfBtn[i].addEventListener('click', () => {
            showWaitingMessage('PDF en cours de création...', 'success');

            if (alertmsgInfo){
                alertmsgInfo.classList.add('d-none');
            }
        })
    }
}