const validUrl = require("valid-url");

const validateUrl = (req, res, next) => {
  const { fullUrl } = req.body;

  if (!validUrl.isUri(fullUrl)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  next();
};

module.exports = validateUrl;
