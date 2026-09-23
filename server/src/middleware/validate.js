const { ZodError } = require('zod');

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError || Array.isArray(error.issues) || Array.isArray(error.errors)) {
        const issues = error.issues || error.errors || [];
        const firstMessage = issues[0]?.message || 'Invalid input data';
        const formattedErrors = {};

        issues.forEach((issue) => {
          const path = issue.path && issue.path.length > 0 ? issue.path.join('.') : 'general';
          if (!formattedErrors[path]) {
            formattedErrors[path] = issue.message;
          }
        });

        return res.status(400).json({
          success: false,
          message: firstMessage,
          errors: formattedErrors
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message || 'Invalid request data'
      });
    }
  };
};

module.exports = {
  validate
};
