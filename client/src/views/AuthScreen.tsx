import SignUp from "@/components/Auth/SignUp";
import SignIn from "@/components/Auth/SignIn";
import { useState } from "react";

export default function AuthScreen() {
  const [hasAccount, setHasAccount] = useState<boolean>(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-5 pt-20 lg:pt-40 overflow-auto">
      <h2 className="text-lg md:text-xl">
        {hasAccount
          ? "Sign In to use KeyMap Ai"
          : "Sign Up for access to KeyMap Ai"}
      </h2>

      {hasAccount ? <SignIn /> : <SignUp />}
      <div className="mt-4">
        <button
          onClick={() => setHasAccount(!hasAccount)}
          className="text-slate-500 underline cursor-pointer"
        >
          {hasAccount
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </button>
      </div>
    </div>
  );
}
