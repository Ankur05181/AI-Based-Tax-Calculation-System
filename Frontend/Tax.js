// =========================
// JWT HELPER
// =========================
function getUsernameFromToken(token) {

    if (!token) return null;

    try {

        const payload =
            JSON.parse(atob(token.split(".")[1]));

        return payload.sub;

    } catch (error) {

        console.error("Invalid token", error);

        return null;
    }
}


// =========================
// CALCULATE TAX
// =========================
async function calculateTax() {

    const income =
        Number(document.getElementById("income").value || 0);

    const deduction80C =
        Number(document.getElementById("deduction80C").value || 0);

    const deduction80D =
        Number(document.getElementById("deduction80D").value || 0);

    const hraExemption =
        Number(document.getElementById("hraExemption").value || 0);

    if (income <= 0) {

        alert("Please enter a valid income.");

        return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }

    try {

        const response =
            await fetch(
                "http://localhost:8080/tax/calculate",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        income,
                        deduction80C,
                        deduction80D,
                        hraExemption
                    })
                }
            );

        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(error);
        }

        const data =
            await response.json();

        // =========================
        // TAX RESULTS
        // =========================

        document.getElementById("oldTax").innerHTML =
    "₹ " +
    Number(data.oldTax || 0)
        .toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

document.getElementById("newTax").innerHTML =
    "₹ " +
    Number(data.newTax || 0)
        .toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

         // =========================
        // ADVANCED TAX EFFICIENCY SCORE
       // =========================

    const effectiveTaxRate =
    (Math.min(data.oldTax, data.newTax) / income) * 100;

    let score = 100;

    // Tax burden penalty
    score -= effectiveTaxRate;

   // Deduction bonus
   if (deduction80C > 0) score += 5;
   if (deduction80D > 0) score += 5;
   if (hraExemption > 0) score += 5;

   // Tax-saving bonus
   const taxSaved =
   Math.abs(data.oldTax - data.newTax);

   if (taxSaved > 50000) {
   score += 10;
   } else if (taxSaved > 25000) {
   score += 5;
   }

   // Limit between 0 and 100
   score = Math.min(100, Math.max(0, Math.round(score)));

   document.getElementById("taxScore").innerText =
   score + " / 100";
        // =========================
        // INCOME CATEGORY
        // =========================

        let incomeCategory = "";

        if (income <= 1200000) {

            incomeCategory =
                "🟢 Low Income Category (Rebate Zone Possible)";

        } else if (income <= 2400000) {

            incomeCategory =
                "🟡 Middle Income Category";

        } else {

            incomeCategory =
                "🔴 High Income Category";
        }

        // =========================
        // EFFECTIVE TAX RATE
        // =========================

        const effectiveTaxRate =
            (
                (
                    Math.min(
                        data.oldTax,
                        data.newTax
                    ) / income
                ) * 100
            ).toFixed(2);

        // =========================
        // AI INSIGHTS
        // =========================

        let insights = "";

        insights +=
            "<b>AI Recommendation:</b><br><br>";

        insights +=
            data.recommendation;

        insights +=
            "<br><br>";

        insights +=
            "📊 Income Analysed: ₹" +
            income.toLocaleString("en-IN");

        insights +=
            "<br><br>";

        insights +=
            incomeCategory;

        insights +=
            "<br><br>";

        insights +=
            "📈 Effective Tax Rate: " +
            effectiveTaxRate +
            "%";
            insights +=
            "<br><br>✅ All tax figures include 4% Health & Education Cess";

        document.getElementById("suggestion").innerHTML =
            insights;

        // =========================
        // REFRESH HISTORY
        // =========================

        await loadHistory();

    } catch (error) {

        console.error(error);

        alert(
            "Error calculating tax: " +
            error.message
        );
    }
}


// =========================
// LOAD HISTORY
// =========================
async function loadHistory() {

    const token =
        sessionStorage.getItem("token");

    if (!token) return;

    const username =
        getUsernameFromToken(token);

    if (!username) return;

    try {

        const response =
            await fetch(
                "http://localhost:8080/tax/history?username=" +
                username,
                {
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        if (!response.ok) {
            return;
        }

        const history =
            await response.json();
            console.log(history);

        const historyList =
            document.getElementById("historyList");

        historyList.innerHTML = "";

        if (
            !history ||
            history.length === 0
        ) {

            historyList.innerHTML =
                `
                <div class="history-item empty">
                    No calculations yet
                </div>
                `;

            return;
        }

        history.reverse().forEach(item => {

            const div =
                document.createElement("div");

            div.className =
                "history-item";

            div.innerHTML =
`
<strong>
    ₹ ${item.income.toLocaleString("en-IN")}
</strong>

<br>

Old:
₹ ${item.oldTax.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}

<br>

New:
₹ ${item.newTax.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}

<br>

<small>
${new Date(item.createdAt).toLocaleString()}
</small>
`;

            historyList.appendChild(div);
        });

    } catch (error) {

        console.error(
            "History load failed",
            error
        );
    }
}
// =========================
// CLEAR HISTORY
// =========================
async function clearHistory() {

    const token =
        sessionStorage.getItem("token");

    if (!token) {

        alert("Please login first.");

        return;
    }

    const username =
        getUsernameFromToken(token);

    if (!username) {

        alert(
            "Invalid session. Please login again."
        );

        return;
    }

    console.log("TOKEN:", token);
    console.log("USERNAME:", username);

    try {

        const response =
            await fetch(
                "http://localhost:8080/tax/history/clear?username=" +
                username,
                {
                    method: "POST",
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        console.log(
            "STATUS:",
            response.status
        );

        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(error);
        }

        document.getElementById(
            "historyList"
        ).innerHTML =
        `
        <div class="history-item empty">
            No calculations yet
        </div>
        `;

        alert("History cleared successfully");

    } catch (error) {

        console.error(error);

        alert(
            "Unable to clear history: " +
            error.message
        );
    }
}
// =========================
// AUTO LOAD HISTORY
// =========================
window.onload = function () {

    loadHistory();
};