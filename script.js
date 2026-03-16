document.addEventListener('DOMContentLoaded', () => {

    // Sticky Navbar shadow on scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Advanced Reveal elements on scroll (Slide Left, Fade Up, etc)
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If the element has a counter, trigger it
                if (entry.target.classList.contains('stats-banner')) {
                    startCounters(entry.target);
                }
                
                // Keep the 'active' class permanently once scrolled past
                observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    // Number Counter Animation Engine
    function startCounters(banner) {
        // Prevent double init
        if(banner.dataset.animated === "true") return;
        banner.dataset.animated = "true";
        
        const counters = banner.querySelectorAll('.stat-num');
        const speed = 200; // The lower the slower

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/\D/g, ''); // Extract only numbers
                
                // Lower increment slows down the animation
                const inc = target / speed;

                // Check if target is reached
                if (count < target) {
                    // Add increment and display
                    counter.innerText = Math.ceil(count + inc);
                    // Call function every ms
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };

            updateCount();
        });
    }

    // Search button interactivity
    const searchBtn = document.querySelector('.search-btn');
    if(searchBtn) {
        searchBtn.addEventListener('click', () => {
            // Quick mock interaction for the wow factor
            searchBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                searchBtn.style.transform = 'scale(1)';
            }, 150);
        });
    }

});
