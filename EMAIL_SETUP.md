# Email Setup Guide for Appointment Booking

The appointment booking form is configured to send emails to **rknotaries@gmail.com**. 

## Current Status

The form currently uses a **mailto fallback** that opens the user's email client. To enable direct email sending without opening the email client, follow the EmailJS setup below.

## EmailJS Setup (Recommended)

EmailJS is a free service (200 emails/month) that allows sending emails directly from your website without a backend server.

### Step 1: Sign Up for EmailJS

1. Go to https://www.emailjs.com
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Create an Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended)
4. Connect your Gmail account (rknotaries@gmail.com)
5. Copy the **Service ID** (you'll need this later)

### Step 3: Create an Email Template

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Configure the template:

   **Template Name:** Appointment Request
   
   **To Email:** rknotaries@gmail.com
   
   **Subject:** New Appointment Request - {{service}}
   
   **Content:**
   ```
   You have received a new appointment request from your website:
   
   Name: {{from_name}}
   Email: {{from_email}}
   Service Requested: {{service}}
   
   Message:
   {{message}}
   
   ---
   Reply to: {{reply_to}}
   ```
   
4. Click **Save**
5. Copy the **Template ID** (you'll need this later)

### Step 4: Get Your Public Key

1. Go to **Account** > **General**
2. Find your **Public Key** in the API Keys section
3. Copy the Public Key

### Step 5: Update the Configuration

1. Open `script.js` in your code editor
2. Find the `EMAILJS_CONFIG` section (around line 44)
3. Replace the placeholder values:

```javascript
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'your-actual-public-key-here',
  SERVICE_ID: 'your-actual-service-id-here',
  TEMPLATE_ID: 'your-actual-template-id-here',
  TO_EMAIL: 'rknotaries@gmail.com',
  ENABLED: true  // Change this to true!
};
```

4. Save the file

### Step 6: Test

1. Open your website
2. Fill out the appointment form
3. Submit the form
4. Check rknotaries@gmail.com for the email

## Fallback Method (Current)

If EmailJS is not configured, the form will use a **mailto link** that:
- Opens the user's default email client
- Pre-fills the email with:
  - To: rknotaries@gmail.com
  - Subject: Appointment Request - [Service]
  - Body: Form details

This works immediately without any setup, but requires the user to have an email client configured.

## Troubleshooting

- **Emails not sending?** Check the browser console for errors
- **EmailJS not working?** Make sure `ENABLED: true` in the config
- **Still using mailto?** Verify your Service ID, Template ID, and Public Key are correct
- **Need help?** Visit https://www.emailjs.com/docs/

## Support

For EmailJS support: https://www.emailjs.com/support/
For website issues: Contact your developer

