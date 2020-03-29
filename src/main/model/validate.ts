import * as path from 'path';
import * as fs from 'fs';
import * as TJS from 'typescript-json-schema';
import { validate as vdt, JSONSchema7, ValidationResult } from 'json-schema';

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
    required: true
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true
}

const modelFiles = fs.readdirSync(__dirname)
    .filter(f => f !== 'schema.ts')
    .map(f => path.join(__dirname, f));


const program = TJS.getProgramFromFiles(modelFiles, compilerOptions);
const generator = TJS.buildGenerator(program, settings);

// TODO: figure out why this is validating everything
const validate = (obj: any, symbol: string): ValidationResult => {
    const schema = generator!.getSchemaForSymbol(symbol);
    const res = vdt(obj, schema as JSONSchema7);

    return res;
};

export default validate;