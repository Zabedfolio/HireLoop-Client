import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        returned: true,
        input: true,
        defaultValue: "job_seeker",
      },
      plan:{
        defaultValue: "seeker_free",
      },
      headline:{
        type: "string",
        required: false,
      },
      bio:{
        type: "string",
        required: false,
      },
      skills:{
        type: "string",
        required: false,
      },
      resume:{
        type: "string",
        required: false,
      },
      status:{
        type: "string",
        required: false,
        defaultValue: "active",
      }
    },
  },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
  }),
});