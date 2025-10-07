// FifthFloor - QuintoAndar Style Search Form
// Following business rules: Search Properties vs List Property toggle

document.addEventListener('DOMContentLoaded', function() {

    // ===== Data =====
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

    // ===== Segmented Control (Search/List Toggle) =====
    const segmentButtons = document.querySelectorAll('.SegmentButton');
    const segmentIndicator = document.querySelector('.SegmentedIndicator');

    function updateSegmentIndicator(button) {
        const index = Array.from(segmentButtons).indexOf(button);
        const width = button.offsetWidth;
        const left = button.offsetLeft;

        segmentIndicator.style.width = `${width}px`;
        segmentIndicator.style.left = `${left}px`;
    }

    segmentButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Remove active from all
            segmentButtons.forEach(btn => {
                btn.classList.remove('SegmentButton--active');
                btn.setAttribute('aria-selected', 'false');
            });

            // Add active to clicked
            this.classList.add('SegmentButton--active');
            this.setAttribute('aria-selected', 'true');

            // Update indicator
            updateSegmentIndicator(this);

            // Get segment type
            const segment = this.dataset.segment;
            console.log(`Switched to: ${segment}`);

            // In a real app, this would switch between search form and list property form
            if (segment === 'list') {
                alert('List Property Form\n\nIn a real application, this would show a form for property owners to list their properties, following QuintoAndar\'s business model.');
            }
        });
    });

    // Initialize indicator position
    const activeSegment = document.querySelector('.SegmentButton--active');
    if (activeSegment) {
        updateSegmentIndicator(activeSegment);
    }

    // ===== Content Tabs (Rent/Buy) =====
    const actionTabs = document.querySelectorAll('.Tab');

    actionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active from all
            actionTabs.forEach(t => {
                t.classList.remove('Tab--active');
                t.setAttribute('aria-selected', 'false');
            });

            // Add active to clicked
            this.classList.add('Tab--active');
            this.setAttribute('aria-selected', 'true');

            const action = this.dataset.action;
            console.log(`Action changed to: ${action}`);
        });
    });

    // ===== Autocomplete - City Input =====
    const cityInput = document.getElementById('cityInput');
    const cityDropdown = document.getElementById('cityDropdown');
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

                // Add click handlers
                cityList.querySelectorAll('li').forEach(item => {
                    item.addEventListener('click', function() {
                        cityInput.value = this.dataset.value;
                        cityDropdown.classList.add('Dropdown--closed');
                        cityInput.setAttribute('aria-expanded', 'false');

                        // Update neighborhoods based on selected city
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

    // ===== Autocomplete - Neighborhood Input =====
    const neighborhoodInput = document.getElementById('neighborhoodInput');
    const neighborhoodDropdown = document.getElementById('neighborhoodDropdown');
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

                // Add click handlers
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

    // ===== Custom Select - Price =====
    const priceSelector = document.getElementById('priceSelector');
    const priceOptions = document.getElementById('priceOptions');
    const priceValue = priceSelector.querySelector('.CustomSelectValue');

    priceSelector.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Close all other selects
        closeAllSelects();

        if (!isExpanded) {
            this.setAttribute('aria-expanded', 'true');
            priceOptions.classList.remove('CustomSelectOptions--closed');
        }
    });

    priceOptions.querySelectorAll('li').forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();

            // Update selected
            priceOptions.querySelectorAll('li').forEach(opt => {
                opt.setAttribute('aria-selected', 'false');
            });
            this.setAttribute('aria-selected', 'true');

            // Update display value
            priceValue.textContent = this.textContent;

            // Close dropdown
            priceSelector.setAttribute('aria-expanded', 'false');
            priceOptions.classList.add('CustomSelectOptions--closed');
        });
    });

    // ===== Custom Select - Rooms =====
    const roomsSelector = document.getElementById('roomsSelector');
    const roomsOptions = document.getElementById('roomsOptions');
    const roomsValue = roomsSelector.querySelector('.CustomSelectValue');

    roomsSelector.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Close all other selects
        closeAllSelects();

        if (!isExpanded) {
            this.setAttribute('aria-expanded', 'true');
            roomsOptions.classList.remove('CustomSelectOptions--closed');
        }
    });

    roomsOptions.querySelectorAll('li').forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();

            // Update selected
            roomsOptions.querySelectorAll('li').forEach(opt => {
                opt.setAttribute('aria-selected', 'false');
            });
            this.setAttribute('aria-selected', 'true');

            // Update display value
            roomsValue.textContent = this.textContent;

            // Close dropdown
            roomsSelector.setAttribute('aria-expanded', 'false');
            roomsOptions.classList.add('CustomSelectOptions--closed');
        });
    });

    // ===== Helper Functions =====
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

    // ===== Form Submission =====
    const searchForm = document.getElementById('searchForm');

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            action: document.querySelector('.Tab--active').dataset.action,
            city: cityInput.value,
            neighborhood: neighborhoodInput.value,
            price: priceOptions.querySelector('[aria-selected="true"]')?.dataset.value || '',
            bedrooms: roomsOptions.querySelector('[aria-selected="true"]')?.dataset.value || ''
        };

        console.log('Search Form Data:', formData);

        let message = `Search Properties\n\n`;
        message += `Action: ${formData.action}\n`;
        if (formData.city) message += `City: ${formData.city}\n`;
        if (formData.neighborhood) message += `Neighborhood: ${formData.neighborhood}\n`;
        if (formData.price) message += `Max Price: €${formData.price}\n`;
        if (formData.bedrooms) message += `Bedrooms: ${formData.bedrooms}+\n`;
        message += `\nIn a real application, this would search the database following QuintoAndar's business model:\n`;
        message += `- No guarantor required\n`;
        message += `- Digital contracts\n`;
        message += `- Verified properties\n`;
        message += `- Payment guarantee to owners`;

        alert(message);
    });

    // ===== Window Resize Handler =====
    window.addEventListener('resize', function() {
        const activeSegment = document.querySelector('.SegmentButton--active');
        if (activeSegment) {
            updateSegmentIndicator(activeSegment);
        }
    });

    // ===== Console Welcome =====
    console.log('%c🏠 FifthFloor Malta', 'font-size: 20px; font-weight: bold; color: #6366f1;');
    console.log('%cQuintoAndar-inspired Design System', 'font-size: 13px; color: #64748b;');
    console.log('%c✨ Search Properties | 📋 List Property | 🔐 No Guarantor', 'font-size: 11px; color: #94a3b8;');
});
