// Universal Info Button with Overlay Panel
document.addEventListener("DOMContentLoaded", () => {
    const infoButton = document.getElementById("info-button");
    const infoOverlay = document.createElement("div");
    const infoPanel = document.createElement("div");
    const closeOverlayButton = document.createElement("button");

    // Create the overlay background
    infoOverlay.id = "info-overlay";
    infoOverlay.style.position = "fixed";
    infoOverlay.style.top = "0";
    infoOverlay.style.left = "0";
    infoOverlay.style.width = "100%";
    infoOverlay.style.height = "100%";
    infoOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    infoOverlay.style.display = "none"; // Ensure it's hidden initially
    infoOverlay.style.zIndex = "2000";
    infoOverlay.style.justifyContent = "center";
    infoOverlay.style.alignItems = "center";

    // Create the white panel
    infoPanel.id = "info-panel";
    infoPanel.style.width = "80%";
    infoPanel.style.maxWidth = "600px";
    infoPanel.style.backgroundColor = "#fff";
    infoPanel.style.padding = "2rem";
    infoPanel.style.borderRadius = "10px";
    infoPanel.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    infoPanel.style.position = "relative";
    infoPanel.style.textAlign = "center";
    infoPanel.style.color = "#333";

    // Create the close button
    closeOverlayButton.textContent = "X";
    closeOverlayButton.style.position = "absolute";
    closeOverlayButton.style.top = "10px";
    closeOverlayButton.style.right = "10px";
    closeOverlayButton.style.backgroundColor = "#dc3545";
    closeOverlayButton.style.color = "#fff";
    closeOverlayButton.style.border = "none";
    closeOverlayButton.style.borderRadius = "50%";
    closeOverlayButton.style.width = "30px";
    closeOverlayButton.style.height = "30px";
    closeOverlayButton.style.fontSize = "16px";
    closeOverlayButton.style.cursor = "pointer";

    // Append close button to the panel
    infoPanel.appendChild(closeOverlayButton);

    // Append the panel to the overlay
    infoOverlay.appendChild(infoPanel);

    // Append the overlay to the body
    document.body.appendChild(infoOverlay);

    // Close overlay functionality
    closeOverlayButton.addEventListener("click", () => {
        infoOverlay.style.display = "none";
    });

    // Info button behavior (customized per page)
    infoButton.addEventListener("click", () => {
        const pageId = document.body.dataset.page; // Assuming body has `data-page` attribute
        let pageInfo;

        switch (pageId) {
            case "about":
                pageInfo = `
                    <h2>About Page Information</h2>
                    <p>This page contains details about the university, the kiosk system, and how to use it.</p>
                `;
                break;
            case "programs":
                pageInfo = `
                    <h2>Programs Page Information</h2>
                    <p>Select a program to view details. Then, use the categories on the left for further information.</p>
                `;
                break;
            case "maps":
                pageInfo = `
                    <h2>Maps Page Information</h2>
                    <p>View campus maps and navigate easily using the available tools.</p>
                `;
                break;
            case "updates":
                pageInfo = `
                    <h2>Updates Page Information</h2>
                    <p>This page shows the latest news and events from the university.</p>
                `;
                break;
            default:
                pageInfo = `
                    <h2>Welcome</h2>
                    <p>This is a default message. No specific page information is available.</p>
                `;
        }

        // Update the panel content without removing the close button
        infoPanel.innerHTML = `
            ${pageInfo}
        `;
        infoPanel.appendChild(closeOverlayButton); // Re-add close button
        infoOverlay.style.display = "flex"; // Show the overlay
    });
});

// Dynamic Behavior for Programs and Categories
const programButtons = document.querySelectorAll(".program-buttons button");
const categoryButtons = document.querySelectorAll(".side-buttons button");
const infoPlaceholder = document.getElementById("info-placeholder");

programButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Reset active classes
        programButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        infoPlaceholder.textContent = "Please choose a category on the left side.";
    });
});

categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Check if a program is selected
        const activeProgram = document.querySelector(".program-buttons button.active");
        if (!activeProgram) {
            infoPlaceholder.textContent = "Please choose a Program/Course above first.";
            return;
        }

        // Reset active classes
        categoryButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        infoPlaceholder.textContent = `Displaying ${button.textContent} for ${activeProgram.textContent}`;
    });
});

// Example for handling pagination in Chatbot History
let currentPage = 1;
const itemsPerPage = 5;

function loadChatbotHistory(page) {
    const historyContainer = document.getElementById("chatbot-history");
    historyContainer.innerHTML = ""; // Clear current content

    const dummyData = [
        "User: What are the available programs? Response: Here are the programs offered...",
        "User: Who is the dean of engineering? Response: The dean is...",
        "User: When is the next event? Response: The next event is...",
        "User: How can I enroll? Response: You can enroll via...",
        "User: What is the deadline for applications? Response: The deadline is...",
        "User: What are the tuition fees? Response: The tuition fees are...",
        "User: Where is the campus located? Response: The campus is located at..."
    ];

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = dummyData.slice(startIndex, endIndex);

    pageItems.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item;
        historyContainer.appendChild(li);
    });
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadChatbotHistory(currentPage);
    }
}

function nextPage() {
    const totalItems = 7; // Replace with actual total history count
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        loadChatbotHistory(currentPage);
    }
}

// Load the first page on initial load
document.addEventListener("DOMContentLoaded", () => {
    loadChatbotHistory(currentPage);
});
