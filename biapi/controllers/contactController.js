import contactModal from '../models/contactModal.js';
import leadsModal from '../models/leadModal.js';

const contactController = {
  createContact: async (req, res) => {
    try {
      const { name, email, mobile, message } = req.body;

      // Validate required fields
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

      // Clean data
      const contactData = {
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        message: message.trim()
      };

      // 1. Create contact
      const contact = await contactModal.createContacts(contactData);

      // 2. Create lead using contact information
      const lead = await leadsModal.createCustomerLead({
        lead_type: 'contact',
        lead_unique_id: contact.id,

        name: contact.name,
        email: contact.email,
        mobile: contact.mobile,
        status: 'active',

        meta: {
          contact_id: contact.id,
          message: contact.message
        }
      });

      // 3. Return contact + lead
      return res.status(201).json({
        success: true,
        message: 'Contact created and lead stored successfully.',
        data: {
          contact,
          lead
        }
      });

    } catch (err) {
      console.error('Contact Controller Error:', err);

      // Handle duplicate entry
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Email or mobile number already exists.',
          error:
            process.env.NODE_ENV === 'development'
              ? err.message
              : undefined
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error. Please try again later.',
        error:
          process.env.NODE_ENV === 'development'
            ? err.message
            : undefined
      });
    }
  },

  getContacts: async (req, res) => {
    try {
      const contacts = await contactModal.getContacts();

      return res.status(200).json({
        success: true,
        data: contacts
      });

    } catch (err) {
      console.error('Get Contacts Error:', err);

      return res.status(500).json({
        success: false,
        message: 'Internal server error. Please try again later.',
        error:
          process.env.NODE_ENV === 'development'
            ? err.message
            : undefined
      });
    }
  }
};

export default contactController;
