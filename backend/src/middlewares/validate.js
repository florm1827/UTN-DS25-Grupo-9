// src/middlewares/validate.js
export const validate =
  (schema) =>
  (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        ok: false,
        errors: result.error.issues.map((i) => i.message),
      })
    }
    // guardamos el body parseado
    req.body = result.data
    next()
  }
