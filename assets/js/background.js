// Enhanced Background Slideshow Logic for 2History
// Handles background slides with cinematic fade-to-black transitions

document.addEventListener('DOMContentLoaded', function () {
    console.log('Initializing background slideshow...');

    // 1. Define Background Images
    const images = [
        'assets/images/backgrounds/battle_medieval.jpg',
        'assets/images/backgrounds/battle_cavalry.jpg',
        'assets/images/backgrounds/battle_artillery.jpg',
        'assets/images/backgrounds/battle_wwi.jpg'
    ];

    // Create container elements if they don't exist
    let slider = document.querySelector('.bg-slider');
    if (!slider) {
        slider = document.createElement('div');
        slider.className = 'bg-slider';
        document.body.prepend(slider); // Prepend so it's behind everything
    }

    // Add dark overlay for fade-to-black transition
    let darkOverlay = document.querySelector('.bg-dark-overlay');
    if (!darkOverlay) {
        darkOverlay = document.createElement('div');
        darkOverlay.className = 'bg-dark-overlay';
        slider.after(darkOverlay); // Place after slider
    }

    // Add static vignette overlay
    let vignette = document.querySelector('.bg-vignette');
    if (!vignette) {
        vignette = document.createElement('div');
        vignette.className = 'bg-vignette';
        darkOverlay.after(vignette); // Place after dark overlay
    }

    // Create slides
    const slides = [];
    images.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.className = 'bg-slide';
        slide.style.backgroundImage = `url('${src}')`;
        if (index === 0) slide.classList.add('active');
        slider.appendChild(slide);
        slides.push(slide);
    });

    // Slideshow Logic
    let currentSlide = 0;
    const SLIDE_INTERVAL = 8000;    // Show each slide for 8 seconds
    const DARKEN_DURATION = 1200;   // Fade to dark takes 1.2s
    const SLIDE_SWITCH_DELAY = 400; // Wait 0.4s fully dark before switching

    setInterval(() => {
        // Step 1: Fade to dark
        darkOverlay.classList.add('active');

        // Step 2: After darkening, switch slide
        setTimeout(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');

            // Step 3: After a short pause in darkness, fade back in
            setTimeout(() => {
                darkOverlay.classList.remove('active');
            }, SLIDE_SWITCH_DELAY);
        }, DARKEN_DURATION);
    }, SLIDE_INTERVAL);
});
