let logo        = document.querySelector("#logo");
let previewLogo = document.querySelector("#previewLogo");

// When a picture is selected from input:file
logo.addEventListener("change", function () {

    // Get uploaded file from filesystems
    const file = this.files[0];

    // if file exist
    if(file) {

        // Create object that allow to create a preview
        const reader = new FileReader();
        previewLogo.parentElement.classList.remove("image-preview", "bg-light");

        // When picture is uploaded, we modify image source to see it on the interface
        reader.addEventListener("load", function() {
            previewLogo.setAttribute("src", this.result);
        });

        // Set the preview visible for user
        reader.readAsDataURL(file);
    }
});