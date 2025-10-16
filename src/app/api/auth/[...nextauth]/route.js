import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// --------------------
// NextAuth options
// --------------------
export const authOptions = {
  providers: [
    // ✅ Only USER login
    CredentialsProvider({
      id: "user-credentials",
      name: "User Login",
      credentials: {
        email: { label: "Email", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        await connectMongo();

        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: "user",
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.role = "user";
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },

  cookies: {
    sessionToken: {
      name: "user-session",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      },
    },
  },
};

// --------------------
// NextAuth handler
// --------------------
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
