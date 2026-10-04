import { safeJsonParse, parseXmlToJson } from '../utils/helpers';
import { mapProviderToCanonical } from '../gateway/canonicalStatusMapper';

describe('SETU Backend Utility & Gateway Helper Tests', () => {
  test('safeJsonParse parses valid JSON and returns fallback on invalid JSON', () => {
    expect(safeJsonParse('{"key":"value"}')).toEqual({ key: 'value' });
    expect(safeJsonParse('invalid json', { fallback: true })).toEqual({ fallback: true });
  });

  test('parseXmlToJson correctly parses SOAP XML string to object', async () => {
    const xml = '<root><name>SETU Gateway</name></root>';
    const result = await parseXmlToJson(xml);
    expect(result).toEqual({ root: { name: 'SETU Gateway' } });
  });

  test('mapProviderToCanonical handles REJECTED and COMPLETED provider statuses', () => {
    const rejected = mapProviderToCanonical({
      providerStatus: 'REJECTED',
      sourceConnector: 'Test',
      integrationType: 'MOCK',
      externalRef: 'REF1'
    });
    expect(rejected.canonicalStatus).toBe('REJECTED');

    const completed = mapProviderToCanonical({
      providerStatus: 'COMPLETED',
      sourceConnector: 'Test',
      integrationType: 'MOCK',
      externalRef: 'REF2'
    });
    expect(completed.canonicalStatus).toBe('COMPLETED');
  });
});
