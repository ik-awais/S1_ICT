// ============================================================================
// LIFEFLOW BLOOD DONATION SYSTEM
// Comprehensive ICT Implementation
// ============================================================================

// ============================================================================
// Week 6: Data Processing & Analytics
// ============================================================================

class LifeFlowAnalytics {
    constructor() {
        this.donors = [];
        this.donations = [];
    }

    // Statistical Functions
    calculateMean(data) {
        if (!data || data.length === 0) return 0;
        return data.reduce((a, b) => a + b, 0) / data.length;
    }

    calculateMedian(data) {
        if (!data || data.length === 0) return 0;
        const sorted = [...data].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    findMode(arr) {
        if (!arr || arr.length === 0) return null;
        const frequency = {};
        let maxFreq = 0;
        let mode = null;

        arr.forEach(item => {
            frequency[item] = (frequency[item] || 0) + 1;
            if (frequency[item] > maxFreq) {
                maxFreq = frequency[item];
                mode = item;
            }
        });

        return mode;
    }

    calculateStdDev(data) {
        if (!data || data.length === 0) return 0;
        const mean = this.calculateMean(data);
        const squareDiffs = data.map(value => Math.pow(value - mean, 2));
        const avgSquareDiff = this.calculateMean(squareDiffs);
        return Math.sqrt(avgSquareDiff);
    }

    // Get statistics from current donor data
    getStatistics() {
        const bloodTypes = this.donors.map(d => d.bloodType);
        const ages = this.donors.map(d => d.age);
        
        return {
            totalDonors: this.donors.length,
            mostCommonBloodType: this.findMode(bloodTypes),
            averageAge: Math.round(this.calculateMean(ages)),
            medianAge: this.calculateMedian(ages),
            ageStdDev: this.calculateStdDev(ages).toFixed(2)
        };
    }
}

// ============================================================================
// Week 7: Database Management (Local Storage Simulation)
// ============================================================================

class LifeFlowDatabase {
    constructor() {
        this.donors = this.loadFromStorage('lifeflow_donors') || [];
        this.requests = this.loadFromStorage('lifeflow_requests') || [];
        this.inventory = this.loadFromStorage('lifeflow_inventory') || this.initializeInventory();
        this.initializeSampleData();
    }

    // Initialize sample inventory data
    initializeInventory() {
        return {
            'A+': Math.floor(Math.random() * 50) + 30,
            'A-': Math.floor(Math.random() * 30) + 10,
            'B+': Math.floor(Math.random() * 40) + 25,
            'B-': Math.floor(Math.random() * 25) + 8,
            'O+': Math.floor(Math.random() * 60) + 40,
            'O-': Math.floor(Math.random() * 20) + 5,
            'AB+': Math.floor(Math.random() * 30) + 15,
            'AB-': Math.floor(Math.random() * 15) + 3
        };
    }

    // Initialize with sample data if empty
    initializeSampleData() {
        if (this.donors.length === 0) {
            const sampleDonors = [
                { name: 'John Doe', email: 'john@example.com', bloodType: 'O+', phone: '555-0101', age: 28, weight: 75, city: 'New York', lastDonation: '6months' },
                { name: 'Jane Smith', email: 'jane@example.com', bloodType: 'A+', phone: '555-0102', age: 34, weight: 62, city: 'Los Angeles', lastDonation: '1year' },
                { name: 'Mike Johnson', email: 'mike@example.com', bloodType: 'B+', phone: '555-0103', age: 41, weight: 80, city: 'Chicago', lastDonation: '3months' },
                { name: 'Sarah Williams', email: 'sarah@example.com', bloodType: 'AB+', phone: '555-0104', age: 25, weight: 58, city: 'Houston', lastDonation: 'never' },
                { name: 'David Brown', email: 'david@example.com', bloodType: 'O-', phone: '555-0105', age: 38, weight: 85, city: 'Phoenix', lastDonation: '6months' }
            ];

            sampleDonors.forEach(donor => this.createDonor(donor));
        }
    }

    // CRUD Operations
    createDonor(donorData) {
        const newDonor = {
            id: Date.now() + Math.random(),
            ...donorData,
            registrationDate: new Date().toISOString(),
            status: 'active'
        };
        this.donors.push(newDonor);
        this.saveToStorage();
        return newDonor;
    }

    readDonors() {
        return this.donors;
    }

    updateDonor(id, updates) {
        const index = this.donors.findIndex(d => d.id === id);
        if (index !== -1) {
            this.donors[index] = { ...this.donors[index], ...updates };
            this.saveToStorage();
            return this.donors[index];
        }
        return null;
    }

    deleteDonor(id) {
        this.donors = this.donors.filter(d => d.id !== id);
        this.saveToStorage();
    }

    // Inventory Management
    updateInventory(bloodType, units) {
        this.inventory[bloodType] = units;
        this.saveToStorage();
    }

    getInventory() {
        return this.inventory;
    }

    // Storage Operations
    saveToStorage() {
        localStorage.setItem('lifeflow_donors', JSON.stringify(this.donors));
        localStorage.setItem('lifeflow_requests', JSON.stringify(this.requests));
        localStorage.setItem('lifeflow_inventory', JSON.stringify(this.inventory));
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading from storage:', e);
            return null;
        }
    }
}

// ============================================================================
// Week 9: Networking & Real-time Features
// ============================================================================

class LifeFlowNetwork {
    constructor() {
        this.isConnected = false;
        this.checkConnection();
        this.setupConnectionMonitoring();
    }

    checkConnection() {
        this.isConnected = navigator.onLine;
        this.updateConnectionStatus();
    }

    setupConnectionMonitoring() {
        window.addEventListener('online', () => {
            this.isConnected = true;
            this.updateConnectionStatus();
            this.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.isConnected = false;
            this.updateConnectionStatus();
            this.showNotification('Connection lost - working offline', 'warning');
        });
    }

    updateConnectionStatus() {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.textContent = this.isConnected ? '🟢 Online' : '🔴 Offline';
            statusElement.style.color = this.isConnected ? '#4caf50' : '#f44336';
        }
    }

    showNotification(message, type) {
        // Simple notification system
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    // Simulate real-time data sync
    syncData() {
        if (this.isConnected) {
            console.log('Syncing data with server...');
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('Data synced successfully');
                    resolve(true);
                }, 1000);
            });
        }
        return Promise.resolve(false);
    }
}

// ============================================================================
// Week 12: AI & Machine Learning Features
// ============================================================================

class LifeFlowAI {
    constructor(database) {
        this.database = database;
    }

    // Smart Donor-Recipient Matching Algorithm
    smartMatching(recipientBloodType, recipientCity, urgencyLevel) {
        const donors = this.database.readDonors();
        
        // Compatibility matrix
        const compatibility = {
            'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
            'O+': ['O+', 'A+', 'B+', 'AB+'],
            'A-': ['A-', 'A+', 'AB-', 'AB+'],
            'A+': ['A+', 'AB+'],
            'B-': ['B-', 'B+', 'AB-', 'AB+'],
            'B+': ['B+', 'AB+'],
            'AB-': ['AB-', 'AB+'],
            'AB+': ['AB+']
        };

        // Filter compatible donors
        const compatibleDonors = donors.filter(donor => {
            return compatibility[donor.bloodType]?.includes(recipientBloodType);
        });

        // Score and rank donors
        const scoredDonors = compatibleDonors.map(donor => {
            let score = 100;

            // City match bonus
            if (donor.city.toLowerCase() === recipientCity.toLowerCase()) {
                score += 50;
            }

            // Recent donation penalty
            if (donor.lastDonation === 'never') {
                score += 20;
            } else if (donor.lastDonation === '1year') {
                score += 10;
            }

            // Active status bonus
            if (donor.status === 'active') {
                score += 15;
            }

            return { ...donor, matchScore: score };
        });

        // Sort by score
        return scoredDonors.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
    }

    // Blood Demand Prediction using simple linear regression
    predictDemand(bloodType, daysAhead = 7) {
        // Simulate historical data
        const historicalDemand = this.generateHistoricalData(bloodType);
        
        // Simple moving average prediction
        const recentDemand = historicalDemand.slice(-7);
        const average = recentDemand.reduce((a, b) => a + b, 0) / recentDemand.length;
        
        // Add seasonal variation
        const seasonalFactor = 1 + (Math.sin(Date.now() / 86400000) * 0.2);
        const prediction = Math.round(average * seasonalFactor);

        return {
            bloodType,
            currentDemand: historicalDemand[historicalDemand.length - 1],
            predictedDemand: prediction,
            trend: prediction > average ? 'increasing' : 'decreasing',
            confidence: 85 + Math.random() * 10
        };
    }

    generateHistoricalData(bloodType) {
        // Generate 30 days of historical data
        const basedemand = { 'O+': 45, 'O-': 15, 'A+': 35, 'A-': 12, 'B+': 30, 'B-': 10, 'AB+': 20, 'AB-': 8 };
        const base = basedemand[bloodType] || 25;
        
        return Array.from({ length: 30 }, () => 
            Math.max(0, Math.round(base + (Math.random() - 0.5) * 10))
        );
    }

    // Eligibility Checker
    checkEligibility(age, weight, lastDonation, hasConditions = false) {
        const reasons = [];
        let eligible = true;

        if (age < 18 || age > 65) {
            eligible = false;
            reasons.push('Age must be between 18 and 65');
        }

        if (weight < 50) {
            eligible = false;
            reasons.push('Minimum weight requirement is 50 kg');
        }

        if (lastDonation === '3months' || lastDonation === 'never') {
            // Eligible
        } else {
            eligible = false;
            reasons.push('Must wait at least 3 months between donations');
        }

        if (hasConditions) {
            eligible = false;
            reasons.push('Medical conditions may affect eligibility');
        }

        return {
            eligible,
            reasons: reasons.length > 0 ? reasons : ['You are eligible to donate!'],
            confidence: eligible ? 95 : 100
        };
    }
}

// ============================================================================
// Main Application Controller
// ============================================================================

class LifeFlowApp {
    constructor() {
        this.database = new LifeFlowDatabase();
        this.analytics = new LifeFlowAnalytics();
        this.network = new LifeFlowNetwork();
        this.ai = new LifeFlowAI(this.database);
        
        this.init();
    }

    init() {
        // Load initial data
        this.analytics.donors = this.database.readDonors();
        
        // Update dashboard
        this.updateDashboard();
        
        // Setup form handler
        this.setupFormHandler();
        
        // Animate counters on page load
        this.animateCounters();
        
        // Update inventory display
        this.updateInventoryDisplay();
        
        console.log('LifeFlow System Initialized');
    }

    // Update Dashboard Statistics
    updateDashboard() {
        const stats = this.analytics.getStatistics();
        const donors = this.database.readDonors();
        
        // Update donor statistics
        document.getElementById('total-registered').textContent = stats.totalDonors;
        document.getElementById('most-common').textContent = stats.mostCommonBloodType || 'N/A';
        
        // Calculate this month's donors (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thisMonthDonors = donors.filter(d => new Date(d.registrationDate) > thirtyDaysAgo).length;
        document.getElementById('this-month').textContent = thisMonthDonors;
        
        // Active donors (donated in last 6 months or never donated but registered)
        const activeDonors = donors.filter(d => d.status === 'active').length;
        document.getElementById('active-donors').textContent = activeDonors;
    }

    // Update Inventory Display
    updateInventoryDisplay() {
        const inventory = this.database.getInventory();
        const maxUnits = Math.max(...Object.values(inventory));

        Object.keys(inventory).forEach(bloodType => {
            const units = inventory[bloodType];
            const percentage = (units / maxUnits) * 100;
            
            const barElement = document.querySelector(`.blood-type-bar[data-type="${bloodType}"] .bar`);
            const valueElement = document.querySelector(`.blood-type-bar[data-type="${bloodType}"] .bar-value`);
            
            if (barElement && valueElement) {
                setTimeout(() => {
                    barElement.style.width = `${percentage}%`;
                    valueElement.textContent = `${units} units`;
                }, 100);
            }
        });
    }

    // Animate Counters
    animateCounters() {
        const animateCounter = (element, target, duration = 2000) => {
            let current = 0;
            const increment = target / (duration / 16);
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current).toLocaleString();
                }
            }, 16);
        };

        const totalDonorsEl = document.getElementById('total-donors');
        const livesSavedEl = document.getElementById('lives-saved');
        
        if (totalDonorsEl) animateCounter(totalDonorsEl, this.database.readDonors().length * 100 + 500000, 2000);
        if (livesSavedEl) animateCounter(livesSavedEl, this.database.readDonors().length * 300 + 1500000, 2500);
    }

    // Setup Form Handler
    setupFormHandler() {
        const form = document.getElementById('donor-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            });
        }
    }

    // Handle Form Submission
    handleFormSubmit(form) {
        const formData = new FormData(form);
        const donorData = {
            name: formData.get('name'),
            email: formData.get('email'),
            bloodType: formData.get('blood-type'),
            phone: formData.get('phone'),
            age: parseInt(formData.get('age')),
            weight: parseInt(formData.get('weight')),
            city: formData.get('city'),
            lastDonation: formData.get('last-donation')
        };

        // Validate eligibility
        const eligibility = this.ai.checkEligibility(
            donorData.age,
            donorData.weight,
            donorData.lastDonation
        );

        const responseDiv = document.getElementById('form-response');
        
        if (eligibility.eligible) {
            // Create donor
            const newDonor = this.database.createDonor(donorData);
            this.analytics.donors = this.database.readDonors();
            
            // Update displays
            this.updateDashboard();
            this.updateInventoryDisplay();
            
            // Show success message
            responseDiv.className = 'form-response success';
            responseDiv.textContent = `✓ Registration successful! Welcome to LifeFlow, ${donorData.name}. Your donor ID is ${newDonor.id.toString().substring(0, 8)}.`;
            
            // Reset form
            form.reset();
            
            // Scroll to response
            responseDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            // Show error message
            responseDiv.className = 'form-response error';
            responseDiv.textContent = `✗ Registration failed: ${eligibility.reasons.join(', ')}`;
        }

        // Auto-hide after 5 seconds
        setTimeout(() => {
            responseDiv.style.display = 'none';
        }, 5000);
    }
}

// ============================================================================
// Global Functions for AI Demonstrations
// ============================================================================

function demoMatching() {
    const app = window.lifeFlowApp;
    const resultDiv = document.getElementById('matching-result');
    
    // Simulate matching request
    const matches = app.ai.smartMatching('O+', 'New York', 'urgent');
    
    resultDiv.innerHTML = `
        <strong>Top Matches Found:</strong><br>
        ${matches.slice(0, 3).map((m, i) => 
            `${i + 1}. ${m.name} (${m.bloodType}) - Score: ${m.matchScore}`
        ).join('<br>')}
    `;
    resultDiv.classList.add('show');
    
    setTimeout(() => resultDiv.classList.remove('show'), 5000);
}

function demoPrediction() {
    const app = window.lifeFlowApp;
    const resultDiv = document.getElementById('prediction-result');
    
    const bloodTypes = ['O+', 'A+', 'B+'];
    const randomType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
    const prediction = app.ai.predictDemand(randomType, 7);
    
    resultDiv.innerHTML = `
        <strong>${prediction.bloodType} Demand Forecast:</strong><br>
        Current: ${prediction.currentDemand} units<br>
        Predicted (7 days): ${prediction.predictedDemand} units<br>
        Trend: ${prediction.trend} (${prediction.confidence.toFixed(1)}% confidence)
    `;
    resultDiv.classList.add('show');
    
    setTimeout(() => resultDiv.classList.remove('show'), 5000);
}

function checkEligibility() {
    const app = window.lifeFlowApp;
    const resultDiv = document.getElementById('eligibility-result');
    
    // Random test case
    const testCases = [
        { age: 25, weight: 70, lastDonation: 'never' },
        { age: 17, weight: 65, lastDonation: 'never' },
        { age: 45, weight: 48, lastDonation: '6months' }
    ];
    
    const testCase = testCases[Math.floor(Math.random() * testCases.length)];
    const result = app.ai.checkEligibility(testCase.age, testCase.weight, testCase.lastDonation);
    
    resultDiv.innerHTML = `
        <strong>Test Case:</strong><br>
        Age: ${testCase.age}, Weight: ${testCase.weight}kg<br>
        <strong>${result.eligible ? '✓ Eligible' : '✗ Not Eligible'}</strong><br>
        ${result.reasons.join('<br>')}
    `;
    resultDiv.classList.add('show');
    
    setTimeout(() => resultDiv.classList.remove('show'), 5000);
}

// ============================================================================
// Initialize Application on Page Load
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    window.lifeFlowApp = new LifeFlowApp();
    console.log('LifeFlow Application Ready');
});