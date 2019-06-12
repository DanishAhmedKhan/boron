const Joi = require('joi');

exports.validate = (data, schemaObject) => {
    const schema = Joi.object().keys(schemaObject);

    const { error } = Joi.validate(data, schema, {
        abortEarly: true, 
        convert: true,
        allowUnknown: true
    });
    
    return error;
};