let allDogsData = [];

/**
 * Initializes the main index page [cite: 39-42, 128]
 */
document.addEventListener("DOMContentLoaded", async function () {
    try {
        allDogsData = await fetchAllDogs();
        const dogCards = document.querySelectorAll(".dog-card");
        const favs = getFavorites();

        dogCards.forEach((card, index) => {
            const dog = allDogsData[index];
            if (!dog) return;

            card.setAttribute("data-index", index);
            card.querySelector("img").src = dog.first_image_url;
            card.querySelector("h2").textContent = dog.name;
            card.querySelector("a").href = `dog.html?id=${index}`;

            // Favorites Logic
            const star = document.createElement("div");
            star.className = `fav-star ${favs.includes(index) ? 'active' : ''}`;
            star.innerHTML = "★";
            star.onclick = (e) => {
                e.preventDefault();
                const isActive = toggleFavorite(index);
                star.classList.toggle("active", isActive);
                renderFavoritesDock();
            };
            card.appendChild(star);
        });

        initMatchmaker();
        renderFavoritesDock();

    } catch (error) {
        console.error("Error loading dogs:", error);
    }
});

function renderFavoritesDock() {
    const favIds = getFavorites();
    const section = document.getElementById("favorites-section");
    const list = document.getElementById("fav-list");

    if (favIds.length === 0) {
        section.style.display = "none";
        return;
    }

    section.style.display = "block";
    list.innerHTML = "";
    favIds.forEach(id => {
        const dog = allDogsData[id];
        if (!dog) return;
        const item = document.createElement("div");
        item.className = "fav-item";
        item.innerHTML = `<img src="${dog.first_image_url}"><p>${dog.name}</p>`;
        item.onclick = () => window.location.href = `dog.html?id=${id}`;
        list.appendChild(item);
    });
}

function initMatchmaker() {
    const modal = document.getElementById("matchmaker-modal");
    document.getElementById("open-matchmaker-btn").onclick = () => modal.style.display = "block";
    document.querySelector(".close-btn").onclick = () => modal.style.display = "none";

    document.getElementById("matchmaker-form").onsubmit = (e) => {
        e.preventDefault();

        // Permanent flag for the adoption journey bar
        localStorage.setItem('usedMatchmaker', 'true');

        // Update the bar immediately on this page
        updateProgressBar();

        // Match calculation logic...
        modal.style.display = "none";
    };
}