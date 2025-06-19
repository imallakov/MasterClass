import os
import random
from datetime import datetime, timezone

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from email.message import EmailMessage
from email.mime.image import MIMEImage

# import logging
# import traceback

from .models import OTP

# utils.py (add to existing)
from rest_framework.response import Response
from rest_framework import status as http_status


class StandardResponse:
    @staticmethod
    def success(message, data=None, status_code=http_status.HTTP_200_OK):
        """Standard success response format"""
        response_data = {
            "status": "success",
            "message": message,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        if data:
            response_data["data"] = data

        return Response(response_data, status=status_code)

    @staticmethod
    def error(message, errors=None, status_code=http_status.HTTP_400_BAD_REQUEST):
        """Standard error response format"""
        response_data = {
            "status": "error",
            "message": message,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        if errors:
            response_data["errors"] = errors

        return Response(response_data, status=status_code)

    @staticmethod
    def rate_limit_error(retry_after):
        """Standard rate limit error response"""
        return StandardResponse.error(
            message="Too many requests. Please try again later.",
            errors={"rate_limit": [f"Please wait {retry_after} seconds before trying again."]},
            status_code=http_status.HTTP_429_TOO_MANY_REQUESTS
        )


def generate_otp(user, purpose):
    otp_code = str(random.randint(100000, 999999))
    otp = OTP.objects.create(user=user, otp=otp_code, purpose=purpose)

    # Send email
    # subject = "Your One-Time Password"
    message = ''
    if purpose == 'password_reset':
        message = (
            f"Ваш одно разовый пароль для сброса пароля на сайте дворецмастеров.рф : <b>{otp_code}</b><br>"
            "Он будет действовать 15 минут."
        )
    elif purpose == 'email_verification':
        message = (
            f"Ваш одноразовый пароль для подтверждения почты на сайте дворецмастеров.рф: <b>{otp_code}</b><br>"
            "Он будет действовать 15 минут."
        )
    send_custom_email(user.first_name, user.last_name, user.gender, user.email, purpose, message)

    return otp


# email_logger = logging.getLogger(__name__)


def send_custom_email(user_firstname, user_lastname, user_gender, to_email: str, theme, message):
    """
    Sends an email with a specified theme and message, attaching the logo as an inline image.
    :param user_firstname: Recipient's first name.
    :param user_lastname: Recipient's last name.
    :param user_gender: Recipient's gender.
    :param to_email: Recipient email address
    :param theme: Theme of the email
    :param message: Message content
    """
    subjects = {
        "email_verification": "Дворец Мастеров - Подтвердите вашу почту ",
        "password_reset": "Дворец Мастеров - Сброс пароля",
        "enrollment_notification": "Дворец Мастеров - Запись к мастерклассу",
        "support_message": "запрос пользователя к поддержке",
    }
    subject = subjects.get(theme, "Уведомление с сайта Дворец Мастеров")

    # Path to the logo
    logo_path = os.path.join(settings.BASE_DIR, "static", "logo.png")

    try:
        # Log the start of the process
        # email_logger.info(f"Starting to send email to {to_email} with subject: {subject}")

        username = 'Уважаемый ' if user_gender == 'male' else 'Уважаемая '
        if user_firstname and user_lastname:
            username += f'{user_firstname} {user_lastname}!<br>'
        else:
            username += 'пользователь!<br>'

        # Render the HTML template
        html_content = render_to_string("email_template.html", {
            "theme": subject,
            "message": username + message,  # Replace newlines with <br>
            "logo_url": "cid:logo_image"  # Reference the logo by its Content-ID
        })
        text_content = strip_tags(html_content)  # Plain text fallback

        # Create email
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[to_email]
        )
        email.attach_alternative(html_content, "text/html")

        # Attach logo as a related file
        try:
            with open(logo_path, 'rb') as img_file:
                image_data = img_file.read()
            # email_logger.info("Logo file read successfully.")
        except Exception as e:
            # email_logger.error(f"Error reading logo file: {str(e)}")
            raise

        # Create a MIMEImage object for the PNG logo
        logo_image = MIMEImage(image_data, _subtype='png')
        logo_image.add_header('Content-ID', '<logo_image>')
        logo_image.add_header('Content-Disposition', 'inline', filename='logo.png')

        # Attach the logo image to the email
        email.attach(logo_image)
        # email_logger.info("Logo image attached to email.")

        # Send the email
        sent_count = email.send()

        # Log the result
        if sent_count:
            print(f"Email successfully sent to {to_email} with subject: {subject}")
            # email_logger.info(f"Email successfully sent to {to_email} with subject: {subject}")
        else:
            print(f"Email failed to send to {to_email} with subject: {subject}")
            # email_logger.warning(f"Failed to send email to {to_email} with subject: {subject}")
    except FileNotFoundError:
        print(f"Logo file not found: {logo_path}")
        # email_logger.error(f"Logo file not found at path: {logo_path}")
    except Exception as e:
        print(f"Error sending email to {to_email}: {str(e)}")
        # email_logger.error(f"Error sending email to {to_email}: {str(e)}")
