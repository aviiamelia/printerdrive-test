export interface bcryptAdapterInterface {
  hash: (password: string) => string;
  compare: (dbPassword: string, valuePassword: string) => boolean;
}
