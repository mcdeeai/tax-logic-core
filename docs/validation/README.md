# 2025 Assumption Validation

An audit of every tax assumption encoded in this repository against primary sources for **tax year 2025**. It covers rates, thresholds, limits, phase-outs, eligibility rules, where each computation sits on the return, and legal citations. It is the baseline for the fix work that follows. No code was changed in this audit.

Audit date: 2026-10-14. Base commit: `f54bd1e`.

## Results

1,504 assumptions checked. **46% are correct as coded.** 14% have the wrong value, and 35% have the right value applied the wrong way.

| Area | Rows | CORRECT | WRONG | MISAPPLIED | MISSING-GATE | STALE-COMMENT | UNVERIFIED | Researcher |
|---|---|---|---|---|---|---|---|---|
| [Core engine (calculateTax.js, policy.js)](ledgers/core-engine.md) | 219 | 124 | 14 | 71 | 4 | 6 | 0 | gpt-6.1-sol |
| [Federal optimizers: retirement, self-employment, deductions, credits, filing status, orchestrator](ledgers/federal-optimizers-income-deductions-credits.md) | 234 | 96 | 30 | 89 | 8 | 0 | 11 | gpt-6.1-sol |
| [Federal optimizers: capital gains, AMT, K-1, Augusta, crypto, real estate professional, international](ledgers/federal-optimizers-investment-amt-international.md) | 280 | 137 | 16 | 104 | 3 | 1 | 19 | gpt-6.1-sol |
| [State income tax rates (stateTaxRates.js)](ledgers/state-tax-rates.md) | 102 | 34 | 28 | 39 | 0 | 1 | 0 | gpt-6.1-sol |
| [State credits, 529 plans, retirement exclusions, community property, stateOptimizer.js](ledgers/state-credits-529-retirement-community-property.md) | 398 | 181 | 79 | 130 | 2 | 6 | 0 | gpt-6.1-sol |
| [State pass-through entity tax (statePTETOptimizer.js)](ledgers/state-ptet.md) | 214 | 90 | 41 | 80 | 2 | 1 | 0 | gpt-6.1-sol |
| [Citations and docs (taxAuthority.js, testProfiles.js, README, ARCHITECTURE)](ledgers/citations-and-docs.md) | 57 | 26 | 4 | 13 | 11 | 2 | 1 | gpt-6-luna |
| **Total** | **1,504** | **688** | **212** | **526** | **30** | **17** | **31** | |

Counts are ledger rows. One provision can produce several rows: one for its value, one for how it's applied, and one for its policy gate.

### Status definitions

- **CORRECT**: matches the 2025 primary source.
- **WRONG**: the value is wrong. Usually a 2024 figure that was never updated, or a pre-OBBBA figure.
- **MISAPPLIED**: the value is right but used wrongly: the wrong income base, the wrong place on the return, a missing phase-out, or the wrong filing status.
- **MISSING-GATE**: the value should depend on `useObbba2025` but doesn't.
- **STALE-COMMENT**: the code is right but its comment is wrong.
- **UNVERIFIED**: no primary source found. Most of these are the optimizers' own planning heuristics, not tax law.

## Most material findings

Each item links to its ledger, which has the exact location, the value in the code, the correct value and the source.

**Core engine: these errors affect every result**
1. **Capital gains rate bands overlap.** `calculateCapitalGainsTax` lets gains count in more than one band. $600,000 of long-term gains with no ordinary income comes out at $93,330; the Schedule D worksheet gives $86,077.50. Short-term losses also don't reduce the amount taxed at the preferential rates.
2. **The OBBBA deductions reduce AGI.** Tips, overtime, car-loan interest and the senior deduction are treated as adjustments to income. They belong after AGI (Schedule 1-A), so AGI and everything that depends on it (NIIT, the medical floor, phase-outs) is understated. The MFJ overtime cap should be $25,000, and the phase-outs don't follow the statute.
3. **Nonrefundable credits reduce SE tax and NIIT.** They may only reduce income tax.
4. **The standard deduction matches neither law.** The code has $15,700 / $31,400 / $23,500. The 2025 amounts are $15,750 / $31,500 / $23,625 under OBBBA and $15,000 / $30,000 / $22,500 before it, and the policy flag doesn't switch them.
5. **The Child Tax Credit is $2,000.** OBBBA sets it at $2,200, and the code has no phase-out and no refundable part (ACTC).
6. **K-1 partnership and S-Corp income is never added to income,** but it still produces a QBI deduction.
7. **Smaller errors:** the MFS 20% capital-gains breakpoint ($300,025 should be $300,000); the qualifying-surviving-spouse Additional Medicare threshold ($250k should be $200k); the deductible half of SE tax includes Additional Medicare; there is no SALT cap phase-down; and the senior age test uses the date the code runs.

**Federal optimizers: many figures are 2024 values that were never updated**
- The SEP and solo 401(k) cap is $69,000; it should be $70,000. SEP uses 25% of profit when the self-employed rate is effectively 20%.
- The 2025 saver's-credit, EITC and QBI threshold tables are all off.
- The Section 179 limit is $1,220,000. It should be $2,500,000 under OBBBA and $1,250,000 before it. Bonus depreciation is not gated by the policy flag.
- AMT uses 2024 phase-out thresholds ($609,350 / $1,218,700 instead of $626,350 / $1,252,700) and a 2024 28% breakpoint ($232,600 instead of $239,100). It also omits add-backs and compares against regular tax incorrectly.
- International: the housing exclusion can reach $39,000 instead of $18,200, foreign tax credit limits are not applied, and FBAR penalty amounts are out of date.
- Several analyzers (CTC, EITC, education, dependent care) return placeholders. Savings from overlapping strategies are added together as if they were independent.

**State**
- 26 of 51 state/DC rate schedules have wrong values. They miss 2025 changes: Iowa and Louisiana went flat, and Georgia, Indiana, Idaho, Utah, Hawaii, New Mexico, Nebraska, Ohio and South Carolina changed rates. Other schedules are right but applied wrongly: Mississippi's zero band, Ohio's base taxes, and the Connecticut and New York recapture are missing, and any filing status other than married or widow is taxed as single.
- Washington capital gains uses the 2024 $270,000 deduction (2025: $278,000) and applies the new 2.9% tier in the wrong order.
- PTET: rates are wrong for NJ, GA, MD, WI, NC, OR and SC, and Connecticut is wrongly marked mandatory. The federal savings ignore the policy flag, filing status and the SALT cap phase-down. Under the enacted OBBBA, qualifying PTET payments remain outside the individual SALT cap for 2025.
- Credits and retirement exclusions: California's EITC helper returns the maximum credit with no eligibility check, the Massachusetts and Vermont child credits return 0, South Carolina's under-65 path returns `NaN`, and New York's pension deduction is never applied.

**Docs:** the README calls `useObbba2025: false` "current law", but OBBBA is enacted law for 2025, so false is really a pre-OBBBA comparison scenario.

## Decisions needed before fixing

The ledgers raise these product questions. The answers change what "correct" means for many rows.

1. **Estimator or return-equivalent?** Return-equivalent requires IRS tax tables and rounding, AMT, ACTC, Additional Medicare tax on wages, and per-spouse data. An estimator can document what it leaves out instead.
2. **Input contract.** Are fields like mortgage interest, charitable gifts and K-1 income raw amounts or already-limited form amounts? Are `scheduleK1.ordinaryIncome`, `partnershipIncome` and `sCorpIncome` separate streams or the same income described differently? Are tips and overtime already included in wages?
3. **Meaning of the policy flag.** `useObbba2025: false` should change only the federal provisions OBBBA changed. It must not undo state laws passed independently for 2025.
4. **Meaning of optimizer savings.** Illustrative screens, or amounts the engine actually recomputes? Right now overlapping estimates are summed and labelled "optimized tax".
5. **Which source version wins.** Some state sites contradict their own dated 2025 instructions (NJ BAIT, the CA renter's credit limit, Vermont). Proposed rule: the dated 2025 form instructions take precedence.

## Method

1. **Scope:** every file in `src/` plus `README.md` and `ARCHITECTURE.md`, split into the seven areas above. Each researcher read its files in full and listed every assumption with its file and line.
2. **Sources:** primary sources first: Rev. Proc. 2024-40, Public Law 119-21 (OBBBA), IRS notices and OBBBA guidance, Notice 2024-80, 2025 IRS forms, instructions and publications, SSA, the IRC text, and state revenue departments' 2025 instructions and statutes. Rows that rely on a secondary source say so.
3. **Researchers:** Codex models with live web search, running read-only. The first pass of the three state areas (gpt-6-luna) left 39 of 126 rows unverified, so all three were redone on gpt-6.1-sol with a one-row-per-state requirement (0 unverified). The citations area stayed on gpt-6-luna because its output met the bar.
4. **Review:** Claude Opus 5.5 checked the federal WRONG rows against the 2025 figures (standard deductions, additional standard deductions, CTC, overtime cap, §415(c), saver's credit, EITC, QBI thresholds, §179, AMT, charitable 60% limit, FEIE housing). It also spot-checked the state findings (IA, LA, GA, IN, WA, CA mental health tax). It confirmed the core-engine findings by running the code: capital gains band overlap, short/long-term netting, K-1 income, and deductions reducing AGI.

**Limits:** these ledgers are AI-assisted research. Every WRONG and MISAPPLIED row cites its source and should be read against it before the code is changed. A test with a hand-checked expected value should land with each fix. Nothing here is tax advice.
