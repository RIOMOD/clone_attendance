// Quick test for Continue button functionality
console.log('=== TESTING CONTINUE BUTTON FUNCTIONALITY ===');

// Test function to simulate login success
function testLoginFlow() {
    console.log('Starting login test...');

    // Fill in login form
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');

    if (loginUsername && loginPassword) {
        loginUsername.value = 'test@example.com';
        loginPassword.value = 'password123';
        console.log('✅ Login form filled');

        // Simulate form submission
        setTimeout(() => {
            console.log('Simulating login submission...');

            // Call submitLogin directly
            if (typeof submitLogin === 'function') {
                submitLogin();
                console.log('✅ Login submitted');
            } else {
                console.error('❌ submitLogin function not found');
            }
        }, 1000);
    } else {
        console.error('❌ Login form elements not found');
    }
}

// Test function for modal
function testModal() {
    console.log('Testing modal directly...');

    if (typeof showSuccess === 'function') {
        showSuccess(
            'Test Success!',
            'This is a test message to verify the Continue button works.',
            'Continue Test',
            () => {
                console.log('🎉 SUCCESS: Continue button callback executed!');
                alert('Continue button works perfectly! 🎉');
            }
        );
    } else {
        console.error('❌ showSuccess function not found');
    }
}

// Add buttons to test
function addTestButtons() {
    const testContainer = document.createElement('div');
    testContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 20000;
        background: #1a1a2e;
        padding: 15px;
        border: 2px solid #e94560;
        border-radius: 10px;
        font-family: Arial, sans-serif;
    `;

    testContainer.innerHTML = `
        <h4 style="color: #e94560; margin: 0 0 10px 0;">🧪 Quick Tests</h4>
        <button id="testModalBtn" style="background: #e94560; color: white; border: none; padding: 8px 12px; margin: 5px; border-radius: 5px; cursor: pointer;">Test Modal</button>
        <button id="testLoginBtn" style="background: #0f3460; color: white; border: none; padding: 8px 12px; margin: 5px; border-radius: 5px; cursor: pointer;">Test Login</button>
    `;

    document.body.appendChild(testContainer);

    // Add event listeners
    document.getElementById('testModalBtn').addEventListener('click', testModal);
    document.getElementById('testLoginBtn').addEventListener('click', testLoginFlow);

    console.log('✅ Test buttons added to page');
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(addTestButtons, 2000);
    });
} else {
    setTimeout(addTestButtons, 2000);
}

// Also test modal availability
setTimeout(() => {
    const modal = document.getElementById('successModal');
    const continueBtn = document.getElementById('successContinueBtn');

    console.log('Modal element:', modal ? '✅ Found' : '❌ Not found');
    console.log('Continue button:', continueBtn ? '✅ Found' : '❌ Not found');

    if (modal && continueBtn) {
        console.log('✅ All modal elements are available');
    } else {
        console.error('❌ Missing modal elements');
    }
}, 3000);
