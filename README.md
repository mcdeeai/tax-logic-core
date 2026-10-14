# tax-logic-core

> Open-source US federal and state tax calculation engine with optimization strategies

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/tax-logic-core.svg)](https://www.npmjs.com/package/tax-logic-core)

## Overview

**tax-logic-core** is a community-auditable, open-source JavaScript library for US federal and state tax calculations. Every calculation and optimization includes IRS citations for transparency and accuracy.

### Why Open Source?

Tax logic should be **transparent** and **auditable**. By open-sourcing the core calculations:
- 🔍 Anyone can audit the math
- 🐛 Community can find and fix bugs
- 📚 IRS citations provide legal backing
- 🤝 Contributions improve accuracy for everyone

## Installation

```bash
npm install tax-logic-core
```

## Quick Start

```javascript
import { calculateTotalTax, analyzeTaxOptimizations } from 'tax-logic-core';

// Calculate taxes
const form = {
  filingStatus: 'married',
  totalWages: 150000,
  taxableInterest: 5000,
  // ... other form fields
};

const result = calculateTotalTax(form);
console.log(`Total Tax: $${result.finalTax}`);

// Find optimizations
const optimizations = analyzeTaxOptimizations(form);
console.log(`Potential Savings: $${optimizations.totalPotentialSavings}`);
```

## Features

### Tax Calculations

- **Federal Income Tax** (2025 brackets, OBBBA updates)
- **State Income Tax** (50 states + DC)
- **Self-Employment Tax** (Schedule SE)
- **Capital Gains Tax** (0%, 15%, 20% brackets)
- **Alternative Minimum Tax**: exposure screening only (`analyzeAMTOptimizations`); `calculateTotalTax` does not compute AMT
- **Net Investment Income Tax** (NIIT - 3.8%)

### Optimization Strategies

| Strategy | IRS Authority | Description |
|----------|---------------|-------------|
| QBI Deduction | §199A | 20% pass-through deduction |
| Augusta Rule | §280A(g) | 14-day tax-free rental |
| S-Corp Election | §1362 | SE tax savings |
| Tax-Loss Harvesting | §1091 | Offset gains with losses |
| Home Office | §280A | Business use of home |
| SEP/Solo 401(k) | §408(k)/§401(k) | Retirement contributions |

### IRS Citations

Every optimization includes audit-proof citations:

```javascript
import { getAuthority } from 'tax-logic-core/authority';

const qbi = getAuthority('qbiDeduction');
// {
//   irc: '§199A',
//   publication: 'Publication 535',
//   form: 'Form 8995 or Form 8995-A',
//   regulation: 'Treas. Reg. §1.199A-1 through §1.199A-6'
// }
```

## API Reference

### Tax Calculations

```javascript
import {
  calculateTotalTax,
  calculateTaxWithOverrides,
  calculateSelfEmploymentTax,
  calculateCapitalGainsTax,
} from 'tax-logic-core/calculations';

// State tax is exported from the package root
import { calculateStateTax } from 'tax-logic-core';
```

### Optimizations

```javascript
import {
  analyzeTaxOptimizations,
  analyzeCapitalGainsOptimizations,
  analyzeSelfEmploymentOptimizations,
  analyzeRetirementOptimizations,
  analyzeStateOptimizations,
  analyzeAugustaRuleOptimization,
  analyzeK1Optimizations,
  analyzeAMTOptimizations,
  // New features
  analyzeCryptoTaxOptimizations,
  analyzeRealEstateProfessionalOptimizations,
  analyzeInternationalTaxOptimizations,
} from 'tax-logic-core/optimizations';
```

### Tax Authority

```javascript
import {
  TAX_AUTHORITY,
  getCitation,
  getAuthority,
  formatAuthorityForDisplay
} from 'tax-logic-core/authority';
```

## 2025 Tax Law Updates (OBBBA)

This library includes updates for the One Big Beautiful Bill Act of 2025:

- ✅ TCJA rates made permanent
- ✅ SALT cap increased to $40,000
- ✅ Section 179 limit raised to $2.5M
- ✅ 100% bonus depreciation restored
- ✅ Child Tax Credit increased to $2,200
- ✅ New deductions: Tips ($25k), Overtime ($12.5k), Auto Loan ($10k)

### Policy Flags

In some environments you may want to evaluate returns under pre‑OBBBA assumptions (e.g., SALT cap $10k, no new 2025 deductions). Use the policy flag on the form:

```js
// OBBBA-enabled (default behavior)
calculateTotalTax({ /* form fields... */, useObbba2025: true })

// Current-law fallback (pre‑OBBBA): SALT cap $10k, no new 2025 deductions
calculateTotalTax({ /* form fields... */, useObbba2025: false })
```

Other notable behaviors:

- Self-Employment tax considers W‑2 wages for the Social Security wage base and applies Additional Medicare thresholds by filing status: `calculateSelfEmploymentTax(income, wages=0, filingStatus='single')`.
- Capital losses are limited to $3,000 ($1,500 MFS) against ordinary income; excess carries forward (not modeled here).
- QBI limit subtracts qualified dividends and net long‑term gains. Optional K‑1 ordinary income minus guaranteed payments is included when provided.

## Testing

This repo uses Vitest and Bun. Run tests locally with:

```bash
bun install
bun run test
```

If you hit worker/thread issues in a constrained environment, try `bun run test -- --pool=forks`.

Core areas covered by unit tests include:

- Progressive bracket tax and LTCG stacking
- Self‑employment tax with W‑2 wages + thresholds
- Medical 7.5% floor and SALT cap policy gating
- Capital loss $3k ($1.5k MFS) limitation
- QBI limit with qualified dividends and LT gains; optional K‑1 inclusion

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### How You Can Help

- 🔍 **Review calculations** - Verify formulas against IRS publications
- 📝 **Add test cases** - Create scenarios to validate edge cases
- 📚 **Improve documentation** - Add IRS citations and explanations
- 🐛 **Report bugs** - Found an error? Open an issue!

### Reporting Bugs

Found an error in a calculation? Please:
1. Open an issue with the specific scenario
2. Include expected vs actual result
3. Reference the applicable IRS authority if known

## Disclaimer

⚠️ **This software is for informational purposes only.** It is not tax advice. Always consult a qualified tax professional for your specific situation. See [LICENSE](LICENSE) for full disclaimer.

## License

MIT © TaxOptimizer Community Contributors
