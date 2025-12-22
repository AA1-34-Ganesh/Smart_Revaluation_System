// Styles for the email
const headerStyle = `background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;`;
const bodyStyle = `padding: 20px; background-color: #f9fafb; color: #333; font-family: Arial, sans-serif; line-height: 1.6;`;
const footerStyle = `text-align: center; padding: 10px; font-size: 12px; color: #666;`;
const buttonStyle = `background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;`;

// 1. Registration Template
exports.welcomeEmail = (name, role) => {
  return `
    <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 5px;">
      <div style="${headerStyle}">
        <h1>Welcome to Smart Exam Portal</h1>
      </div>
      <div style="${bodyStyle}">
        <h2>Hello, ${name}!</h2>
        <p>Your account has been successfully created as a <strong>${role}</strong>.</p>
        <p>You can now login to your dashboard to view marks, apply for revaluation, and more.</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="#" style="${buttonStyle}">Login to Dashboard</a>
        </div>
      </div>
      <div style="${footerStyle}">
        <p>&copy; 2025 Smart Exam System. All rights reserved.</p>
      </div>
    </div>
  `;
};

// 2. Revaluation Request Confirmation
exports.requestReceived = (name, subject) => {
  return `
    <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 5px;">
      <div style="${headerStyle}">
        <h1>Application Received</h1>
      </div>
      <div style="${bodyStyle}">
        <h2>Dear ${name},</h2>
        <p>We have received your revaluation request for <strong>${subject}</strong>.</p>
        <p>Please complete the payment to proceed with the evaluation process.</p>
        <div style="background: #fff; padding: 15px; border-left: 4px solid #4F46E5; margin: 15px 0;">
          <p><strong>Status:</strong> Payment Pending</p>
          <p><strong>Fee:</strong> ₹500</p>
        </div>
      </div>
      <div style="${footerStyle}">
        <p>Please ignore if already paid.</p>
      </div>
    </div>
  `;
};

// 3. Payment Success
exports.paymentSuccess = (name, amount, transactionId) => {
  return `
    <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 5px;">
      <div style="background-color: #10B981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
        <h1>Payment Successful</h1>
      </div>
      <div style="${bodyStyle}">
        <h2>Payment Confirmed!</h2>
        <p>Hi ${name}, we have received your payment of <strong>₹${amount}</strong>.</p>
        <p>Your revaluation request has been forwarded to the respective teacher.</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
      </div>
      <div style="${footerStyle}">
        <p>Thank you for using Smart Exam Portal.</p>
      </div>
    </div>
  `;
};

// 4. Status Update (Approved/Completed)
exports.statusUpdate = (status) => {
  const color = status === 'Accepted' || status === 'Completed' ? '#10B981' : '#F59E0B';
  return `
    <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 5px;">
      <div style="background-color: ${color}; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
        <h1>Status Update</h1>
      </div>
      <div style="${bodyStyle}">
        <h2>Your Request is ${status}</h2>
        <p>The status of your revaluation request has been updated.</p>
        <p>Please login to the portal to view the detailed remarks or updated marks.</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="#" style="${buttonStyle}">Check Result</a>
        </div>
      </div>
    </div>
  `;
};