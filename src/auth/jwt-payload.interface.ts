// auth/jwt-payload.interface.ts

export interface JwtPayload {
    username: string;
    sub: string; // Subject (usually the user ID)
    role: string;
    // You can add more fields as needed, such as roles or permissions
  }
  