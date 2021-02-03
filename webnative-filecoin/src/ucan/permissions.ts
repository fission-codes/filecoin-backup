import * as ucanPermissions from 'webnative/ucan/permissions';

export type Permissions =
  ucanPermissions.Permissions &
  {
    keychain?: KeychainPermissions;
  };

export type KeychainPermissions = {
  keychainPaths: string[];};
