import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

let schema = z.object({
  email: z.string().email("please enter valid email"),
  password: z
    .string()
    .min(8, "password must be at least 8 characters")
    .regex(/[a-z]/, "password must contain at least one lowercase letter")
    .regex(/[0-9]/, "password must contain at least one number"),
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  let { handleSubmit, register, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const doLogin = function (data) {
    setIsLoading(true);

    const loginPromise = axios.post(
      "https://nti-ecommerce.vercel.app/api/v1/auth/signIn",
      data,
    );
    toast.promise(loginPromise, {
      loading: "Logging ...",
      success: (res) => {
        setTimeout(() => {
          navigate("/categories");
        }, 2000);
        localStorage.setItem("token", res.data.token);
        return <b>welcome back</b>;
      },
      error: (err) => <b>{err.response.data.err}</b>,
    });

    loginPromise.finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <main>
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="flex min-h-screen flex-col items-center justify-start px-6 py-8 mx-auto lg:justify-center lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Login to your account
                </h1>
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit(doLogin)}
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <input
                      {...register("email")}
                      type="text"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                    />
                    {formState.errors.email && (
                      <p className="text-danger text-sm">
                        {formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      {...register("password")}
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    {formState.errors.password && (
                      <p className="text-danger text-sm">
                        {formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        Logging ... <i className="fa fa-spin fa-spinner"></i>
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Register here
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
