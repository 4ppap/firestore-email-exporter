// Script to export email addresses from Firestore with Service Account

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Replace with your own service account credentials
const serviceAccount = require("./service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportUserEmailsWithServiceAccount() {
  try {
    console.log(
      "Starting export of user email addresses with Service Account..."
    );
    console.log("Authenticating with Service Account...");
    console.log(`Service Account: ${serviceAccount.client_email}`);
    console.log(`Project ID: ${serviceAccount.project_id}`);

    console.log("Accessing users collection...");
    const usersCollection = db.collection("users");

    console.log("Loading documents from Firestore...");
    const snapshot = await usersCollection.get();

    console.log(`${snapshot.size} users found in the database`);

    if (snapshot.empty) {
      console.log('No documents found in the "users" collection!');
      console.log("Possible causes:");
      console.log("   - Service Account has no permission");
      console.log("   - Collection name is incorrect");
      console.log("   - Project ID does not match");
      return;
    }

    const emailList = [];
    let totalUsersCount = 0;
    let noEmailCount = 0;
    let exportedCount = 0;

    snapshot.forEach((doc) => {
      const userData = doc.data();
      totalUsersCount++;

      console.log(`\nProcessing user ${doc.id}:`);
      console.log(`   Email: ${userData.email || "NOT AVAILABLE"}`);

      if (userData.email) {
        emailList.push({
          email: userData.email,
        });
        exportedCount++;
        console.log(`   Added: ${userData.email}`);
      } else {
        noEmailCount++;
        console.log(`   Skipped (no email): User ${doc.id}`);
      }
    });

    const jsonData = JSON.stringify(emailList, null, 2);
    const outputPath = path.join(__dirname, "users.json");

    fs.writeFileSync(outputPath, jsonData, "utf8");

    console.log("\nDetailed export statistics:");
    console.log(`   Total users: ${totalUsersCount}`);
    console.log(`   With valid email: ${exportedCount}`);
    console.log(`   Without email: ${noEmailCount}`);
    console.log(`\nExport successfully completed!`);
    console.log(`File saved: ${outputPath}`);
    console.log(`${emailList.length} email addresses exported`);

    if (emailList.length > 0) {
      console.log("\nPreview of first email addresses:");
      emailList.slice(0, 5).forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email}`);
      });

      if (emailList.length > 5) {
        console.log(`   ... and ${emailList.length - 5} more`);
      }
    } else {
      console.log("\nNo email addresses found to export!");
      console.log("Please check:");
      console.log("   - Service Account permissions");
      console.log("   - Firestore Security Rules");
      console.log("   - Collection name and data structure");
    }
  } catch (error) {
    console.error("Error during export:", error);

    if (error.code === "permission-denied") {
      console.log("\nPermission error!");
      console.log("The Service Account requires one of the following roles:");
      console.log("- Cloud Datastore User");
      console.log("- Cloud Datastore Viewer");
      console.log("- Firestore Service Agent");
      console.log("\nAdd the role in the Google Cloud Console:");
      console.log("IAM & Admin > IAM > Edit permissions");
    } else if (error.code === "not-found") {
      console.log("\nCollection not found!");
      console.log("Make sure that:");
      console.log('- The collection "users" exists');
      console.log("- The project ID is correct");
    } else {
      console.log("\nUnexpected error:");
      console.log("Error Code:", error.code);
      console.log("Error Message:", error.message);
    }

    process.exit(1);
  } finally {
    if (admin.apps.length > 0) {
      await admin.app().delete();
    }
  }
}

exportUserEmailsWithServiceAccount()
  .then(() => {
    console.log("\nScript successfully completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });
