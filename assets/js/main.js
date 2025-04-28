document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Functionality
    const hamburger = document.querySelector('.hamburger-menu');
    const navContent = document.querySelector('.nav-content');
    
    // Create an overlay element for the mobile menu
    const navOverlay = document.createElement('div');
    navOverlay.classList.add('nav-overlay');
    document.body.appendChild(navOverlay);
    
    // Toggle mobile menu
    if (hamburger && navContent) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navContent.classList.toggle('active');
            navOverlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when links are clicked
        const navLinks = navContent.querySelectorAll('a:not(.cart-icon)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navContent.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu when overlay is clicked
        navOverlay.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navContent.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
        
        // Close menu with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navContent.classList.contains('active')) {
                hamburger.classList.remove('active');
                navContent.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.padding = '';
            header.style.boxShadow = '';
        }
    });

    // Simple image slider function
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slider-item');
    
    if (slides.length > 1) {
        showSlides();
        
        function showSlides() {
            for (let i = 0; i < slides.length; i++) {
                slides[i].classList.remove('active');
            }
            slideIndex++;
            if (slideIndex > slides.length) {slideIndex = 1}
            slides[slideIndex-1].classList.add('active');
            setTimeout(showSlides, 5000); // Change slide every 5 seconds
        }
    }

    // Testimonial slider functionality
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevButton = document.querySelector('.testimonial-prev');
    const nextButton = document.querySelector('.testimonial-next');
    let currentTestimonial = 0;
    
    // Create dots for each testimonial
    if (testimonials.length > 0 && dotsContainer) {
        testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                showTestimonial(index);
            });
            dotsContainer.appendChild(dot);
        });
        
        // Add click events for prev and next buttons
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                showTestimonial(currentTestimonial - 1);
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                showTestimonial(currentTestimonial + 1);
            });
        }
        
        // Auto advance testimonials
        let testimonialInterval = setInterval(() => {
            showTestimonial(currentTestimonial + 1);
        }, 7000);
        
        // Stop auto advance on hover
        const testimonialSlider = document.querySelector('.testimonial-slider');
        if (testimonialSlider) {
            testimonialSlider.addEventListener('mouseenter', () => {
                clearInterval(testimonialInterval);
            });
            
            testimonialSlider.addEventListener('mouseleave', () => {
                testimonialInterval = setInterval(() => {
                    showTestimonial(currentTestimonial + 1);
                }, 7000);
            });
        }
    }
    
    function showTestimonial(index) {
        if (index < 0) index = testimonials.length - 1;
        if (index >= testimonials.length) index = 0;
        
        testimonials.forEach(item => item.classList.remove('active'));
        testimonials[index].classList.add('active');
        
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        currentTestimonial = index;
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add animations on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-item, .collection-item, .testimonial-item');
        
        elements.forEach(element => {
            const position = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (position < screenPosition) {
                element.classList.add('animate');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
});
