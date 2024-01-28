import { FcGoogle } from "react-icons/fc";

function OAuth() {
  return (
    <button className="flex items-center justify-center w-full bg-red-700 text-white py-3 px-7 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 rounded shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out">
      <FcGoogle className="text-2xl bg-white rounded-full mr-2" />
      Continue with Google
    </button>
  );
}

export default OAuth;
