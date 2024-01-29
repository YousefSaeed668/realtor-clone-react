import { getAuth, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { FcHome } from "react-icons/fc";
import { Link } from "react-router-dom";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth?.currentUser?.displayName,
    email: auth?.currentUser?.email,
  });
  const { name, email } = formData;

  function onLogout() {
    auth.signOut();
    navigate("/");
  }
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update Display Name in Firebase Auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // Update Display Name in Firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
        toast.success("Profile Details Updated");
      }
    } catch (error) {
      toast.error("Could not update profile");
    }
  }
  return (
    <>
      <section className="max-w-6xl mx-auto flex items-center justify-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            {/* Name Input */}
            <input
              type="text"
              id="name"
              value={name}
              onChange={onChange}
              disabled={!changeDetails}
              className={`w-full px-4 py-2 text-xl text-gray-700 mb-6 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetails && "bg-red-200 focus:bg-red-200"
              }`}
            />
            {/* Email Input */}
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full px-4 py-2 text-xl text-gray-700 mb-6 bg-white border border-gray-300 rounded transition ease-in-out  "
            />
            <div className="flex justify-between  mb-6 whitespace-nowrap text-sm sm:text-lg">
              <p className="flex items-center">
                Do you want change your name ?
                <span
                  onClick={() => {
                    changeDetails && onSubmit();
                    setChangeDetails((prev) => !prev);
                  }}
                  className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
                >
                  {changeDetails ? "Apply Change" : "Edit"}
                </span>
              </p>
              <p
                onClick={onLogout}
                className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
              >
                Sign Out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800 "
          >
            <Link
              to="/create-listing"
              className="flex justify-center items-center"
            >
              <FcHome className=" mr-2 text-3xl bg-red-200 rounded-full p-1 border-2" />
              Sell or Rent You Home
            </Link>
          </button>
        </div>
      </section>
    </>
  );
}

export default Profile;
