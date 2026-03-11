/* Prevent auto-scroll to bottom on reload */
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

window.onload = function () {
    window.scrollTo(0, 0);
}

/* Wait for DOM to load */
document.addEventListener('DOMContentLoaded', () => {

    /* Intersection Observer for scroll animations (fade-in-up) */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    /* Add project click interaction hint (optional functionality) */
    const addCards = document.querySelectorAll('.add-project-card');
    addCards.forEach(card => {
        card.addEventListener('click', () => {
            // In a real app we might open a modal here, but for now we simply flash an alert.
            alert('To add projects, edit the HTML file or implement a dynamic CMS/form here!');
        });
    });

    /* Navbar scroll effect */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'var(--nav-bg)';
            navbar.style.backdropFilter = 'blur(12px)';
            navbar.style.boxShadow = 'var(--card-shadow)';
        } else {
            navbar.style.backgroundColor = 'transparent';
            navbar.style.backdropFilter = 'none';
            navbar.style.boxShadow = 'none';
        }
    });

    /* Theme Toggle Logic */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');

        const getSafeTheme = () => {
            try {
                return localStorage.getItem('portfolio-theme') || 'dark-theme';
            } catch (e) {
                return 'dark-theme'; // Fallback if localStorage is restricted
            }
        };

        const setSafeTheme = (theme) => {
            try {
                localStorage.setItem('portfolio-theme', theme);
            } catch (e) {
                // Ignore storage errors (e.g. private mode)
            }
        };

        const updateThemeIcon = (theme) => {
            if (themeIcon) {
                if (theme === 'light-theme') {
                    themeIcon.classList.replace('fa-moon', 'fa-sun');
                } else {
                    themeIcon.classList.replace('fa-sun', 'fa-moon');
                }
            }
        };

        const applyTheme = (theme) => {
            if (theme === 'light-theme') {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
            }
            updateThemeIcon(theme);
        };

        // Initialize theme
        const savedTheme = getSafeTheme();
        applyTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            const isDark = body.classList.contains('dark-theme');
            const newTheme = isDark ? 'light-theme' : 'dark-theme';
            applyTheme(newTheme);
            setSafeTheme(newTheme);
        });
    }

    /* Typing Animation */
    const textArray = ["Modern Web Experiences", "Interactive Interfaces", "Creative Web Solutions", "Digital Product Design"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    const typingTextSpan = document.querySelector(".typing-text");
    const cursorSpan = document.querySelector(".cursor");

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typingTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        }
        else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typingTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        }
        else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 500);
        }
    }

    if (textArray.length) setTimeout(type, newTextDelay + 250);

    /* Projects Category Filter */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('#projects .project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            let visibleCount = 0;
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    // Re-trigger animation with dynamic faster staggered delay
                    card.style.transitionDelay = `${visibleCount * 0.05}s`;
                    visibleCount++;

                    card.classList.remove('visible');
                    setTimeout(() => card.classList.add('visible'), 10);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('visible');
                    card.style.transitionDelay = '0s';
                }
            });
        });
    });

    /* Navbar Active Scroll Spy */
    const sections = document.querySelectorAll('section, header, footer');
    const navItems = document.querySelectorAll('.nav-links li a');

    function updateActiveNav() {
        let current = '';

        // Force 'home' when sitting at the top
        if (window.scrollY < 100) {
            current = 'home';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            // Force 'contact' if at the absolute bottom
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
                current = 'contact';
            }
        }

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // Call once to set initial active state
    updateActiveNav();
});
