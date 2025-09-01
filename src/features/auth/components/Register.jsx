import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import SubmitButton from "../../../resusable components/buttons/SubmitButton";
import { registerUser } from "../../../services/apiServices";

function Register() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.authReducer);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };
  

  return (
    <form
      className="bg-blue-950 text-white w-full max-w-md mx-auto mt-10 p-8 rounded-xl shadow-lg flex flex-col gap-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Name */}
      <div className="flex flex-col w-full">
        <label htmlFor="name" className="mb-1 text-sm font-medium">
          Name
        </label>
        <input
          className="p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          name="name"
          id="name"
          placeholder="Enter your name"
          {...register("name")}
        />
      </div>
      {/* Email */}
      <div className="flex flex-col w-full">
        <label htmlFor="email" className="mb-1 text-sm font-medium">
          Phone
        </label>
        <input
          className="p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          name="phone"
          id="phone"
          placeholder="Enter your phone"
          {...register("phone")}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col w-full">
        <label htmlFor="email" className="mb-1 text-sm font-medium">
          Email
        </label>
        <input
          className="p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          name="email"
          id="email"
          placeholder="Enter your Email"
          {...register("email")}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col w-full">
        <label htmlFor="password" className="mb-1 text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          className="p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          name="password"
          id="password"
          placeholder="Enter your password"
          {...register("password", { required: true })}
        />
        {errors.exampleRequired && (
          <span className="text-red-400 mt-1 text-sm">
            This field is required
          </span>
        )}
      </div>
      <div className="flex flex-col w-full">
        <label htmlFor="rePassword" className="mb-1 text-sm font-medium">
          rePassword
        </label>
        <input
          type="password"
          className="p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          name="rePassword"
          id="rePassword"
          placeholder="Enter your rePassword"
          {...register("rePassword", { required: true })}
        />
        {errors.exampleRequired && (
          <span className="text-red-400 mt-1 text-sm">
            This field is required
          </span>
        )}
      </div>

      <div className="w-full ">
        <SubmitButton bgColor="indigo-500" textColor="white" />
      </div>
    </form>
  );
}

export default Register;

{
  /* <button
  type="button"
  onClick={() =>
    dispatch(
      register({
        name: "ahmed2211122",
        email: `ahmewd2221122@example.com`,
        password: "P@ssw0rd",
        rePassword: "P@ssw0rd",
        phone: "01010700701",
      })
    )
  }
  className="bg-white text-black px-4 py-2 rounded"
>
  Register
</button>; */
}
