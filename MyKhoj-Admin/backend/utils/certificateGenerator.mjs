import mkcert from 'mkcert';
import fs from 'fs';

async function generateCertificate() {
  const ca = await mkcert.createCA({
    organization: 'Vishwaom Tech Sapot Pvt. Ltd.',
    countryCode: 'IN',
    state: 'Gujarat',
    locality: 'Surat',
    validityDays: 365
  });

  const { key, cert } = await mkcert.createCert({
    domains: ['127.0.0.1', 'https://api.mykhoj.org'],
    validityDays: 365,
    caKey: ca.key,
    caCert: ca.cert
  });

  console.log(key);

  // Save the generated key and certificate to files
  fs.writeFileSync('./certificates/private.key.pem', key);
  fs.writeFileSync('./certificates/certificate.pem', cert);
}

generateCertificate();
