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

    // Tapping any link (including the CTA button) closes the menu, so it
    // never sits open over the section the visitor just navigated to.
    links.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', (e) => {
        if (!links.classList.contains('is-open')) return;
        if (links.contains(e.target) || toggle.contains(e.target)) return;
        closeMenu();
    });

    // .nav-links reverts to its always-visible desktop layout above the
    // 768px breakpoint - without this, resizing/rotating past that point
    // while the menu was open would leave it stuck flagged "open" once the
    // viewport later shrinks back down.
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });
});
