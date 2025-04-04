// Database management for offline storage using local JSON files
class SchoolDatabase {
    constructor() {
        this.dataFolder = 'data';
        this.dataFiles = {
            students: `${this.dataFolder}/students.json`,
            teachers: `${this.dataFolder}/teachers.json`,
            settings: `${this.dataFolder}/settings.json`,
            marks: `${this.dataFolder}/marks.json`
        };
        this.data = {
            students: [],
            teachers: [],
            settings: [],
            marks: []
        };
        this.initDB();
    }

    // Initialize the database
    async initDB() {
        try {
            // Load existing data from JSON files
            for (const store in this.dataFiles) {
                try {
                    const response = await fetch(`${this.dataFiles[store]}?t=${new Date().getTime()}`);
                    if (response.ok) {
                        const content = await response.text();
                        this.data[store] = JSON.parse(content || '[]');
                    } else {
                        // Initialize the file with empty array if it doesn't exist
                        this.data[store] = [];
                        await this.saveFile(this.dataFiles[store], JSON.stringify([], null, 2));
                    }
                } catch (error) {
                    console.warn(`Could not load ${store} data, initializing with empty array:`, error);
                    this.data[store] = [];
                    await this.saveFile(this.dataFiles[store], JSON.stringify([], null, 2));
                }
            }
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Error initializing database:', error);
        }
    }

    // Save data to file
    async saveFile(path, content) {
        try {
            const response = await fetch('/save-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    path: path,
                    content: content
                }),
            });
            
            if (!response.ok) {
                throw new Error(`Failed to save file: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error saving file:', error);
            
            // Fallback to download as a file if server saving fails
            const dataBlob = new Blob([content], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = path.split('/').pop();
            link.click();
            URL.revokeObjectURL(url);
            
            alert(`Please place this file at: ${path}`);
            return false;
        }
    }

    // Generic method to add data to any store
    async add(storeName, data) {
        try {
            // Load current data
            const items = [...this.data[storeName]];
            
            // Generate ID - handle both string and numeric IDs
            if (!data.id) {
                if (storeName === 'students' && items.length > 0) {
                    // For students, extract the next sequential number based on pattern S{grade}###
                    const gradePrefix = `S${data.grade || 1}`;
                    const gradeItems = items.filter(item => item.id && item.id.startsWith(gradePrefix));
                    
                    if (gradeItems.length > 0) {
                        // Extract numeric portion and find max
                        const maxNum = Math.max(...gradeItems.map(item => {
                            const numPart = item.id.substring(gradePrefix.length);
                            return parseInt(numPart) || 0;
                        }));
                        data.id = `${gradePrefix}${(maxNum + 1).toString().padStart(3, '0')}`;
                    } else {
                        // First student in this grade
                        data.id = `${gradePrefix}001`;
                    }
                } else if (storeName === 'teachers' && items.length > 0) {
                    // For teachers, extract the next sequential number based on pattern T###
                    const prefix = 'T';
                    const teacherItems = items.filter(item => item.id && item.id.startsWith(prefix));
                    
                    if (teacherItems.length > 0) {
                        // Extract numeric portion and find max
                        const maxNum = Math.max(...teacherItems.map(item => {
                            const numPart = item.id.substring(prefix.length);
                            return parseInt(numPart) || 0;
                        }));
                        data.id = `${prefix}${(maxNum + 1).toString().padStart(3, '0')}`;
                    } else {
                        // First teacher
                        data.id = `${prefix}001`;
                    }
                } else {
                    // Default numeric ID generation for other data types
                    const maxId = items.length > 0 
                        ? Math.max(...items.map(item => parseInt(item.id) || 0)) 
                        : 0;
                    data.id = maxId + 1;
                }
            }
            
            // Add item
            items.push(data);
            this.data[storeName] = items;
            
            // Save to file
            await this.saveFile(this.dataFiles[storeName], JSON.stringify(items, null, 2));
            
            return data.id;
        } catch (error) {
            console.error(`Error adding to ${storeName}:`, error);
            throw error;
        }
    }

    // Generic method to get all data from a store
    async getAll(storeName) {
        try {
            return [...this.data[storeName]];
        } catch (error) {
            console.error(`Error getting all from ${storeName}:`, error);
            throw error;
        }
    }

    // Generic method to get data by ID
    async getById(storeName, id) {
        try {
            console.log(`Getting ${storeName} with ID:`, id);
            
            // Exit early if id is undefined or null
            if (id === undefined || id === null) {
                console.error(`Invalid ID provided for ${storeName}:`, id);
                return null;
            }
            
            const items = this.data[storeName];
            const idString = id.toString();
            
            // Find the item with matching ID
            const result = items.find(item => {
                if (item.id === undefined || item.id === null) return false;
                return item.id.toString() === idString;
            });
            
            console.log("Found item:", result);
            return result || null;
        } catch (error) {
            console.error(`Error getting by id from ${storeName}:`, error);
            throw error;
        }
    }

    // Generic method to update data
    async update(storeName, data) {
        try {
            const items = [...this.data[storeName]];
            let index;
            
            // Convert both IDs to string for comparison
            const dataIdString = data.id !== undefined && data.id !== null ? data.id.toString() : '';
            
            // Find item index by ID
            index = items.findIndex(item => {
                const itemId = item.id !== undefined && item.id !== null ? item.id.toString() : '';
                return itemId === dataIdString;
            });
            
            if (index !== -1) {
                items[index] = data;
                this.data[storeName] = items;
                await this.saveFile(this.dataFiles[storeName], JSON.stringify(items, null, 2));
                return data.id;
            } else {
                return await this.add(storeName, data);
            }
        } catch (error) {
            console.error(`Error updating in ${storeName}:`, error);
            throw error;
        }
    }

    // Generic method to delete data
    async delete(storeName, id) {
        try {
            const items = [...this.data[storeName]];
            
            // Convert ID to string for comparison
            const idString = id !== undefined && id !== null ? id.toString() : '';
            
            // Filter out item with matching ID
            const filtered = items.filter(item => {
                const itemId = item.id !== undefined && item.id !== null ? item.id.toString() : '';
                return itemId !== idString;
            });
            
            if (filtered.length !== items.length) {
                this.data[storeName] = filtered;
                await this.saveFile(this.dataFiles[storeName], JSON.stringify(filtered, null, 2));
                return true;
            }
            
            return false;
        } catch (error) {
            console.error(`Error deleting from ${storeName}:`, error);
            throw error;
        }
    }

    // Search by field containing value
    async searchByField(storeName, fieldName, value) {
        try {
            const items = this.data[storeName];
            const searchValue = value.toString().toLowerCase();
            
            return items.filter(item => {
                if (item[fieldName]) {
                    return item[fieldName].toString().toLowerCase().includes(searchValue);
                }
                return false;
            });
        } catch (error) {
            console.error(`Error searching in ${storeName}:`, error);
            throw error;
        }
    }

    // Export all data
    async exportData() {
        try {
            const allData = {
                students: this.data.students,
                teachers: this.data.teachers,
                settings: this.data.settings,
                marks: this.data.marks,
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: '1.0',
                    provider: 'CloudNextra Solutions'
                }
            };
            
            // Save as a single export file
            const exportFilename = `data/export_school_data_${new Date().toISOString().split('T')[0]}.json`;
            await this.saveFile(exportFilename, JSON.stringify(allData, null, 2));
            
            return allData;
        } catch (error) {
            console.error('Error exporting data:', error);
            throw error;
        }
    }

    // Import data
    async importData(data) {
        try {
            // Update data in memory
            if (data.students) this.data.students = data.students;
            if (data.teachers) this.data.teachers = data.teachers;
            if (data.settings) this.data.settings = data.settings;
            if (data.marks) this.data.marks = data.marks;
            
            // Write to files
            await this.saveFile(this.dataFiles.students, JSON.stringify(this.data.students, null, 2));
            await this.saveFile(this.dataFiles.teachers, JSON.stringify(this.data.teachers, null, 2));
            await this.saveFile(this.dataFiles.settings, JSON.stringify(this.data.settings, null, 2));
            await this.saveFile(this.dataFiles.marks, JSON.stringify(this.data.marks, null, 2));
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            throw error;
        }
    }

    // Clear a store
    async clearStore(storeName) {
        try {
            this.data[storeName] = [];
            await this.saveFile(this.dataFiles[storeName], JSON.stringify([]));
            return true;
        } catch (error) {
            console.error(`Error clearing ${storeName}:`, error);
            throw error;
        }
    }
}

// Create a global database instance
const schoolDB = new SchoolDatabase();
