// =============================
// BASIC ADMIN PORTAL FUNCTIONALITY (Navigation, Logout, UI Enhancements)
// =============================
// =============================

// Navigation between pages
const pages = {
  dashboard: document.getElementById("dashboardSection"),
  students: document.getElementById("studentsSection"),
  teachers: document.getElementById("teachersSection"),
  classes: document.getElementById("classesSection"),
  users: document.getElementById("usersSection")
};

function showPage(pageName) {
  Object.values(pages).forEach(p => p.classList.add("hidden"));
  pages[pageName].classList.remove("hidden");
}

// Logout button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    alert("You have logged out.");
    window.location.href = "login.html";
  });
}

// =============================
// STUDENTS PAGE — Add Student
// =============================
const addStudentForm = document.getElementById("addStudentForm");
const studentTableBody = document.getElementById("studentTableBody");

if (addStudentForm) {
  addStudentForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = this.querySelector("#studentName").value;
    const className = this.querySelector("#studentClass").value;
    const age = this.querySelector("#studentAge").value;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${className}</td>
      <td>${age}</td>
    `;

    studentTableBody.appendChild(row);
    this.reset();
  });
}

// =============================
// TEACHERS PAGE — Add Teacher
// =============================
const addTeacherForm = document.getElementById("addTeacherForm");
const teacherTableBody = document.getElementById("teacherTableBody");

if (addTeacherForm) {
  addTeacherForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = this.querySelector("#teacherName").value;
    const subject = this.querySelector("#teacherSubject").value;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${subject}</td>
    `;

    teacherTableBody.appendChild(row);
    this.reset();
  });
}

// =============================
// CLASSES PAGE — Add Class
// =============================
const addClassForm = document.getElementById("addClassForm");
const classTableBody = document.getElementById("classTableBody");

if (addClassForm) {
  addClassForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = this.querySelector("#className").value;
    const teacher = this.querySelector("#classTeacher").value;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${teacher}</td>
    `;

    classTableBody.appendChild(row);
    this.reset();
  });
}

// =============================
// USERS PAGE — Add User
// =============================
const addUserForm = document.getElementById("addUserForm");
const userTableBody = document.getElementById("userTableBody");

if (addUserForm) {
  addUserForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const username = this.querySelector("#username").value;
    const role = this.querySelector("#userRole").value;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${username}</td>
      <td>${role}</td>
    `;

    userTableBody.appendChild(row);
    this.reset();
  });
}

// =============================
// DASHBOARD COUNTERS (AUTO-CALCULATE)
// =============================
function updateDashboardCounts() {
  const studentCount = studentTableBody ? studentTableBody.children.length : 0;
  const teacherCount = teacherTableBody ? teacherTableBody.children.length : 0;
  const classCount = classTableBody ? classTableBody.children.length : 0;
  const userCount = userTableBody ? userTableBody.children.length : 0;

  const counters = {
    studentCount: document.getElementById("dashboardStudents"),
    teacherCount: document.getElementById("dashboardTeachers"),
    classCount: document.getElementById("dashboardClasses"),
    userCount: document.getElementById("dashboardUsers")
  };

  if (counters.studentCount) counters.studentCount.textContent = studentCount;
  if (counters.teacherCount) counters.teacherCount.textContent = teacherCount;
  if (counters.classCount) counters.classCount.textContent = classCount;
  if (counters.userCount) counters.userCount.textContent = userCount;
}

setInterval(updateDashboardCounts, 700);

// =============================
// UNIVERSAL SEARCH SYSTEM (For All Tables)
// =============================
function tableSearch(inputId, tableId) {
  const search = document.getElementById(inputId).value.toLowerCase();
  const rows = document.querySelectorAll(`#${tableId} tr`);

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(search) ? '' : 'none';
  });
}

// =============================
// DELETE ROW BUTTONS
// =============================
function enableDeleteButtons() {
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      this.closest('tr').remove();
      updateDashboardCounts();
    });
  });
}

// Add delete button dynamically to rows
function addDeleteButton(row) {
  const deleteCell = document.createElement('td');
  deleteCell.innerHTML = `<button class="delete-btn" style="background:#e63946;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;">Delete</button>`;
  row.appendChild(deleteCell);
  enableDeleteButtons();
}

