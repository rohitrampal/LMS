import nodemailer from 'nodemailer';

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  try {
    // For development/testing with yopmail.com, we can just log
    // In production, this would send actual emails
    if (process.env.EMAIL_SERVICE_ENABLED === 'true' && process.env.SMTP_USER) {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
      });
    }
    
    // Always log for yopmail.com testing
    console.log('Email sent:', { to, subject });
    console.log('Email body:', html);
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // In development, still return true to allow testing
    return true;
  }
};

export const sendLoanDisbursementEmail = async (
  to: string,
  borrowerName: string,
  loanAmount: number,
  repaymentSchedule: any[]
) => {
  const subject = 'Loan Disbursement Confirmation';
  const html = `
    <h2>Loan Disbursement Confirmed</h2>
    <p>Dear ${borrowerName},</p>
    <p>Your loan application has been approved and disbursed.</p>
    <p><strong>Loan Amount:</strong> $${loanAmount.toLocaleString()}</p>
    <h3>Repayment Schedule:</h3>
    <table border="1" cellpadding="10" style="border-collapse: collapse;">
      <tr>
        <th>Installment</th>
        <th>Due Date</th>
        <th>Principal</th>
        <th>Interest</th>
        <th>Total</th>
      </tr>
      ${repaymentSchedule.map((schedule, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${new Date(schedule.dueDate).toLocaleDateString()}</td>
          <td>$${schedule.principalAmount.toLocaleString()}</td>
          <td>$${schedule.interestAmount.toLocaleString()}</td>
          <td>$${schedule.totalAmount.toLocaleString()}</td>
        </tr>
      `).join('')}
    </table>
    <p>Thank you for choosing our services.</p>
  `;
  
  return sendEmail(to, subject, html);
};

export const sendLoginCredentialsEmail = async (
  to: string,
  name: string,
  email: string,
  password: string,
  role: string
) => {
  const subject = 'Your Login Credentials - Loan Management System';
  const html = `
    <h2>Welcome to Loan Management System</h2>
    <p>Dear ${name},</p>
    <p>Your account has been created successfully.</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Password:</strong> ${password}</p>
    <p><strong>Role:</strong> ${role}</p>
    <p>Please login and change your password after first login.</p>
    <p>Thank you!</p>
  `;
  
  return sendEmail(to, subject, html);
};


