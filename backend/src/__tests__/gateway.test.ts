import { mapProviderToCanonical } from '../gateway/canonicalStatusMapper';

describe('SETU Canonical Status Gateway Mapper', () => {
  test('maps RECEIVED to SUBMITTED', () => {
    const result = mapProviderToCanonical({
      providerStatus: 'RECEIVED',
      sourceConnector: 'Mock e-District Adapter',
      integrationType: 'MOCK_SIMULATION',
      externalRef: 'SETU-ED-2026-00045'
    });
    expect(result.canonicalStatus).toBe('SUBMITTED');
  });

  test('maps PENDING_TAHSILDAR to UNDER_REVIEW', () => {
    const result = mapProviderToCanonical({
      providerStatus: 'PENDING_TAHSILDAR',
      sourceConnector: 'Mock e-District Adapter',
      integrationType: 'MOCK_SIMULATION',
      externalRef: 'SETU-ED-2026-00045'
    });
    expect(result.canonicalStatus).toBe('UNDER_REVIEW');
  });

  test('maps TIMEOUT to FAILED_SYNC with pending synchronization message', () => {
    const result = mapProviderToCanonical({
      providerStatus: 'TIMEOUT',
      sourceConnector: 'Mock e-District Adapter',
      integrationType: 'MOCK_SIMULATION',
      externalRef: 'SETU-ED-2026-00045'
    });
    expect(result.canonicalStatus).toBe('FAILED_SYNC');
    expect(result.statusMessage).toContain('Pending synchronization');
  });

  test('maps SANCTIONED to APPROVED', () => {
    const result = mapProviderToCanonical({
      providerStatus: 'SANCTIONED',
      sourceConnector: 'Mock Scholarship Gateway',
      integrationType: 'MOCK_SIMULATION',
      externalRef: 'SETU-SCH-2026-00108'
    });
    expect(result.canonicalStatus).toBe('APPROVED');
  });
});
