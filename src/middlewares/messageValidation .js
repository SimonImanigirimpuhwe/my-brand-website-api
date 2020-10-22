import Joi from '@hapi/joi';

const messageValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .required()
            .messages({'string.empty': 'Name is required!'}),
        email: Joi.string()
            .email()
            .lowercase()
            .required()
            .messages({
                'string.empty': 'Email is required!',
                'string.lowercase': 'Email must be lowercase!',
                'string.email': 'Email must be valid!'
            }),
        message: Joi.string()
            .max(100)
            .required()
            .messages({
                'string.empty': 'Message is required!',
                'string.max': 'Message should be less than 100 characters!'
            })           
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({error: error.details[0].message});

    return next();
};

export default messageValidation;