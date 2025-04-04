// Charts for dashboard visualization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize charts after database is loaded
    setTimeout(() => {
        initCharts();
    }, 1000);
});

async function initCharts() {
    try {
        const students = await schoolDB.getAll('students');
        const teachers = await schoolDB.getAll('teachers');
        
        createGradeDistributionChart(students);
        createSubjectDistributionChart(teachers);
        populateRecentAdmissions(students);
        updateStudentTeacherRatio(students, teachers);
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function createGradeDistributionChart(students) {
    // Count students per grade
    const grades = {};
    for (let i = 1; i <= 13; i++) {
        grades[i] = 0;
    }
    
    students.forEach(student => {
        const grade = parseInt(student.grade);
        if (grades.hasOwnProperty(grade)) {
            grades[grade]++;
        }
    });
    
    const ctx = document.getElementById('gradeChart').getContext('2d');
    
    // Create animated chart
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(grades).map(grade => `Grade ${grade}`),
            datasets: [{
                label: 'Number of Students',
                data: Object.values(grades),
                backgroundColor: 'rgba(26, 115, 232, 0.7)',
                borderColor: 'rgba(26, 115, 232, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return `${context.parsed.y} students`;
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

function createSubjectDistributionChart(teachers) {
    // Count teachers per subject
    const subjects = {};
    teachers.forEach(teacher => {
        const subject = teacher.subject || 'Unspecified';
        if (subjects[subject]) {
            subjects[subject]++;
        } else {
            subjects[subject] = 1;
        }
    });
    
    // Sort subjects by count
    const sortedSubjects = Object.entries(subjects)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7); // Take top 7 subjects for readability
    
    const subjectNames = sortedSubjects.map(s => s[0]);
    const subjectCounts = sortedSubjects.map(s => s[1]);
    
    // Create color palette
    const colors = [
        'rgba(52, 168, 83, 0.7)',
        'rgba(66, 133, 244, 0.7)',
        'rgba(251, 188, 5, 0.7)',
        'rgba(234, 67, 53, 0.7)',
        'rgba(193, 142, 235, 0.7)',
        'rgba(26, 188, 156, 0.7)',
        'rgba(241, 196, 15, 0.7)',
    ];
    
    const ctx = document.getElementById('subjectChart').getContext('2d');
    
    // Create animated chart
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: subjectNames,
            datasets: [{
                data: subjectCounts,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value} teachers`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

function populateRecentAdmissions(students) {
    const recentStudentsList = document.getElementById('recent-students-list');
    if (!recentStudentsList) return;
    
    // Sort by enrollment date (if available) or ID
    const sortedStudents = [...students].sort((a, b) => {
        if (a.enrollmentDate && b.enrollmentDate) {
            return new Date(b.enrollmentDate) - new Date(a.enrollmentDate);
        }
        
        // Compare IDs safely, handling string-based IDs
        const aIdNum = a.id && a.id.toString().replace(/\D/g, '');
        const bIdNum = b.id && b.id.toString().replace(/\D/g, '');
        return parseInt(bIdNum) - parseInt(aIdNum);
    }).slice(0, 5);
    
    recentStudentsList.innerHTML = '';
    if (sortedStudents.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4" style="text-align: center;">No students found</td>`;
        recentStudentsList.appendChild(row);
        return;
    }
    
    sortedStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        const enrollmentDate = new Date(student.enrollmentDate || new Date());
        // Format date as YYYY-MM-DD
        const formattedDate = enrollmentDate.toISOString().split('T')[0];
        
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>Grade ${student.grade}</td>
            <td>${formattedDate}</td>
        `;
        
        // Add staggered animation delay
        row.style.animation = `slideUp 0.3s ${0.05 * index}s var(--animation-timing) both`;
        
        recentStudentsList.appendChild(row);
    });
}

function updateStudentTeacherRatio(students, teachers) {
    const ratioElement = document.getElementById('ratio');
    if (!ratioElement) return;
    
    const studentCount = students.length;
    const teacherCount = teachers.length;
    
    if (teacherCount === 0) {
        ratioElement.textContent = 'N/A';
        return;
    }
    
    // Calculate ratio and round to 2 decimal places
    const ratio = studentCount / teacherCount;
    const formattedRatio = ratio.toFixed(1);
    
    ratioElement.textContent = `${formattedRatio}:1`;
}

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

// Re-initialize charts when dashboard is shown
document.getElementById('dashboard-btn').addEventListener('click', function() {
    setTimeout(initCharts, 100);
});
