/* ============================================
   Echo Ridge Retreat - Analytics JavaScript
   Google Analytics 4 tracking
   ============================================ */

// Initialize Google Analytics 4
// Replace 'G-XXXXXXXXXX' with actual GA4 Measurement ID
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Configure GA4 with IP anonymization and cookie consent
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true,
  'cookie_flags': 'SameSite=None;Secure'
});

console.log('Analytics initialized - GA4 tracking active');

// ============================================
// Track CTA Clicks
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Track all elements with data-track="cta_click"
  const ctaButtons = document.querySelectorAll('[data-track="cta_click"]');

  ctaButtons.forEach(button => {
    button.addEventListener('click', () => {
      const label = button.textContent.trim();
      const destination = button.getAttribute('href') || button.getAttribute('data-destination');

      gtag('event', 'cta_click', {
        'event_category': 'engagement',
        'event_label': label,
        'destination': destination
      });

      console.log('CTA Click tracked:', label);
    });
  });

  // ============================================
  // Track Social Media Clicks
  // ============================================

  const socialLinks = document.querySelectorAll('[data-track="social_click"]');

  socialLinks.forEach(link => {
    link.addEventListener('click', () => {
      const platform = link.getAttribute('data-platform') || 'unknown';
      const url = link.getAttribute('href');

      gtag('event', 'social_click', {
        'event_category': 'engagement',
        'event_label': platform,
        'destination': url
      });

      console.log('Social click tracked:', platform);
    });
  });

  // ============================================
  // Track Donation/Purchase Initiation
  // ============================================

  const checkoutButtons = document.querySelectorAll('[data-track="begin_checkout"]');

  checkoutButtons.forEach(button => {
    button.addEventListener('click', () => {
      const amount = button.getAttribute('data-amount') || '0';
      const product = button.getAttribute('data-product') || 'donation';

      gtag('event', 'begin_checkout', {
        'event_category': 'ecommerce',
        'currency': 'GBP',
        'value': parseFloat(amount) || 0,
        'items': [{
          'item_name': product,
          'item_category': button.getAttribute('data-category') || 'donation',
          'price': parseFloat(amount) || 0,
          'quantity': 1
        }]
      });

      console.log('Checkout initiated:', product, amount);
    });
  });

  // ============================================
  // Track Purchase Completion (Thank You Page)
  // ============================================

  if (window.location.pathname === '/thank-you.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      gtag('event', 'purchase', {
        'event_category': 'ecommerce',
        'transaction_id': sessionId,
        'currency': 'GBP'
      });

      console.log('Purchase completed:', sessionId);
    }
  }

  // ============================================
  // Track Form Submission Start
  // ============================================

  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    // Track when user focuses on any form field
    let formStartTracked = false;

    form.addEventListener('focus', (e) => {
      if (!formStartTracked && (e.target.matches('input, select, textarea'))) {
        const formName = form.getAttribute('name') || 'unnamed_form';

        gtag('event', 'form_start', {
          'event_category': 'engagement',
          'event_label': formName
        });

        formStartTracked = true;
        console.log('Form start tracked:', formName);
      }
    }, true);

    // Track form submission
    form.addEventListener('submit', () => {
      const formName = form.getAttribute('name') || 'unnamed_form';
      const inquiryType = form.querySelector('[name="inquiry_type"]');
      const inquiryValue = inquiryType ? inquiryType.value : 'unknown';

      gtag('event', 'form_submit', {
        'event_category': 'engagement',
        'event_label': formName,
        'inquiry_type': inquiryValue
      });

      console.log('Form submit tracked:', formName);
    });
  });

  // Track successful form submission (on thank-you-contact page)
  if (window.location.pathname === '/thank-you-contact.html') {
    gtag('event', 'form_submit_success', {
      'event_category': 'engagement',
      'event_label': 'contact'
    });

    console.log('Form submit success tracked');
  }

  // ============================================
  // Track Navigation Clicks
  // ============================================

  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const label = link.textContent.trim();
      const destination = link.getAttribute('href');

      gtag('event', 'navigation_click', {
        'event_category': 'navigation',
        'event_label': label,
        'destination': destination
      });
    });
  });

  // ============================================
  // Track Image Gallery Views (if applicable)
  // ============================================

  const galleryImages = document.querySelectorAll('[data-track="image_view"]');

  galleryImages.forEach(image => {
    // Use Intersection Observer to track when image enters viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const imageTitle = image.getAttribute('data-title') || image.getAttribute('alt');

          gtag('event', 'image_view', {
            'event_category': 'engagement',
            'event_label': imageTitle
          });

          console.log('Image view tracked:', imageTitle);

          // Unobserve after tracking once
          observer.unobserve(image);
        }
      });
    }, {
      threshold: 0.5 // Track when 50% of image is visible
    });

    observer.observe(image);
  });

  // ============================================
  // Track Scroll Depth
  // ============================================

  let scrollTracked = {
    '25': false,
    '50': false,
    '75': false,
    '100': false
  };

  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
    );

    ['25', '50', '75', '100'].forEach(depth => {
      if (scrollPercent >= parseInt(depth) && !scrollTracked[depth]) {
        gtag('event', 'scroll_depth', {
          'event_category': 'engagement',
          'event_label': depth + '%'
        });

        scrollTracked[depth] = true;
        console.log('Scroll depth tracked:', depth + '%');
      }
    });
  });
});
