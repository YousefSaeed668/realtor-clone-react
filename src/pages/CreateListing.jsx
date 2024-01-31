import { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router";
function CreateListing() {
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 50,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;
  const auth = getAuth();
  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // Other Inputs
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted Price Must Be Less Than Regular Price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Max Of 6 Images Allowed");
      return;
    }
    let geolocation = {};
    let location;
    if (geoLocationEnabled) {
      const response = await fetch(
        `https://geocode.maps.co/search?q=${address}&api_key=65b7ffef280ac455717572ckad7fa79`
      );
      const data = await response.json();
      geolocation.lat = data[0]?.lat || 0;
      geolocation.lng = data[0]?.lon || 0;
      location = data.length === 0 && undefined;
      console.log(data);
      console.log(location);
      if (location === undefined) {
        setLoading(false);
        toast.error("Please Enter A Correct Address");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }
    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case "storage/unauthorized":
                // User doesn't have permission to access the object
                break;
              case "storage/canceled":
                // User canceled the upload
                break;

              // ...

              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Error While Uploading Image");
    });
    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing Created Successfully");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) return <Spinner />;
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold ">Create a Listing</h1>
      <form onSubmit={onSubmit}>
        <p className="text-lg mb-2 mt-6 font-semibold ">Sell / Rent</p>
        <div className="flex space-x-3">
          <button
            type="button"
            className={`px-7 py-3  font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            id="type"
            value="sale"
            onClick={onChange}
          >
            Sell
          </button>
          <button
            type="button"
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            id="type"
            value="rent"
            onClick={onChange}
          >
            Rent
          </button>
        </div>
        <label htmlFor="name" className="text-lg mt-6 mb-2 block font-semibold">
          Name{" "}
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
          maxLength="32"
          minLength="10"
          required
          className="w-full px-4 py-2 focus:border-slate-600 text-lg mb-6 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white"
        />
        <div className="flex space-x-6 mb-6">
          <div>
            <label
              htmlFor="bedrooms"
              className="text-lg  mb-2 block font-semibold"
            >
              Beds
            </label>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="px-4 py-2 w-full  text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-gray-600 text-center"
            />
          </div>
          <div>
            <label
              htmlFor="bathrooms"
              className="text-lg  mb-2 block font-semibold"
            >
              Baths
            </label>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="px-4 py-2 w-full text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-gray-600 text-center"
            />
          </div>
        </div>

        <p className="text-lg mb-2 mt-6 font-semibold ">Parking Spot</p>
        <div className="flex space-x-3">
          <button
            type="button"
            className={`px-7 py-3  font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            id="parking"
            value={true}
            onClick={onChange}
          >
            Yes
          </button>
          <button
            type="button"
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            id="parking"
            value={false}
            onClick={onChange}
          >
            No
          </button>
        </div>
        <p className="text-lg mb-2 mt-6 font-semibold ">Furnished</p>
        <div className="flex space-x-3">
          <button
            type="button"
            className={`px-7 py-3  font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            id="furnished"
            value={true}
            onClick={onChange}
          >
            Yes
          </button>
          <button
            type="button"
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            id="furnished"
            value={false}
            onClick={onChange}
          >
            No
          </button>
        </div>
        <label
          htmlFor="address"
          className="text-lg mt-6 mb-2 block font-semibold"
        >
          Address
        </label>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          minLength="12"
          required
          className="w-full px-4  h-32 py-2 resize-none focus:border-slate-600 text-lg mb-6 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white"
        />
        {!geoLocationEnabled && (
          <>
            {/* <div className="flex justify-between mb-6">
              <p className="text-sm">Use Your Position</p>
              <p className="text-sm whitespace-nowrap">
                Check For Address Coordinates
              </p>
            </div> */}
            <div className=" flex flex-wrap space-x-6 mb-6 items-center">
              <div>
                <label
                  htmlFor="latitude"
                  className="text-lg font-semibold block mb-2"
                >
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onChange}
                  min="-90"
                  max="90"
                  required
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
                />
              </div>
              <div>
                <label
                  htmlFor="longitude"
                  className="text-lg font-semibold block mb-2"
                >
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onChange}
                  min="-180"
                  max="180"
                  required
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
                />
              </div>
            </div>
          </>
        )}
        <label
          htmlFor="description"
          className="text-lg  mb-2 block font-semibold"
        >
          Description
        </label>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          minLength="12"
          required
          className="w-full px-4 py-2  resize-none h-32 focus:border-slate-600 text-lg mb-6 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white"
        />
        <p className="text-lg mb-2 font-semibold ">Offer</p>
        <div className="flex space-x-3 mb-6">
          <button
            type="button"
            className={`px-7 py-3  font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            id="offer"
            value={true}
            onClick={onChange}
          >
            Yes
          </button>
          <button
            type="button"
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            id="offer"
            value={false}
            onClick={onChange}
          >
            No
          </button>
        </div>
        <div className="flex mb-6">
          <div>
            <label
              htmlFor="regularPrice"
              className="text-lg  mb-2 block font-semibold"
            >
              Regular Price
            </label>
            <div className="flex items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="40000000"
                required
                className="px-4 py-2 w-full  text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-gray-600 text-center"
              />
              {type === "rent" && (
                <div className="">
                  <p className="text-md w-full whitespace-nowrap">& / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="flex mb-6">
            <div>
              <label
                htmlFor="regularPrice"
                className="text-lg  mb-2 block font-semibold"
              >
                Discounted Price
              </label>
              <div className="flex items-center space-x-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="1"
                  max="40000000"
                  required={offer}
                  className="px-4 py-2 w-full  text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-gray-600 text-center"
                />
                {type === "rent" && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">
                      & / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <label htmlFor="images" className="text-lg  mb-2 block font-semibold">
            Images
          </label>
          <p className="mb-2 text-gray-600">
            First Image Will Be The Cover (Max is 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg,.webp"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
          />
        </div>
        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue text-white bg-blue-600 font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 transition duration-150 ease-in-out"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
}

export default CreateListing;
