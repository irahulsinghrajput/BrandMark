// MongoDB Script to Reset Admin Password
// Run this in MongoDB Atlas or MongoDB Compass

// First, let's check if admin exists:
db.admins.findOne({ email: "admin@brandmarksolutions.site" })

// If admin exists, delete it:
db.admins.deleteOne({ email: "admin@brandmarksolutions.site" })

// Confirm deletion:
print("Admin user deleted. Now register again using the register-admin.bat script or API call")
