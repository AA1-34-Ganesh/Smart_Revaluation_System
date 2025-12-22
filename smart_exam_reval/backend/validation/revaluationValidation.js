const Joi = require("joi");

const createRevalSchema = Joi.object({
    // Changed from subject_id to subject_name to match your new Controller logic
    subject_name: Joi.string().required().messages({
        "string.empty": "Subject Name is required",
        "any.required": "Subject Name is required"
    })
});

const paymentSchema = Joi.object({
    requestId: Joi.number().integer().required(),
    studentEmail: Joi.string().email().required()
});

const updateStatusSchema = Joi.object({
    requestId: Joi.number().integer().required(),
    status: Joi.string().valid("pending", "processing", "accepted", "rejected", "completed").required(),
    studentEmail: Joi.string().email().optional()
});

module.exports = {
    createRevalSchema,
    paymentSchema,
    updateStatusSchema
};