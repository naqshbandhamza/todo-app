import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// NextAuth needs GET and POST handlers
export { handler as GET, handler as POST };
