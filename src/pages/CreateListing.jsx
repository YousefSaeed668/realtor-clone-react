import { useState } from "react";

function CreateListing() {
  const [formDate, setFormDate] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
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
  } = formDate;
  function onChange() {}
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold ">Create a Listing</h1>
      <form>
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
        <label htmlFor="name" className="text-lg mt-6 mb-2 block font-semibold">
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
        <label htmlFor="name" className="text-lg  mb-2 block font-semibold">
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
                  min="50"
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
            accept=".jpg,.png,.jpeg"
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
