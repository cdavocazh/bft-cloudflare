/**
 * BFT Workout Tracker - Utility Functions
 */

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast: 'success', 'error', 'info'
 */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;

    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

/**
 * Format a date string to a more readable format
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format a number with commas as thousands separator
 * @param {number} num - The number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num.toLocaleString();
}

/**
 * Debounce a function call
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} Debounced function
 */
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

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @returns {string} Today's date
 */
function getTodayISO() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Convert form data to object
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Form data as object
 */
function formToObject(form) {
    const formData = new FormData(form);
    const obj = {};

    for (const [key, value] of formData.entries()) {
        if (obj[key]) {
            if (Array.isArray(obj[key])) {
                obj[key].push(value);
            } else {
                obj[key] = [obj[key], value];
            }
        } else {
            obj[key] = value;
        }
    }

    return obj;
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Escape HTML special characters
 * @param {string} str - The string to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
