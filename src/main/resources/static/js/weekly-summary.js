document.addEventListener("DOMContentLoaded", function () {

    const summaryForm =
        document.getElementById("summaryForm");

    const summaryWorker =
        document.getElementById("summaryWorker");

    const startDate =
        document.getElementById("startDate");

    const endDate =
        document.getElementById("endDate");

    const summaryMessage =
        document.getElementById("summaryMessage");

    const summaryResultCard =
        document.getElementById("summaryResultCard");

    const summaryPeriod =
        document.getElementById("summaryPeriod");

    const summaryWorkerName =
        document.getElementById("summaryWorkerName");

    const regularWage =
        document.getElementById("regularWage");

    const overtimePay =
        document.getElementById("overtimePay");

    const totalPayable =
        document.getElementById("totalPayable");


    // =========================
    // Load Workers
    // =========================

    async function loadWorkers() {

        try {

            const response =
                await fetch("/api/workers");

            if (!response.ok) {
                throw new Error(
                    "Unable to load workers"
                );
            }

            const workers =
                await response.json();


            summaryWorker.innerHTML = `
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

                summaryWorker.appendChild(option);
            });


            // Select first worker automatically
            if (workers.length > 0) {

                summaryWorker.value =
                    workers[0].id;
            }

        }
        catch (error) {

            console.error(error);

            summaryMessage.textContent =
                "Unable to load workers.";
        }
    }


    // =========================
    // Default Date Range
    // =========================

    function setDefaultDates() {

        startDate.value =
            "2026-09-28";

        endDate.value =
            "2026-10-04";
    }


    // =========================
    // Generate Summary
    // =========================

    summaryForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            summaryMessage.textContent = "";

            summaryResultCard.style.display =
                "none";


            const workerId =
                Number(summaryWorker.value);

            const start =
                startDate.value;

            const end =
                endDate.value;


            if (!workerId) {

                summaryMessage.textContent =
                    "Please select a worker.";

                return;
            }


            if (!start || !end) {

                summaryMessage.textContent =
                    "Please select both dates.";

                return;
            }


            if (end < start) {

                summaryMessage.textContent =
                    "End date cannot be before start date.";

                return;
            }


            try {

                const url =
                    "/api/attendance/weekly-summary" +
                    "?workerId=" + workerId +
                    "&startDate=" + start +
                    "&endDate=" + end;


                const response =
                    await fetch(url);


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to generate summary."
                    );
                }


                const summary =
                    await response.json();


                displaySummary(summary);

            }
            catch (error) {

                console.error(error);

                summaryMessage.textContent =
                    error.message ||
                    "Unable to connect to server.";
            }
        }
    );


    // =========================
    // Display Summary
    // =========================

    function displaySummary(summary) {

        summaryWorkerName.textContent =
            summary.workerName;

        summaryPeriod.textContent =
            formatDate(summary.startDate) +
            " to " +
            formatDate(summary.endDate);

        regularWage.textContent =
            "₹" +
            formatAmount(summary.regularWage);

        overtimePay.textContent =
            "₹" +
            formatAmount(summary.overtimePay);

        totalPayable.textContent =
            "₹" +
            formatAmount(summary.totalPayable);


        summaryResultCard.style.display =
            "block";
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
    // Format Date
    // =========================

    function formatDate(dateValue) {

        if (!dateValue) {
            return "-";
        }

        const date =
            new Date(dateValue + "T00:00:00");

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }


    // =========================
    // Initial Page Load
    // =========================

    async function initializePage() {

        setDefaultDates();

        await loadWorkers();

    }


    initializePage();

});