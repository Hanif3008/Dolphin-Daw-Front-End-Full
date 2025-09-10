document.addEventListener('DOMContentLoaded', function() {
  // Hamburger menu functionality
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const hamburgerItems = document.querySelector('.hamburger-items');
  const overlay = document.querySelector('.overlay');
  const closeBtn = document.querySelector('.close-btn');
  
  // Function to open hamburger menu
  function openMenu() {
    // Show elements first without opacity
    hamburgerItems.style.display = 'flex';
    overlay.style.display = 'block';
    
    // Force browser reflow to ensure transition works
    void hamburgerItems.offsetWidth;
    
    // Then add active class for transitions
    hamburgerItems.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
  }
  
  // Function to close hamburger menu
  function closeMenu() {
    // Remove active class first to trigger transitions
    hamburgerItems.classList.remove('active');
    overlay.classList.remove('active');
    
    // Change icon back to menu-outline
    const menuIcon = hamburgerMenu.querySelector('ion-icon');
    menuIcon.setAttribute('name', 'menu-outline');
    
    // Wait for transition to complete before hiding elements
    setTimeout(function() {
      hamburgerItems.style.display = 'none';
      overlay.style.display = 'none';
    }, 300); // Match transition duration (0.3s = 300ms)
    
    document.body.style.overflow = ''; // Re-enable scrolling
  }
  
  // Toggle menu when clicking hamburger button
  hamburgerMenu.addEventListener('click', function() {
    const menuIcon = hamburgerMenu.querySelector('ion-icon');
    
    if (hamburgerItems.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
      menuIcon.setAttribute('name', 'close-outline');
    }
  });
  
  // Close menu when clicking close button
  closeBtn.addEventListener('click', closeMenu);
  
  // Close menu when clicking overlay
  overlay.addEventListener('click', closeMenu);
  
  // Close hamburger menu when clicking outside (fallback)
  document.addEventListener('click', function(event) {
    if (!hamburgerItems.contains(event.target) && !hamburgerMenu.contains(event.target) && hamburgerItems.classList.contains('active')) {
      closeMenu();
    }
  });
    
    // Kode berikut tidak diperlukan lagi karena sudah diimplementasikan di atas
    /*if (hamburgerButton && hamburgerItems) {
        hamburgerButton.addEventListener('click', function() {
            hamburgerItems.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburgerItems.contains(event.target) && !hamburgerButton.contains(event.target)) {
                hamburgerItems.classList.remove('active');
            }
        });
    }*/
    const slider = document.getElementById('reviewSlider');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const dotsContainer = document.getElementById('sliderDots');
    
    // Clone items untuk infinite loop yang sempurna
    const originalItems = slider.querySelectorAll('.review-item');
    const itemCount = originalItems.length;
    
    // Clone items untuk efek infinite loop
    if (itemCount > 0) {
        // Clone semua item dan tambahkan ke awal dan akhir
        for (let i = 0; i < itemCount; i++) {
            const clone = originalItems[i].cloneNode(true);
            slider.appendChild(clone);
        }
        
        for (let i = itemCount - 1; i >= 0; i--) {
            const clone = originalItems[i].cloneNode(true);
            slider.insertBefore(clone, slider.firstChild);
        }
    }
    
    const items = slider.querySelectorAll('.review-item');
    let currentPosition = itemCount; // Mulai dari item asli pertama
    
    // Variabel untuk drag
    let isDragging = false;
    let startPosition = 0;
    let startX = 0;
    let currentTranslate = 0;
    let animationID = 0;
    
    // Hitung berapa banyak item yang terlihat sekaligus
    function getVisibleItemCount() {
        const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(slider).gap);
        const containerWidth = slider.parentElement.offsetWidth;
        // Pastikan minimal 1 item terlihat untuk mencegah pembagian dengan nol
        return Math.max(1, Math.floor(containerWidth / itemWidth));
    }
    
    let visibleItems = getVisibleItemCount();
    
    // Mendapatkan item width untuk kalkulasi
    function getItemWidth() {
        return items[0].offsetWidth + parseInt(getComputedStyle(slider).gap);
    }
    
    // Buat dots berdasarkan jumlah halaman dari item asli
    function createDots() {
        dotsContainer.innerHTML = '';
        // Hanya gunakan jumlah item asli untuk menghitung jumlah halaman
        const pageCount = Math.ceil(itemCount / visibleItems);
        
        for (let i = 0; i < pageCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                // Pindah ke halaman yang sesuai dalam set item asli
                goToPage(i);
            });
            
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update dots aktif
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.dot');
        // Hitung posisi relatif untuk dots (mengabaikan item yang diclone)
        let relativePosition = currentPosition;
        
        // Normalisasi posisi relatif ke range item asli
        if (relativePosition < itemCount) {
            relativePosition = relativePosition % itemCount + itemCount;
        } else if (relativePosition >= itemCount * 2) {
            relativePosition = (relativePosition - itemCount * 2) % itemCount + itemCount;
        }
        
        // Hitung index aktif berdasarkan posisi relatif
        const normalizedPosition = relativePosition - itemCount;
        const activeIndex = Math.floor(normalizedPosition / visibleItems);
        
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Pergi ke halaman tertentu
    function goToPage(pageIndex) {
        // Pindah ke posisi yang sesuai dalam set item asli (bukan clone)
        currentPosition = itemCount + Math.min(pageIndex * visibleItems, itemCount - visibleItems);
        updateSlider();
    }
    
    // Update posisi slider dan status tombol dengan infinite loop
    function updateSlider() {
        // Gunakan requestAnimationFrame untuk optimasi performa
        cancelAnimationFrame(animationID);
        animationID = requestAnimationFrame(() => {
            const itemWidth = getItemWidth();
            
            // Update posisi slider
            currentTranslate = -currentPosition * itemWidth;
            slider.style.transform = `translateX(${currentTranslate}px)`;
            
            // Implementasi infinite loop dengan snap back
            // Jika sudah mencapai clone terakhir, snap back ke item asli
            if (currentPosition <= 0) {
                // Snap ke akhir set asli setelah transisi
                setTimeout(() => {
                    slider.style.transition = 'none';
                    currentPosition = itemCount;
                    currentTranslate = -currentPosition * itemWidth;
                    slider.style.transform = `translateX(${currentTranslate}px)`;
                    
                    // Restore transition
                    setTimeout(() => {
                        slider.style.transition = 'transform 0.3s ease';
                    }, 10);
                }, 300);
            } else if (currentPosition >= itemCount * 2) {
                // Snap ke awal set asli setelah transisi
                setTimeout(() => {
                    slider.style.transition = 'none';
                    currentPosition = itemCount;
                    currentTranslate = -currentPosition * itemWidth;
                    slider.style.transform = `translateX(${currentTranslate}px)`;
                    
                    // Restore transition
                    setTimeout(() => {
                        slider.style.transition = 'transform 0.3s ease';
                    }, 10);
                }, 300);
            }
            
            // Update dots berdasarkan posisi relatif
            updateDots();
        });
    }
    
    // Event listeners untuk tombol
    prevButton.addEventListener('click', () => {
        currentPosition--;
        updateSlider();
    });
    
    nextButton.addEventListener('click', () => {
        currentPosition++;
        updateSlider();
    });
    
    // Fungsi untuk drag event
    function touchStart(event) {
        // Cek ukuran layar, jika terlalu kecil, batasi fungsionalitas drag
        if (window.innerWidth < 380) {
            // Pada layar sangat kecil, batasi interaksi drag untuk meningkatkan performa
            // Hanya izinkan drag jika tidak ada animasi yang sedang berjalan
            if (animationID) {
                cancelAnimationFrame(animationID);
                animationID = 0;
            }
        }
        
        isDragging = true;
        startPosition = currentPosition;
        startX = getPositionX(event);
        cancelAnimationFrame(animationID);
        
        slider.classList.add('grabbing');
    }
    
    function touchMove(event) {
        if (isDragging) {
            // Throttle pada layar kecil untuk meningkatkan performa
            if (window.innerWidth < 380) {
                // Jika sudah ada animasi yang berjalan, jangan buat yang baru
                if (animationID) return;
            }
            
            const currentX = getPositionX(event);
            const diff = currentX - startX;
            const itemWidth = getItemWidth();
            
            // Hitung posisi berdasarkan drag dengan batasan performa
            // Gunakan requestAnimationFrame untuk optimasi performa
            cancelAnimationFrame(animationID);
            animationID = requestAnimationFrame(() => {
                currentTranslate = -currentPosition * itemWidth + diff;
                slider.style.transform = `translateX(${currentTranslate}px)`;
                
                // Reset animationID setelah frame dirender pada layar kecil
                if (window.innerWidth < 380) {
                    setTimeout(() => {
                        animationID = 0;
                    }, 50); // Throttle ke 20fps pada layar kecil
                }
            });
        }
    }
    
    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        // Pada layar kecil, gunakan threshold yang lebih besar untuk mengurangi sensitivitas
        const isSmallScreen = window.innerWidth < 380;
        const itemWidth = getItemWidth();
        const movedBy = currentTranslate + currentPosition * itemWidth;
        
        // Jika digeser lebih dari threshold, pindah ke item berikutnya
        // Gunakan threshold yang lebih besar pada layar kecil
        const threshold = isSmallScreen ? itemWidth / 2 : itemWidth / 3;
        const pixelThreshold = isSmallScreen ? 150 : 100;
        
        if (movedBy < -threshold || movedBy < -pixelThreshold) {
            currentPosition++;
        } else if (movedBy > threshold || movedBy > pixelThreshold) {
            currentPosition--;
        }
        
        // Pada layar kecil, batasi frekuensi update
        if (isSmallScreen) {
            // Batalkan animasi yang sedang berjalan
            cancelAnimationFrame(animationID);
            // Tunggu sedikit sebelum memperbarui slider untuk mencegah lag
            setTimeout(() => {
                updateSlider();
            }, 50);
        } else {
            updateSlider();
        }
        
        slider.classList.remove('grabbing');
    }
    
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    // Handle resize dengan debounce untuk optimasi performa
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Batalkan timeout sebelumnya
        clearTimeout(resizeTimeout);
        
        // Buat timeout baru untuk debounce
        resizeTimeout = setTimeout(() => {
            const newVisibleItems = getVisibleItemCount();
            
            if (newVisibleItems !== visibleItems) {
                visibleItems = newVisibleItems;
                createDots();
                updateSlider();
            }
        }, 150); // Tunggu 150ms setelah resize selesai
    });
    
    // Event listeners untuk drag
    slider.addEventListener('mousedown', touchStart);
    slider.addEventListener('touchstart', touchStart);
    
    slider.addEventListener('mousemove', touchMove);
    slider.addEventListener('touchmove', touchMove);
    
    slider.addEventListener('mouseup', touchEnd);
    slider.addEventListener('touchend', touchEnd);
    slider.addEventListener('mouseleave', touchEnd);
    
    // Mencegah context menu saat long press di mobile
    slider.addEventListener('contextmenu', e => e.preventDefault());
    
    // Inisialisasi
    createDots();
    
    // Set posisi awal tanpa animasi
    slider.style.transition = 'none';
    updateSlider();
    
    // Restore transition setelah posisi awal diatur
    setTimeout(() => {
        slider.style.transition = 'transform 0.3s ease';
    }, 10);
    
    // Tambahkan CSS untuk cursor
    slider.style.cursor = 'grab';
    
    // Optimasi video untuk layar kecil
    function optimizeVideosForMobile() {
        const videos = document.querySelectorAll('video');
        const isMobile = window.innerWidth <= 360;
        
        videos.forEach(video => {
            // Ubah kualitas video pada perangkat mobile
            if (isMobile) {
                // Nonaktifkan autoplay pada mobile
                video.autoplay = false;
                
                // Hanya muat video ketika dalam viewport
                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                // Jika video terlihat, siapkan untuk diputar
                                entry.target.load();
                                observer.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.1 });
                    
                    observer.observe(video);
                }
            }
        });
    }
    
    // Panggil fungsi optimasi video
    optimizeVideosForMobile();
    
    // Panggil ulang saat resize window
    window.addEventListener('resize', optimizeVideosForMobile);
});