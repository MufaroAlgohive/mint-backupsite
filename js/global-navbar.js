
document.addEventListener('DOMContentLoaded', () => {
    fetch('navbar.html')
        .then(response => response.text())
        .then(html => {
            const placeholder = document.getElementById('main-header-placeholder');
            if (placeholder) {
                placeholder.innerHTML = html;
                
                
                // Global scroll and theme logic
                const isIndex = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
                if (!isIndex) {
                    placeholder.querySelector('#main-header').classList.add('header-dark');
                }
                
                let lastScroll = window.scrollY;
                window.addEventListener('scroll', () => {
                    const currentScroll = window.scrollY;
                    const header = document.getElementById('main-header');
                    if (header) {
                        if (currentScroll > lastScroll && currentScroll > 100) {
                            header.classList.add('header-hidden');
                        } else {
                            header.classList.remove('header-hidden');
                        }
                    }
                    lastScroll = currentScroll;
                });

                // Re-evaluate script tags from the injected HTML so functions are defined
                const scripts = placeholder.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    newScript.textContent = oldScript.textContent;
                    document.body.appendChild(newScript);
                });
            }
        });
        
    // Handle mobile menu clicks using event delegation
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#mobile-menu-btn');
        const closeBtn = e.target.closest('#mobile-menu-close');
        
        if (btn || closeBtn) {
            const menu = document.getElementById('mobile-menu');
            if (menu) {
                menu.classList.toggle('hidden');
                menu.classList.toggle('flex');
            }
        }
    });
});
