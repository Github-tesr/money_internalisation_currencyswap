// RupeeX Simplified Application - Reliable Foundation
// Comprehensive error handling and step-by-step initialization

// Debug logging function
function debugLog(message, data) {
    console.log(`[RupeeX Debug] ${message}`, data || '');
}

// Performance monitoring
const startTime = performance.now();
function logPerformance(stage) {
    const elapsed = performance.now() - startTime;
    console.log(`[Performance] ${stage}: ${elapsed.toFixed(2)}ms`);
}

// Simple data structure
const appData = {
    user: {
        email: "test@test.com",
        password: "123456",
        name: "Test User"
    },
    rates: {
        "INR_USD": 0.012,
        "USD_INR": 83.25,
        "INR_EUR": 0.011,
        "EUR_INR": 91.74,
        "USD_EUR": 0.92,
        "EUR_USD": 1.09
    },
    analytics: [
        {month: "Jan", volume: 1000000},
        {month: "Feb", volume: 1200000},
        {month: "Mar", volume: 1100000},
        {month: "Apr", volume: 1400000},
        {month: "May", volume: 1300000}
    ],
    transactions: [
        {
            id: "TXN001",
            from: "INR",
            to: "USD",
            amount: "10,000",
            status: "Completed",
            date: "2024-09-10"
        },
        {
            id: "TXN002", 
            from: "USD",
            to: "EUR",
            amount: "500",
            status: "Processing",
            date: "2024-09-11"
        }
    ]
};

// Application state
let appState = {
    currentPage: 'home',
    isLoggedIn: false,
    currentUser: null,
    swapData: {
        fromCurrency: 'INR',
        toCurrency: 'USD',
        fromAmount: 0,
        toAmount: 0
    }
};

// Error handling wrapper
function safeExecute(fn, context = 'Unknown') {
    try {
        return fn();
    } catch (error) {
        console.error(`[RupeeX Error] ${context}:`, error);
        showErrorMessage(`Error in ${context}: ${error.message}`);
        return false;
    }
}

// Show error message
function showErrorMessage(message) {
    const errorDisplay = document.getElementById('error-display');
    const errorMessage = document.getElementById('error-message');
    
    if (errorDisplay && errorMessage) {
        errorMessage.textContent = message;
        errorDisplay.classList.remove('hidden');
    } else {
        alert(`Error: ${message}`);
    }
}

// Show loading status
function updateLoadingStatus(message) {
    const loadingStatus = document.getElementById('loading-status');
    if (loadingStatus) {
        loadingStatus.textContent = message;
    }
    debugLog('Loading Status', message);
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }
}

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
    debugLog('Showing toast', {message, type});
    
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        alert(message);
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌', 
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">${icons[type] || 'ℹ️'}</div>
            <div class="toast-message">
                <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <p class="toast-description">${message}</p>
            </div>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
}

// Navigation system
function showPage(pageName) {
    debugLog('Navigating to page', pageName);
    
    safeExecute(() => {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        
        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Update navigation
            updateNavigation(pageName);
            appState.currentPage = pageName;
            
            // Initialize page-specific functionality
            initializePage(pageName);
            
            showToast(`Navigated to ${pageName}`, 'success', 1000);
        } else {
            showToast(`Page ${pageName} not found`, 'error');
        }
    }, 'Navigation');
}

// Update navigation active state
function updateNavigation(currentPage) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize page-specific functionality
function initializePage(pageName) {
    debugLog('Initializing page', pageName);
    
    switch (pageName) {
        case 'swap':
            initializeSwapPage();
            break;
        case 'analytics':
            initializeAnalyticsPage();
            break;
        case 'history':
            initializeHistoryPage();
            break;
    }
}

// Swap page functionality
function initializeSwapPage() {
    safeExecute(() => {
        updateExchangeRate();
        setupSwapCalculation();
    }, 'Swap Page Initialization');
}

function setupSwapCalculation() {
    const fromAmount = document.getElementById('from-amount');
    const toAmount = document.getElementById('to-amount');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    
    if (fromAmount && toAmount && fromCurrency && toCurrency) {
        fromAmount.addEventListener('input', calculateSwap);
        fromCurrency.addEventListener('change', calculateSwap);
        toCurrency.addEventListener('change', calculateSwap);
    }
}

function calculateSwap() {
    safeExecute(() => {
        const fromAmount = document.getElementById('from-amount');
        const toAmount = document.getElementById('to-amount');
        const fromCurrency = document.getElementById('from-currency');
        const toCurrency = document.getElementById('to-currency');
        
        if (fromAmount && toAmount && fromCurrency && toCurrency) {
            const amount = parseFloat(fromAmount.value) || 0;
            const from = fromCurrency.value;
            const to = toCurrency.value;
            
            const rateKey = `${from}_${to}`;
            const rate = appData.rates[rateKey] || 1;
            const result = amount * rate;
            
            toAmount.value = result.toFixed(6);
            
            // Update rate display
            updateExchangeRate();
            
            // Update app state
            appState.swapData = {
                fromCurrency: from,
                toCurrency: to,
                fromAmount: amount,
                toAmount: result
            };
        }
    }, 'Swap Calculation');
}

function updateExchangeRate() {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const rateDisplay = document.getElementById('current-rate');
    
    if (fromCurrency && toCurrency && rateDisplay) {
        const from = fromCurrency.value;
        const to = toCurrency.value;
        const rateKey = `${from}_${to}`;
        const rate = appData.rates[rateKey] || 1;
        
        rateDisplay.textContent = `1 ${from} = ${rate.toFixed(6)} ${to}`;
    }
}

function swapCurrencies() {
    debugLog('Swapping currencies');
    
    safeExecute(() => {
        const fromCurrency = document.getElementById('from-currency');
        const toCurrency = document.getElementById('to-currency');
        const fromAmount = document.getElementById('from-amount');
        const toAmount = document.getElementById('to-amount');
        
        if (fromCurrency && toCurrency && fromAmount && toAmount) {
            // Swap currency selections
            const tempCurrency = fromCurrency.value;
            fromCurrency.value = toCurrency.value;
            toCurrency.value = tempCurrency;
            
            // Swap amounts
            const tempAmount = fromAmount.value;
            fromAmount.value = toAmount.value;
            toAmount.value = tempAmount;
            
            calculateSwap();
            showToast('Currencies swapped!', 'success', 1000);
        }
    }, 'Currency Swap');
}

function executeSwap() {
    debugLog('Executing swap', appState.swapData);
    
    if (!appState.isLoggedIn) {
        showToast('Please log in to execute swaps', 'warning');
        showPage('login');
        return;
    }
    
    const {fromCurrency, toCurrency, fromAmount, toAmount} = appState.swapData;
    
    if (fromAmount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }
    
    // Simulate swap execution
    showToast('Processing swap...', 'info');
    
    setTimeout(() => {
        // Add to transaction history
        const newTransaction = {
            id: `TXN${String(appData.transactions.length + 1).padStart(3, '0')}`,
            from: fromCurrency,
            to: toCurrency,
            amount: fromAmount.toLocaleString(),
            status: 'Completed',
            date: new Date().toISOString().split('T')[0]
        };
        
        appData.transactions.unshift(newTransaction);
        
        showToast(`Successfully swapped ${fromAmount} ${fromCurrency} to ${toAmount.toFixed(2)} ${toCurrency}`, 'success');
        
        // Clear form
        const fromAmountInput = document.getElementById('from-amount');
        const toAmountInput = document.getElementById('to-amount');
        if (fromAmountInput) fromAmountInput.value = '';
        if (toAmountInput) toAmountInput.value = '';
        
    }, 2000);
}

// Analytics page
function initializeAnalyticsPage() {
    debugLog('Initializing analytics page');
    safeExecute(() => {
        createVolumeChart();
    }, 'Analytics Initialization');
}

function createVolumeChart() {
    const canvas = document.getElementById('volume-chart');
    if (!canvas || typeof Chart === 'undefined') {
        debugLog('Chart.js not available or canvas not found');
        return;
    }
    
    safeExecute(() => {
        const ctx = canvas.getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: appData.analytics.map(d => d.month),
                datasets: [{
                    label: 'Trading Volume',
                    data: appData.analytics.map(d => d.volume / 1000000),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value + 'M';
                            }
                        }
                    }
                }
            }
        });
        
        debugLog('Chart created successfully');
    }, 'Chart Creation');
}

// History page
function initializeHistoryPage() {
    debugLog('Initializing history page');
    safeExecute(() => {
        populateTransactionTable();
    }, 'History Initialization');
}

function populateTransactionTable() {
    const tbody = document.getElementById('transactions-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    appData.transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.from}</td>
            <td>${transaction.to}</td>
            <td>${transaction.amount}</td>
            <td><span class="status status--${transaction.status.toLowerCase()}">${transaction.status}</span></td>
            <td>${transaction.date}</td>
        `;
        tbody.appendChild(row);
    });
    
    debugLog('Transaction table populated', appData.transactions.length);
}

// Authentication
function handleLogin(event) {
    event.preventDefault();
    debugLog('Handling login');
    
    safeExecute(() => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simple validation
        if (email === appData.user.email && password === appData.user.password) {
            appState.isLoggedIn = true;
            appState.currentUser = appData.user;
            
            updateAuthUI();
            showPage('swap');
            showToast('Login successful!', 'success');
        } else {
            showToast('Invalid credentials. Use test@test.com / 123456', 'error');
        }
    }, 'Login Handler');
}

function handleSignup(event) {
    event.preventDefault();
    debugLog('Handling signup');
    
    safeExecute(() => {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        if (!name || !email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        // Simulate successful signup
        appState.isLoggedIn = true;
        appState.currentUser = {name, email};
        
        updateAuthUI();
        showPage('swap');
        showToast('Account created successfully!', 'success');
    }, 'Signup Handler');
}

function handleLogout() {
    debugLog('Handling logout');
    
    safeExecute(() => {
        appState.isLoggedIn = false;
        appState.currentUser = null;
        
        updateAuthUI();
        showPage('home');
        showToast('Logged out successfully', 'info');
    }, 'Logout Handler');
}

function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    
    if (appState.isLoggedIn) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (signupBtn) signupBtn.classList.add('hidden');
        if (userMenu) userMenu.classList.remove('hidden');
        if (userName && appState.currentUser) userName.textContent = appState.currentUser.name;
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (signupBtn) signupBtn.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
}

// Chatbot functionality
let chatbotMessages = [];

function toggleChatbot() {
    debugLog('Toggling chatbot');
    
    const chatWindow = document.getElementById('chatbot-window');
    if (chatWindow) {
        chatWindow.classList.toggle('hidden');
        
        // Add welcome message if first time
        if (chatbotMessages.length === 0) {
            addChatMessage('bot', 'Hi! I\'m your RupeeX assistant. How can I help you today?');
        }
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatbot-input');
    if (!input || !input.value.trim()) return;
    
    const message = input.value.trim();
    addChatMessage('user', message);
    input.value = '';
    
    // Simple bot responses
    setTimeout(() => {
        const response = getChatbotResponse(message);
        addChatMessage('bot', response);
    }, 1000);
}

function addChatMessage(sender, message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;
    
    chatbotMessages.push({sender, message, timestamp: Date.now()});
    
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}`;
    messageElement.innerHTML = `
        <div class="message-bubble">
            ${message}
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getChatbotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('rate') || lowerMessage.includes('exchange')) {
        return 'Current exchange rates: 1 USD = ₹83.25, 1 EUR = ₹91.74. Rates update in real-time!';
    }
    
    if (lowerMessage.includes('swap') || lowerMessage.includes('exchange')) {
        return 'To make a currency swap, go to the Swap page, select your currencies, enter the amount, and click Execute Swap.';
    }
    
    if (lowerMessage.includes('account') || lowerMessage.includes('login')) {
        return 'You can create an account or login using the buttons in the top navigation. Use test@test.com / 123456 for demo login.';
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
        return 'I can help you with exchange rates, making swaps, account questions, and platform navigation. What would you like to know?';
    }
    
    return 'Thanks for your question! I can help with exchange rates, currency swaps, accounts, and general platform support. What would you like to know more about?';
}

// Event listener setup
function setupEventListeners() {
    debugLog('Step 2: Setting up event listeners');
    
    // Navigation
    const navButtons = document.querySelectorAll('.nav-link');
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            if (page) showPage(page);
        });
    });
    
    // Auth buttons
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => showPage('login'));
    }
    
    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', () => showPage('signup'));
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Auth forms
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Auth page navigation
    const showSignupBtn = document.getElementById('show-signup');
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', () => showPage('signup'));
    }
    
    const showLoginBtn = document.getElementById('show-login');
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => showPage('login'));
    }
    
    // Hero buttons
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            if (appState.isLoggedIn) {
                showPage('swap');
            } else {
                showPage('signup');
            }
        });
    }
    
    const learnMoreBtn = document.getElementById('learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => showPage('analytics'));
    }
    
    // Swap functionality
    const swapCurrenciesBtn = document.getElementById('swap-currencies');
    if (swapCurrenciesBtn) {
        swapCurrenciesBtn.addEventListener('click', swapCurrencies);
    }
    
    const swapNowBtn = document.getElementById('swap-now-btn');
    if (swapNowBtn) {
        swapNowBtn.addEventListener('click', executeSwap);
    }
    
    // Chatbot
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    if (chatbotTrigger) {
        chatbotTrigger.addEventListener('click', toggleChatbot);
    }
    
    const chatbotClose = document.getElementById('chatbot-close');
    if (chatbotClose) {
        chatbotClose.addEventListener('click', toggleChatbot);
    }
    
    const chatbotSend = document.getElementById('chatbot-send');
    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendChatMessage);
    }
    
    const chatbotInput = document.getElementById('chatbot-input');
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    debugLog('All event listeners attached successfully');
}

function loadInitialData() {
    debugLog('Step 3: Loading initial data');
    
    // Simulate data loading
    try {
        // Data is already loaded in appData object
        debugLog('Exchange rates loaded', Object.keys(appData.rates).length);
        debugLog('Analytics data loaded', appData.analytics.length);
        debugLog('Transactions loaded', appData.transactions.length);
        
        logPerformance('Data Loading');
        return true;
    } catch (error) {
        console.error('Error loading data:', error);
        return false;
    }
}

function showDefaultPage() {
    debugLog('Step 4: Showing default page');
    
    try {
        showPage('home');
        updateAuthUI();
        logPerformance('Page Display');
        return true;
    } catch (error) {
        console.error('Error showing default page:', error);
        return false;
    }
}

// Main initialization function
function initializeApp() {
    try {
        console.log('🚀 RupeeX - Starting initialization...');
        
        updateLoadingStatus('Checking DOM...');
        console.log('Step 1: DOM loaded');
        logPerformance('DOM Ready');
        
        updateLoadingStatus('Setting up event handlers...');
        setupEventListeners();
        console.log('Step 2: Events attached');
        
        updateLoadingStatus('Loading application data...');
        if (!loadInitialData()) {
            throw new Error('Failed to load initial data');
        }
        console.log('Step 3: Data loaded');
        
        updateLoadingStatus('Initializing interface...');
        if (!showDefaultPage()) {
            throw new Error('Failed to show default page');
        }
        console.log('Step 4: Page displayed');
        
        updateLoadingStatus('Finalizing...');
        
        // Final setup
        setTimeout(() => {
            hideLoadingScreen();
            showToast('RupeeX loaded successfully!', 'success');
            console.log('✅ RupeeX initialization completed successfully');
            logPerformance('Total Initialization');
        }, 1000);
        
    } catch (error) {
        console.error('💥 Initialization error:', error);
        showErrorMessage(`Failed to load application: ${error.message}`);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('💥 Global error caught:', event.error);
    showToast('An unexpected error occurred', 'error');
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('💥 Unhandled promise rejection:', event.reason);
    showToast('A promise was rejected', 'warning');
});

debugLog('RupeeX application script loaded');
console.log('📋 RupeeX Debug Console Ready - All functions available');