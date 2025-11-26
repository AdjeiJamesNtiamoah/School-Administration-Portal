// Minimal frontend app with role auth + pages (client-only demo)
// Data stored in localStorage for demo purposes

// --- Demo users (replace with real backend in production) ---
const demoUsers = [
  { username: "admin", password: "admin123", name: "Admin User", role: "ADMIN" },
  { username: "teacher", password: "teach123", name: "Teacher One", role: "TEACHER" },
  { username: "student", password: "stud123", name: "Student One", role: "STUDENT" }
];

// initialize demo data (if not present)
function initDemo() {
  if (!localStorage.getItem("users")) localStorage.setItem("users", JSON.stringify(demoUsers));
  if (!localStorage.getItem("students")) {
    const s = [
      { id: genId(), firstName: "Emmanuel", lastName: "Boateng", className: "Primary 4" },
      { id: genId(), firstName: "Aisha", lastName: "Mensah", className: "Primary 3" }
    ];
    localStorage.setItem("students", JSON.stringify(s));
  }
  if (!localStorage.getItem("teachers")) {
    const t = [{ id: genId(), name: "Linda Opoku", subject: "Math" }];
    localStorage.setItem("teachers", JSON.stringify(t));
  }
  if (!localStorage.getItem("classes")) {
    const c = [{ id: genId(), name: "Primary 4", teacher: "Linda Opoku" }];
    localStorage.setItem("classes", JSON.stringify(c));
  }
}
initDemo();

// util
function genId(){ return Math.random().toString(36).slice(2,9) }
function byKey(k){ return JSON.parse(localStorage.getItem(k) || "[]") }
function saveKey(k, v){ localStorage.setItem(k, JSON.stringify(v)) }

// auth
function login(){
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;
  const users = byKey("users");
  const found = users.find(u => u.username === user && u.password === pass);
  if(!found){ alert("Invalid credentials. Use demo users listed below."); return; }
  localStorage.setItem("session", JSON.stringify(found));
  showApp();
}

// logout
function logout(){
  localStorage.removeItem("session");
  document.getElementById("appPage").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");
}

// show app
function showApp(){
  const s = JSON.parse(localStorage.getItem("session") || "null");
  if(!s) return;
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("appPage").classList.remove("hidden");
  document.getElementById("currentUserLabel").textContent = `${s.name} — ${s.role}`;
  // show/hide Users menu (admin only)
  document.getElementById("mUsers").classList.toggle("hidden", s.role !== "ADMIN");
  route("dashboard");
}

// routing & rendering
function route(page){
  const p = document.getElementById("content");
  const sess = JSON.parse(localStorage.getItem("session") || "null");
  if(!sess){ logout(); return; }

  setActiveMenu(page);
  if(page === "dashboard"){
    p.innerHTML = renderDashboard();
    attachDashboardActions();
  } else if(page === "students"){
    p.innerHTML = renderStudents();
    attachStudentsActions();
  } else if(page === "teachers"){
    p.innerHTML = renderTeachers();
    attachTeachersActions();
  } else if(page === "classes"){
    p.innerHTML = renderClasses();
    attachClassesActions();
  } else if(page === "users"){
    if(sess.role !== "ADMIN"){ p.innerHTML = "<div class='welcome-card'><h3>Forbidden</h3></div>"; return; }
    p.innerHTML = renderUsers();
    attachUsersActions();
  }
}

// menu UI helper
function setActiveMenu(id){
  ["mDashboard","mStudents","mTeachers","mClasses","mUsers"].forEach(i=>{
    const el = document.getElementById(i);
    if(el) el.classList.toggle("active", i.toLowerCase().includes(id));
  });
}

/* ------------------ RENDERS ------------------ */

function renderDashboard(){
  const students = byKey("students").length;
  const teachers = byKey("teachers").length;
  const classes = byKey("classes").length;
  return `
    <div class="welcome-card">
      <h2>Dashboard Overview</h2>
      <p class="muted">Quick stats for the school</p>
      <div class="card-grid">
        <div class="card"><h3>Total Students</h3><div class="value">${students}</div></div>
        <div class="card"><h3>Total Teachers</h3><div class="value">${teachers}</div></div>
        <div class="card"><h3>Total Classes</h3><div class="value">${classes}</div></div>
      </div>
    </div>

    <div class="table-container">
      <h3>Recent students</h3>
      ${renderStudentTable(5)}
    </div>
  `;
}

function renderStudents(){
  return `
    <div class="welcome-card">
      <h2>Students</h2>
      <p class="muted">Manage student records</p>
      <div style="margin-top:12px">
        <button class="btn-primary" onclick="studentAdd()">+ Add student</button>
      </div>
    </div>

    <div class="table-container" id="studentsTableBox">
      ${renderStudentTable()}
    </div>
  `;
}
function renderStudentTable(limit){
  const list = byKey("students");
  const items = (limit ? list.slice(0,limit) : list);
  if(items.length === 0) return "<div class='muted'>No students</div>";
  let rows = `<table><thead><tr><th>Name</th><th>Class</th><th>Actions</th></tr></thead><tbody>`;
  items.forEach(s=>{
    rows += `<tr><td>${s.firstName} ${s.lastName}</td><td>${s.className || '-'}</td>
      <td>
        <button class="btn-ghost" onclick="studentEdit('${s.id}')">Edit</button>
        <button class="btn-danger" onclick="studentDelete('${s.id}')">Delete</button>
      </td></tr>`;
  });
  rows += `</tbody></table>`;
  return rows;
}

function renderTeachers(){
  const list = byKey("teachers");
  return `
    <div class="welcome-card">
      <h2>Teachers</h2>
      <p class="muted">Manage teacher profiles</p>
      <div style="margin-top:12px"><button class="btn-primary" onclick="teacherAdd()">+ Add teacher</button></div>
    </div>
    <div class="table-container">
      <table><thead><tr><th>Name</th><th>Subject</th><th>Actions</th></tr></thead><tbody>
      ${list.map(t=>`<tr><td>${t.name}</td><td>${t.subject||''}</td>
        <td><button class="btn-ghost" onclick="teacherEdit('${t.id}')">Edit</button>
            <button class="btn-danger" onclick="teacherDelete('${t.id}')">Delete</button></td></tr>`).join("")}
      </tbody></table>
    </div>
  `;
}

function renderClasses(){
  const list = byKey("classes");
  return `
    <div class="welcome-card">
      <h2>Classes</h2>
      <p class="muted">Create and assign classes</p>
      <div style="margin-top:12px"><button class="btn-primary" onclick="classAdd()">+ Add class</button></div>
    </div>
    <div class="table-container">
      <table><thead><tr><th>Class</th><th>Teacher</th><th>Actions</th></tr></thead><tbody>
      ${list.map(c=>`<tr><td>${c.name}</td><td>${c.teacher||''}</td>
        <td><button class="btn-ghost" onclick="classEdit('${c.id}')">Edit</button>
            <button class="btn-danger" onclick="classDelete('${c.id}')">Delete</button></td></tr>`).join("")}
      </tbody></table>
    </div>
  `;
}

function renderUsers(){
  const list = byKey("users");
  return `
    <div class="welcome-card">
      <h2>Users</h2>
      <p class="muted">Admin: manage portal users and roles</p>
      <div style="margin-top:12px"><button class="btn-primary" onclick="userAdd()">+ Add user</button></div>
    </div>
    <div class="table-container">
      <table><thead><tr><th>Username</th><th>Name</th><th>Role</th><th>Actions</th></tr></thead><tbody>
      ${list.map(u=>`<tr><td>${u.username}</td><td>${u.name||''}</td><td>${u.role}</td>
        <td><button class="btn-ghost" onclick="userEdit('${u.username}')">Edit</button>
            <button class="btn-danger" onclick="userDelete('${u.username}')">Delete</button></td></tr>`).join("")}
      </tbody></table>
    </div>
  `;
}

/* ------------------ ACTIONS ------------------ */
// Students CRUD
function attachStudentsActions(){
  // nothing to attach for static table; table has inline onclick handlers
}
function studentAdd(){
  const first = prompt("Student first name:");
  if(!first) return;
  const last = prompt("Student last name:") || "";
  const clas = prompt("Class:") || "";
  const s = byKey("students");
  s.push({ id: genId(), firstName: first, lastName: last, className: clas });
  saveKey("students", s);
  route("students");
}
function studentEdit(id){
  const s = byKey("students");
  const idx = s.findIndex(x=>x.id===id);
  if(idx<0) return alert("Not found");
  const st = s[idx];
  const first = prompt("First name:", st.firstName); if(first===null) return;
  const last = prompt("Last name:", st.lastName); if(last===null) return;
  const clas = prompt("Class:", st.className || ""); if(clas===null) return;
  s[idx] = {...st, firstName:first, lastName:last, className:clas};
  saveKey("students", s);
  route("students");
}
function studentDelete(id){
  if(!confirm("Delete student?")) return;
  let s = byKey("students");
  s = s.filter(x=>x.id!==id);
  saveKey("students", s);
  route("students");
}

// Teachers
function attachTeachersActions(){}
function teacherAdd(){
  const name = prompt("Teacher name:"); if(!name) return;
  const subject = prompt("Subject:") || "";
  const t = byKey("teachers"); t.push({ id: genId(), name, subject}); saveKey("teachers", t); route("teachers");
}
function teacherEdit(id){
  const t = byKey("teachers"); const idx = t.findIndex(x=>x.id===id); if(idx<0) return;
  const it = t[idx]; const name = prompt("Name:", it.name); if(name===null) return;
  const subj = prompt("Subject:", it.subject||""); t[idx] = {...it, name, subject:subj}; saveKey("teachers", t); route("teachers");
}
function teacherDelete(id){ if(!confirm("Delete teacher?")) return; let t=byKey("teachers"); t=t.filter(x=>x.id!==id); saveKey("teachers",t); route("teachers"); }

// Classes
function attachClassesActions(){}
function classAdd(){ const name=prompt("Class name:"); if(!name) return; const teacher=prompt("Teacher:")||""; const c=byKey("classes"); c.push({id:genId(), name, teacher}); saveKey("classes",c); route("classes"); }
function classEdit(id){ const c=byKey("classes"); const idx=c.findIndex(x=>x.id===id); if(idx<0) return; const it=c[idx]; const name=prompt("Class name:", it.name); if(name===null) return; const teacher=prompt("Teacher:", it.teacher||""); c[idx]={...it,name,teacher}; saveKey("classes",c); route("classes"); }
function classDelete(id){ if(!confirm("Delete class?")) return; let c=byKey("classes"); c=c.filter(x=>x.id!==id); saveKey("classes",c); route("classes"); }

// Users (admin)
function attachUsersActions(){}
function userAdd(){
  const username = prompt("Username:"); if(!username) return; const pass = prompt("Password:")||"";
  const name = prompt("Full name:")||""; const role = prompt("Role (ADMIN/TEACHER/STUDENT):","STUDENT")||"STUDENT";
  const users = byKey("users"); if(users.find(u=>u.username===username)){ alert("User exists"); return; }
  users.push({username, password:pass, name, role}); saveKey("users", users); route("users");
}
function userEdit(username){
  const users = byKey("users"); const idx = users.findIndex(u=>u.username===username); if(idx<0) return;
  const u = users[idx]; const name = prompt("Full name:", u.name||""); if(name===null) return;
  const role = prompt("Role (ADMIN/TEACHER/STUDENT):", u.role)||u.role; users[idx] = {...u, name, role}; saveKey("users", users); route("users");
}
function userDelete(username){
  if(!confirm("Delete user?")) return; let users = byKey("users"); users = users.filter(u=>u.username!==username); saveKey("users", users); route("users");
}

/* ---------------- misc ---------------- */
function attachDashboardActions(){ /* no-op for now */ }
function openProfile(){ alert("Profile placeholder - integrate backend for real profile editing."); }

/* ---------------- init ---------------- */
document.addEventListener("DOMContentLoaded", ()=>{
  const sess = JSON.parse(localStorage.getItem("session") || "null");
  if(sess){ showApp(); } else { document.getElementById("loginPage").classList.remove("hidden"); }
});
