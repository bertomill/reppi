// NextAuth.js authentication route handler for API endpoints
import NextAuth from "next-auth";
import { authOptions } from "@/features/auth/api/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 

// What does authOptions do?
// authOptions is an object that contains the configuration for the authentication process.
// It includes the providers, callbacks, and other settings for the authentication process.
// It is used to initialize the NextAuth instance.
// It is also used to define the routes for the authentication process.
// It is used to define the session strategy for the authentication process.
