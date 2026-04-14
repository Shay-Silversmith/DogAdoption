/**
 * Handles the adoption form page logic
 */
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const pageId = getDogIdFromURL();
        const apiId = pageId + 1;
        const dog = await fetchDogById(apiId);

        // Track that user reached the form
        trackProgress('startedForm');

        // Populate the page with dog details
        document.getElementById("page-title").textContent = `Adopt ${dog.name}`;

        const dogImg = document.getElementById("dog-image");
        if (dogImg) {
            dogImg.src = dog.first_image_url;
            dogImg.alt = dog.name;
        }

        document.getElementById("dog-name").textContent = dog.name;

        const form = document.getElementById("adoption-form");

        /**
         * Submit handler: Sends data and redirects to thank you page
         */
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = {
                email: document.getElementById("email").value,
                fullname: document.getElementById("fullname").value,
                phone: document.getElementById("phone").value
            };

            // Call the shared API function from script.js
            await submitAdoptionForm(apiId, formData);

            // Redirect to completion page
            window.location.href = `thankyou.html?id=${pageId}`;
        });
    } catch (error) {
        console.error("Error loading adoption page:", error);
    }
});