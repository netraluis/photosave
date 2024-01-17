import { verifyPassword } from "@/app/lib/auth";
import { connectToDatabase } from "@/app/lib/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  // session: {
  //     strategy: 'jwt'
  // },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "text" },
      },
      // @ts-ignore
      async authorize(credentials) {
        const client = await connectToDatabase();
        const userCollection = client.db().collection("users");

        if (!credentials || !credentials.email) {
          throw new Error("The email credentials are not defined");
        }

        const user = await userCollection.findOne({ email: credentials.email });

        if (!user) {
          client.close();
          throw new Error("No user found");
        }
        const isValid = await verifyPassword(
          credentials.password,
          user.hashedPassword
        );
        if (!isValid) {
          client.close();
          throw new Error("Incorrect Password");
        }
        console.log({ user },'---valid user---')

        client.close();
        return { email: user.email };
      },
    }),
  ],
});

export { handler as GET, handler as POST };