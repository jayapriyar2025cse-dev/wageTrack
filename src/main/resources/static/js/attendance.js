document.addEventListener("DOMContentLoaded", function () {

    const attendanceTableBody =
        document.getElementById("attendanceTableBody");

    const attendanceEmpty =
        document.getElementById("attendanceEmpty");

    const totalAttendance =
        document.getElementById("totalAttendance");

    const presentCount =
        document.getElementById("presentCount");

    const halfDayCount =
        document.getElementById("halfDayCount");

    const absentCount =
        document.getElementById("absentCount");

    const addAttendanceBtn =
        document.getElementById("addAttendanceBtn");

    const refreshAttendanceBtn =
        document.getElementById("refreshAttendanceBtn");

    const attendanceModal =
        document.getElementById("attendanceModal");

    const closeAttendanceModal =
        document.getElementById("closeAttendanceModal");

    const cancelAttendanceBtn =
        document.getElementById("cancelAttendanceBtn");

    const attendanceForm =
        document.getElementById("attendanceForm");

    const attendanceWorker =
        document.getElementById("attendanceWorker");

    const attendanceWorksite =
        document.getElementById("attendanceWorksite");

    const attendanceDate =
        document.getElementById("attendanceDate");

    const attendanceStatus =
        document.getElementById("attendanceStatus");

    const overtimeHours =
        document.getElementById("overtimeHours");

    const attendanceMessage =
        document.getElementById("attendanceMessage");


    // =====================================
    // Check Worker Page
    // =====================================

    const isWorkerPage =
        window.location.pathname === "/worker-attendance";


    let attendanceRecords = [];
    let workers = [];
    let worksites = [];


    // =====================================
    // Worker Page - Hide Admin Controls
    // =====================================

    if (isWorkerPage) {

        if (addAttendanceBtn) {
            addAttendanceBtn.style.display = "none";
        }

        if (attendanceModal) {
            attendanceModal.style.display = "none";
        }
    }


    // =========================
    // Load Workers
    // =========================

    async function loadWorkers() {

        // Worker page doesn't need workers list
        if (isWorkerPage) {
            return;
        }

        const response =
            await fetch("/api/workers");

        if (!response.ok) {
            throw new Error("Unable to load workers");
        }

        workers =
            await response.json();

        populateWorkerDropdown();
    }


    // =========================
    // Load Worksites
    // =========================

    async function loadWorksites() {

        // Worker page doesn't need worksites list
        if (isWorkerPage) {
            return;
        }

        const response =
            await fetch("/api/worksites");

        if (!response.ok) {
            throw new Error("Unable to load worksites");
        }

        worksites =
            await response.json();

        populateWorksiteDropdown();
    }


    // =========================
    // Populate Worker Dropdown
    // =========================

    function populateWorkerDropdown() {

        if (!attendanceWorker) {
            return;
        }

        attendanceWorker.innerHTML = `
            <option value="">
                Select worker
            </option>
        `;

        workers.forEach(function (worker) {

            const option =
                document.createElement("option");

            option.value =
                worker.id;

            option.textContent =
                worker.name +
                " - ₹" +
                formatAmount(worker.dailyWage);

            attendanceWorker.appendChild(option);
        });
    }


    // =========================
    // Populate Worksite Dropdown
    // =========================

    function populateWorksiteDropdown() {

        if (!attendanceWorksite) {
            return;
        }

        attendanceWorksite.innerHTML = `
            <option value="">
                Select worksite
            </option>
        `;

        worksites.forEach(function (worksite) {

            const option =
                document.createElement("option");

            option.value =
                worksite.id;

            option.textContent =
                worksite.name +
                " - " +
                worksite.location;

            attendanceWorksite.appendChild(option);
        });
    }


    // =========================
    // Load Attendance
    // =========================

    async function loadAttendance() {

        try {

            let url =
                "/api/attendance";


            // Worker:
            // own attendance only
            if (isWorkerPage) {

                url =
                    "/api/attendance/my";
            }


            const response =
                await fetch(url);


            if (!response.ok) {

                throw new Error(
                    "Unable to load attendance"
                );
            }


            attendanceRecords =
                await response.json();


            renderAttendance(
                attendanceRecords
            );


            updateStats(
                attendanceRecords
            );

        }
        catch (error) {

            console.error(error);

            attendanceTableBody.innerHTML = "";

            attendanceEmpty.style.display =
                "block";

            attendanceEmpty.innerHTML = `
                <h3>Unable to load attendance</h3>
                <p>Please check the Spring Boot server.</p>
            `;
        }
    }


    // =========================
    // Render Attendance
    // =========================

    function renderAttendance(list) {

        attendanceTableBody.innerHTML = "";


        if (list.length === 0) {

            attendanceEmpty.style.display =
                "block";

            return;
        }


        attendanceEmpty.style.display =
            "none";


        list.forEach(function (record) {

            const row =
                document.createElement("tr");


            const workerName =
                record.worker
                    ? record.worker.name
                    : "Unknown";


            const worksiteName =
                record.worksite
                    ? record.worksite.name
                    : "Unknown";


            // =================================
            // Worker Page
            // No Edit / Delete buttons
            // =================================

            if (isWorkerPage) {

                row.innerHTML = `

                    <td>
                        #${record.id}
                    </td>

                    <td>
                        ${escapeHtml(record.date)}
                    </td>

                    <td>
                        <strong>
                            ${escapeHtml(workerName)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(worksiteName)}
                    </td>

                    <td>
                        <span class="status-badge ${getStatusClass(record.status)}">
                            ${escapeHtml(record.status)}
                        </span>
                    </td>

                    <td>
                        ${formatAmount(record.overtimeHours)} hrs
                    </td>

                    <td>
                        <span style="color:#64748b;">
                            View Only
                        </span>
                    </td>
                `;
            }

            // =================================
            // Admin Page
            // Edit / Delete buttons
            // =================================

            else {

                row.innerHTML = `

                    <td>
                        #${record.id}
                    </td>

                    <td>
                        ${escapeHtml(record.date)}
                    </td>

                    <td>
                        <strong>
                            ${escapeHtml(workerName)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(worksiteName)}
                    </td>

                    <td>
                        <span class="status-badge ${getStatusClass(record.status)}">
                            ${escapeHtml(record.status)}
                        </span>
                    </td>

                    <td>
                        ${formatAmount(record.overtimeHours)} hrs
                    </td>

                    <td>

                        <button
                            type="button"
                            class="table-action edit-action"
                            onclick="editAttendance(${record.id})">
                            Edit
                        </button>

                        <button
                            type="button"
                            class="table-action delete-action"
                            onclick="deleteAttendance(${record.id})">
                            Delete
                        </button>

                    </td>
                `;
            }


            attendanceTableBody.appendChild(row);
        });
    }


    // =========================
    // Update Attendance Stats
    // =========================

    function updateStats(list) {

        let present = 0;
        let halfDay = 0;
        let absent = 0;


        list.forEach(function (record) {

            if (record.status === "PRESENT") {
                present++;
            }

            else if (record.status === "HALF_DAY") {
                halfDay++;
            }

            else if (record.status === "ABSENT") {
                absent++;
            }
        });


        totalAttendance.textContent =
            list.length;

        presentCount.textContent =
            present;

        halfDayCount.textContent =
            halfDay;

        absentCount.textContent =
            absent;
    }


    // =========================
    // Open Attendance Modal
    // =========================

    if (addAttendanceBtn) {

        addAttendanceBtn.addEventListener(
            "click",
            async function () {

                attendanceForm.reset();

                attendanceMessage.textContent = "";

                overtimeHours.value = 0;

                attendanceModal.style.display =
                    "flex";


                try {

                    await loadWorkers();

                    await loadWorksites();

                }
                catch (error) {

                    console.error(error);

                    showMessage(
                        "Unable to load workers or worksites."
                    );
                }
            }
        );
    }


    // =========================
    // Close Modal
    // =========================

    function closeModal() {

        attendanceModal.style.display =
            "none";

        attendanceForm.reset();

        overtimeHours.value = 0;

        attendanceMessage.textContent = "";
    }


    if (closeAttendanceModal) {

        closeAttendanceModal.addEventListener(
            "click",
            closeModal
        );
    }


    if (cancelAttendanceBtn) {

        cancelAttendanceBtn.addEventListener(
            "click",
            closeModal
        );
    }


    // =========================
    // Status Change
    // =========================

    if (attendanceStatus) {

        attendanceStatus.addEventListener(
            "change",
            function () {

                const status =
                    attendanceStatus.value;


                if (
                    status === "HALF_DAY" ||
                    status === "ABSENT"
                ) {

                    overtimeHours.value = 0;

                    overtimeHours.disabled =
                        true;
                }

                else {

                    overtimeHours.disabled =
                        false;
                }
            }
        );
    }


    // =========================
    // Add Attendance
    // =========================

    if (attendanceForm) {

        attendanceForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const workerId =
                    Number(attendanceWorker.value);


                const worksiteId =
                    Number(attendanceWorksite.value);


                const date =
                    attendanceDate.value;


                const status =
                    attendanceStatus.value;


                let overtime =
                    Number(
                        overtimeHours.value || 0
                    );


                if (!workerId) {

                    showMessage(
                        "Please select a worker."
                    );

                    return;
                }


                if (!worksiteId) {

                    showMessage(
                        "Please select a worksite."
                    );

                    return;
                }


                if (!date) {

                    showMessage(
                        "Please select a date."
                    );

                    return;
                }


                if (!status) {

                    showMessage(
                        "Please select attendance status."
                    );

                    return;
                }


                if (overtime < 0) {

                    showMessage(
                        "Overtime hours cannot be negative."
                    );

                    return;
                }


                if (
                    status === "HALF_DAY" ||
                    status === "ABSENT"
                ) {

                    overtime = 0;
                }


                try {

                    const response =
                        await fetch(
                            `/api/attendance?workerId=${workerId}&worksiteId=${worksiteId}`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    date: date,
                                    status: status,
                                    overtimeHours: overtime
                                })
                            }
                        );


                    if (!response.ok) {

                        const errorText =
                            await response.text();

                        throw new Error(
                            errorText ||
                            "Unable to save attendance"
                        );
                    }


                    closeModal();

                    await loadAttendance();


                    alert(
                        "Attendance saved successfully."
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
    }


    // =========================
    // Edit Attendance
    // =========================

    window.editAttendance =
        async function (id) {

            // Worker cannot edit
            if (isWorkerPage) {
                return;
            }


            const record =
                attendanceRecords.find(
                    function (item) {
                        return item.id === id;
                    }
                );


            if (!record) {
                return;
            }


            let status =
                prompt(
                    "Enter status (PRESENT, HALF_DAY, ABSENT):",
                    record.status
                );


            if (status === null) {
                return;
            }


            status =
                status.trim().toUpperCase();


            if (
                status !== "PRESENT" &&
                status !== "HALF_DAY" &&
                status !== "ABSENT"
            ) {

                alert(
                    "Status must be PRESENT, HALF_DAY or ABSENT"
                );

                return;
            }


            let overtime = 0;


            if (status === "PRESENT") {

                const overtimeInput =
                    prompt(
                        "Enter overtime hours:",
                        record.overtimeHours
                    );


                if (overtimeInput === null) {
                    return;
                }


                overtime =
                    Number(overtimeInput);


                if (overtime < 0) {

                    alert(
                        "Overtime hours cannot be negative."
                    );

                    return;
                }
            }


            const workerId =
                record.worker.id;


            const worksiteId =
                record.worksite.id;


            try {

                const response =
                    await fetch(
                        `/api/attendance/${id}?workerId=${workerId}&worksiteId=${worksiteId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                date: record.date,
                                status: status,
                                overtimeHours: overtime
                            })
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to update attendance"
                    );
                }


                await loadAttendance();


                alert(
                    "Attendance updated successfully."
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
    // Delete Attendance
    // =========================

    window.deleteAttendance =
        async function (id) {

            // Worker cannot delete
            if (isWorkerPage) {
                return;
            }


            const record =
                attendanceRecords.find(
                    function (item) {
                        return item.id === id;
                    }
                );


            if (!record) {
                return;
            }


            const confirmed =
                confirm(
                    "Delete attendance record #" +
                    id +
                    "?"
                );


            if (!confirmed) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `/api/attendance/${id}`,
                        {
                            method: "DELETE"
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to delete attendance"
                    );
                }


                await loadAttendance();


                alert(
                    "Attendance deleted successfully."
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
    // Refresh
    // =========================

    if (refreshAttendanceBtn) {

        refreshAttendanceBtn.addEventListener(
            "click",
            async function () {

                await loadAttendance();

            }
        );
    }


    // =========================
    // Status CSS Class
    // =========================

    function getStatusClass(status) {

        if (status === "PRESENT") {
            return "status-present";
        }


        if (status === "HALF_DAY") {
            return "status-halfday";
        }


        if (status === "ABSENT") {
            return "status-absent";
        }


        return "";
    }


    // =========================
    // Format Amount
    // =========================

    function formatAmount(value) {

        return Number(value || 0)
            .toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
    }


    // =========================
    // Show Error Message
    // =========================

    function showMessage(message) {

        if (attendanceMessage) {

            attendanceMessage.textContent =
                message;
        }
    }


    // =========================
    // Escape HTML
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

    async function initializePage() {

        try {

            await loadWorkers();

            await loadWorksites();

            await loadAttendance();

        }
        catch (error) {

            console.error(error);

            attendanceEmpty.style.display =
                "block";

            attendanceEmpty.innerHTML = `
                <h3>Unable to load attendance page</h3>
                <p>Please check the Spring Boot server.</p>
            `;
        }
    }


    initializePage();

});