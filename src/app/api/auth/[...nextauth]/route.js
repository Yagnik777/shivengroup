// shivengroup-frontend/src/app/api/auth/[...nextauth]/route.js
export const dynamic = "force-dynamic";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email / Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ✅ Hardcoded admin credentials
        const adminUsername = "admin";
        const adminPassword = "Admin@123";

        if (
          credentials.email === adminUsername &&
          credentials.password === adminPassword
        ) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@company.com",
            role: "admin",
          };
        }

        // ✅ Normal user login via MongoDB
        try {
          await connectMongo();
          const user = await User.findOne({ email: credentials.email });
          if (!user) return null;

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;

          return { id: user._id, name: user.name, email: user.email, role: "user" };
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
