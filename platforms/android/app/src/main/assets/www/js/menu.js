let openMenu  = document.getElementById('openMenu');
let closeMenu = document.getElementById('closeMenu');

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.querySelector('body').classList.add('bg-dark');
    document.querySelector('html').classList.add('bg-dark');
    document.querySelector('header').classList.add('bg-dark');
    document.querySelector('nav').classList.add('bg-dark');
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.querySelector('body').classList.remove('bg-dark');
    document.querySelector('html').classList.remove('bg-dark');
    document.querySelector('header').classList.remove('bg-dark');
    document.querySelector('nav').classList.remove('bg-dark');
} 

openMenu.addEventListener('click', openNav);
closeMenu.addEventListener('click', closeNav);