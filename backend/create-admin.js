/**
 * Create New Admin User Script
 * 
 * This script allows you to create additional admin users.
 * Useful for adding team members or backup admin accounts.
 * 
 * Usage:
 *   node create-admin.js
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Admin Schema
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
});

const Admin = mongoose.model('Admin', adminSchema);

// Prompt function
function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Password input with masking
function questionSecret(query) {
    return new Promise((resolve) => {
        const stdin = process.stdin;
        const stdout = process.stdout;
        
        stdout.write(query);
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        
        let password = '';
        
        stdin.on('data', function onData(char) {
            char = char.toString('utf8');
            
            switch (char) {
                case '\n':
                case '\r':
                case '\u0004':
                    stdin.setRawMode(false);
                    stdin.pause();
                    stdin.removeListener('data', onData);
                    stdout.write('\n');
                    resolve(password);
                    break;
                case '\u0003':
                    process.exit();
                    break;
                case '\u007f':
                    password = password.slice(0, -1);
                    stdout.clearLine();
                    stdout.cursorTo(0);
                    stdout.write(query + '*'.repeat(password.length));
                    break;
                default:
                    password += char;
                    stdout.write('*');
                    break;
            }
        });
    });
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate password
function validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    
    return errors;
}

// Main function
async function createAdmin() {
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║       👥 BrandMark Create Admin User Tool       ║');
    console.log('╚══════════════════════════════════════════════════╝\n');
    
    try {
        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to database\n');
        
        // Get admin details
        const name = await question('📝 Enter admin full name: ');
        if (!name.trim()) {
            console.log('\n❌ Error: Name cannot be empty.\n');
            process.exit(1);
        }
        
        const email = await question('📧 Enter admin email address: ');
        if (!validateEmail(email.trim())) {
            console.log('\n❌ Error: Invalid email format.\n');
            process.exit(1);
        }
        
        // Check if email already exists
        const existingAdmin = await Admin.findOne({ email: email.trim() });
        if (existingAdmin) {
            console.log('\n❌ Error: Admin with this email already exists.');
            console.log('   Use reset-admin-password.js to change their password.\n');
            process.exit(1);
        }
        
        // Get password
        const password = await questionSecret('🔐 Enter password: ');
        
        // Validate password
        const validationErrors = validatePassword(password);
        if (validationErrors.length > 0) {
            console.log('\n❌ Password does not meet security requirements:');
            validationErrors.forEach(error => console.log('   • ' + error));
            console.log('\n💡 Tip: Use a mix of uppercase, lowercase, numbers, and symbols.\n');
            process.exit(1);
        }
        
        const confirmPassword = await questionSecret('🔐 Confirm password: ');
        
        if (password !== confirmPassword) {
            console.log('\n❌ Error: Passwords do not match.\n');
            process.exit(1);
        }
        
        // Create admin
        console.log('\n🔄 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log('💾 Creating admin user...');
        const newAdmin = new Admin({
            email: email.trim(),
            password: hashedPassword,
            name: name.trim()
        });
        
        await newAdmin.save();
        
        console.log('\n╔══════════════════════════════════════════════════╗');
        console.log('║         ✅ ADMIN USER CREATED SUCCESSFULLY!      ║');
        console.log('╚══════════════════════════════════════════════════╝\n');
        console.log('📝 Name:  ' + name.trim());
        console.log('📧 Email: ' + email.trim());
        console.log('🔒 Password: (securely hashed and saved)\n');
        console.log('🌐 Login at: https://brandmarksolutions.site/admin-dashboard.html\n');
        console.log('💡 Important:');
        console.log('   • Share credentials securely with the new admin');
        console.log('   • Recommend changing password after first login');
        console.log('   • Store credentials in a password manager\n');
        
    } catch (error) {
        console.log('\n❌ Error occurred:');
        console.log('   ' + error.message + '\n');
        
        if (error.code === 11000) {
            console.log('💡 This email is already registered as an admin.\n');
        }
    } finally {
        rl.close();
        await mongoose.connection.close();
        process.exit(0);
    }
}

// Run the script
createAdmin().catch(error => {
    console.error('\n❌ Fatal error:', error);
    rl.close();
    process.exit(1);
});
