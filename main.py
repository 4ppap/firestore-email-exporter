import smtplib
import ssl
import json
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# SMTP Postfach Variablen
SMTP_SERVER = "your_smtp_server_here"
SMTP_PORT = 465
SMTP_USER = "your_mail_address_here"
SMTP_PASSWORD = "your_smtp_password_here"

# Import HTML Mail Template
with open("template.html", "r", encoding="utf-8") as f:
    html_content = f.read()

with open("users.json", "r", encoding="utf-8") as f:
    users = json.load(f)

total_users = len(users)
processed_users = 0
successful_sends = 0
failed_sends = 0
skipped_users = 0

print(f"E-Mail Versand gestartet...")
print(f"Insgesamt {total_users} Benutzer in der Liste")
print(f"Beginne mit dem Versand...\n")

processed_emails = set()

context = ssl.create_default_context()
with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
    server.login(SMTP_USER, SMTP_PASSWORD)
    print("Erfolgreich beim SMTP Server angemeldet\n")

    for index, user in enumerate(users, 1):
        processed_users += 1
        
        if "email" not in user or not user["email"]:
            print(f"⚠️  [{index}/{total_users}] Übersprungen: Keine gültige E-Mail-Adresse")
            skipped_users += 1
            continue
        
        user_email = user["email"].strip().lower()
        
        if user_email in processed_emails:
            print(f"⚠️  [{index}/{total_users}] Übersprungen: {user['email']} (bereits versendet)")
            skipped_users += 1
            continue
        
        processed_emails.add(user_email)

        msg = MIMEMultipart("alternative")
        msg["From"] = "test <test@example.com>"
        msg["To"] = user["email"]
        msg["Subject"] = "Email Betreff hier"

        msg.attach(MIMEText(html_content, "html"))

        try:
            server.sendmail(SMTP_USER, user["email"], msg.as_string())
            print(f"✅ [{index}/{total_users}] Erfolgreich gesendet an: {user['email']}")
            successful_sends += 1
            
            if index < total_users:
                print(f"Pause von 5 Sekunden...")
                time.sleep(5)
                
        except Exception as e:
            print(f"❌ [{index}/{total_users}] Fehler bei {user['email']}: {e}")
            failed_sends += 1

# Stats Printout
print(f"\n{'='*60}")
print(f"VERSAND ABGESCHLOSSEN")
print(f"{'='*60}")
print(f"Insgesamt verarbeitet: {processed_users}")
print(f"Erfolgreich versendet: {successful_sends}")
print(f"Fehlgeschlagen: {failed_sends}")
print(f"Übersprungen: {skipped_users}")
print(f"Erfolgsrate: {(successful_sends/max(1, processed_users-skipped_users)*100):.1f}%")
print(f"{'='*60}")
print(f"Alle E-Mails wurden verarbeitet!")
