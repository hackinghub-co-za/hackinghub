// Hacking Hub - Mobile Nav Toggle
// Shared by every page (index.html, reviews.html, salaries.html) rather than
// duplicated inline in each - identical behavior across pages is exactly the
// kind of thing that drifts out of sync if it's copy-pasted per file (see:
// reviews.html's nav links themselves, before this session resynced them).

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('primary-nav');
    if (!toggle || !links) return;

    function closeMenu() {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }

    function openMenu() {
        links.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    }

    toggle.addEventListener('click', () => {
        links.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    // Resources dropdown (Roadmaps/Salaries/Quiz/Interview Prep folded
    // under one trigger). Desktop: a floating panel via CSS. Mobile: styled
    // position:static so it just expands inline within the hamburger menu
    // instead - same trigger/toggle logic drives both, only the CSS differs.
    const dropdown = document.querySelector('.nav-dropdown');
    const dropdownTrigger = dropdown?.querySelector('.nav-dropdown-trigger');

    function closeDropdown() {
        dropdown?.classList.remove('is-open');
        dropdownTrigger?.setAttribute('aria-expanded', 'false');
    }

    if (dropdown && dropdownTrigger) {
        dropdownTrigger.addEventListener('click', (e) => {
            // Stop this from also being treated as an "outside click" by
            // the mobile-menu close-on-outside-click handler below.
            e.stopPropagation();
            const isOpen = dropdown.classList.toggle('is-open');
            dropdownTrigger.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.classList.contains('is-open')) return;
            if (dropdown.contains(e.target)) return;
            closeDropdown();
        });
    }

    // Tapping any link (including the CTA button and the dropdown's own
    // links) closes both the mobile menu and the dropdown, so neither sits
    // open over wherever the visitor just navigated to - including a
    // same-page anchor like Roadmaps, which doesn't trigger a full reload.
    links.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
            closeDropdown();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
            closeDropdown();
        }
    });

    document.addEventListener('click', (e) => {
        if (!links.classList.contains('is-open')) return;
        if (links.contains(e.target) || toggle.contains(e.target)) return;
        closeMenu();
        closeDropdown();
    });

    // .nav-links reverts to its always-visible desktop layout above the
    // 768px breakpoint - without this, resizing/rotating past that point
    // while the menu was open would leave it stuck flagged "open" once the
    // viewport later shrinks back down.
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
            closeDropdown();
        }
    });
});
