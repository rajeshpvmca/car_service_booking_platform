// Main scripts for Car Service Booking Platform

async function loadComponents() {
    try {
        // Load Header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const headerRes = await fetch('header.html');
            if (headerRes.ok) {
                headerPlaceholder.innerHTML = await headerRes.text();
            }
        }

        // Load Footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            const footerRes = await fetch('footer.html');
            if (footerRes.ok) {
                footerPlaceholder.innerHTML = await footerRes.text();
            }
        }
    } catch (error) {
        console.error('Error loading components. Note: You must run a local server (like VSCode Live Server) for fetch to work locally.', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // 0. Load Header and Footer first
    await loadComponents();

    // 0.5 Highlight Active Nav Link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 1. Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 50
    });

    // 2. Navbar Scroll Effect (Needs to query again since it was injected)
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        // Trigger once on load
        if (window.scrollY > 50) navbar.classList.add('scrolled');
    }

    // 3. Initialize Swiper for Hero Section (only if it exists on page)
    if (document.querySelector('.hero-swiper')) {
        const heroSwiper = new Swiper('.hero-swiper', {
            loop: true,
            effect: 'fade',
            speed: 1500,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    // 4. Initialize Testimonials Swiper
    if (document.querySelector('.testimonials-swiper')) {
        const testimonialsSwiper = new Swiper('.testimonials-swiper', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            speed: 4000,
            allowTouchMove: false,
            loopAdditionalSlides: 5,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }
});





// Number Counter Animation
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter-number');
    
    // Formatting function for numbers (e.g. 15000 -> 15k)
    const formatNumber = (num, target) => {
        if (target == 15000 && num >= 1000) {
            return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'k';
        }
        return Math.floor(num);
    };

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const stepTime = 20; 
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const updateCounter = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.innerText = target == 15000 ? '15k' : target;
                clearInterval(updateCounter);
            } else {
                counter.innerText = formatNumber(current, target);
            }
        }, stepTime);
    };

    // Intersection Observer to trigger when visible
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
});
