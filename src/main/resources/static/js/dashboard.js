document.addEventListener("DOMContentLoaded", function () {

    const totalWorkers =
        document.getElementById("totalWorkers");

    const totalWorksites =
        document.getElementById("totalWorksites");

    const totalAttendance =
        document.getElementById("totalAttendance");

    const totalPayments =
        document.getElementById("totalPayments");

    const overviewWorkers =
        document.getElementById("overviewWorkers");

    const overviewWorksites =
        document.getElementById("overviewWorksites");

    const overviewAttendance =
        document.getElementById("overviewAttendance");

    const overviewPayments =
        document.getElementById("overviewPayments");

    const wageSummary =
        document.getElementById("wageSummary");

    const recentPayment =
        document.getElementById("recentPayment");


    // Load workers
    async function loadWorkers() {

        const response =
            await fetch("/api/workers");

        if (!response.ok) {
            throw new Error("Unable to load workers");
        }

        return await response.json();
    }


    // Load worksites
    async function loadWorksites() {

        const response =
            await fetch("/api/worksites");

        if (!response.ok) {
            throw new Error("Unable to load worksites");
        }

        return await response.json();
    }


    // Load attendance
    async function loadAttendance() {

        const response =
            await fetch("/api/attendance");

        if (!response.ok) {
            throw new Error("Unable to load attendance");
        }

        return await response.json();
    }


    // Load payments
    async function loadPayments() {

        const response =
            await fetch("/api/payments");

        if (!response.ok) {
            throw new Error("Unable to load payments");
        }

        return await response.json();
    }


    // Update dashboard statistics
    async function loadDashboard() {

        try {

            const workers =
                await loadWorkers();

            const worksites =
                await loadWorksites();

            const attendance =
                await loadAttendance();

            const payments =
                await loadPayments();


            // Statistics

            totalWorkers.textContent =
                workers.length;

            totalWorksites.textContent =
                worksites.length;

            totalAttendance.textContent =
                attendance.length;

            totalPayments.textContent =
                payments.length;


            // Overview

            overviewWorkers.textContent =
                workers.length;

            overviewWorksites.textContent =
                worksites.length;

            overviewAttendance.textContent =
                attendance.length;

            overviewPayments.textContent =
                payments.length;


            // Load latest worker wage summary

            if (workers.length > 0) {

                const worker =
                    workers[0];

                await loadWageSummary(worker.id);
            }
            else {

                wageSummary.innerHTML =
                    "<p>No workers available.</p>";
            }


            // Load latest payment

            if (payments.length > 0) {

                const latestPayment =
                    payments[payments.length - 1];

                showRecentPayment(latestPayment);

            }
            else {

                recentPayment.innerHTML =
                    "<p>No payment records available.</p>";
            }

        }
        catch (error) {

            console.error(error);

            wageSummary.innerHTML =
                "<p>Unable to load dashboard data.</p>";

            recentPayment.innerHTML =
                "<p>Unable to load payment data.</p>";
        }
    }


    // Load wage summary
    async function loadWageSummary(workerId) {

        try {

            const response =
                await fetch(
                    "/api/attendance/weekly-summary" +
                    "?workerId=" + workerId +
                    "&startDate=2026-09-28" +
                    "&endDate=2026-10-04"
                );

            if (!response.ok) {

                throw new Error(
                    "Unable to load wage summary"
                );
            }

            const summary =
                await response.json();


            wageSummary.innerHTML = `

                <div class="summary-row">

                    <div>
                        <span>Worker</span>
                        <strong>
                            ${escapeHtml(summary.workerName)}
                        </strong>
                    </div>

                    <div>
                        <span>Regular Wage</span>
                        <strong>
                            ₹${formatAmount(summary.regularWage)}
                        </strong>
                    </div>

                    <div>
                        <span>Overtime</span>
                        <strong>
                            ₹${formatAmount(summary.overtimePay)}
                        </strong>
                    </div>

                    <div>
                        <span>Total Payable</span>
                        <strong>
                            ₹${formatAmount(summary.totalPayable)}
                        </strong>
                    </div>

                </div>
            `;

        }
        catch (error) {

            console.error(error);

            wageSummary.innerHTML =
                "<p>Wage summary is not available.</p>";
        }
    }


    // Show recent payment
    function showRecentPayment(payment) {

        const workerName =
            payment.worker
                ? payment.worker.name
                : "Unknown worker";


        recentPayment.innerHTML = `

            <div class="summary-row">

                <div>
                    <span>Worker</span>
                    <strong>
                        ${escapeHtml(workerName)}
                    </strong>
                </div>

                <div>
                    <span>Payment Date</span>
                    <strong>
                        ${escapeHtml(
                            payment.paymentDate || "-"
                        )}
                    </strong>
                </div>

                <div>
                    <span>Amount</span>
                    <strong>
                        ₹${formatAmount(payment.amount)}
                    </strong>
                </div>

                <div>
                    <span>Status</span>
                    <strong class="payment-status">
                        Paid
                    </strong>
                </div>

            </div>
        `;
    }


    // Format amount
    function formatAmount(amount) {

        return Number(amount || 0)
            .toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
    }


    // Prevent HTML injection
    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // Start dashboard
    loadDashboard();

});