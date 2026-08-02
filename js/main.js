/* ============================================
   PRELOADER
   ============================================ */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    // Aguarda a animação da logo (aprox 2s) e depois esconde
    setTimeout(() => {
        preloader.classList.add('hidden');
        
        // Dispara animações do hero após o preloader
        setTimeout(() => {
            document.querySelectorAll('.reveal-text').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 120);
            });
        }, 400);
    }, 2500);
});

/* ============================================
   HEADER SCROLL EFFECT
   ============================================ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

/* ============================================
   MENU MOBILE
   ============================================ */
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
let menuOpen = false;

menuToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    
    // Anima o hamburguer
    const spans = menuToggle.querySelectorAll('span');
    if (menuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});

// Fecha menu ao clicar em link
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    });
});

/* ============================================
   SCROLL REVEAL (Intersection Observer)
   ============================================ */
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-up').forEach(el => {
    revealObserver.observe(el);
});

/* ============================================
   CANVAS DE CÓDIGO NO FUNDO
   ============================================ */
const canvas = document.getElementById('codeCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

const codeSnippets = [
    'const', 'let', 'var', 'function', 'return',
    'import', 'export', 'from', 'await', 'async',
    '=>', '{}', '[]', '()', '===',
    'React', 'useState', 'useEffect', 'props',
    'display:', 'flex', 'grid', 'absolute',
    'npm', 'git', 'commit', 'push', 'merge',
    '<div>', '</div>', 'className', 'onClick',
    'console.log', 'try', 'catch', 'throw',
    'if', 'else', 'for', 'while', 'map',
    'true', 'false', 'null', 'undefined'
];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function createParticle() {
    return {
        x: Math.random() * width,
        y: Math.random() * height,
        text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        size: 10 + Math.random() * 8,
        speedY: 0.2 + Math.random() * 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: 0.05 + Math.random() * 0.15,
        color: Math.random() > 0.5 ? '#00d4ff' : '#7b2ff7'
    };
}

function initParticles() {
    particles = [];
    const count = Math.floor((width * height) / 25000);
    for (let i = 0; i < count; i++) {
        particles.push(createParticle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
        ctx.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillText(p.text, p.x, p.y);
        
        p.y += p.speedY;
        p.x += p.speedX;
        
        if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
        }
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
    });
    
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    resize();
    initParticles();
});

resize();
initParticles();
animate();

/* ============================================
   SMOOTH SCROLL PARA LINKS INTERNOS
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});