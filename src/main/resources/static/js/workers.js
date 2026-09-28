document.addEventListener("DOMContentLoaded", function () {

    const workersTableBody =
        document.getElementById("workersTableBody");

    const workersEmpty =
        document.getElementById("workersEmpty");

    const totalWorkers =
        document.getElementById("totalWorkers");

    const totalDailyWage =
        document.getElementById("totalDailyWage");

    const addWorkerBtn =
        document.getElementById("addWorkerBtn");

    const refreshWorkersBtn =
        document.getElementById("refreshWorkersBtn");

    const workerModal =
        document.getElementById("workerModal");

    const closeWorkerModal =
        document.getElementById("closeWorkerModal");

    const cancelWorkerBtn =
        document.getElementById("cancelWorkerBtn");

    const workerForm =
        document.getElementById("workerForm");

    const workerName =
        document.getElementById("workerName");

    const dailyWage =
        document.getElementById("dailyWage");

    const workerMessage =
        document.getElementById("workerMessage");


    let workers = [];


    // =========================
    // Load Workers
    // =========================

    async function loadWorkers() {

        try {

            const response =
                await fetch("/api/workers");

            if (!response.ok) {
                throw new Error("Unable to load workers");
            }

            workers = await response.json();

            renderWorkers(workers);
            updateStats(workers);

        }
        catch (error) {

            console.error(error);

            workersTableBody.innerHTML = "";

            workersEmpty.style.display = "block";

            workersEmpty.innerHTML = `
                <h3>Unable to load workers</h3>
                <p>Please check the Spring Boot server.</p>
            `;
        }
    }


    // =========================
    // Render Workers
    // =========================

    function renderWorkers(list) {

        workersTableBody.innerHTML = "";

        if (list.length === 0) {

            workersEmpty.style.display = "block";

            return;
        }

        workersEmpty.style.display = "none";


        list.forEach(function (worker) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    #${worker.id}
                </td>

                <td>
                    <div class="worker-table-name">

                        <div class="worker-avatar">
                            ${getInitial(worker.name)}
                        </div>

                        <div>
                            <strong>
                                ${escapeHtml(worker.name)}
                            </strong>

                            <span>
                                Daily wage worker
                            </span>
                        </div>

                    </div>
                </td>

                <td>
                    <strong>
                        ₹${formatAmount(worker.dailyWage)}
                    </strong>
                    <span class="table-subtext">
                        per day
                    </span>
                </td>

                <td>
                    <button
                        type="button"
                        class="table-action edit-action"
                        onclick="editWorker(${worker.id})">
                        Edit
                    </button>

                    <button
                        type="button"
                        class="table-action delete-action"
                        onclick="deleteWorker(${worker.id})">
                        Delete
                    </button>
                </td>
            `;

            workersTableBody.appendChild(row);

        });
    }


    // =========================
    // Update Statistics
    // =========================

    function updateStats(list) {

        totalWorkers.textContent =
            list.length;


        let wageTotal = 0;


        list.forEach(function (worker) {

            wageTotal +=
                Number(worker.dailyWage || 0);

        });


        totalDailyWage.textContent =
            "₹" + formatAmount(wageTotal);
    }


    // =========================
    // Open Add Worker Modal
    // =========================

    addWorkerBtn.addEventListener(
        "click",
        function () {

            workerForm.reset();

            workerMessage.textContent = "";

            workerModal.style.display = "flex";
        }
    );


    // =========================
    // Close Modal
    // =========================

    function closeModal() {

        workerModal.style.display = "none";

        workerForm.reset();

        workerMessage.textContent = "";
    }


    closeWorkerModal.addEventListener(
        "click",
        closeModal
    );


    cancelWorkerBtn.addEventListener(
        "click",
        closeModal
    );


    // =========================
    // Add Worker
    // =========================

    workerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                workerName.value.trim();

            const wage =
                Number(dailyWage.value);


            if (name.length < 2) {

                showMessage(
                    "Worker name must contain at least 2 characters."
                );

                return;
            }


            if (!wage || wage <= 0) {

                showMessage(
                    "Daily wage must be greater than 0."
                );

                return;
            }


            // Check duplicate worker name
            const duplicate =
                workers.some(function (worker) {

                    return (
                        worker.name &&
                        worker.name.toLowerCase() ===
                        name.toLowerCase()
                    );
                });


            if (duplicate) {

                showMessage(
                    "A worker with this name already exists."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        "/api/workers",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                dailyWage: wage
                            })
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to add worker"
                    );
                }


                closeModal();

                await loadWorkers();


                alert(
                    "Worker added successfully."
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


    // =========================
    // Edit Worker
    // =========================

    window.editWorker =
        async function (id) {

            const worker =
                workers.find(function (item) {
                    return item.id === id;
                });


            if (!worker) {
                return;
            }


            const newName =
                prompt(
                    "Enter worker name:",
                    worker.name
                );


            if (newName === null) {
                return;
            }


            const newWage =
                prompt(
                    "Enter daily wage:",
                    worker.dailyWage
                );


            if (newWage === null) {
                return;
            }


            const name =
                newName.trim();

            const wage =
                Number(newWage);


            if (name.length < 2) {

                alert(
                    "Worker name must contain at least 2 characters."
                );

                return;
            }


            if (!wage || wage <= 0) {

                alert(
                    "Daily wage must be greater than 0."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        `/api/workers/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                dailyWage: wage
                            })
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to update worker"
                    );
                }


                await loadWorkers();


                alert(
                    "Worker updated successfully."
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


    // =========================
    // Delete Worker
    // =========================

    window.deleteWorker =
        async function (id) {

            const worker =
                workers.find(function (item) {
                    return item.id === id;
                });


            if (!worker) {
                return;
            }


            const confirmed =
                confirm(
                    "Delete worker " +
                    worker.name +
                    "?"
                );


            if (!confirmed) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `/api/workers/${id}`,
                        {
                            method: "DELETE"
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to delete worker"
                    );
                }


                await loadWorkers();


                alert(
                    "Worker deleted successfully."
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


    // =========================
    // Show Form Message
    // =========================

    function showMessage(message) {

        workerMessage.textContent =
            message;
    }


    // =========================
    // Format Amount
    // =========================

    function formatAmount(amount) {

        return Number(amount || 0)
            .toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
    }


    // =========================
    // Get Initial
    // =========================

    function getInitial(name) {

        if (!name) {
            return "?";
        }

        return name
            .trim()
            .charAt(0)
            .toUpperCase();
    }


    // =========================
    // Prevent HTML Injection
    // =========================

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // =========================
    // Initial Load
    // =========================

    loadWorkers();

});