import Joi from '@hapi/joi';

export const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .max(50)
            .required()
            .messages({
                'string.empty': 'Name is required!'
            }),
        email: Joi.string()
            .email()
            .lowercase()
            .required()
            .messages({
                'string.empty': 'Email is required!',
                'string.lowercase': 'Email must be lowercase!',
                'string.email': 'Email must be valid!'
            }),
        password: Joi.string()
            .min(6)
            .max(50)
            .required()
            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,}$/)
            .messages({
                'string.empty': 'Password is required!',
                'string.min': 'Password must be at least 6 characters!',
                'string.max': 'Password must be less than 50 characters!',
                'string.pattern.base': 
                'Password must contain at least one digit, lowercase and uppercase characters!'
            })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({error: error.details[0].message});

    return next();
};

export const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .lowercase()
            .required()
            .messages({
                'string.empty': 'Email is required!',
                'string.lowercase': 'Email must be lowercase!',
                'string.email': 'Email must be valid!'
            }),
        password: Joi.string()
            .min(6)
            .max(50)
            .required()
            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,}$/)
            .messages({
                'string.empty': 'Password is required!',
                'string.min': 'Password must be at least 6 characters!',
                'string.max': 'Password must be less than 50 characters!',
                'string.pattern.base': 
                'Password must contain at least one digit, lowercase and uppercase characters!'
            })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({error: error.details[0].message});

    return next();
};

export const updateProfileValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .messages({
                'string.empty': 'Name should not be empty!'
            }),
        biograph: Joi.string()
            .required()
            .min(10)
            .messages({
                'string.empty': 'Biograph should not be empty!',
                'string.min': 'Biograph should be at least 10 characters long!'
            })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({error: error.details[0].message});

    return next();
}

