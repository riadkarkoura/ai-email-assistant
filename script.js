
let logs = JSON.parse(localStorage.getItem("automationLogs")) || [];

function analyzeEmail() {
    let email = document.getElementById("emailInput").value.toLowerCase();

    if (email.trim() === "") {
        alert("Please write an email first");
        return;
    }

    let summary = "";
    let importance = "";
    let reply = "";

    if (
    email.includes("urgent") ||
    email.includes("today") ||
    email.includes("asap")
) {
    summary = "Urgent action required";
    importance = "High";
    reply = "Thank you. I will handle this immediately.";
}
    else if (
        email.includes("invoice") ||
        email.includes("meeting") ||
        email.includes("project")
    ) {
        summary = "Business related email";
        importance = "Medium";
        reply = "Thank you. I will review this and get back to you soon.";
    } else {
        summary = "General email";
        importance = "Low";
        reply = "Thank you for your email.";
    }

    document.getElementById("summary").innerText = summary;
    document.getElementById("importance").innerText = importance;
    document.getElementById("reply").innerText = reply;
}

function displayLogs() {
    let logList = document.getElementById("logList");
    logList.innerHTML = "";

    logs.forEach(function(log) {
        let item = document.createElement("li");
        item.textContent = log.importance + " - " + log.summary;
        logList.appendChild(item);
    });
}

function saveAutomationLog() {
    let summary = document.getElementById("summary").innerText;
    let importance = document.getElementById("importance").innerText;
    let reply = document.getElementById("reply").innerText;

    if (!summary || summary.trim() === "") {
    alert("Analyze an email first");
    return;
}

    let newLog = {
        summary: summary,
        importance: importance,
        reply: reply
    };

    logs.push(newLog);

    localStorage.setItem("automationLogs", JSON.stringify(logs));
    alert("Log saved!");

    displayLogs();
}

displayLogs();
function clearLogs() {
    logs = [];
    localStorage.removeItem("automationLogs");
    displayLogs();
}
function exportLogs() {
    if (logs.length === 0) {
        alert("No logs to export");
        return;
    }

    let text = JSON.stringify(logs, null, 2);

    let file = new Blob([text], { type: "application/json" });

    let link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "automation-logs.json";

    link.click();
}
function sendToWebhook() {
    if (logs.length === 0) {
        alert("No logs to send");
        return;
    }

    fetch("http://localhost:5678/webhook-test/ea9f71ed-14fe-4ccb-b0ff-600200f1916f", {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(logs)
    });

    alert("Logs sent to webhook!");
}