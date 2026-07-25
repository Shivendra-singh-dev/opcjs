
export const getProducts = (req, res) => {
  res.status(200).json({ success: true, data: [] });
};

export const getProduct = (req, res) => {
  res.status(200).json({ success: true, data: null });
};

export const createProduct = (req, res) => {
  res.status(201).json({ success: true, message: 'Not implemented', data: req.body || {} });
};

export const updateProduct = (req, res) => {
  res.status(200).json({ success: true, message: 'Not implemented', data: req.body || {} });
};

export const deleteProduct = (req, res) => {
  res.status(200).json({ success: true, message: 'Not implemented' });
};

