
// Wait for the document to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Scroll animation functionality
    const scrollElements = document.querySelectorAll('.slide-in, .slide-in-left, .slide-in-right');
    
    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('appear');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('appear');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 85)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };
    
    // Initialize scroll animation check
    handleScrollAnimation();
    
    // Add scroll event listener
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Mobile menu toggle functionality
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const menuIcon = document.querySelector('.menu-icon');
    
    if (dropdownBtn && dropdownContent) {
        // Toggle dropdown with animation on button click
        dropdownBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            const isDisplayed = dropdownContent.style.display === 'block';
            
            // Toggle menu icon animation if it exists
            if (menuIcon) {
                if (isDisplayed) {
                    menuIcon.classList.remove('active');
                } else {
                    menuIcon.classList.add('active');
                }
            }
            
            dropdownContent.style.display = isDisplayed ? 'none' : 'block';
        });
        
        // Close dropdown when clicking a link
        const dropdownLinks = dropdownContent.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Check for mobile view
                if (window.innerWidth < 992) {
                    setTimeout(() => {
                        dropdownContent.style.display = 'none';
                        if (menuIcon) menuIcon.classList.remove('active');
                    }, 100);
                }
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.matches('.dropdown-btn') && !dropdownContent.contains(event.target)) {
                dropdownContent.style.display = 'none';
                if (menuIcon) menuIcon.classList.remove('active');
            }
        });
    }
    
    // Handle window resize to fix mobile/desktop menu transitions
    window.addEventListener('resize', function() {
        if (dropdownContent) {
            // For mobile-desktop transitions, reset style but don't hide dropdown
            if (window.innerWidth >= 992) {
                // Don't reset display property on desktop - allow hover to control it
                if (menuIcon) menuIcon.classList.remove('active');
            } else {
                // On mobile, hide the dropdown when resizing down
                dropdownContent.style.display = 'none';
                if (menuIcon) menuIcon.classList.remove('active');
            }
        }
    });
    
    const expandButtons = document.querySelectorAll('.btn-expand');

    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contentSection = this.closest('.content-expandable');
            contentSection.classList.toggle('content-expanded');

            if (contentSection.classList.contains('content-expanded')) {
                this.textContent = 'Read Less';
            } else {
                this.textContent = 'Read More';
            }
        });
    });   
    
    // Handle mentor expand/collapse buttons
    const mentorExpandButtons = document.querySelectorAll('.mentor-expand');
    
    mentorExpandButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Look for mentor-content instead of mentor-info
            const mentorContent = this.closest('.mentor-content');
            if (!mentorContent) {
                console.error('mentor-content not found');
                return;
            }
            
            const detailsDiv = mentorContent.querySelector('.mentor-details');
            if (!detailsDiv) {
                console.error('mentor-details not found');
                return;
            }
            
            // Toggle expanded class on the mentor content
            mentorContent.classList.toggle('mentor-expanded');
            
            if (mentorContent.classList.contains('mentor-expanded')) {
                this.textContent = 'Read Less';
                detailsDiv.style.maxHeight = detailsDiv.scrollHeight + 'px';
                detailsDiv.style.opacity = '1';
            } else {
                this.textContent = 'Read More';
                detailsDiv.style.maxHeight = '0';
                detailsDiv.style.opacity = '0';
            }
        });
    });
    // mentor ends

    // Banner text rotation
    const bannerTexts = document.querySelectorAll(".banner-text");
    let currentTextIndex = 0;
    
    function rotateBannerText() {
        // Hide all texts
        bannerTexts.forEach(text => {
            text.style.opacity = "0";
            text.style.zIndex = "1";
        });
        
        // Show current text
        bannerTexts[currentTextIndex].style.opacity = "1";
        bannerTexts[currentTextIndex].style.zIndex = "2";
        
        // Increment index for next rotation
        currentTextIndex = (currentTextIndex + 1) % bannerTexts.length;
    }
    
    // Initialize banner text rotation
    if (bannerTexts.length > 0) {
        // Set initial state - first text visible, others hidden
        bannerTexts.forEach((text, i) => {
            if (i === 0) {
                text.style.opacity = "1";
                text.style.zIndex = "2";
            } else {
                text.style.opacity = "0";
                text.style.zIndex = "1";
            }
        });
        
        // Start rotation after 3 seconds
        setInterval(rotateBannerText, 5000); // Increased to 5 seconds for longer quotes
    }    
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 60; // Adjust based on header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Updated Services Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(document.querySelectorAll('.service-card'));
    const dots = Array.from(document.querySelectorAll('.carousel-dots .dot'));
    const nextButton = document.querySelector('.next-arrow');
    const prevButton = document.querySelector('.prev-arrow');
    
    if (!track || !nextButton || !prevButton) return;
    
    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginLeft) * 2;
    let autoplayInterval;
    let isPaused = false;
    
    // Function to update carousel on window resize
    function updateCarouselDimensions() {
        cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginLeft) * 2;
        goToSlide(currentIndex);
    }
    
    // Initialize carousel
    function initCarousel() {
        updateCarouselDimensions();
        
        // Highlight the active card
        updateActiveCard();
        
        // Event listeners for controls
        nextButton.addEventListener('click', function() {
            pauseAutoplay();
            nextSlide();
        });
        
        prevButton.addEventListener('click', function() {
            pauseAutoplay();
            prevSlide();
        });
        
        // Event listeners for dots
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                pauseAutoplay();
                const slideIndex = parseInt(this.getAttribute('data-index'));
                goToSlide(slideIndex);
            });
        });
        
        // Listen for window resize
        window.addEventListener('resize', function() {
            updateCarouselDimensions();
        });
        
        // Start autoplay
        startAutoplay();
        
        // Pause autoplay on hover
        track.addEventListener('mouseenter', pauseAutoplay);
        track.addEventListener('mouseleave', startAutoplay);
    }
    
    function updateActiveCard() {
        // Remove active class from all cards
        cards.forEach(card => card.classList.remove('active'));
        // Add active class to current card
        cards[currentIndex].classList.add('active');
    }
    
    function goToSlide(index) {
        // Handle looping for index
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;
        
        currentIndex = index;
        
        // Update track position
        track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
        
        // Update active card
        updateActiveCard();
        
        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    function startAutoplay() {
        if (!isPaused) {
            clearInterval(autoplayInterval);
            autoplayInterval = setInterval(function() {
                nextSlide();
            }, 2000); // Auto slide every 2 seconds
        }
    }
    
    function pauseAutoplay() {
        isPaused = true;
        clearInterval(autoplayInterval);
        
        // Resume autoplay after 5 seconds of inactivity
        setTimeout(function() {
            isPaused = false;
            startAutoplay();
        }, 5000);
    }
    
    // Add touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        pauseAutoplay();
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left, go next
            nextSlide();
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right, go prev
            prevSlide();
        }
    }
    
    // Initialize the carousel
    initCarousel();
});

// service ends

// map button
document.addEventListener('DOMContentLoaded', function() {
            const mapButton = document.getElementById('mapButton');
            mapButton.addEventListener('click', function() {
            });
        });

// Testimonials Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements for the testimonials section
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const nextButton = document.querySelector('.testimonial-next');
    const prevButton = document.querySelector('.testimonial-prev');
    
    // Variables for testimonial carousel
    let currentTestimonialIndex = 0;
    let testimonialItemWidth = testimonialItems.length > 0 ? testimonialItems[0].offsetWidth : 0;
    let autoplayInterval;
    let isPaused = false;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Function to update carousel dimensions
    function updateCarouselDimensions() {
        if (testimonialItems.length > 0) {
            testimonialItemWidth = testimonialItems[0].offsetWidth;
            goToTestimonial(currentTestimonialIndex);
        }
    }
    
    // Function to show image in same tab
    function showImageFullScreen(imageSrc) {
        // Create full screen image container
        const imageViewer = document.createElement('div');
        imageViewer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        
        // Create go back button
        const goBackBtn = document.createElement('button');
        goBackBtn.innerText = 'Go Back';
        goBackBtn.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 18px;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        
        // Add hover effect
        goBackBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#0056b3';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
        });
        goBackBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#007bff';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        // Create the image element
        const fullScreenImage = document.createElement('img');
        fullScreenImage.src = imageSrc;
        fullScreenImage.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `;
        
        // Go back button click handler
        goBackBtn.addEventListener('click', function() {
            document.body.removeChild(imageViewer);
            startAutoplay();
        });
        
        // ESC key handler to go back
        const escapeHandler = function(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(imageViewer);
                startAutoplay();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // Click outside image to go back
        imageViewer.addEventListener('click', function(e) {
            if (e.target === imageViewer) {
                document.body.removeChild(imageViewer);
                startAutoplay();
            }
        });
        
        // Append elements to image viewer
        imageViewer.appendChild(goBackBtn);
        imageViewer.appendChild(fullScreenImage);
        
        // Append to body
        document.body.appendChild(imageViewer);
        
        // Stop autoplay while viewing image
        clearInterval(autoplayInterval);
    }
    
    // Initialize carousel
    function initTestimonialCarousel() {
        // Set initial active item
        updateActiveTestimonial();
        
        // Event listeners for controls
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                pauseAutoplay();
                nextTestimonial();
            });
        }
        
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                pauseAutoplay();
                prevTestimonial();
            });
        }
        
        // Event listeners for dots
        testimonialDots.forEach(dot => {
            dot.addEventListener('click', function() {
                pauseAutoplay();
                const slideIndex = parseInt(this.getAttribute('data-index'));
                goToTestimonial(slideIndex);
            });
        });
        
        // Event listeners for testimonial items - show image in same tab
        testimonialItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                pauseAutoplay();
                // Show the image in the same tab
                const imageNumber = index + 1;
                const imageSrc = `photos/static/testimonials/t${imageNumber}.jpg`;
                showImageFullScreen(imageSrc);
            });
        });
        
        // Listen for window resize
        window.addEventListener('resize', function() {
            updateCarouselDimensions();
        });
        
        // Add touch/swipe support for mobile
        if (testimonialTrack) {
            testimonialTrack.addEventListener('touchstart', function(e) {
                pauseAutoplay();
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});
            
            testimonialTrack.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleTestimonialSwipe();
            }, {passive: true});
        }
        
        // Pause autoplay on hover
        if (testimonialTrack) {
            testimonialTrack.addEventListener('mouseenter', pauseAutoplay);
            testimonialTrack.addEventListener('mouseleave', startAutoplay);
        }
    }
    
    function updateActiveTestimonial() {
        // Remove active class from all items
        testimonialItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to current item
        if (testimonialItems.length > 0) {
            testimonialItems[currentTestimonialIndex].classList.add('active');
        }
        
        // Update dots
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        if (testimonialDots.length > 0) {
            testimonialDots[currentTestimonialIndex].classList.add('active');
        }
    }
    
    function goToTestimonial(index) {
        // Handle looping for index
        if (index < 0) index = testimonialItems.length - 1;
        if (index >= testimonialItems.length) index = 0;
        
        currentTestimonialIndex = index;
        
        // Update track position with centered item
        if (testimonialTrack) {
            testimonialTrack.style.transform = `translateX(-${testimonialItemWidth * currentTestimonialIndex}px)`;
        }
        
        // Update active testimonial
        updateActiveTestimonial();
    }
    
    function nextTestimonial() {
        goToTestimonial(currentTestimonialIndex + 1);
    }
    
    function prevTestimonial() {
        goToTestimonial(currentTestimonialIndex - 1);
    }
    
    function startAutoplay() {
        if (!isPaused) {
            clearInterval(autoplayInterval);
            autoplayInterval = setInterval(function() {
                nextTestimonial();
            }, 2000); // Auto slide every 2 seconds
        }
    }
    
    function pauseAutoplay() {
        isPaused = true;
        clearInterval(autoplayInterval);
        
        // Resume autoplay after 4 seconds of inactivity
        setTimeout(function() {
            isPaused = false;
            startAutoplay();
        }, 4000);
    }
    
    function handleTestimonialSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left, go next
            nextTestimonial();
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right, go prev
            prevTestimonial();
        }
    }
    
    // Initialize testimonial carousel if elements exist
    if (testimonialItems.length > 0 && testimonialTrack) {
        initTestimonialCarousel();
        // Start autoplay
        startAutoplay();
    }
});

// testimonial ends

// WhatsApp button pulsing effect
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButton = document.querySelector('.whatsapp-button');
    
    // Add subtle pulse animation
    function addPulseEffect() {
        whatsappButton.classList.add('pulse-effect');
        setTimeout(() => {
            whatsappButton.classList.remove('pulse-effect');
        }, 1000);
    }
    
    // Pulse effect every 5 seconds
    setInterval(addPulseEffect, 5000);
    
    // Initial pulse after 2 seconds
    setTimeout(addPulseEffect, 2000);
});
// whatsapp ends

// call button
document.addEventListener('DOMContentLoaded', function() {
    const callButton = document.getElementById('callButton');
    const callPopup = document.getElementById('callPopup');
    const closePopup = document.querySelector('.close-popup');
    const callNowBtn = document.querySelector('.call-now-btn');
    
    // Function to detect if the device is mobile
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Handle call button click
    callButton.addEventListener('click', function(e) {
        // Only prevent default and show popup on desktop
        if (!isMobileDevice()) {
            e.preventDefault();
            callPopup.style.display = 'block';
        }
        // On mobile, the default behavior will work (open tel: link)
    });
    
    // Close popup when clicking the X
    closePopup.addEventListener('click', function() {
        callPopup.style.display = 'none';
    });
    
    // Close popup when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === callPopup) {
            callPopup.style.display = 'none';
        }
    });
    
    // Call now button in popup
    callNowBtn.addEventListener('click', function() {
        window.location.href = 'tel:8056661304';
    });
    
    // Add pulse animation to call button
    function addCallPulseEffect() {
        callButton.classList.add('call-pulse-effect');
        setTimeout(() => {
            callButton.classList.remove('call-pulse-effect');
        }, 1000);
    }
    
    // Pulse effect every 5 seconds, alternating with WhatsApp button
    setInterval(addCallPulseEffect, 5000);
    
    // Initial pulse after 3.5 seconds (different timing from WhatsApp button)
    setTimeout(addCallPulseEffect, 3500);
});

// call button ends

// blog section code
// Initialize Supabase client
const blog_supabaseUrl = "https://mxzvrpvgnlgarzvzgtjm.supabase.co";
const blog_supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14enZycHZnbmxnYXJ6dnpndGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5ODE2MTEsImV4cCI6MjA2MjU1NzYxMX0.N4Mx9kgvDBLlyCX0bPpQgSCGVfrN9g7i5ymj9wGYV4A";
const blog_supabaseClient = supabase.createClient(blog_supabaseUrl, blog_supabaseKey);

// Variables for slideshow
let blog_currentIndex = 0;
let blog_items = [];
let blog_autoplayInterval;
let blog_isPaused = false;

// Load blogs when page loads
document.addEventListener('DOMContentLoaded', blog_loadItems);

async function blog_loadItems() {
    try {
        // Get distinct blog_ids and their first image
        const { data, error } = await blog_supabaseClient
            .from('image_gallery')
            .select('*')
            .order('uploaded_at', { ascending: false });
        
        if (error) throw error;
        
        // Process data to get unique blogs
        const blog_uniqueItems = {};
        data.forEach(item => {
            if (!blog_uniqueItems[item.blog_id] || 
                new Date(item.uploaded_at) > new Date(blog_uniqueItems[item.blog_id].uploaded_at)) {
                blog_uniqueItems[item.blog_id] = item;
            }
        });
        
        blog_items = Object.values(blog_uniqueItems).slice(0, 5);
        
        // Create slideshow
        blog_renderSlideshow();
        
        // Initialize the carousel
        blog_initCarousel();
        
    } catch (error) {
        console.error('Error loading blogs:', error);
        document.getElementById('blog_track').innerHTML = 
            `<div class="blog_no_blogs">Error loading blogs: ${error.message}</div>`;
    }
}

function blog_renderSlideshow() {
    const blog_trackContainer = document.getElementById('blog_track');
    blog_trackContainer.innerHTML = '';
    
    if (blog_items.length === 0) {
        // If no blogs exist, just show the View More card
        const blog_viewMoreCard = blog_createViewMoreCard();
        blog_trackContainer.appendChild(blog_viewMoreCard);
    } else {
        // Add blog cards
        blog_items.forEach((blog, index) => {
            const blog_card = blog_createCard(blog, index === 0);
            blog_trackContainer.appendChild(blog_card);
        });
        
        // Add View More card
        const blog_viewMoreCard = blog_createViewMoreCard();
        blog_trackContainer.appendChild(blog_viewMoreCard);
    }
}

function blog_createCard(blog, isActive = false) {
    const blog_card = document.createElement('div');
    blog_card.className = `blog_card ${isActive ? 'blog_active' : ''}`;

    const blog_titleElem = document.createElement('div');
    blog_titleElem.className = 'blog_title';
    blog_titleElem.textContent = blog.title;

    // Add date element
    const blog_dateElem = document.createElement('div');
    blog_dateElem.className = 'blog_date';
    // Format date nicely - assuming uploaded_at is in ISO format
    const blogDate = new Date(blog.uploaded_at);
    blog_dateElem.textContent = blogDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const blog_imgContainer = document.createElement('div');
    blog_imgContainer.className = 'blog_image_container';

    const blog_img = document.createElement('img');
    blog_img.src = blog.url;
    blog_img.alt = blog.title;
    blog_img.className = 'blog_image';
    blog_imgContainer.appendChild(blog_img);

    const blog_contentElem = document.createElement('div');
    blog_contentElem.className = 'blog_content';

    const blog_captionElem = document.createElement('div');
    blog_captionElem.className = 'blog_caption';
    
    // Limit caption to 10 words
    let captionText = blog.caption || '';
    let words = captionText.split(' ');
    if (words.length > 10) {
        captionText = words.slice(0, 10).join(' ') + '...';
    }
    blog_captionElem.textContent = captionText;

    const blog_viewButton = document.createElement('a');
    blog_viewButton.href = `blogs.html?blog=${blog.blog_id}`;
    blog_viewButton.className = 'blog_button';
    blog_viewButton.textContent = 'View Blog';
    blog_viewButton.style.marginTop = 'auto';

    blog_card.appendChild(blog_titleElem);
    blog_card.appendChild(blog_dateElem); // Add date after title
    blog_card.appendChild(blog_imgContainer);
    blog_contentElem.appendChild(blog_captionElem);
    blog_contentElem.appendChild(blog_viewButton);
    blog_card.appendChild(blog_contentElem);

    return blog_card;
}
function blog_createViewMoreCard() {
    const blog_card = document.createElement('div');
    blog_card.className = 'blog_card blog_view_more';
    
    const blog_title = document.createElement('div');
    blog_title.className = 'blog_title';
    blog_title.textContent = 'More Blogs';
    
    const blog_icon = document.createElement('i');
    blog_icon.className = 'fas fa-plus-circle';
    
    const blog_text = document.createElement('p');
    blog_text.textContent = 'View More Blogs';
    
    const blog_link = document.createElement('a');
    blog_link.href = 'blogs.html';
    blog_link.className = 'blog_button';
    blog_link.textContent = 'See All';
    blog_link.style.marginTop = 'auto';
    
    blog_card.appendChild(blog_title);
    blog_card.appendChild(blog_icon);
    blog_card.appendChild(blog_text);
    blog_card.appendChild(blog_link);
    
    return blog_card;
}

function blog_initCarousel() {
    const blog_track = document.getElementById('blog_track');
    const blog_cards = Array.from(blog_track.querySelectorAll('.blog_card'));
    const blog_nextButton = document.getElementById('blog_next');
    const blog_prevButton = document.getElementById('blog_prev');
    
    if (blog_cards.length <= 1) return; // No need for carousel with only one card
    
    let blog_cardWidth = blog_cards[0].offsetWidth;
    
    // Function to update carousel on window resize
    function blog_updateCarouselDimensions() {
        blog_cardWidth = blog_cards[0].offsetWidth;
        blog_goToSlide(blog_currentIndex);
    }
    
    // Highlight the active card
    function blog_updateActiveCard() {
        // Remove active class from all cards
        blog_cards.forEach(card => card.classList.remove('blog_active'));
        // Add active class to current card
        blog_cards[blog_currentIndex % blog_cards.length].classList.add('blog_active');
    }
    
    function blog_goToSlide(index) {
        // Handle looping for index
        if (index < 0) index = blog_cards.length - 1;
        if (index >= blog_cards.length) index = 0;
        
        blog_currentIndex = index;
        
        // Update track position
        blog_track.style.transform = `translateX(-${blog_cardWidth * blog_currentIndex}px)`;
        
        // Update active card
        blog_updateActiveCard();
    }
    
    function blog_nextSlide() {
        blog_goToSlide(blog_currentIndex + 1);
    }
    
    function blog_prevSlide() {
        blog_goToSlide(blog_currentIndex - 1);
    }
    
    function blog_startAutoplay() {
        if (!blog_isPaused) {
            clearInterval(blog_autoplayInterval);
            blog_autoplayInterval = setInterval(function() {
                blog_nextSlide();
            }, 3000); // Auto slide every 3 seconds
        }
    }
    
    function blog_pauseAutoplay() {
        blog_isPaused = true;
        clearInterval(blog_autoplayInterval);
        
        // Resume autoplay after 5 seconds of inactivity
        setTimeout(function() {
            blog_isPaused = false;
            blog_startAutoplay();
        }, 5000);
    }
    
    // Event listeners for controls
    blog_nextButton.addEventListener('click', function() {
        blog_pauseAutoplay();
        blog_nextSlide();
    });
    
    blog_prevButton.addEventListener('click', function() {
        blog_pauseAutoplay();
        blog_prevSlide();
    });
    
    // Add touch/swipe support for mobile
    let blog_touchStartX = 0;
    let blog_touchEndX = 0;
    
    blog_track.addEventListener('touchstart', function(e) {
        blog_pauseAutoplay();
        blog_touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    blog_track.addEventListener('touchend', function(e) {
        blog_touchEndX = e.changedTouches[0].screenX;
        blog_handleSwipe();
    }, {passive: true});
    
    function blog_handleSwipe() {
        if (blog_touchEndX < blog_touchStartX - 50) {
            // Swipe left, go next
            blog_nextSlide();
        } else if (blog_touchEndX > blog_touchStartX + 50) {
            // Swipe right, go prev
            blog_prevSlide();
        }
    }
    
    // Listen for window resize
    window.addEventListener('resize', function() {
        blog_updateCarouselDimensions();
    });
    
    // Pause autoplay on hover
    blog_track.addEventListener('mouseenter', blog_pauseAutoplay);
    blog_track.addEventListener('mouseleave', blog_startAutoplay);
    
    // Start with first slide active
    blog_updateActiveCard();
    
    // Start autoplay
    blog_startAutoplay();
}
// blog section code

// Events section code
// Initialize Supabase client (using the same from blog section)
const events_supabaseUrl = "https://mxzvrpvgnlgarzvzgtjm.supabase.co";
const events_supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14enZycHZnbmxnYXJ6dnpndGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5ODE2MTEsImV4cCI6MjA2MjU1NzYxMX0.N4Mx9kgvDBLlyCX0bPpQgSCGVfrN9g7i5ymj9wGYV4A";
const events_supabaseClient = supabase.createClient(events_supabaseUrl, events_supabaseKey);

// WhatsApp contact number (replace with your actual number)
const events_whatsappNumber = "9884127938"; // Replace with your actual WhatsApp number

// Variables for slideshow
let events_currentIndex = 0;
let events_items = [];
let events_autoplayInterval;
let events_isPaused = false;

// Load events when page loads
document.addEventListener('DOMContentLoaded', events_loadItems);

async function events_loadItems() {
    try {
        // Get events data from Supabase
        const { data, error } = await events_supabaseClient
            .from('events')
            .select('*')
            .order('event_date', { ascending: true })
            .limit(6); // Limit to 6 events as per your requirement
        
        if (error) throw error;
        
        // Store events data
        events_items = data || [];
        
        // Render events slideshow
        events_renderSlideshow();
        
        // Initialize the carousel if there are events
        if (events_items.length > 0) {
            events_initCarousel();
            
            // Add modal to body for poster viewing
            events_createModal();
        }
        
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('events_track').innerHTML = 
            `<div class="events_no_events">Error loading events: ${error.message}</div>`;
    }
}

function events_renderSlideshow() {
    const events_trackContainer = document.getElementById('events_track');
    events_trackContainer.innerHTML = '';
    
    if (events_items.length === 0) {
        // If no events exist, show message
        events_trackContainer.innerHTML = '<div class="events_no_events">No events yet</div>';
    } else {
        // Add event cards
        events_items.forEach((event, index) => {
            const events_card = events_createCard(event, index === 0);
            events_trackContainer.appendChild(events_card);
        });
    }
}

function events_createCard(event, isActive = false) {
    const events_card = document.createElement('div');
    events_card.className = `events_card ${isActive ? 'events_active' : ''}`;

    const events_titleElem = document.createElement('div');
    events_titleElem.className = 'events_title';
    events_titleElem.textContent = event.title;

    const events_imgContainer = document.createElement('div');
    events_imgContainer.className = 'events_image_container';

    const events_img = document.createElement('img');
    events_img.src = event.poster_url || 'default-poster.jpg'; // Use default image if no URL
    events_img.alt = event.title;
    events_img.className = 'events_image';
    events_imgContainer.appendChild(events_img);

    const events_contentElem = document.createElement('div');
    events_contentElem.className = 'events_content';

    // Format date
    const eventDate = new Date(event.event_date);
    const formattedDate = `${eventDate.getDate().toString().padStart(2, '0')}/${(eventDate.getMonth() + 1).toString().padStart(2, '0')}/${eventDate.getFullYear()}`;
    
    const events_dateElem = document.createElement('div');
    events_dateElem.className = 'events_date';
    events_dateElem.textContent = `Event Date: ${formattedDate}`;

    // Create buttons container
    const events_buttonsContainer = document.createElement('div');
    events_buttonsContainer.className = 'events_buttons';

    // Create View Poster button
    const events_viewButton = document.createElement('button');
    events_viewButton.className = 'events_view_button';
    events_viewButton.textContent = 'View Poster';
    events_viewButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent card click
        events_openPosterModal(event.poster_url, event.title);
    });

    // Create Get Details button (WhatsApp)
    const events_detailsButton = document.createElement('a');
    events_detailsButton.href = `https://wa.me/${events_whatsappNumber}?text=I want to know about ${encodeURIComponent(event.title)}`;
    events_detailsButton.target = '_blank';
    events_detailsButton.className = 'events_details_button';
    events_detailsButton.textContent = 'Get Details';

    // Add buttons to container
    events_buttonsContainer.appendChild(events_viewButton);
    events_buttonsContainer.appendChild(events_detailsButton);

    // Build card structure
    events_card.appendChild(events_titleElem);
    events_card.appendChild(events_imgContainer);
    events_contentElem.appendChild(events_dateElem);
    events_contentElem.appendChild(events_buttonsContainer);
    events_card.appendChild(events_contentElem);

    return events_card;
}

function events_createModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('events_modal')) {
        const events_modal = document.createElement('div');
        events_modal.id = 'events_modal';
        events_modal.className = 'events_modal';
        
        const events_modalContent = document.createElement('div');
        events_modalContent.className = 'events_modal_content';
        
        const events_closeBtn = document.createElement('span');
        events_closeBtn.className = 'events_modal_close';
        events_closeBtn.innerHTML = '&times;';
        events_closeBtn.onclick = events_closePosterModal;
        
        const events_modalImg = document.createElement('img');
        events_modalImg.id = 'events_modal_img';
        events_modalImg.className = 'events_modal_image';
        
        events_modalContent.appendChild(events_modalImg);
        events_modal.appendChild(events_closeBtn);
        events_modal.appendChild(events_modalContent);
        
        // Add click event to close modal when clicking outside
        events_modal.addEventListener('click', function(e) {
            if (e.target === events_modal) {
                events_closePosterModal();
            }
        });
        
        document.body.appendChild(events_modal);
    }
}

// Pause and start autoplay functions - moved outside of initCarousel to make them globally accessible
function events_pauseAutoplay() {
    events_isPaused = true;
    clearInterval(events_autoplayInterval);
    
    // Resume autoplay after 5 seconds of inactivity
    setTimeout(function() {
        events_isPaused = false;
        events_startAutoplay();
    }, 5000);
}

function events_startAutoplay() {
    if (!events_isPaused) {
        clearInterval(events_autoplayInterval);
        events_autoplayInterval = setInterval(function() {
            events_nextSlide();
        }, 3000); // Auto slide every 3 seconds
    }
}

function events_nextSlide() {
    if (!events_items.length) return;
    
    let nextIndex = events_currentIndex + 1;
    if (nextIndex >= events_items.length) nextIndex = 0;
    events_goToSlide(nextIndex);
}

function events_prevSlide() {
    if (!events_items.length) return;
    
    let prevIndex = events_currentIndex - 1;
    if (prevIndex < 0) prevIndex = events_items.length - 1;
    events_goToSlide(prevIndex);
}

function events_goToSlide(index) {
    // Handle looping for index
    if (index < 0) index = events_items.length - 1;
    if (index >= events_items.length) index = 0;
    
    events_currentIndex = index;
    
    // Get track element
    const events_track = document.getElementById('events_track');
    if (!events_track) return;
    
    // Get card width
    const events_cards = Array.from(events_track.querySelectorAll('.events_card'));
    if (!events_cards.length) return;
    
    const events_cardWidth = events_cards[0].offsetWidth;
    
    // Update track position
    events_track.style.transform = `translateX(-${events_cardWidth * events_currentIndex}px)`;
    
    // Update active card
    events_updateActiveCard();
}

function events_updateActiveCard() {
    const events_track = document.getElementById('events_track');
    if (!events_track) return;
    
    const events_cards = Array.from(events_track.querySelectorAll('.events_card'));
    
    // Remove active class from all cards
    events_cards.forEach(card => card.classList.remove('events_active'));
    
    // Add active class to current card
    if (events_cards[events_currentIndex]) {
        events_cards[events_currentIndex].classList.add('events_active');
    }
}

function events_openPosterModal(posterUrl, title) {
    // Pause the slideshow autoplay
    events_pauseAutoplay();
    
    const events_modal = document.getElementById('events_modal');
    const events_modalImg = document.getElementById('events_modal_img');
    
    events_modalImg.src = posterUrl;
    events_modalImg.alt = title;
    
    events_modal.style.display = 'block';
    
    // Add event listener for keyboard escape
    document.addEventListener('keydown', events_handleEscape);
}

function events_closePosterModal() {
    const events_modal = document.getElementById('events_modal');
    events_modal.style.display = 'none';
    
    // Remove event listener for keyboard escape
    document.removeEventListener('keydown', events_handleEscape);
    
    // Resume autoplay
    events_isPaused = false;
    events_startAutoplay();
}

function events_handleEscape(e) {
    if (e.key === 'Escape') {
        events_closePosterModal();
    }
}

function events_initCarousel() {
    const events_track = document.getElementById('events_track');
    const events_cards = Array.from(events_track.querySelectorAll('.events_card'));
    const events_nextButton = document.getElementById('events_next');
    const events_prevButton = document.getElementById('events_prev');
    
    if (events_cards.length <= 1) return; // No need for carousel with only one card
    
    // Function to update carousel on window resize
    function events_updateCarouselDimensions() {
        const events_cardWidth = events_cards[0].offsetWidth;
        events_goToSlide(events_currentIndex);
    }
    
    // Event listeners for controls
    if (events_nextButton) {
        events_nextButton.addEventListener('click', function() {
            events_pauseAutoplay();
            events_nextSlide();
        });
    }
    
    if (events_prevButton) {
        events_prevButton.addEventListener('click', function() {
            events_pauseAutoplay();
            events_prevSlide();
        });
    }
    
    // Add touch/swipe support for mobile
    let events_touchStartX = 0;
    let events_touchEndX = 0;
    
    events_track.addEventListener('touchstart', function(e) {
        events_pauseAutoplay();
        events_touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    events_track.addEventListener('touchend', function(e) {
        events_touchEndX = e.changedTouches[0].screenX;
        events_handleSwipe();
    }, {passive: true});
    
    function events_handleSwipe() {
        if (events_touchEndX < events_touchStartX - 50) {
            // Swipe left, go next
            events_nextSlide();
        } else if (events_touchEndX > events_touchStartX + 50) {
            // Swipe right, go prev
            events_prevSlide();
        }
    }
    
    // Listen for window resize
    window.addEventListener('resize', function() {
        events_updateCarouselDimensions();
    });
    
    // Pause autoplay on hover
    events_track.addEventListener('mouseenter', events_pauseAutoplay);
    events_track.addEventListener('mouseleave', events_startAutoplay);
    
    // Start with first slide active
    events_updateActiveCard();
    
    // Start autoplay
    events_startAutoplay();
}
// End of events section code

