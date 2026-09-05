export async function generateAccessToken(retries = 2) {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Connection: 'close',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error_description || data.message || 'Failed to obtain PayPal access token');
      }
      return data.access_token;
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`generateAccessToken attempt ${attempt} failed (${err.message}). Retrying...`);
      await new Promise(r => setTimeout(r, 500));
    }
  }
}