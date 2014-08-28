if (process.argv[2]) {
  console.log('Decoded license contents: ',
              require('../lib/license')(process.argv[2]));
} else {
  console.log('STRONG_AGENT_LICENSE="%s"',
              require('./helpers').longTestLicense());
}
