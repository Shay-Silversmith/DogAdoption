document.addEventListener("DOMContentLoaded", async function () {
    try {
        const pageId = getDogIdFromURL();
        const apiId = pageId + 1;

        const dog = await fetchDogById(apiId);

        document.getElementById("page-title").textContent = `Adopt ${dog.name}`;
        document.getElementById("dog-image").src = dog.first_image_url;
        document.getElementById("dog-image").alt = dog.name;
        document.getElementById("dog-name").textContent = dog.name;

        const form = document.getElementById("adoption-form");

        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = {
                email: document.getElementById("email").value,
                fullname: document.getElementById("fullname").value,
                phone: document.getElementById("phone").value
            };

            await submitAdoptionForm(apiId, formData);

            window.location.href = `thankyou.html?id=${pageId}`;
        });
    } catch (error) {
        console.error("Error loading adoption page:", error);
    }
});