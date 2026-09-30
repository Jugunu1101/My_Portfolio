/* ══════════════════════════════════════════════════════════════════
   NITIN NEGI — Cybersecurity Portfolio | script.js
   Features: Three.js Globe, Typewriter, Scroll Reveals, Mobile Menu,
             Cursor Glow, Skill Bars, Counters, Tilt, Form Validation,
             Theme Toggle, Smooth Scroll, Back-to-Top, Resume Modal,
             Dynamic JSON Data Fetching
   ══════════════════════════════════════════════════════════════════ */

// ─────────── DATA FETCHING ───────────
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Could not load data from ${url}:`, error);
    return null;
  }
}

// ─────────── LOADING SCREEN ───────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.classList.add('hide');
      setTimeout(() => loader.remove(), 600);
    }
    // Trigger initial reveals
    initScrollReveals();
    animateCounters();
  }, 1800);
});

// ─────────── THREE.JS WIREFRAME GLOBE ───────────
function initThreeGlobe() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Wireframe globe
  const globeGeo = new THREE.IcosahedronGeometry(5, 3);
  const isDark = document.documentElement.classList.contains('dark');
  const globeMat = new THREE.MeshBasicMaterial({
    color: isDark ? 0x00ff41 : 0x0ea5e9,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });
  const globe = new THREE.Mesh(globeGeo, globeMat);
  scene.add(globe);

  // Inner globe
  const innerGeo = new THREE.IcosahedronGeometry(4.2, 2);
  const innerMat = new THREE.MeshBasicMaterial({
    color: isDark ? 0x00ff41 : 0x0ea5e9,
    wireframe: true,
    transparent: true,
    opacity: 0.06
  });
  const innerGlobe = new THREE.Mesh(innerGeo, innerMat);
  scene.add(innerGlobe);

  // Floating particles
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: isDark ? 0x00ff41 : 0x0ea5e9,
    size: 0.05,
    transparent: true,
    opacity: 0.6
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  camera.position.z = 12;

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.003;
    globe.rotation.x += 0.001;
    innerGlobe.rotation.y -= 0.002;
    innerGlobe.rotation.x -= 0.001;
    particles.rotation.y += 0.0005;

    // Mouse parallax
    globe.rotation.y += mouseX * 0.001;
    globe.rotation.x += mouseY * 0.001;

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });

  // Store references for theme updates
  window._threeRefs = { globeMat, innerMat, particleMat };
}

// ─────────── TYPEWRITER EFFECT ───────────
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;
  const phrases = [
    'Cybersecurity Enthusiast',
    'Ethical Hacker in Training',
    'BCA Student @ MIET Kumaon',
    'Network Security Learner',
    'Python Security Scripter'
  ];
  let phraseIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  // Start after loading screen
  setTimeout(type, 2200);
}

// ─────────── SCROLL REVEAL ANIMATIONS ───────────
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.transitionDelay || '0ms';
        entry.target.style.transitionDelay = delay;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ─────────── MOBILE HAMBURGER MENU ───────────
function initMobileMenu() {
  const btn = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const icon = document.getElementById('hamburger-icon');
  const links = document.querySelectorAll('.mobile-nav-link');
  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
    drawer.classList.toggle('open', isOpen);
    backdrop.classList.toggle('hidden', !isOpen);
    icon.className = isOpen ? 'fa-solid fa-xmark text-sm' : 'fa-solid fa-bars text-sm';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    drawer.classList.remove('open');
    backdrop.classList.add('hidden');
    icon.className = 'fa-solid fa-bars text-sm';
    document.body.style.overflow = '';
  }

  btn?.addEventListener('click', toggle);
  backdrop?.addEventListener('click', close);
  links.forEach(link => link.addEventListener('click', close));
  document.getElementById('mobile-resume-btn')?.addEventListener('click', () => {
    close();
    openResumeModal();
  });
}

// ─────────── CURSOR GLOW ───────────
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || window.innerWidth < 768) return;

  glow.classList.add('active');
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => glow.classList.remove('active'));
  document.addEventListener('mouseenter', () => glow.classList.add('active'));
}

// ─────────── ANIMATED SKILL BARS ───────────
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.dataset.width;
        setTimeout(() => {
          entry.target.style.width = width + '%';
        }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

// ─────────── COUNTER ANIMATIONS ───────────
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        let current = 0;
        const duration = 1500;
        const increment = target / (duration / 16);

        function update() {
          current += increment;
          if (current >= target) {
            entry.target.textContent = target + '+';
          } else {
            entry.target.textContent = Math.floor(current);
            requestAnimationFrame(update);
          }
        }
        setTimeout(update, 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ─────────── ACTIVE NAV HIGHLIGHTING ───────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const isActive = link.dataset.section === id;
          link.classList.toggle('text-cyber', isActive);
          const underline = link.querySelector('span');
          if (underline) {
            underline.style.width = isActive ? '100%' : '';
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ─────────── SMOOTH SCROLL ───────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ─────────── BACK TO TOP ───────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─────────── THEME TOGGLE ───────────
function initThemeToggle() {
  const html = document.documentElement;

  // Check saved preference
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    html.classList.remove('dark');
  } else {
    html.classList.add('dark');
  }

  function updateIcons() {
    const isDark = html.classList.contains('dark');
    const iconClass = isDark ? 'fa-solid fa-sun text-sm' : 'fa-solid fa-moon text-sm';
    const icon1 = document.getElementById('theme-icon');
    const icon2 = document.getElementById('theme-icon-mobile');
    if (icon1) icon1.className = iconClass;
    if (icon2) icon2.className = iconClass;

    // Update Three.js colors
    if (window._threeRefs) {
      const color = isDark ? 0x00ff41 : 0x0ea5e9;
      window._threeRefs.globeMat.color.setHex(color);
      window._threeRefs.innerMat.color.setHex(color);
      window._threeRefs.particleMat.color.setHex(color);
    }
  }

  function toggle() {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    updateIcons();
  }

  document.getElementById('theme-toggle')?.addEventListener('click', toggle);
  document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggle);
  updateIcons();
}

// ─────────── CARD TILT EFFECT ───────────
function initTiltCards() {
  if (window.innerWidth < 768) return;

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    });
  });
}

// ─────────── FORM VALIDATION ───────────
function initFormValidation() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(el => {
      el.classList.add('hidden');
      el.textContent = '';
    });
    form.querySelectorAll('input, textarea').forEach(el => {
      el.classList.remove('border-red-500');
    });

    // Validate each field
    const fields = [
      { name: 'name', msg: 'Please enter your name' },
      { name: 'email', msg: 'Please enter a valid email' },
      { name: 'subject', msg: 'Please enter a subject' },
      { name: 'message', msg: 'Please enter your message' }
    ];

    fields.forEach(field => {
      const input = form.querySelector(`[name="${field.name}"]`);
      const error = input?.parentElement.querySelector('.form-error');
      if (!input || !error) return;

      let valid = input.value.trim().length > 0;
      if (field.name === 'email' && valid) {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      }

      if (!valid) {
        isValid = false;
        input.classList.add('border-red-500');
        error.textContent = field.msg;
        error.classList.remove('hidden');
      }
    });

    if (isValid) {
      // Show success
      const btn = document.getElementById('submit-btn');
      const success = document.getElementById('form-success');
      btn.innerHTML = '<i class="fa-solid fa-check-circle"></i> Sent!';
      btn.classList.add('bg-emerald-600');
      btn.disabled = true;
      success?.classList.remove('hidden');

      setTimeout(() => {
        form.reset();
        btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        btn.classList.remove('bg-emerald-600');
        btn.disabled = false;
        success?.classList.add('hidden');
      }, 3000);
    }
  });
}

// ─────────── RESUME MODAL ───────────
function openResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    modal.style.opacity = '1';
  });
}

function closeResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (!modal) return;
  modal.style.opacity = '0';
  document.body.style.overflow = '';
  setTimeout(() => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }, 300);
}

function initResumeModal() {
  // Open triggers
  document.getElementById('open-resume-btn')?.addEventListener('click', openResumeModal);
  document.getElementById('view-resume-nav-btn')?.addEventListener('click', openResumeModal);
  document.querySelectorAll('.view-resume-trigger').forEach(btn => {
    btn.addEventListener('click', openResumeModal);
  });

  // Close triggers
  document.getElementById('close-resume-btn')?.addEventListener('click', closeResumeModal);
  document.getElementById('resume-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeResumeModal();
  });

  // Print/Download
  document.getElementById('print-resume-btn')?.addEventListener('click', () => {
    window.print();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeResumeModal();
  });
}

// ─────────── RENDER FUNCTIONS ───────────

function renderAbout(data) {
  const container = document.getElementById('about-container');
  if (!container || !data) return;

  const keywordsHTML = data.keywords.map(kw => 
    `<span class="px-3.5 py-1.5 bg-zinc-50 dark:bg-terminal border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold font-mono">${kw}</span>`
  ).join('');

  container.innerHTML = `
    <div class="lg:col-span-4 reveal">
      <div class="relative rounded-[2rem] overflow-hidden border-2 border-cyber/30 shadow-2xl shadow-cyber/10 group">
        <div class="absolute inset-0 bg-cyber/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
        <img src="assets/images/profile.jpg" alt="Nitin Negi" class="w-full h-full object-cover aspect-[3/4] group-hover:scale-105 transition-transform duration-700" onerror="this.src='https://via.placeholder.com/400x500?text=Profile+Photo'">
      </div>
    </div>
    <div class="lg:col-span-8 bg-white dark:bg-surface rounded-[2rem] p-6 sm:p-10 border border-zinc-200 dark:border-zinc-700/60 shadow-sm hover:border-cyber/40 transition-all duration-300 reveal flex flex-col justify-center" style="transition-delay:100ms;">
        <h3 class="text-xl sm:text-2xl font-bold mb-5 flex items-center gap-3">
            <span class="w-3 h-3 rounded-full bg-cyber animate-pulse"></span>
            Cybersecurity Enthusiast & BCA Student
        </h3>
        <p class="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base sm:text-lg mb-6">${data.bioParagraph1}</p>
        <p class="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base sm:text-lg mb-8">${data.bioParagraph2}</p>
        <div class="flex flex-wrap gap-2.5 mb-8">${keywordsHTML}</div>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            ${data.stats.map(stat => `
                <div>
                    <p class="text-3xl font-heading font-extrabold text-cyber" data-count="${stat.count}">0</p>
                    <p class="text-xs text-zinc-500 font-mono mt-1">${stat.label}</p>
                </div>
            `).join('')}
        </div>
    </div>
  `;
}

function renderSkills(data) {
  const container = document.getElementById('skills-container');
  if (!container || !data) return;

  container.innerHTML = data.map((category, idx) => `
    <div class="group tilt-card bg-zinc-50 dark:bg-surface rounded-[2rem] p-7 border border-zinc-200 dark:border-zinc-700/60 hover:border-cyber hover:shadow-xl hover:shadow-cyber/5 transition-all duration-300 reveal" style="transition-delay:${(idx%3)*100}ms;">
        <div class="w-12 h-12 rounded-2xl bg-white dark:bg-terminal flex items-center justify-center text-cyber text-xl mb-5 shadow-sm group-hover:bg-cyber group-hover:text-terminal transition-all">
            <i class="${category.icon}"></i>
        </div>
        <h4 class="font-heading text-lg font-bold mb-4">${category.category}</h4>
        <div class="space-y-3">
            ${category.items.map(item => `
                <div>
                    <div class="flex justify-between text-xs font-mono mb-1"><span>${item.name}</span><span class="text-cyber">${item.proficiency}%</span></div>
                    <div class="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden"><div class="skill-fill bg-gradient-to-r from-cyber to-cyber-dark rounded-full" data-width="${item.proficiency}" style="width:0%"></div></div>
                </div>
            `).join('')}
        </div>
    </div>
  `).join('');
}

function renderEducation(data) {
  const container = document.getElementById('education-container');
  if (!container || !data) return;

  container.innerHTML = data.map((edu, idx) => `
    <div class="p-8 rounded-[2rem] bg-zinc-50 dark:bg-surface border border-zinc-200 dark:border-zinc-700/60 reveal tilt-card" style="transition-delay:${idx*100}ms;">
        <div class="w-12 h-12 rounded-2xl bg-cyber/10 text-cyber flex items-center justify-center text-xl mb-4">
            <i class="fa-solid ${edu.isActive ? 'fa-graduation-cap' : 'fa-check-double'}"></i>
        </div>
        <span class="text-xs font-bold text-cyber uppercase tracking-wider font-mono">${edu.isActive ? 'Formal Degree' : 'Completed Degree'}</span>
        <h3 class="font-heading text-2xl font-bold mt-1 mb-2">${edu.degree}</h3>
        <p class="text-zinc-600 dark:text-zinc-400 text-sm mb-4">${edu.school}, ${edu.location}</p>
        <div class="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-200 dark:border-zinc-800 font-mono">
            <span>${edu.period}</span>
            <span class="font-bold ${edu.isActive ? 'text-cyber' : 'text-zinc-500'}">${edu.status}</span>
        </div>
    </div>
  `).join('');
}

function renderCertifications(data) {
  const container = document.getElementById('certifications-container');
  if (!container || !data) return;

  const certsHTML = data.map((cert, idx) => `
    <div class="p-5 rounded-2xl bg-white dark:bg-terminal border border-zinc-200 dark:border-zinc-800 transition-all hover:border-cyber/50 hover:shadow-xl hover:shadow-cyber/10 group reveal tilt-card flex flex-col justify-between" style="transition-delay:${(idx%3)*100}ms;">
        <div>
            <p class="text-base font-bold text-zinc-900 dark:text-white mb-1 font-heading">${cert.name}</p>
            <p class="text-xs text-cyber font-mono mb-4 flex items-center gap-2"><i class="fa-solid fa-award"></i> ${cert.issuer}</p>
        </div>
        ${cert.image ? `
        <div class="relative overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900 aspect-[4/3] flex items-center justify-center cursor-pointer" onclick="openImageModal('${cert.image}', '${cert.name}')">
            <img src="${cert.image}" alt="${cert.name}" class="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105">
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <i class="fa-solid fa-expand text-white opacity-0 group-hover:opacity-100 text-2xl transition-opacity duration-300 drop-shadow-md"></i>
            </div>
        </div>
        ` : ''}
    </div>
  `).join('');

  container.innerHTML = `
    <div class="flex flex-col items-center mb-8 reveal text-center">
        <h3 class="font-heading text-2xl sm:text-4xl font-bold flex items-center gap-3">
            <i class="fa-solid fa-certificate text-cyber"></i> Verified Credentials
        </h3>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${certsHTML}
    </div>
  `;
}

// ════════════════════════════════════════════════════════════
// Image Modal Logic
// ════════════════════════════════════════════════════════════
window.openImageModal = function(imageSrc, title) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-image-title');
    
    if (modal && modalImg) {
        modalImg.src = imageSrc;
        if (modalTitle) modalTitle.textContent = title || '';
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        // Trigger reflow
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        document.body.style.overflow = 'hidden';
    }
};

window.closeImageModal = function() {
    const modal = document.getElementById('image-modal');
    if (modal && !modal.classList.contains('hidden')) {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }, 300);
    }
};

// Close image modal when clicking outside, double clicking, or pressing ESC key
document.addEventListener('DOMContentLoaded', () => {
    const imageModal = document.getElementById('image-modal');
    if (imageModal) {
        // Single click outside image container to close
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });

        // Double click anywhere on modal or image to close
        imageModal.addEventListener('dblclick', () => {
            closeImageModal();
        });
    }

    // ESC key listener to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
});

function renderProjects(projectsData) {
  const grid = document.getElementById('projects-grid');
  const resumeProjects = document.getElementById('resume-projects');
  if (!grid || !projectsData) return;
  grid.innerHTML = '';
  if(resumeProjects) resumeProjects.innerHTML = '';

  projectsData.forEach((project, idx) => {
    // Main project card
    const card = document.createElement('div');
    card.className = `group tilt-card bg-white dark:bg-surface rounded-[2rem] border border-zinc-200 dark:border-zinc-700/60 overflow-hidden hover:border-cyber hover:shadow-2xl hover:shadow-cyber/5 transition-all duration-300 flex flex-col reveal`;
    card.style.transitionDelay = `${(idx % 3) * 100}ms`;

    const bulletsHTML = project.bullets.map(b => `<li>• ${b}</li>`).join('');
    const tagsHTML = project.tags.map(t =>
      `<span class="px-2.5 py-1 bg-zinc-100 dark:bg-terminal text-[11px] font-bold rounded-md font-mono border border-zinc-200 dark:border-zinc-800">${t}</span>`
    ).join('');
    
    // Optional image handling
    const imageHTML = project.image ? `<img src="${project.image}" alt="${project.title}" class="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity">` : '';

    card.innerHTML = `
      <div class="aspect-video bg-gradient-to-br ${project.color} p-6 flex flex-col justify-between relative overflow-hidden">
        ${imageHTML}
        <div class="relative z-10 flex justify-between items-center">
          <span class="px-3 py-1 bg-white/80 dark:bg-terminal/80 backdrop-blur-md rounded-lg text-xs font-bold ${project.badgeColor} font-mono">${project.badge}</span>
          <i class="${project.icon} text-2xl ${project.badgeColor}"></i>
        </div>
        <div class="relative z-10">
          <p class="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300 font-mono">${project.category}</p>
          <h4 class="font-heading text-xl font-bold mt-1 text-black dark:text-white">${project.title}</h4>
        </div>
      </div>
      <div class="p-6 sm:p-8 flex-1 flex flex-col">
        <ul class="space-y-2 text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 flex-1">
          ${bulletsHTML}
        </ul>
        <div class="flex gap-2 flex-wrap mb-6">${tagsHTML}</div>
        <a href="${project.github}" target="_blank" rel="noopener noreferrer"
           class="w-full py-2.5 bg-cyber text-terminal text-center text-sm font-bold rounded-xl hover:bg-cyber-dark transition-colors flex items-center justify-center gap-2 font-mono">
          <i class="fa-brands fa-github"></i> View Project
        </a>
      </div>
    `;
    grid.appendChild(card);

    // Resume project entry
    if (resumeProjects) {
      const entry = document.createElement('div');
      const resumeBullets = project.bullets.map(b => `<li>${b}</li>`).join('');
      entry.innerHTML = `
        <div class="flex flex-col sm:flex-row justify-between sm:items-center font-bold">
          <span>${project.title}</span>
          <span class="text-xs text-cyber font-semibold font-mono">${project.tags.join(', ')}</span>
        </div>
        <ul class="list-disc list-inside mt-1.5 space-y-1 text-zinc-600 dark:text-zinc-400">${resumeBullets}</ul>
      `;
      resumeProjects.appendChild(entry);
    }
  });
}

// ─────────── NAVBAR SCROLL EFFECT ───────────
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('shadow-lg');
    } else {
      navbar.classList.remove('shadow-lg');
    }
  });
}

// ─────────── INIT EVERYTHING ───────────
document.addEventListener('DOMContentLoaded', async () => {
  // Load data concurrently
  const [aboutData, skillsData, eduData, certsData, projectsData] = await Promise.all([
    fetchData('data/about.json'),
    fetchData('data/skills.json'),
    fetchData('data/education.json'),
    fetchData('data/certifications.json'),
    fetchData('data/projects.json')
  ]);

  // Render components
  if(aboutData) renderAbout(aboutData);
  if(skillsData) renderSkills(skillsData);
  if(eduData) renderEducation(eduData);
  if(certsData) renderCertifications(certsData);
  if(projectsData) renderProjects(projectsData);

  // Initialize UI features (need slight delay for DOM to settle)
  setTimeout(() => {
    initThreeGlobe();
    initTypewriter();
    initMobileMenu();
    initCursorGlow();
    initSkillBars();
    animateCounters();
    initScrollReveals();
    initActiveNav();
    initSmoothScroll();
    initBackToTop();
    initThemeToggle();
    initTiltCards();
    initFormValidation();
    initResumeModal();
    initNavbarScroll();
  }, 100);
});
