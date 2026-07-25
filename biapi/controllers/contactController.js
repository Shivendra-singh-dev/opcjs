import db from '../db.js';

const contactController = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { name, email, mobile, message } = req.body;

      // Validate all required fields
      const missingFields = [];
      if (!name || !name.trim()) missingFields.push('name');
      if (!email || !email.trim()) missingFields.push('email');
      if (!mobile || !mobile.trim()) missingFields.push('mobile');
      if (!message || !message.trim()) missingFields.push('message');

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Required fields missing: ${missingFields.join(', ')}`,
          errors: missingFields.reduce((acc, field) => {
            acc[field] = `${field} is required`;
            return acc;
          }, {})
        });
      }

      // Run duplicate checks in parallel
      const [emailResults] = await db.query(
        'SELECT id FROM contacts WHERE email = ?',
        [email.trim()]
      );

      const [mobileResults] = await db.query(
        'SELECT id FROM contacts WHERE mobile = ?',
        [mobile.trim()]
      );

      const errors = {};
      if (emailResults.length > 0) {
        errors.email = 'This email is already registered.';
      }
      if (mobileResults.length > 0) {
        errors.mobile = 'This mobile number is already registered.';
      }

      if (Object.keys(errors).length > 0) {
        return res.status(409).json({
          success: false,
          message: Object.values(errors).join(' '),
          errors
        });
      }

      // Insert new contact
      const [result] = await db.query(
        'INSERT INTO contacts (name, mobile, email, message) VALUES (?, ?, ?, ?)',
        [name.trim(), mobile.trim(), email.trim(), message.trim()]
      );

      return res.status(201).json({
        success: true,
        data: {
          id: result.insertId,
          name: name.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          message: message.trim(),
        },
      });

    } else if (req.method === 'GET') {
      const [results] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
      return res.status(200).json({
        success: true,
        data: results,
      });

    } else {
      return res.status(405).json({
        success: false,
        message: 'Method Not Allowed',
      });
    }
  } catch (err) {
    console.error('Contact Controller Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export default contactController;

