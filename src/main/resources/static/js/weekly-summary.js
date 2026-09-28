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


    // =====================================
    // Check Worker Page
    // =====================================

    const isWorkerPage =
        window.location.pathname === "/worker-weekly-summary";


    // =====================================
    // Change Page UI for Worker
    // =====================================

    function setupWorkerPage() {

        if (!isWorkerPage) {
            return;
        }


        // -------------------------
        // Sidebar
        // -------------------------

        const portalText =
            document.querySelector(".logo-text span");

        if (portalText) {

            portalText.textContent =
                "Worker Portal";
        }


        const navigation =
            document.querySelectorAll(".navigation .nav-link");


        // Hide Workers
        const workersLink =
            navigation[1];

        if (workersLink) {

            workersLink.style.display =
                "none";
        }


        // Hide Worksites
        const worksitesLink =
            navigation[2];

        if (worksitesLink) {

            worksitesLink.style.display =
                "none";
        }


        // Dashboard
        const dashboardLink =
            navigation[0];

        if (dashboardLink) {

            dashboardLink.href =
                "/worker-dashboard";

            dashboardLink.textContent =
                "Dashboard";
        }


        // Attendance
        const attendanceLink =
            navigation[3];

        if (attendanceLink) {

            attendanceLink.href =
                "/worker-attendance";

            attendanceLink.textContent =
                "My Attendance";
        }


        // Weekly Summary
        const weeklySummaryLink =
            navigation[4];

        if (weeklySummaryLink) {

            weeklySummaryLink.href =
                "/worker-weekly-summary";

            weeklySummaryLink.textContent =
                "Wage Summary";
        }


        // Payments
        const paymentsLink =
            navigation[5];

        if (paymentsLink) {

            paymentsLink.href =
                "/worker-payments";

            paymentsLink.textContent =
                "My Payments";
        }


        // -------------------------
        // Topbar
        // -------------------------

        const pageTitle =
            document.querySelector(".page-heading h1");

        if (pageTitle) {

            pageTitle.textContent =
                "My Wage Summary";
        }


        const pageDescription =
            document.querySelector(".page-heading p");

        if (pageDescription) {

            pageDescription.textContent =
                "View your weekly wage calculation";
        }


        const profileName =
            document.querySelector(".profile-info strong");

        if (profileName) {

            profileName.textContent =
                "Worker";
        }


        const profileRole =
            document.querySelector(".profile-info span");

        if (profileRole) {

            profileRole.textContent =
                "Worker";
        }


        // -------------------------
        // Summary Form
        // -------------------------

        const formCard =
            summaryForm.closest(".card");

        if (formCard) {

            const heading =
                formCard.querySelector(".card-header h2");

            const description =
                formCard.querySelector(".card-header p");


            if (heading) {

                heading.textContent =
                    "Generate My Wage Summary";
            }


            if (description) {

                description.textContent =
                    "Select a date range to view your wage.";
            }
        }


        // -------------------------
        // Hide Worker Dropdown
        // -------------------------

        const workerGroup =
            summaryWorker.closest(".form-group");

        if (workerGroup) {

            workerGroup.style.display =
                "none";
        }


        // -------------------------
        // Change Button Text
        // -------------------------

        const generateButton =
            summaryForm.querySelector(
                'button[type="submit"]'
            );

        if (generateButton) {

            generateButton.textContent =
                "Generate My Summary";
        }


        // -------------------------
        // Result Header
        // -------------------------

        const resultHeading =
            summaryResultCard.querySelector(
                ".card-header h2"
            );

        if (resultHeading) {

            resultHeading.textContent =
                "My Wage Summary";
        }


        const resultDescription =
            summaryResultCard.querySelector(
                ".summary-worker-header span"
            );

        if (resultDescription) {

            resultDescription.textContent =
                "Your weekly wage calculation";
        }


        // -------------------------
        // Calculation Heading
        // -------------------------

        const calculationCard =
            document.querySelectorAll(".card")[2];

        if (calculationCard) {

            const heading =
                calculationCard.querySelector(
                    ".card-header h2"
                );

            const description =
                calculationCard.querySelector(
                    ".card-header p"
                );


            if (heading) {

                heading.textContent =
                    "Wage Calculation";
            }


            if (description) {

                description.textContent =
                    "How your weekly amount is determined";
            }
        }
    }


    // =====================================
    // Load Workers
    // =====================================

    async function loadWorkers() {

        // Worker does not need worker list
        if (isWorkerPage) {
            return;
        }


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


                summaryWorker.appendChild(
                    option
                );
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


    // =====================================
    // Default Date Range
    // =====================================

    function setDefaultDates() {

        startDate.value =
            "2026-09-28";

        endDate.value =
            "2026-10-04";
    }


    // =====================================
    // Generate Summary
    // =====================================

    summaryForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            summaryMessage.textContent = "";

            summaryResultCard.style.display =
                "none";


            const start =
                startDate.value;


            const end =
                endDate.value;


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

                let url;


                // =================================
                // Worker
                // =================================

                if (isWorkerPage) {

                    url =
                        "/api/attendance/my-weekly-summary" +
                        "?startDate=" + start +
                        "&endDate=" + end;
                }


                // =================================
                // Admin
                // =================================

                else {

                    const workerId =
                        Number(summaryWorker.value);


                    if (!workerId) {

                        summaryMessage.textContent =
                            "Please select a worker.";

                        return;
                    }


                    url =
                        "/api/attendance/weekly-summary" +
                        "?workerId=" + workerId +
                        "&startDate=" + start +
                        "&endDate=" + end;
                }


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


    // =====================================
    // Display Summary
    // =====================================

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


    // =====================================
    // Format Amount
    // =====================================

    function formatAmount(value) {

        return Number(value || 0)
            .toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }
            );
    }


    // =====================================
    // Format Date
    // =====================================

    function formatDate(dateValue) {

        if (!dateValue) {
            return "-";
        }


        const date =
            new Date(
                dateValue + "T00:00:00"
            );


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }


    // =====================================
    // Initial Page Load
    // =====================================

    async function initializePage() {

        setupWorkerPage();

        setDefaultDates();

        await loadWorkers();
    }


    initializePage();

});