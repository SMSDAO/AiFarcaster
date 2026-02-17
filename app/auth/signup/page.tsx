'use client';

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Zap } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center space-x-2">
          <Zap className="w-8 h-8 text-purple-600" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">AiFarcaster</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Get Started</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Create your account and start building
          </p>

          <div className="space-y-4">
            <ConnectButton />
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span>
              </div>
            </div>

            <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold">
              Sign up with Email
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            <p>By signing up, you agree to our</p>
            <div className="flex space-x-2 mt-1">
              <Link href="#pricing" className="text-purple-600 hover:text-purple-700">Terms</Link>
              <span>and</span>
              <Link href="#pricing" className="text-purple-600 hover:text-purple-700">Privacy Policy</Link>
            </div>
          </div>

          <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
