import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import { useParams } from "react-router";
function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchListing, setLastFetchListing] = useState(null);
  const params = useParams();
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListing(lastVisible);
        let listings = [];
        querySnap.forEach((doc) => {
          listings.push({ data: doc.data(), id: doc.id });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could Not Fetch Listings");
        console.log(error);
      }
    }
    fetchListings();
  }, [params.categoryName]);
  async function onFetchMoreListings() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchListing),
        limit(4)
      );
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListing(lastVisible);
      let listings = [];
      querySnap.forEach((doc) => {
        listings.push({ data: doc.data(), id: doc.id });
      });
      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could Not Fetch Listings");
    }
  }
  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center my-6  font-bold">
        Places For
        {params.categoryName === "rent" ? " Rent" : " Sale"}
      </h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </main>
          {lastFetchListing && (
            <div className="flex justify-center items-center ">
              <button
                onClick={onFetchMoreListings}
                className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center mt-6">
          There Is No Current{" "}
          {params.categoryName === "rent" ? " Rent" : " Sale"}
        </p>
      )}
    </div>
  );
}
export default Category;
