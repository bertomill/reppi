// NextAuth.js authentication route handler for API endpoints
import NextAuth from "next-auth";
import { authOptions } from "@/features/auth/api/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 