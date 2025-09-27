// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initFormValidation();
    initAnimations();
    initMobileMenu();
    initFloatingCTA();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active link
                updateActiveNavLink(targetId);
                
                // Mobile menu is hidden, no need to close
            }
        });
    });
    
    // Update active navigation link on scroll
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

// Update active navigation link based on scroll position
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Update active navigation link
function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Mobile menu functionality - removed since menu is hidden on mobile
function initMobileMenu() {
    // Menu is hidden on mobile, no functionality needed
}

// Close mobile menu - removed since menu is hidden on mobile
function closeMobileMenu() {
    // Menu is hidden on mobile, no functionality needed
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-item, .service-card, .portfolio-item, .testimonial-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Removed parallax effect to fix scroll issues
}

// Form validation and submission
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            submitForm(form);
        }
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group');
    
    // Remove existing error
    clearFieldError(field);
    
    // Required field validation
    if (!value && field.hasAttribute('required')) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Success state
    fieldGroup.classList.add('success');
    fieldGroup.classList.remove('error');
    return true;
}

// Show field error
function showFieldError(field, message) {
    const fieldGroup = field.closest('.form-group');
    fieldGroup.classList.add('error');
    fieldGroup.classList.remove('success');
    
    // Remove existing error message
    const existingError = fieldGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    fieldGroup.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    const fieldGroup = field.closest('.form-group');
    fieldGroup.classList.remove('error');
    
    const errorMessage = fieldGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Submit form
async function submitForm(form) {
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    form.classList.add('loading');
    
    try {
        // Submit to Formspree
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Show success message
            showFormSuccess();
            form.reset();
            
            // Clear form states
            const formGroups = form.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                group.classList.remove('success', 'error');
            });
        } else {
            throw new Error('Form submission failed');
        }
        
    } catch (error) {
        showFormError('Failed to send message. Please try again.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.classList.remove('loading');
    }
}

// Show form success message
function showFormSuccess() {
    const message = document.createElement('div');
    message.className = 'form-message success';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
    `;
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(message, form);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
    
    // Scroll to message
    message.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show form error message
function showFormError(errorText) {
    const message = document.createElement('div');
    message.className = 'form-message error';
    message.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>${errorText}</p>
    `;
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(message, form);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Initialize animations
function initAnimations() {
    // Add CSS for form messages
    const style = document.createElement('style');
    style.textContent = `
        .form-message {
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideInDown 0.5s ease-out;
        }
        
        .form-message.success {
            background: rgba(39, 174, 96, 0.1);
            border: 1px solid #27ae60;
            color: #27ae60;
        }
        
        .form-message.error {
            background: rgba(231, 76, 60, 0.1);
            border: 1px solid #e74c3c;
            color: #e74c3c;
        }
        
        .form-message i {
            font-size: 1.5rem;
        }
        
        .form-message p {
            margin: 0;
            color: inherit;
        }
        
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate {
            animation: fadeInUp 0.6s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
}

// Floating CTA functionality
function initFloatingCTA() {
    const floatingCTA = document.querySelector('.floating-cta');
    const contactSection = document.getElementById('contact');
    
    if (!floatingCTA || !contactSection) return;
    
    window.addEventListener('scroll', function() {
        const contactTop = contactSection.offsetTop;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        // Hide floating CTA when contact section is visible
        if (scrollPosition >= contactTop + 100) {
            floatingCTA.style.opacity = '0';
            floatingCTA.style.pointerEvents = 'none';
        } else {
            floatingCTA.style.opacity = '1';
            floatingCTA.style.pointerEvents = 'auto';
        }
    });
    
    // Smooth scroll to contact section
    const floatingBtn = floatingCTA.querySelector('.floating-btn');
    if (floatingBtn) {
        floatingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector('#contact');
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
const debouncedScrollHandler = debounce(function() {
    updateActiveNavOnScroll();
}, 10);

// Replace the scroll event listener for nav updates
window.removeEventListener('scroll', updateActiveNavOnScroll);
window.addEventListener('scroll', debouncedScrollHandler);

// Lazy loading for images (if needed)
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Error handling for missing images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Replace with placeholder or hide if image fails to load
            this.style.display = 'none';
            console.warn(`Failed to load image: ${this.src}`);
        });
    });
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Mobile menu is hidden, no need to handle Escape key
    if (e.key === 'Escape') {
        // Menu is hidden on mobile
    }
    
    // Skip to main content on Tab
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const mainContent = document.querySelector('main') || document.querySelector('#home');
        if (mainContent) {
            mainContent.focus();
            e.preventDefault();
        }
    }
});

// Smooth reveal animations for elements
function revealOnScroll() {
    const reveals = document.querySelectorAll('.feature-item, .service-card, .portfolio-item, .testimonial-card');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('animate');
        }
    });
}

window.addEventListener('scroll', debounce(revealOnScroll, 10));

// Initialize reveal on load
document.addEventListener('DOMContentLoaded', revealOnScroll);
