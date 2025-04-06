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

// Function to switch between list and class views of students
function switchStudentView(viewType) {
    // Update active tab
    document.querySelectorAll('.student-view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewType}-view-tab`).addClass('active');

    // Toggle visibility of different views
    if (viewType === 'list') {
        document.getElementById('list-view').classList.remove('hidden');
        document.getElementById('class-view').classList.add('hidden');
    } else if (viewType === 'class') {
        document.getElementById('list-view').classList.add('hidden');
        document.getElementById('class-view').classList.remove('hidden');
        
        // Render class view if it's empty
        if (document.getElementById('class-view-container').children.length === 0) {
            renderClassView();
        }
    }
}

// Load students from the database
async function loadStudents() {
    try {
        const students = await schoolDB.getAll('students');
        renderStudents(students);
        document.getElementById('student-count').textContent = students.length;
        return students;
    } catch (error) {
        console.error('Error loading students:', error);
        showNotification('Failed to load students data.', 'error');
        return [];
    }
}

// Render students list
function renderStudents(students) {
    const studentsList = document.getElementById('students-list');
    studentsList.innerHTML = '';

    if (students.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" class="empty-message">No students found</td>';
        studentsList.appendChild(row);
        return;
    }

    students.forEach(student => {
        const row = document.createElement('tr');
        row.dataset.id = student.id;
        
        row.innerHTML = `
            <td>${student.id || ''}</td>
            <td>${student.firstName || ''} ${student.lastName || ''}</td>
            <td>${student.grade || ''}</td>
            <td>${student.parentInfo?.phone || ''}</td>
            <td class="actions">
                <button class="action-icon view" onclick="viewStudent('${student.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-icon edit" onclick="editStudent('${student.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-icon delete" onclick="deleteStudent('${student.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        studentsList.appendChild(row);
    });
}

// Render class view of students
function renderClassView() {
    const classViewContainer = document.getElementById('class-view-container');
    classViewContainer.innerHTML = '';
    
    // Get all students
    schoolDB.getAll('students').then(students => {
        // Group students by grade
        const gradeGroups = {};
        students.forEach(student => {
            const grade = student.grade || 'Unassigned';
            if (!gradeGroups[grade]) {
                gradeGroups[grade] = [];
            }
            gradeGroups[grade].push(student);
        });
        
        // Sort grades
        const sortedGrades = Object.keys(gradeGroups).sort((a, b) => {
            // Convert to numbers for proper sorting, but keep 'Unassigned' at the end
            if (a === 'Unassigned') return 1;
            if (b === 'Unassigned') return -1;
            return Number(a) - Number(b);
        });
        
        // Create grade sections
        sortedGrades.forEach(grade => {
            const gradeSection = document.createElement('div');
            gradeSection.className = 'grade-section';
            
            const gradeTitle = document.createElement('h3');
            gradeTitle.textContent = grade === 'Unassigned' ? 'Unassigned' : `Grade ${grade}`;
            gradeSection.appendChild(gradeTitle);
            
            const studentsGrid = document.createElement('div');
            studentsGrid.className = 'student-cards';
            
            // Add student cards
            gradeGroups[grade].forEach(student => {
                const studentCard = document.createElement('div');
                studentCard.className = 'student-card';
                studentCard.dataset.id = student.id;
                
                // Add student initials or profile image
                const initialsElement = document.createElement('div');
                initialsElement.className = 'student-initials';
                initialsElement.textContent = `${student.firstName ? student.firstName[0] : ''}${student.lastName ? student.lastName[0] : ''}`;
                
                // Add student details
                const detailsElement = document.createElement('div');
                detailsElement.className = 'student-details';
                detailsElement.innerHTML = `
                    <div class="student-name">${student.firstName || ''} ${student.lastName || ''}</div>
                    <div class="student-id">ID: ${student.id || ''}</div>
                `;
                
                // Add action buttons
                const actionsElement = document.createElement('div');
                actionsElement.className = 'student-actions';
                actionsElement.innerHTML = `
                    <button onclick="viewStudent('${student.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editStudent('${student.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                `;
                
                studentCard.appendChild(initialsElement);
                studentCard.appendChild(detailsElement);
                studentCard.appendChild(actionsElement);
                
                studentsGrid.appendChild(studentCard);
            });
            
            gradeSection.appendChild(studentsGrid);
            classViewContainer.appendChild(gradeSection);
        });
    });
}

// Show student form for adding a new student
function showStudentForm() {
    const form = document.getElementById('student-form');
    form.reset();
    document.getElementById('student-id').value = '';
    form.classList.remove('hidden');
    form.querySelector('h3').textContent = 'Add New Student';
    document.getElementById('student-name').focus();
}

// Hide student form
function hideStudentForm() {
    document.getElementById('student-form').classList.add('hidden');
}

// Save student data
async function saveStudent(event) {
    event.preventDefault();
    
    try {
        const form = document.getElementById('student-form');
        const studentId = document.getElementById('student-id').value;
        
        // Parse form data
        const fullName = document.getElementById('student-name').value;
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        const studentData = {
            id: studentId || undefined, // Use undefined for new students
            firstName: firstName,
            lastName: lastName,
            grade: document.getElementById('student-grade').value,
            dateOfBirth: document.getElementById('student-dob').value,
            address: document.getElementById('student-address').value,
            parentInfo: {
                phone: document.getElementById('student-contact').value
            },
            admission: document.getElementById('student-admission').value,
            enrollmentDate: new Date().toISOString().split('T')[0]
        };
        
        // Save to database
        if (studentId) {
            await schoolDB.update('students', studentData);
            showNotification('Student updated successfully!');
        } else {
            await schoolDB.add('students', studentData);
            showNotification('Student added successfully!');
        }
        
        // Refresh student list
        await loadStudents();
        renderClassView();
        updateDashboard();
        
        // Hide form
        hideStudentForm();
    } catch (error) {
        console.error('Error saving student:', error);
        showNotification('Failed to save student data.', 'error');
    }
}

// View student details
async function viewStudent(id) {
    try {
        const student = await schoolDB.getById('students', id);
        
        if (!student) {
            showNotification('Student not found', 'error');
            return;
        }
        
        // You might want to create a modal to show student details
        // For now, we'll just console.log the data and highlight the row
        console.log('Student Details:', student);
        
        // Highlight the student's row in the table
        const row = document.querySelector(`#students-list tr[data-id="${id}"]`);
        if (row) {
            highlightElement(row);
        }
        
        // Highlight the student's card in the class view
        const card = document.querySelector(`#class-view .student-card[data-id="${id}"]`);
        if (card) {
            highlightElement(card);
        }
    } catch (error) {
        console.error('Error viewing student:', error);
        showNotification('Failed to load student details.', 'error');
    }
}

// Edit student
async function editStudent(id) {
    try {
        const student = await schoolDB.getById('students', id);
        
        if (!student) {
            showNotification('Student not found', 'error');
            return;
        }
        
        // Populate form fields
        document.getElementById('student-id').value = student.id;
        document.getElementById('student-name').value = `${student.firstName || ''} ${student.lastName || ''}`;
        document.getElementById('student-grade').value = student.grade || '';
        document.getElementById('student-dob').value = student.dateOfBirth || '';
        document.getElementById('student-address').value = student.address || '';
        document.getElementById('student-contact').value = student.parentInfo?.phone || '';
        document.getElementById('student-admission').value = student.admission || '';
        
        // Show form
        const form = document.getElementById('student-form');
        form.classList.remove('hidden');
        form.querySelector('h3').textContent = 'Edit Student';
    } catch (error) {
        console.error('Error editing student:', error);
        showNotification('Failed to load student data for editing.', 'error');
    }
}

// Delete student (updated to use custom confirm dialog)
async function deleteStudent(id) {
    showConfirmDialog('Are you sure you want to delete this student? This cannot be undone.', async () => {
        try {
            showLoading('Deleting student...');
            await schoolDB.delete('students', id);
            hideLoading();
            showNotification('Student deleted successfully');
            await loadStudents();
            renderClassView();
            updateDashboard();
        } catch (error) {
            hideLoading();
            console.error('Error deleting student:', error);
            showNotification('Failed to delete student.', 'error');
        }
    });
}

// Search students
async function searchStudents() {
    const searchTerm = document.getElementById('student-search').value.trim().toLowerCase();
    const gradeFilter = document.getElementById('grade-filter').value;
    
    try {
        let students = await schoolDB.getAll('students');
        
        // Apply search filter if there's a search term
        if (searchTerm) {
            students = students.filter(student => {
                const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
                return fullName.includes(searchTerm) || 
                       (student.id && student.id.toString().toLowerCase().includes(searchTerm));
            });
        }
        
        // Apply grade filter if selected
        if (gradeFilter) {
            students = students.filter(student => 
                student.grade === gradeFilter || student.grade === parseInt(gradeFilter)
            );
        }
        
        renderStudents(students);
    } catch (error) {
        console.error('Error searching students:', error);
        showNotification('Failed to search students.', 'error');
    }
}

// Filter students by grade
function filterStudentsByGrade() {
    // Reuse search function since it already handles the grade filter
    searchStudents();
}

// Load teachers from the database
async function loadTeachers() {
    try {
        const teachers = await schoolDB.getAll('teachers');
        renderTeachers(teachers);
        document.getElementById('teacher-count').textContent = teachers.length;
        return teachers;
    } catch (error) {
        console.error('Error loading teachers:', error);
        showNotification('Failed to load teachers data.', 'error');
        return [];
    }
}

// Render teachers list
function renderTeachers(teachers) {
    const teachersList = document.getElementById('teachers-list');
    teachersList.innerHTML = '';
    
    if (teachers.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" class="empty-message">No teachers found</td>';
        teachersList.appendChild(row);
        return;
    }
    
    teachers.forEach(teacher => {
        const row = document.createElement('tr');
        row.dataset.id = teacher.id;
        
        row.innerHTML = `
            <td>${teacher.id || ''}</td>
            <td>${teacher.firstName || ''} ${teacher.lastName || ''}</td>
            <td>${teacher.subject || ''}</td>
            <td>${teacher.phone || ''}</td>
            <td class="actions">
                <button class="action-icon view" onclick="viewTeacher('${teacher.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-icon edit" onclick="editTeacher('${teacher.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-icon delete" onclick="deleteTeacher('${teacher.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        teachersList.appendChild(row);
    });
}

// Show teacher form for adding a new teacher
function showTeacherForm() {
    const form = document.getElementById('teacher-form');
    form.reset();
    document.getElementById('teacher-id').value = '';
    form.classList.remove('hidden');
    form.querySelector('h3').textContent = 'Add New Teacher';
    document.getElementById('teacher-name').focus();
}

// Hide teacher form
function hideTeacherForm() {
    document.getElementById('teacher-form').classList.add('hidden');
}

// Save teacher data
async function saveTeacher(event) {
    event.preventDefault();
    
    try {
        const form = document.getElementById('teacher-form');
        const teacherId = document.getElementById('teacher-id').value;
        
        // Parse form data
        const fullName = document.getElementById('teacher-name').value;
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        const teacherData = {
            id: teacherId || undefined, // Use undefined for new teachers
            firstName: firstName,
            lastName: lastName,
            subject: document.getElementById('teacher-subject').value,
            phone: document.getElementById('teacher-contact').value,
            email: document.getElementById('teacher-email').value,
            education: document.getElementById('teacher-qualification').value,
            employeeId: document.getElementById('teacher-emp-id').value
        };
        
        // Save to database
        if (teacherId) {
            await schoolDB.update('teachers', teacherData);
            showNotification('Teacher updated successfully!');
        } else {
            await schoolDB.add('teachers', teacherData);
            showNotification('Teacher added successfully!');
        }
        
        // Refresh teacher list
        await loadTeachers();
        updateDashboard();
        
        // Hide form
        hideTeacherForm();
    } catch (error) {
        console.error('Error saving teacher:', error);
        showNotification('Failed to save teacher data.', 'error');
    }
}

// View teacher details
async function viewTeacher(id) {
    try {
        const teacher = await schoolDB.getById('teachers', id);
        
        if (!teacher) {
            showNotification('Teacher not found', 'error');
            return;
        }
        
        // You might want to create a modal to show teacher details
        // For now, we'll just console.log the data and highlight the row
        console.log('Teacher Details:', teacher);
        
        // Highlight the teacher's row in the table
        const row = document.querySelector(`#teachers-list tr[data-id="${id}"]`);
        if (row) {
            highlightElement(row);
        }
    } catch (error) {
        console.error('Error viewing teacher:', error);
        showNotification('Failed to load teacher details.', 'error');
    }
}

// Edit teacher
async function editTeacher(id) {
    try {
        const teacher = await schoolDB.getById('teachers', id);
        
        if (!teacher) {
            showNotification('Teacher not found', 'error');
            return;
        }
        
        // Populate form fields
        document.getElementById('teacher-id').value = teacher.id;
        document.getElementById('teacher-name').value = `${teacher.firstName || ''} ${teacher.lastName || ''}`;
        document.getElementById('teacher-subject').value = teacher.subject || '';
        document.getElementById('teacher-contact').value = teacher.phone || '';
        document.getElementById('teacher-email').value = teacher.email || '';
        document.getElementById('teacher-qualification').value = teacher.education || '';
        document.getElementById('teacher-emp-id').value = teacher.employeeId || '';
        
        // Show form
        const form = document.getElementById('teacher-form');
        form.classList.remove('hidden');
        form.querySelector('h3').textContent = 'Edit Teacher';
    } catch (error) {
        console.error('Error editing teacher:', error);
        showNotification('Failed to load teacher data for editing.', 'error');
    }
}

// Delete teacher (updated to use custom confirm dialog)
async function deleteTeacher(id) {
    showConfirmDialog('Are you sure you want to delete this teacher? This cannot be undone.', async () => {
        try {
            showLoading('Deleting teacher...');
            await schoolDB.delete('teachers', id);
            hideLoading();
            showNotification('Teacher deleted successfully');
            await loadTeachers();
            updateDashboard();
        } catch (error) {
            hideLoading();
            console.error('Error deleting teacher:', error);
            showNotification('Failed to delete teacher.', 'error');
        }
    });
}

// Search teachers
async function searchTeachers() {
    const searchTerm = document.getElementById('teacher-search').value.trim().toLowerCase();
    
    try {
        let teachers = await schoolDB.getAll('teachers');
        
        // Apply search filter if there's a search term
        if (searchTerm) {
            teachers = teachers.filter(teacher => {
                const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
                return fullName.includes(searchTerm) || 
                       (teacher.id && teacher.id.toString().toLowerCase().includes(searchTerm)) ||
                       (teacher.subject && teacher.subject.toLowerCase().includes(searchTerm));
            });
        }
        
        renderTeachers(teachers);
    } catch (error) {
        console.error('Error searching teachers:', error);
        showNotification('Failed to search teachers.', 'error');
    }
}

// Load and update school settings
async function loadSettings() {
    try {
        const settings = await schoolDB.getAll('settings');
        const schoolInfo = settings[0] || {};
        
        // Update school information in the UI
        document.getElementById('schoolName').textContent = schoolInfo.name || 'School Management';
        document.getElementById('schoolAddress').textContent = schoolInfo.address || 'Offline System';
        
        // Update settings form
        document.getElementById('setting-school-name').value = schoolInfo.name || '';
        document.getElementById('setting-school-address').value = schoolInfo.address || '';
        document.getElementById('setting-school-phone').value = schoolInfo.phone || '';
        
        return settings;
    } catch (error) {
        console.error('Error loading settings:', error);
        showNotification('Failed to load school settings.', 'error');
        return [];
    }
}

// Save school settings
async function saveSettings(event) {
    event.preventDefault();
    
    try {
        const settings = await schoolDB.getAll('settings');
        const schoolInfo = settings[0] || { id: 'schoolInfo' };
        
        // Update settings with form data
        schoolInfo.name = document.getElementById('setting-school-name').value;
        schoolInfo.address = document.getElementById('setting-school-address').value;
        schoolInfo.phone = document.getElementById('setting-school-phone').value;
        schoolInfo.lastUpdated = new Date().toISOString();
        
        // Save to database
        if (settings[0]) {
            await schoolDB.update('settings', schoolInfo);
        } else {
            await schoolDB.add('settings', schoolInfo);
        }
        
        // Update UI
        document.getElementById('schoolName').textContent = schoolInfo.name || 'School Management';
        document.getElementById('schoolAddress').textContent = schoolInfo.address || 'Offline System';
        
        showNotification('School settings saved successfully!');
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Failed to save school settings.', 'error');
    }
}

// Export all data
async function exportData() {
    try {
        showLoading('Exporting data...');
        await schoolDB.exportData();
        hideLoading();
        showNotification('Data exported successfully!');
    } catch (error) {
        hideLoading();
        console.error('Error exporting data:', error);
        showNotification('Failed to export data.', 'error');
    }
}

// Import data
async function importData(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }
    
    try {
        showLoading('Importing data...');
        
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const data = JSON.parse(e.target.result);
                await schoolDB.importData(data);
                
                // Reload data and update UI
                await loadStudents();
                await loadTeachers();
                await loadSettings();
                updateDashboard();
                
                hideLoading();
                showNotification('Data imported successfully!');
            } catch (error) {
                hideLoading();
                console.error('Error parsing import file:', error);
                showNotification('Failed to import data. Invalid file format.', 'error');
            }
        };
        
        reader.readAsText(file);
    } catch (error) {
        hideLoading();
        console.error('Error importing data:', error);
        showNotification('Failed to import data.', 'error');
    }
    
    // Reset the file input
    event.target.value = '';
}

// Update dashboard
function updateDashboard() {
    try {
        // Reinitialize charts with fresh data
        initCharts();
        
        // Additional dashboard updates can be added here
    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}

// Create a custom confirmation dialog
function showConfirmDialog(message, confirmCallback, cancelCallback = null) {
    // Create modal elements
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    
    const header = document.createElement('div');
    header.className = 'confirm-modal-header';
    header.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Confirm Action';
    
    const body = document.createElement('div');
    body.className = 'confirm-modal-body';
    body.textContent = message;
    
    const actions = document.createElement('div');
    actions.className = 'confirm-modal-actions';
    
    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-btn';
    cancelButton.textContent = 'Cancel';
    
    const confirmButton = document.createElement('button');
    confirmButton.className = 'confirm-btn';
    confirmButton.textContent = 'Confirm';
    
    // Assemble the modal
    actions.appendChild(cancelButton);
    actions.appendChild(confirmButton);
    
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(actions);
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Show the modal with animation
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
    
    // Event handlers
    function closeModal() {
        overlay.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }
    
    cancelButton.addEventListener('click', () => {
        closeModal();
        if (cancelCallback) cancelCallback();
    });
    
    confirmButton.addEventListener('click', () => {
        closeModal();
        confirmCallback();
    });
}