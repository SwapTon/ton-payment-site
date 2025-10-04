// Configuration - Developer can change these values
const CONFIG = {
    RECIPIENT_TON_ADDRESS: "YOUR_TON_ADDRESS_HERE", // Change this to your TON address
    EXCHANGE_RATE: 2.50, // TON to USD rate
    SERVICE_FEE: 0.005, // 0.5%
    PAYMENT_TIMEOUT: 900, // 15 minutes in seconds
    MIN_AMOUNT: 10, // Minimum amount in USD
    MAX_AMOUNT: 10000 // Maximum amount in USD
};

// Export configuration for external use
window.TONExchangeConfig = CONFIG;
