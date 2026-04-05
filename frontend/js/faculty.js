const API_BASE = 'http://cbit-it-feedback.ap-south-1.elasticbeanstalk.com/';
const section = localStorage.getItem('section');

// Demo avatar images
const allAvatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/men/55.jpg",
  "https://randomuser.me/api/portraits/women/65.jpg",
  "https://randomuser.me/api/portraits/women/49.jpg"
];
function getRandomAvatar() {
  return allAvatars[Math.floor(Math.random()*allAvatars.length)];
}

let allFaculties = [];

async function fetchFaculties() {
  // LIVE backend fetch!
  try {
    const res = await fetch(`${API_BASE}/api/faculty/${section}`);
    allFaculties = await res.json();
  } catch (err) {
    alert('Error connecting to backend!');
  }
}

function showFacCards(subType) {
  document.getElementById('chooseType').style.display = 'none';
  document.getElementById('facultySection').style.display = '';
  const grid = document.getElementById('facultyGrid');
  grid.innerHTML = '';
  allFaculties.forEach(fac => {
    fac.subjects.forEach(sub => {
      if (sub.type === subType) {
        const card = document.createElement('div');
        card.className = "faculty-card";
        card.innerHTML = `
          <img src="${getRandomAvatar()}" class="faculty-img" alt="${fac.name}" />
          <div class="faculty-name">${fac.name}</div>
          <div class="faculty-subject">${sub.name}</div>
        `;
        card.onclick = () => {
          card.classList.add('cardfadeout');
          setTimeout(()=> {
            localStorage.setItem('selectedFaculty', fac.name);
            localStorage.setItem('selectedSubject', sub.name);
            localStorage.setItem('selectedType', sub.type);
            window.location = 'feedback.html';
          }, 550);
        };
        grid.appendChild(card);
      }
    });
  });
}

(async function() {
  await fetchFaculties();
  document.getElementById('showTheory').onclick = () => showFacCards("theory");
  document.getElementById('showLabs').onclick = () => showFacCards("lab");

  // Logout Logic
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.clear();
    window.location = 'index.html';
  });
})();
