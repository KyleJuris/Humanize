const jwt = require('jsonwebtoken');

// If using Supabase HS256 access tokens, supply SUPABASE_JWT_SECRET in env.
// Otherwise swap verification to your IdP / JWKS validation.
function authenticateUser(req, res, next) {
  if (req.method === 'OPTIONS') return res.sendStatus(200);

  const auth = req.headers.authorization || '';
  const [scheme, token] = auth.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Unauthorized', reason: 'missing_or_invalid_authorization_header' });
  }

  try {
    // Choose ONE verification approach:
    // A) Supabase HS256 local verify:
    const secret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'Server misconfigured: missing JWT secret' });
    }
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });

    // Optional issuer/audience checks here if you require them:
    // if (payload.iss !== 'expected_issuer') return res.status(401).json({ error: 'Unauthorized', reason: 'issuer_mismatch' });

    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized', reason: e.name || 'invalid_or_expired_token' });
  }
}

module.exports = { authenticateUser };
