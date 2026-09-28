document.addEventListener("DOMContentLoaded", function () {

    const worksitesTableBody =
        document.getElementById("worksitesTableBody");

    const worksitesEmpty =
        document.getElementById("worksitesEmpty");

    const totalWorksites =
        document.getElementById("totalWorksites");

    const addWorksiteBtn =
        document.getElementById("addWorksiteBtn");

    const refreshWorksitesBtn =
        document.getElementById("refreshWorksitesBtn");

    const worksiteModal =
        document.getElementById("worksiteModal");

    const closeWorksiteModal =
        document.getElementById("closeWorksiteModal");

    const cancelWorksiteBtn =
        document.getElementById("cancelWorksiteBtn");

    const worksiteForm =
        document.getElementById("worksiteForm");

    const worksiteName =
        document.getElementById("worksiteName");

    const worksiteLocation =
        document.getElementById("worksiteLocation");

    const worksiteMessage =
        document.getElementById("worksiteMessage");


    let worksites = [];


    // Load worksites
    async function loadWorksites() {

        try {

            const response =
                await fetch("/api/worksites");

            if (!response.ok) {
                throw new Error("Unable to load worksites");
            }

            worksites = await response.json();

            renderWorksites(worksites);

            updateStats(worksites);

        }
        catch (error) {

            console.error(error);

            worksitesTableBody.innerHTML = "";

            worksitesEmpty.style.display = "block";

            worksitesEmpty.innerHTML = `
                <h3>Unable to load worksites</h3>
                <p>Please check the Spring Boot server.</p>
            `;
        }
    }


    // Render worksites
    function renderWorksites(list) {

        worksitesTableBody.innerHTML = "";

        if (list.length === 0) {

            worksitesEmpty.style.display = "block";

            return;
        }

        worksitesEmpty.style.display = "none";


        list.forEach(function (worksite) {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>
                    #${worksite.id}
                </td>

                <td>
                    <strong>
                        ${escapeHtml(worksite.name)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(worksite.location)}
                </td>

                <td>

                    <button
                        type="button"
                        class="table-action edit-action"
                        onclick="editWorksite(${worksite.id})">
                        Edit
                    </button>

                    <button
                        type="button"
                        class="table-action delete-action"
                        onclick="deleteWorksite(${worksite.id})">
                        Delete
                    </button>

                </td>
            `;

            worksitesTableBody.appendChild(row);
        });
    }


    // Update statistics
    function updateStats(list) {

        totalWorksites.textContent =
            list.length;
    }


    // Open modal
    addWorksiteBtn.addEventListener(
        "click",
        function () {

            worksiteForm.reset();

            worksiteMessage.textContent = "";

            worksiteModal.style.display = "flex";
        }
    );


    // Close modal
    function closeModal() {

        worksiteModal.style.display = "none";

        worksiteForm.reset();

        worksiteMessage.textContent = "";
    }


    closeWorksiteModal.addEventListener(
        "click",
        closeModal
    );


    cancelWorksiteBtn.addEventListener(
        "click",
        closeModal
    );


    // Add worksite
    worksiteForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                worksiteName.value.trim();

            const location =
                worksiteLocation.value.trim();


            if (name.length < 2) {

                showMessage(
                    "Worksite name must contain at least 2 characters."
                );

                return;
            }


            if (location.length < 2) {

                showMessage(
                    "Location is required."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        "/api/worksites",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                location: location
                            })
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to add worksite"
                    );
                }


                closeModal();

                await loadWorksites();


                alert(
                    "Worksite added successfully."
                );

            }
            catch (error) {

                console.error(error);

                showMessage(
                    error.message ||
                    "Unable to connect to server."
                );
            }
        }
    );


    // Edit worksite
    window.editWorksite =
        async function (id) {

            const worksite =
                worksites.find(function (item) {
                    return item.id === id;
                });


            if (!worksite) {
                return;
            }


            const newName =
                prompt(
                    "Enter worksite name:",
                    worksite.name
                );


            if (newName === null) {
                return;
            }


            const newLocation =
                prompt(
                    "Enter location:",
                    worksite.location
                );


            if (newLocation === null) {
                return;
            }


            const name =
                newName.trim();

            const location =
                newLocation.trim();


            if (name.length < 2) {

                alert(
                    "Worksite name must contain at least 2 characters."
                );

                return;
            }


            if (location.length < 2) {

                alert(
                    "Location is required."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        `/api/worksites/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                location: location
                            })
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to update worksite"
                    );
                }


                await loadWorksites();


                alert(
                    "Worksite updated successfully."
                );

            }
            catch (error) {

                console.error(error);

                alert(
                    error.message ||
                    "Unable to connect to server."
                );
            }
        };


    // Delete worksite
    window.deleteWorksite =
        async function (id) {

            const worksite =
                worksites.find(function (item) {
                    return item.id === id;
                });


            if (!worksite) {
                return;
            }


            const confirmed =
                confirm(
                    "Delete worksite " +
                    worksite.name +
                    "?"
                );


            if (!confirmed) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `/api/worksites/${id}`,
                        {
                            method: "DELETE"
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to delete worksite"
                    );
                }


                await loadWorksites();


                alert(
                    "Worksite deleted successfully."
                );

            }
            catch (error) {

                console.error(error);

                alert(
                    error.message ||
                    "Unable to connect to server."
                );
            }
        };


    // Show form message
    function showMessage(message) {

        worksiteMessage.textContent =
            message;
    }


    // Escape HTML
    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // Initial load
    loadWorksites();

});