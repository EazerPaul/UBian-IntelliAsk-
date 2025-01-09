document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.querySelector(".news-content");
    const eventsContainer = document.querySelector(".events-content");

    // Buttons for News Section
    const addNewsButton = document.getElementById("add-news");
    const editNewsButton = document.getElementById("edit-news");
    const deleteNewsButton = document.getElementById("delete-news");

    // Buttons for Events Section
    const addEventsButton = document.getElementById("add-events");
    const editEventsButton = document.getElementById("edit-events");
    const deleteEventsButton = document.getElementById("delete-events");

    // Function to create a new update panel
    const createPanel = (title, message, photoURL, timestamp, isAnnouncement = false) => {
        const newPanel = document.createElement("div");
        newPanel.classList.add("update-panel");
        newPanel.innerHTML = `
            <div class="update-content">
                ${photoURL ? `<img src="${photoURL}" alt="Uploaded Photo" class="uploaded-photo">` : ""}
                <h3>${title}</h3>
                <p>${message}</p>
                <small>${timestamp}</small>
                ${isAnnouncement ? '<span class="announcement-tag">Announcement</span>' : ""}
                <input type="checkbox" class="announcement-checkbox" ${isAnnouncement ? "checked" : ""}> Include on Announcements
            </div>
            <hr class="update-divider">
        `;
        return newPanel;
    };

    // Function to handle adding new updates
    const handleAdd = (container, category) => {
        const newPanel = document.createElement("div");
        newPanel.classList.add("update-panel");
        newPanel.innerHTML = `
            <input type="file" class="upload-photo">
            <input type="text" placeholder="Title" class="title-input">
            <textarea placeholder="Message" class="message-input"></textarea>
            <label>
                <input type="checkbox" class="announcement-checkbox"> Include on Announcements
            </label>
            <div class="error-message"></div>
            <button class="save-button">Save</button>
            <button class="close-button">X</button>
        `;

        container.appendChild(newPanel);

        const saveButton = newPanel.querySelector(".save-button");
        const closeButton = newPanel.querySelector(".close-button");
        const photoInput = newPanel.querySelector(".upload-photo");
        const checkbox = newPanel.querySelector(".announcement-checkbox");
        const errorMessage = newPanel.querySelector(".error-message");

        saveButton.addEventListener("click", () => {
            const title = newPanel.querySelector(".title-input").value;
            const message = newPanel.querySelector(".message-input").value;
            const photo = photoInput.files[0];
            const timestamp = new Date().toLocaleString();

            if (title && message) {
                saveUpdateToDatabase(title, message, photo, category, checkbox.checked, timestamp, (photoURL) => {
                    // Update UI after saving
                    newPanel.replaceWith(createPanel(title, message, photoURL, timestamp, checkbox.checked));
                });
            } else {
                alert("Please fill out all fields.");
            }
        });

        checkbox.addEventListener("change", () => {
            const totalChecked = document.querySelectorAll(".announcement-checkbox:checked").length;
            if (totalChecked > 10) {
                checkbox.checked = false;
                errorMessage.textContent = "Up to 10 Announcements are only allowed.";
            } else {
                errorMessage.textContent = "";
            }
        });

        closeButton.addEventListener("click", () => {
            newPanel.remove();
        });
    };

    // Add event listeners for News
    addNewsButton.addEventListener("click", () => handleAdd(newsContainer, "news"));

    // Add event listeners for Events
    addEventsButton.addEventListener("click", () => handleAdd(eventsContainer, "events"));

    // Highlight updates for editing
    document.addEventListener("click", (e) => {
        const panel = e.target.closest(".update-panel");
        if (panel) {
            panel.classList.toggle("selected");
        }
    });

    // Delete selected updates
    const handleDelete = (container) => {
        const selectedUpdates = container.querySelectorAll(".selected");
        if (selectedUpdates.length === 0) {
            alert("No updates selected for deletion.");
            return;
        }
        if (confirm("Are you sure you want to delete the selected updates?")) {
            selectedUpdates.forEach((update) => {
                deleteUpdateFromDatabase(update);
                update.remove();
            });
        }
    };

    deleteNewsButton.addEventListener("click", () => handleDelete(newsContainer));
    deleteEventsButton.addEventListener("click", () => handleDelete(eventsContainer));

    // Edit selected updates
    const handleEdit = (container) => {
        const selectedUpdates = container.querySelectorAll(".selected");
        if (selectedUpdates.length !== 1) {
            alert("Please select a single update to edit.");
            return;
        }

        const update = selectedUpdates[0];
        const title = update.querySelector("h3")?.textContent || "";
        const message = update.querySelector("p")?.textContent || "";
        const isAnnouncement = update.querySelector(".announcement-checkbox")?.checked || false;

        const newPanel = document.createElement("div");
        newPanel.classList.add("update-panel");
        newPanel.innerHTML = `
            <input type="file" class="upload-photo">
            <input type="text" placeholder="Title" class="title-input" value="${title}">
            <textarea placeholder="Message" class="message-input">${message}</textarea>
            <label>
                <input type="checkbox" class="announcement-checkbox" ${isAnnouncement ? "checked" : ""}> Include on Announcements
            </label>
            <div class="error-message"></div>
            <button class="save-button">Save</button>
            <button class="close-button">X</button>
        `;

        update.replaceWith(newPanel);

        const saveButton = newPanel.querySelector(".save-button");
        const closeButton = newPanel.querySelector(".close-button");
        const photoInput = newPanel.querySelector(".upload-photo");

        saveButton.addEventListener("click", () => {
            const updatedTitle = newPanel.querySelector(".title-input").value;
            const updatedMessage = newPanel.querySelector(".message-input").value;
            const updatedPhoto = photoInput.files[0];
            const updatedAnnouncement = newPanel.querySelector(".announcement-checkbox").checked;
            const timestamp = new Date().toLocaleString();

            if (updatedTitle && updatedMessage) {
                saveUpdateToDatabase(updatedTitle, updatedMessage, updatedPhoto, "news", updatedAnnouncement, timestamp, (photoURL) => {
                    // Update UI after editing
                    newPanel.replaceWith(createPanel(updatedTitle, updatedMessage, photoURL, timestamp, updatedAnnouncement));
                });
            } else {
                alert("Please fill out all fields.");
            }
        });

        closeButton.addEventListener("click", () => {
            newPanel.replaceWith(update);
        });
    };

    editNewsButton.addEventListener("click", () => handleEdit(newsContainer));
    editEventsButton.addEventListener("click", () => handleEdit(eventsContainer));
});

// AJAX for Save
function saveUpdateToDatabase(title, message, photo, category, includeAnnouncement, timestamp, callback) {
    const formData = new FormData();
    formData.append("action", "save");
    formData.append("title", title);
    formData.append("message", message);
    formData.append("category", category);
    formData.append("includeAnnouncement", includeAnnouncement);
    formData.append("timestamp", timestamp);
    if (photo) formData.append("photo", photo);

    fetch("/database/updates-handler.php", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Save Response:", data);
            alert("Update saved successfully!");
            if (callback) callback(data.photoURL || "");
        })
        .catch((error) => {
            console.error("Error saving update:", error);
        });
}

// AJAX for Delete
function deleteUpdateFromDatabase(update) {
    const updateId = update.dataset.id; // Assuming each update panel has a `data-id` attribute
    const formData = new FormData();
    formData.append("action", "delete");
    formData.append("id", updateId);

    fetch("/database/updates-handler.php", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.text())
        .then((data) => {
            console.log("Delete Response:", data);
        })
        .catch((error) => {
            console.error("Error deleting update:", error);
        });
}
