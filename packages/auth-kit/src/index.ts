export interface JwtClaims {
  sub: string;
  roles?: string[];
  permissions?: string[];
}
