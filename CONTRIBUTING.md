# Contributing to tax-logic-core

Thank you for your interest in contributing to tax-logic-core! This open-source project aims to create a transparent, auditable US federal tax calculation engine that anyone can verify and improve.

## 🎯 Our Mission

Tax calculation software should be **transparent**. When you calculate your taxes, you should be able to understand exactly how each number was derived and verify it against IRS publications. This project makes that possible.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [IRS Citation Guidelines](#irs-citation-guidelines)

---

## Code of Conduct

- Be respectful and constructive
- Tax law is complex; assume good faith in discussions
- No tax advice in issues or PRs (we provide code, not advice)
- Keep political discussions out of this repo

---

## How Can I Contribute?

### 🐛 Report Calculation Errors

Found a calculation that doesn't match IRS publications? This is our TOP PRIORITY.

1. Open an issue with tag `[CALCULATION ERROR]`
2. Include:
   - The specific calculation or function
   - Your expected result (with IRS source)
   - Our actual result
   - A reproducible test case

### 📚 Add or Fix IRS Citations

Every calculation should cite its legal authority. Help us by:

- Adding missing citations to existing code
- Fixing incorrect citations
- Adding links to IRS publications/forms

### 🧮 Implement Missing Features

Check our [Issues](https://github.com/rsathyam/tax-logic-core/issues) for:
- `good first issue` - Great for newcomers
- `help wanted` - We need community input
- `enhancement` - Feature requests

Priority areas:
- [ ] Form 1040 Schedule A line-by-line
- [ ] EITC calculation (complex!)
- [ ] State tax calculations
- [ ] More edge cases in existing modules

### ✅ Add Test Cases

We need more test cases covering:
- Edge cases (phase-outs, limits, cliffs)
- Common taxpayer scenarios
- Unusual situations (expatriates, complex K-1s)

### 📖 Improve Documentation

- Code comments explaining tax concepts
- README improvements
- Example usage

---

## Development Setup

```bash
# Clone the repository
git clone https://github.com/mcdeeai/tax-logic-core.git
cd tax-logic-core

# Install dependencies
bun install

# Run tests
bun run test

# Run linting
bun run lint

# Check that every published entry point loads in plain Node
bun run check:exports
```

### Prerequisites

- Node.js 20.19+ (for `require()` of ES modules)
- Bun 1.3+

---

## Coding Standards

### 1. Every Function Must Have Documentation

```javascript
/**
 * Calculate the taxable portion of Social Security benefits
 * 
 * LEGAL AUTHORITY: IRC §86
 * IRS REFERENCE: Publication 915, Worksheet 1
 * FORM: 1040, Line 6b
 * 
 * HOW IT WORKS:
 * Up to 85% of Social Security benefits may be taxable,
 * depending on "provisional income" (AGI + tax-exempt interest + 50% of SS)
 * 
 * THRESHOLDS (Single):
 * - Below $25,000: 0% taxable
 * - $25,000 - $34,000: Up to 50% taxable
 * - Above $34,000: Up to 85% taxable
 * 
 * @param {number} benefits - Total Social Security benefits received
 * @param {number} agi - Adjusted Gross Income
 * @param {string} filingStatus - Filing status
 * @returns {number} - Taxable portion of Social Security
 */
function calculateTaxableSocialSecurity(benefits, agi, filingStatus) {
    // ... implementation
}
```

### 2. IRS Citations Are Required

For any tax calculation, include:
- IRC section (e.g., `IRC §199A`)
- IRS Publication (e.g., `Publication 535`)
- Form/Line number when applicable (e.g., `Form 8995`)
- Treasury Regulation if relevant (e.g., `Treas. Reg. §1.199A-1`)

### 3. Use Constants for Tax Parameters

```javascript
// ✅ GOOD - Easy to update annually
const STANDARD_DEDUCTION_SINGLE_2025 = 15700;

// ❌ BAD - Magic number buried in code
const deduction = income * 0.22 + 15700;
```

### 4. Handle Edge Cases Explicitly

```javascript
// ✅ GOOD - Edge cases are clear
if (income <= 0) return 0;
if (income > MAX_TAXABLE_INCOME) income = MAX_TAXABLE_INCOME;

// ❌ BAD - Unclear behavior at edges
return income * rate;
```

### 5. No Tax Advice in Code

```javascript
// ✅ GOOD - Factual, not advisory
// This calculates the potential QBI deduction under IRC §199A

// ❌ BAD - Sounds like advice
// You should take the QBI deduction to save money
```

---

## Submitting Changes

### Pull Request Process

1. **Fork** the repository
2. **Create a branch** (`git checkout -b feature/add-schedule-a`)
3. **Make changes** following our coding standards
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Run tests** (`bun run test`)
7. **Submit PR** with clear description

### PR Title Format

```
[TYPE] Brief description

Types:
- [FIX] Bug fixes or calculation corrections
- [FEAT] New features
- [DOCS] Documentation only
- [TEST] Adding tests
- [REFACTOR] Code cleanup
```

### PR Description Template

```markdown
## Summary
Brief description of changes

## Tax Authority
- IRC Section: §XXX
- Publication: XXX
- Form/Line: XXX

## Testing
- [ ] Added unit tests
- [ ] Tested with sample scenarios
- [ ] Edge cases considered

## Checklist
- [ ] Code has IRS citations
- [ ] Documentation updated
- [ ] No hardcoded magic numbers
- [ ] Tests pass
```

---

## Reporting Bugs

### Calculation Error Report

```markdown
**Describe the error**
The QBI deduction calculation returns incorrect results for SSTB income.

**Expected behavior**
Based on IRC §199A and Publication 535, the calculation should...

**Actual behavior**
The code returns $X when it should return $Y

**Test case**
```javascript
const form = {
    scheduleC: { netProfit: 100000 },
    filingStatus: 'single',
    // ... additional fields
};
// Expected QBI: $15,000
// Actual: $20,000
```

**IRS Source**
- Publication 535, Chapter 12
- Form 8995-A Instructions, Worksheet 1
```

---

## IRS Citation Guidelines

### Where to Find Authoritative Sources

1. **Internal Revenue Code (IRC)**: The law itself
   - https://uscode.house.gov/browse/prelim@title26
   
2. **Treasury Regulations**: Detailed rules interpreting the IRC
   - https://www.ecfr.gov/current/title-26
   
3. **IRS Publications**: Plain-English explanations
   - https://www.irs.gov/forms-pubs
   
4. **IRS Forms and Instructions**: Implementation details
   - https://www.irs.gov/forms-instructions

### Citation Format

```javascript
/**
 * LEGAL AUTHORITY: IRC §199A(a)
 * TREASURY REGULATION: Treas. Reg. §1.199A-1 through §1.199A-6
 * IRS PUBLICATION: Publication 535 - Business Expenses (Chapter 12)
 * FORM: Form 8995 (simple) or Form 8995-A (complex)
 */
```

### 2025 OBBBA (One Big Beautiful Bill Act) References

The 2025 tax law made significant changes. When referencing OBBBA:

```javascript
/**
 * LEGAL AUTHORITY: IRC §XXX (as amended by OBBBA 2025)
 * EFFECTIVE: Tax years beginning after December 31, 2024
 * CHANGE: [Description of what changed]
 * PREVIOUS LAW: [Description of prior law if relevant]
 */
```

---

## Annual Updates

Tax law parameters change annually. If you're updating for a new tax year:

1. Update all threshold/bracket amounts
2. Update the `TAX_YEAR` constant
3. Reference the appropriate Rev. Proc. for inflation adjustments
4. Update test cases with new expected values
5. Update documentation dates

---

## Questions?

- **General questions**: Open a Discussion on GitHub
- **Specific bugs**: Open an Issue
- **Security issues**: Email directly (do not open public issue)

Thank you for helping make tax calculations transparent and accessible! 🎉
