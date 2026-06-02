const username = 'ashwakshaik';
const userApiUrl = `https://api.github.com/users/${username}`;
const reposApiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`;

// Language Colors
const langColors = {
    JavaScript: '#f1e05a',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    Java: '#b07219',
    TypeScript: '#2b7489',
    'C++': '#f34b7d',
    C: '#555555',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Shell: '#89e051',
    Vue: '#41b883',
    React: '#61dafb'
};

// Typewriter Effect
const phrases = ["Computer Science Student", "Web Developer", "Cyber Security Enthusiast"];
let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;

    const currentPhrase = phrases[currentPhraseIndex];

    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typeSpeed = 50;
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typeSpeed = 120;
    }

    if (!isDeleting && currentCharIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000;
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(initTypewriter, typeSpeed);
}

async function fetchRepos() {
    try {
        const response = await fetch(reposApiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        renderRepos(data);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        document.getElementById('projects-loading').innerHTML = '<p>Error loading repositories.</p>';
    }
}

function renderRepos(repos) {
    const projectsGrid = document.getElementById('projects-grid');
    const loadingSpinner = document.getElementById('projects-loading');
    
    loadingSpinner.style.display = 'none';
    
    if (repos.length === 0) {
        projectsGrid.innerHTML = '<p>No repositories found.</p>';
        return;
    }
    
    repos.forEach(repo => {
        const langColor = langColors[repo.language] || '#8b949e';
        
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-header">
                <a href="${repo.html_url}" target="_blank" class="project-title">${repo.name}</a>
                <a href="${repo.html_url}" target="_blank" class="project-icon"><i class="fab fa-github"></i></a>
            </div>
            <p class="project-desc">${repo.description || 'No description provided.'}</p>
            <div class="project-footer">
                <div class="project-lang">
                    ${repo.language ? `<span class="lang-color" style="background-color: ${langColor}"></span> <span>${repo.language}</span>` : '<span>Unknown</span>'}
                </div>
                <div class="project-stats">
                    <span><i class="far fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                </div>
            </div>
        `;
        projectsGrid.appendChild(card);
    });
}

function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });
    
    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}

function initThemeToggle() {
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = document.getElementById('theme-icon');
    if (!themeBtn || !themeIcon) return;
    
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('portfolio-theme', 'light');
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initTypewriter();
    fetchRepos();
    initScrollAnimations();
});
