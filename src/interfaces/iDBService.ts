export interface iDBService {
  getPhoneNumberId(account_id: string, number: string): Promise<any>;
  getAccountId(username: string, auth_id: string): Promise<any>;
}
