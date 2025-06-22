// Global Variables
let currentUser = null;
let isLogin = true;
let selectedLanguage = 'en';
let selectedBodyPart = null;
let selectedImage = null;
let analysisHistory = [];
let currentTab = 'detection';

// Language Instructions
const bodyPartInstructions = {
    nail: {
        en: "Place your fingernail under good lighting and capture a clear image",
        hi: "अच्छी रोशनी में अपना नाखून रखें और स्पष्ट तस्वीर लें",
        te: "మంచి వెలుతురులో మీ గోరును ఉంచి స్పష్టమైన చిత్రం తీయండి"
    },
    eye: {
        en: "Gently pull down your lower eyelid to show the conjunctiva",
        hi: "कंजंक्टिवा दिखाने के लिए अपनी निचली पलक को धीरे से नीचे खींचें",
        te: "కంజంక్టివాను చూపించడానికి మీ దిగువ కనురెప్పను మెల్లగా కిందికి లాగండి"
    },
    tongue: {
        en: "Extend your tongue and ensure good lighting for clear visibility",
        hi: "अपनी जीभ बाहर निकालें और स्पष्ट दिखाई देने के लिए अच्छी रोशनी सुनिश्चित करें",
        te: "మీ నాలుకను బయటకు తీసి స్పష్టంగా కనిపించేలా మంచి వెలుతురు ఉండేలా చూసుకోండి"
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen for 2 seconds
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('hidden');
    }, 2000);

    // Initialize event listeners
    initializeEventListeners();
    
    // Load saved data
    loadSavedData();
});

function initializeEventListeners() {
    // Auth form
    document.getElementById('auth-form').addEventListener('submit', handleAuth);
    
    // Password toggles
    document.getElementById('toggle-password').addEventListener('click', () => togglePassword('password'));
    document.getElementById('toggle-confirm-password').addEventListener('click', () => togglePassword('confirm-password'));
    
    // Edit profile form
    document.getElementById('edit-profile-form').addEventListener('submit', handleEditProfile);
}

// Authentication Functions
function toggleAuthMode() {
    isLogin = !isLogin;
    
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const submitText = document.getElementById('submit-text');
    const toggleText = document.getElementById('toggle-text');
    const toggleLink = document.getElementById('toggle-link');
    const fullnameField = document.getElementById('fullname-field');
    const confirmPasswordField = document.getElementById('confirm-password-field');
    const forgotPassword = document.getElementById('forgot-password');
    
    if (isLogin) {
        formTitle.textContent = 'Welcome Back';
        formSubtitle.textContent = 'Sign in to continue your health journey';
        submitText.textContent = 'Sign In';
        toggleText.textContent = "Don't have an account? ";
        toggleLink.textContent = 'Sign Up';
        fullnameField.classList.add('hidden');
        confirmPasswordField.classList.add('hidden');
        forgotPassword.classList.remove('hidden');
    } else {
        formTitle.textContent = 'Create Account';
        formSubtitle.textContent = 'Join thousands monitoring their health with AI';
        submitText.textContent = 'Create Account';
        toggleText.textContent = 'Already have an account? ';
        toggleLink.textContent = 'Sign In';
        fullnameField.classList.remove('hidden');
        confirmPasswordField.classList.remove('hidden');
        forgotPassword.classList.add('hidden');
    }
    
    // Clear form
    document.getElementById('auth-form').reset();
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = document.getElementById(`toggle-${fieldId}`);
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullname = document.getElementById('fullname').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Basic validation
    if (!email || !password) {
        showToast('Error', 'Please fill in all required fields', 'error');
        return;
    }
    
    if (!isLogin) {
        if (!fullname) {
            showToast('Error', 'Please enter your full name', 'error');
            return;
        }
        if (password !== confirmPassword) {
            showToast('Error', 'Passwords do not match', 'error');
            return;
        }
        if (password.length < 6) {
            showToast('Error', 'Password must be at least 6 characters', 'error');
            return;
        }
    }
    
    // Simulate authentication
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    
    submitBtn.disabled = true;
    submitText.textContent = 'Please wait...';
    
    setTimeout(() => {
        currentUser = {
            name: fullname || 'User',
            email: email,
            age: 28,
            gender: 'female',
            bloodType: 'O+'
        };
        
        saveUserData();
        showMainApp();
        showToast('Success', isLogin ? 'Welcome back!' : 'Account created successfully!', 'success');
        
        submitBtn.disabled = false;
        submitText.textContent = isLogin ? 'Sign In' : 'Create Account';
    }, 1500);
}

function continueAsGuest() {
    currentUser = {
        name: 'Guest User',
        email: 'guest@example.com',
        age: 28,
        gender: 'female',
        bloodType: 'O+'
    };
    
    showMainApp();
    showToast('Info', 'Exploring as guest. Create an account to save your data!', 'warning');
}

function showMainApp() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    updateProfileDisplay();
    updateDashboard();
}

function showForgotPassword() {
    showToast('Info', 'Password reset functionality would be implemented here', 'info');
}

// Tab Navigation
function switchTab(tabName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    currentTab = tabName;
    
    // Update tab-specific content
    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'reports') {
        updateReports();
    }
}

// Detection Functions
function selectLanguage(lang) {
    selectedLanguage = lang;
    
    document.querySelectorAll('.language-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    
    updateInstructions();
}

function selectBodyPart(part) {
    selectedBodyPart = part;
    
    document.querySelectorAll('.body-part-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-part="${part}"]`).classList.add('active');
    
    updateInstructions();
    updateAnalyzeButton();
}

function updateInstructions() {
    const instructionsCard = document.getElementById('instructions-card');
    const instructionsText = document.getElementById('instructions-text');
    
    if (selectedBodyPart) {
        instructionsCard.classList.remove('hidden');
        instructionsText.textContent = bodyPartInstructions[selectedBodyPart][selectedLanguage];
    } else {
        instructionsCard.classList.add('hidden');
    }
}

function speakInstructions() {
    if (selectedBodyPart && 'speechSynthesis' in window) {
        const text = bodyPartInstructions[selectedBodyPart][selectedLanguage];
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage === 'hi' ? 'hi-IN' : 'te-IN';
        speechSynthesis.speak(utterance);
    } else {
        showToast('Info', 'Speech synthesis not supported in this browser', 'warning');
    }
}

function takePhoto() {
    // In a real app, this would open the camera
    showToast('Info', 'Camera functionality would be implemented here. For now, please use upload.', 'info');
}

function uploadImage() {
    document.getElementById('image-input').click();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedImage = e.target.result;
            showImagePreview();
            updateAnalyzeButton();
        };
        reader.readAsDataURL(file);
    }
}

function showImagePreview() {
    const preview = document.getElementById('image-preview');
    const previewImage = document.getElementById('preview-image');
    
    previewImage.src = selectedImage;
    preview.classList.remove('hidden');
}

function updateAnalyzeButton() {
    const analyzeButton = document.getElementById('analyze-button');
    analyzeButton.disabled = !(selectedBodyPart && selectedImage);
}

function analyzeImage() {
    if (!selectedBodyPart || !selectedImage) {
        showToast('Error', 'Please select a body part and upload an image', 'error');
        return;
    }
    
    // Hide previous results
    document.getElementById('analysis-results').classList.add('hidden');
    
    // Show loading
    document.getElementById('analysis-loading').classList.remove('hidden');
    
    // Simulate analysis
    setTimeout(() => {
        const result = generateMockAnalysis();
        showAnalysisResults(result);
        
        // Save to history
        analysisHistory.unshift(result);
        saveAnalysisData();
        
        // Hide loading
        document.getElementById('analysis-loading').classList.add('hidden');
        
        // Update dashboard
        updateDashboard();
    }, 3000);
}

function generateMockAnalysis() {
    const severities = ['normal', 'mild', 'moderate', 'severe'];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    const hemoglobinRanges = {
        normal: [12.0, 15.0],
        mild: [10.0, 12.0],
        moderate: [8.0, 10.0],
        severe: [6.0, 8.0]
    };
    
    const [min, max] = hemoglobinRanges[severity];
    const hemoglobin = (Math.random() * (max - min) + min).toFixed(1);
    
    const recommendations = {
        normal: [
            'Your analysis appears healthy',
            'Continue maintaining a balanced diet',
            'Regular monitoring recommended every 3 months'
        ],
        mild: [
            'Slight signs detected',
            'Increase iron-rich foods like spinach and lentils',
            'Consider consulting a healthcare provider'
        ],
        moderate: [
            'Noticeable signs detected',
            'Consult a healthcare provider immediately',
            'Begin iron supplementation as prescribed'
        ],
        severe: [
            'Significant signs detected',
            'Seek immediate medical attention',
            'Urgent blood work recommended'
        ]
    };
    
    return {
        id: Date.now(),
        timestamp: new Date(),
        bodyPart: selectedBodyPart,
        severity: severity,
        confidence: Math.floor(Math.random() * 20) + 75, // 75-95%
        hemoglobin: parseFloat(hemoglobin),
        recommendations: recommendations[severity],
        image: selectedImage
    };
}

function showAnalysisResults(result) {
    const resultsCard = document.getElementById('analysis-results');
    const analysisTime = document.getElementById('analysis-time');
    const resultsContent = document.getElementById('results-content');
    
    analysisTime.textContent = result.timestamp.toLocaleTimeString();
    
    const severityColors = {
        normal: '#059669',
        mild: '#d97706',
        moderate: '#dc2626',
        severe: '#991b1b'
    };
    
    const severityEmojis = {
        normal: '✅',
        mild: '⚠️',
        moderate: '🔶',
        severe: '🚨'
    };
    
    resultsContent.innerHTML = `
        <div class="severity-indicator">
            <div class="severity-badge">
                <span class="severity-emoji">${severityEmojis[result.severity]}</span>
                <span class="severity-text" style="background-color: ${severityColors[result.severity]}">${result.severity.toUpperCase()}</span>
            </div>
            <div class="confidence-info">
                <span class="confidence-label">Confidence</span>
                <span class="confidence-value">${result.confidence}%</span>
            </div>
        </div>
        
        <div class="result-metrics">
            <div class="result-item">
                <span class="result-label">Body Part Analyzed:</span>
                <span class="result-value">${result.bodyPart.charAt(0).toUpperCase() + result.bodyPart.slice(1)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Estimated Hemoglobin Level:</span>
                <span class="result-value hemoglobin-value">${result.hemoglobin} g/dL</span>
            </div>
        </div>
        
        <div class="recommendations-section">
            <h4 class="recommendations-title">Recommendations:</h4>
            ${result.recommendations.map(rec => `
                <div class="recommendation-item">
                    <span class="recommendation-bullet">•</span>
                    <span class="recommendation-text">${rec}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="disclaimer">
            ⚠️ This is an AI-powered screening tool for educational purposes. Please consult a healthcare professional for proper diagnosis and treatment.
        </div>
    `;
    
    resultsCard.classList.remove('hidden');
    
    // Scroll to results
    resultsCard.scrollIntoView({ behavior: 'smooth' });
    
    showToast('Success', `Analysis complete! Severity: ${result.severity.toUpperCase()}`, 'success');
}

// Dashboard Functions
function updateDashboard() {
    updateStats();
    updateRecentScans();
}

function updateStats() {
    const totalScans = analysisHistory.length;
    const normalResults = analysisHistory.filter(r => r.severity === 'normal').length;
    const avgHemoglobin = totalScans > 0 ? 
        (analysisHistory.reduce((sum, r) => sum + r.hemoglobin, 0) / totalScans).toFixed(1) : 
        '12.5';
    
    document.getElementById('total-scans').textContent = totalScans;
    document.getElementById('normal-results').textContent = normalResults;
    document.getElementById('avg-hemoglobin').textContent = avgHemoglobin;
}

function updateRecentScans() {
    const recentScansContainer = document.getElementById('recent-scans');
    
    if (analysisHistory.length === 0) {
        recentScansContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-camera"></i>
                <p>No scans yet. Start by analyzing an image!</p>
            </div>
        `;
        return;
    }
    
    const recentScans = analysisHistory.slice(0, 3);
    const severityColors = {
        normal: '#059669',
        mild: '#d97706',
        moderate: '#dc2626',
        severe: '#991b1b'
    };
    
    recentScansContainer.innerHTML = recentScans.map(scan => `
        <div class="scan-item">
            <div class="scan-header">
                <span class="scan-date">${scan.timestamp.toLocaleDateString()}</span>
                <span class="scan-severity" style="background-color: ${severityColors[scan.severity]}">${scan.severity.toUpperCase()}</span>
            </div>
            <div class="scan-metrics">
                <div class="scan-metric">
                    <div class="scan-metric-value">${scan.hemoglobin}</div>
                    <div class="scan-metric-label">Hb (g/dL)</div>
                </div>
                <div class="scan-metric">
                    <div class="scan-metric-value">${scan.confidence}%</div>
                    <div class="scan-metric-label">Confidence</div>
                </div>
                <div class="scan-metric">
                    <div class="scan-metric-value">${scan.bodyPart}</div>
                    <div class="scan-metric-label">Body Part</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Reports Functions
function updateReports() {
    const reportsContainer = document.getElementById('reports-list');
    
    if (analysisHistory.length === 0) {
        reportsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-medical"></i>
                <p>No reports available yet. Start by analyzing an image!</p>
            </div>
        `;
        return;
    }
    
    const severityColors = {
        normal: '#059669',
        mild: '#d97706',
        moderate: '#dc2626',
        severe: '#991b1b'
    };
    
    const typeEmojis = {
        nail: '💅',
        eye: '👁️',
        tongue: '👅'
    };
    
    reportsContainer.innerHTML = analysisHistory.map(report => `
        <div class="report-item">
            <div class="report-header">
                <div class="report-type">
                    <span class="report-emoji">${typeEmojis[report.bodyPart]}</span>
                    <div class="report-info">
                        <h4>${report.bodyPart.charAt(0).toUpperCase() + report.bodyPart.slice(1)} Analysis</h4>
                        <span class="report-date">${report.timestamp.toLocaleDateString()}</span>
                    </div>
                </div>
                <span class="report-severity" style="background-color: ${severityColors[report.severity]}">${report.severity.toUpperCase()}</span>
            </div>
            <div class="report-metrics">
                <div class="report-metric">
                    <div class="report-metric-value">${report.hemoglobin} g/dL</div>
                    <div class="report-metric-label">Hemoglobin</div>
                </div>
                <div class="report-metric">
                    <div class="report-metric-value">${report.confidence}%</div>
                    <div class="report-metric-label">Confidence</div>
                </div>
            </div>
        </div>
    `).join('');
}

function exportReports() {
    if (analysisHistory.length === 0) {
        showToast('Warning', 'No reports to export', 'warning');
        return;
    }
    
    const csvContent = generateCSV();
    downloadCSV(csvContent, 'anemia_reports.csv');
    showToast('Success', 'Reports exported successfully!', 'success');
}

function generateCSV() {
    const headers = ['Date', 'Body Part', 'Severity', 'Hemoglobin (g/dL)', 'Confidence (%)'];
    const rows = analysisHistory.map(report => [
        report.timestamp.toLocaleDateString(),
        report.bodyPart,
        report.severity,
        report.hemoglobin,
        report.confidence
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');
    
    return csvContent;
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Profile Functions
function updateProfileDisplay() {
    if (currentUser) {
        document.getElementById('profile-name').textContent = currentUser.name;
        document.getElementById('profile-details').textContent = `${currentUser.age} years • ${currentUser.gender} • ${currentUser.bloodType}`;
        document.getElementById('profile-email').textContent = currentUser.email;
    }
}

function editProfile() {
    // Populate form with current data
    document.getElementById('edit-name').value = currentUser.name;
    document.getElementById('edit-email').value = currentUser.email;
    document.getElementById('edit-age').value = currentUser.age;
    document.getElementById('edit-gender').value = currentUser.gender;
    document.getElementById('edit-blood-type').value = currentUser.bloodType;
    
    // Show modal
    document.getElementById('edit-profile-modal').classList.remove('hidden');
}

function closeEditProfile() {
    document.getElementById('edit-profile-modal').classList.add('hidden');
}

function handleEditProfile(e) {
    e.preventDefault();
    
    // Update user data
    currentUser.name = document.getElementById('edit-name').value;
    currentUser.email = document.getElementById('edit-email').value;
    currentUser.age = parseInt(document.getElementById('edit-age').value);
    currentUser.gender = document.getElementById('edit-gender').value;
    currentUser.bloodType = document.getElementById('edit-blood-type').value;
    
    // Save and update display
    saveUserData();
    updateProfileDisplay();
    closeEditProfile();
    
    showToast('Success', 'Profile updated successfully!', 'success');
}

function showHelp() {
    showToast('Info', 'Help center would open here with FAQs and guides', 'info');
}

function contactSupport() {
    showToast('Info', 'Support contact form would open here', 'info');
}

function logout() {
    if (confirm('Are you sure you want to log out?')) {
        currentUser = null;
        analysisHistory = [];
        selectedImage = null;
        selectedBodyPart = null;
        
        // Clear saved data
        localStorage.removeItem('anemiaDetectUser');
        localStorage.removeItem('anemiaDetectHistory');
        
        // Reset UI
        document.getElementById('main-app').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('auth-form').reset();
        
        showToast('Info', 'Logged out successfully', 'info');
    }
}

// Utility Functions
function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Data Persistence
function saveUserData() {
    if (currentUser) {
        localStorage.setItem('anemiaDetectUser', JSON.stringify(currentUser));
    }
}

function saveAnalysisData() {
    localStorage.setItem('anemiaDetectHistory', JSON.stringify(analysisHistory));
}

function loadSavedData() {
    // Load user data
    const savedUser = localStorage.getItem('anemiaDetectUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    // Load analysis history
    const savedHistory = localStorage.getItem('anemiaDetectHistory');
    if (savedHistory) {
        analysisHistory = JSON.parse(savedHistory).map(item => ({
            ...item,
            timestamp: new Date(item.timestamp)
        }));
    }
    
    // If user is logged in, show main app
    if (currentUser) {
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            showMainApp();
        }, 2000);
    }
}