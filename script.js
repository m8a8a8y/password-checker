document.getElementById("password").addEventListener("input", updateStrength);
document.getElementById("togglePassword").addEventListener("click", togglePasswordVisibility);

function updateStrength() {
    const password = document.getElementById("password").value;
    const { score, feedback } = checkPasswordStrength(password);
    updateStrengthBar(score);
    updateFeedback(feedback);
}

function checkPasswordStrength(pwd) {
    let score = 0;
    let feedback = [];

    if (pwd.length >= 8) score += 1;
    else feedback.push("Password should be at least 8 characters.");

    if (/[A-Z]/.test(pwd)) score += 1;
    else feedback.push("Add uppercase letters.");

    if (/[a-z]/.test(pwd)) score += 1;
    else feedback.push("Add lowercase letters.");

    if (/[0-9]/.test(pwd)) score += 1;
    else feedback.push("Add numbers.");

    if (/[!@#$%^&*]/.test(pwd)) score += 1;
    else feedback.push("Add special characters (!@#$%^&*).");

    return { score, feedback };
}

function updateStrengthBar(score) {
    const bar = document.getElementById("strengthIndicator");
    const colors = ["#ff4444", "#ff8800", "#ffcc00", "#66cc33", "#00cc00"];
    bar.style.width = `${(score / 5) * 100}%`;
    bar.style.backgroundColor = colors[score];
}

function updateFeedback(feedback) {
    const feedbackList = document.getElementById("feedbackList");
    feedbackList.innerHTML = "";
    feedback.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        feedbackList.appendChild(li);
    });
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}
