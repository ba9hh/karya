import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import Connect from "../connecter/connect";
import { Link } from "react-router-dom";
import heart from "../../assets/icons/heart1black.svg";
import tag from "../../assets/icons/tag.png";
import bed from "../../assets/icons/bed.png";
import redHeart from "../../assets/icons/redHeart.svg";
import { AuthContext } from "../../AuthProvider";


const ListOfHouses = () => {
  const { user } = useContext(AuthContext);
  const [connect, setConnect] = useState(false);
  const [houses, setHouses] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [likedHouses, setLikedHouses] = useState([]);
  

  const toggleLike = async (houseId) => {
    try {
      const response = await axios.post(
        "https://karya-kpet.onrender.com/api/toggle-like",
        { houseId }
      );
      if (response.data.success) {
        // If the house is already liked, remove it from likedHouses
        if (likedHouses.includes(houseId)) {
          setLikedHouses(likedHouses.filter((id) => id !== houseId));
        } else {
          // If not liked, add it to likedHouses
          setLikedHouses([...likedHouses, houseId]);
        }
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };
  const handleLike = (houseId) => {
    if (user) {
      toggleLike(houseId);
    } else {
      setConnect(true);
    }
  };
  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await axios.get(
          "https://karya-kpet.onrender.com/api/get-liked-posts",
          {
            withCredentials: true, // Ensure the token is sent in the request
          }
        );
        setLikedHouses(response.data.likedPosts); // Set the liked posts in state
      } catch (error) {
        console.error("Error fetching liked posts:", error);
      }
    };

    if (user) {
      fetchLikedPosts();
    }
  }, [user]);

  const fetchHouses = async (page) => {
    try {
      const endpoint = user
        ? `https://karya-kpet.onrender.com/api/houses-to-user?page=${page}&limit=6`
        : `https://karya-kpet.onrender.com/api/houses?page=${page}&limit=6`;

      const response = await axios.get(endpoint);
      const newHouses = response.data;
      
      console.log("Fetched page:", page);
      console.log("Fetched Houses:", newHouses);
      if (newHouses.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }
      // Append new data to the existing list
      setHouses((prevHouses) => {
        // Filter out duplicates based on house ID
        const uniqueHouses = newHouses.filter(
          (newHouse) =>
            !prevHouses.some((prevHouse) => prevHouse._id === newHouse._id)
        );
        return [...prevHouses, ...uniqueHouses];
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching houses:", error);
    }
  };
  useEffect(() => {
    if (hasMore) {
      fetchHouses(page);
    }
  }, [page]);

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
      document.documentElement.scrollHeight
    ) {
      if (!loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const debouncedScroll = debounce(handleScroll, 200); // Add a debounce of 200ms
    window.addEventListener("scroll", debouncedScroll);
    return () => window.removeEventListener("scroll", debouncedScroll); // Cleanup on unmount
  }, [handleScroll]);
  

  return (
    <div className="lg:grid-cols-3 md:grid-cols-2 grid grid-cols-1 gap-x-8 gap-y-10 mx-20 mb-20 mt-10 ">
      {houses.length > 0 &&
          houses.map((house) => (
            <div key={house._id}>
              <Link to={"/houses/" + house._id}>
                <div className="grid grid-cols-2 gap-1">
                  <img
                    className="w-full h-44 border  rounded-xl object-cover"
                    src={`https://karya-kpet.onrender.com/${house.images[0]}`}
                  />
                  <img
                    className="w-full h-44 border  rounded-xl object-cover"
                    src={`https://karya-kpet.onrender.com/${house.images[1]}`}
                  />
                  <img
                    className="w-full h-44 border  rounded-xl object-cover"
                    src={`https://karya-kpet.onrender.com/${house.images[2]}`}
                  />
                  <img
                    className="w-full h-44 border  rounded-xl object-cover"
                    src={`https://karya-kpet.onrender.com/${house.images[3]}`}
                  />
                </div>
              </Link>

              <div
                className="flex justify-end cursor-pointer z-40"
                onClick={() => handleLike(house._id)}
              >
                <img
                  src={
                    likedHouses.includes(house._id)
                      ? redHeart // If liked, show red heart
                      : heart // If not liked, show black heart
                  }
                  alt="like button"
                  className="w-5"
                />
              </div>
              <Link to={"/houses/" + house._id}>
                <h1 className="text-center text-lg font-normal">
                  {house.wilaya},{house.mo3tamdiya}
                </h1>
                <h1 className="text-center crimsonText text-sm text-[#B2B2B2]">
                  pour {house.lchkon}
                </h1>
                <div className="flex justify-center items-center gap-2">
                  <div className="flex items-center gap-1">
                    <img className="w-4 h-4 border" src={tag} />
                    <h1 className="border">
                      {house.prix}dt/{house.prixOption || "moins"}
                    </h1>
                  </div>
                  <div className="flex items-center gap-1">
                    <img className="w-4 h-4" src={bed} />
                    <h1>{house.Byout} chambres</h1>
                  </div>
                </div>
              </Link>
            </div>
          ))}

      {connect && <Connect onClose={() => setConnect(false)} />}
    </div>
  );
};
export default ListOfHouses;
