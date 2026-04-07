// ===============================
// API BASE URL (PRODUCTION)
// ===============================
const API_BASE = "https://dzfmv8tmc552t.cloudfront.net";


// ===============================
// REGISTRATION
// ===============================
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const rollNumber = document.getElementById("rollNumber").value;
  const password = document.getElementById("password").value;
  const section = document.getElementById("section").value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rollNumber, password, section }),
    });

    let data = {};
    try {
      data = await res.json();
    } catch (err) {}

    document.getElementById("status").innerText =
      res.ok ? "Registered successfully!" : data.message || "User already exists!";
  } catch (error) {
    document.getElementById("status").innerText =
      "Server not reachable!";
    console.error(error);
  }
});


// ===============================
// LOGIN
// ===============================
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const rollNumber = document.getElementById("rollNumber").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rollNumber, password }),
    });

    let data = {};
    try {
      data = await res.json();
    } catch (err) {}

    if (res.ok && data.token) {

      // Save login data
      localStorage.setItem("token", data.token);
      localStorage.setItem("rollNumber", rollNumber);
      localStorage.setItem("section", data.section);

      // ===============================
      // SPLASH SCREEN
      // ===============================
      document.body.innerHTML = `
        <div style="
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          height:100vh;
          background: linear-gradient(120deg,#170639 0%, #723aff 100%);
        ">
          <h1 style="
            color:#b074ff;
            font-size:3rem;
            letter-spacing:3px;
          ">
            Welcome <span style="color:#12f6ea">${data.section}</span>!
          </h1>

          <div style="
            margin-top:24px;
            font-size:1.3rem;
            color:#ece8ff;
          ">
            Loading your feedback portal...
          </div>
        </div>
      `;

      setTimeout(() => {
        window.location = "feedback.html";
      }, 2000);

    } else {
      document.getElementById("status").innerText =
        data.message || "Login failed!";
    }

  } catch (error) {
    document.getElementById("status").innerText =
      "Server not reachable!";
    console.error(error);
  }
});