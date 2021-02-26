const message = require('./message');
  // messageDigestLotusMessage,
  // serializeLotusMessage,
  // InvalidLotusMessage,
  // LotusMessage,
  // MessageDigestBytes } from './message';
// import { BigNumber } from 'bignumber.js';
const fs = require('fs');
const t = require('chai');

// load test data
const incompleteBaseLotusMessagObject = {
  // version: 0,
  to: 't03832874859695014541',
  from: 't1pyfq7dg6sq65acyomqvzvbgwni4zllglqffw5dy',
  nonce: 10,
  value: '11416382733294334924',
  method: 0,
  gasFeeCap: '1',
  gasPremium: '1',
  gasLimit: 123,
  params: ''
}

const testVectorMessages = JSON.parse(
  fs.readFileSync('./test-vectors/filecoin/messages.json').toString());

t.describe('constructing a Lotus Message', () => {
  t.describe('valid structures should cast', () => {
    t.it('should construct valid Lotus Message', () => {
      t.assert.isObject(message.castToLotusMessage(testVectorMessages[0].message),
        'expected valid Lotus Message');
    });
  });

  t.describe('invalid structures should fail', () => {
    t.it('should fail if version is not 0', () => {
      t.assert.throws((): void => {
        message.castToLotusMessage(incompleteBaseLotusMessagObject)
        }, Error, 'version is a required field and has to be a number');
    });
  });
});

// describe('serialize a Lotus Message', () => {
//   it('should serialize a Lotus Message', () => {
//     pipe(castToLotusMessage(testVectorMessages[0].message), fold(
//       (_error: InvalidLotusMessage): void => {
//         assert(false, 'expected valid Lotus Message');
//       },
//       (lotusMessage: LotusMessage): void => {
//         pipe(serializeLotusMessage(lotusMessage), fold(
//           (e: Error): void => {
//             assert(false, 'expected serialization;' + e.message);
//           },
//           (serialised: string): void => {
//             assert(serialised === testVectorMessages[0].cbor, 'failed to match serialisation');
//           }));
//       }));
//   });
// });


// describe('message digest of a Lotus Message', () => {
//   it('should marshal and return correct digest', () => {
//     pipe(castToLotusMessage(testVectorMessages[1].message), fold(
//       (_error: InvalidLotusMessage): void => {
//         assert(false, 'expected valid Lotus Message');
//       },
//       (lotusMessage: LotusMessage): void => {
//         pipe(messageDigestLotusMessage(lotusMessage), fold(
//           (e: Error): void => {
//             assert(false, 'expected digest');
//           },
//           (digest: MessageDigestBytes): void => {
//             assert(
//               (Buffer.from(digest)).toString('hex') === testVectorMessages[1].digest,
//               'failed to match digest');
//           }
//         ));
//       }
//     ));
//   });
// });
