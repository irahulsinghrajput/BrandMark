/**
 * Admin Password Reset Script
 * 
 * This script allows you to securely change your admin password.
 * It connects to your MongoDB database and updates the password with a bcrypt hash.
 * 
 * Usage:
 *   node reset-admin-password.js
 * 
 * You will be prompted to enter:
 *   1. Admin email address
 *   2. New password
 *   3. Confirm new password
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Admin Schema (matching your model)
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
});

const Admin = mongoose.model('Admin', adminSchema);

// Prompt user for input
function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Hide password input (shows asterisks)
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
                case '\u007f': // Backspace
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

// Validate password strength
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

// Main reset function
async function resetPassword() {
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║     🔒 BrandMark Admin Password Reset Tool      ║');
    console.log('╚══════════════════════════════════════════════════╝\n');
    
    try {
        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to database\n');
        
        // Get admin email
        const email = await question('👤 Enter admin email address: ');
        
        // Check if admin exists
        const admin = await Admin.findOne({ email: email.trim() });
        if (!admin) {
            console.log('\n❌ Error: Admin with email "' + email + '" not found.');
            console.log('   Available options:');
            console.log('   1. Check spelling and try again');
            console.log('   2. Create new admin using register-admin script\n');
            process.exit(1);
        }
        
        console.log('✅ Admin found: ' + admin.name + '\n');
        
        // Get new password
        const newPassword = await questionSecret('🔐 Enter new password: ');
        
        // Validate password strength
        const validationErrors = validatePassword(newPassword);
        if (validationErrors.length > 0) {
            console.log('\n❌ Password does not meet security requirements:');
            validationErrors.forEach(error => console.log('   • ' + error));
            console.log('\n💡 Tip: Use a mix of uppercase, lowercase, numbers, and symbols.\n');
            process.exit(1);
        }
        
        // Confirm password
        const confirmPassword = await questionSecret('🔐 Confirm new password: ');
        
        if (newPassword !== confirmPassword) {
            console.log('\n❌ Error: Passwords do not match. Please try again.\n');
            process.exit(1);
        }
        
        // Hash the new password
        console.log('\n🔄 Hashing password with bcrypt...');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update admin password in database
        console.log('💾 Updating password in database...');
        await Admin.updateOne(
            { email: email.trim() },
            { password: hashedPassword }
        );
        
        console.log('\n╔══════════════════════════════════════════════════╗');
        console.log('║           ✅ PASSWORD RESET SUCCESSFUL!          ║');
        console.log('╚══════════════════════════════════════════════════╝\n');
        console.log('📧 Email: ' + email);
        console.log('🔒 New password has been securely hashed and saved.\n');
        console.log('💡 Important reminders:');
        console.log('   • Store this password in a secure password manager');
        console.log('   • Do NOT share your password with anyone');
        console.log('   • Do NOT commit passwords to Git');
        console.log('   • Log out from all devices and log back in\n');
        console.log('🌐 Login at: https://brandmarksolutions.site/admin-dashboard.html\n');
        
    } catch (error) {
        console.log('\n❌ Error occurred:');
        console.log('   ' + error.message + '\n');
        
        if (error.message.includes('MONGODB_URI')) {
            console.log('💡 Make sure your .env file exists in the backend folder with:');
            console.log('   MONGODB_URI=mongodb+srv://your-connection-string\n');
        }
    } finally {
        rl.close();
        await mongoose.connection.close();
        process.exit(0);
    }
}

// Run the script
resetPassword().catch(error => {
    console.error('\n❌ Fatal error:', error);
    rl.close();
    process.exit(1);
});
