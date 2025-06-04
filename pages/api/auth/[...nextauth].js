// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginFunction } from "@/functions/auth/login";
import { postAPI } from "@/services/fetchAPI";

export const authOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error("Email ve şifre zorunludur.");
        }
        console.log("Attempting to log in with credentials:", { email, password });
        const result = await postAPI("/auth/login", { email, password });
        console.log("Login result:", result);
        const { data } = result;

        const user = {
          role: data.role,
          name: data.name,
          email: data.email,
          surname: data.surname,
        };

        if (user) {
          return user;
        }

      }
    })
  ],
  pages: {
    signIn: '/auth/login',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - User:", user);
      return { ...token, ...user };
    },
    async session({ session, token }) {

      session.user = token;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
