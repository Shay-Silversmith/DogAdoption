const API_BASE_URL = "https://d18c1bd9-3d36-4301-88f4-25fd532e430f.mock.pstmn.io";

// Reads the dog index from the URL query string
function getDogIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("id"));
}

// Converts boolean/null values to display text
function formatBoolean(value) {
    if (value === true) {
        return "Yes";
    }

    if (value === false) {
        return "No";
    }

    return "Unknown";
}

// Fetches all dogs from the API
async function fetchAllDogs() {
    const response = await fetch(`${API_BASE_URL}/dogs`);

    if (!response.ok) {
        throw new Error("Failed to fetch dogs");
    }

    return await response.json();
}

// Fetches one dog by API id
async function fetchDogById(apiId) {
    const response = await fetch(`${API_BASE_URL}/dogs/${apiId}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch dog with id ${apiId}`);
    }

    return await response.json();
}

// Sends adoption form data to the API
async function submitAdoptionForm(apiId, formData) {
    const response = await fetch(`${API_BASE_URL}/dogs/${apiId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        throw new Error(`Failed to submit adoption form for dog ${apiId}`);
    }

    return await response.json();
}