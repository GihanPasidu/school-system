// Database management for offline storage using local JSON files
class SchoolDatabase {
    constructor() {
        this.dataFolder = 'data';
        this.dataFiles = {
            students: `${this.dataFolder}/students.json`,
            teachers: `${this.dataFolder}/teachers.json`,
            settings: `${this.dataFolder}/settings.json`
        };
        this.data = {
            students: [],
            teachers: [],
            settings: []
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
            
            // Generate ID
            const maxId = items.length > 0 
                ? Math.max(...items.map(item => parseInt(item.id) || 0)) 
                : 0;
            data.id = maxId + 1;
            
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
            const items = this.data[storeName];
            return items.find(item => parseInt(item.id) === parseInt(id)) || null;
        } catch (error) {
            console.error(`Error getting by id from ${storeName}:`, error);
            throw error;
        }
    }

    // Generic method to update data
    async update(storeName, data) {
        try {
            const items = [...this.data[storeName]];
            const index = items.findIndex(item => parseInt(item.id) === parseInt(data.id));
            
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
            const filtered = items.filter(item => parseInt(item.id) !== parseInt(id));
            
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
            
            // Write to files
            await this.saveFile(this.dataFiles.students, JSON.stringify(this.data.students, null, 2));
            await this.saveFile(this.dataFiles.teachers, JSON.stringify(this.data.teachers, null, 2));
            await this.saveFile(this.dataFiles.settings, JSON.stringify(this.data.settings, null, 2));
            
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
