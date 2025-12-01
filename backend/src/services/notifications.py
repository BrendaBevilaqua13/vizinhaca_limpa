
import smtplib
from email.mime.text import MIMEText

def send_email(to_email: str, subject: str, body: str, smtp_user: str, smtp_pass: str):
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = smtp_user
    msg["To"] = to_email

    s = smtplib.SMTP("smtp.gmail.com", 587)
    s.starttls()
    s.login(smtp_user, smtp_pass)
    s.sendmail(smtp_user, [to_email], msg.as_string())
    s.quit()
