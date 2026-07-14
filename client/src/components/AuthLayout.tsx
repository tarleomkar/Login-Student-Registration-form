import { GraduationCap } from 'lucide-react';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.3),transparent_45%)]" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <aside className="relative hidden overflow-hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,transparent_45%)]" />
          <div className="absolute -right-16 top-24 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-16 left-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />

          <div className="relative z-10 p-10 xl:p-14">
            <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
              <GraduationCap className="h-4 w-4" />
              Student Management System
            </div>
            <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
              Manage student records with clarity and confidence.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-blue-100/90">
              Register students, sign in securely, and manage records from one clean dashboard
              built for your MERN assignment workflow.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 p-10 xl:p-14">
            {[
              { label: 'Register', value: 'Create' },
              { label: 'Login', value: 'Access' },
              { label: 'Dashboard', value: 'Manage' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-wide text-blue-100/80">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-xl">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Student Portal</p>
                <p className="text-xs text-slate-400">Secure student management</p>
              </div>
            </div>

            {children}
            {footer && <div className="mt-6 text-center">{footer}</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
