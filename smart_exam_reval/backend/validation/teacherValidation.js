const Joi = require("joi");

exports.updateStatusSchema = Joi.object({
    requestId: Joi.number().integer().required(),

    status: Joi.string()
        .valid("Pending", "Processing", "Completed", "Rejected")
        .required(),

    studentEmail: Joi.string().email().lowercase().required()
});
