// FifthFloor - Enhanced JavaScript with QuintoAndar FormBox
document.addEventListener('DOMContentLoaded', function() {

    // ===== QuintoAndar FormBox Initialization =====

    // Data
    const cities = [
        'Sliema', 'St. Julian\'s', 'Valletta', 'Gzira', 'Msida',
        'St. Paul\'s Bay', 'Bugibba', 'Qawra', 'Mellieha', 'Marsaskala',
        'Swieqi', 'Pembroke', 'Ta\' Xbiex', 'San Gwann', 'Birkirkara'
    ];

    const neighborhoods = {
        'Sliema': ['Tigne Point', 'Qui-Si-Sana', 'Ferries', 'Tower Road'],
        'St. Julian\'s': ['Paceville', 'Spinola Bay', 'St. George\'s Bay', 'Balluta Bay'],
        'Valletta': ['Merchants Street', 'Republic Street', 'St. Ursula Street'],
        'Gzira': ['Manoel Island', 'Msida Creek'],
        'Msida': ['The Gardens', 'University Area']
    };

    // Segmented Control (Search/List Toggle)
    const segmentButtons = document.querySelectorAll('.SegmentButton');
    const segmentIndicator = document.querySelector('.SegmentedIndicator');

    if (segmentIndicator && segmentButtons.length > 0) {
        function updateSegmentIndicator(button) {
            const width = button.offsetWidth;
            const left = button.offsetLeft;
            segmentIndicator.style.width = `${width}px`;
            segmentIndicator.style.left = `${left}px`;
        }

        segmentButtons.forEach((button) => {
            button.addEventListener('click', function() {
                segmentButtons.forEach(btn => {
                    btn.classList.remove('SegmentButton--active');
                    btn.setAttribute('aria-selected', 'false');
                });

                this.classList.add('SegmentButton--active');
                this.setAttribute('aria-selected', 'true');
                updateSegmentIndicator(this);

                const segment = this.dataset.segment;
                console.log(`Switched to: ${segment}`);

                if (segment === 'list') {
                    alert('List Property Form\\n\\nIn a real application, this would show a form for property owners to list their properties, following QuintoAndar model.');
                }
            });
        });

        // Initialize indicator position
        const activeSegment = document.querySelector('.SegmentButton--active');
        if (activeSegment) {
            updateSegmentIndicator(activeSegment);
        }

        // Window Resize Handler
        window.addEventListener('resize', function() {
            const activeSegment = document.querySelector('.SegmentButton--active');
            if (activeSegment) {
                updateSegmentIndicator(activeSegment);
            }
        });
    }

    // Content Tabs (Rent/Buy)
    const actionTabs = document.querySelectorAll('.Tab');

    actionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            actionTabs.forEach(t => {
                t.classList.remove('Tab--active');
                t.setAttribute('aria-selected', 'false');
            });

            this.classList.add('Tab--active');
            this.setAttribute('aria-selected', 'true');

            const action = this.dataset.action;
            console.log(`Action changed to: ${action}`);
        });
    });

    // Autocomplete - City Input
    const cityInput = document.getElementById('cityInput');
    const cityDropdown = document.getElementById('cityDropdown');

    if (cityInput && cityDropdown) {
        const cityList = cityDropdown.querySelector('.DropdownList');

        cityInput.addEventListener('input', function() {
            const value = this.value.toLowerCase().trim();

            if (value.length > 0) {
                const filtered = cities.filter(city =>
                    city.toLowerCase().includes(value)
                );

                if (filtered.length > 0) {
                    cityList.innerHTML = filtered.map(city =>
                        `<li role="option" data-value="${city}">${city}</li>`
                    ).join('');

                    cityDropdown.classList.remove('Dropdown--closed');
                    cityInput.setAttribute('aria-expanded', 'true');

                    cityList.querySelectorAll('li').forEach(item => {
                        item.addEventListener('click', function() {
                            cityInput.value = this.dataset.value;
                            cityDropdown.classList.add('Dropdown--closed');
                            cityInput.setAttribute('aria-expanded', 'false');
                            updateNeighborhoods(this.dataset.value);
                        });
                    });
                } else {
                    cityDropdown.classList.add('Dropdown--closed');
                    cityInput.setAttribute('aria-expanded', 'false');
                }
            } else {
                cityDropdown.classList.add('Dropdown--closed');
                cityInput.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Autocomplete - Neighborhood Input
    const neighborhoodInput = document.getElementById('neighborhoodInput');
    const neighborhoodDropdown = document.getElementById('neighborhoodDropdown');

    if (neighborhoodInput && neighborhoodDropdown) {
        const neighborhoodList = neighborhoodDropdown.querySelector('.DropdownList');

        function updateNeighborhoods(selectedCity) {
            const cityNeighborhoods = neighborhoods[selectedCity] || [];

            if (cityNeighborhoods.length === 0) {
                neighborhoodInput.disabled = true;
                neighborhoodInput.placeholder = 'No neighborhoods available';
            } else {
                neighborhoodInput.disabled = false;
                neighborhoodInput.placeholder = 'Search by neighborhood';
            }
        }

        neighborhoodInput.addEventListener('input', function() {
            const selectedCity = cityInput.value;
            const value = this.value.toLowerCase().trim();
            const cityNeighborhoods = neighborhoods[selectedCity] || [];

            if (value.length > 0 && cityNeighborhoods.length > 0) {
                const filtered = cityNeighborhoods.filter(neighborhood =>
                    neighborhood.toLowerCase().includes(value)
                );

                if (filtered.length > 0) {
                    neighborhoodList.innerHTML = filtered.map(neighborhood =>
                        `<li role="option" data-value="${neighborhood}">${neighborhood}</li>`
                    ).join('');

                    neighborhoodDropdown.classList.remove('Dropdown--closed');
                    neighborhoodInput.setAttribute('aria-expanded', 'true');

                    neighborhoodList.querySelectorAll('li').forEach(item => {
                        item.addEventListener('click', function() {
                            neighborhoodInput.value = this.dataset.value;
                            neighborhoodDropdown.classList.add('Dropdown--closed');
                            neighborhoodInput.setAttribute('aria-expanded', 'false');
                        });
                    });
                } else {
                    neighborhoodDropdown.classList.add('Dropdown--closed');
                    neighborhoodInput.setAttribute('aria-expanded', 'false');
                }
            } else {
                neighborhoodDropdown.classList.add('Dropdown--closed');
                neighborhoodInput.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Custom Select - Price
    const priceSelector = document.getElementById('priceSelector');
    const priceOptions = document.getElementById('priceOptions');

    if (priceSelector && priceOptions) {
        const priceValue = priceSelector.querySelector('.CustomSelectValue');

        priceSelector.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            closeAllSelects();

            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
                priceOptions.classList.remove('CustomSelectOptions--closed');
            }
        });

        priceOptions.querySelectorAll('li').forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();

                priceOptions.querySelectorAll('li').forEach(opt => {
                    opt.setAttribute('aria-selected', 'false');
                });
                this.setAttribute('aria-selected', 'true');

                priceValue.textContent = this.textContent;

                priceSelector.setAttribute('aria-expanded', 'false');
                priceOptions.classList.add('CustomSelectOptions--closed');
            });
        });
    }

    // Custom Select - Rooms
    const roomsSelector = document.getElementById('roomsSelector');
    const roomsOptions = document.getElementById('roomsOptions');

    if (roomsSelector && roomsOptions) {
        const roomsValue = roomsSelector.querySelector('.CustomSelectValue');

        roomsSelector.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            closeAllSelects();

            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
                roomsOptions.classList.remove('CustomSelectOptions--closed');
            }
        });

        roomsOptions.querySelectorAll('li').forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();

                roomsOptions.querySelectorAll('li').forEach(opt => {
                    opt.setAttribute('aria-selected', 'false');
                });
                this.setAttribute('aria-selected', 'true');

                roomsValue.textContent = this.textContent;

                roomsSelector.setAttribute('aria-expanded', 'false');
                roomsOptions.classList.add('CustomSelectOptions--closed');
            });
        });
    }

    // Helper Functions
    function closeAllSelects() {
        document.querySelectorAll('.CustomSelect').forEach(select => {
            select.setAttribute('aria-expanded', 'false');
        });
        document.querySelectorAll('.CustomSelectOptions').forEach(options => {
            options.classList.add('CustomSelectOptions--closed');
        });
    }

    function closeAllDropdowns() {
        document.querySelectorAll('.Dropdown').forEach(dropdown => {
            dropdown.classList.add('Dropdown--closed');
        });
        document.querySelectorAll('.Input').forEach(input => {
            input.setAttribute('aria-expanded', 'false');
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.FieldWrapper')) {
            closeAllSelects();
            closeAllDropdowns();
        }
    });

    // Form Submission
    const searchForm = document.getElementById('searchForm');

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const activeAction = document.querySelector('.Tab--active');
            const priceSelected = priceOptions ? priceOptions.querySelector('[aria-selected="true"]') : null;
            const roomsSelected = roomsOptions ? roomsOptions.querySelector('[aria-selected="true"]') : null;

            const formData = {
                action: activeAction ? activeAction.dataset.action : 'rent',
                city: cityInput ? cityInput.value : '',
                neighborhood: neighborhoodInput ? neighborhoodInput.value : '',
                price: priceSelected ? priceSelected.dataset.value : '',
                bedrooms: roomsSelected ? roomsSelected.dataset.value : ''
            };

            console.log('Search Form Data:', formData);

            let message = `Search Properties\\n\\n`;
            message += `Action: ${formData.action}\\n`;
            if (formData.city) message += `City: ${formData.city}\\n`;
            if (formData.neighborhood) message += `Neighborhood: ${formData.neighborhood}\\n`;
            if (formData.price) message += `Max Price: €${formData.price}\\n`;
            if (formData.bedrooms) message += `Bedrooms: ${formData.bedrooms}+\\n`;
            message += `\\nFollowing QuintoAndar business model: No guarantor required, Digital contracts, Verified properties.`;

            alert(message);
        });
    }

    // ===== Navigation Scroll Effect =====
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(255, 255, 255, 0.85)';
        }

        lastScroll = currentScroll;
    });

    // ===== Tab Switching with Animation =====
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            // Add active class with animation
            this.classList.add('active');

            // Update placeholder text based on selected tab
            const searchInput = document.querySelector('.search-input');
            const tab = this.dataset.tab;

            if (tab === 'rent') {
                searchInput.placeholder = 'Search by location, neighborhood or city...';
            } else if (tab === 'buy') {
                searchInput.placeholder = 'Where would you like to buy a property?';
            }
        });
    });

    // ===== Location Search with Autocomplete =====
    const locationInput = document.getElementById('locationInput');
    const suggestionsDiv = document.getElementById('suggestions');

    const locations = [
        'Sliema', 'St. Julian\'s', 'Valletta', 'Gzira', 'Msida',
        'St. Paul\'s Bay', 'Bugibba', 'Qawra', 'Mellieha', 'Marsaskala',
        'Swieqi', 'Pembroke', 'Ta\' Xbiex', 'San Gwann', 'Birkirkara',
        'Mosta', 'Naxxar', 'Attard', 'Balzan', 'Lija'
    ];

    locationInput.addEventListener('input', function(e) {
        const value = e.target.value.toLowerCase();

        if (value.length > 0) {
            const filtered = locations.filter(loc =>
                loc.toLowerCase().includes(value)
            );

            if (filtered.length > 0) {
                suggestionsDiv.innerHTML = filtered.map(loc =>
                    `<div class="suggestion-item" style="padding: 12px 16px; cursor: pointer; transition: background 0.2s;">${loc}</div>`
                ).join('');
                suggestionsDiv.style.display = 'block';

                // Add click handlers to suggestions
                document.querySelectorAll('.suggestion-item').forEach(item => {
                    item.addEventListener('mouseenter', function() {
                        this.style.background = '#f1f5f9';
                    });
                    item.addEventListener('mouseleave', function() {
                        this.style.background = 'white';
                    });
                    item.addEventListener('click', function() {
                        locationInput.value = this.textContent;
                        suggestionsDiv.style.display = 'none';
                    });
                });
            } else {
                suggestionsDiv.style.display = 'none';
            }
        } else {
            suggestionsDiv.style.display = 'none';
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!locationInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.style.display = 'none';
        }
    });

    // ===== Enhanced Search with Loading State =====
    const searchButton = document.querySelector('.btn-search');
    const searchForm = document.querySelector('.search-form');

    searchButton.addEventListener('click', function(e) {
        e.preventDefault();

        const location = document.querySelector('.search-input').value;
        const propertyType = document.querySelectorAll('.search-select')[0].value;
        const bedrooms = document.querySelectorAll('.search-select')[1].value;
        const priceRange = document.querySelectorAll('.search-select')[2].value;
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;

        // Add loading state
        const originalHTML = searchButton.innerHTML;
        searchButton.innerHTML = '<span>Searching...</span>';
        searchButton.disabled = true;
        searchButton.style.opacity = '0.7';

        // Simulate search delay
        setTimeout(() => {
            let searchMessage = `Searching for ${activeTab === 'rent' ? 'rentals' : 'properties to buy'}`;

            if (location) searchMessage += ` in ${location}`;
            if (propertyType) searchMessage += `\\nType: ${propertyType}`;
            if (bedrooms) searchMessage += `\\nBedrooms: ${bedrooms}`;
            if (priceRange) searchMessage += `\\nPrice: €${priceRange}`;

            alert(searchMessage + '\\n\\nIn a real application, this would show search results.');

            // Reset button
            searchButton.innerHTML = originalHTML;
            searchButton.disabled = false;
            searchButton.style.opacity = '1';

            console.log('Search parameters:', {
                type: activeTab,
                location,
                propertyType,
                bedrooms,
                priceRange
            });
        }, 1000);
    });

    // ===== Property Card Interactions =====
    const propertyCards = document.querySelectorAll('.property-card');

    propertyCards.forEach(card => {
        // Favorite button functionality
        const favoriteBtn = card.querySelector('.property-favorite');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('favorited');

                const path = this.querySelector('path');
                if (this.classList.contains('favorited')) {
                    path.setAttribute('fill', 'currentColor');
                    // Add small animation
                    this.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    path.setAttribute('fill', 'none');
                }
            });
        }

        // View details button
        const viewBtn = card.querySelector('.btn-view-property');
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const propertyTitle = card.querySelector('h4').textContent;
                const propertyPrice = card.querySelector('.price-amount').textContent;

                alert(`Property: ${propertyTitle}\\nPrice: ${propertyPrice}/month\\n\\nIn a real application, this would open the property details page.`);

                console.log('Viewing property:', propertyTitle);
            });
        }

        // Card click
        card.addEventListener('click', function() {
            const propertyTitle = this.querySelector('h4').textContent;
            console.log('Property card clicked:', propertyTitle);
        });
    });

    // ===== CTA Buttons =====
    const ctaPrimaryBtn = document.querySelector('.btn-cta-primary');
    const ctaSecondaryBtn = document.querySelector('.btn-cta-secondary');

    if (ctaPrimaryBtn) {
        ctaPrimaryBtn.addEventListener('click', function() {
            document.querySelector('.hero').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    if (ctaSecondaryBtn) {
        ctaSecondaryBtn.addEventListener('click', function() {
            alert('List Your Property\\n\\nThis would open a form for property owners to list their properties.');
        });
    }

    // ===== Smooth Scrolling for Navigation Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const yOffset = -80; // Offset for fixed navbar
                const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Intersection Observer for Scroll Animations =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply fade-in animation to elements
    const elementsToAnimate = document.querySelectorAll(
        '.benefit-card, .property-card, .step-card, .testimonial-card'
    );

    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        fadeInObserver.observe(el);
    });

    // ===== Mobile Menu Toggle =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');

            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // ===== Input Focus Effects =====
    const inputs = document.querySelectorAll('.search-input, .search-select');

    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // ===== Parallax Effect for Hero Shapes =====
    const heroShapes = document.querySelectorAll('.shape');

    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        heroShapes.forEach((shape, index) => {
            const speed = (index + 1) * 10;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;

            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // ===== Stats Counter Animation =====
    const stats = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateStats();
            }
        });
    });

    if (stats.length > 0) {
        statsObserver.observe(stats[0].parentElement);
    }

    function animateStats() {
        stats.forEach(stat => {
            const target = stat.textContent;
            const isPlus = target.includes('+');
            const number = parseInt(target.replace(/[^0-9]/g, ''));
            const duration = 2000;
            const increment = number / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString() + (isPlus ? '+' : '');
                }
            }, 16);
        });
    }

    // ===== Lazy Loading Images =====
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.property-image').forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        imageObserver.observe(img);
    });

    // ===== City Cards Interaction =====
    const cityCards = document.querySelectorAll('.city-card');

    cityCards.forEach(card => {
        card.addEventListener('click', function() {
            const cityName = this.dataset.city;
            const cityTitle = this.querySelector('h3').textContent;

            alert(`Explore ${cityTitle}\\n\\nDiscover amazing properties in ${cityTitle}. In a real application, this would show filtered results for this city.`);

            console.log('City clicked:', cityName);
        });
    });

    // ===== Console Welcome Message =====
    console.log(
        '%c🏢 FifthFloor ',
        'font-size: 24px; font-weight: bold; color: #6366f1; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; padding: 10px;'
    );
    console.log(
        '%cWelcome to FifthFloor Malta! Your perfect home is just a click away.',
        'font-size: 13px; color: #475569; font-weight: 500;'
    );
    console.log(
        '%c✨ Rent without complications | 🔐 100% Secure | 📱 Digital Contracts',
        'font-size: 11px; color: #94a3b8;'
    );

    // ===== Performance Optimization =====
    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll handler if needed
    const debouncedScroll = debounce(() => {
        // Additional scroll handlers can be added here
    }, 10);

    window.addEventListener('scroll', debouncedScroll);

    console.log('✅ FifthFloor initialized successfully');
    console.log('%cExplore 5,000+ properties | 15+ cities | 10,000+ happy tenants', 'color: #6366f1; font-weight: 600;');
});

// ===== Service Worker Registration (for future PWA support) =====
if ('serviceWorker' in navigator) {
    // Uncomment when ready to implement PWA
    // navigator.serviceWorker.register('/sw.js').then(reg => {
    //     console.log('Service Worker registered:', reg);
    // });
}
