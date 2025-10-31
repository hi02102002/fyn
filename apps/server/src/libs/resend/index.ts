import { Resend } from "resend";

// biome-ignore lint/style/noNonNullAssertion: <improve code>
export const resend = new Resend(process.env.RESEND_API_KEY!);