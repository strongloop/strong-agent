if (process.argv[2]) {
  console.log('Decoded license contents: ',
              require('../lib/license')(process.argv[2]));
} else {
  console.log('STRONGLOOP_LICENSE="%s"',
              require('./helpers').longTestLicense());
}
