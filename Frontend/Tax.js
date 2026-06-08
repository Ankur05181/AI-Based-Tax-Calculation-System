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

const displayTaxRate =
    (Math.min(data.oldTax, data.newTax) / income) * 100;

let score = 70;

// Deduction bonus
if (deduction80C > 0) score += 10;
if (deduction80D > 0) score += 5;
if (hraExemption > 0) score += 5;

// Tax saving bonus
const taxSaved =
    Math.abs(data.oldTax - data.newTax);

if (taxSaved > 100000) {

    score += 10;

} else if (taxSaved > 50000) {

    score += 5;
}

// Tax burden penalty
score -= (displayTaxRate * 1.5);

// Final score
score = Math.round(
    Math.min(
        100,
        Math.max(0, score)
    )
);

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
            displayTaxRate.toFixed(2) +
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
// =========================
// DOWNLOAD PDF REPORT
// =========================
function downloadReport() {

    const oldTax =
        document.getElementById("oldTax").innerText.trim();

    const newTax =
        document.getElementById("newTax").innerText.trim();

    if (
        oldTax === "₹ 0.00" &&
        newTax === "₹ 0.00"
    ) {

        alert(
            "Please calculate tax first before downloading the report."
        );

        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    // USER DETAILS
    const token =
        sessionStorage.getItem("token");

    const username =
        getUsernameFromToken(token) || "User";

    // FORM DATA
    const income =
        document.getElementById("income").value || "0";

    const deduction80C =
        document.getElementById("deduction80C").value || "0";

    const deduction80D =
        document.getElementById("deduction80D").value || "0";

    const hraExemption =
        document.getElementById("hraExemption").value || "0";

    // RESULT DATA
    const score =
        document.getElementById("taxScore").innerText;

    let recommendation =
    document.getElementById("suggestion")
    .innerText
    .replace("AI Recommendation:", "")
    .replace(/[^\x00-\x7F]/g, "");

    // Remove emojis and unsupported characters
    recommendation =
        recommendation.replace(/[^\x00-\x7F]/g, "");

    // HEADER
    doc.setFontSize(18);

    doc.text(
        "AI-Based Tax Calculation Report",
        20,
        20
    );

    doc.setFontSize(12);

    doc.text(
        `Generated For: ${username}`,
        20,
        35
    );

    // INPUT DETAILS
    doc.text(
        `Annual Income: Rs. ${income}`,
        20,
        55
    );

    doc.text(
        `80C Deduction: Rs. ${deduction80C}`,
        20,
        65
    );

    doc.text(
        `80D Deduction: Rs. ${deduction80D}`,
        20,
        75
    );

    doc.text(
        `HRA Exemption: Rs. ${hraExemption}`,
        20,
        85
    );

    // TAX RESULTS
    doc.text(
        `Old Regime Tax: ${oldTax.replace("₹","Rs.")}`,
        20,
        105
    );

    doc.text(
        `New Regime Tax: ${newTax.replace("₹","Rs.")}`,
        20,
        115
    );

    doc.text(
        `Tax Efficiency Score: ${score}`,
        20,
        125
    );

    // AI RECOMMENDATION
    doc.text(
        "AI Recommendation:",
        20,
        145
    );

    const lines =
        doc.splitTextToSize(
            recommendation,
            160
        );

    doc.text(
        lines,
        20,
        155
    );

    // FOOTER
    doc.setFontSize(10);

    doc.text(
        "Generated by AI-Based Tax Calculation System",
        20,
        280
    );

    // SAVE
    doc.save(
        `${username}_Tax_Report.pdf`
    );
}