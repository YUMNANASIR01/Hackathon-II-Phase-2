'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated user
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/tasks');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 30px); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }

        .blob-shape-1 {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(139,92,246,0.4), rgba(99,102,241,0.2));
          border-radius: 40% 60% 70% 30%;
          filter: blur(40px);
          animation: float 15s ease-in-out infinite;
        }

        .blob-shape-2 {
          position: absolute;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(59,130,246,0.3), rgba(99,102,241,0.1));
          border-radius: 60% 40% 30% 70%;
          filter: blur(50px);
          animation: float-slow 20s ease-in-out infinite;
        }

        .hero-content { animation: fade-in-up 0.8s ease-out; }

        .hero-title {
          background: linear-gradient(135deg, #fff, #c7d2fe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
      `}</style>

      <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Background blobs */}
        <div className="blob-shape-1 top-20 -left-32" />
        <div className="blob-shape-2 bottom-10 -right-40" />

        {/* Content */}
        <div className="hero-content text-center space-y-8 max-w-4xl mx-auto px-4">
          <p className="text-sm md:text-base text-purple-300 font-semibold tracking-widest uppercase">
            ✨ Welcome to the Future of Productivity
          </p>

          <h1 className="hero-title text-5xl md:text-7xl font-bold">
            Your To-Do App
          </h1>

          <div className="space-y-3">
            <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Organize your life, prioritize what matters, and achieve your goals one task at a time.
            </p>
            <p className="text-sm md:text-base text-purple-400">
              Simple, powerful, and designed for your success
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
            <Link href="/login">
              <button className="btn-primary min-w-[200px] h-14 px-8 text-lg text-white border-2 border-purple-500 rounded-full hover:bg-purple-500/20 hover:scale-105 transition">
                Log In
              </button>
            </Link>

            <Link href="/register">
              <button className="btn-primary min-w-[200px] h-14 px-8 text-lg text-white border-2 border-purple-500 rounded-full hover:bg-purple-500/20 hover:scale-105 transition">
                Create Account
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
