<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>MyOCC Login</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f4f4f7; margin:0; padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding: 30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 40px;">
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <h1 style="color: #023473; margin:0;">Welcome to MyOCC App</h1>
            </td>
          </tr>
          <tr>
            <td>
              <p style="font-size:16px; line-height:1.6;">Hello, {{ $userName }}</p>
              <p style="font-size:16px; line-height:1.6;">Your account has been successfully created. Here are your login credentials:</p>
              
              <table cellpadding="0" cellspacing="0" style="margin:20px 0; width:100%; font-size:16px;">
                <tr>
                  <td style="padding:10px; background:#f0f4ff; border-radius:6px;"><strong>ID Number:</strong> {{ $userId }}</td>
                </tr>
                <tr>
                  <td style="padding:10px; background:#f0f4ff; border-radius:6px; margin-top:5px;"><strong>Password:</strong> <span style="font-family: monospace; background:#e8e8e8; padding:2px 6px; border-radius:4px;">{{ $password }}</span></td>
                </tr>
              </table>


              <p align="center">
                <a href="{{ $appLink }}" style="display:inline-block; background-color:#023473; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-size:16px;">
                  Open MyOCC App
                </a>
              </p>

              <p style="font-size:16px; margin-top:30px;">Thank you,<br><strong>MyOCC Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
