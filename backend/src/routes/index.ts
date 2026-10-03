import { Router } from 'express';
import { traceIdMiddleware } from '../utils/helpers';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware';

import * as authCtrl from '../controllers/authController';
import * as profileCtrl from '../controllers/profileController';
import * as servicesCtrl from '../controllers/servicesController';
import * as eligibilityCtrl from '../controllers/eligibilityController';
import * as documentsCtrl from '../controllers/documentsController';
import * as consentCtrl from '../controllers/consentController';
import * as appCtrl from '../controllers/applicationsController';
import * as grievanceCtrl from '../controllers/grievancesController';
import * as adminCtrl from '../controllers/adminController';

const router = Router();
router.use(traceIdMiddleware);

// Auth Routes
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.post('/auth/logout', authCtrl.logout);
router.post('/auth/verify-aadhaar', authCtrl.verifyAadhaar);
router.get('/auth/me', authenticateToken, authCtrl.getMe);

// Profile Routes
router.get('/profile', authenticateToken, profileCtrl.getProfile);
router.patch('/profile', authenticateToken, profileCtrl.updateProfile);

// Services Catalog & Open Data
router.get('/services', servicesCtrl.getAllServices);
router.get('/services/recommendations', servicesCtrl.getServiceRecommendations);
router.get('/services/open-data', servicesCtrl.getPublicDatasets);
router.get('/services/:id', servicesCtrl.getServiceById);

// Eligibility Check
router.post('/eligibility/check', eligibilityCtrl.checkEligibility);

// Documents Vault
router.get('/documents', authenticateToken, documentsCtrl.getDocuments);
router.post('/documents', authenticateToken, documentsCtrl.uploadMockDocument);
router.delete('/documents/:id', authenticateToken, documentsCtrl.deleteDocument);
router.get('/documents/digilocker', authenticateToken, documentsCtrl.getDigiLockerMockDocs);

// Consent Records
router.post('/consents', authenticateToken, consentCtrl.grantConsent);
router.get('/consents', authenticateToken, consentCtrl.getConsents);
router.post('/consents/:id/revoke', authenticateToken, consentCtrl.revokeConsent);

// Application Submissions & Gateway Interoperability
router.post('/applications', authenticateToken, appCtrl.submitApplication);
router.get('/applications', authenticateToken, appCtrl.getApplications);
router.get('/applications/track', appCtrl.trackByReference);
router.get('/applications/:id', authenticateToken, appCtrl.getApplicationById);
router.post('/applications/:id/refresh-status', authenticateToken, appCtrl.refreshStatus);

// Grievances
router.post('/grievances', authenticateToken, grievanceCtrl.lodgeGrievance);
router.get('/grievances', authenticateToken, grievanceCtrl.getGrievances);

// Admin & Health Monitoring (Requires ADMIN role)
router.get('/admin/apis', authenticateToken, requireRole(['ADMIN']), adminCtrl.getApiRegistries);
router.patch('/admin/apis/:id', authenticateToken, requireRole(['ADMIN']), adminCtrl.toggleFailureSimulation);
router.get('/admin/connectors/health', authenticateToken, requireRole(['ADMIN']), adminCtrl.getHealthMetrics);
router.get('/admin/audit-logs', authenticateToken, requireRole(['ADMIN']), adminCtrl.getAuditLogs);

export default router;
