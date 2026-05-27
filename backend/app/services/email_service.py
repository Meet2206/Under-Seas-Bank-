"""
Email Service — sends emails via SMTP in a background thread.
Gracefully handles missing/invalid SMTP config (logs warning, never crashes).
"""

import smtplib
import threading
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def email_is_configured() -> bool:
    """Return whether SMTP credentials are present."""
    return bool(settings.SMTP_USER and settings.SMTP_PASSWORD)


def _send_email(to_email: str, subject: str, html_body: str):
    """Internal: send email via SMTP. Runs in background thread."""

    if not email_is_configured():
        logger.warning(
            f"SMTP not configured — skipping email to {to_email}. "
            "Set SMTP_USER and SMTP_PASSWORD in .env"
        )
        print(f"📧 [EMAIL SKIPPED] To: {to_email} | Subject: {subject}")
        print(f"   (Configure SMTP_USER & SMTP_PASSWORD in .env to send real emails)")
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = settings.EMAIL_FROM or settings.SMTP_USER
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)

        print(f"✅ [EMAIL SENT] To: {to_email} | Subject: {subject}")

    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        print(f"❌ [EMAIL FAILED] To: {to_email} | Error: {e}")


def send_email_async(to_email: str, subject: str, html_body: str):
    """Send email in a background thread (non-blocking)."""
    thread = threading.Thread(
        target=_send_email,
        args=(to_email, subject, html_body),
        daemon=True,
    )
    thread.start()


def get_email_status() -> dict:
    """Expose safe SMTP status for setup verification."""
    return {
        "configured": email_is_configured(),
        "smtp_host": settings.SMTP_HOST,
        "smtp_port": settings.SMTP_PORT,
        "sender": settings.EMAIL_FROM or settings.SMTP_USER or None,
    }


def send_welcome_email(to_email: str, user_name: str):
    """Send a beautiful HTML welcome email to a newly registered user."""

    subject = "🏦 Welcome to Underseas Bank!"

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f0f1a;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f1a; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">

                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 30px; text-align: center;">
                                <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 16px; margin: 0 auto 16px; line-height: 60px; font-size: 28px;">
                                    🏦
                                </div>
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                    Welcome to Underseas Bank
                                </h1>
                                <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">
                                    Digital Banking · Secure · Intelligent
                                </p>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="color: #e0e0ff; margin: 0 0 16px; font-size: 22px;">
                                    Hello, {user_name}! 👋
                                </h2>
                                <p style="color: #a0a0c0; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
                                    Your account has been created successfully. Welcome to the future of digital banking — where security meets simplicity.
                                </p>

                                <!-- Feature Cards -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                    <tr>
                                        <td style="padding: 16px; background: rgba(102, 126, 234, 0.1); border-radius: 12px; border-left: 3px solid #667eea; margin-bottom: 12px;">
                                            <strong style="color: #667eea; font-size: 14px;">🔐 Bank-Grade Security</strong>
                                            <p style="color: #8888aa; font-size: 13px; margin: 6px 0 0;">
                                                256-bit AES encryption protects every transaction.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr><td style="height: 12px;"></td></tr>
                                    <tr>
                                        <td style="padding: 16px; background: rgba(118, 75, 162, 0.1); border-radius: 12px; border-left: 3px solid #764ba2;">
                                            <strong style="color: #764ba2; font-size: 14px;">⚡ Instant Transfers</strong>
                                            <p style="color: #8888aa; font-size: 13px; margin: 6px 0 0;">
                                                Send money 24/7 with zero delays.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr><td style="height: 12px;"></td></tr>
                                    <tr>
                                        <td style="padding: 16px; background: rgba(72, 187, 120, 0.1); border-radius: 12px; border-left: 3px solid #48bb78;">
                                            <strong style="color: #48bb78; font-size: 14px;">📊 Smart Analytics</strong>
                                            <p style="color: #8888aa; font-size: 13px; margin: 6px 0 0;">
                                                AI-powered insights to grow your wealth.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- CTA -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" style="padding: 8px 0;">
                                            <a href="http://localhost:5173/dashboard"
                                               style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; letter-spacing: 0.5px;">
                                                Open Dashboard →
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 24px 40px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
                                <p style="color: #555577; font-size: 12px; margin: 0;">
                                    © 2026 Underseas Bank · Digital Banking Platform
                                </p>
                                <p style="color: #444466; font-size: 11px; margin: 8px 0 0;">
                                    This is an automated message. Please do not reply.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    send_email_async(to_email, subject, html)


def send_otp_email(to_email: str, otp_code: str):
    """Send OTP code via email for verification."""

    subject = "🔑 Your Underseas Bank Verification Code"

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f0f1a;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f1a; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="500" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">

                        <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                                <h1 style="color: #fff; margin: 0; font-size: 22px;">🔑 Verification Code</h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 40px; text-align: center;">
                                <p style="color: #a0a0c0; font-size: 15px; margin: 0 0 24px;">
                                    Use the code below to verify your identity:
                                </p>
                                <div style="background: rgba(102, 126, 234, 0.15); border: 2px dashed #667eea; border-radius: 12px; padding: 20px; display: inline-block;">
                                    <span style="font-size: 36px; font-weight: 700; color: #667eea; letter-spacing: 8px; font-family: monospace;">
                                        {otp_code}
                                    </span>
                                </div>
                                <p style="color: #666688; font-size: 13px; margin: 20px 0 0;">
                                    This code expires in <strong style="color: #e0e0ff;">5 minutes</strong>.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 20px 40px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
                                <p style="color: #444466; font-size: 11px; margin: 0;">
                                    If you didn't request this, please ignore this email.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    send_email_async(to_email, subject, html)
