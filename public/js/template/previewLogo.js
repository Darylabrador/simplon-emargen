let logo        = document.querySelector("#logo");
let previewLogo = document.querySelector("#previewLogo");

// lorsqu'une image est sélectionné
logo.addEventListener("change", function () {

    // récupérer le fichier uploader au niveau des filesystem
    const file = this.files[0];

    // si le fichier existe
    if(file) {

        // Créer un objet qui va permettre d'avoir la preview
        const reader = new FileReader();
        previewLogo.parentElement.classList.remove("image-preview", "bg-light");

        // Quand l'image est chargé, on modifie les attribus sources
        reader.addEventListener("load", function() {
            previewLogo.setAttribute("src", this.result);
        });

        // lecture de l'image
        reader.readAsDataURL(file);
    }
});