document.addEventListener('DOMContentLoaded', () => {
    // Initialize with a loading overlay
    showLoading('Loading registration form...', true);
    
    // Set up the form
    setTimeout(() => {
        initializeRegistration();
        hideLoading();
    }, 1000);
    
    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Add form submission handler
    document.getElementById('student-registration-form').addEventListener('submit', handleRegistration);
    
    // Add print functionality
    document.getElementById('print-details').addEventListener('click', printRegistrationDetails);
    
    // Load school info
    loadSchoolInfo();
});

// Initialize the registration form
function initializeRegistration() {
    console.log('Initializing student registration form');
    // Check if the database is ready
    if (!window.schoolDB) {
        console.error('Database not initialized');
        showNotification('System error: Database not ready. Please try again later.', 'error');
        return;
    }
}

// Load school information from settings
async function loadSchoolInfo() {
    try {
        const settings = await schoolDB.getAll('settings');
        const schoolInfo = settings[0] || {};
        
        // Update school information in the UI
        document.getElementById('schoolName').textContent = schoolInfo.name || 'School Management';
        document.getElementById('schoolAddress').textContent = schoolInfo.address || 'Offline System';
    } catch (error) {
        console.error('Error loading school info:', error);
    }
}

// Show loading overlay
function showLoading(message = 'Loading...', isInitializing = false) {
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

    const messageElement = document.getElementById('loading-message');
    messageElement.textContent = message;
    
    if (isInitializing) {
        messageElement.style.fontSize = '18px';
        messageElement.style.fontWeight = 'bold';
    } else {
        messageElement.style.fontSize = '';
        messageElement.style.fontWeight = '';
    }

    loadingOverlay.offsetWidth; // Force reflow for transition
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
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

// Handle form navigation between steps
function nextStep(currentStep) {
    // Validate current step
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
    
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('invalid');
            
            // Remove invalid class when input changes
            input.addEventListener('input', function() {
                this.classList.remove('invalid');
            }, { once: true });
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    // Show next step
    document.getElementById(`step${currentStep + 1}`).classList.add('active');
    
    // Update step status
    document.getElementById(`step${currentStep}-status`).classList.add('completed');
    document.getElementById(`step${currentStep + 1}-status`).classList.add('active');
    
    // Update status line
    if (currentStep < 3) {
        const statusLines = document.querySelectorAll('.status-line');
        statusLines[currentStep - 1].classList.add('active');
    }
    
    // Scroll to top of form
    document.querySelector('.registration-wrapper').scrollIntoView({ behavior: 'smooth' });
}

function prevStep(currentStep) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    // Show previous step
    document.getElementById(`step${currentStep - 1}`).classList.add('active');
    
    // Update step status
    document.getElementById(`step${currentStep}-status`).classList.remove('active');
    document.getElementById(`step${currentStep - 1}-status`).classList.add('active');
    
    // Update status line if needed
    if (currentStep > 1) {
        const statusLines = document.querySelectorAll('.status-line');
        statusLines[currentStep - 2].classList.remove('active');
    }
    
    // Scroll to top of form
    document.querySelector('.registration-wrapper').scrollIntoView({ behavior: 'smooth' });
}

// Handle form submission
async function handleRegistration(event) {
    event.preventDefault();
    
    // Check the confirmation checkbox
    if (!document.getElementById('confirm-details').checked) {
        showNotification('Please confirm that your details are correct', 'error');
        return;
    }
    
    // Validate the entire form
    const requiredInputs = document.querySelectorAll('#student-registration-form input[required], #student-registration-form select[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('invalid');
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading overlay during submission
    showLoading('Processing your registration...');
    
    try {
        // Gather all form data
        const studentData = {
            firstName: document.getElementById('student-first-name').value,
            lastName: document.getElementById('student-last-name').value,
            dateOfBirth: document.getElementById('student-dob').value,
            gender: document.getElementById('student-gender').value,
            grade: document.getElementById('student-grade').value,
            address: document.getElementById('student-address').value,
            parentInfo: {
                name: document.getElementById('parent-name').value,
                phone: document.getElementById('parent-phone').value,
                email: document.getElementById('parent-email').value
            },
            emergencyContact: document.getElementById('emergency-contact').value,
            medicalInfo: {
                bloodGroup: document.getElementById('student-blood-group').value,
                allergies: document.getElementById('student-allergies').value.split(',').map(item => item.trim()).filter(item => item)
            },
            additionalNotes: document.getElementById('additional-notes').value,
            enrollmentDate: new Date().toISOString().split('T')[0],
            registrationType: 'self-registration',
            canEdit: false // This flag ensures the record cannot be edited
        };
        
        // Save the student record to database
        const studentId = await schoolDB.add('students', studentData);
        
        // Retrieve the student with the generated ID to show all details
        const savedStudent = await schoolDB.getById('students', studentId);
        
        // Hide loading overlay
        hideLoading();
        
        // Show confirmation with student ID
        showConfirmationScreen(savedStudent);
        
    } catch (error) {
        hideLoading();
        console.error('Error submitting registration:', error);
        showNotification('Registration failed. Please try again later.', 'error');
    }
}

// Show the confirmation screen after successful registration
function showConfirmationScreen(student) {
    // Hide the form
    document.getElementById('student-registration-form').style.display = 'none';
    
    // Show the confirmation
    const confirmation = document.getElementById('registration-confirmation');
    confirmation.classList.remove('hidden');
    
    // Display student ID
    document.getElementById('generated-student-id').textContent = student.id;
    
    // Create details display
    const detailsContent = document.getElementById('confirmation-details-content');
    
    // Format the details as a definition list
    const detailsHtml = `
        <dl>
            <dt>Name</dt>
            <dd>${student.firstName} ${student.lastName}</dd>
            
            <dt>Date of Birth</dt>
            <dd>${formatDate(student.dateOfBirth)}</dd>
            
            <dt>Gender</dt>
            <dd>${student.gender || 'Not specified'}</dd>
            
            <dt>Grade</dt>
            <dd>${student.grade}</dd>
            
            <dt>Address</dt>
            <dd>${student.address}</dd>
            
            <dt>Parent/Guardian</dt>
            <dd>${student.parentInfo.name}</dd>
            
            <dt>Contact Number</dt>
            <dd>${student.parentInfo.phone}</dd>
            
            <dt>Email</dt>
            <dd>${student.parentInfo.email || 'Not provided'}</dd>
            
            <dt>Registration Date</dt>
            <dd>${formatDate(student.enrollmentDate)}</dd>
        </dl>
    `;
    
    detailsContent.innerHTML = detailsHtml;
    
    // Scroll to the top of confirmation
    confirmation.scrollIntoView({ behavior: 'smooth' });
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Print registration details
function printRegistrationDetails() {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
        showNotification('Pop-up blocked. Please allow pop-ups to print.', 'error');
        return;
    }
    
    const studentId = document.getElementById('generated-student-id').textContent;
    const detailsContent = document.getElementById('confirmation-details-content').innerHTML;
    const schoolName = document.getElementById('schoolName').textContent;
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Student Registration - ${studentId}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #1a73e8;
                }
                h1 {
                    color: #1a73e8;
                    margin-bottom: 5px;
                }
                .student-id {
                    font-size: 24px;
                    font-weight: bold;
                    color: #1a73e8;
                    margin: 15px 0;
                    padding: 5px 10px;
                    border: 1px solid #1a73e8;
                    display: inline-block;
                }
                dl {
                    display: grid;
                    grid-template-columns: 30% 70%;
                    gap: 10px;
                }
                dt {
                    font-weight: bold;
                    color: #555;
                }
                dd {
                    margin: 0;
                }
                .footer {
                    margin-top: 50px;
                    text-align: center;
                    font-size: 14px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <header>
                <h1>${schoolName}</h1>
                <p>Student Registration Confirmation</p>
            </header>
            
            <main>
                <p>This document confirms that a student has been registered with the following details:</p>
                
                <p>Student ID: <span class="student-id">${studentId}</span></p>
                
                <div class="details">
                    ${detailsContent}
                </div>
                
                <p><strong>Important:</strong> Please keep this document for your records. You will need your Student ID for all future interactions with the school.</p>
            </main>
            
            <div class="footer">
                <p>Registration Date: ${new Date().toLocaleDateString()}</p>
                <p>&copy; ${new Date().getFullYear()} ${schoolName}. All rights reserved.</p>
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Print the document
    setTimeout(() => {
        printWindow.print();
        // Close the window after printing (browser dependent)
        printWindow.onafterprint = function() {
            printWindow.close();
        };
    }, 500);
}
