# Firestore Email Exporter & Bulk Email Sender

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/python-%3E%3D3.7-blue)](https://www.python.org/)

A powerful tool to **export email addresses from Google Firestore** and **send bulk emails** to your users. Perfect for newsletter campaigns, user notifications, and email marketing automation.

**Created by [nickoderso](https://github.com/nickoderso)**

## Features

- **Export emails from Firestore** using Google Cloud Service Account
- **Bulk email sending** with SMTP support
- **Duplicate detection** - prevents sending multiple emails to the same address
- **Progress tracking** with detailed statistics
- **Error handling** with comprehensive logging
- **Rate limiting** to avoid SMTP throttling
- **HTML email templates** support
- **Clean, professional output** without unnecessary clutter

## Table of Contents

- [Use Cases](#use-cases)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup Google Cloud Service Account](#setup-google-cloud-service-account)
- [Configuration](#configuration)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)
- [Contributing](#contributing)
- [License](#license)

## Use Cases

This tool is perfect for:

- **Newsletter campaigns** - Export subscriber emails from Firestore and send newsletters
- **Product updates** - Notify users about new features or updates
- **Marketing automation** - Send targeted email campaigns to your user base
- **User onboarding** - Send welcome emails to new users
- **Announcements** - Broadcast important messages to all users
- **Event notifications** - Invite users to events or webinars

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **Python** (v3.7 or higher)
- **Google Cloud Project** with Firestore enabled
- **SMTP Server** credentials (Gmail, SendGrid, Mailgun, etc.)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nickoderso/firestore-email-exporter.git
cd firestore-email-exporter
```

### 2. Install Node.js Dependencies

```bash
cd Firestore_Mails_Auslesen
npm install
```

### 3. Install Python Dependencies

```bash
# No additional dependencies required for basic usage
# If you need additional features, install them as needed
```

## Setup Google Cloud Service Account

To export emails from Firestore, you need to create a Service Account in Google Cloud Console.

### Step 1: Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **IAM & Admin** > **Service Accounts**
4. Click **Create Service Account**
5. Enter a name (e.g., "firestore-email-exporter")
6. Click **Create and Continue**

### Step 2: Grant Required Permissions

Assign one of the following roles to your Service Account:

- **Cloud Datastore User** (Recommended)
- **Cloud Datastore Viewer** (Read-only access)
- **Firestore Service Agent** (Full access)

Click **Continue** > **Done**

### Step 3: Create and Download the Key

1. Find your newly created Service Account in the list
2. Click on the **three dots** (⋮) menu > **Manage Keys**
3. Click **Add Key** > **Create New Key**
4. Select **JSON** format
5. Click **Create**
6. Save the downloaded JSON file as `service-account-key.json`

### Step 4: Place the Key File

Move the `service-account-key.json` file to the `Firestore_Mails_Auslesen` directory:

```bash
mv ~/Downloads/service-account-key.json ./Firestore_Mails_Auslesen/
```

**Important:** Never commit this file to version control!

### Step 5: Enable Firestore API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Library**
3. Search for "Firestore"
4. Click on **Cloud Firestore API**
5. Click **Enable**

## Configuration

### Configure Firestore Export

The export scripts (`export-users-emails.js` and `export-with-service-account.js`) are pre-configured to:

- Export all users from the `users` collection
- Extract email addresses
- Save results to `users.json`

**To customize the collection name or fields:**

Edit the JavaScript file and modify:

```javascript
const usersCollection = db.collection("users"); // Change "users" to your collection name
```

### Configure Email Sender

Edit `main.py` and update the SMTP configuration:

```python
# SMTP Configuration
SMTP_SERVER = "smtp.gmail.com"  # Your SMTP server
SMTP_PORT = 465                  # Usually 465 for SSL or 587 for TLS
SMTP_USER = "your-email@gmail.com"
SMTP_PASSWORD = "your-app-password"  # Use App Password
```

**For Gmail:**

1. Enable 2-Factor Authentication
2. Generate an [App Password](https://support.google.com/accounts/answer/185833)
3. Use the App Password instead of your regular password

### Customize Email Template

Edit `template.html` to design your email:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Email Campaign</title>
  </head>
  <body>
    <h1>Hello!</h1>
    <p>Your custom message here...</p>
  </body>
</html>
```

### Update Email Subject and Sender

In `main.py`, modify:

```python
msg["From"] = "Your Name <your-email@example.com>"
msg["Subject"] = "Your Email Subject Here"
```

## Usage

### Step 1: Export Emails from Firestore

Run one of the export scripts:

```bash
cd Firestore_Mails_Auslesen
node export-users-emails.js
```

Or alternatively:

```bash
node export-with-service-account.js
```

**Output:** This will create a `users.json` file containing all exported email addresses.

Example output:

```
Starting export of user email addresses with Service Account...
Authenticating with Service Account...
Service Account: your-service-account@project-id.iam.gserviceaccount.com
Project ID: your-project-id
Accessing users collection...
Loading documents from Firestore...
150 users found in the database

Processing user abc123:
   Email: user@example.com
   Added: user@example.com

...

Detailed export statistics:
   Total users: 150
   With valid email: 145
   Without email: 5

Export successfully completed!
File saved: /path/to/users.json
145 email addresses exported

Preview of first email addresses:
   1. user1@example.com
   2. user2@example.com
   3. user3@example.com
   ... and 142 more

Script successfully completed
```

### Step 2: Send Bulk Emails

After exporting emails, send your campaign:

```bash
python main.py
```

**Output:** The script will display real-time progress:

```
E-Mail Versand gestartet...
Insgesamt 145 Benutzer in der Liste
Beginne mit dem Versand...

Erfolgreich beim SMTP Server angemeldet

✅ [1/145] Erfolgreich gesendet an: user1@example.com
Pause von 5 Sekunden...
✅ [2/145] Erfolgreich gesendet an: user2@example.com
Pause von 5 Sekunden...
...

============================================================
VERSAND ABGESCHLOSSEN
============================================================
Insgesamt verarbeitet: 145
Erfolgreich versendet: 143
Fehlgeschlagen: 2
Übersprungen: 0
Erfolgsrate: 98.6%
============================================================
Alle E-Mails wurden verarbeitet!
```

## File Structure

```
firestore-email-exporter/
├── Firestore_Mails_Auslesen/
│   ├── export-users-emails.js          # Main export script
│   ├── export-with-service-account.js  # Alternative export script
│   ├── package.json                     # Node.js dependencies
│   ├── package-email-export.json        # Alternative package config
│   └── service-account-key.json         # ⚠️ Your credentials (gitignored)
├── main.py                              # Email sender script
├── template.html                        # Email template
├── users.json                           # Exported emails (gitignored)
├── .gitignore                           # Git ignore rules
└── README.md                            # This file
```

## Troubleshooting

### Common Issues

#### "Permission denied" Error

**Problem:** Service Account doesn't have Firestore access

**Solution:**

1. Go to Google Cloud Console > IAM & Admin
2. Find your Service Account
3. Add role: **Cloud Datastore User**

#### "Collection not found" Error

**Problem:** Collection name doesn't match

**Solution:**

- Verify your collection name in Firestore Console
- Update the collection name in the export script

#### SMTP Authentication Failed

**Problem:** Invalid SMTP credentials

**Solution:**

- For Gmail: Use an [App Password](https://support.google.com/accounts/answer/185833)
- For other providers: Check SMTP server and port settings
- Verify username and password

#### "Module not found" Error

**Problem:** Missing dependencies

**Solution:**

```bash
cd Firestore_Mails_Auslesen
npm install
```

#### Rate Limiting / Throttling

**Problem:** Too many emails sent too quickly

**Solution:**

- Increase the delay in `main.py` (default is 5 seconds)
- Use a dedicated email service (SendGrid, Mailgun, AWS SES)

```python
time.sleep(10)  # Increase from 5 to 10 seconds
```

## Security Best Practices

### Protect Your Credentials

1. **Never commit sensitive files:**

   - `service-account-key.json`
   - `users.json` (contains user emails)
   - `.env` files with passwords

2. **Use environment variables:**

   ```python
   import os
   SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
   ```

3. **Restrict Service Account permissions:**

   - Use **Cloud Datastore Viewer** for read-only access
   - Create separate Service Accounts for different environments

4. **Enable IP restrictions** in Google Cloud Console

5. **Rotate credentials regularly**

### GDPR Compliance

If you're sending emails to EU citizens:

- Obtain explicit consent before sending emails
- Include an unsubscribe link in every email
- Store consent records
- Honor unsubscribe requests within 48 hours
- Provide a privacy policy link

## Performance Tips

### For Large Datasets (10,000+ users)

1. **Use pagination:**

   ```javascript
   const pageSize = 1000;
   let lastDoc = null;

   while (true) {
     let query = db.collection("users").limit(pageSize);
     if (lastDoc) query = query.startAfter(lastDoc);

     const snapshot = await query.get();
     if (snapshot.empty) break;

     lastDoc = snapshot.docs[snapshot.docs.length - 1];
   }
   ```

2. **Use batch processing for emails:**

   - Send in batches of 100-500 emails
   - Add longer delays between batches
   - Consider using dedicated email services

3. **Optimize Firestore queries:**
   - Only select required fields
   - Use indexes for filtered queries

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**nickoderso**

- GitHub: [@nickoderso](https://github.com/nickoderso)

## Acknowledgments

- Google Cloud Firestore for database services
- Firebase Admin SDK for Node.js
- Python SMTP library for email sending

## Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/nickoderso/firestore-email-exporter/issues)
3. Create a new issue with:
   - Error messages
   - Steps to reproduce
   - Your environment (Node.js version, Python version, OS)

## Star This Repository

If you find this project helpful, please give it a star! It helps others discover this tool.

## Related Projects

- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [SendGrid Email API](https://sendgrid.com/)
- [Mailgun API](https://www.mailgun.com/)

---

**Made by nickoderso for the developer community**

**Keywords:** firestore export, bulk email sender, firebase email export, google cloud firestore, email automation, newsletter tool, python bulk email, node.js firestore, email marketing, service account authentication, smtp bulk sender
