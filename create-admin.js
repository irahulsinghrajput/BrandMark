// Quick script to create admin account
const API_URL = 'https://brandmark.onrender.com/api';

async function createAdmin() {
    const adminData = {
        email: 'admin@brandmarksolutions.site',
        password: 'BrandMark@2026Secure',  // New secure password
        name: 'BrandMark Admin'
    };

    try {
        console.log('Creating admin account...');
        const response = await fetch(`${API_URL}/admin/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        });

        const data = await response.json();
        
        console.log('Response:', data);
        
        if (data.success) {
            console.log('✅ Admin account created successfully!');
            console.log('\n📧 Email:', adminData.email);
            console.log('🔑 Password:', adminData.password);
            console.log('\n🔗 Login at: https://brandmarksolutions.site/admin-dashboard.html');
            console.log('\n⚠️  IMPORTANT: Save these credentials securely!');
        } else {
            console.error('❌ Failed to create admin:', data.message);
            if (data.errors) {
                console.error('Errors:', data.errors);
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createAdmin();
