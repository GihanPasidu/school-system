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

// Student management functions
async function loadStudents() {
    try {
        showLoading('Loading students...');
        
        const students = await schoolDB.getAll('students');
        const gradeFilter = document.getElementById('grade-filter').value;
        const searchValue = document.getElementById('student-search').value;
        
        let filteredStudents = students;
        
        // Apply grade filter if selected
        if (gradeFilter) {
            filteredStudents = filteredStudents.filter(student => 
                student.grade === gradeFilter
            );
        }
        
        // Apply search filter if there's a search value
        if (searchValue) {
            const searchLower = searchValue.toLowerCase();
            filteredStudents = filteredStudents.filter(student => 
                student.name.toLowerCase().includes(searchLower) || 
                student.admission.toLowerCase().includes(searchLower)
            );
        }
        
        const studentsList = document.getElementById('students-list');
        studentsList.innerHTML = '';
        
        if (filteredStudents.length === 0) {
            studentsList.innerHTML = '<tr><td colspan="5" style="text-align: center;">No students found</td></tr>';
            hideLoading();
            return;
        }
        
        filteredStudents.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.admission}</td>
                <td>${student.name}</td>
                <td>Grade ${student.grade}</td>
                <td>${student.contact || 'N/A'}</td>
                <td>
                    <button onclick="viewStudentProfile(${student.id})" class="action-icon view"><i class="fas fa-eye"></i> View</button>
                    <button onclick="editStudent(${student.id})" class="action-icon edit"><i class="fas fa-edit"></i> Edit</button>
                    <button onclick="deleteStudent(${student.id})" class="action-icon delete"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            `;
            
            // Add staggered animation delay
            row.style.animation = `slideUp 0.4s ${0.05 * index}s var(--animation-timing) both`;
            
            studentsList.appendChild(row);
        });
        
        hideLoading();
    } catch (error) {
        console.error('Error loading students:', error);
        showNotification('Failed to load students. Please try again.', 'error');
        hideLoading();
    }
}

function showStudentForm() {
    document.getElementById('student-form').classList.remove('hidden');
    document.getElementById('student-id').value = '';
    document.getElementById('student-form').reset();
}

function hideStudentForm() {
    document.getElementById('student-form').classList.add('hidden');
}

async function saveStudent(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('student-id').value;
    const student = {
        name: document.getElementById('student-name').value,
        admission: document.getElementById('student-admission').value,
        dob: document.getElementById('student-dob').value,
        grade: document.getElementById('student-grade').value,
        contact: document.getElementById('student-contact').value,
        address: document.getElementById('student-address').value
    };
    
    try {
        if (studentId) {
            // Update existing student
            student.id = parseInt(studentId);
            await schoolDB.update('students', student);
            showNotification('Student updated successfully!');
        } else {
            // Add new student
            await schoolDB.add('students', student);
            showNotification('New student added successfully!');
        }
        
        hideStudentForm();
        await loadStudents();
        updateDashboard();
    } catch (error) {
        console.error('Error saving student:', error);
        showNotification('Failed to save student. Please try again.', 'error');
    }
}

async function editStudent(id) {
    try {
        const student = await schoolDB.getById('students', id);
        if (student) {
            document.getElementById('student-id').value = student.id;
            document.getElementById('student-name').value = student.name;
            document.getElementById('student-admission').value = student.admission;
            document.getElementById('student-dob').value = student.dob;
            document.getElementById('student-grade').value = student.grade;
            document.getElementById('student-contact').value = student.contact || '';
            document.getElementById('student-address').value = student.address || '';
            
            document.getElementById('student-form').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        showNotification('Failed to load student details. Please try again.', 'error');
    }
}

async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            await schoolDB.delete('students', id);
            await loadStudents();
            updateDashboard();
            showNotification('Student deleted successfully!');
        } catch (error) {
            console.error('Error deleting student:', error);
            showNotification('Failed to delete student. Please try again.', 'error');
        }
    }
}

async function searchStudents() {
    // Instead of making a separate DB call, let's just use loadStudents
    // which will respect both the search term and grade filter
    await loadStudents();
}

// New function to filter students by grade
async function filterStudentsByGrade() {
    // Reuse the loadStudents function which handles both search and grade filters
    await loadStudents();
    
    const gradeFilter = document.getElementById('grade-filter').value;
    if (gradeFilter) {
        showNotification(`Filtered to show Grade ${gradeFilter} students`);
    }
}

// Teacher management functions with animations
async function loadTeachers() {
    try {
        showLoading('Loading teachers...');
        
        const teachers = await schoolDB.getAll('teachers');
        const teachersList = document.getElementById('teachers-list');
        teachersList.innerHTML = '';
        
        if (teachers.length === 0) {
            teachersList.innerHTML = '<tr><td colspan="5" style="text-align: center;">No teachers found</td></tr>';
            hideLoading();
            return;
        }
        
        teachers.forEach((teacher, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.empId}</td>
                <td>${teacher.name}</td>
                <td>${teacher.subject}</td>
                <td>${teacher.contact}</td>
                <td>
                    <button onclick="viewTeacherProfile(${teacher.id})" class="action-icon view"><i class="fas fa-eye"></i> View</button>
                    <button onclick="editTeacher(${teacher.id})" class="action-icon edit"><i class="fas fa-edit"></i> Edit</button>
                    <button onclick="deleteTeacher(${teacher.id})" class="action-icon delete"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            `;
            
            // Add staggered animation delay
            row.style.animation = `slideUp 0.4s ${0.05 * index}s var(--animation-timing) both`;
            
            teachersList.appendChild(row);
        });
        
        hideLoading();
    } catch (error) {
        console.error('Error loading teachers:', error);
        showNotification('Failed to load teachers. Please try again.', 'error');
        hideLoading();
    }
}

function showTeacherForm() {
    document.getElementById('teacher-form').classList.remove('hidden');
    document.getElementById('teacher-id').value = '';
    document.getElementById('teacher-form').reset();
}

function hideTeacherForm() {
    document.getElementById('teacher-form').classList.add('hidden');
}

async function saveTeacher(event) {
    event.preventDefault();
    
    const teacherId = document.getElementById('teacher-id').value;
    const teacher = {
        name: document.getElementById('teacher-name').value,
        empId: document.getElementById('teacher-emp-id').value,
        subject: document.getElementById('teacher-subject').value,
        contact: document.getElementById('teacher-contact').value,
        email: document.getElementById('teacher-email').value,
        qualification: document.getElementById('teacher-qualification').value
    };
    
    try {
        if (teacherId) {
            // Update existing teacher
            teacher.id = parseInt(teacherId);
            await schoolDB.update('teachers', teacher);
            showNotification('Teacher updated successfully!');
        } else {
            // Add new teacher
            await schoolDB.add('teachers', teacher);
            showNotification('New teacher added successfully!');
        }
        
        hideTeacherForm();
        await loadTeachers();
        updateDashboard();
    } catch (error) {
        console.error('Error saving teacher:', error);
        showNotification('Failed to save teacher. Please try again.', 'error');
    }
}

async function editTeacher(id) {
    try {
        const teacher = await schoolDB.getById('teachers', id);
        if (teacher) {
            document.getElementById('teacher-id').value = teacher.id;
            document.getElementById('teacher-name').value = teacher.name;
            document.getElementById('teacher-emp-id').value = teacher.empId;
            document.getElementById('teacher-subject').value = teacher.subject;
            document.getElementById('teacher-contact').value = teacher.contact;
            document.getElementById('teacher-email').value = teacher.email || '';
            document.getElementById('teacher-qualification').value = teacher.qualification || '';
            
            document.getElementById('teacher-form').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error fetching teacher:', error);
        showNotification('Failed to load teacher details. Please try again.', 'error');
    }
}

async function deleteTeacher(id) {
    if (confirm('Are you sure you want to delete this teacher?')) {
        try {
            await schoolDB.delete('teachers', id);
            await loadTeachers();
            updateDashboard();
            showNotification('Teacher deleted successfully!');
        } catch (error) {
            console.error('Error deleting teacher:', error);
            showNotification('Failed to delete teacher. Please try again.', 'error');
        }
    }
}

async function searchTeachers() {
    const searchValue = document.getElementById('teacher-search').value;
    if (!searchValue.trim()) {
        await loadTeachers();
        return;
    }
    
    try {
        const results = await schoolDB.searchByField('teachers', 'name', searchValue);
        const teachersList = document.getElementById('teachers-list');
        teachersList.innerHTML = '';
        
        results.forEach(teacher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.empId}</td>
                <td>${teacher.name}</td>
                <td>${teacher.subject}</td>
                <td>${teacher.contact}</td>
                <td>
                    <button onclick="viewTeacherProfile(${teacher.id})" class="action-icon view"><i class="fas fa-eye"></i> View</button>
                    <button onclick="editTeacher(${teacher.id})" class="action-icon edit"><i class="fas fa-edit"></i> Edit</button>
                    <button onclick="deleteTeacher(${teacher.id})" class="action-icon delete"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            `;
            teachersList.appendChild(row);
        });
    } catch (error) {
        console.error('Error searching teachers:', error);
    }
}

// New functions to view profiles
async function viewStudentProfile(id) {
    try {
        const student = await schoolDB.getById('students', id);
        if (!student) {
            showNotification('Student not found.', 'error');
            return;
        }
        
        // Create and show modal with student information
        const modal = document.createElement('div');
        modal.className = 'profile-modal';
        
        const dob = student.dob ? new Date(student.dob).toLocaleDateString() : 'Not specified';
        // Get first letter of student name for avatar
        const firstLetter = student.name.charAt(0).toUpperCase();
        
        modal.innerHTML = `
            <div class="profile-content">
                <div class="profile-header">
                    <h2><i class="fas fa-user-graduate"></i> Student Profile</h2>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="profile-body">
                    <div class="profile-image">
                        <div class="profile-avatar">
                            ${firstLetter}
                        </div>
                        <h3>${student.name}</h3>
                        <p class="profile-subtitle">
                            <span class="badge">Grade ${student.grade}</span>
                            <span>ID: ${student.admission}</span>
                        </p>
                    </div>
                    <div class="profile-details">
                        <div class="detail-group">
                            <i class="fas fa-user"></i>
                            <label>Full Name</label>
                            <p>${student.name}</p>
                        </div>
                        <div class="detail-group">
                            <i class="fas fa-id-card"></i>
                            <label>Admission Number</label>
                            <p>${student.admission}</p>
                        </div>
                        <div class="detail-group">
                            <i class="fas fa-calendar-alt"></i>
                            <label>Date of Birth</label>
                            <p>${dob}</p>
                        </div>
                        <div class="detail-group">
                            <i class="fas fa-school"></i>
                            <label>Grade</label>
                            <p>Grade ${student.grade}</p>
                        </div>
                        <div class="detail-group">
                            <i class="fas fa-phone"></i>
                            <label>Contact</label>
                            <p>${student.contact || 'Not provided'}</p>
                        </div>
                        <div class="detail-group">
                            <i class="fas fa-map-marker-alt"></i>
                            <label>Address</label>
                            <p>${student.address || 'Not provided'}</p>
                        </div>
                    </div>
                </div>
                <div class="profile-footer">
                    <div class="profile-id">Student ID: ${student.id}</div>
                    <div class="profile-actions">
                        <button class="edit-profile-btn" onclick="editStudent(${student.id})"><i class="fas fa-edit"></i> Edit Profile</button>
                        <button class="close-modal-btn"><i class="fas fa-times"></i> Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        // Add active class to trigger animation after a small delay
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Close modal functionality
        const closeButtons = modal.querySelectorAll('.close-modal, .close-modal-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300); // Remove after animation
            });
        });
        
    } catch (error) {
        console.error('Error viewing student profile:', error);
        showNotification('Failed to load student profile.', 'error');
    }
}

async function viewTeacherProfile(id) {
    try {
        const teacher = await schoolDB.getById('teachers', id);
        if (!teacher) {
            showNotification('Teacher not found.', 'error');
            return;
        }
        
        // Create and show modal with teacher information
        const modal = document.createElement('div');
        modal.className = 'profile-modal';
        
        // Get first letter of teacher name for avatar
        const firstLetter = teacher.name.charAt(0).toUpperCase();
        
        modal.innerHTML = `
            <div class="profile-content">
                <div class="profile-header">
                    <h2><i class="fas fa-chalkboard-teacher"></i> Teacher Profile</h2>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="profile-body">
                    <div class="profile-image">
                        <div class="profile-avatar">
                            ${firstLetter}
                        </div>
                        <h3>${teacher.name}</h3>
                        <p class="profile-subtitle">
                            <span class="badge">${teacher.subject}</span>
                            <span>ID: ${teacher.empId}</span>
                        </p>
                    </div>
                    <div class="profile-details">
                        <div class="detail-group">
                            <i class="fas fa-user"></i>
                            <label>Full Name</label>
                            <p>${teacher.name}</p>
                        </div>
                        <div class="detail-group">
                            <i class="fas fa-id-badge"></i>
                            <label>Employee ID</label>
                            <p>${teacher.empId}</p>
                        </div>
                        <div class="detail-group">
                            <i class="fas fa-book"></i>
                            <label>Subject</label>
                            <p>${teacher.subject}</p>
                        </div>
                        <div class="detail-group">
                            <i class="fas fa-phone"></i>
                            <label>Contact</label>
                            <p>${teacher.contact || 'Not provided'}</p>
                        </div>
                        <div class="detail-group">
                            <i class="fas fa-envelope"></i>
                            <label>Email</label>
                            <p>${teacher.email || 'Not provided'}</p>
                        </div>
                        <div class="detail-group">
                            <i class="fas fa-user-graduate"></i>
                            <label>Qualification</label>
                            <p>${teacher.qualification || 'Not provided'}</p>
                        </div>
                    </div>
                </div>
                <div class="profile-footer">
                    <div class="profile-id">Teacher ID: ${teacher.id}</div>
                    <div class="profile-actions">
                        <button class="edit-profile-btn" onclick="editTeacher(${teacher.id})"><i class="fas fa-edit"></i> Edit Profile</button>
                        <button class="close-modal-btn"><i class="fas fa-times"></i> Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        // Add active class to trigger animation after a small delay
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Close modal functionality
        const closeButtons = modal.querySelectorAll('.close-modal, .close-modal-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300); // Remove after animation
            });
        });
        
    } catch (error) {
        console.error('Error viewing teacher profile:', error);
        showNotification('Failed to load teacher profile.', 'error');
    }
}

// Settings functions with loading animations
async function loadSettings() {
    try {
        const settings = await schoolDB.getAll('settings');
        const schoolSettings = settings.find(s => s.id === 'schoolInfo');
        
        if (schoolSettings) {
            document.getElementById('setting-school-name').value = schoolSettings.name || '';
            document.getElementById('setting-school-address').value = schoolSettings.address || '';
            document.getElementById('setting-school-phone').value = schoolSettings.phone || '';
            
            document.getElementById('schoolName').textContent = schoolSettings.name || 'School Management';
            document.getElementById('schoolAddress').textContent = schoolSettings.address || 'Offline System';
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

async function saveSettings(event) {
    event.preventDefault();
    
    showLoading('Saving settings...');
    
    const schoolSettings = {
        id: 'schoolInfo',
        name: document.getElementById('setting-school-name').value,
        address: document.getElementById('setting-school-address').value,
        phone: document.getElementById('setting-school-phone').value
    };
    
    try {
        await schoolDB.update('settings', schoolSettings);
        document.getElementById('schoolName').textContent = schoolSettings.name || 'School Management';
        document.getElementById('schoolAddress').textContent = schoolSettings.address || 'Offline System';
        
        // Highlight the updated elements
        highlightElement(document.getElementById('schoolName'));
        highlightElement(document.getElementById('schoolAddress'));
        
        hideLoading();
        showNotification('Settings saved successfully!');
    } catch (error) {
        console.error('Error saving settings:', error);
        hideLoading();
        showNotification('Failed to save settings. Please try again.', 'error');
    }
}

// Dashboard functions with animations
async function updateDashboard() {
    try {
        const students = await schoolDB.getAll('students');
        const teachers = await schoolDB.getAll('teachers');
        
        // Animate number counting
        animateCounter('student-count', 0, students.length, 1000);
        animateCounter('teacher-count', 0, teachers.length, 1000);
        
        // Update student-teacher ratio
        const ratio = teachers.length > 0 ? (students.length / teachers.length).toFixed(1) : 'N/A';
        document.getElementById('ratio').textContent = teachers.length > 0 ? `${ratio}:1` : 'N/A';
        
        // Highlight the updated elements
        highlightElement(document.getElementById('ratio'));
    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}

// Animate counter from start to end value
function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    const range = end - start;
    const minTimer = 50; // minimum timer interval
    let stepTime = Math.abs(Math.floor(duration / range));
    
    // Clamp step time
    stepTime = Math.max(stepTime, minTimer);
    
    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    let timer;
    
    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = Math.round(end - (remaining * range));
        element.textContent = value;
        
        if (value == end) {
            clearInterval(timer);
        }
    }
    
    timer = setInterval(run, stepTime);
    run();
}

// Data import/export functions with loading animations
async function exportData() {
    try {
        showLoading('Exporting data...');
        await schoolDB.exportData();
        hideLoading();
        showNotification('Data exported successfully! The file has been downloaded to your computer.');
    } catch (error) {
        console.error('Error exporting data:', error);
        hideLoading();
        showNotification('Failed to export data. Please try again.', 'error');
    }
}

async function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    showLoading('Importing data...');
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const data = JSON.parse(e.target.result);
            await schoolDB.importData(data);
            await initApp();
            hideLoading();
            showNotification('Data imported successfully!');
        } catch (error) {
            console.error('Error importing data:', error);
            hideLoading();
            showNotification('Failed to import data. Please ensure the file format is correct.', 'error');
        }
    };
    reader.readAsText(file);
}

// Make functions available globally
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
window.editTeacher = editTeacher;
window.deleteTeacher = deleteTeacher;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.stylizeCloudNextra = stylizeCloudNextra;
window.filterStudentsByGrade = filterStudentsByGrade;
window.viewStudentProfile = viewStudentProfile;
window.viewTeacherProfile = viewTeacherProfile;
