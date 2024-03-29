import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function Contact({ userRef, listing }) {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null);
  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could Not Get Landlord Data");
      }
    }
    getLandlord();
  }, [userRef]);
  function onChange(e) {
    setMessage(e.target.value);
  }
  return (
    <>
      {landlord && (
        <div className="flex flex-col w-full">
          <p>
            Contact{" "}
            <span className="font-bold text-blue-950">{landlord.name} </span>
            for the{" "}
            <span className="font-bold text-red-950">
              {listing.name.toLowerCase()}
            </span>
          </p>
          <div>
            <textarea
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out mt-3 mb-6 focus:text-gray-700 focus:bg-white focus:border-slate-600"
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onChange}
            ></textarea>
          </div>
          <a
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            <button
              className="px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6"
              type="button"
            >
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
}

export default Contact;
