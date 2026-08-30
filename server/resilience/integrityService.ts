import crypto from 'crypto';

export const generateChecksum = (data: any): string => {
  // Canonical representation: stringify sorted keys
  const canonical = typeof data === 'object' && data !== null
    ? JSON.stringify(data, Object.keys(data).sort())
    : String(data);
  return crypto.createHash('sha256').update(canonical).digest('hex');
};

export const verifyChecksum = (data: any, expectedChecksum: string): boolean => {
  const actualChecksum = generateChecksum(data);
  return actualChecksum === expectedChecksum;
};
