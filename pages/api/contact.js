// pages/api/contact.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  // For now, just log to console (you can add email functionality later)
  console.log('📧 New Contact Form Submission:');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Subject:', subject);
  console.log('Message:', message);
  console.log('----------------------------');

  // Simulate successful submission
  res.status(200).json({ message: 'Message received successfully' });
}