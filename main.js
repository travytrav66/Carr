/**
 * Carr Winery — main.js
 *
 * Responsibilities:
 *  1. Lucide icon initialisation
 *  2. Sticky nav: transparent → solid cream on scroll
 *  3. Mobile nav drawer open / close / overlay click
 *  4. Commerce7 cart count badge update
 *  5. Smooth anchor scrolling for in-page links
 */

(function () {
    'use strict';

    /* ------------------------------------------------------------------ */
    /* 1. Lucide                                                           */
    /* ------------------------------------------------------------------ */
    function initLucide() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    /* ------------------------------------------------------------------ */
    /* 2. Sticky nav                                                       */
    /* ------------------------------------------------------------------ */
    function initStickyNav() {
        var header = document.querySelector('.js-site-header');
        if (!header) return;

        function update() {
            header.classList.toggle('is-scrolled', window.scrollY > 40);
        }

        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* ------------------------------------------------------------------ */
    /* 3. Mobile nav drawer                                                */
    /* ------------------------------------------------------------------ */
    function initMobileNav() {
        var hamburger = document.querySelector('.js-hamburger');
        var overlay   = document.querySelector('.js-mobile-nav-overlay');
        var closeBtn  = document.querySelector('.js-mobile-nav-close');
        var drawer    = document.getElementById('mobile-nav');

        if (!hamburger || !drawer) return;

        function openNav() {
            drawer.classList.add('is-open');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeNav() {
            drawer.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', openNav);
        if (overlay) overlay.addEventListener('click', closeNav);
        if (closeBtn) closeBtn.addEventListener('click', closeNav);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
                closeNav();
                hamburger.focus();
            }
        });
    }

    /* ------------------------------------------------------------------ */
    /* 4. Commerce7 cart count                                             */
    /* ------------------------------------------------------------------ */
    function initCartCount() {
        var badge = document.querySelector('.js-cart-count');
        if (!badge) return;

        window.addEventListener('c7:cart:updated', function (e) {
            var count = (e.detail && e.detail.itemCount) ? e.detail.itemCount : 0;
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });

        window.addEventListener('c7:ready', function () {
            if (window.C7 && window.C7.cart && window.C7.cart.getCount) {
                var count = window.C7.cart.getCount();
                badge.textContent = count;
                badge.style.display = count > 0 ? 'flex' : 'none';
            }
        });
    }

    /* ------------------------------------------------------------------ */
    /* 5. Smooth anchor scrolling                                          */
    /* ------------------------------------------------------------------ */
    function initSmoothScroll() {
        var drawer = document.getElementById('mobile-nav');

        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link) return;

            var hash = link.getAttribute('href');
            if (hash === '#') return;

            var target = document.querySelector(hash) ||
                         document.querySelector('[data-section="' + hash.slice(1) + '"]');
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });

            if (drawer && drawer.classList.contains('is-open')) {
                drawer.classList.remove('is-open');
                document.body.style.overflow = '';
                var hamburger = document.querySelector('.js-hamburger');
                if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ------------------------------------------------------------------ */
    /* 6. Hero parallax                                                    */
    /* ------------------------------------------------------------------ */
    function initParallax() {
        var img = document.querySelector('.hero__video');
        if (!img) return;

        // Skip on devices that prefer reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var ticking = false;

        function update() {
            var scrollY = window.scrollY;
            // Move the image at 40% of scroll speed (slower = deeper parallax feel)
            img.style.transform = 'translateY(' + (scrollY * 0.4) + 'px)';
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
    }

    /* ------------------------------------------------------------------ */
    /* 7. Entrance animations                                             */
    /* ------------------------------------------------------------------ */
    function initAnimations() {
        // Skip if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // --- Hero: trigger immediately on load ---
        var hero = document.querySelector('[data-section="hero"]');
        if (hero) {
            requestAnimationFrame(function () {
                hero.classList.add('hero-loaded');
            });
        }

        // --- Utility: mark an element as reveal target ---
        function makeReveal(el, cls, delay) {
            el.classList.add(cls);
            if (delay) el.style.setProperty('--reveal-delay', delay);
        }

        // --- Section heads (eyebrow → title → rule → intro) ---
        document.querySelectorAll('.section-head').forEach(function (head) {
            var eyebrow = head.querySelector('.section-head__eyebrow');
            var title   = head.querySelector('.section-head__title');
            var isCenter = head.classList.contains('section-head--center');
            var ruleClass = isCenter ? 'reveal-rule-center' : 'reveal-rule';
            var rule    = head.querySelector('.section-head__rule');
            var intro   = head.querySelector('.section-head__intro');

            if (eyebrow) makeReveal(eyebrow, 'reveal', 0);
            if (title)   makeReveal(title,   'reveal', 100);
            if (rule)    makeReveal(rule,     ruleClass, 200);
            if (intro)   makeReveal(intro,    'reveal', 300);
        });

        // --- Wine cards: staggered ---
        document.querySelectorAll('.wine-card').forEach(function (el, i) {
            makeReveal(el, 'reveal', i * 90);
        });

        // --- Location cards: staggered ---
        document.querySelectorAll('.location-card').forEach(function (el, i) {
            makeReveal(el, 'reveal', i * 120);
        });

        // --- Event cards: staggered ---
        document.querySelectorAll('.event-card').forEach(function (el, i) {
            makeReveal(el, 'reveal', i * 80);
        });

        // --- Featured wines header "all link" ---
        document.querySelectorAll('.featured-wines__all-link, .upcoming-events .featured-wines__all-link').forEach(function (el) {
            makeReveal(el, 'reveal-fade', 350);
        });

        // --- Wine club content blocks ---
        document.querySelectorAll('.wine-club__inner > div').forEach(function (el, i) {
            makeReveal(el, 'reveal', i * 150);
        });

        // --- Pillars ---
        document.querySelectorAll('.pillar').forEach(function (el, i) {
            makeReveal(el, 'reveal', i * 120);
        });

        // --- CTA cards ---
        document.querySelectorAll('.cta-card').forEach(function (el, i) {
            makeReveal(el, 'reveal', i * 100);
        });
        document.querySelectorAll('.final-cta__eyebrow, .final-cta__title, .final-cta__rule, .final-cta__lead').forEach(function (el, i) {
            var cls = el.classList.contains('final-cta__rule') ? 'reveal-rule-center' : 'reveal';
            makeReveal(el, cls, i * 100);
        });

        // --- Private events section ---
        var privImg     = document.querySelector('.private-events__img');
        var privContent = document.querySelector('.private-events__content');
        if (privImg)     makeReveal(privImg,     'reveal', 0);
        if (privContent) makeReveal(privContent, 'reveal', 150);

        // --- Footer grid ---
        document.querySelectorAll('.site-footer__grid > *').forEach(function (el, i) {
            makeReveal(el, 'reveal', i * 80);
        });

        // --- IntersectionObserver: fire .is-visible when element enters viewport ---
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal, .reveal-fade, .reveal-left, .reveal-rule, .reveal-rule-center').forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ------------------------------------------------------------------ */
    /* 8. Page loader                                                      */
    /* ------------------------------------------------------------------ */
    function initPageLoader() {
        var loader = document.getElementById('page-loader');
        if (!loader) return;

        function hide() {
            loader.classList.add('is-hidden');
        }

        // Hide once everything (images etc.) has loaded, with a brief min-display
        var minDelay = 600; // ms — ensures the animation is seen
        var startTime = Date.now();

        function done() {
            var elapsed = Date.now() - startTime;
            var remaining = Math.max(0, minDelay - elapsed);
            setTimeout(hide, remaining);
        }

        if (document.readyState === 'complete') {
            done();
        } else {
            window.addEventListener('load', done);
        }
    }

    /* ------------------------------------------------------------------ */
    /* Init                                                                */
    /* ------------------------------------------------------------------ */
    function init() {
        initPageLoader();
        initLucide();
        initStickyNav();
        initMobileNav();
        initCartCount();
        initSmoothScroll();
        initParallax();
        initAnimations();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
