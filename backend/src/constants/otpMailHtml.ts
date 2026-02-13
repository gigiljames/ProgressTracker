export function otpMailHtml(name: string, otp: string, body: string) {
  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background-color:#f4f6f9;">
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f9;padding:20px 0;">
    <tr>
      <td align="center">
        
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#2E5AAC;padding:20px;">
              <div style="color:#ffffff;font-size:22px;font-weight:bold;font-family:Arial, Helvetica, sans-serif;">
                Study Progress Tracker
              </div>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="padding:30px 20px 10px 20px;font-family:Arial, Helvetica, sans-serif;">
              <div style="font-size:20px;font-weight:bold;color:#333333;">
                Your One-Time Password (OTP)
              </div>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding:20px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background-color:#1F2937;color:#ffffff;font-size:32px;font-weight:bold;padding:15px 30px;font-family:Arial, Helvetica, sans-serif;letter-spacing:5px;">
                    ${otp}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:20px 30px;font-family:Arial, Helvetica, sans-serif;color:#333333;font-size:14px;line-height:1.6;">
              <p style="margin:0 0 10px 0;">Dear ${name},</p>
              <p style="margin:0 0 10px 0;">${body}</p>
              <p style="margin:0 0 10px 0;">
                This OTP will expire shortly. Please do not share it with anyone.
              </p>
              <p style="margin:20px 0 0 0;">Regards,<br/>Team Study Tracker</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#e5e7eb;padding:15px;font-family:Arial, Helvetica, sans-serif;font-size:12px;color:#555555;">
              This is a system-generated email. Please do not reply.<br/>
              &copy; ${new Date().getFullYear()} Study Tracker. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

  </body>
  </html>
  `;
}
