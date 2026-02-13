import { logger } from '../utils/logger';
import { CachingService } from './cachingService';

export class OtpService {
  private _cachingService;
  constructor() {
    this._cachingService = new CachingService();
  }
  generateOtp(email: string, length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    this.storeOtp(otp, email);
    logger.info(otp);
    return otp;
  }
  storeOtp(otp: string, email: string): void {
    this._cachingService.setData(`user-otp-${email}`, otp, 300);
  }
  verifyOtp(otp: string, email: string): boolean {
    return this._cachingService.getData(`user-otp-${email}`) === otp;
  }
}
