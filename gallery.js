// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.querySelector('.main-nav');
  
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    mainNav.classList.toggle('active');
  });
  
  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      mainNav.classList.remove('active');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!hamburger.contains(event.target) && !mainNav.contains(event.target)) {
      hamburger.classList.remove('active');
      mainNav.classList.remove('active');
    }
  });
});

// Carousel functionality
let currentCarouselIndex = 0;
let carouselAutoplay = null;
const AUTOPLAY_INTERVAL = 5000; // 5 seconds
const imagesPerView = {
  mobile: 1,
  tablet: 2, 
  desktop: 3
};

function getImagesPerView() {
  if (window.innerWidth <= 768) return imagesPerView.mobile;
  if (window.innerWidth <= 1024) return imagesPerView.tablet;
  return imagesPerView.desktop;
}

function startAutoplay(totalImages) {
  if (carouselAutoplay) clearInterval(carouselAutoplay);
  
  carouselAutoplay = setInterval(() => {
    const itemsPerView = getImagesPerView();
    const maxIndex = totalImages - itemsPerView;
    
    if (currentCarouselIndex < maxIndex) {
      currentCarouselIndex++;
    } else {
      currentCarouselIndex = 0; // Loop back to start
    }
    updateCarousel();
  }, AUTOPLAY_INTERVAL);
}

function stopAutoplay() {
  if (carouselAutoplay) {
    clearInterval(carouselAutoplay);
    carouselAutoplay = null;
  }
}

function restartAutoplay(totalImages) {
  stopAutoplay();
  startAutoplay(totalImages);
}

function updateCarousel() {
  const gallery = document.getElementById('projects-gallery');
  const indicators = document.querySelectorAll('.carousel-indicator');
  const itemsPerView = getImagesPerView();
  
  if (!gallery || gallery.children.length === 0) return;
  
  const containerWidth = gallery.parentElement.offsetWidth;
  const gap = parseInt(getComputedStyle(gallery).gap) || 32;
  let itemWidth;
  
  // Calculate item width based on responsive design
  if (window.innerWidth <= 768) {
    itemWidth = containerWidth; // Mobile: 1 image per view
  } else if (window.innerWidth <= 1024) {
    itemWidth = (containerWidth - gap) / 2; // Tablet: 2 images per view
  } else {
    itemWidth = (containerWidth - (2 * gap)) / 3; // Desktop: 3 images per view
  }
  
  const translateX = currentCarouselIndex * (itemWidth + gap);
  gallery.style.transform = `translateX(-${translateX}px)`;
  
  // Update indicators
  const totalSlides = Math.ceil(gallery.children.length / itemsPerView);
  const activeIndicatorIndex = Math.floor(currentCarouselIndex / itemsPerView);
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === activeIndicatorIndex);
  });
  
  // Update button states
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const maxIndex = gallery.children.length - itemsPerView;
  
  if (prevBtn) {
    prevBtn.disabled = currentCarouselIndex === 0;
    prevBtn.style.opacity = currentCarouselIndex === 0 ? '0.5' : '1';
  }
  if (nextBtn) {
    nextBtn.disabled = currentCarouselIndex >= maxIndex;
    nextBtn.style.opacity = currentCarouselIndex >= maxIndex ? '0.5' : '1';
  }
}

function createCarouselIndicators(totalImages) {
  const indicatorsContainer = document.getElementById('carousel-indicators');
  const itemsPerView = getImagesPerView();
  const totalSlides = Math.ceil(totalImages / itemsPerView);
  
  indicatorsContainer.innerHTML = '';
  
  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement('button');
    indicator.className = 'carousel-indicator';
    indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
    indicator.addEventListener('click', () => {
      currentCarouselIndex = i * itemsPerView;
      updateCarousel();
      restartAutoplay(totalImages); // Restart autoplay after manual navigation
    });
    indicatorsContainer.appendChild(indicator);
  }
}

function initCarousel(totalImages) {
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const itemsPerView = getImagesPerView();
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentCarouselIndex > 0) {
        currentCarouselIndex--;
        updateCarousel();
        restartAutoplay(totalImages); // Restart autoplay after manual navigation
      }
    });
  }
   if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const itemsPerView = getImagesPerView();
      const maxIndex = totalImages - itemsPerView;
      if (currentCarouselIndex < maxIndex) {
        currentCarouselIndex++;
        updateCarousel();
        restartAutoplay(totalImages); // Restart autoplay after manual navigation
      }
    });
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    const newItemsPerView = getImagesPerView();
    const maxIndex = totalImages - newItemsPerView;
    
    // Adjust current index if needed
    if (currentCarouselIndex > maxIndex) {
      currentCarouselIndex = Math.max(0, maxIndex);
    }
    
    createCarouselIndicators(totalImages);
    setTimeout(() => updateCarousel(), 50); // Small delay for proper calculation
  });
  
  // Add keyboard navigation for carousel
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('modal');
    if (modal && modal.style.display === 'flex') return; // Don't interfere with modal navigation
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; // Don't interfere with form inputs
    
    if (e.key === 'ArrowLeft') {
      if (currentCarouselIndex > 0) {
        currentCarouselIndex--;
        updateCarousel();
        restartAutoplay(totalImages); // Restart autoplay after manual navigation
      }
    } else if (e.key === 'ArrowRight') {
      const itemsPerView = getImagesPerView();
      const maxIndex = totalImages - itemsPerView;
      if (currentCarouselIndex < maxIndex) {
        currentCarouselIndex++;
        updateCarousel();
        restartAutoplay(totalImages); // Restart autoplay after manual navigation
      }
    }
  });
  
  // Add hover events to pause/resume autoplay
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
      stopAutoplay();
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
      startAutoplay(totalImages);
    });
  }
  
  // Initialize indicators and carousel position
  createCarouselIndicators(totalImages);
  updateCarousel();
  
  // Start autoplay
  startAutoplay(totalImages);

  // Add touch support for mobile devices with improved swipe detection
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  const gallery = document.getElementById('projects-gallery');
  
  if (carouselWrapper) {
    carouselWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    carouselWrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipeGesture();
    }, { passive: true });
  }
  
  function handleSwipeGesture() {
    const swipeThreshold = 50;
    const verticalThreshold = 30; // Prevent diagonal swipes from triggering
    const horizontalDiff = touchStartX - touchEndX;
    const verticalDiff = Math.abs(touchStartY - touchEndY);
    
    // Only trigger if horizontal movement is significant and vertical movement is minimal
    if (Math.abs(horizontalDiff) > swipeThreshold && verticalDiff < verticalThreshold) {
      if (horizontalDiff > 0) {
        // Swipe left - show next
        const itemsPerView = getImagesPerView();
        const maxIndex = totalImages - itemsPerView;
        if (currentCarouselIndex < maxIndex) {
          currentCarouselIndex++;
          updateCarousel();
          restartAutoplay(totalImages);
        }
      } else {
        // Swipe right - show previous
        if (currentCarouselIndex > 0) {
          currentCarouselIndex--;
          updateCarousel();
          restartAutoplay(totalImages);
        }
      }
    }
  }
}

// Dynamic image loading and modal logic
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.getElementById('modal-close');
  const prevBtn = document.getElementById('modal-prev');
  const nextBtn = document.getElementById('modal-next');
  const projectsGallery = document.getElementById('projects-gallery');
  let projectImages = [];
  let currentIndex = 0;

  // List of images in projects-gallery directory
  const imageFiles = [
    '1.jpeg',
    '2.jpeg',
    '3.jpeg',
    '4.jpeg',
    '5.jpeg',
    '6.jpeg',
    '7.jpeg',
    '8.jpeg',
    '9.jpeg',
    '10.jpeg',
    '11.jpeg',
    '12.jpeg',
    '13.jpeg',
    '14.jpeg',
    '15.jpeg',
    '16.jpeg',
    '17.jpeg',
    '18.jpg',
    '19.jpg',
    '20.jpg',
  ];

  // Dynamically create image elements
  imageFiles.forEach((filename, index) => {
    const img = document.createElement('img');
    img.src = `projects-gallery/${filename}`;
    img.alt = `Stolarstwo budowlane - realizacja ${index + 1} - pergole, wiaty, werandy wykonane przez Adam Falarz w Moszczenicy`;
    img.className = 'project-img';
    img.loading = 'lazy'; // Add lazy loading for performance
    img.addEventListener('click', function() {
      modal.style.display = 'flex';
      showImage(index);
    });
    projectsGallery.appendChild(img);
  });

  // Update projectImages reference after creating elements
  projectImages = document.querySelectorAll('.project-img');

  // Initialize carousel after images are loaded
  setTimeout(() => {
    initCarousel(imageFiles.length);
  }, 100);

  function showImage(index) {
    modalImg.src = projectImages[index].src;
    modalImg.alt = projectImages[index].alt;
    currentIndex = index;
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % projectImages.length;
    showImage(currentIndex);
  }

  function showPrevImage() {
    currentIndex = (currentIndex - 1 + projectImages.length) % projectImages.length;
    showImage(currentIndex);
  }

  closeBtn.onclick = function() {
    modal.style.display = 'none';
    modalImg.src = '';
  };

  prevBtn.onclick = showPrevImage;
  nextBtn.onclick = showNextImage;

  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      modalImg.src = '';
    }
  };

  document.addEventListener('keydown', function(e) {
    if (modal.style.display === 'flex') {
      if (e.key === 'Escape') {
        modal.style.display = 'none';
        modalImg.src = '';
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      }
    }
  });
});
