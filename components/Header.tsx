"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

interface Props {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: Props) {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0d0d1a]/95 backdrop-blur border-b border-white/10 h-14 flex items-center px-4 gap-4">
      {/* Botón menú (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <span className="text-white font-bold tracking-wide flex-1 text-sm">Guía de consultorio para médicos clínicos</span>

      {/* Usuario */}
      {session?.user && (
        <div className="flex items-center gap-3">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? ""}
              width={32}
              height={32}
              className="rounded-full ring-2 ring-accent/50"
            />
          )}
          <span className="text-gray-400 text-sm hidden sm:block">{session.user.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
          >
            Salir
          </button>
        </div>
      )}
    </header>
  );
}
