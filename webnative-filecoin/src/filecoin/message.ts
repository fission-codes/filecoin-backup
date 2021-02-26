import BigNumber from 'bignumber.js';
import { validateAddressString } from '@glif/filecoin-address';
// import { encode } from '@glif/filecoin-address'
import * as cborDag from 'ipld-dag-cbor/src/util';
// TODO: this repo is working but static since 2018; readme refers to https://github.com/vrza/node-blake2
// examine if any value in switching over
import  * as blake from 'blakejs/blake2b.js';
import lowercaseKeys from 'lowercase-keys';
import base32Encode from 'base32-encode';
import {
  BlsPrivateKey,
  BlsPublicKey,
  blsSign,
  blsVerify,
  getPublicKey } from '../crypto/bls12-381/operations';
import { addressStringToBytes, attoFilStringToBytes } from './utils';

// if attoFil strings have decimals, casting should fail either way,
// making this irrelevant for us, but doesn't hurt to be explicit
BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN });

const messageVersion = 0;

// https://github.com/zondax/filecoin-signing-tools/blob/76d6aa81f697566a976a68c2e30803bf2d4bd397/examples/wasm_node/test/utils.js
// const cidPrefix = Buffer.from([0x01, 0x71, 0xa0, 0xe4, 0x02, 0x20]);
const cidPrefix = new Uint8Array([1, 113, 160, 228, 2, 32])

export const secpSignatureType = 0;
export const blsSignatureType = 1;

export type MessageDigestBytes = Uint8Array;

export class InvalidLotusMessage extends Error {}

/**
 * Lotus Message is a base fee message that can be serialised and signed
 * reference https://github.com/filecoin-project/lotus/blob/master/chain/types/message.go#L30
 */
export interface LotusMessage {
  // support version 0 only
  version: number;
  // filecoin address as destination of message
  to: string;
  // filecoin address from which message is sent
  from: string;
  // strict increasing uint64 for each sequential number (TODO: starting with 1?)
  nonce: number;
  // value in attoFil big integer as string
  value: string;
  // gas premium in attoFil big integer as string
  gasPremium: string;
  // gas limit in gas as uint64
  gasLimit: number;
  // gas fee cap in attoFil big integer as string
  gasFeeCap: string;
  // method number as uint64 indication function on actor associated with to address
  method: number;
  // params for function call as bytes
  params: string;
}

/**
 * Signature has a type number and a data string.
 * The type number is
 *   - '0' for secp256k1 signatures
 *   - '1' for BLS12-381 signatures
 *   - '255' (MaxUint8) for unknown signature type
 * The Data string is the bytestring of the signature
 * https://github.com/filecoin-project/go-state-types/blob/95828685f9df463f052a5d42b8f6c2502f873ceb/crypto/signature.go
 */
export interface Signature {
  signatureType: number; // 0 for secp; 1 for bls;
  signatureBytes: Uint8Array; // bytes, map to "data" as string for Filecoin
}

/**
 * Signed Lotus Message combines a Lotus message with a signature.
 */
export interface SignedLotusMessage extends LotusMessage, Signature {};

/**
 * Cast to Lotus Message returns a valid lotus message or throws a construction error.
 */
export const castToLotusMessage = (inputMessage: any): LotusMessage => {
  const rawMessage = lowercaseKeys(inputMessage);

  // checks on version number
  if (!('version' in rawMessage) || typeof rawMessage.version !== 'number') {
    throw new InvalidLotusMessage(
      'version is a required field and has to be a number');
  }
  if (rawMessage.version !== messageVersion) {
    throw new InvalidLotusMessage('version number is not supported');
  }
  // checks on to and from
  if (!('to' in rawMessage) || typeof rawMessage.to !== 'string') {
    throw new InvalidLotusMessage(
      "'to is a required field and has to be a string");
  }
  if (!('from' in rawMessage) || typeof rawMessage.from !== 'string') {
    throw new InvalidLotusMessage(
      "'from' is a required field and has to be a string");
  }
  if (!validateAddressString(rawMessage.to)) {
    throw new InvalidLotusMessage('invalid to address provided');
  }
  if (!validateAddressString(rawMessage.from)) {
    throw new InvalidLotusMessage('invalid from address provided');
  }
  // checks on nonce
  if (!('nonce' in rawMessage) || typeof rawMessage.nonce !== 'number') {
    throw new InvalidLotusMessage(
      "'nonce' is a required field and has to be a number");
  }
  // checks on value
  if (!('value' in rawMessage) || typeof rawMessage.value !== 'string') {
    throw new InvalidLotusMessage(
      "'value' is a required field and has to be a string");
  }
  if (!isValidFilecoinDenomination(rawMessage.value)) {
    throw new InvalidLotusMessage(
      'value must be a positive bignumber and less than maximum Filecoin issuance');
  }
  // checks on gas limit
  if (!('gaslimit' in rawMessage) || typeof rawMessage.gaslimit !== 'number') {
    throw new InvalidLotusMessage(
      'gaslimit is a required field and has to be a number');
  }
  // checks on gas fee cap
  if (!('gasfeecap' in rawMessage) || typeof rawMessage.gasfeecap !== 'string') {
    throw new InvalidLotusMessage(
      'gasfeecap is a required field and has to be a string');
  }
  if (!isValidFilecoinDenomination(rawMessage.gasfeecap)) {
    throw new InvalidLotusMessage(
      'gasfeecap must be a positive bignumber and less than maximum Filecoin issuance');
  }
  // checks on gas premium
  if (!('gaspremium' in rawMessage) || typeof rawMessage.gaspremium !== 'string') {
    throw new InvalidLotusMessage(
      'gaspremium is a required field and has to be a string');
  }
  if (!isValidFilecoinDenomination(rawMessage.gaspremium)) {
    throw new InvalidLotusMessage(
      'gaspremium must be a positive bignumber and less than maximum Filecoin issuance');
  }
  // checks on method
  if (!('method' in rawMessage) || typeof rawMessage.method !== 'number') {
    throw new InvalidLotusMessage('method is a required field and must be a number');
  }
  // checks on params
  if (!('params' in rawMessage) || typeof rawMessage.params !== 'string') {
    throw new InvalidLotusMessage('params is a required field and must be a string');
  }

  // TODO: check addresses to and from are on the same network

  const lotusMessage: LotusMessage = {
    version: rawMessage.version,
    to: rawMessage.to,
    from: rawMessage.from,
    nonce: rawMessage.nonce,
    value: rawMessage.value,
    gasLimit: rawMessage.gaslimit,
    gasFeeCap: rawMessage.gasfeecap,
    gasPremium: rawMessage.gaspremium,
    method: rawMessage.method,
    params: rawMessage.params
  };
  return lotusMessage;
}

/**
 * messageDigestLotusMessage takes a Lotus Message,
 * ipld-dag-cbor serializes it to obtain the digest of the CID bytes,
 * which in turn is hashed to obtain the digest used for signing.
 * Throws an error if either address cannot be serialized correctly.
 */
export const messageDigestLotusMessage =
  (message: LotusMessage): MessageDigestBytes => {
  const Key = null; // optional key, leave null
  const OutputLength = 32; // output length in bytes

  try {
    // can throw if the addresses are invalid and cannot be serialised
    const cborEncodedLotusMessage = serializeLotusMessageBytes(message);

    const blakeCidCtx = blake.blake2bInit(OutputLength, Key);
    // get CID of message by hashing cbor serialisation with blake2b 256bits
    blake.blake2bUpdate(blakeCidCtx, cborEncodedLotusMessage);
    const hashDigest = blake.blake2bFinal(blakeCidCtx);
    const messageCid = Buffer.concat([cidPrefix, hashDigest]);

    const blakeDigestCtx = blake.blake2bInit(OutputLength, Key);
    // signing bytes are the blake2b256 hash digest of the message CID
    blake.blake2bUpdate(blakeDigestCtx, messageCid);
    return blake.blake2bFinal(blakeDigestCtx);
  } catch (e) {
    throw e
  }
}

export const serializeLotusMessage = (lotusMessage: LotusMessage): string => {
  try {
    const serializedBytes: Uint8Array = serializeLotusMessageBytes(lotusMessage);
    return Buffer.from(serializedBytes).toString('hex');
  } catch (e) {
    throw e
  }
}

export const serializeLotusMessageBytes = (lotusMessage: LotusMessage): Uint8Array => {

  let toBytes: Uint8Array;
  try {
    toBytes = addressStringToBytes(lotusMessage.to);
  } catch (e) {
    console.warn('to address could not be serialised')
    throw e
  }

  let fromBytes: Uint8Array;
  try {
    fromBytes = addressStringToBytes(lotusMessage.to);
  } catch (e) {
    console.warn('from address could not be serialised')
    throw e
  }

  const valueBytes = attoFilStringToBytes(lotusMessage.value);
  const gasFeeCapBytes = attoFilStringToBytes(lotusMessage.gasFeeCap);
  const gasPremiumBytes = attoFilStringToBytes(lotusMessage.gasPremium);

  const messageToSerialize = [
    lotusMessage.version,
    toBytes,
    fromBytes,
    lotusMessage.nonce,
    valueBytes,
    lotusMessage.gasLimit,
    gasFeeCapBytes,
    gasPremiumBytes,
    lotusMessage.method,
    Buffer.from(lotusMessage.params, 'base64')
  ]

  return cborDag.serialize(messageToSerialize);
}

// export const verify = async (
//   signedLotusMessage: SignedLotusMessage): Promise<boolean> => {

//   try {
//     const digest: MessageDigestBytes = messageDigestLotusMessage(
//       signedLotusMessage);
//     return blsVerify(signedLotusMessage.signatureBytes, digest,
// // TODO: helper function to get public key bytes from 'from' field
//       signedLotusMessage.from);
//   } catch (e) {
//     return Promise.resolve(false);
//   }
// }

const isValidFilecoinDenomination = (checkString: string): boolean => {
  const valueCheck = new BigNumber(checkString);
  if (valueCheck.isNaN() || !valueCheck.isPositive()) {
    return false;
  }
  // assert the string did not have exponential notation
  if (!(valueCheck.toFixed(0, 1) === checkString)) {
    return false;
  }
  // max issuance is 2.000.000.000 FIL with 18 decimal places
  const maxFilecoin = new BigNumber('2e27');
  if (valueCheck > maxFilecoin) {
    return false;
  }
  return true;
}
