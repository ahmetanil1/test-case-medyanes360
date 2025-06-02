import NextAuth from "next-auth"
import CredenetialsProvider from "next-auth/providers/credentials"
import { postAPI } from "@/services/fetchAPI"


const authOptions = {
  providers: [
    CredenetialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
        role: { label: "Role", type: "text", placeholder: "Role" }
      },
      async authorize(credentials) {
        const { email, password, role } = credentials;
        if (!email || !password) {
          throw new Error("Email and password are required.");
        }
        if (email) {
          const data = await postAPI('/auth/login', {
            email: email,
            password: password,
            role: role
          });


          const { userFromDB, success, error, status } = data;
          if (userFromDB === null || !success || userFromDB === undefined || error || !userFromDB) {
            let error2 = new Error();
            error2.message = error;
            error2.status = status;
            throw error2;
          }
          if (!userFromDB.role || !userFromDB.name || !userFromDB.surname || !userFromDB.email) {
            throw new Error("Giriş işleminde bir hata oluştu.");
          }
          const user = {
            role: userFromDB.role,
            name: userFromDB.name,
            surname: userFromDB.surname,
            email: userFromDB.email,
          };

          if (user) {
            return user;
          }
        }

        return response.user;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)