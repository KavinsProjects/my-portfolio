 document.addEventListener('DOMContentLoaded', function() {
            // --- Window Management ---
            const windows = document.querySelectorAll('.page-window');
            let highestZ = windows.length;
            
            // --- Time and Location ---
            function updateTime() {
                const locationTimeEl = document.getElementById('location-time');
                if (!locationTimeEl) return;

                const location = "Coimbatore, Tamilnadu, India";

                const dateOptions = {
                    timeZone: 'Asia/Kolkata',
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                };
                const timeOptions = {
                    timeZone: 'Asia/Kolkata',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false
                };
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', dateOptions);
                const timeStr = now.toLocaleTimeString('en-US', timeOptions);

                locationTimeEl.innerHTML = `${location} &nbsp;|&nbsp; ${dateStr} ${timeStr}`;
            }

            // --- WINDOW DRAGGING & FOCUS ---
            function makeDraggable(windowEl) {
                const header = windowEl.querySelector('.window-header');
                if (!header) return;

                let isDragging = false;
                let offsetX, offsetY;

                header.addEventListener('mousedown', (e) => {
                    // This check prevents dragging on mobile where windows are stacked
                    if (window.innerWidth <= 768) return;

                    isDragging = true;
                    offsetX = e.clientX - windowEl.offsetLeft;
                    offsetY = e.clientY - windowEl.offsetTop;
                    header.style.cursor = 'grabbing';
                    
                    focusWindow(windowEl.id);
                });

                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    
                    let newX = e.clientX - offsetX;
                    let newY = e.clientY - offsetY;
                    
                    const boundary = 20; 
                    const menuBarHeight = 56;
                    newX = Math.max(boundary - windowEl.offsetWidth, Math.min(newX, window.innerWidth - boundary));
                    newY = Math.max(menuBarHeight, Math.min(newY, window.innerHeight - boundary));

                    windowEl.style.left = `${newX}px`;
                    windowEl.style.top = `${newY}px`;
                });

                document.addEventListener('mouseup', () => {
                    isDragging = false;
                    if (window.innerWidth > 768) {
                       header.style.cursor = 'grab';
                    }
                });
            }

            function focusWindow(windowId) {
                const windowEl = document.getElementById(windowId);
                if (!windowEl) return;
                
                highestZ++;
                windowEl.style.zIndex = highestZ;
            }

            windows.forEach((win) => {
                makeDraggable(win);
                win.addEventListener('mousedown', () => focusWindow(win.id), true); 
                
                // Window Controls
                const closeBtn = win.querySelector('.control-btn.close');
                if(closeBtn) {
                    closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if(window.innerWidth > 768) {
                           win.style.display = 'none';
                        }
                    });
                }
            });
            
            function openWindow(windowId) {
                const windowEl = document.getElementById(windowId);
                if (windowEl) {
                    if (window.innerWidth <= 768) {
                        windowEl.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        if (windowEl.style.display === 'none') {
                           windowEl.style.display = 'flex';
                        }
                        focusWindow(windowId);
                    }
                }
            }

            // --- DOCK LOGIC ---
            const dockItems = document.querySelectorAll('.dock-item');
            dockItems.forEach(item => {
                item.addEventListener('click', () => {
                    openWindow(item.dataset.window);
                });
            });

            // --- DESKTOP ICON LOGIC ---
            const desktopIcons = document.querySelectorAll('.desktop-icon-btn');
            desktopIcons.forEach(icon => {
                if (icon.dataset.window) {
                    icon.addEventListener('click', (e) => {
                        e.preventDefault();
                        openWindow(icon.dataset.window);
                    });
                }
            });

            // --- INITIALIZATION ---
            updateTime();
            setInterval(updateTime, 1000);
            
            // Set initial z-index to avoid overlap issues
            document.getElementById('projects').style.zIndex = 2;
            document.getElementById('about').style.zIndex = 3;
            document.getElementById('contact').style.zIndex = 4;
            document.getElementById('home').style.zIndex = 5;
            highestZ = 5;

        });