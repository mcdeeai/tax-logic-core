// Loads every published entry point by package name, the way a consumer would.
// Vitest resolves extensionless imports that plain Node rejects, so the test
// suite alone can't catch a broken package.
import { createRequire } from 'node:module';

const entryPoints = ['tax-logic-core', 'tax-logic-core/calculations', 'tax-logic-core/optimizations', 'tax-logic-core/authority'];

for (const name of entryPoints) {
    const mod = await import(name);
    if (Object.keys(mod).length === 0) throw new Error(`${name} has no exports`);
    console.log(`import  ${name}: ${Object.keys(mod).length} exports`);
}

const require = createRequire(import.meta.url);
const cjs = require('tax-logic-core');
if (typeof cjs.calculateTotalTax !== 'function') throw new Error('require() is missing calculateTotalTax');
console.log('require tax-logic-core: ok');
