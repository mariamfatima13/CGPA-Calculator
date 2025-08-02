// 🌞 Default Light Mode, Toggle to Dark
const htmlEl = document.documentElement;
const toggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const bodyEl = document.body;
const userPref = localStorage.getItem('theme');

if (userPref === 'dark') {
    htmlEl.setAttribute('data-bs-theme', 'dark');
    bodyEl.classList.replace('bg-light', 'bg-dark');
    bodyEl.classList.replace('text-dark', 'text-light');
    toggle.checked = true;
    themeIcon.textContent = '🌞';
} else {
    htmlEl.setAttribute('data-bs-theme', 'light');
    bodyEl.classList.replace('bg-dark', 'bg-light');
    bodyEl.classList.replace('text-light', 'text-dark');
    toggle.checked = false;
    themeIcon.textContent = '🌙';
}

toggle.addEventListener('change', () => {
    const isDark = toggle.checked;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    htmlEl.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
    bodyEl.classList.toggle('bg-dark', isDark);
    bodyEl.classList.toggle('text-light', isDark);
    bodyEl.classList.toggle('bg-light', !isDark);
    bodyEl.classList.toggle('text-dark', !isDark);
    themeIcon.textContent = isDark ? '🌞' : '🌙';
});

// 🧮 GPA Logic
function generateInputs() {
    const num = parseInt(document.getElementById("numSemesters").value);
    const form = document.getElementById("semestersForm");
    form.innerHTML = "";

    for (let i = 1; i <= num; i++) {
        const row = document.createElement("div");
        row.className = "row g-3 align-items-center mb-3";

        row.innerHTML = `
            <div class="col-md-6">
                <label data-bs-toggle="tooltip" title="Enter your GPA (0.0 to 4.0)">Semester ${i} GPA</label>
                <input type="number" step="0.01" class="form-control gpa" placeholder="e.g., 3.5" oninput="updateProgressBar()">
            </div>
            <div class="col-md-6">
                <label data-bs-toggle="tooltip" title="Enter total credit hours taken in semester ${i}">Credit Hours</label>
                <input type="number" class="form-control credit" placeholder="e.g., 18">
            </div>
        `;
        form.appendChild(row);
    }

    // Enable Bootstrap tooltips
    const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')];
    tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
}

function updateProgressBar() {
    const gpaInputs = document.querySelectorAll(".gpa");
    const filled = [...gpaInputs].filter(input => input.value !== "").length;
    const total = gpaInputs.length;
    const percentage = total > 0 ? (filled / total) * 100 : 0;
    document.getElementById("progress").style.width = `${percentage}%`;
}

async function calculateCGPA() {
    const gpaInputs = document.querySelectorAll(".gpa");
    const creditInputs = document.querySelectorAll(".credit");
    const semesters = [];

    for (let i = 0; i < gpaInputs.length; i++) {
        const gpa = parseFloat(gpaInputs[i].value);
        const credit = parseFloat(creditInputs[i].value);

        if (isNaN(gpa) || isNaN(credit)) {
            document.getElementById("result").innerHTML = `<div class="alert alert-danger animate__animated animate__shakeX">Please fill all GPA and Credit Hour fields</div>`;
            return;
        }

        semesters.push({ gpa, credit });
    }

    const response = await fetch("/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ semesters })
    });

    const data = await response.json();
    const result = document.getElementById("result");

    if (data.cgpa) {
        result.innerHTML = `<div class="alert alert-success animate__animated animate__fadeInUp">✅ Your CGPA is: <strong>${data.cgpa}</strong></div>`;
    } else {
        result.innerHTML = `<div class="alert alert-danger animate__animated animate__shakeX">❌ ${data.error}</div>`;
    }
}
