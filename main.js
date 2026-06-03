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
    /* Init                                                                */
    /* ------------------------------------------------------------------ */
    function init() {
        initLucide();
        initStickyNav();
        initMobileNav();
        initCartCount();
        initSmoothScroll();
        initParallax();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
