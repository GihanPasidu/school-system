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
    document.getElementById(`${viewType}-view-tab`).classList.add('active');
    
    // Hide all views
    document.querySelectorAll('.student-view').forEach(view => {
        view.classList.add('hidden');
    });
    
    // Show selected view
    document.getElementById(`${viewType}-view`).classList.remove('hidden');
    
    // If switching to class view, refresh it
    if (viewType === 'class') {
        loadClassView();
    } else {
        loadStudents(); // Refresh the list view
    }
}

// Function to load and display students by grade in the class view
async function loadClassView() {
    try {
        showLoading('Loading class view...');
        
        const students = await schoolDB.getAll('students');
        const classViewContainer = document.getElementById('class-view-container');
        classViewContainer.innerHTML = '';
        
        // Group students by grade
        const gradeGroups = {};
        students.forEach(student => {
            const grade = student.grade || 'Unassigned';
            if (!gradeGroups[grade]) {
                gradeGroups[grade] = [];
            }
            gradeGroups[grade].push(student);
        });
        
        // Sort grades numerically
        const sortedGrades = Object.keys(gradeGroups).sort((a, b) => {
            // Handle 'Unassigned' separately
            if (a === 'Unassigned') return 1;
            if (b === 'Unassigned') return -1;
            return parseInt(a) - parseInt(b);
        });
        
        if (sortedGrades.length === 0) {
            classViewContainer.innerHTML = '<div class="empty-state">No students found</div>';
            hideLoading();
            return;
        }
        
        // Create accordion for each grade
        sortedGrades.forEach((grade, index) => {
            const studentsInGrade = gradeGroups[grade];
            const gradeAccordion = document.createElement('div');
            gradeAccordion.className = 'grade-accordion';
            
            // Create the header section
            const gradeHeader = document.createElement('div');
            gradeHeader.className = 'grade-header';
            gradeHeader.innerHTML = `
                <div class="grade-title">
                    <i class="fas fa-graduation-cap"></i> 
                    Grade ${grade}
                    <span class="grade-count">${studentsInGrade.length} students</span>
                </div>
                <div class="grade-actions">
                    <button class="toggle-grade-btn">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            `;
            
            // Create the content section
            const gradeContent = document.createElement('div');
            gradeContent.className = 'grade-content';
            
            // Add student cards
            const studentGrid = document.createElement('div');
            studentGrid.className = 'student-grid';
            
            studentsInGrade.forEach(student => {
                // Get first letter of student name for avatar
                const firstLetter = student.firstName.charAt(0).toUpperCase();
                
                // Create student card
                const studentCard = document.createElement('div');
                studentCard.className = 'student-card';
                studentCard.innerHTML = `
                    <div class="student-avatar">${firstLetter}</div>
                    <div class="student-info">
                        <h4>${student.firstName} ${student.lastName}</h4>
                        <p class="student-id">ID: ${student.id}</p>
                    </div>
                    <div class="card-actions">
                        <button onclick="viewStudentProfile('${student.id}')" class="action-icon view small">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="editStudent('${student.id}')" class="action-icon edit small">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteStudent('${student.id}')" class="action-icon delete small">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                
                studentGrid.appendChild(studentCard);
            });
            
            gradeContent.appendChild(studentGrid);
            
            // Append header and content to accordion
            gradeAccordion.appendChild(gradeHeader);
            gradeAccordion.appendChild(gradeContent);
            
            // Add animation delay based on index
            gradeAccordion.style.animation = `slideUp 0.4s ${0.1 * index}s var(--animation-timing) both`;
            
            // Add event listener to toggle accordion
            gradeHeader.addEventListener('click', () => {
                gradeAccordion.classList.toggle('active');
                const chevron = gradeHeader.querySelector('.fa-chevron-down');
                if (gradeAccordion.classList.contains('active')) {
                    chevron.style.transform = 'rotate(180deg)';
                } else {
                    chevron.style.transform = 'rotate(0)';
                }
            });
            
            // Append to container
            classViewContainer.appendChild(gradeAccordion);
            
            // Auto-open the first accordion
            if (index === 0) {
                setTimeout(() => {
                    gradeAccordion.classList.add('active');
                    gradeHeader.querySelector('.fa-chevron-down').style.transform = 'rotate(180deg)';
                }, 500);
            }
        });
        
        hideLoading();
    } catch (error) {
        console.error('Error loading class view:', error);
        hideLoading();
    }
}

// Modify the filterStudentsByGrade function to handle both views
async function filterStudentsByGrade() {
    // Reuse the loadStudents function which handles both search and grade filters
    await loadStudents();
    
    const gradeFilter = document.getElementById('grade-filter').value;
    if (gradeFilter) {
        showNotification(`Filtered to show Grade ${gradeFilter} students`);
        
        // If in class view, auto-open the filtered grade
        if (!document.getElementById('class-view').classList.contains('hidden')) {
            loadClassView().then(() => {
                // Find the grade accordion matching the filter
                const accordions = document.querySelectorAll('.grade-accordion');
                accordions.forEach(accordion => {
                    const gradeTitle = accordion.querySelector('.grade-title').textContent;
                    if (gradeTitle.includes(`Grade ${gradeFilter}`)) {
                        accordion.classList.add('active');
                        accordion.querySelector('.fa-chevron-down').style.transform = 'rotate(180deg)';
                    }
                });
            });
        }
    }
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
                student.grade === parseInt(gradeFilter) || student.grade === gradeFilter
            );
        }
        
        // Apply search filter if there's a search value
        if (searchValue) {
            const searchLower = searchValue.toLowerCase();
            filteredStudents = filteredStudents.filter(student => {
                const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
                const id = (student.id || '').toString().toLowerCase();
                return fullName.includes(searchLower) || id.includes(searchLower);
            });
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
                <td>${student.id || ''}</td>
                <td>${student.firstName} ${student.lastName}</td>
                <td>Grade ${student.grade}</td>
                <td>${student.parentInfo?.phone || 'N/A'}</td>
                <td>
                    <button onclick="viewStudentProfile('${student.id}')" class="action-icon view"><i class="fas fa-eye"></i> View</button>
                    <button onclick="editStudent('${student.id}')" class="action-icon edit"><i class="fas fa-edit"></i> Edit</button>
                    <button onclick="deleteStudent('${student.id}')" class="action-icon delete"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            `;
            
            // Add staggered animation delay
            row.style.animation = `slideUp 0.4s ${0.05 * index}s var(--animation-timing) both`;
            
            studentsList.appendChild(row);
        });
        
        // Call loadClassView if the class view is visible
        if (document.getElementById('class-view') && 
            !document.getElementById('class-view').classList.contains('hidden')) {
            await loadClassView();
        }
        
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
        firstName: document.getElementById('student-first-name').value,
        lastName: document.getElementById('student-last-name').value,
        dateOfBirth: document.getElementById('student-dob').value,
        grade: document.getElementById('student-grade').value,
        section: document.getElementById('student-section').value,
        parentInfo: {
            phone: document.getElementById('parent-phone').value,
            email: document.getElementById('parent-email').value
        },
        address: document.getElementById('student-address').value,
        enrollmentDate: document.getElementById('student-enrollment-date').value,
        medicalInfo: {
            bloodGroup: document.getElementById('student-blood-group').value
        }
    };
    
    try {
        if (studentId) {
            // Update existing student - preserve id type (string or number)
            student.id = studentId;
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
        console.log("Editing student with ID:", id);
        const student = await schoolDB.getById('students', id);
        
        if (!student) {
            console.error("Student not found with ID:", id);
            showNotification('Failed to load student details. Student not found.', 'error');
            return;
        }
        
        console.log("Found student to edit:", student);
        
        document.getElementById('student-id').value = student.id;
        document.getElementById('student-first-name').value = student.firstName || '';
        document.getElementById('student-last-name').value = student.lastName || '';
        document.getElementById('student-dob').value = student.dateOfBirth || '';
        document.getElementById('student-grade').value = student.grade || '';
        document.getElementById('student-section').value = student.section || '';
        document.getElementById('parent-phone').value = student.parentInfo?.phone || '';
        document.getElementById('parent-email').value = student.parentInfo?.email || '';
        document.getElementById('student-address').value = student.address || '';
        document.getElementById('student-enrollment-date').value = student.enrollmentDate || '';
        document.getElementById('student-blood-group').value = student.medicalInfo?.bloodGroup || '';
        
        document.getElementById('student-form').classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching student:', error);
        showNotification('Failed to load student details. Please try again.', 'error');
    }
}

async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            console.log("Deleting student with ID:", id);
            const result = await schoolDB.delete('students', id);
            
            if (result) {
                await loadStudents();
                updateDashboard();
                showNotification('Student deleted successfully!');
            } else {
                showNotification('Student not found.', 'error');
            }
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
                <td>${teacher.id || ''}</td>
                <td>${teacher.firstName} ${teacher.lastName}</td>
                <td>${teacher.subject || ''}</td>
                <td>${teacher.phone || ''}</td>
                <td>
                    <button onclick="viewTeacherProfile('${teacher.id}')" class="action-icon view"><i class="fas fa-eye"></i> View</button>
                    <button onclick="editTeacher('${teacher.id}')" class="action-icon edit"><i class="fas fa-edit"></i> Edit</button>
                    <button onclick="deleteTeacher('${teacher.id}')" class="action-icon delete"><i class="fas fa-trash-alt"></i> Delete</button>
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
        firstName: document.getElementById('teacher-first-name').value,
        lastName: document.getElementById('teacher-last-name').value,
        email: document.getElementById('teacher-email').value,
        subject: document.getElementById('teacher-subject').value,
        department: document.getElementById('teacher-department').value,
        role: document.getElementById('teacher-role').value,
        phone: document.getElementById('teacher-phone').value,
        education: document.getElementById('teacher-qualification').value,
        joinDate: document.getElementById('teacher-join-date').value,
        isFullTime: document.getElementById('teacher-full-time').checked
    };
    
    try {
        if (teacherId) {
            // Update existing teacher
            teacher.id = teacherId;
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
            document.getElementById('teacher-first-name').value = teacher.firstName || '';
            document.getElementById('teacher-last-name').value = teacher.lastName || '';
            document.getElementById('teacher-email').value = teacher.email || '';
            document.getElementById('teacher-subject').value = teacher.subject || '';
            document.getElementById('teacher-department').value = teacher.department || '';
            document.getElementById('teacher-role').value = teacher.role || '';
            document.getElementById('teacher-phone').value = teacher.phone || '';
            document.getElementById('teacher-qualification').value = teacher.education || '';
            document.getElementById('teacher-join-date').value = teacher.joinDate || '';
            document.getElementById('teacher-full-time').checked = teacher.isFullTime || false;
            
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
        const results = await schoolDB.searchByField('teachers', 'firstName', searchValue);
        const teachersList = document.getElementById('teachers-list');
        teachersList.innerHTML = '';
        
        results.forEach(teacher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.id || ''}</td>
                <td>${teacher.firstName} ${teacher.lastName}</td>
                <td>${teacher.subject || ''}</td>
                <td>${teacher.phone || ''}</td>
                <td>
                    <button onclick="viewTeacherProfile('${teacher.id}')" class="action-icon view"><i class="fas fa-eye"></i> View</button>
                    <button onclick="editTeacher('${teacher.id}')" class="action-icon edit"><i class="fas fa-edit"></i> Edit</button>
                    <button onclick="deleteTeacher('${teacher.id}')" class="action-icon delete"><i class="fas fa-trash-alt"></i> Delete</button>
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
        console.log("Opening student profile for ID:", id); // Debug log
        
        // Get all students and find the one with matching id
        const students = await schoolDB.getAll('students');
        const student = students.find(s => s.id.toString() === id.toString());
        
        if (!student) {
            console.error("Student not found with ID:", id);
            showNotification('Student not found.', 'error');
            return;
        }
        
        console.log("Found student:", student); // Debug log
        
        // Fetch student's marks
        const allMarks = await schoolDB.getAll('marks') || [];
        const studentMarks = allMarks.filter(mark => mark.studentId === student.id);
        
        // Create and show modal with student information
        const modal = document.createElement('div');
        modal.className = 'profile-modal';
        
        const dob = student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not specified';
        // Get first letter of student name for avatar
        const firstLetter = student.firstName.charAt(0).toUpperCase();
        
        modal.innerHTML = `
            <div class="profile-content">
                <div class="profile-header">
                    <h2><i class="fas fa-user-graduate"></i> Student Profile</h2>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="profile-tabs">
                    <button class="tab-btn active" data-tab="info"><i class="fas fa-info-circle"></i> Info</button>
                    <button class="tab-btn" data-tab="marks"><i class="fas fa-chart-line"></i> Marks</button>
                </div>
                <div class="profile-body">
                    <div class="tab-content active" id="tab-info">
                        <div class="profile-image">
                            <div class="profile-avatar">
                                ${firstLetter}
                            </div>
                            <h3>${student.firstName} ${student.lastName}</h3>
                            <p class="profile-subtitle">
                                <span class="badge">Grade ${student.grade}</span>
                                <span>Section: ${student.section || 'N/A'}</span>
                            </p>
                        </div>
                        <div class="profile-details">
                            <div class="detail-group">
                                <i class="fas fa-user"></i>
                                <label>Full Name</label>
                                <p>${student.firstName} ${student.lastName}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-id-card"></i>
                                <label>Student ID</label>
                                <p>${student.id}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-venus-mars"></i>
                                <label>Gender</label>
                                <p>${student.gender || 'Not specified'}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-calendar-alt"></i>
                                <label>Date of Birth</label>
                                <p>${dob}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-school"></i>
                                <label>Grade & Section</label>
                                <p>Grade ${student.grade} - Section ${student.section || 'N/A'}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-phone"></i>
                                <label>Parent Contact</label>
                                <p>${student.parentInfo?.phone || 'Not provided'}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-envelope"></i>
                                <label>Parent Email</label>
                                <p>${student.parentInfo?.email || 'Not provided'}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-map-marker-alt"></i>
                                <label>Address</label>
                                <p>${student.address || 'Not provided'}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-calendar-check"></i>
                                <label>Enrollment Date</label>
                                <p>${student.enrollmentDate || 'Not provided'}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-tint"></i>
                                <label>Blood Group</label>
                                <p>${student.medicalInfo?.bloodGroup || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                    <div class="tab-content" id="tab-marks">
                        <div class="marks-container">
                            <div class="marks-header">
                                <h3>Academic Performance</h3>
                                <button class="add-marks-btn" onclick="showMarksForm('${student.id}')">
                                    <i class="fas fa-plus"></i> Add Marks
                                </button>
                            </div>
                            <div class="marks-list" id="student-marks-list">
                                ${renderStudentMarks(studentMarks)}
                            </div>
                            <div class="marks-form hidden" id="marks-form-container">
                                <form id="marks-form">
                                    <input type="hidden" id="marks-student-id" value="${student.id}">
                                    <input type="hidden" id="marks-id" value="">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="marks-subject">Subject</label>
                                            <input type="text" id="marks-subject" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="marks-term">Term/Period</label>
                                            <select id="marks-term" required>
                                                <option value="Term 1">Term 1</option>
                                                <option value="Term 2">Term 2</option>
                                                <option value="Term 3">Term 3</option>
                                                <option value="Final">Final</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="marks-score">Score</label>
                                            <input type="number" id="marks-score" min="0" max="100" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="marks-grade">Grade</label>
                                            <select id="marks-grade" required>
                                                <option value="A+">A+</option>
                                                <option value="A">A</option>
                                                <option value="B+">B+</option>
                                                <option value="B">B</option>
                                                <option value="C+">C+</option>
                                                <option value="C">C</option>
                                                <option value="S">S</option>
                                                <option value="F">F</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="marks-comments">Comments</label>
                                            <textarea id="marks-comments" rows="2"></textarea>
                                        </div>
                                    </div>
                                    <div class="form-actions">
                                        <button type="button" onclick="hideMarksForm()" class="secondary-button">
                                            <i class="fas fa-times"></i> Cancel
                                        </button>
                                        <button type="button" onclick="saveMarks()" class="success-button">
                                            <i class="fas fa-save"></i> Save Marks
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="profile-footer">
                    <div class="profile-id">Student ID: ${student.id}</div>
                    <div class="profile-actions">
                        <button class="close-modal-btn"><i class="fas fa-times"></i> Close</button>
                    </div>
                </div>
            </div>
        `;
        
        // Append to DOM first
        document.body.appendChild(modal);
        
        // Debug check to make sure modal was appended
        console.log("Modal appended to DOM");
        
        // Ensure the modal is visible with increased delay
        setTimeout(() => {
            console.log("Showing modal - adding active class");
            modal.classList.add('active');
            
            // Setup tab functionality after modal is visible
            setupModalTabs(modal);
            
            // Setup close functionality
            setupModalClose(modal);
        }, 100); // Increased delay for better rendering
        
    } catch (error) {
        console.error('Error details:', error);
        showNotification('Failed to load student profile. Please try again.', 'error');
    }
}

// Helper function to setup modal tabs
function setupModalTabs(modal) {
    try {
        const tabButtons = modal.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show corresponding tab content
                modal.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                modal.querySelector(`#tab-${tab}`).classList.add('active');
            });
        });
    } catch (err) {
        console.error("Error setting up tabs:", err);
    }
}

// Helper function to setup modal close
function setupModalClose(modal) {
    try {
        const closeButtons = modal.querySelectorAll('.close-modal, .close-modal-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300); // Remove after animation
            });
        });
    } catch (err) {
        console.error("Error setting up close buttons:", err);
    }
}

async function viewTeacherProfile(id) {
    try {
        console.log("Opening teacher profile for ID:", id); // Debug log
        
        // Get the teacher directly by ID
        const teacher = await schoolDB.getById('teachers', id);
        if (!teacher) {
            showNotification('Teacher not found.', 'error');
            return;
        }
        
        // Create and show modal with teacher information
        const modal = document.createElement('div');
        modal.className = 'profile-modal';
        
        // Get first letter of teacher name for avatar
        const firstLetter = teacher.firstName.charAt(0).toUpperCase();
        
        modal.innerHTML = `
            <div class="profile-content">
                <div class="profile-header">
                    <h2><i class="fas fa-chalkboard-teacher"></i> Teacher Profile</h2>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="profile-body">
                    <div class="tab-content active" id="tab-info">
                        <div class="profile-image">
                            <div class="profile-avatar">
                                ${firstLetter}
                            </div>
                            <h3>${teacher.firstName} ${teacher.lastName}</h3>
                            <p class="profile-subtitle">
                                <span class="badge">${teacher.subject}</span>
                                <span>Role: ${teacher.role || 'Teacher'}</span>
                            </p>
                        </div>
                        <div class="profile-details">
                            <div class="detail-group">
                                <i class="fas fa-user"></i>
                                <label>Full Name</label>
                                <p>${teacher.firstName} ${teacher.lastName}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-id-badge"></i>
                                <label>Employee ID</label>
                                <p>${teacher.id}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-book"></i>
                                <label>Subject</label>
                                <p>${teacher.subject}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-building"></i>
                                <label>Department</label>
                                <p>${teacher.department || 'Not specified'}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-phone"></i>
                                <label>Contact</label>
                                <p>${teacher.phone || 'Not provided'}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-envelope"></i>
                                <label>Email</label>
                                <p>${teacher.email || 'Not provided'}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-user-graduate"></i>
                                <label>Education</label>
                                <p>${teacher.education || 'Not provided'}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-calendar-alt"></i>
                                <label>Join Date</label>
                                <p>${teacher.joinDate || 'Not provided'}</p>
                            </div>
                            <div class="detail-group">
                                <i class="fas fa-clock"></i>
                                <label>Employment Type</label>
                                <p>${teacher.isFullTime ? 'Full-time' : 'Part-time'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="profile-footer">
                    <div class="profile-id">Teacher ID: ${teacher.id}</div>
                    <div class="profile-actions">
                        <button class="close-modal-btn"><i class="fas fa-times"></i> Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Ensure the modal is visible by waiting for the DOM to update
        setTimeout(() => {
            console.log("Showing modal");
            modal.classList.add('active');
        }, 50);
        
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

// Render student marks
function renderStudentMarks(marks) {
    if (!marks || marks.length === 0) {
        return `<div class="no-marks">No marks recorded for this student yet.</div>`;
    }
    
    // Group marks by term/period
    const marksByTerm = {};
    marks.forEach(mark => {
        if (!marksByTerm[mark.term]) {
            marksByTerm[mark.term] = [];
        }
        marksByTerm[mark.term].push(mark);
    });
    
    let html = '';
    
    // Render marks by term
    for (const [term, termMarks] of Object.entries(marksByTerm)) {
        html += `
            <div class="marks-term">
                <h4>${term}</h4>
                <div class="marks-table-wrapper">
                    <table class="marks-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Score</th>
                                <th>Grade</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        termMarks.forEach(mark => {
            html += `
                <tr>
                    <td>${mark.subject}</td>
                    <td>${mark.score}/100</td>
                    <td><span class="grade-badge grade-${mark.grade.charAt(0).toLowerCase()}">${mark.grade}</span></td>
                    <td>
                        <button onclick="editMarks('${mark.id}')" class="action-icon edit small"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteMarks('${mark.id}')" class="action-icon delete small"><i class="fas fa-trash-alt"></i></button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    return html;
}

function showMarksForm(studentId) {
    try {
        console.log("Opening marks form for student:", studentId);
        const formContainer = document.getElementById('marks-form-container');
        if (!formContainer) {
            console.error("Marks form container not found");
            return;
        }
        
        formContainer.classList.remove('hidden');
        document.getElementById('marks-student-id').value = studentId;
        document.getElementById('marks-id').value = '';
        document.getElementById('marks-form').reset();
    } catch (err) {
        console.error("Error showing marks form:", err);
        showNotification("Error showing marks form", 'error');
    }
}

function hideMarksForm() {
    try {
        const formContainer = document.getElementById('marks-form-container');
        if (formContainer) {
            formContainer.classList.add('hidden');
        }
    } catch (err) {
        console.error("Error hiding marks form:", err);
    }
}

async function saveMarks() {
    try {
        const markId = document.getElementById('marks-id').value.trim();
        const studentIdElement = document.getElementById('marks-student-id');
        const studentId = studentIdElement.value;
        
        if (!studentId) {
            throw new Error("Invalid student ID");
        }
        
        const mark = {
            studentId: studentId,
            subject: document.getElementById('marks-subject').value,
            term: document.getElementById('marks-term').value,
            score: parseInt(document.getElementById('marks-score').value),
            grade: document.getElementById('marks-grade').value,
            comments: document.getElementById('marks-comments').value,
            date: new Date().toISOString()
        };
        
        if (markId) {
            // Update existing mark
            mark.id = markId;
            await schoolDB.update('marks', mark);
            showNotification('Marks updated successfully!');
        } else {
            // Add new marks
            await schoolDB.add('marks', mark);
            showNotification('New marks added successfully!');
        }
        
        // Refresh the student marks display
        const allMarks = await schoolDB.getAll('marks');
        const studentMarks = allMarks.filter(m => m.studentId === mark.studentId);
        const marksListElement = document.getElementById('student-marks-list');
        if (marksListElement) {
            marksListElement.innerHTML = renderStudentMarks(studentMarks);
        }
        
        hideMarksForm();
    } catch (error) {
        console.error('Error saving marks:', error);
        showNotification('Failed to save marks. Please try again.', 'error');
    }
}

async function editMarks(id) {
    try {
        console.log("Editing mark with ID:", id);
        const mark = await schoolDB.getById('marks', id);
        if (!mark) {
            showNotification('Mark not found.', 'error');
            return;
        }
        
        document.getElementById('marks-id').value = mark.id;
        document.getElementById('marks-student-id').value = mark.studentId;
        document.getElementById('marks-subject').value = mark.subject;
        document.getElementById('marks-term').value = mark.term;
        document.getElementById('marks-score').value = mark.score;
        document.getElementById('marks-grade').value = mark.grade;
        document.getElementById('marks-comments').value = mark.comments || '';
        
        const formContainer = document.getElementById('marks-form-container');
        if (formContainer) {
            formContainer.classList.remove('hidden');
        } else {
            console.error("Marks form container not found");
        }
    } catch (error) {
        console.error('Error editing mark:', error);
        showNotification('Failed to load mark details. Please try again.', 'error');
    }
}

async function deleteMarks(id) {
    try {
        if (!confirm('Are you sure you want to delete these marks?')) {
            return;
        }
        
        console.log("Deleting mark with ID:", id);
        const mark = await schoolDB.getById('marks', id);
        if (!mark) {
            showNotification('Mark not found.', 'error');
            return;
        }
        
        const studentId = mark.studentId;
        await schoolDB.delete('marks', id);
        
        // Refresh the student marks display
        const allMarks = await schoolDB.getAll('marks');
        const studentMarks = allMarks.filter(m => m.studentId === studentId);
        const marksListElement = document.getElementById('student-marks-list');
        if (marksListElement) {
            marksListElement.innerHTML = renderStudentMarks(studentMarks);
        }
        
        showNotification('Marks deleted successfully!');
    } catch (error) {
        console.error('Error deleting mark:', error);
        showNotification('Failed to delete marks. Please try again.', 'error');
    }
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
window.showMarksForm = showMarksForm;
window.hideMarksForm = hideMarksForm;
window.saveMarks = saveMarks;
window.editMarks = editMarks;
window.deleteMarks = deleteMarks;
window.switchStudentView = switchStudentView;
window.loadClassView = loadClassView;
