document.addEventListener("DOMContentLoaded", async function () {
    try {
        const pageId = getDogIdFromURL();
        const apiId = pageId + 1;

        const dog = await fetchDogById(apiId);

        document.getElementById("page-title").textContent = `${dog.name} Details`;

        const dogImage = document.getElementById("dog-image");
        dogImage.src = dog.first_image_url;
        dogImage.alt = dog.name;

        if (dog.name === "Brandi") {
            dogImage.style.objectPosition = "center 15%";
        } else {
            dogImage.style.objectPosition = "center 25%";
        }

        document.getElementById("dog-name").textContent = dog.name;
        document.getElementById("dog-breed").textContent = dog.breed;
        document.getElementById("dog-age").textContent = dog.age;
        document.getElementById("dog-sex").textContent = dog.sex;
        document.getElementById("dog-house-trained").textContent = formatBoolean(dog.house_trained);
        document.getElementById("dog-vaccinated").textContent = formatBoolean(dog.vaccinated);
        document.getElementById("dog-story").textContent = dog.story;

        document.getElementById("adopt-link").href = `adopt.html?id=${pageId}`;

        const prevButton = document.getElementById("prev-btn");
        const nextButton = document.getElementById("next-btn");

        if (pageId === 0) {
            prevButton.style.display = "none";
        } else {
            prevButton.href = `dog.html?id=${pageId - 1}`;
        }

        if (pageId === 5) {
            nextButton.style.display = "none";
        } else {
            nextButton.href = `dog.html?id=${pageId + 1}`;
        }
    } catch (error) {
        console.error("Error loading dog details:", error);
    }
});