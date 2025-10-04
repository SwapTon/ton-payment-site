// DOM Elements
const amountInput = document.getElementById('amount');
const tonAmountOutput = document.getElementById('tonAmount');
const rateValue = document.getElementById('rateValue');
const createPaymentBtn = document.getElementById('createPayment');
const paymentModal = document.getElementById('paymentModal');
const closeModal = document.getElementById('closeModal');
const qrCode = document.getElementById('qrCode');
const paymentAddress = document.getElementById('paymentAddress');
const sendAmount = document.getElementById('sendAmount');
const receiveAmount = document.getElementById('receiveAmount');
const timeRemaining = document.getElementById('timeRemaining');
const timerProgress = document.getElementById('timerProgress');
const copyAddressBtn = document.getElementById('copyAddress');
const themeToggle = document.getElementById('themeToggle');

// Initialize the application
function init() {
    updateExchangeRate();
    setupEventListeners();
    loadTheme();
}

// Update exchange rate display
function updateExchangeRate() {
    rateValue.textContent = `1 TON = $${CONFIG.EXCHANGE_RATE}`;
}

// Calculate TON amount based on USD input
function calculateTonAmount() {
    const usdAmount = parseFloat(amountInput.value) || 0;
    if (usdAmount < CONFIG.MIN_AMOUNT) {
        tonAmountOutput.value = '';
        return;
    }
    
    const tonAmount = (usdAmount / CONFIG.EXCHANGE_RATE) * (1 - CONFIG.SERVICE_FEE);
    tonAmountOutput.value = tonAmount.toFixed(6);
}

// Setup event listeners
function setupEventListeners() {
    amountInput.addEventListener('input', calculateTonAmount);
    
    createPaymentBtn.addEventListener('click', function() {
        const usdAmount = parseFloat(amountInput.value) || 0;
        if (usdAmount < CONFIG.MIN_AMOUNT) {
            alert(`Minimum amount is $${CONFIG.MIN_AMOUNT}`);
            return;
        }
        if (usdAmount > CONFIG.MAX_AMOUNT) {
            alert(`Maximum amount is $${CONFIG.MAX_AMOUNT}`);
            return;
        }
        createPayment(usdAmount);
    });
    
    closeModal.addEventListener('click', closePaymentModal);
    
    paymentModal.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            closePaymentModal();
        }
    });
    
    copyAddressBtn.addEventListener('click', copyAddressToClipboard);
    
    themeToggle.addEventListener('click', toggleTheme);
}

// Create payment
function createPayment(usdAmount) {
    const tonAmount = (usdAmount / CONFIG.EXCHANGE_RATE) * (1 - CONFIG.SERVICE_FEE);
    
    // Update modal content
    paymentAddress.textContent = CONFIG.RECIPIENT_TON_ADDRESS;
    sendAmount.textContent = `${tonAmount.toFixed(6)} TON`;
    receiveAmount.textContent = `$${usdAmount.toFixed(2)}`;
    
    // Generate QR code (simplified - in real implementation use a QR library)
    generateQRCode(CONFIG.RECIPIENT_TON_ADDRESS);
    
    // Show modal
    paymentModal.style.display = 'flex';
    
    // Start payment timer
    startPaymentTimer();
}

// Generate QR code (simplified version)
function generateQRCode(address) {
    qrCode.innerHTML = `
        <div style="text-align: center; padding: 1rem;">
            <div style="background: #f0f0f0; padding: 2rem; border-radius: 8px; margin-bottom: 1rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📱</div>
                <div style="color: #666; font-size: 0.9rem;">QR Code Placeholder</div>
            </div>
            <div style="color: #666; font-size: 0.8rem;">
                In production, this would show a QR code for: ${address.substring(0, 20)}...
            </div>
        </div>
    `;
}

// Start payment timer
function startPaymentTimer() {
    let timeLeft = CONFIG.PAYMENT_TIMEOUT;
    
    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            closePaymentModal();
            alert('Payment time has expired. Please create a new payment.');
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeRemaining.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const progress = (timeLeft / CONFIG.PAYMENT_TIMEOUT) * 100;
        timerProgress.style.width = `${progress}%`;
        
        // Change color when time is running out
        if (timeLeft < 60) {
            timerProgress.style.background = 'linear-gradient(90deg, var(--error), var(--warning))';
        }
        
        timeLeft--;
    }, 1000);
}

// Close payment modal
function closePaymentModal() {
    paymentModal.style.display = 'none';
}

// Copy address to clipboard
function copyAddressToClipboard() {
    navigator.clipboard.writeText(CONFIG.RECIPIENT_TON_ADDRESS).then(() => {
        const originalText = copyAddressBtn.textContent;
        copyAddressBtn.textContent = 'Copied!';
        copyAddressBtn.style.background = 'var(--success)';
        
        setTimeout(() => {
            copyAddressBtn.textContent = originalText;
            copyAddressBtn.style.background = 'var(--accent-primary)';
        }, 2000);
    });
}

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'light') {
        document.body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<span class="theme-icon">🌙</span>';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<span class="theme-icon">☀️</span>';
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<span class="theme-icon">☀️</span>';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
});

// Payment status check simulation (would connect to your backend in production)
function checkPaymentStatus() {
    // This would typically connect to your backend to check if payment was received
    console.log('Checking payment status...');
}
