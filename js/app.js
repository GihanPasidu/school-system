document.addEventListener('DOMContentLoaded', () => {
    // Show loading overlay
    showLoading('Initializing system...');
    
    // Initialize UI components after database is ready
    setTimeout(() => {
        initApp();
        hideLoading();
    }, 1000); // Give database time to initialize

    // Navigation
    document.querySelectorAll('nav button').forEach(button => {
        button.addEventListener('click', () => {
            const target = button.id.split('-')[0]; // Extract page name from button id
            navigateTo(target);
        });
    });

    // Students management
    document.getElementById('add-student-btn').addEventListener('click', showStudentForm);
    document.getElementById('cancel-student').addEventListener('click', hideStudentForm);
    document.getElementById('student-form').addEventListener('submit', saveStudent);
    document.getElementById('student-search').addEventListener('input', searchStudents);
    document.getElementById('grade-filter').addEventListener('change', filterStudentsByGrade);
    
    // Student view tabs
    document.getElementById('list-view-tab').addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        hideLoading();
    }, 300);
}

// Apply highlight animation to an element
function highlightElement(element) {
    element.classList.add('item-highlight');
    setTimeout(() => {
        element.classList.remove('item-highlight');
    }, 1000);
}

// New function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addEventListener('click', () => switchStudentView('list'));
    document.getElementById('class-view-tab').addEventListener('click', () => switchStudentView('class'));

    // Teachers management
    document.getElementById('add-teacher-btn').addEventListener('click', showTeacherForm);
    document.getElementById('cancel-teacher').addEventListener('click', hideTeacherForm);
    document.getElementById('teacher-form').addEventListener('submit', saveTeacher);
    document.getElementById('teacher-search').addEventListener('input', searchTeachers);

    // Settings
    document.getElementById('school-settings-form').addEventListener('submit', saveSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add CloudNextra branding animation
    stylizeCloudNextra();
});

// Add CloudNextra branding animation
function stylizeCloudNextra() {
    // Find all copyright texts and enhance CloudNextra
    document.querySelectorAll('footer p').forEach(element => {
        if (element.textContent.includes('CloudNextra')) {
            const text = element.innerHTML;
            const enhancedText = text.replace('CloudNextra Solutions', '<span class="cloudnextra-logo">CloudNextra Solutions</span>');
            element.innerHTML = enhancedText;
        }
    });
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const msg = document.createElement('div');
        msg.className = 'loading-message';
        msg.id = 'loading-message';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(msg);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    
    // Force reflow to ensure the transition applies
    loadingOverlay.offsetWidth;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize application
async function initApp() {
    try {
        await loadStudents();
        await loadTeachers();
        await loadSettings();
        updateDashboard();
        
        // Show initialization message
        showNotification('School Management System initialized successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing system. Please check console for details.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        notification.style.backgroundColor = '#ea4335';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fadeout');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// Navigation function with animation
function navigateTo(pageId) {
    showLoading(`Loading ${pageId}...`);
    
    setTimeout(() => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page