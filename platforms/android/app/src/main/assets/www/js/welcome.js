/**
 * Back button displayed on password and sign page
 */

let backBtn = document.getElementById('backBtn');

backBtn.addEventListener('click', () => {
    location.href = "accueil.html";
});