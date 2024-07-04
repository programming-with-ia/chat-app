import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

// export { auth as middleware } from "@/auth"
export const middleware = NextAuth(authOptions);