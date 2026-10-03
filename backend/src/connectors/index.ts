import { mapProviderToCanonical, NormalizedStatusResult } from '../gateway/canonicalStatusMapper';
import { parseXmlToJson } from '../utils/helpers';

export interface ConnectorResponse {
  success: boolean;
  externalRef: string;
  providerStatus: string;
  normalized: NormalizedStatusResult;
  data?: any;
  error?: string;
  rawPayload?: any;
}

// 1. Mock e-District Income Certificate Adapter (REST / JSON - MOCK_SIMULATION)
export const submitEdistrictIncomeCertificate = async (
  formData: any,
  simulateFailure: boolean = false
): Promise<ConnectorResponse> => {
  if (simulateFailure) {
    const externalRef = `SETU-ED-${Date.now().toString().slice(-5)}`;
    const normalized = mapProviderToCanonical({
      providerStatus: 'TIMEOUT',
      sourceConnector: 'Mock e-District Income Certificate Adapter',
      integrationType: 'MOCK_SIMULATION',
      externalRef,
      rawMessage: 'Gateway timeout while connecting to e-District Tahsildar node.'
    });
    return {
      success: false,
      externalRef,
      providerStatus: 'TIMEOUT',
      normalized,
      error: 'Simulated endpoint timeout (resilience test)'
    };
  }

  const randomRefNum = Math.floor(10000 + Math.random() * 90000);
  const externalRef = `SETU-ED-2026-${randomRefNum}`;
  const providerStatus = 'RECEIVED';
  
  const normalized = mapProviderToCanonical({
    providerStatus,
    sourceConnector: 'Mock e-District Income Certificate Adapter',
    integrationType: 'MOCK_SIMULATION',
    externalRef,
    rawMessage: 'Application logged with e-District Revenue Portal. Assigned to Tahsildar verification queue.'
  });

  return {
    success: true,
    externalRef,
    providerStatus,
    normalized,
    data: {
      applicationNumber: externalRef,
      assignedOfficer: 'Tahsildar (Zone 4)',
      expectedSlaDays: 7,
      acknowledgementToken: `ACK-ED-${randomRefNum}`
    }
  };
};

// 2. Mock Scholarship Service Adapter (REST / JSON - MOCK_SIMULATION)
export const submitScholarshipApplication = async (
  formData: any,
  simulateFailure: boolean = false
): Promise<ConnectorResponse> => {
  if (simulateFailure) {
    const externalRef = `SETU-SCH-${Date.now().toString().slice(-5)}`;
    const normalized = mapProviderToCanonical({
      providerStatus: 'CONNECTOR_OFFLINE',
      sourceConnector: 'Mock Scholarship Gateway',
      integrationType: 'MOCK_SIMULATION',
      externalRef,
      rawMessage: 'Scholarship DB synchronization offline.'
    });
    return {
      success: false,
      externalRef,
      providerStatus: 'CONNECTOR_OFFLINE',
      normalized,
      error: 'Simulated connector offline'
    };
  }

  const randomRefNum = Math.floor(10000 + Math.random() * 90000);
  const externalRef = `SETU-SCH-2026-${randomRefNum}`;
  const providerStatus = 'RECEIVED';

  const normalized = mapProviderToCanonical({
    providerStatus,
    sourceConnector: 'Mock Scholarship Gateway',
    integrationType: 'MOCK_SIMULATION',
    externalRef,
    rawMessage: 'Application registered with Higher Education Scholarship Portal.'
  });

  return {
    success: true,
    externalRef,
    providerStatus,
    normalized,
    data: {
      scholarshipApplicationId: externalRef,
      verifiedIncome: formData.annualIncome || 140000,
      sanctionAmountEstimate: 'Rs. 35,000 / Academic Year',
      verificationStatus: 'Pending College Principal Endorsement'
    }
  };
};

// 3. Mock Municipal Birth Certificate (SOAP / XML Response - MOCK_SIMULATION)
export const submitMunicipalBirthRegistration = async (
  formData: any,
  simulateFailure: boolean = false
): Promise<ConnectorResponse> => {
  if (simulateFailure) {
    const externalRef = `SETU-MNC-${Date.now().toString().slice(-5)}`;
    const normalized = mapProviderToCanonical({
      providerStatus: 'FAILED_SYNC',
      sourceConnector: 'Mock Municipal Vital Statistics SOAP Connector',
      integrationType: 'MOCK_SIMULATION',
      externalRef,
      rawMessage: 'SOAP endpoint host unreachable.'
    });
    return {
      success: false,
      externalRef,
      providerStatus: 'FAILED_SYNC',
      normalized,
      error: 'Simulated SOAP connection failure'
    };
  }

  const randomRefNum = Math.floor(10000 + Math.random() * 90000);
  const externalRef = `SETU-MNC-2026-${randomRefNum}`;

  // Mock legacy XML SOAP Response Payload
  const rawXmlResponse = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Body>
        <BirthCertificateResponse xmlns="http://municipal.gov.in/vitalstats">
          <RegistrationNo>${externalRef}</RegistrationNo>
          <Status>RECEIVED</Status>
          <OfficerRemarks>Vital Statistics Registrar pending digital signature</OfficerRemarks>
          <StatusCode>200_OK</StatusCode>
        </BirthCertificateResponse>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  // Normalize XML -> JSON
  const jsonParsed = await parseXmlToJson(rawXmlResponse);
  const body = jsonParsed['soapenv:Envelope']['soapenv:Body']['BirthCertificateResponse'];
  const providerStatus = body.Status;

  const normalized = mapProviderToCanonical({
    providerStatus,
    sourceConnector: 'Mock Municipal Vital Statistics SOAP Connector',
    integrationType: 'MOCK_SIMULATION',
    externalRef,
    rawMessage: `Legacy XML SOAP Normalized: ${body.OfficerRemarks}`
  });

  return {
    success: true,
    externalRef,
    providerStatus,
    normalized,
    rawPayload: rawXmlResponse,
    data: {
      registrationNo: body.RegistrationNo,
      status: body.Status,
      remarks: body.OfficerRemarks
    }
  };
};

// 4. Data.gov.in Open Data Connector (PUBLIC_OPEN_DATA)
export const fetchPublicOpenDataCatalog = async (category: string = 'all') => {
  // Public non-personal datasets list simulation
  return {
    source: 'data.gov.in (Open Government Data Platform India)',
    integrationType: 'PUBLIC_OPEN_DATA',
    disclaimer: 'Non-personal public datasets only. Compliant with NDSAP policy.',
    catalog: [
      {
        id: 'ds-01',
        title: 'District-wise Beneficiary Disbursal Statistics 2025-26',
        format: 'JSON',
        lastUpdated: '2026-09-15',
        totalRecords: 48500
      },
      {
        id: 'ds-02',
        title: 'State Welfare Scheme Eligibility Thresholds & Criteria',
        format: 'CSV / REST',
        lastUpdated: '2026-08-01',
        totalRecords: 120
      },
      {
        id: 'ds-03',
        title: 'Empaneled Higher Education Institutions Directory',
        format: 'JSON',
        lastUpdated: '2026-09-30',
        totalRecords: 1420
      }
    ]
  };
};

// 5. DigiLocker Simulator Connector (MOCK_SIMULATION)
export const fetchDigiLockerMockDocuments = async (prototypeCitId: string) => {
  return {
    source: 'DigiLocker Mock OAuth Connector',
    integrationType: 'MOCK_SIMULATION',
    disclaimer: 'Mock simulation - NOT a live connection to DigiLocker',
    userRef: prototypeCitId,
    availableDocuments: [
      {
        documentType: 'INCOME_CERTIFICATE',
        issuer: 'Department of Revenue',
        issuedDate: '2025-04-10',
        uri: `mock://digilocker/income_cert_${prototypeCitId}.pdf`,
        checksum: 'a8f5f167f44f4964e6c998dee827110c'
      },
      {
        documentType: 'MARKS_MEMO',
        issuer: 'Board of Secondary & Higher Education',
        issuedDate: '2023-06-15',
        uri: `mock://digilocker/marks_memo_${prototypeCitId}.pdf`,
        checksum: 'b9e4d156f33e3853d5b887cee716000b'
      },
      {
        documentType: 'RATION_CARD',
        issuer: 'Civil Supplies Department',
        issuedDate: '2022-01-20',
        uri: `mock://digilocker/ration_card_${prototypeCitId}.pdf`,
        checksum: 'c0f3e245a22d2742c4a776bdd605999a'
      }
    ]
  };
};
