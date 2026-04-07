const API_BASE = 'https://d2jukolqvoix3.cloudfront.net';
const rollNumber = localStorage.getItem('rollNumber');
const section = localStorage.getItem('section');
document.getElementById('rollNumber').value = rollNumber || '';
document.getElementById('section').value = section || '';

// Populate faculty dropdown by section
fetch(`${API_BASE}/api/faculty/${section}`)
  .then(res => res.json())
  .then(facultyList => {
    const facultyDropdown = document.getElementById('faculty');
    facultyDropdown.innerHTML = '<option value="">Select Faculty</option>';
    facultyList.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.name;
      opt.textContent = f.name;
      facultyDropdown.appendChild(opt);
    });
  });

// Populate subject dropdown based on faculty
document.getElementById('faculty').addEventListener('change', async e => {
  const facultyName = e.target.value;
  const facultyRes = await fetch(`${API_BASE}/api/faculty/${section}`);
  const facultyList = await facultyRes.json();
  const selectedFaculty = facultyList.find(f => f.name === facultyName);

  const subjDropdown = document.getElementById('subject');
  subjDropdown.innerHTML = '<option value="">Select Subject/Class Type</option>';
  if(selectedFaculty) {
    selectedFaculty.subjects.forEach(subj => {
      const opt = document.createElement('option');
      opt.value = subj.name;
      opt.textContent = `${subj.name} (${subj.type})`;
      subjDropdown.appendChild(opt);
    });
  }
});

// Feedback submit
document.getElementById('feedbackForm').addEventListener('submit', async e => {
  e.preventDefault();
  const feedback = {
    student: rollNumber,
    section,
    faculty: document.getElementById('faculty').value,
    subject: document.getElementById('subject').value,
    rating: Number(document.getElementById('rating').value),
    comments: document.getElementById('comments').value
  };
  const res = await fetch(`${API_BASE}/api/feedback`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback)
  });

  let data = '';
  try { data = await res.json(); } catch (err) {}

  if (res.status === 409) {
    document.getElementById('status').innerText =
      'You have already submitted feedback for this faculty/class type.';
  } else {
    document.getElementById('status').innerText =
      res.ok ? 'Feedback submitted!' : data || 'Error submitting feedback.';
  }
});

// Logout Logic
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.clear();
  window.location = 'index.html';
});
