"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full bg-white max-h-[100px]">
      <div className="p-6 flex items-center justify-between">
        <div className="text-lg font-bold text-black"> <Image style={{display:"inline-block"}} src={"/logo.png"} width={"100"} height={"20"} alt=""/> </div>
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : session?.user ? (
            <>
              <div className="text-sm text-gray-700 hidden sm:block">{session.user.name ?? session.user.email}</div>
              <button
                onClick={() => signOut()}
                className="px-3 py-1 text-sm border rounded bg-red-500 text-white hover:bg-red-600"
              >
                logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-3 py-1 bg-[#4F39F6] text-white  rounded hover:bg-gray-600"
            >
              Sign in with Google <Image style={{display:"inline-block", marginLeft:"4px", marginBottom:"2px"}} src={"/google.png"} width={"20"} height={"20"} alt=""/>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
