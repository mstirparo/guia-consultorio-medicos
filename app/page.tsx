"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/read");
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #16213e 100%)" }}>

      {/* Decoración */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-surface opacity-10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        {/* Portada */}
        <div className="space-y-3">
          <div className="inline-block bg-accent text-white text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            Lectura Digital
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
            Guía de consultorio para médicos clínicos
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Navegá por cada capítulo desde cualquier dispositivo,
            con acceso completo a la obra.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          {[
            { icon: "📖", label: "Capítulos organizados" },
            { icon: "🔖", label: "Guardá tu progreso" },
            { icon: "📱", label: "En cualquier dispositivo" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 rounded-xl p-3 space-y-1">
              <div className="text-2xl">{icon}</div>
              <div className="text-gray-300">{label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-100 transition-all duration-200 shadow-xl shadow-white/10"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Ingresar con Google
          </button>
          <p className="text-gray-500 text-xs">
            Al ingresar aceptás los términos de uso. Tu cuenta de Google solo se usa para identificarte.
          </p>
        </div>

        {/* Precio */}
        <div className="border border-white/10 rounded-2xl p-5 text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">Acceso completo</span>
            <span className="text-accent font-bold text-xl">$9.99</span>
          </div>
          <ul className="space-y-1 text-sm text-gray-400">
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Todos los capítulos</li>
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Pago único, sin suscripción</li>
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Acceso de por vida</li>
          </ul>
          <p className="text-xs text-gray-500">Los primeros 2 capítulos son gratuitos para todos.</p>
        </div>
      </div>
    </main>
  );
}
