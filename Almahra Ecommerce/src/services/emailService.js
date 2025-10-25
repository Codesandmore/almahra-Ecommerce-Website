// Email service for sending transactional emails
// In production, integrate with services like SendGrid, Mailgun, AWS SES, etc.

class EmailService {
  constructor() {
    this.emailQueue = [];
    this.sentEmails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
  }

  // Save sent email to localStorage (for demo purposes)
  saveSentEmail(emailData) {
    this.sentEmails.push({
      ...emailData,
      sentAt: new Date().toISOString()
    });
    localStorage.setItem('sentEmails', JSON.stringify(this.sentEmails));
  }

  // Get all sent emails
  getSentEmails() {
    return this.sentEmails;
  }

  // Order confirmation email
  async sendOrderConfirmation(order, userEmail) {
    const emailData = {
      to: userEmail,
      subject: `Order Confirmation - #${order.id}`,
      type: 'order_confirmation',
      data: order,
      html: this.generateOrderConfirmationHTML(order)
    };

    // In production, call actual email API here
    console.log('📧 Sending Order Confirmation Email:', emailData);
    this.saveSentEmail(emailData);
    
    return { success: true, message: 'Order confirmation email sent' };
  }

  // Order shipped email
  async sendOrderShipped(order, userEmail) {
    const emailData = {
      to: userEmail,
      subject: `Your Order Has Shipped - #${order.id}`,
      type: 'order_shipped',
      data: order,
      html: this.generateOrderShippedHTML(order)
    };

    console.log('📧 Sending Order Shipped Email:', emailData);
    this.saveSentEmail(emailData);
    
    return { success: true, message: 'Order shipped email sent' };
  }

  // Order delivered email
  async sendOrderDelivered(order, userEmail) {
    const emailData = {
      to: userEmail,
      subject: `Your Order Has Been Delivered - #${order.id}`,
      type: 'order_delivered',
      data: order,
      html: this.generateOrderDeliveredHTML(order)
    };

    console.log('📧 Sending Order Delivered Email:', emailData);
    this.saveSentEmail(emailData);
    
    return { success: true, message: 'Order delivered email sent' };
  }

  // Appointment confirmation email
  async sendAppointmentConfirmation(appointment, userEmail) {
    const emailData = {
      to: userEmail,
      subject: `Appointment Confirmed - ${appointment.type}`,
      type: 'appointment_confirmation',
      data: appointment,
      html: this.generateAppointmentConfirmationHTML(appointment)
    };

    console.log('📧 Sending Appointment Confirmation Email:', emailData);
    this.saveSentEmail(emailData);
    
    return { success: true, message: 'Appointment confirmation email sent' };
  }

  // Appointment reminder email (24 hours before)
  async sendAppointmentReminder(appointment, userEmail) {
    const emailData = {
      to: userEmail,
      subject: `Reminder: Appointment Tomorrow - ${appointment.type}`,
      type: 'appointment_reminder',
      data: appointment,
      html: this.generateAppointmentReminderHTML(appointment)
    };

    console.log('📧 Sending Appointment Reminder Email:', emailData);
    this.saveSentEmail(emailData);
    
    return { success: true, message: 'Appointment reminder email sent' };
  }

  // Appointment cancellation email
  async sendAppointmentCancellation(appointment, userEmail) {
    const emailData = {
      to: userEmail,
      subject: `Appointment Cancelled - ${appointment.type}`,
      type: 'appointment_cancellation',
      data: appointment,
      html: this.generateAppointmentCancellationHTML(appointment)
    };

    console.log('📧 Sending Appointment Cancellation Email:', emailData);
    this.saveSentEmail(emailData);
    
    return { success: true, message: 'Appointment cancellation email sent' };
  }

  // Welcome email for new users
  async sendWelcomeEmail(user) {
    const emailData = {
      to: user.email,
      subject: 'Welcome to Almahra Opticals!',
      type: 'welcome',
      data: user,
      html: this.generateWelcomeHTML(user)
    };

    console.log('📧 Sending Welcome Email:', emailData);
    this.saveSentEmail(emailData);
    
    return { success: true, message: 'Welcome email sent' };
  }

  // Password reset email
  async sendPasswordReset(email, resetToken) {
    const emailData = {
      to: email,
      subject: 'Reset Your Password - Almahra Opticals',
      type: 'password_reset',
      data: { email, resetToken },
      html: this.generatePasswordResetHTML(email, resetToken)
    };

    console.log('📧 Sending Password Reset Email:', emailData);
    this.saveSentEmail(emailData);
    
    return { success: true, message: 'Password reset email sent' };
  }

  // Contact form confirmation email (to customer)
  async sendContactConfirmation(formData) {
    const emailData = {
      to: formData.email,
      subject: 'We Received Your Message - Almahra Opticals',
      type: 'contact_confirmation',
      data: formData,
      html: this.generateContactConfirmationHTML(formData)
    };

    console.log('📧 Sending Contact Confirmation Email:', emailData);
    this.saveSentEmail(emailData);
    
    return { success: true, message: 'Contact confirmation email sent' };
  }

  // Contact form notification email (to admin)
  async sendContactNotification(formData) {
    const emailData = {
      to: 'support@almahra-opticals.com',
      subject: `New Contact Form Submission - ${formData.subject}`,
      type: 'contact_notification',
      data: formData,
      html: this.generateContactNotificationHTML(formData)
    };

    console.log('📧 Sending Contact Notification Email to Admin:', emailData);
    this.saveSentEmail(emailData);
    
    return { success: true, message: 'Contact notification email sent to admin' };
  }

  // HTML Templates
  generateOrderConfirmationHTML(order) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .brand { background: #1a1a1a; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; }
          .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .product-item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-size: 18px; font-weight: bold; color: #2c3e50; }
          .button { background: #2c3e50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">ALMAHRA OPTICALS</div>
          <div class="header">
            <h1>✓ Order Confirmed!</h1>
            <p>Thank you for shopping with Almahra Opticals</p>
          </div>
          <div class="content">
            <p>Hi ${order.customerName || 'Valued Customer'},</p>
            <p>Your order from <strong>Almahra Opticals</strong> has been confirmed and is being processed.</p>
            
            <div class="order-details">
              <h3>Order #${order.id}</h3>
              <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              
              <h4>Items Ordered:</h4>
              ${order.items?.map(item => `
                <div class="product-item">
                  <strong>${item.name}</strong><br>
                  Quantity: ${item.quantity} × $${item.price}
                </div>
              `).join('') || '<p>No items</p>'}
              
              <p class="total">Total: $${order.total}</p>
            </div>
            
            <a href="#" class="button">Track Your Order</a>
            
            <p>We'll send you another email when your order ships.</p>
            
            <p style="margin-top: 20px;">Thank you for choosing <strong>Almahra Opticals</strong>!</p>
          </div>
          <div class="footer">
            <p><strong>Almahra Opticals</strong></p>
            <p>© 2025 Almahra Opticals. All rights reserved.</p>
            <p>If you have any questions, contact us at support@almahra-opticals.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateOrderShippedHTML(order) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .brand { background: #1a1a1a; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; }
          .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .tracking { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; text-align: center; }
          .tracking-number { font-size: 24px; font-weight: bold; color: #27ae60; letter-spacing: 2px; }
          .button { background: #27ae60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">ALMAHRA OPTICALS</div>
          <div class="header">
            <h1>📦 Your Order Has Shipped!</h1>
          </div>
          <div class="content">
            <p>Hi ${order.customerName || 'Valued Customer'},</p>
            <p>Good news! Your order from <strong>Almahra Opticals</strong> #${order.id} is on its way.</p>
            
            <div class="tracking">
              <h3>Tracking Number</h3>
              <p class="tracking-number">${order.trackingNumber || 'TRACK' + order.id}</p>
              <a href="#" class="button">Track Package</a>
            </div>
            
            <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery || '3-5 business days'}</p>
            <p>You can track your package using the tracking number above.</p>
          </div>
          <div class="footer">
            <p><strong>Almahra Opticals</strong></p>
            <p>© 2025 Almahra Opticals. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateOrderDeliveredHTML(order) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .brand { background: #1a1a1a; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; }
          .header { background: #3498db; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">ALMAHRA OPTICALS</div>
          <div class="header">
            <h1>🎉 Order Delivered!</h1>
          </div>
          <div class="content">
            <p>Hi ${order.customerName || 'Valued Customer'},</p>
            <p>Your order from <strong>Almahra Opticals</strong> #${order.id} has been delivered!</p>
            <p>We hope you love your new glasses. If you have any questions or concerns, please don't hesitate to reach out to us.</p>
            <a href="#" class="button">Leave a Review</a>
          </div>
          <div class="footer">
            <p><strong>Almahra Opticals</strong></p>
            <p>© 2025 Almahra Opticals. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateAppointmentConfirmationHTML(appointment) {
    const locations = {
      'al-munthaza': { 
        name: 'Al Munthaza Branch', 
        address: 'Al Munthaza, Qatar',
        phone: '+974 3033 2307',
        mapLink: 'https://g.co/kgs/KzssCy'
      },
      'al-wukair': { 
        name: 'Al Wukair Branch', 
        address: 'Al Wukair, Qatar',
        phone: '+974 7111 2307',
        mapLink: 'https://g.co/kgs/ijW1MLa'
      },
      'al-sadd': { 
        name: 'Al Sadd Branch', 
        address: 'Al Sadd, Qatar',
        phone: '+974 7118 2307',
        mapLink: 'https://share.google/VCNjkVKBV3vCTJrgc'
      },
      'al-khor': { 
        name: 'Al Khor Branch', 
        address: 'Al Khor, Qatar',
        phone: '+974 7778 2307',
        mapLink: 'https://g.co/kgs/nrf71fy'
      },
      'duhail': { 
        name: 'Duhail Branch', 
        address: 'Duhail, Qatar',
        phone: '+974 7732 2307',
        mapLink: 'https://g.co/kgs/BJaGsJA'
      }
    };
    const location = locations[appointment.location] || {};

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .brand { background: #1a1a1a; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; }
          .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .appointment-details { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
          .button { background: #2c3e50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">ALMAHRA OPTICALS</div>
          <div class="header">
            <h1>✓ Appointment Confirmed</h1>
          </div>
          <div class="content">
            <p>Hi ${appointment.personalInfo.firstName},</p>
            <p>Your appointment at <strong>Almahra Opticals</strong> has been confirmed!</p>
            
            <div class="appointment-details">
              <div class="detail-row">
                <strong>Service:</strong> ${appointment.type} - ${appointment.service?.name}
              </div>
              <div class="detail-row">
                <strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div class="detail-row">
                <strong>Time:</strong> ${appointment.time}
              </div>
              <div class="detail-row">
                <strong>Location:</strong> ${location.name}<br>
                ${location.address}<br>
                <strong>Phone:</strong> ${location.phone}<br>
                <a href="${location.mapLink}" target="_blank" style="color: #2c3e50; text-decoration: underline;">📍 View on Google Maps</a>
              </div>
            </div>

            <p><strong>Important:</strong> Please arrive 10 minutes before your scheduled time.</p>
            <p><strong>Working Hours:</strong> Saturday to Thursday: 9:30 AM - 11:00 PM | Friday: 3:00 PM - 11:00 PM</p>

            <a href="#" class="button">Add to Calendar</a>
          </div>
          <div class="footer">
            <p><strong>Almahra Opticals</strong></p>
            <p>© 2025 Almahra Opticals. All rights reserved.</p>
            <p>To cancel or reschedule, please call us at +974 3033 2307</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateAppointmentReminderHTML(appointment) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .brand { background: #1a1a1a; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; }
          .header { background: #f39c12; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">ALMAHRA OPTICALS</div>
          <div class="header">
            <h1>⏰ Appointment Reminder</h1>
          </div>
          <div class="content">
            <p>Hi ${appointment.personalInfo.firstName},</p>
            <p>This is a reminder from <strong>Almahra Opticals</strong> that you have an appointment tomorrow:</p>
            <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            <p><strong>Service:</strong> ${appointment.type}</p>
            <p>We look forward to seeing you!</p>
          </div>
          <div class="footer">
            <p><strong>Almahra Opticals</strong></p>
            <p>© 2025 Almahra Opticals. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateAppointmentCancellationHTML(appointment) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .brand { background: #1a1a1a; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; }
          .header { background: #e74c3c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { background: #2c3e50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">ALMAHRA OPTICALS</div>
          <div class="header">
            <h1>Appointment Cancelled</h1>
          </div>
          <div class="content">
            <p>Hi ${appointment.personalInfo.firstName},</p>
            <p>Your appointment at <strong>Almahra Opticals</strong> scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been cancelled.</p>
            <p>If you would like to reschedule, please book a new appointment at your convenience.</p>
            <a href="#" class="button">Book New Appointment</a>
          </div>
          <div class="footer">
            <p><strong>Almahra Opticals</strong></p>
            <p>© 2025 Almahra Opticals. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateWelcomeHTML(user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .brand { background: #1a1a1a; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; }
          .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { background: #2c3e50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">ALMAHRA OPTICALS</div>
          <div class="header">
            <h1>Welcome to Almahra Opticals!</h1>
          </div>
          <div class="content">
            <p>Hi ${user.firstName},</p>
            <p>Thank you for joining <strong>Almahra Opticals</strong>! We're excited to have you as part of our family.</p>
            <p>Here's what you can do with your account:</p>
            <ul>
              <li>Browse our collection of premium eyewear</li>
              <li>Book eye test appointments</li>
              <li>Track your orders</li>
              <li>Manage your prescriptions</li>
              <li>Save your favorite styles</li>
            </ul>
            <a href="#" class="button">Start Shopping</a>
          </div>
          <div class="footer">
            <p><strong>Almahra Opticals</strong></p>
            <p>© 2025 Almahra Opticals. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generatePasswordResetHTML(email, resetToken) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .brand { background: #1a1a1a; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; }
          .header { background: #e74c3c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .code-box { background: white; border: 2px dashed #e74c3c; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #e74c3c; font-family: monospace; }
          .button { background: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">ALMAHRA OPTICALS</div>
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p>You requested to reset your password for your <strong>Almahra Opticals</strong> account (${email}).</p>
            
            <p>Please use the following verification code to reset your password:</p>
            
            <div class="code-box">
              <p style="margin: 0; font-size: 14px; color: #666; margin-bottom: 10px;">Verification Code</p>
              <div class="code">${resetToken}</div>
              <p style="margin: 0; font-size: 12px; color: #999; margin-top: 10px;">This code will expire in 10 minutes</p>
            </div>

            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              If you didn't request this password reset, please ignore this email or contact our support team immediately.
            </div>

            <p>For security reasons, this code is valid for 10 minutes only.</p>
          </div>
          <div class="footer">
            <p><strong>Almahra Opticals</strong></p>
            <p>© 2025 Almahra Opticals. All rights reserved.</p>
            <p>Contact us at support@almahra-opticals.com | +974 3033 2307</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateContactConfirmationHTML(formData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .brand { background: #1a1a1a; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; }
          .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .message-box { background: white; border-left: 4px solid #2c3e50; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">ALMAHRA OPTICALS</div>
          <div class="header">
            <h1>✓ Message Received!</h1>
          </div>
          <div class="content">
            <p>Hi ${formData.name},</p>
            <p>Thank you for contacting <strong>Almahra Opticals</strong>. We have received your message and will get back to you within 24 hours.</p>
            
            <div class="message-box">
              <h3>Your Message Details:</h3>
              <div class="detail-row">
                <strong>Subject:</strong> ${formData.subject}
              </div>
              <div class="detail-row">
                <strong>Message:</strong><br>
                ${formData.message}
              </div>
            </div>

            <p>If you need immediate assistance, please call us at <strong>+974 3033 2307</strong></p>
            <p><strong>Working Hours:</strong></p>
            <ul style="margin: 0;">
              <li>Saturday - Thursday: 9:30 AM - 11:00 PM</li>
              <li>Friday: 3:00 PM - 11:00 PM</li>
            </ul>
          </div>
          <div class="footer">
            <p><strong>Almahra Opticals</strong></p>
            <p>© 2025 Almahra Opticals. All rights reserved.</p>
            <p>Email: support@almahra-opticals.com | Phone: +974 3033 2307</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateContactNotificationHTML(formData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .brand { background: #1a1a1a; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; }
          .header { background: #f39c12; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .info-box { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
          .message-content { background: #f8f9fa; padding: 15px; margin-top: 15px; border-radius: 4px; font-style: italic; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">ALMAHRA OPTICALS</div>
          <div class="header">
            <h1>🔔 New Contact Form Submission</h1>
          </div>
          <div class="content">
            <p><strong>A new customer inquiry has been received:</strong></p>
            
            <div class="info-box">
              <div class="detail-row">
                <strong>Name:</strong> ${formData.name}
              </div>
              <div class="detail-row">
                <strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a>
              </div>
              <div class="detail-row">
                <strong>Phone:</strong> <a href="tel:${formData.phone}">${formData.phone}</a>
              </div>
              <div class="detail-row">
                <strong>Subject:</strong> ${formData.subject}
              </div>
              <div class="detail-row">
                <strong>Submitted:</strong> ${new Date().toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              
              <div class="message-content">
                <strong>Message:</strong><br><br>
                ${formData.message}
              </div>
            </div>

            <p><strong>Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
          </div>
          <div class="footer">
            <p><strong>Almahra Opticals - Admin Notification</strong></p>
            <p>© 2025 Almahra Opticals. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
export default emailService;