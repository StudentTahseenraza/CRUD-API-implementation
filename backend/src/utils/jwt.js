const jwt = require('jsonwebtoken');

class JWTService {
  static generateToken(userId, role) {
    return jwt.sign(
      { 
        id: userId, 
        role: role 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRE,
        issuer: 'auth-api',
        audience: 'client'
      }
    );
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'auth-api',
        audience: 'client'
      });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = JWTService;