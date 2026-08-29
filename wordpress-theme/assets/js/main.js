/**
 * LaxRee Amenities — Main JavaScript
 */
(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // STICKY HEADER
    // ═══════════════════════════════════════════════════════════════
    var header = document.getElementById('siteHeader');
    if (header) {
        var lastScroll = 0;
        window.addEventListener('scroll', function() {
            var scroll = window.pageYOffset;
            if (scroll > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = scroll;
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // MOBILE MENU TOGGLE
    // ═══════════════════════════════════════════════════════════════
    var menuToggle = document.getElementById('menuToggle');
    var mainNav = document.getElementById('mainNav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('open');
        });
        // Close on link click
        mainNav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mainNav.classList.remove('open');
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ═══════════════════════════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var target = this.getAttribute('href');
            if (target === '#' || target === '#0') return;
            var el = document.querySelector(target);
            if (el) {
                e.preventDefault();
                var offset = 80;
                var top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // AJAX LEAD FORM
    // ═══════════════════════════════════════════════════════════════
    var leadForms = document.querySelectorAll('.laxree-lead-form');
    leadForms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var formData = new FormData(form);
            var data = {};
            formData.forEach(function(value, key) { data[key] = value; });

            var btn = form.querySelector('button[type="submit"]');
            var originalText = btn ? btn.innerHTML : '';
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = 'Submitting...';
            }

            fetch(laxree_ajax.ajax_url + '?action=laxree_lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'nonce=' + laxree_ajax.nonce + '&' + new URLSearchParams(data).toString()
            })
            .then(function(r) { return r.json(); })
            .then(function(res) {
                if (res.success) {
                    form.reset();
                    if (btn) btn.innerHTML = '✓ Submitted!';
                    setTimeout(function() {
                        if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
                    }, 3000);
                } else {
                    alert(res.data.message || 'Something went wrong');
                    if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
                }
            })
            .catch(function() {
                alert('Network error. Please try again or call us.');
                if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
            });
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // SCROLL REVEAL ANIMATIONS
    // ═══════════════════════════════════════════════════════════════
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        document.querySelectorAll('[data-reveal]').forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // CART COUNT UPDATE (WooCommerce)
    // ═══════════════════════════════════════════════════════════════
    if (typeof jQuery !== 'undefined') {
        jQuery(document.body).on('added_to_cart removed_from_cart', function() {
            jQuery.get(window.location.href + ' .cart-count', function(data) {
                var count = jQuery(data).text();
                jQuery('.cart-count').text(count);
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZE LUCIDE ICONS
    // ═══════════════════════════════════════════════════════════════
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

})();
