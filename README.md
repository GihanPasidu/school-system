# Sri Lanka School Management System

An offline school management system designed specifically for Sri Lankan schools to manage students and teachers. The system stores all data in JSON files within the local data folder and can be easily managed through Git/GitHub.

## Features

- **Dashboard**: Quick overview of the school's statistics
- **Student Management**: Add, edit, delete and search for students
- **Teacher Management**: Add, edit, delete and search for teachers
- **Settings**: Configure school information
- **Data Management**: Import and export data for backup purposes
- **Version Control**: Store your default data structure in GitHub for easy deployment
- **Local Storage**: All active data is stored in JSON files in a local folder

## Setup

1. Download or clone the repository to your computer
2. Make sure you have Node.js installed (download from https://nodejs.org/)
3. Keep the folder structure intact
4. Double-click on the `run-school-system.bat` file to start the application

## Folder Structure

- index.html (main file)
- server.js (handles file operations)
- package.json (dependencies information)
- run-school-system.bat (startup script)
- css/
  - styles.css
- js/
  - app.js
  - db.js
  - charts.js
- data/ (contains default empty data files)
  - students.json (version controlled in GitHub)
  - teachers.json (version controlled in GitHub)
  - settings.json (version controlled in GitHub)

## Data Management

The default empty data structure files are stored in the repository for easy setup and deployment. When you use the application:

- Initial empty data files are included in the repository
- Your specific school data will be stored in these files locally
- Personal data exports are automatically excluded from Git commits
- You can create your own branch if you want to version your school's data

This allows for:
- Easy setup of a new school with empty data files
- Ability to track data structure changes through Git
- Flexibility to manage your own data privately or within your organization's repository

## Usage

### First-time setup

1. Double-click on the `run-school-system.bat` file
2. The application will open in your default browser
3. Go to the Settings page and enter your school information
4. Click "Save Settings" to update your school details

### Adding Students

1. Go to the Students page
2. Click "Add New Student"
3. Fill in the student details
4. Click "Save" - the data will be saved to students.json

### Adding Teachers

1. Go to the Teachers page
2. Click "Add New Teacher" 
3. Fill in the teacher details
4. Click "Save" - the data will be saved to teachers.json

### Backing Up Data

1. Go to the Settings page
2. Under "Data Management" click "Export Data"
3. A JSON file containing all data will be downloaded or saved directly to your data folder
4. Export files will not be committed to Git by default

### Restoring Data

1. Go to the Settings page
2. Under "Data Management" click "Import Data"
3. Select the JSON file you previously exported
4. Wait for the confirmation message

## System Requirements

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js installed (version 14 or higher)
- Minimum 2GB of RAM
- 50MB of free disk space

## Technical Details

- Built using HTML, CSS, and JavaScript for the frontend
- Node.js and Express for handling file operations
- Uses local JSON files for data storage
- No external database required
- All data remains on the local computer

