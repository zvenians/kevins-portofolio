const admin = require("firebase-admin");

// Initialize with Application Default Credentials or GOOGLE_APPLICATION_CREDENTIALS
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

async function setAdminClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`Successfully granted admin privileges to ${email}`);
  } catch (error) {
    console.error("Error setting admin claim:", error);
  }
}

const email = process.argv[2];
if (!email) {
  console.log("Usage: node scripts/bootstrap-admin.js <user-email>");
  process.exit(1);
}

setAdminClaim(email);
