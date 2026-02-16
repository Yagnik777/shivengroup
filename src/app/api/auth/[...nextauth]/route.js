// // src/app/api/auth/[...nextauth]/route.js
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import connectMongo from "@/lib/mongodb";
// import Admin from "@/models/Admin";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials, req) {
//         // Connect to DB
//         await connectMongo();

//         const { email, password } = credentials || {};

//         if (!email || !password) {
//           throw new Error("Missing email or password");
//         }

//         // 1) Try Admin collection first
//         const admin = await Admin.findOne({ email }).lean();
//         if (admin) {
//           // check password
//           const isValid = await bcrypt.compare(password, admin.password);
//           if (!isValid) {
//             throw new Error("Invalid credentials");
//           }

//           // Return the basic user object (NextAuth will include in token via callbacks)
//           return { id: admin._id.toString(), name: admin.name, email: admin.email, role: "admin" };
//         }

//         // 2) Try User collection
//         const user = await User.findOne({ email }).lean();
//         if (user) {
//           const isValid = await bcrypt.compare(password, user.password);
//           if (!isValid) {
//             throw new Error("Invalid credentials");
//           }

//           return { id: user._id.toString(), name: user.name, email: user.email, role: "user" };
//         }

//         // Not found in either collection
//         throw new Error("Invalid credentials");
//       },
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//     maxAge: 12 * 60 * 60,   // 12 hours in seconds
//     updateAge: 60 * 60,     // refresh JWT if older than 1 hour (optional)
//   },

//   pages: {
//     signIn: "/login", // your login page path
//     // error: '/auth/error' // optional
//   },

//   callbacks: {
//     async jwt({ token, user, account }) {
//       // On first sign in, 'user' is available
//       if (user) {
//         token.id = user.id;
//         token.role = user.role || "user";
//         token.name = user.name || null;
//         token.email = user.email || null;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       // Attach custom fields to session
//       session.user = session.user || {};
//       session.user.id = token.id;
//       session.user.role = token.role;
//       session.user.name = token.name || session.user.name;
//       session.user.email = token.email || session.user.email;
//       return session;
//     },
//   },

//   secret: process.env.NEXTAUTH_SECRET,
//   debug: process.env.NODE_ENV === "development",
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
// src/app/api/auth/[...nextauth]/route.js
// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import User from "@/models/User";
import Recruiter from "@/models/Recruiter";
import ServiceProvider from "@/models/serviceprovider";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectMongo();
          const { email, password } = credentials || {};

          if (!email || !password) {
             throw new Error("ઈમેલ અને પાસવર્ડ જરૂરી છે.");
          }

          // ૧. સુરક્ષા: ઈમેલને હંમેશા lowercase માં ફેરવો (Case-insensitivity માટે)
          const normalizedEmail = email.toLowerCase();

          // ૨. ડેટાબેઝ સર્ચ ફંક્શન (વધુ ક્લીન કોડ માટે)
          let dbUser = null;
          let userRole = "";

          // Admin ચેક કરો
          dbUser = await Admin.findOne({ email: normalizedEmail }).lean();
          if (dbUser) userRole = "admin";

          // જો Admin ના હોય તો Recruiter ચેક કરો
          if (!dbUser) {
            dbUser = await Recruiter.findOne({ email: normalizedEmail }).lean();
            if (dbUser) userRole = "recruiter";
          }

          // જો હજુ પણ ના મળ્યું હોય તો ServiceProvider
          if (!dbUser) {
            dbUser = await ServiceProvider.findOne({ email: normalizedEmail }).lean();
            if (dbUser) userRole = "serviceprovider"; // Underscore કાઢી નાખ્યો (Middleware માટે)
          }

          // છેલ્લે User
          if (!dbUser) {
            dbUser = await User.findOne({ email: normalizedEmail }).lean();
            if (dbUser) userRole = "user";
          }

          // ૩. જો યુઝર નથી મળ્યો અથવા પાસવર્ડ ખોટો છે
          if (!dbUser || !(await bcrypt.compare(password, dbUser.password))) {
            throw new Error("ખોટો ઈમેલ અથવા પાસવર્ડ.");
          }

          // ૪. વધારાનું સિક્યોરિટી ચેક (દા.ત. Recruiter માટે Verification)
          if (userRole === "recruiter" && !dbUser.isEmailVerified && dbUser.isVerified === false) {
            throw new Error("મહેરબાની કરીને તમારું ઈમેલ વેરીફાય કરો.");
          }

          // ૫. સુરક્ષિત ડેટા જ રિટર્ન કરો (સંવેદનશીલ ડેટા ટાળો)
          return {
            id: dbUser._id.toString(),
            name: dbUser.name || dbUser.fullName || "User",
            email: dbUser.email,
            role: userRole,
          };

        } catch (error) {
          console.error("Auth Error:", error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // ૧૨ કલાક સુધી સેશન રહેશે
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login", // એરર આવે તો પણ લોગિન પેજ પર જ રહે
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  // પ્રોડક્શનમાં સિક્યોરિટી વધારવા માટે
  cookies: {
    sessionToken: { 
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production", // HTTPS પર જ કામ કરશે
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };