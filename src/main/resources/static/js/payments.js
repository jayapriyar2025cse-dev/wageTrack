document.addEventListener("DOMContentLoaded", function () {

    const paymentsTableBody =
        document.getElementById("paymentsTableBody");

    const paymentsEmpty =
        document.getElementById("paymentsEmpty");

    const totalPayments =
        document.getElementById("totalPayments");

    const totalPaid =
        document.getElementById("totalPaid");

    const addPaymentBtn =
        document.getElementById("addPaymentBtn");

    const refreshPaymentsBtn =
        document.getElementById("refreshPaymentsBtn");

    const paymentModal =
        document.getElementById("paymentModal");

    const closePaymentModal =
        document.getElementById("closePaymentModal");

    const cancelPaymentBtn =
        document.getElementById("cancelPaymentBtn");

    const paymentForm =
        document.getElementById("paymentForm");

    const paymentWorker =
        document.getElementById("paymentWorker");

    const paymentDate =
        document.getElementById("paymentDate");

    const paymentAmount =
        document.getElementById("paymentAmount");

    const paymentMessage =
        document.getElementById("paymentMessage");


    let payments = [];
    let workers = [];


    // =========================
    // Load Workers
    // =========================

    async function loadWorkers() {

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
    // Populate Worker Dropdown
    // =========================

    function populateWorkerDropdown() {

        paymentWorker.innerHTML = `
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

            paymentWorker.appendChild(option);
        });
    }


    // =========================
    // Load Payments
    // =========================

    async function loadPayments() {

        try {

            const response =
                await fetch("/api/payments");

            if (!response.ok) {
                throw new Error(
                    "Unable to load payments"
                );
            }

            payments =
                await response.json();

            renderPayments(payments);
            updateStats(payments);

        }
        catch (error) {

            console.error(error);

            paymentsTableBody.innerHTML = "";

            paymentsEmpty.style.display =
                "block";

            paymentsEmpty.innerHTML = `
                <h3>Unable to load payments</h3>
                <p>Please check the Spring Boot server.</p>
            `;
        }
    }


    // =========================
    // Render Payments
    // =========================

    function renderPayments(list) {

        paymentsTableBody.innerHTML = "";

        if (list.length === 0) {

            paymentsEmpty.style.display =
                "block";

            return;
        }

        paymentsEmpty.style.display =
            "none";


        list.forEach(function (payment) {

            const row =
                document.createElement("tr");


            const workerName =
                payment.worker
                    ? payment.worker.name
                    : "Unknown";


            row.innerHTML = `

                <td>
                    #${payment.id}
                </td>

                <td>
                    <div class="worker-table-name">

                        <div class="worker-avatar">
                            ${getInitial(workerName)}
                        </div>

                        <div>
                            <strong>
                                ${escapeHtml(workerName)}
                            </strong>

                            <span>
                                Worker payment
                            </span>
                        </div>

                    </div>
                </td>

                <td>
                    ${escapeHtml(payment.paymentDate)}
                </td>

                <td>
                    <strong>
                        ₹${formatAmount(payment.amount)}
                    </strong>
                </td>

                <td>
                    <span class="payment-status">
                        Paid
                    </span>
                </td>

                <td>

                    <button
                        type="button"
                        class="table-action edit-action"
                        onclick="editPayment(${payment.id})">
                        Edit
                    </button>

                    <button
                        type="button"
                        class="table-action delete-action"
                        onclick="deletePayment(${payment.id})">
                        Delete
                    </button>

                </td>
            `;

            paymentsTableBody.appendChild(row);
        });
    }


    // =========================
    // Update Statistics
    // =========================

    function updateStats(list) {

        totalPayments.textContent =
            list.length;


        let amountTotal = 0;


        list.forEach(function (payment) {

            amountTotal +=
                Number(payment.amount || 0);

        });


        totalPaid.textContent =
            "₹" +
            formatAmount(amountTotal);
    }


    // =========================
    // Open Payment Modal
    // =========================

    addPaymentBtn.addEventListener(
        "click",
        async function () {

            paymentForm.reset();

            paymentMessage.textContent = "";

            paymentModal.style.display =
                "flex";

            try {

                await loadWorkers();

            }
            catch (error) {

                console.error(error);

                showMessage(
                    "Unable to load workers."
                );
            }
        }
    );


    // =========================
    // Close Modal
    // =========================

    function closeModal() {

        paymentModal.style.display =
            "none";

        paymentForm.reset();

        paymentMessage.textContent = "";
    }


    closePaymentModal.addEventListener(
        "click",
        closeModal
    );


    cancelPaymentBtn.addEventListener(
        "click",
        closeModal
    );


    // =========================
    // Add Payment
    // =========================

    paymentForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const workerId =
                Number(paymentWorker.value);

            const date =
                paymentDate.value;

            const amount =
                Number(paymentAmount.value);


            if (!workerId) {

                showMessage(
                    "Please select a worker."
                );

                return;
            }


            if (!date) {

                showMessage(
                    "Please select payment date."
                );

                return;
            }


            if (!amount || amount <= 0) {

                showMessage(
                    "Payment amount must be greater than 0."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        `/api/payments?workerId=${workerId}`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                paymentDate: date,
                                amount: amount
                            })
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to save payment"
                    );
                }


                closeModal();

                await loadPayments();


                alert(
                    "Payment recorded successfully."
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
    // Edit Payment
    // =========================

    window.editPayment =
        async function (id) {

            const payment =
                payments.find(function (item) {
                    return item.id === id;
                });


            if (!payment) {
                return;
            }


            const newDate =
                prompt(
                    "Enter payment date:",
                    payment.paymentDate
                );


            if (newDate === null) {
                return;
            }


            const newAmount =
                prompt(
                    "Enter payment amount:",
                    payment.amount
                );


            if (newAmount === null) {
                return;
            }


            const amount =
                Number(newAmount);


            if (!newDate) {

                alert(
                    "Payment date is required."
                );

                return;
            }


            if (!amount || amount <= 0) {

                alert(
                    "Payment amount must be greater than 0."
                );

                return;
            }


            const workerId =
                payment.worker.id;


            try {

                const response =
                    await fetch(
                        `/api/payments/${id}?workerId=${workerId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                paymentDate: newDate,
                                amount: amount
                            })
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to update payment"
                    );
                }


                await loadPayments();


                alert(
                    "Payment updated successfully."
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
    // Delete Payment
    // =========================

    window.deletePayment =
        async function (id) {

            const payment =
                payments.find(function (item) {
                    return item.id === id;
                });


            if (!payment) {
                return;
            }


            const confirmed =
                confirm(
                    "Delete payment record #" +
                    id +
                    "?"
                );


            if (!confirmed) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `/api/payments/${id}`,
                        {
                            method: "DELETE"
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to delete payment"
                    );
                }


                await loadPayments();


                alert(
                    "Payment deleted successfully."
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

    refreshPaymentsBtn.addEventListener(
        "click",
        async function () {

            await loadPayments();

        }
    );


    // =========================
    // Show Message
    // =========================

    function showMessage(message) {

        paymentMessage.textContent =
            message;
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
            await loadPayments();

        }
        catch (error) {

            console.error(error);

            paymentsEmpty.style.display =
                "block";

            paymentsEmpty.innerHTML = `
                <h3>Unable to load payment page</h3>
                <p>Please check the Spring Boot server.</p>
            `;
        }
    }


    initializePage();

});