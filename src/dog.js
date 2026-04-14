/**
 * Dog details initialization and unique interactions
 */
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const pageId = getDogIdFromURL();
        const apiId = pageId + 1;
        const dog = await fetchDogById(apiId);

        document.getElementById("page-title").textContent = `${dog.name} Details`;
        const dogImage = document.getElementById("dog-image");
        dogImage.src = dog.first_image_url;
        dogImage.alt = dog.name;

        // Requirement: Positioning Brandi properly
        dogImage.style.objectPosition = dog.name === "Brandi" ? "center 15%" : "center 25%";

        // Populate basic fields
        document.getElementById("dog-name").textContent = dog.name;
        document.getElementById("dog-breed").textContent = dog.breed;
        document.getElementById("dog-age").textContent = dog.age;
        document.getElementById("dog-sex").textContent = dog.sex;
        document.getElementById("dog-house-trained").textContent = formatBoolean(dog.house_trained);
        document.getElementById("dog-vaccinated").textContent = formatBoolean(dog.vaccinated);
        document.getElementById("dog-story").textContent = dog.story;

        // --- Gamification: RPG Stats with Dynamic Tiers ---
        generateDogStats(dog.story);

        // --- Gamification: Per-Dog Pet Counter ---
        initPetInteractions(apiId);

        // --- Gamification: Bone Collector ---
        initBoneCollector(apiId);

        // Navigation links
        document.getElementById("adopt-link").href = `adopt.html?id=${pageId}`;
        const prevBtn = document.getElementById("prev-btn");
        const nextBtn = document.getElementById("next-btn");

        if (pageId === 0) prevBtn.style.display = "none";
        else prevBtn.href = `dog.html?id=${pageId - 1}`;

        if (pageId === 5) nextBtn.style.display = "none";
        else nextBtn.href = `dog.html?id=${pageId + 1}`;

    } catch (error) {
        console.error("Error loading dog details:", error);
    }
});

/**
 * Analyzes the dog story and applies colors based on tiers:
 * Red (0-33%), Orange (34-66%), Green (67-100%)
 */
function generateDogStats(story) {
    const text = story.toLowerCase();
    const stats = [
        { label: "Energy", keywords: ["playful", "energy", "active", "run", "young"], value: 40 },
        { label: "Sociability", keywords: ["loving", "affectionate", "people", "kids", "friendly"], value: 40 },
        { label: "Training", keywords: ["commands", "trained", "stay", "wait", "leash"], value: 40 }
    ];

    const list = document.getElementById("stats-list");
    list.innerHTML = "";
    stats.forEach(s => {
        s.keywords.forEach(k => { if (text.includes(k)) s.value += 15; });
        s.value = Math.min(s.value, 100);

        // Dynamic Color Selection
        let color = "#ff6b6b"; // Red tier
        if (s.value > 66) color = "#4CAF50"; // Green tier
        else if (s.value > 33) color = "#FF9800"; // Orange tier

        const row = document.createElement("div");
        row.className = "stat-row";
        row.innerHTML = `
            <span class="stat-label">${s.label}: ${s.value}%</span>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill" style="width:${s.value}%; background-color:${color}"></div>
            </div>
        `;
        list.appendChild(row);
    });
}

/**
 * Tracks pets specifically for this dog index
 */
function initPetInteractions(apiId) {
    const petBtn = document.getElementById("pet-btn");
    const petDisplay = document.getElementById("pet-count-display");
    const storageKey = `petCount_dog_${apiId}`;

    let count = Number(localStorage.getItem(storageKey)) || 0;
    petDisplay.innerText = `This dog was petted ${count} times!`;

    petBtn.onclick = () => {
        count++;
        localStorage.setItem(storageKey, count);
        petDisplay.innerText = `This dog was petted ${count} times!`;
        createHeart(petBtn);
    };
}

function createHeart(btn) {
    const heart = document.createElement("div");
    heart.className = "heart-animation";
    heart.innerHTML = "❤️";
    heart.style.left = "50%";
    btn.parentElement.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
}

function initBoneCollector(apiId) {
    let collectedBones = JSON.parse(localStorage.getItem('collectedBones')) || [];
    if (!collectedBones.includes(apiId)) {
        const boneBtn = document.createElement('button');
        boneBtn.innerText = '🦴';
        boneBtn.className = 'bone-collect-btn';
        boneBtn.style.background = "none";
        boneBtn.onclick = () => {
            collectedBones.push(apiId);
            localStorage.setItem('collectedBones', JSON.stringify(collectedBones));
            boneBtn.style.display = 'none';
            alert('Yay! You collected a hidden bone! 🦴');
            checkAchievements();
        };
        document.getElementById("dog-name").appendChild(boneBtn);
        document.getElementById("dog-name").style.display = "flex";
        document.getElementById("dog-name").style.justifyContent = "center";
        document.getElementById("dog-name").style.alignItems = "center";
    }
}