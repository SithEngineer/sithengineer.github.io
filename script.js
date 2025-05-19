(async function () {
  async function loadData() {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      renderPersonalInfo(data.personal);
      renderExperience(data.experience.filter(exp => exp.visible !== false));
      renderEducation(data.education.filter(exp => exp.visible !== false));
      renderActivities(data.activities.filter(exp => exp.visible !== false));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  function renderPersonalInfo(personal) {
    const personalInfoHtml = `
          <address class="profile-info">
              <h1>${personal.name}</h1>
              <p><a href="mailto:${personal.email}">${personal.email}</a></p>
              <p>${personal.phone}</p>
              <p>${personal.location}</p>
              <p>
                  <a href="${personal.github}" target="_blank">GitHub</a> |
                  <a href="${personal.linkedin}" target="_blank">LinkedIn</a>
              </p>
          </address>
      `;
    document.getElementById('personal-info').innerHTML = personalInfoHtml;
  }

  function renderExperience(experience) {
    const formatDate = (dateStr) => {
      if (!dateStr) return null;
      const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const parts = dateStr.split(' ');
      if (parts.length === 2) {
        const idx = months.indexOf(parts[0]);
        if (idx >= 0) return `${parts[1]}-${String(idx + 1).padStart(2,'0')}`;
      }
      if (/^\d{4}$/.test(dateStr)) return dateStr;
      return null;
    };
    const timeTag = (dateStr) => {
      const dt = formatDate(dateStr);
      return dt ? `<time datetime="${dt}">${dateStr}</time>` : dateStr;
    };
    const timelineHtml = experience.map(job => `
          <div class="timeline-item">
              <h3>${job.position}</h3>
              <h4>${job.company}</h4>
              <p class="meta">${timeTag(job.start_date)} - ${job.end_date ? timeTag(job.end_date) : 'Present'}, ${job.location}</p>
              <p class="screen-only description">${job.description}</p>
              <p class="print-only description">${job.extended_description || job.description}</p>
              ${job.technologies ? `
                  <div class="tech-stack">
                      ${job.technologies.map(tech => `
                          <span class="tech-tag">${tech}</span>
                      `).join('')}
                  </div>
              ` : ''}
          </div>
      `).join('');
    document.querySelector('.timeline').innerHTML = timelineHtml;
  }

  function renderEducation(education) {
    const timeTag = (dateStr) => {
      if (!dateStr || !/^\d{4}$/.test(dateStr)) return dateStr;
      return `<time datetime="${dateStr}">${dateStr}</time>`;
    };
    const cardsHtml = education.map(edu => `
          <div class="card">
              <h3>${edu.degree}</h3>
              <h4>${edu.institution}</h4>
              <p class="meta">${timeTag(edu.start_date)} - ${timeTag(edu.end_date)}</p>
              <p class="meta">${edu.location}</p>
              ${edu.concentration ? `<p><strong>${edu.concentration}</strong></p>` : ''}
              <div class="topics">
                  ${edu.topics.map(topic => `
                      <span class="tech-tag">${topic}</span>
                  `).join('')}
              </div>
          </div>
      `).join('');
    document.querySelector('.cards').innerHTML = cardsHtml;
  }

  function renderActivities(activities) {
    const activitiesHtml = activities.map(activity => `
          <div class="activity-item">
              <h3>${activity.title}</h3>
              <p class="meta"><strong>${activity.year}</strong></p>
              <p class="description">${activity.description}</p>
              ${activity.collaborators ? `
                  <p><small>With: ${activity.collaborators.join(', ')}</small></p>
              ` : ''}
              <span class="tech-tag">${activity.type}</span>
          </div>
      `).join('');
    document.querySelector('.activity-grid').innerHTML = activitiesHtml;
  }

  function setupEventListeners() {
    // Theme toggle
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);

    // Navigation
    const handleButtonClick = (button) => {
      return () => {
        const sectionId = button.dataset.section;
        document.querySelectorAll('section').forEach(section => {
          section.classList.remove('active');
        });
        document.querySelectorAll('.nav-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
        button.classList.add('active');
      }
    }
    document.querySelectorAll('.nav-btn').forEach(button => {
      button.addEventListener('click', handleButtonClick(button));
    });

    // Print functionality
    document.querySelector('.print-btn').addEventListener('click', () => {
      window.print();
    });
  }

  // Add retro terminal effect
  function addRetroEffect() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';

    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  }

  // Theme Management
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? 'light' : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.querySelector('.theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  // Analytics notice management
  function setupAnalyticsNotice() {
    const notice = document.getElementById('analytics-notice');
    const closeBtn = document.querySelector('.analytics-close');
    
    if (localStorage.getItem('analytics-notice-closed')) {
      notice.style.display = 'none';
    }
    
    closeBtn.addEventListener('click', () => {
      notice.style.display = 'none';
      localStorage.setItem('analytics-notice-closed', 'true');
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    setTheme(getPreferredTheme());
    addRetroEffect();
    loadData();
    setupEventListeners();
    setupAnalyticsNotice();
  });
}());
