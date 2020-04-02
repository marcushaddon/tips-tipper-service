import * as path from 'path';
import * as fs from 'fs';
import { validate as vdt, JSONSchema7, ValidationResult } from 'json-schema';

const schemas: { [ key: string ]: any } = {};
fs
    .readdirSync(__dirname)
    .filter(f => f.indexOf('schema.json') > -1)
    .forEach(f => {
        const name = f.replace('.schema.json', '');
        schemas[name] = require(path.join(__dirname, f));
    })

console.log(schemas);
// TODO: figure out why this is validating everything

const validate = (instance: any, schema: string) => {
    return vdt(instance, schemas[schema]);
}

export default validate;