import { auth } from "@/auth";
import db from "@/services/db";
import invites from "@/services/invites";
import { NextResponse } from "next/server";

export const GET = auth(async (req, { params }) => {
  const authUser = req.auth?.user;
  if (!authUser) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const instanceId = parseInt(params?.instanceId as string);
  const instance = await db.getInstance(+instanceId);
  if (!instance) {
    return NextResponse.json(
      { message: `No instance with id ${params?.instanceId}` },
      { status: 404 },
    );
  }

  if (!instance.members.find((member) => member.id === authUser.discordId)) {
    return NextResponse.json(
      { message: "You do not have access to this instance" },
      { status: 403 },
    );
  }

  const inviteCode = invites.instanceIdToInviteCode(instance.id);
  return NextResponse.json({ inviteCode });
});