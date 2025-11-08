// EmailJS Configuration
// =====================
// To set up email functionality:
// 
// 1. Sign up for a free account at https://www.emailjs.com
// 2. Create an Email Service:
//    - Go to Email Services in your dashboard
//    - Add a new service (Gmail, Outlook, etc.)
//    - Connect your email account (rknotaries@gmail.com)
//    - Copy your Service ID
//
// 3. Create an Email Template:
//    - Go to Email Templates in your dashboard
//    - Create a new template
//    - Use these variables in your template:
//      - {{from_name}} - Client's name
//      - {{from_email}} - Client's email
//      - {{service}} - Service requested
//      - {{message}} - Client's message
//      - {{reply_to}} - Reply-to email
//    - Set "To Email" to: rknotaries@gmail.com
//    - Set "Subject" to: New Appointment Request - {{service}}
//    - Copy your Template ID
//
// 4. Get your Public Key:
//    - Go to Account > API Keys
//    - Copy your Public Key
//
// 5. Update the values below:

const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS Public Key
  SERVICE_ID: 'YOUR_SERVICE_ID',  // Replace with your EmailJS Service ID
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS Template ID
  TO_EMAIL: 'rknotaries@gmail.com' // Recipient email (already configured)
};

// Example Email Template Content:
// ===============================
// Subject: New Appointment Request - {{service}}
//
// You have received a new appointment request:
//
// Name: {{from_name}}
// Email: {{from_email}}
// Service: {{service}}
//
// Message:
// {{message}}
//
// ---
// Reply to this email to respond directly to {{from_name}} at {{reply_to}}

