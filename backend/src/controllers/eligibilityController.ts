import { Request, Response } from 'express';
import { sendStandardError } from '../utils/helpers';

export const checkEligibility = async (req: Request, res: Response) => {
  try {
    const { scheme_code, fields = {} } = req.body;

    if (!scheme_code) {
      return sendStandardError(res, 400, 'VALIDATION_ERROR', 'Target scheme code is required');
    }

    const reasons: string[] = [];
    let isEligible = true;
    let schemeTitle = '';
    let benefit = '';

    switch (scheme_code) {
      case 'SCH-POST-01': // Post-Matric Tuition Fee Reimbursement
        schemeTitle = 'Post-Matric Tuition Fee Reimbursement';
        benefit = '100% Tuition Fee Waiver + Annual Maintenance Allowance';
        const incomePost = Number(fields.annual_income || 0);
        const categoryPost = fields.category || 'General';

        if (incomePost > 250000) {
          reasons.push(`Annual family income (Rs. ${incomePost.toLocaleString('en-IN')}) exceeds the statutory limit of Rs. 2,50,000 for fee waiver.`);
        }
        if (categoryPost === 'General/Others' && incomePost > 100000) {
          reasons.push(`General category income limit for special assistance is Rs. 1,00,000.`);
        }
        break;

      case 'SCH-MERIT-02': // National Merit Scholarship
        schemeTitle = 'National Merit Scholarship Scheme';
        benefit = 'Annual Stipend of Rs. 12,000 / Academic Year';
        const marksMerit = Number(fields.marks_percentage || 0);
        const incomeMerit = Number(fields.annual_income || 0);

        if (marksMerit < 80) {
          reasons.push(`Academic score (${marksMerit}%) is below the required 80% merit threshold.`);
        }
        if (incomeMerit > 180000) {
          reasons.push(`Annual family income (Rs. ${incomeMerit.toLocaleString('en-IN')}) exceeds the merit scholarship limit of Rs. 1,80,000.`);
        }
        break;

      case 'AGR-KSN-01': // PM-KISAN Farmer Assistance
        schemeTitle = 'PM-KISAN Financial Support';
        benefit = 'Rs. 6,000 / Year Direct Benefit Transfer in 3 Installments';
        const landSize = Number(fields.land_size || 0);
        const isTaxpayer = fields.is_taxpayer === 'Yes' || fields.is_taxpayer === true;

        if (landSize <= 0) {
          reasons.push('Valid cultivable agricultural landholding reference required.');
        }
        if (isTaxpayer) {
          reasons.push('Income tax paying individuals are ineligible under statutory PM-KISAN guidelines.');
        }
        break;

      case 'HLT-CARD-01': // Universal Health Insurance (PM-JAY)
        schemeTitle = 'Universal Health Insurance Card (PM-JAY)';
        benefit = 'Cashless Hospital Coverage up to Rs. 5 Lakh per Family per Year';
        const rationType = fields.ration_card_type || 'General';

        if (rationType === 'General/None') {
          reasons.push('Priority BPL, AAY (Antyodaya), or SECC beneficiary ration card required.');
        }
        break;

      case 'INC-CERT-01': // Income Certificate Concession
        schemeTitle = 'e-District Income Certificate Concession';
        benefit = 'Official Verified Income Certificate for Statutory Concessions';
        const incomeCert = Number(fields.annual_income || 0);
        if (incomeCert > 800000) {
          reasons.push('Declared income exceeds EWS statutory ceiling of Rs. 8,00,000.');
        }
        break;

      case 'RTO-LIC-01': // Learner Driving License
        schemeTitle = 'Learner Driving License (LLR)';
        benefit = 'Official 6-Month Learner Driving License Permit';
        const age = Number(fields.age || 0);
        const fitnessPassed = fields.fitness_passed === 'Yes' || fields.fitness_passed === true;

        if (age < 18) {
          reasons.push(`Applicant age (${age} years) is below the statutory minimum of 18 years for motor vehicles.`);
        }
        if (!fitnessPassed) {
          reasons.push('Physical fitness & vision declaration form self-certification required.');
        }
        break;

      case 'HSG-APPL-01': // Urban Housing Allotment
        schemeTitle = 'Urban Affordable Housing (PMAY)';
        benefit = 'Subsidized House Allocation & Credit Linked Interest Subsidy';
        const incomeHsg = Number(fields.annual_income || 0);
        const ownsHouse = fields.owns_house === 'Yes' || fields.owns_house === true;

        if (incomeHsg > 600000) {
          reasons.push('Annual income exceeds EWS/LIG category maximum of Rs. 6,00,000.');
        }
        if (ownsHouse) {
          reasons.push('Applicants owning a pucca house anywhere in India are ineligible under PMAY.');
        }
        break;

      default:
        schemeTitle = 'Government Scheme Verification';
        benefit = 'Statutory Benefits Concession';
        const genericIncome = Number(fields.annual_income || 0);
        if (genericIncome > 250000) {
          reasons.push('Family income exceeds statutory scheme threshold.');
        }
    }

    isEligible = reasons.length === 0;

    return res.json({
      isEligible,
      schemeCode: scheme_code,
      schemeTitle,
      benefit,
      reasons: isEligible ? ['All scheme-specific statutory criteria satisfied!'] : reasons
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};
