// Hacking Hub - Shared Nav + Footer
// Single source of truth for the header/footer markup every page repeats -
// previously hand-copied into all 5 HTML files, which is exactly the kind
// of thing that drifts out of sync (reviews.html's own nav went stale -
// a dead link, several missing sections, a typo'd logo class silently
// reproduced via redundant inline styles - before this session caught and
// fixed it by hand, more than once). Removing the manual-sync step
// entirely is the actual fix.
//
// Loaded as a plain, non-deferred <script src="partials.js"> at the exact
// spot each placeholder sits in the page, so injection happens
// synchronously as the parser reaches it - no flash of a missing nav or
// footer, no build step, no framework. nav.js (the toggle/dropdown
// interaction logic) still runs on DOMContentLoaded as before, by which
// point this has already filled in the real markup it operates on.

const SITE_FOOTER_HTML = `
    <div class="container footer-content">
        <div class="footer-left">
            <div class="logo">HACKING <span class="text-lime">HUB</span></div>
            <p class="copy">&copy; 2025 // SECURING_THE_FUTURE</p>
        </div>
        <div class="footer-quote">
            "CONSISTENT EFFORT BEATS OCCASIONAL BURSTS OF MOTIVATION."
        </div>
    </div>
`;

// One entry per page. Every href is written out explicitly rather than
// cleverly derived - this file only has to be right once, but wrong once
// breaks navigation site-wide, so directness beats compactness here.
// isHome controls the one structural difference every ordinary item
// shares (bare "#anchor" vs "index.html#anchor"); reviewsHref is the one
// genuine special case, since reviews.html is a separate destination, not
// just an anchor on the home page.
const PAGE_CONFIG = {
    index: {
        isHome: true,
        navStatusLabel: 'SYSTEM STATUS', navStatusValue: 'ONLINE', navStatusColor: 'text-lime',
        reviewsHref: '#reviews',
        ctaHref: '#pricing', ctaLabel: 'VIEW_PRICING', ctaExternal: false,
        current: null,
    },
    reviews: {
        isHome: false,
        navStatusLabel: 'DATABASE', navStatusValue: 'ACCESSED', navStatusColor: 'text-cyan',
        reviewsHref: 'reviews.html',
        ctaHref: 'https://calendly.com/siya-gladile/30min', ctaLabel: 'INITIATE_UPLINK', ctaExternal: true,
        current: 'reviews',
    },
    salaries: {
        isHome: false,
        navStatusLabel: 'DATABASE', navStatusValue: 'ACCESSED', navStatusColor: 'text-cyan',
        reviewsHref: 'index.html#reviews',
        ctaHref: 'index.html#pricing', ctaLabel: 'VIEW_PRICING', ctaExternal: false,
        current: 'salaries',
    },
    quiz: {
        isHome: false,
        navStatusLabel: 'DATABASE', navStatusValue: 'ACCESSED', navStatusColor: 'text-cyan',
        reviewsHref: 'index.html#reviews',
        ctaHref: 'index.html#pricing', ctaLabel: 'VIEW_PRICING', ctaExternal: false,
        current: 'quiz',
    },
    'interview-prep': {
        isHome: false,
        navStatusLabel: 'DATABASE', navStatusValue: 'ACCESSED', navStatusColor: 'text-cyan',
        reviewsHref: 'index.html#reviews',
        ctaHref: 'index.html#pricing', ctaLabel: 'VIEW_PRICING', ctaExternal: false,
        current: 'interview-prep',
    },
};

function buildNavHtml(pageKey) {
    const cfg = PAGE_CONFIG[pageKey];
    if (!cfg) throw new Error(`Unknown page "${pageKey}" passed to buildNavHtml()`);

    const anchor = (name) => (cfg.isHome ? `#${name}` : `index.html#${name}`);

    const logoInner = `<img src="images/hacking-hub-logo.png" alt="Hacking Hub Logo" class="nav-logo-image">
                <span class="logo-text">HACKING <span class="text-lime">HUB</span></span>`;
    const logo = cfg.isHome
        ? logoInner
        : `<a href="index.html" style="display: flex; align-items: center; gap: 10px; color: inherit;">${logoInner}</a>`;

    const navItem = (key, label, href, extraClass) => {
        const isCurrent = cfg.current === key;
        const classes = ['nav-item', isCurrent ? 'active text-cyan' : '', extraClass || ''].filter(Boolean).join(' ');
        return `<a href="${href}" class="${classes}">${label}</a>`;
    };

    const dropdownLink = (key, label, href) => {
        const isCurrent = cfg.current === key;
        const cls = 'nav-dropdown-link' + (isCurrent ? ' is-current' : '');
        const currentAttr = isCurrent ? ' aria-current="page"' : '';
        return `<a href="${href}" class="${cls}"${currentAttr}>${label}</a>`;
    };

    const dropdownDestinations = ['salaries', 'quiz', 'interview-prep'];
    const triggerClasses = ['nav-item', 'nav-dropdown-trigger', dropdownDestinations.includes(cfg.current) ? 'text-cyan' : ''].filter(Boolean).join(' ');

    const ctaHref = cfg.ctaExternal ? cfg.ctaHref : cfg.ctaHref;
    const ctaTarget = cfg.ctaExternal ? ' target="_blank" rel="noreferrer"' : '';

    return `
        <div class="container nav-container">
            <div class="logo">
                ${logo}
            </div>
            <div class="nav-status">
                <span class="status-dot"></span> ${cfg.navStatusLabel}: <span class="${cfg.navStatusColor}">${cfg.navStatusValue}</span>
            </div>
            <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="primary-nav">
                <i class="fa-solid fa-bars"></i>
            </button>
            <div class="nav-links" id="primary-nav">
                ${navItem('mission', 'MISSION_INTEL', anchor('mission'))}
                <div class="nav-dropdown">
                    <button type="button" class="${triggerClasses}" aria-expanded="false" aria-haspopup="true">
                        RESOURCES <i class="fa-solid fa-chevron-down"></i>
                    </button>
                    <div class="nav-dropdown-menu">
                        ${dropdownLink('roadmaps', 'Roadmaps', anchor('roadmaps'))}
                        ${dropdownLink('salaries', 'Salaries', 'salaries.html')}
                        ${dropdownLink('quiz', 'Quiz', 'quiz.html')}
                        ${dropdownLink('interview-prep', 'Interview Prep', 'interview-prep.html')}
                    </div>
                </div>
                ${navItem('events', 'EVENTS', anchor('events'))}
                ${navItem('reviews', 'REVIEWS', cfg.reviewsHref)}
                ${navItem('interviews', 'INTERVIEWS', anchor('interviews'))}
                ${navItem('faq', 'FAQ', anchor('faq'))}
                <a href="${ctaHref}" class="btn btn-sm btn-cyan"${ctaTarget}>${cfg.ctaLabel}</a>
            </div>
        </div>
    `;
}

function renderNav(pageKey) {
    const el = document.getElementById('site-nav');
    if (!el) return;
    el.innerHTML = buildNavHtml(pageKey);
}

function renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    el.innerHTML = SITE_FOOTER_HTML;
}
