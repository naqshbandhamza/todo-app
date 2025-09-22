// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";


export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const q = url.searchParams.get("q") ?? "";
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    let pageSize = Math.max(1, Number(url.searchParams.get("pageSize") ?? "10"));
    pageSize = Math.min(pageSize, 100);

    //   const where = {
    //     userId: session.user.id,
    //     ...(q ? { title: { contains: q, mode: "insensitive" } } : {})
    //   };

    const where: Prisma.TaskWhereInput = {
        userId: session.user.id,
        ...(q ? { title: { contains: q, mode: "insensitive" as Prisma.QueryMode } } : {})
    };

    const total = await prisma.task.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const items = await prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize
    });

    return NextResponse.json({
        items,
        page,
        pageSize,
        total,
        totalPages
    });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (!title || title.length < 1 || title.length > 200) {
        return NextResponse.json({ error: "Title must be 1-200 characters." }, { status: 400 });
    }

    const task = await prisma.task.create({
        data: {
            title,
            userId: session.user.id
        }
    });

    return NextResponse.json(task, { status: 201 });
}
