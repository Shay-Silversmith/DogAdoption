/**
 * Final step of the journey [cite: 103]
 */
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const pageId = getDogIdFromURL();
        const apiId = pageId + 1;

        // Journey Trigger: Final completion reached!
        trackProgress('completedAdoption');

        const dog = await fetchDogById(apiId);

        document.getElementById("dog-image").src = dog.first_image_url;
        document.getElementById("dog-image").alt = dog.name;
        document.getElementById("dog-name").textContent = dog.name;
    } catch (error) {
        console.error("Error loading thank you page:", error);
    }
});