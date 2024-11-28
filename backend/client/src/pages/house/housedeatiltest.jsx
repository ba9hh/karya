import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import user1 from "../../assets/icons/user.png";
import { AuthContext } from "../../AuthProvider";
import Connect from "../connecter/connect";

const approved = () => {
  return (
    <span className="ml-1 w-5 h-5 border-2  border-gray-400 rounded-sm bg-green-500  flex justify-center items-center">
      <svg
        className="w-3 h-3 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
};
const declined = () => {
  return (
    <span className="ml-1 w-5 h-5 border-1 border-gray-400 rounded-sm bg-red-500 flex justify-center items-center">
      <svg
        className="w-3 h-3 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </span>
  );
};

const HouseDetails = () => {
  const { user } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNumberOpen, setIsNumberOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };
  const { id } = useParams(); // Get the house ID from the URL
  const [house, setHouse] = useState(null);
  const [user2, setUser] = useState(null);
  const [more, setMore] = useState(false);
  const [error, setError] = useState("");
  const [connect, setConnect] = useState(false);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const response = await axios.get(
          `https://karya-kpet.onrender.com/api/house/${id}`
        );
        setHouse(response.data); // Set the house state with the fetched data
      } catch (err) {
        setError("Error fetching house details");
      }
    };

    fetchHouse(); // Call the function to fetch house details on component mount
  }, [id]);
  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `https://karya-kpet.onrender.com/api/user/${userId}`
      );
      setUser({
        name: response.data.name,
        phoneNumber: response.data.phoneNumber,
        profilePic:response.data.profilePic
      }); // Set the user state with the fetched data
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };
  console.log(user2);
  const handleOpen = () => {
    if (user) {
      setIsNumberOpen(true);
      fetchUserDetails(house.user);
    } else {
      setConnect(true);
    }
  };
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!house) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-32 p-4">
      <div className="flex px-14">
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 w-1/4">
          {house.images
            .slice(0, Math.ceil(house.images.length / 2))
            .map((image, index) => (
              <img
                key={index}
                src={`https://karya-kpet.onrender.com/${image}`}
                alt={`House ${index + 1}`}
                className="w-full border object-cover cursor-pointer"
                onClick={() => handleImageClick(image)}
              />
            ))}
        </div>
        <div className="w-1/2 border flex flex-col gap-y-8 pt-4">
          <h1 className="text-center text-lg font-medium">Ma3loumat 3la dar</h1>
          <div className="flex flex-col gap-y-3 border pt-5 pb-3 mx-10 rounded-xl">
            <h1 className="text-center ">c'est pour {house.lchkon}</h1>
            <div className="flex justify-evenly">
              <h1 className=" flex items-center">
                {house.houseType} {approved()}
              </h1>
              <h1 className=" flex items-center">
                meublé {house.meuble ? approved() : declined()}
              </h1>
              <h1 className="">byout : {house.Byout}</h1>
            </div>
            {!more && (
              <div className="flex justify-end h-fit">
                <button
                  className="w-fit border-b mr-2 text-xs font-medium"
                  onClick={() => setMore(!more)}
                >
                  see more
                </button>
              </div>
            )}
            {more && (
              <>
                <div className="flex justify-evenly">
                  <h1 className=" flex items-center">
                    balcon {house.balcon ? approved() : declined()}
                  </h1>

                  <h1 className=" flex items-center">
                    jarda {house.jarda ? approved() : declined()}
                  </h1>
                  <h1 className=" flex items-center">
                    gaz de ville {house.gaz ? approved() : declined()}
                  </h1>
                  <h1 className=" flex items-center">
                    climatiseur {house.climatiseur ? approved() : declined()}
                  </h1>
                </div>
                <div className="flex justify-evenly">
                  <h1 className=" flex">etage : {house.Etage}</h1>
                  <h1 className="">salle : {house.Salon}</h1>
                  <h1 className="">toillette : {house.toillete}</h1>
                  <h1 className="">koujina : {house.koujina}</h1>
                </div>
                <div className="flex justify-end h-fit">
                  <button
                    className="w-fit border-b mr-2 text-xs font-medium"
                    onClick={() => setMore(!more)}
                  >
                    see less
                  </button>
                </div>
              </>
            )}
          </div>
          <h1 className="text-center text-lg font-medium">Localisation</h1>
          <div className="flex flex-col gap-y-3 border mx-10 py-5 rounded-xl">
            <div className="flex justify-evenly">
              <h1 className="">{house.houma}</h1>
              <h1 className="">{house.mo3tamdiya}</h1>
              <h1 className="">{house.wilaya}</h1>
            </div>
            <h1 className="text-center ">griba mn : {house.griba}</h1>
          </div>
          <h1 className="text-center text-lg font-medium">Prix</h1>
          <h1 className="text-center ">
            {house.prix} dt / {house.prixOption || "moins"}
          </h1>
          <div className="flex justify-center">
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 w-fit"
              onClick={handleOpen}
            >
              voici le numero de proprietere
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 w-1/4">
          {house.images
            .slice(Math.ceil(house.images.length / 2))
            .map((image, index) => (
              <img
                key={index + Math.ceil(house.images.length / 2)}
                src={`https://karya-kpet.onrender.com/${image}`}
                alt={`House ${index + Math.ceil(house.images.length / 2) + 1}`}
                className="w-full border object-cover cursor-pointer"
                onClick={() => handleImageClick(image)}
              />
            ))}
        </div>
      </div>
      {connect && <Connect onClose={() => setConnect(false)} />}
      {isNumberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-fit px-6 pb-6 pt-[10px] bg-white rounded-lg shadow-lg">
            <button
              onClick={() => setIsNumberOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>
            <h1 className="text-center mb-6">the house owner</h1>
            <div className="flex flex-col gap-y-2 items-center">
              {user2 ? (
                user2.profilePic ? (
                  <img
                    src={user2.profilePic.startsWith("http") 
                      ? user2.profilePic 
                      : `http://localhost:3000${user2.profilePic}`}
                    alt="Profile"
                    style={{
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                    }}
                  />
                ) : (
                  <img className="w-12 h-12 border rounded-full" src={user1} />
                )
              ) : (
                <p>loading</p>
              )}
              <h1>{user2 ? user2.name : "loading"}</h1>
              <h1>{user2 ? user2.phone_number : "loading"}</h1>
              {user2 ? (
                user2.phoneNumber ? (
                  <h1 className="border">{user2.phoneNumber}</h1>
                ) : (
                  <h>loading</h>
                )
              ) : (
                <h1>loading</h1>
              )}
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={closeModal}
        >
          <div className="relative flex items-center justify-center">
            <img
              src={`https://karya-kpet.onrender.com/${selectedImage}`}
              alt="Enlarged House"
              className="max-w-[80%] max-h-[80%] border  "
            />
            <button
              className="absolute top-2 right-2 text-white"
              onClick={closeModal}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default HouseDetails;
