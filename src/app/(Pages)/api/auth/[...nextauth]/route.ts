import { failedLoginResponse, successLoginResponse } from "@/Interfaces/login"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { json } from "stream/consumers"

const API_BASE = process.env.API_BASE;
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const response = await fetch(`${API_BASE}/auth/signin`, {
          method: 'POST',
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password
          }),
          headers: { 'content-type': 'application/json' }
        })

        const payload: successLoginResponse | failedLoginResponse = await response.json();

        if ('token' in payload) {
          return {
            id: payload.user.email,
            user: payload.user,
            token: payload.token
          }
        } else {
          throw new Error(payload.message)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user.user;
        token.token = user.token;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user = token.user;
      session.token = token.token;
      return session;
    }
  },
  pages: {
    signIn: '/Login',
    error: '/Login',
  },
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }
