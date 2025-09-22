"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full bg-white">
      <div className="p-6 flex items-center justify-between">
        <div className="text-lg font-bold text-black">Taskly</div>
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : session?.user ? (
            <>
              <div className="text-sm text-gray-700 hidden sm:block">{session.user.name ?? session.user.email}</div>
              <button
                onClick={() => signOut()}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
