import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn, signInWithGoogle } from "@repo/api";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema} from "@/utils/validation";

type FormData = z.infer<typeof loginSchema>;

export default function Login() {

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

 const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await signIn(data.email, data.password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    }
  };


  return (
    <main className="flex min-h-screen bg-white">
      <div className="relative z-2 flex shrink-0 grow-0 basis-1/2 flex-col justify-center p-12 text-white [clip-path:polygon(0_0,100%_0,85%_100%,0_100%)]">
        <div className="absolute inset-0 bg-[url('/images/featured-bella.jpg')] bg-cover bg-center bg-no-repeat ">
          <div className="absolute inset-0 bg-[rgba(30,18,10,0.75)] d-flex flex-column justify-content-center">
            <div className="relative h-full flex flex-col justify-end p-1">
              <div className="absolute top-0 left-0 px-4">
                <Link to="/">
                  <img
                    src="/images/PawBorrowLogo.png"
                    alt="Logo"
                    className="w-41.25 h-41.25"
                  />
                </Link>
              </div>
              <div className="relative h-full flex flex-col justify-end p-12">
                <span className="font-serif text-[32px] font-normal text-white">
                  PawBorrow
                </span>
                <p className="mt-2 text-base text-white">
                  You've got a Paw in me.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-8 py-12 ">
        <div className="w-full max-w-105">
          <div className="flex flex-col items-center justify-center text-center">
            <Link to="/">
              {" "}
              <img src="/images/PawLogo2.png" alt="Logo" className="" />
            </Link>
            <h1 className="font-serif text-[32px] font-normal text-[#1b1b1b]">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-[#6f6f6f]">
              Sign in to continue to your account
            </p>
          </div>
          
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <div className="mb-4">
              <label className="font-body text-xs uppercase text-black block mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="h-11.5 w-full rounded-xl border border-black bg-whtie px-4 py-3 font-body text-sm"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="mt-4">
              <label className="font-body text-xs uppercase text-black block">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className="h-11.5 w-full rounded-xl border border-black bg-whtie px-4 py-3 font-body text-sm"
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="text-right">
              <Link to="/forgot" className="text-xs text-[#6f6f6f] transition-colors hover:text-[#879b7b]">Forgot password?</Link>
            </div>

            <button
              type="submit"
               disabled={isSubmitting}
              className="h-13 w-full rounded-md  text-sm font-medium uppercase bg-froly-400 text-white hover:bg-froly-500"

            >
               {isSubmitting ? "Logging in..." : "Sign In"}
            </button>
          </form>

           <p className="mt-2 px-2 text-center font-body text-[12px] leading-relaxed text-[#888]">
            By continuing, you agree to {" "}
            <Link
              to="/tos"
              className="text-[#6f6f6f] underline underline-offset-2 transition-colors hover:text-[#879b7b]"
            >
              Terms of Service
            </Link>{" "}
            &{" "}
            <Link
              to="/privacy"
              className="text-[#6f6f6f] underline underline-offset-2 transition-colors hover:text-[#879b7b]"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <div className="relative my-8 flex items-center">
            <div className="h-px flex-1 bg-[#dedede]" />    
            <span className="bg-[#fafaf8] px-3 text-xs uppercase tracking-wide text-[#999]">
              Or you can sign in with
            </span>
            <div className="h-px flex-1 bg-[#dedede]" />
          </div>
          <div className="align-center flex justify-center gap-4">
            <button className="flex items-center justify-center rounded-md border border-[#dadce0] p-2.5 hover:bg-[#f7f8f8]" onClick={() => signInWithGoogle()}><svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" height="1em" width="0.9531em" className="svg-inline--fa fa-google"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg></button>
          </div>

          <p className="mt-8 text-center text-sm text-[#6f6f6f]">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#6f6f6f] hover:text-[#879b7b]">Sign up</Link>
          </p>

        </div>
      </div>
    </main>
  );
}
