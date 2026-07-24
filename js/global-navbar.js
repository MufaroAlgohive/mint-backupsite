
document.addEventListener('DOMContentLoaded', () => {
    fetch('navbar.html')
        .then(response => response.text())
        .then(html => {
            const placeholder = document.getElementById('main-header-placeholder');
            if (placeholder) {
                placeholder.innerHTML = html;

                // ── Colour switching logic ──────────────────────────────────────
                // Pages declare their hero theme via data-nav-theme on <body>:
                //   "dark"  → hero bg is dark/image → navbar starts with white text
                //   "light" → hero bg is white/light → navbar starts with dark text immediately
                const theme = document.body.dataset.navTheme || 'dark';
                const header = () => document.getElementById('main-header');

                if (theme === 'light') {
                    // On light-bg pages: start header-dark immediately (black text)
                    const h = header();
                    if (h) h.classList.add('header-dark');
                }

                let lastScroll = window.scrollY;
                window.addEventListener('scroll', () => {
                    const currentScroll = window.scrollY;
                    const h = header();
                    if (!h) return;

                    // Hide/show on scroll direction
                    if (currentScroll > lastScroll && currentScroll > 100) {
                        h.classList.add('header-hidden');
                    } else {
                        h.classList.remove('header-hidden');
                    }

                    // Dark (white bg, black text) vs transparent (dark bg, white text)
                    if (theme === 'light') {
                        // Always keep dark on light-bg pages
                        h.classList.add('header-dark');
                    } else {
                        // Dark pages: switch to white bg after scrolling past hero
                        if (currentScroll > 80) {
                            h.classList.add('header-dark');
                        } else {
                            h.classList.remove('header-dark');
                        }
                    }

                    lastScroll = currentScroll;
                });

                // ── Re-evaluate <script> tags from injected HTML ────────────────
                const scripts = placeholder.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    newScript.textContent = oldScript.textContent;
                    document.body.appendChild(newScript);
                });
            }
        });

    // ── Mobile menu via event delegation ───────────────────────────────────────
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#mobile-menu-btn');
        const closeBtn = e.target.closest('#mobile-menu-close');
        const menu = document.getElementById('mobile-menu');
        if (menu) {
            if (btn) {
                menu.classList.remove('hidden');
                menu.classList.add('flex');
            } else if (closeBtn) {
                menu.classList.add('hidden');
                menu.classList.remove('flex');
            }
        }

        // ── Invest carousel panel navigation (data-invest-panel) ───────────────
        const investLink = e.target.closest('[data-invest-panel]');
        if (investLink) {
            const panelIndex = parseInt(investLink.dataset.investPanel, 10);
            const isOnIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

            if (isOnIndex) {
                // Already on index — scroll to section then to panel
                e.preventDefault();
                const section = document.getElementById('investSection');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        const container = document.getElementById('investHorizontalContainer');
                        if (container && container.children[panelIndex]) {
                            container.scrollTo({ left: container.children[panelIndex].offsetLeft, behavior: 'smooth' });
                        }
                    }, 400);
                }
            } else {
                // Navigate to index with a query param so index.html can pick it up
                e.preventDefault();
                window.location.href = `index.html?invest-panel=${panelIndex}#investSection`;
            }
        }

        // ── Asset tab navigation (data-asset-tab) ──────────────────────────────
        const assetTabLink = e.target.closest('[data-asset-tab]');
        if (assetTabLink) {
            const tabName = assetTabLink.dataset.assetTab;
            const isOnIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

            if (isOnIndex) {
                e.preventDefault();
                const section = document.getElementById('assetDeploymentSection');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        if (typeof switchTab === 'function') switchTab(tabName);
                    }, 400);
                }
            } else {
                e.preventDefault();
                window.location.href = `index.html?asset-tab=${tabName}#assetDeploymentSection`;
            }
        }
    });

    // ── On index.html: handle ?invest-panel=N query param on load ──────────────
    const params = new URLSearchParams(window.location.search);
    const panelParam = params.get('invest-panel');
    if (panelParam !== null) {
        const panelIndex = parseInt(panelParam, 10);
        setTimeout(() => {
            const section = document.getElementById('investSection');
            const container = document.getElementById('investHorizontalContainer');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
            if (container && container.children[panelIndex]) {
                setTimeout(() => {
                    container.scrollTo({ left: container.children[panelIndex].offsetLeft, behavior: 'smooth' });
                }, 500);
            }
        }, 800);
    }

    // ── On index.html: handle ?asset-tab=name query param on load ──────────────
    const assetTabParam = params.get('asset-tab');
    if (assetTabParam) {
        setTimeout(() => {
            const section = document.getElementById('assetDeploymentSection');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    if (typeof switchTab === 'function') switchTab(assetTabParam);
                }, 500);
            }
        }, 800);
    }
});
