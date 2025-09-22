import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function PATCH(
  req: Request,
  { params }: { params:  Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (task.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await prisma.task.update({ where: { id }, data: { done: !task.done } });
  return NextResponse.json(updated);
}

