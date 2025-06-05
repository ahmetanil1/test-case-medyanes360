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
        role: { label: "Role", type: "text", placeholder: "Role" }
      },
      async authorize(credentials) {
        const { email, password, role } = credentials;

        console.log("Authorize fonksiyonu çalıştı. Credentials:", { email, role }); // Debug log

        if (!email || !password || !role) {
          console.error("Email, şifre veya rol eksik."); // Debug log
          throw new Error("Email, şifre ve rol zorunludur.");
        }
        try {
          // Buradaki postAPI çağrısı kritik!
          const result = await postAPI("/auth/login", { email, password, role });
          const { data } = result;

          console.log("postAPI yanıtı:", result); // Debug log: result'ın tamamını gör
          console.log("postAPI'den gelen data:", data); // Debug log: data objesini gör

          if (!data || !data.id) {
            console.warn("Kullanıcı doğrulanamadı. Data eksik veya ID yok."); // Debug log
            return null; // user doğrulanamadı
          }

          const user = {
            id: data.id,
            role: data.role,
            name: data.name,
            email: data.email,
            surname: data.surname,
          };

          console.log("Kullanıcı doğrulandı:", user); // Debug log
          return user;
        } catch (apiError) {
          console.error("Backend API çağrısında hata:", apiError.message); // API hatasını logla
          // Burada kullanıcıya uygun bir hata mesajı döndürmeyi düşünebilirsiniz.
          throw new Error("Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.");
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
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.surname = user.surname;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        role: token.role,
        name: token.name,
        email: token.email,
        surname: token.surname,
      };

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
