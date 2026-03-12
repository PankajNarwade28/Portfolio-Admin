const bcrypt = require("bcryptjs");

// Script to generate password hash for admin password
const generatePasswordHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log("\n=== Password Hash Generated ===");
  console.log("Add this to your .env file:");
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log("================================\n");
};

// Usage: node config/generateHash.js your_password_here
const password = process.argv[2] || "admin123"; // Default password if none provided
generatePasswordHash("PankajD2003N");
