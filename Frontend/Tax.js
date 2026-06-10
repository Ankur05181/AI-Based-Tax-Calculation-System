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
// REGIME WINNER
// =========================

if (data.oldTax < data.newTax) {

    document.getElementById("oldRegimeTitle")
        .innerHTML = "🏆 Old Regime";

    document.getElementById("newRegimeTitle")
        .innerHTML = "New Regime";

} else if (data.newTax < data.oldTax) {

    document.getElementById("newRegimeTitle")
        .innerHTML = "🏆 New Regime";

    document.getElementById("oldRegimeTitle")
        .innerHTML = "Old Regime";

} else {

    document.getElementById("oldRegimeTitle")
        .innerHTML = "Old Regime";

    document.getElementById("newRegimeTitle")
        .innerHTML = "New Regime";
}

         // =========================
// ADVANCED TAX EFFICIENCY SCORE
// =========================

const displayTaxRate =
    (Math.min(data.oldTax, data.newTax) / income) * 100;

const taxSaved =
    Math.abs(data.oldTax - data.newTax);

let score = 70;

// 80C Utilization
score += (deduction80C / 150000) * 10;

// 80D Utilization
score += Math.min(
    (deduction80D / 25000) * 5,
    5
);

// HRA Utilization
if (hraExemption > 0)
    score += 5;

// Tax Savings Bonus
if (taxSaved > 100000)
    score += 10;
else if (taxSaved > 50000)
    score += 7;
else if (taxSaved > 25000)
    score += 4;

// Effective Tax Rate Adjustment
if (displayTaxRate < 5)
    score += 5;
else if (displayTaxRate > 15)
    score -= 5;

// Limit Score
score = Math.round(
    Math.min(100, Math.max(0, score))
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
            // =========================
// TAX SAVING SUGGESTIONS
// =========================

let investmentTips = "";

if (deduction80C < 150000) {

    investmentTips +=
        "<br><br>💡 <b>80C Suggestions:</b><br>" +
        "• PPF<br>" +
        "• ELSS Mutual Funds<br>" +
        "• LIC Premium<br>" +
        "• Tax Saving FD";
}

if (Number(deduction80D) < 25000){

    investmentTips +=
    "<br><br>💡 <b>80D Suggestions:</b><br>" +
    "You can still invest in eligible health insurance plans to maximize benefits under Section 80D.";
}
let taxSavingPotential = "";

const remaining80C =
    150000 - Number(deduction80C);

if (remaining80C > 0) {

    taxSavingPotential +=
        "<br><br>💰 <b>Tax Saving Potential (80C):</b><br>" +
        "You can still invest ₹" +
        remaining80C.toLocaleString("en-IN") +
        " under Section 80C to maximize tax benefits.";
}
const remaining80D =
25000 - Number(deduction80D);

if (remaining80D > 0) {

taxSavingPotential +=
    "<br><br>🏥 <b>Tax Saving Potential (80D):</b><br>" +
    "You can still invest ₹" +
    remaining80D.toLocaleString("en-IN") +
    " in eligible health insurance plans under Section 80D to maximize tax benefits.";
}
insights += taxSavingPotential;
insights += investmentTips;

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
// CLEAR CALCULATOR
// =========================
function clearForm() {

    document.getElementById("income").value = "";

    document.getElementById("deduction80C").value = "";

    document.getElementById("deduction80D").value = "";

    document.getElementById("hraExemption").value = "";

    document.getElementById("oldTax").innerHTML =
        "₹ 0.00";

    document.getElementById("newTax").innerHTML =
        "₹ 0.00";
    document.getElementById("oldRegimeTitle")
    .innerHTML = "Old Regime";

    document.getElementById("newRegimeTitle")
    .innerHTML = "New Regime";    

    document.getElementById("taxScore").innerHTML =
        "0 / 100";

    document.getElementById("suggestion").innerHTML =
        `
        Enter income details and click
        <b>Calculate Tax</b>
        to get personalized AI recommendations.
        `;
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
// =========================
// LIGHT GREY BACKGROUND
// =========================
doc.setFillColor(245, 247, 250);
doc.rect(0, 0, 210, 297, "F");
// =========================
// BLUE HEADER
// =========================
doc.setFillColor(37, 99, 235);
doc.rect(0, 0, 210, 30, "F");
doc.setTextColor(
    255,
    255,
    255
);

// =========================
// USER DETAILS
// =========================

const token =
    sessionStorage.getItem("token");

const username =
    sessionStorage.getItem("username") || "User";

const today =
    new Date().toLocaleString("en-IN");

// =========================
// FORM DATA
// =========================

const income =
    document.getElementById("income").value || "0";

const deduction80C =
    document.getElementById("deduction80C").value || "0";

const deduction80D =
    document.getElementById("deduction80D").value || "0";

const hraExemption =
    document.getElementById("hraExemption").value || "0";

// =========================
// RESULT DATA
// =========================

const score =
    document.getElementById("taxScore").innerText;

let recommendation =
    document.getElementById("suggestion")
    .innerText
    .replace("AI Recommendation:", "")
    .replace(/[^\x00-\x7F]/g, "")
    .trim();

const oldTaxValue =
    parseFloat(
        oldTax
            .replace("₹", "")
            .replace(/,/g, "")
            .trim()
    );

const newTaxValue =
    parseFloat(
        newTax
            .replace("₹", "")
            .replace(/,/g, "")
            .trim()
    );

const recommendedRegime =
    oldTaxValue < newTaxValue
        ? "Old Regime"
        : "New Regime";

const savings =
    Math.abs(
        oldTaxValue -
        newTaxValue
    );

// =========================
// HEADER TEXT
// =========================

doc.setFontSize(18);

doc.text(
    "AI-Based Tax Calculation Report",
    20,
    18
);

doc.setFontSize(11);

doc.text(
    "Generated For: " + username,
    20,
    26
);

// =========================
// NORMAL TEXT COLOR
// =========================

doc.setTextColor(
    0,
    0,
    0
);

doc.setFontSize(12);

doc.text(
    "Generated On: " + today,
    20,
    45
);

// =========================
// INPUT DETAILS
// =========================

doc.text(
    "Annual Income: Rs. " + income,
    20,
    60
);

doc.text(
    "80C Deduction: Rs. " + deduction80C,
    20,
    70
);

doc.text(
    "80D Deduction: Rs. " + deduction80D,
    20,
    80
);

doc.text(
    "HRA Exemption: Rs. " + hraExemption,
    20,
    90
);

// =========================
// TAX RESULTS
// =========================

doc.text(
    "Old Regime Tax: " +
    oldTax.replace("₹", "Rs."),
    20,
    110
);

doc.text(
    "New Regime Tax: " +
    newTax.replace("₹", "Rs."),
    20,
    120
);

doc.text(
    "Tax Efficiency Score: " +
    score,
    20,
    130
);

doc.text(
    "Recommended Regime: " +
    recommendedRegime,
    20,
    140
);

doc.text(
    "Estimated Savings: Rs. " +
    savings.toLocaleString("en-IN"),
    20,
    150
);

// =========================
// AI RECOMMENDATION
// =========================

doc.setFontSize(13);

doc.text(
    "AI Recommendation:",
    20,
    160
);

doc.setFontSize(11);

const lines =
    doc.splitTextToSize(
        recommendation,
        160
    );

doc.text(
    lines,
    20,
    170
);

const footerY =
    180 + (lines.length * 7) + 20;
// =========================
// FOOTER
// =========================

doc.setFontSize(10);

doc.text(
    "Generated by AI-Based Tax Calculation System",
    20,
    footerY
);
// =========================
// SAVE PDF
// =========================

doc.save(
    username + "_Tax_Report.pdf"
);
}