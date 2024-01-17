import { hashPassword } from "@/app/lib/auth";
import { connectToDatabase } from "@/app/lib/db";

export async function POST(
    request: Request
  ) {
    console.log('llego')
    const { email, password } = await request.json();

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
      // `^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?\/~`\-]).{10,}$`
    ) {
      return Response.json({ message: "Invalid input" });
    }

    const hashedPassword = await hashPassword(password);
    const client = await connectToDatabase();
    const db = client.db();

    const existingUser = await db.collection('users').findOne({email})

    if(existingUser){
        return Response.json({message: 'user already exist'})
    }

    const result = await db
      .collection("users")
      .insertOne({ email, hashedPassword });

      client.close()
    return Response.json({ message: "Created user! ", result });
  }