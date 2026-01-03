// Script to change admin password
const API_URL = 'https://brandmark.onrender.com/api';

async function changePassword() {
    // First, login to get token
    const loginData = {
        email: 'admin@brandmarksolutions.site',
        password: 'Admin2026'  // Current password
    };

    try {
        console.log('🔐 Logging in...');
        const loginResponse = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const loginResult = await loginResponse.json();
        
        if (!loginResult.success) {
            console.error('❌ Login failed:', loginResult.message);
            return;
        }

        const token = loginResult.token;
        console.log('✅ Logged in successfully!');

        // Change password
        const newPassword = process.argv[2];
        if (!newPassword) {
            console.error('❌ Please provide a new password');
            console.log('\nUsage: node change-admin-password.js <new-password>');
            console.log('Example: node change-admin-password.js MyNewSecurePass@2026');
            return;
        }

        if (newPassword.length < 6) {
            console.error('❌ New password must be at least 6 characters');
            return;
        }

        console.log('\n🔄 Changing password...');
        const changeResponse = await fetch(`${API_URL}/admin/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                currentPassword: loginData.password,
                newPassword: newPassword
            })
        });

        const changeResult = await changeResponse.json();

        if (changeResult.success) {
            console.log('✅ Password changed successfully!\n');
            console.log('📧 Email:', loginData.email);
            console.log('🔑 New Password:', newPassword);
            console.log('\n⚠️  IMPORTANT: Save your new password securely!');
        } else {
            console.error('❌ Failed to change password:', changeResult.message);
            if (changeResult.errors) {
                console.error('Errors:', changeResult.errors);
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

changePassword();
