let token = localStorage.getItem("token");
let role = localStorage.getItem("role");

function showSection(id){
  document.querySelectorAll("main section").forEach(s=>s.style.display="none");
  document.getElementById(id).style.display="block";
}

// Registratie
document.getElementById("registerForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const f=e.target;
  fetch("http://localhost:3000/register",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name:f.name.value,email:f.email.value,password:f.password.value,role:f.role.value})})
    .then(r=>r.json()).then(d=>{alert(d.message); if(d.message==="Registratie succesvol") showSection("login");});
});

// Login
document.getElementById("loginForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const f=e.target;
  fetch("http://localhost:3000/login",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email:f.email.value,password:f.password.value})})
    .then(r=>r.json()).then(d=>{
      alert(d.message);
      if(d.token){
        token=d.token; role=d.role;
        localStorage.setItem("token",token);
        localStorage.setItem("role",role);
        showSection("dashboard");
      }
    });
});

// Project plaatsen
document.getElementById("projectForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const f=e.target;
  fetch("http://localhost:3000/project",{method:"POST",headers:{"Content-Type":"application/json","Authorization":token},
    body:JSON.stringify({title:f.title.value,description:f.description.value,category:f.category.value,budget:f.budget.value})})
    .then(r=>r.json()).then(d=>{alert(d.message); loadProjects();});
});

// Projecten laden
function loadProjects(){
  fetch("http://localhost:3000/projects").then(r=>r.json()).then(projects=>{
    const container=document.getElementById("projectsContainer");
    container.innerHTML="";
    projects.forEach(p=>{
      const div=document.createElement("div");
      div.innerHTML=`<h3>${p.title} - ${p.category}</h3>
        <p>${p.description}</p>
        <p>Budget: €${p.budget}</p>
        <p>Status: ${p.status}</p>
        <p>Klant: ${p.klantName}</p>`;
      container.appendChild(div);
    });
  });
}

// Ondernemers laden
function loadProfiles(){
  fetch("http://localhost:3000/users/ondernemer").then(r=>r.json()).then(users=>{
    const container=document.getElementById("profilesContainer");
    container.innerHTML="";
    users.forEach(u=>{
      const div=document.createElement("div");
      div.innerHTML=`<h3>${u.name}</h3>
        ${u.photoUrl?`<img src="${u.photoUrl}" class="profile-img">`:""}
        <p>${u.service||""}</p>`;
      container.appendChild(div);
    });
  });
}

document.querySelector("button[onclick*='profiles']")?.addEventListener("click",loadProfiles);
document.querySelector("button[onclick*='projects']")?.addEventListener("click",loadProjects);
