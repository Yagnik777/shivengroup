// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Connect to DB
        await connectMongo();

        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new Error("Missing email or password");
        }

        // 1) Try Admin collection first
        const admin = await Admin.findOne({ email }).lean();
        if (admin) {
          // check password
          const isValid = await bcrypt.compare(password, admin.password);
          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          // Return the basic user object (NextAuth will include in token via callbacks)
          return { id: admin._id.toString(), name: admin.name, email: admin.email, role: "admin" };
        }

        // 2) Try User collection
        const user = await User.findOne({ email }).lean();
        if (user) {
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          return { id: user._id.toString(), name: user.name, email: user.email, role: "user" };
        }

        // Not found in either collection
        throw new Error("Invalid credentials");
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60,   // 12 hours in seconds
    updateAge: 60 * 60,     // refresh JWT if older than 1 hour (optional)
  },

  pages: {
    signIn: "/login", // your login page path
    // error: '/auth/error' // optional
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // On first sign in, 'user' is available
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
        token.name = user.name || null;
        token.email = user.email || null;
      }
      return token;
    },

    async session({ session, token }) {
      // Attach custom fields to session
      session.user = session.user || {};
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name || session.user.name;
      session.user.email = token.email || session.user.email;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
