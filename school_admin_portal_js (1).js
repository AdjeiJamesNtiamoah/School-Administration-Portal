// School Admin Portal - JavaScript (app.js)

// ----------- Dummy Users (You can replace with real backend later) -----------
const users = [
  { username: "admin", password: "admin123", role: "Admin" },
  { username: "teacher", password: "teach123", role: "Teacher" },
  { username: "student", password: "stud123", role: "Student" }
];

// ----------- LOGIN FUNCTION -----------
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    alert("Invalid username or password");
    return;
  }

  // Save session to localStorage
  localStorage.setItem("loggedUser", JSON.stringify(user));

  showDashboard();
}

// ----------- DISPLAY DASHBOARD -----------
function showDashboard() {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  if (!user) return;

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("dashboardPage").classList.remove("hidden");

  document.getElementById("roleLabel").textContent = `${user.role} Dashboard`;
}

// ----------- LOGOUT -----------
function logout() {
  localStorage.removeItem("loggedUser");
  location.reload();
}

// ----------- PAGE SECTIONS -----------
function showStudents() {
  document.getElementById("contentArea").innerHTML = `
    <h2>Students</h2>
    <p>List of registered students will appear here.</p>
    <button onclick="addStudent()">Add Student</button>
    <div id="studentList"></div>
  `;
  loadStudents();
}

function showTeachers() {
  document.getElementById("contentArea").innerHTML = `
    <h2>Teachers</h2>
    <p>Teacher records coming soon.</p>
  `;
}

function showClasses() {
  document.getElementById("contentArea").innerHTML = `
    <h2>Classes</h2>
    <p>Class information will be shown here.</p>
  `;
}

// ----------- STUDENT FUNCTIONS -----------
function loadStudents() {
  const data = JSON.parse(localStorage.getItem("students")) || [];
  const container = document.getElementById("studentList");

  if (data.length === 0) {
    container.innerHTML = "<p>No students added yet.</p>";
    return;
  }

  let html = "<ul>";

  data.forEach((s, i) => {
    html += `<li>${s} <button onclick="deleteStudent(${i})">Delete</button></li>`;
  });

  html += "</ul>";

  container.innerHTML = html;
}

function addStudent() {
  const name = prompt("Enter student name:");
  if (!name) return;

  let data = JSON.parse(localStorage.getItem("students")) || [];
  data.push(name);
  localStorage.setItem("students", JSON.stringify(data));

  showStudents();
}

function deleteStudent(index) {
  let data = JSON.parse(localStorage.getItem("students")) || [];
  data.splice(index, 1);
  localStorage.setItem("students", JSON.stringify(data));

  showStudents();
}

// ----------- AUTO-LOGIN IF SESSION EXISTS -----------
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("loggedUser");
  if (user) showDashboard();
});
