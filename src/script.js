const API_BASE_URL = "https://d18c1bd9-3d36-4301-88f4-25fd532e430f.mock.pstmn.io";

/**
 * Utility: Extracts the 'id' parameter from the current URL
 */
function getDogIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("id"));
}

/**
 * Utility: Converts boolean/null values to display text
 */
function formatBoolean(value) {
    if (value === true) return "Yes";
    if (value === false) return "No";
    return "Unknown";
}

/**
 * API: Fetches all dogs from the server
 */
async function fetchAllDogs() {
    const response = await fetch(`${API_BASE_URL}/dogs`);
    if (!response.ok) throw new Error("Failed to fetch dogs");
    return await response.json();
}

/**
 * API: Fetches one specific dog by its API ID
 */
async function fetchDogById(apiId) {
    const response = await fetch(`${API_BASE_URL}/dogs/${apiId}`);
    if (!response.ok) throw new Error(`Failed to fetch dog with id ${apiId}`);
    return await response.json();
}

/**
 * API: Sends adoption form data via POST
 */
async function submitAdoptionForm(apiId, formData) {
    const response = await fetch(`${API_BASE_URL}/dogs/${apiId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });
    if (!response.ok) throw new Error(`Failed to submit form for dog ${apiId}`);
    return await response.json();
}

// --- Gamification: Favorites Management ---

function getFavorites() {
    return JSON.parse(localStorage.getItem('favDogs')) || [];
}

function toggleFavorite(dogId) {
    let favs = getFavorites();
    const index = favs.indexOf(dogId);
    if (index > -1) {
        favs.splice(index, 1);
    } else {
        favs.push(dogId);
    }
    localStorage.setItem('favDogs', JSON.stringify(favs));
    return favs.includes(dogId);
}

// --- Gamification: Achievements (Bones) ---

function checkAchievements() {
    let collectedBones = JSON.parse(localStorage.getItem('collectedBones')) || [];
    if (collectedBones.length >= 3) {
        const mainContainer = document.querySelector('.container');
        if (!document.querySelector('.super-adopter-badge') && mainContainer) {
            const badge = document.createElement('div');
            badge.className = 'super-adopter-badge';
            badge.innerHTML = '🏆 Super Adopter! Found 3 bones! 🦴 <br><small>(Click to reset)</small>';
            badge.onclick = () => {
                localStorage.removeItem('collectedBones');
                location.reload();
            };
            mainContainer.prepend(badge);
        }
    }
}

// --- Gamification: Journey Progress Bar ---

function initProgressBar() {
    if (!document.getElementById('progress-container')) {
        const container = document.createElement('div');
        container.id = 'progress-container';
        container.innerHTML = `
            <div id="progress-bar"><div id="progress-dog">🐕</div></div>
            <div id="progress-person">🙋‍♂️</div>
            <div id="progress-text"></div>
        `;
        document.body.prepend(container);
    }
    updateProgressBar();
}

/**
 * Global Progress Trigger
 */
function trackProgress(action) {
    let state = JSON.parse(localStorage.getItem('adoptionProgress')) || {};
    if (!state[action]) {
        state[action] = true;
        localStorage.setItem('adoptionProgress', JSON.stringify(state));
        updateProgressBar();
    }
}

/**
 * Dynamic Logic: Calculates percentage based on current URL path
 * This ensures the bar goes backward if the user returns to the menu.
 */
function updateProgressBar() {
    const path = window.location.pathname;
    const isMatchmakerDone = localStorage.getItem('usedMatchmaker') === 'true';

    let percentage = 0;
    const base = isMatchmakerDone ? 25 : 0;
    const step = isMatchmakerDone ? 25 : 33.3;

    if (path.includes('thankyou.html')) {
        percentage = 100;
    } else if (path.includes('adopt.html')) {
        percentage = Math.round(base + (step * 2));
    } else if (path.includes('dog.html')) {
        percentage = Math.round(base + step);
    } else {
        // We are on index.html
        percentage = base;
    }

    const bar = document.getElementById('progress-bar');
    const textLabel = document.getElementById('progress-text');

    if (bar) {
        bar.style.width = percentage + '%';
        if (percentage === 100) {
            bar.classList.add('completed');
            bar.style.cursor = 'pointer';
            bar.onclick = resetJourney;
        } else {
            bar.classList.remove('completed');
        }
    }

    if (textLabel) textLabel.innerText = `Adoption Journey: ${percentage}%`;

    if (percentage === 100 && localStorage.getItem('celebrated') !== 'true') {
        localStorage.setItem('celebrated', 'true');
        showCelebration();
    }
}

/**
 * Resets all journey progress and goes to home page
 */
function resetJourney() {
    if (confirm('Do you want to reset your journey?')) {
        localStorage.removeItem('adoptionProgress');
        localStorage.removeItem('usedMatchmaker');
        localStorage.removeItem('celebrated');
        window.location.href = 'index.html';
    }
}

function showCelebration() {
    const msg = document.createElement('div');
    msg.className = 'progress-celebration';
    msg.innerHTML = '🎉 Match Made! The dog has found its home! 🏠🐕<br><small>(Click to reset)</small>';
    msg.onclick = resetJourney;
    document.body.appendChild(msg);
}

document.addEventListener("DOMContentLoaded", () => {
    checkAchievements();
    initProgressBar();
});