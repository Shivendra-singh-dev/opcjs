import { getSession } from "@/lib/session";

export async function POST(req, res) {
  const session = await getSession(req, res);

  session.destroy();

  return res.status(200).json({
    message: "Logged out successfully",
  });
}
