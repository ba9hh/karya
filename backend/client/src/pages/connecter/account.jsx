import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import user0 from "../../assets/icons/user.png";
import axios from "axios";
import tag from "../../assets/icons/tag.png";
import bed from "../../assets/icons/bed.png";
import invisible from "../../assets/icons/invisible.png";
import visible from "../../assets/icons/visible.png";
import edit from "../../assets/icons/edit.png";
import deleteIcon from "../../assets/icons/delete.png";
import redHeart from "../../assets/icons/redHeart.svg";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import AddNumber from "../../components/AddNumber";

const Account = () => {
  const navigate = useNavigate();
  const { handleLogout, user, setUser } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validateNumber, setValidateNumber] = useState(false);
  const [userVisiblePosts, setUserVisiblePosts] = useState([]);
  const [userInvisiblePosts, setUserInvisiblePosts] = useState([]);
  const [likedHouses, setLikedHouses] = useState([]);
  const [openWindow, setOpenWindow] = useState("visiblePosts");
  const [openModifier, setOpenModifier] = useState(false);
  const [openModifierPassword, setOpenModifierPassword] = useState(false);
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState("");

  useEffect(() => {
    // Store original values when the modal opens
    if (user) {
      setOriginalUsername(user.name);
      setOriginalPhoneNumber(user.phone_number);
    }
  }, [openModifier]);
  const canConfirm =
    username.trim() !== "" &&
    (username !== originalUsername || phoneNumber !== originalPhoneNumber);

  useEffect(() => {
    if (user) {
      setUsername(user.name || "");
      setPhoneNumber(user.phone_number || "");
    }
  }, [user]); // Run when `user` data changes
  useEffect(() => {
    if (location.state && location.state.openedWindow) {
      // Update state based on passed value
      setOpenWindow(location.state.openedWindow);
    }
  }, [location.state]);
  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await axios.get(
          "https://karya-kpet.onrender.com/api/user-liked-houses",
          {
            withCredentials: true, // Ensure the token is sent in the request
          }
        );
        setLikedHouses(response.data); // Set the liked posts in state
      } catch (error) {
        console.error("Error fetching liked posts:", error);
      }
    };

    if (user) {
      fetchLikedPosts();
    }
  }, [user]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          `https://karya-kpet.onrender.com/api/user-posts`
        );
        const { visiblePosts, invisiblePosts } = response.data;
        setUserVisiblePosts(visiblePosts);
        setUserInvisiblePosts(invisiblePosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user]);
  const [error, setError] = useState(""); // To store the error message

  const validatePhoneNumber = (number) => {
    const regex = /^\d{8}$/; // Regex for exactly 8 digits
    return regex.test(number);
  };

  const handlePhoneNumberChange = (e) => {
    const newNumber = e.target.value;
    setPhoneNumber(newNumber);

    // Validate phone number format
    if (newNumber && !validatePhoneNumber(newNumber)) {
      setError("Phone number must be exactly 8 digits.");
    } else if (
      newNumber === "" &&
      (userVisiblePosts.length > 0 || userInvisiblePosts.length > 0)
    ) {
      setError("you need to set a number");
    } else {
      setError("");
    }
  };
  
  const handleSaveChanges = async () => {
    if (error) {
      alert("Please correct the errors before saving.");
      return;
    }

    try {
      const response = await axios.put(
        "https://karya-kpet.onrender.com/api/update-user",
        {
          username,
          phoneNumber,
        }
      );
      alert("Details updated successfully!");
      setUser(response.data.user);
      setOpenModifier(false);
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("Failed to update details. Please try again.");
    }
  };
  const updatePostVisibility = async (postId, newVisibility) => {
    try {
      const response = await axios.put(
        `https://karya-kpet.onrender.com/api/house/${postId}/visibility`,
        {
          visibility: newVisibility,
        }
      );
      if (response.status === 200) {
        if (newVisibility) {
          // Move the post from invisiblePosts to visiblePosts
          setUserInvisiblePosts((prevInvisiblePosts) =>
            prevInvisiblePosts.filter((post) => post._id !== postId)
          );
          setUserVisiblePosts((prevVisiblePosts) => [
            ...prevVisiblePosts,
            response.data, // Use the updated post from the response
          ]);
        } else {
          // Move the post from visiblePosts to invisiblePosts
          setUserVisiblePosts((prevVisiblePosts) =>
            prevVisiblePosts.filter((post) => post._id !== postId)
          );
          setUserInvisiblePosts((prevInvisiblePosts) => [
            ...prevInvisiblePosts,
            response.data, // Use the updated post from the response
          ]);
        }
      }
    } catch (error) {
      console.error("Error updating post visibility:", error);
    }
  };
  const toggleLike = async (houseId) => {
    try {
      const response = await axios.post(
        "https://karya-kpet.onrender.com/api/toggle-like",
        { houseId }
      );
      console.log(response.data);
      if (response.data.success) {
        if (likedHouses.some((house) => house._id === houseId)) {
          setLikedHouses(likedHouses.filter((house) => house._id !== houseId));
        } else {
          setLikedHouses([...likedHouses, houseId]);
        }
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };
  // there is a wrong with this code (it work but it always catch)
  const deleteHouse = async (postId) => {
    try {
      const response = await axios.delete(
        `https://karya-kpet.onrender.com/api/house/${postId}`
      );
      if (response.status === 200) {
        setUserVisiblePosts((prevVisiblePosts) =>
          prevVisiblePosts.filter((post) => post._id !== postId)
        );

        setUserInvisiblePosts((prevInvisiblePosts) =>
          prevInvisiblePosts.filter((post) => post._id !== postId)
        );
      }
    } catch (error) {
      console.error(
        "Error deleting house:",
        error.response?.data || error.message
      );
    }
  };
  const deleteAccount = async () => {
    try {
      const response = await axios.delete("https://karya-kpet.onrender.com/api/user", {
        withCredentials: true,
      });

      if (response.status === 200) {
        // Remove the deleted house from visible or invisible posts
        navigate("/login");

        console.log("Account deleted successfully:", response.data);
      }
    } catch (error) {
      console.error(
        "Error deleting house:",
        error.response?.data || error.message
      );
    }
  };
  const logoutClick = () => {
    navigate("/login");
    handleLogout();
  };
  const [fileToUpload, setFileToUpload] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // Generate a temporary URL to preview the image
      setFileToUpload(file);
    }
  };

  const handleProfilePicUpload = async () => {
    if (!fileToUpload) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", fileToUpload);

    try {
      const response = await axios.post(
        "https://karya-kpet.onrender.com/api/auth/upload-profile-pic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data.user); // Update the user state with the new profile picture
      alert("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture");
    }
  };

  const updatePassword = async () => {
    try {
      const response = await axios.post("https://karya-kpet.onrender.com/api/update-password", {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        alert("Mot de passe changé avec succès.");
        setOpenModifierPassword(false);
      } else {
        alert(
          response.data.message || "Erreur lors du changement de mot de passe."
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de changer le mot de passe.");
    }
  };
  const handlePasswordSaveChanges = () => {
    if (!currentPassword) {
      alert("Veuillez entrer votre mot de passe actuelle.");
      return;
    }
    if (newPassword.length < 8) {
      alert("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Le nouveau mot de passe et la confirmation ne correspondent pas.");
      return;
    }

    // Proceed with saving changes
    updatePassword();
  };

  const Part1 = () => {
    return (
      <div className="w-1/6 h-2/5 border border-gray-400 flex flex-col items-center pt-7 gap-2 rounded-2xl">
        {user ? (
          user.profilePic ? (
            <img
              src={
                user.profilePic.startsWith("http")
                  ? user.profilePic
                  : `https://karya-kpet.onrender.com${user.profilePic}`
              }
              alt="Profile"
              style={{ borderRadius: "50%", width: "50px", height: "50px" }}
            />
          ) : (
            <img className="w-1/5 rounded-full border" src={user0} />
          )
        ) : (
          <p>loading</p>
        )}
        {user ? <h1 className="border">{user.name}</h1> : <p>Loading...</p>}
        {user ? (
          user.phone_number ? (
            <h1 className="border">{user.phone_number}</h1>
          ) : (
            <button
              className="py-2 px-4 border hover:border-black rounded-xl"
              onClick={() => setValidateNumber(!validateNumber)}
            >
              sajal numero tlphn
            </button>
          )
        ) : (
          <p>Loading...</p>
        )}

        <div className="flex flex-col xl:flex-row gap-2">
          <button
            className="py-2 px-4 border hover:border-black rounded-xl"
            onClick={() => setOpenModifier(!openModifier)}
          >
            modifier
          </button>
          <button
            onClick={logoutClick}
            className="py-2 px-4 border hover:border-black rounded-xl"
          >
            logout
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col h-[101vh]">
      <div className="h-20"></div>
      <div className="flex items-center justify-evenly flex-grow border-4">
        <Part1 />
        <div className="w-4/6 h-[90%] border">
          <div className="  flex">
            <div
              className={`flex justify-center py-2 w-1/2 h-fit cursor-pointer ${
                openWindow == "visiblePosts" ? "border-b-4" : "border-b-2"
              }`}
              onClick={() => setOpenWindow("visiblePosts")}
            >
              <h1>votre posts</h1>
            </div>
            <div
              className={`flex justify-center py-2 w-1/2 h-fit cursor-pointer ${
                openWindow == "invisiblePosts" ? "border-b-4" : "border-b-2"
              }`}
              onClick={() => setOpenWindow("invisiblePosts")}
            >
              <h1>votre hidden posts</h1>
            </div>
            <div
              className={`flex justify-center py-2 w-1/2 h-fit cursor-pointer ${
                openWindow == "likedPosts" ? "border-b-4" : "border-b-2"
              }`}
              onClick={() => setOpenWindow("likedPosts")}
            >
              <h1>liked posts</h1>
            </div>
          </div>
          <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-8 gap-y-10 max-h-[500px] overflow-y-auto overflow-hidden p-10">
            {openWindow == "visiblePosts" &&
              (userVisiblePosts.length > 0 ? (
                userVisiblePosts.map((post) => (
                  <div key={post._id}>
                    <Link to={"/houses/" + post._id}>
                      <div className="grid grid-cols-2 gap-1 mb-3">
                        <img
                          className="w-full h-36 border  rounded-xl object-cover"
                          src={`https://karya-kpet.onrender.com/${post.images[0]}`}
                        />
                        <img
                          className="w-full h-36 border  rounded-xl object-cover"
                          src={`https://karya-kpet.onrender.com/${post.images[1]}`}
                        />
                        <img
                          className="w-full h-36 border  rounded-xl object-cover"
                          src={`https://karya-kpet.onrender.com/${post.images[2]}`}
                        />
                        <img
                          className="w-full h-36 border  rounded-xl object-cover"
                          src={`https://karya-kpet.onrender.com/${post.images[3]}`}
                        />
                      </div>
                      <h1 className="text-center text-lg font-normal">
                        {post.wilaya},{post.mo3tamdiya}
                      </h1>
                      <h1 className="text-center crimsonText text-sm text-[#B2B2B2]">
                        pour {post.lchkon}
                      </h1>
                      <div className="flex justify-center items-center gap-2">
                        <div className="flex items-center gap-1">
                          <img className="w-4 h-4 border" src={tag} />
                          <h1 className="border">
                            {post.prix}dt/{post.prixOption}
                          </h1>
                        </div>
                        <div className="flex items-center gap-1">
                          <img className="w-4 h-4" src={bed} />
                          <h1>{post.Byout} chambres</h1>
                        </div>
                      </div>
                    </Link>
                    <div className="flex justify-center gap-2 mt-1">
                      <Link to={"/modifierHouse/" + post._id}>
                        <img
                          src={edit}
                          className="w-8 h-8 p-1 rounded-md border hover:border-black cursor-pointer"
                        />
                      </Link>
                      <img
                        src={invisible}
                        className="w-8 h-8 p-1 rounded-full border hover:border-black cursor-pointer"
                        onClick={() =>
                          updatePostVisibility(post._id, !post.visibility)
                        }
                      />
                      <img
                        src={deleteIcon}
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this post?"
                            )
                          ) {
                            deleteHouse(post._id);
                          }
                        }}
                        className="w-8 h-8 p-1 rounded-md border hover:border-black cursor-pointer"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>No posts yet</p>
              ))}
            {openWindow == "invisiblePosts" &&
              (userInvisiblePosts.length > 0 ? (
                userInvisiblePosts.map((post) => (
                  <div key={post._id}>
                    <Link to={"/houses/" + post._id}>
                      <div className="grid grid-cols-2 gap-1 mb-3">
                        <img
                          className="w-full h-36 border  rounded-xl object-cover"
                          src={`https://karya-kpet.onrender.com/${post.images[0]}`}
                        />
                        <img
                          className="w-full h-36 border  rounded-xl object-cover"
                          src={`https://karya-kpet.onrender.com/${post.images[1]}`}
                        />
                        <img
                          className="w-full h-36 border  rounded-xl object-cover"
                          src={`https://karya-kpet.onrender.com/${post.images[2]}`}
                        />
                        <img
                          className="w-full h-36 border  rounded-xl object-cover"
                          src={`https://karya-kpet.onrender.com/${post.images[3]}`}
                        />
                      </div>
                      <h1 className="text-center text-lg font-normal">
                        {post.wilaya},{post.mo3tamdiya}
                      </h1>
                      <h1 className="text-center crimsonText text-sm text-[#B2B2B2]">
                        {post.desvoyageurs
                          ? "pour des voyageurs"
                          : post.desetudiants
                          ? "pour des etudiants"
                          : "pour une famille"}
                      </h1>
                      <div className="flex justify-center items-center gap-2">
                        <div className="flex items-center gap-1">
                          <img className="w-4 h-4 border" src={tag} />
                          <h1 className="border">
                            {post.prix}dt/{post.prixOption}
                          </h1>
                        </div>
                        <div className="flex items-center gap-1">
                          <img className="w-4 h-4" src={bed} />
                          <h1>{post.Byout} chambres</h1>
                        </div>
                      </div>
                    </Link>
                    <div className="flex justify-center gap-2 mt-1">
                      <img
                        src={edit}
                        className="w-8 h-8 p-1 rounded-md border hover:border-black cursor-pointer"
                      />
                      <img
                        src={visible}
                        className="w-8 h-8 p-1 rounded-full border hover:border-black cursor-pointer"
                        onClick={() =>
                          updatePostVisibility(post._id, !post.visibility)
                        }
                      />
                      <img
                        src={deleteIcon}
                        onClick={() => deleteHouse(post._id)}
                        className="w-8 h-8 p-1 rounded-md border hover:border-black cursor-pointer"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>No hidden posts yet</p>
              ))}

            {openWindow == "likedPosts" &&
              (likedHouses.length > 0 ? (
                likedHouses.map((house) => (
                  <div key={house._id}>
                    <Link to={"/houses/" + house._id}>
                      <div className="grid grid-cols-2 gap-1 mb-3">
                        <img
                          className="w-full h-36 border  rounded-xl object-cover"
                          src={`https://karya-kpet.onrender.com/${house.images[0]}`}
                        />
                        <img
                          className="w-full h-36 border  rounded-xl object-cover"
                          src={`https://karya-kpet.onrender.com/${house.images[1]}`}
                        />
                        <img
                          className="w-full h-36 border  rounded-xl object-cover"
                          src={`https://karya-kpet.onrender.com/${house.images[2]}`}
                        />
                        <img
                          className="w-full h-36 border  rounded-xl object-cover"
                          src={`https://karya-kpet.onrender.com/${house.images[3]}`}
                        />
                      </div>
                    </Link>
                    <div
                      className="flex justify-end cursor-pointer z-40"
                      onClick={() => toggleLike(house._id)}
                    >
                      <img src={redHeart} alt="like button" className="w-5" />
                    </div>
                    <Link to={"/houses/" + house._id}>
                      <h1 className="text-center text-lg font-normal">
                        {house.wilaya},{house.mo3tamdiya}
                      </h1>
                      <h1 className="text-center crimsonText text-sm text-[#B2B2B2]">
                        {house.desvoyageurs
                          ? "pour des voyageurs"
                          : house.desetudiants
                          ? "pour des etudiants"
                          : "pour une famille"}
                      </h1>
                      <div className="flex justify-center items-center gap-2">
                        <div className="flex items-center gap-1">
                          <img className="w-4 h-4 border" src={tag} />
                          <h1 className="border">{house.prix}dt/moins</h1>
                        </div>
                        <div className="flex items-center gap-1">
                          <img className="w-4 h-4" src={bed} />
                          <h1>{house.Byout} chambres</h1>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p>No liked houses yet</p>
              ))}
          </div>
        </div>
      </div>
      {openModifier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-1/3 px-6 pb-6 pt-3 bg-white rounded-lg shadow-lg flex flex-col gap-y-2">
            <button
              onClick={() => setOpenModifier(!openModifier)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>
            <h1 className="text-center">modifier account</h1>
            <div className="flex flex-col items-center justify-center mt-4">
              <div className="flex flex-col items-center space-y-2">
                <label
                  htmlFor="profilePic"
                  className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Selected profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : user ? (
                    user.profilePic ? (
                      <img
                        src={
                          user.profilePic.startsWith("http")
                            ? user.profilePic
                            : `http://localhost:3000${user.profilePic}`
                        }
                        alt="Profile"
                        style={{
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                        }}
                      />
                    ) : (
                      <img
                        className="w-12 h-12 rounded-full border"
                        src={user0}
                      />
                    )
                  ) : (
                    <p>loading</p>
                  )}
                  <input
                    id="profilePic"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                <button
                  className="text-sm border-b border-gray-300 hover:border-black hover:text-black cursor-pointer transition-all"
                  onClick={handleProfilePicUpload}
                >
                  Changer pdp
                </button>
              </div>
            </div>
            <h1>Username</h1>
            <input
              className="px-2 py-1 border"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <h1>numero de telephone</h1>
            <input
              className="px-2 py-1 border"
              type="text"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />

            <button
              className={`border px-2 py-1 mt-3 ${
                user
                  ? user.signinMethod == "google"
                    ? "cursor-not-allowed"
                    : "hover:border-black"
                  : ""
              }`}
              onClick={() => {
                setOpenModifierPassword(!openModifierPassword);
                setOpenModifier(!openModifier);
              }}
              disabled={user ? user.signinMethod == "google" : ""}
            >
              modifier votre mot de passe
            </button>
            <button
              className="text-red-600 border border-red-200 px-2 py-1 mt-3 hover:border-red-600"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this account?"
                  )
                ) {
                  deleteAccount();
                }
              }}
            >
              delete account
            </button>
            <div className="flex justify-end gap-x-4 mt-4">
              <button
                className="border-b"
                onClick={() => {
                  setOpenModifier(!openModifier);
                  setPhoneNumber(user ? user.phone_number : "");
                  setUsername(user ? user.name : "");
                }}
              >
                Cancel
              </button>
              <button
                className={`px-2 py-1 text-white rounded ${
                  canConfirm
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                onClick={() => handleSaveChanges()}
                disabled={!canConfirm}
              >
                confirmer
              </button>
            </div>
          </div>
        </div>
      )}
      {validateNumber && <AddNumber onClose={() => setValidateNumber(false)} />}
      {openModifierPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-1/3 px-6 pb-6 pt-3 bg-white rounded-lg shadow-lg flex flex-col gap-y-2">
            <button
              onClick={() => setOpenModifierPassword(!openModifierPassword)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>
            <h1 className="text-center">modifier mot de passe</h1>
            <div className="flex flex-col items-center justify-center mt-4"></div>
            <h1>Votre mot de passe actuelle</h1>
            <input
              className="px-2 py-1 border"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <h1>Votre nouveau mot de passe</h1>
            <input
              className="px-2 py-1 border"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <h1>Confirmer votre nouveau mot de passe</h1>
            <input
              className="px-2 py-1 border"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="flex justify-between  mt-4">
              <button
                onClick={() => {
                  setOpenModifierPassword(!openModifierPassword);
                  setOpenModifier(!openModifier);
                }}
              >
                retour
              </button>
              <div className="flex gap-x-4">
                <button
                  className="border-b"
                  onClick={() => setOpenModifierPassword(!openModifierPassword)}
                >
                  Cancel
                </button>
                <button
                  className="px-2 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                  onClick={() => handlePasswordSaveChanges()}
                >
                  confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
