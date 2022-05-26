interface UserPayload {
  id: string;
  email: string;
}

declare namespace Express {
  export interface Request {
    currentUser?: UserPayload;
  }
}
