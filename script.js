document.getElementById("password").addEventListener("input", updateStrength);
document.getElementById("togglePassword").addEventListener("click", togglePasswordVisibility);
document.getElementById("checkBreach").addEventListener("click", checkPasswordBreach);

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

// Function to check if a password has been exposed in data breaches
async function checkPasswordBreach() {
    const password = document.getElementById("password").value;
    const breachResult = document.getElementById("breachResult");

    if (!password) {
        breachResult.textContent = "الرجاء إدخال كلمة المرور أولاً.";
        return;
    }

    const hashedPassword = await hashPassword(password);
    const prefix = hashedPassword.substring(0, 5);
    const suffix = hashedPassword.substring(5);

    try {
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const data = await response.text();

        if (data.includes(suffix.toUpperCase())) {
            breachResult.textContent = "⚠️ تم العثور على هذه الكلمة في تسريبات سابقة! يرجى تغييرها.";
            breachResult.style.color = "red";
        } else {
            breachResult.textContent = "✅ لم يتم العثور على كلمة المرور في أي تسريبات معروفة.";
            breachResult.style.color = "green";
        }
    } catch (error) {
        breachResult.textContent = "حدث خطأ أثناء الفحص. يرجى المحاولة لاحقًا.";
        breachResult.style.color = "orange";
    }
}

// Function to hash the password using SHA-1
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
