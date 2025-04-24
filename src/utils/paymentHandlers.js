// 1. First, let's update the existing handlePaymentSuccess in paymentHandlers.js
// This already exists but let's make sure it's used correctly

/**
 * Sets the payment as successful and redirects to the success page
 * @param {string} referenceId - The payment reference ID
 * @param {object} userData - Optional user data to store
 */
export const handlePaymentSuccess = (referenceId, userData = null) => {
  // Store the payment success flag
  sessionStorage.setItem('paymentSuccessful', 'true');
  
  // Store the reference ID
  sessionStorage.setItem('referenceId', referenceId);
  
  // Store user data if provided
  if (userData) {
    sessionStorage.setItem('userData', JSON.stringify(userData));
  }
  
  // Navigate to success page with reference ID
  window.location.href = `/success?refId=${referenceId}`;
};