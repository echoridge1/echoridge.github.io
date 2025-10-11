/* ============================================
   Echo Ridge Retreat - Main JavaScript
   Navigation handler and interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // Mobile Menu Toggle
  // ============================================

  const menuToggle = document.getElementById('menu-toggle');
  const primaryNavigation = document.getElementById('primary-navigation');

  if (menuToggle && primaryNavigation) {
    // Toggle menu on button click
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

      // Toggle aria-expanded state
      menuToggle.setAttribute('aria-expanded', !isExpanded);

      // Toggle navigation visibility
      if (isExpanded) {
        primaryNavigation.classList.add('hide-mobile');
        primaryNavigation.classList.remove('show-mobile');
      } else {
        primaryNavigation.classList.remove('hide-mobile');
        primaryNavigation.classList.add('show-mobile');
      }
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        menuToggle.setAttribute('aria-expanded', 'false');
        primaryNavigation.classList.add('hide-mobile');
        primaryNavigation.classList.remove('show-mobile');
        menuToggle.focus(); // Return focus to toggle button
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      const isClickInsideNav = primaryNavigation.contains(e.target);
      const isClickOnToggle = menuToggle.contains(e.target);

      if (!isClickInsideNav && !isClickOnToggle && menuToggle.getAttribute('aria-expanded') === 'true') {
        menuToggle.setAttribute('aria-expanded', 'false');
        primaryNavigation.classList.add('hide-mobile');
        primaryNavigation.classList.remove('show-mobile');
      }
    });

    // Focus trap inside menu when open (for accessibility)
    primaryNavigation.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && menuToggle.getAttribute('aria-expanded') === 'true') {
        const focusableElements = primaryNavigation.querySelectorAll('a[href], button:not([disabled])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // If shift+tab on first element, focus last element
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
        // If tab on last element, focus first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      const targetElement = document.querySelector(href);

      if (targetElement) {
        e.preventDefault();

        // Smooth scroll to target
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Set focus to target (for accessibility)
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
      }
    });
  });

  // ============================================
  // Active Navigation Link
  // ============================================

  // Get current page path
  const currentPath = window.location.pathname;

  // Find and mark active navigation link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;

    if (linkPath === currentPath) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  // ============================================
  // Form Character Counter (for contact form)
  // ============================================

  const messageField = document.querySelector('#message');
  const charCount = document.querySelector('#char-count');

  if (messageField && charCount) {
    messageField.addEventListener('input', () => {
      const currentLength = messageField.value.length;
      charCount.textContent = currentLength;

      // Warning when approaching limit
      if (currentLength > 1900) {
        charCount.classList.add('warning');
      } else {
        charCount.classList.remove('warning');
      }
    });
  }

  // ============================================
  // Form Validation and Submission
  // ============================================

  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    // Pre-select inquiry type from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const inquiryParam = urlParams.get('inquiry');
    const inquiryTypeSelect = contactForm.querySelector('#inquiry-type');

    if (inquiryParam && inquiryTypeSelect) {
      // Map URL parameter to select option value
      if (inquiryParam === 'partnership') {
        inquiryTypeSelect.value = 'partnership';
      } else if (inquiryParam === 'general') {
        inquiryTypeSelect.value = 'general';
      } else if (inquiryParam === 'donation') {
        inquiryTypeSelect.value = 'donation';
      } else if (inquiryParam === 'retreat') {
        inquiryTypeSelect.value = 'retreat';
      } else if (inquiryParam === 'photography') {
        inquiryTypeSelect.value = 'photography';
      } else if (inquiryParam === 'media') {
        inquiryTypeSelect.value = 'media';
      } else if (inquiryParam === 'volunteer') {
        inquiryTypeSelect.value = 'volunteer';
      }
    }

    contactForm.addEventListener('submit', (e) => {
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const phone = contactForm.querySelector('#phone');
      const inquiryType = contactForm.querySelector('#inquiry-type');
      const message = contactForm.querySelector('#message');
      const consent = contactForm.querySelector('#consent');

      // Clear previous custom validity
      [name, email, phone, inquiryType, message, consent].forEach(field => {
        if (field) field.setCustomValidity('');
      });

      let hasError = false;

      // Name validation
      if (name && name.value.trim().length < 2) {
        name.setCustomValidity('Please enter your full name (at least 2 characters)');
        name.reportValidity();
        e.preventDefault();
        hasError = true;
      }

      // Email validation
      if (email && email.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
          email.setCustomValidity('Please enter a valid email address');
          email.reportValidity();
          e.preventDefault();
          hasError = true;
        }
      }

      // Phone validation (if provided)
      if (phone && phone.value && !phone.validity.valid) {
        phone.setCustomValidity('Please enter a valid phone number');
        phone.reportValidity();
        e.preventDefault();
        hasError = true;
      }

      // Inquiry type validation
      if (inquiryType && !inquiryType.value) {
        inquiryType.setCustomValidity('Please select an inquiry type');
        inquiryType.reportValidity();
        e.preventDefault();
        hasError = true;
      }

      // Message validation
      if (message && message.value.trim().length < 20) {
        message.setCustomValidity('Please provide more details (at least 20 characters)');
        message.reportValidity();
        e.preventDefault();
        hasError = true;
      }

      // Consent validation
      if (consent && !consent.checked) {
        consent.setCustomValidity('You must consent to us storing your information');
        consent.reportValidity();
        e.preventDefault();
        hasError = true;
      }

      // If validation passes, show loading state
      if (!hasError) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.textContent = 'Sending...';
          submitButton.disabled = true;
        }
      }
    });

    // Handle validation errors (add error class)
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('invalid', () => {
        field.classList.add('error');
      });

      field.addEventListener('input', () => {
        field.classList.remove('error');
      });
    });
  }

  // ============================================
  // Image Lazy Loading Fallback
  // ============================================

  // For browsers that don't support native lazy loading
  if ('loading' in HTMLImageElement.prototype === false) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback: load all images immediately
      lazyImages.forEach(img => {
        img.src = img.dataset.src || img.src;
      });
    }
  }

  // ============================================
  // Print Dialog Enhancement
  // ============================================

  // Add print button functionality if exists
  const printButtons = document.querySelectorAll('[data-print]');
  printButtons.forEach(button => {
    button.addEventListener('click', () => {
      window.print();
    });
  });

});
