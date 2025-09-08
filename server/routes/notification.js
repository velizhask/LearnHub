const express = require('express');
const nodemailer = require('nodemailer');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Create transporter for email sending
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const useMockEmail = process.env.USE_MOCK_EMAIL === 'true';
  
  // Use mock email for development
  if (useMockEmail || !emailUser || !emailPass || emailUser === 'your-email@gmail.com') {
    console.log('Using mock email service for development');
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
};

router.post('/email', auth, async (req, res) => {
  try {
    const { subject, message, type = 'general' } = req.body;
    const userEmail = req.user.email;
    
    if (!userEmail) {
      return res.status(400).json({ message: 'User email not found' });
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@learnhub.com',
      to: userEmail,
      subject: subject || 'LearnHub Notification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">📚 LearnHub</h1>
            <p style="color: white; margin: 5px 0 0 0;">Your Learning Companion</p>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #333; margin-bottom: 20px;">${subject || 'Notification'}</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
              <p style="color: #555; line-height: 1.6; margin: 0;">${message}</p>
            </div>
            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:8080'}" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Visit LearnHub
              </a>
            </div>
          </div>
          <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>This email was sent to ${userEmail}. If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    
    // Handle mock email response
    if (result.message) {
      console.log('Mock email sent:', {
        to: userEmail,
        subject: mailOptions.subject,
        content: result.message.toString()
      });
    }
    
    console.log(`Email sent successfully to ${userEmail}`);
    res.json({ 
      message: 'Email sent successfully',
      recipient: userEmail,
      subject: mailOptions.subject,
      mock: process.env.USE_MOCK_EMAIL === 'true'
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    
    let errorMessage = 'Failed to send email';
    if (error.code === 'EAUTH') {
      errorMessage = 'Gmail authentication failed. Please set up App Password in Gmail settings.';
    } else if (error.message.includes('configuration not set up')) {
      errorMessage = 'Email not configured. Please contact administrator.';
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: error.message,
      setup: error.code === 'EAUTH' ? 'Enable 2FA in Gmail → Generate App Password → Update .env file' : null
    });
  }
});

// Send reading reminder
router.post('/reading-reminder', auth, async (req, res) => {
  try {
    const { bookTitle, reminderType = 'daily' } = req.body;
    const userEmail = req.user.email;
    const userName = req.user.name;
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@learnhub.com',
      to: userEmail,
      subject: '📚 Reading Reminder - LearnHub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">📚 LearnHub</h1>
            <p style="color: white; margin: 5px 0 0 0;">Reading Reminder</p>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #333;">Hi ${userName}! 👋</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
              <p style="color: #555; line-height: 1.6; margin: 0;">
                ${bookTitle ? 
                  `Don't forget to continue reading "<strong>${bookTitle}</strong>"! 📖` :
                  'Time for your daily reading session! 📖'
                }
              </p>
              <p style="color: #555; line-height: 1.6; margin: 15px 0 0 0;">
                Even 15 minutes of reading can make a big difference in your learning journey. Keep up the great work! 🌟
              </p>
            </div>
            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:8080'}/library" 
                 style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Continue Reading
              </a>
            </div>
          </div>
          <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>You can manage your notification preferences in your LearnHub profile settings.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    console.log(`Reading reminder sent to ${userEmail}`);
    res.json({ 
      message: 'Reading reminder sent successfully',
      recipient: userEmail
    });
  } catch (error) {
    console.error('Reading reminder failed:', error);
    
    let errorMessage = 'Failed to send reading reminder';
    if (error.code === 'EAUTH') {
      errorMessage = 'Gmail authentication failed. Please set up App Password in Gmail settings.';
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: error.message 
    });
  }
});

router.patch('/settings', auth, (req, res) => {
  // In a real app, save notification preferences to database
  const { emailNotifications, readingReminders, achievementAlerts } = req.body;
  
  console.log('Notification settings updated for user:', req.user.email, {
    emailNotifications,
    readingReminders,
    achievementAlerts
  });
  
  res.json({ 
    message: 'Notification settings updated successfully',
    settings: {
      emailNotifications,
      readingReminders,
      achievementAlerts
    }
  });
});

module.exports = router;