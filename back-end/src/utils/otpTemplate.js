const otpTemplate = (otp, appName = "NEXARO") => {
    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification</title>
  </head>

  <body style="
    margin:0;
    padding:0;
    background-color:#f4f7fb;
    font-family:Arial, Helvetica, sans-serif;
  ">

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding:40px 16px;">

          <table width="100%" cellpadding="0" cellspacing="0" border="0"
            style="
              max-width:520px;
              background:#ffffff;
              border-radius:18px;
              overflow:hidden;
              box-shadow:0 4px 20px rgba(0,0,0,0.08);
            "
          >

            <!-- Header -->
            <tr>
              <td style="
                background:#111827;
                padding:32px 40px;
                text-align:center;
              ">
                <h1 style="
                  margin:0;
                  color:#ffffff;
                  font-size:28px;
                  letter-spacing:1px;
                ">
                  ${appName}
                </h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:40px;">

                <p style="
                  margin:0 0 12px;
                  color:#111827;
                  font-size:24px;
                  font-weight:700;
                ">
                  Verify your email
                </p>

                <p style="
                  margin:0 0 28px;
                  color:#6b7280;
                  font-size:15px;
                  line-height:1.7;
                ">
                  Use the verification code below to complete your sign up procedure.
                  This code will expire in 10 minutes.
                </p>

                <!-- OTP BOX -->
                <div style="
                  background:#f3f4f6;
                  border:1px solid #e5e7eb;
                  border-radius:14px;
                  padding:22px;
                  text-align:center;
                  margin-bottom:28px;
                ">
                  <span style="
                    font-size:36px;
                    font-weight:800;
                    color:#111827;
                    letter-spacing:10px;
                  ">
                    ${otp}
                  </span>
                </div>

                <p style="
                  margin:0 0 16px;
                  color:#6b7280;
                  font-size:14px;
                  line-height:1.7;
                ">
                  If you did not request this code, you can safely ignore this email.
                </p>

                <hr style="
                  border:none;
                  border-top:1px solid #e5e7eb;
                  margin:32px 0 20px;
                " />

                <p style="
                  margin:0;
                  color:#9ca3af;
                  font-size:12px;
                  text-align:center;
                  line-height:1.6;
                ">
                  © ${new Date().getFullYear()} ${appName}. All rights reserved.
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};

export default otpTemplate;