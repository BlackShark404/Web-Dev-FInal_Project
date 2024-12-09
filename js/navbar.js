// Optimized JavaScript (main.js)
class NavMenu {
    constructor() {
        this.offcanvas = document.getElementById('navMenu');
        if (!this.offcanvas) return;

        this.links = this.offcanvas.querySelectorAll('.nav-link');
        this.divider = this.offcanvas.querySelector('.divider');
        this.servicesDropdown = this.offcanvas.querySelector('.dropdown');
        this.servicesDropdownToggle = this.offcanvas.querySelector('.dropdown-toggle');

        // Add a property to store the dropdown close timeout
        this.dropdownCloseTimeout = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.bindClickOutside();
        this.setupDropdownHover();
    }

    isMobile() {
        return window.innerWidth < 992;
    }

    bindEvents() {
        this.offcanvas.addEventListener('show.bs.offcanvas', () => this.onShow());
        this.offcanvas.addEventListener('hide.bs.offcanvas', () => this.onHide());
        window.addEventListener('resize', () => this.handleResize());
    }

    onShow() {
        if (this.isMobile()) {
            this.offcanvas.classList.add('glass-effect');
            this.showDivider();
            this.addMobileClasses();
        }
    }

    onHide() {
        this.offcanvas.classList.remove('glass-effect');
        this.hideDivider();
        this.removeMobileClasses();
    }

    showDivider() {
        if (!this.divider) return;
        this.divider.style.display = 'block';
        requestAnimationFrame(() => this.divider.classList.add('show'));
    }

    hideDivider() {
        if (!this.divider) return;
        this.divider.classList.remove('show');
        setTimeout(() => {
            this.divider.style.display = 'none';
        }, 150);
    }

    addMobileClasses() {
        this.links.forEach(link => link.classList.add('in-offcanvas'));
    }

    removeMobileClasses() {
        this.links.forEach(link => link.classList.remove('in-offcanvas'));
    }

    handleResize() {
        if (!this.isMobile()) {
            this.offcanvas.classList.remove('glass-effect');
        } else if (this.offcanvas.classList.contains('show')) {
            this.offcanvas.classList.add('glass-effect');
        }
    }

    bindClickOutside() {
        document.addEventListener('click', (event) => {
            // Check if offcanvas is open
            if (this.offcanvas.classList.contains('show')) {
                // Check if the click is outside the offcanvas
                if (!this.offcanvas.contains(event.target)) {
                    // Use Bootstrap's offcanvas hide method
                    const offcanvasInstance = bootstrap.Offcanvas.getInstance(this.offcanvas);
                    if (offcanvasInstance) {
                        offcanvasInstance.hide();
                    }
                }
            }
        });
    }

    setupDropdownHover() {
        // Only apply hover effect on desktop
        if (!this.servicesDropdownToggle) return;

        // Desktop hover functionality
        this.servicesDropdownToggle.addEventListener('mouseenter', () => {
            // Clear any existing close timeout
            if (this.dropdownCloseTimeout) {
                clearTimeout(this.dropdownCloseTimeout);
                this.dropdownCloseTimeout = null;
            }

            if (!this.isMobile()) {
                const dropdownInstance = bootstrap.Dropdown.getInstance(this.servicesDropdownToggle);
                if (!dropdownInstance) {
                    new bootstrap.Dropdown(this.servicesDropdownToggle);
                }
                this.servicesDropdownToggle.click();
            }
        });

        // Add mouseleave event to close dropdown on desktop with a delay
        this.servicesDropdown.addEventListener('mouseleave', () => {
            if (!this.isMobile()) {
                // Set a timeout before closing the dropdown
                this.dropdownCloseTimeout = setTimeout(() => {
                    const dropdownInstance = bootstrap.Dropdown.getInstance(this.servicesDropdownToggle);
                    if (dropdownInstance) {
                        dropdownInstance.hide();
                    }
                }, 200); // 200ms delay before closing
            }
        });

        // Cancel the close timeout if mouse re-enters the dropdown
        this.servicesDropdown.addEventListener('mouseenter', () => {
            if (!this.isMobile() && this.dropdownCloseTimeout) {
                clearTimeout(this.dropdownCloseTimeout);
                this.dropdownCloseTimeout = null;
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => new NavMenu());