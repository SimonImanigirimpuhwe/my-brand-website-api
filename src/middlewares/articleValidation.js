import Joi from '@hapi/joi';

export const newArticleValidation = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string()
            .required()
            .messages({
                'string.empty': 'Title is required!'
            }),
        content: Joi.string()
            .required()
            .min(30)
            .messages({
                'string.empty': 'Content is required!',
                'string.min': 'Content must be at least 30 characters'
            })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({error: error.details[0].message});

    return next();
};

export const editArticleValidation = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string()
            .messages({
                'string.empty': 'Title should not be empty!'
            }),
        content: Joi.string()
            .required()
            .min(30)
            .messages({
                'string.empty': 'Content is required!',
                'string.min': 'Content must be at least 30 characters'
            })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({error: error.details[0].message});

    return next();
}