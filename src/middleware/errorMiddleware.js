export const malformedBodyChecker = (err, _, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // Handle JSON parse error
    return res.status(400).json({ error: "Bad request: Invalid JSON format." });
  }
  next();
};
