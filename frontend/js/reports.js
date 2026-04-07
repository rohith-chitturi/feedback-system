const API_BASE = 'https://d2jukolqvoix3.cloudfront.net';

// Pie chart for ratings (1–5)
function drawPieChart(feedbacks) {
  const counts = [0, 0, 0, 0, 0];
  feedbacks.forEach(fb => {
    if (fb.rating >= 1 && fb.rating <= 5) counts[fb.rating - 1]++;
  });
  const ctx = document.getElementById('ratingsPieChart').getContext('2d');
  if (window.ratingsChart) window.ratingsChart.destroy();
  window.ratingsChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
      datasets: [{
        data: counts,
        backgroundColor: [
          '#783cbe', '#a272ff', '#cf8cff', '#ff66d8', '#e7ddff'
        ],
        borderColor: '#291a34',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  });
}

// Feedback table and chart
async function loadFeedback() {
  const res = await fetch(`${API_BASE}/api/feedback`);
  let feedbacks = [];
  try { feedbacks = await res.json(); } catch (err) {}
  const tbody = document.querySelector('#feedbackTable tbody');
  tbody.innerHTML = '';
  feedbacks.forEach(fb => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${fb.student}</td>
                    <td>${fb.section}</td>
                    <td>${fb.faculty}</td>
                    <td>${fb.subject}</td>
                    <td>${fb.rating}</td>
                    <td>${fb.comments}</td>
                    <td>${new Date(fb.createdAt).toLocaleDateString()}</td>`;
    tbody.appendChild(tr);
  });
  // Draw chart after data loaded
  drawPieChart(feedbacks);
}

loadFeedback();

document.getElementById('exportExcel')?.addEventListener('click', () => {
  window.open(`${API_BASE}/api/reports/excel`, '_blank');
});
document.getElementById('exportPDF')?.addEventListener('click', () => {
  window.open(`${API_BASE}/api/reports/pdf`, '_blank');
});

// Logout Logic
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.clear();
  window.location = 'index.html';
});
