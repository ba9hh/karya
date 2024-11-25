import { useState, useContext } from "react";
import addImages from "../../assets/images/addImages.png";
import CustomCheckbox from "../../components/checkbox";
import axios from "axios";
import TunisiaMap1 from "../../components/TunisiaMap1";
import { AuthContext } from "../../AuthProvider";
import Connect from "../connecter/connect";
import AddNumber from "../../components/AddNumber";

const Publication = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [prixOption, setPrixOption] = useState("moins");
  const [connect, setConnect] = useState(false);
  const [validateNumber, setValidateNumber] = useState(false);
  const [wilaya, setWilaya] = useState("wilaya");
  const [mo3tamdiya, setMo3tamdiya] = useState("mo3tamdiya");
  const [houma, setHouma] = useState("");
  const [griba, setGriba] = useState("");
  const [prix, setPrix] = useState("");
  const [houseType, setHouseType] = useState("");
  const [lchkon, setChkon] = useState("lchkon");
  const [visibility, setVisibility] = useState(true);
  const [images, setImages] = useState([]);
  const [counts, setCounts] = useState({
    Etage: 0,
    Salon: 1,
    Byout: 1,
    toillete: 1,
    koujina: 1,
  });
  const [houseDetails, setHouseDetails] = useState({
    dar: false,
    villa: false,
    apartment: false,
    studio: false,
    meuble: false,
    balcon: false,
    jarda: false,
    gaz: false,
    climatiseur: false,
  });

  const increment = (key) => {
    setCounts((prevState) => ({
      ...prevState,
      [key]: prevState[key] + 1,
    }));
  };

  const decrement = (key) => {
    setCounts((prevState) => {
      if (prevState[key] > 0) {
        return {
          ...prevState,
          [key]: prevState[key] - 1,
        };
      }
      return prevState;
    });
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setPrixOption(option);
    setIsOpen(false);
  };

  const handlePropertyChange = (property) => {
    setHouseType((prevValue) => (prevValue === property ? "" : property));
  };

  const handlePropertyChange1 = (property) => {
    setChkon((prevValue) => (prevValue === property ? "" : property));
  };

  const handleCheckboxChange = (property) => {
    setHouseDetails((prevDetails) => ({
      ...prevDetails,
      [property]: !prevDetails[property],
    }));
  };
  const chfamaAkher = [
    { label: "meublé", property: "meuble" },
    { label: "Balcon", property: "balcon" },
    { label: "Jarda", property: "jarda" },
    { label: "gaz de ville", property: "gaz" },
    { label: "Climatiseur", property: "climatiseur" },
  ];

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedImages]);
  };
  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const isFormValid = () => {
    return (
      wilaya !== "wilaya" &&
      mo3tamdiya !== "mo3tamdiya" &&
      houma.trim() !== "" &&
      griba.trim() !== "" &&
      prix.trim() !== "" &&
      houseType.trim() !== "" &&
      lchkon.trim() !== "" &&
      images.length > 3
    );
  };
  const handleSubmit = async (e) => {
    if (user) {
      if (user.phone_number) {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(houseDetails).forEach((key) => {
          formData.append(key, houseDetails[key]);
        });
        Object.keys(counts).forEach((key) => {
          formData.append(key, counts[key]);
        });
        formData.append("houseType", houseType);
        formData.append("lchkon", lchkon);
        formData.append("wilaya", wilaya);
        formData.append("mo3tamdiya", mo3tamdiya);
        formData.append("houma", houma);
        formData.append("griba", griba);
        formData.append("prix", prix);
        formData.append("visibility", visibility);
        formData.append("prixOption", prixOption);
        formData.append("userId", user._id);
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
        try {
          const response = await axios.post(
            "http://localhost:3000/api/house",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setHouseDetails({
            meuble: false,
            balcon: false,
            jarda: false,
            gaz: false,
            climatiseur: false,
          });
          setCounts({
            Etage: 1,
            Salon: 1,
            Byout: 1,
            toillete: 1,
            koujina: 1,
          });
          setImages([]);
          setWilaya("wilaya");
          setMo3tamdiya("mo3tamdiya");
          setChkon("lchkon");
          setHouseType("");
          setHouma("");
          setGriba("");
          setPrix("");
          alert("Votre publication a été publié");
        } catch (error) {
          console.log(error);
        }
      } else {
        setValidateNumber(true);
      }
    } else {
      setConnect(true);
    }
  };

  const Ma3loumat = () => {
    return (
      <div className="xl:w-1/3 w-full border">
        <h1 className="text-center text-lg my-6">Ma3loumat 3la dar</h1>
        <div className="flex flex-col gap-2 mb-2  pl-6">
          <div className="flex gap-3">
            {["apartment", "dar", "studio", "villa"].map((type) => (
              <CustomCheckbox
                key={type}
                label={type}
                checked={houseType === type}
                onChange={() => handlePropertyChange(type)}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <h1>c&apos;est pour :</h1>
            {["une famille", "des etudiants", "des voyageurs"].map((type) => (
              <CustomCheckbox
                key={type}
                label={type}
                checked={lchkon === type}
                onChange={() => handlePropertyChange1(type)}
              />
            ))}
          </div>
          {["Etage", "Salon", "Byout", "toillete", "koujina"].map((label) => (
            <div className="flex items-center space-x-4" key={label}>
              <span className="text-gray-700">{label} :</span>
              <button
                onClick={() => decrement(label)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 h-fit w-6 rounded "
              >
                -
              </button>

              <span>{counts[label]}</span>

              <button
                onClick={() => increment(label)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 h-fit w-6 rounded "
              >
                +
              </button>
            </div>
          ))}
        </div>
        <h1 className="text-base pl-3 my-3">Chfama akher :</h1>
        <div className="my-2 pl-6">
          {chfamaAkher.map(({ label, property }) => (
            <CustomCheckbox
              key={property}
              label={label}
              checked={houseDetails[property]}
              onChange={() => handleCheckboxChange(property)}
            />
          ))}
        </div>
      </div>
    );
  };
  const TsawerDar = () => {
    return (
      <div className="xl:w-1/3 border w-full">
        <h1 className="text-center text-lg my-6">Tsawer dar</h1>
        {images.length < 1 && (
          <div className="flex justify-center items-center py-10">
            <label htmlFor="image-upload" className="cursor-pointer">
              <img
                className={`${images.length > 0 ? "w-8" : "w-80"}`}
                src={addImages}
                alt="Add Images"
              />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                className="hidden"
              />
            </label>
          </div>
        )}
        <div className="flex flex-wrap items-center">
          {images.map((image, index) => (
            <div key={index} className="relative m-2">
              <img
                src={URL.createObjectURL(image)} // Create a preview URL for the image
                alt={`Preview ${index}`}
                className="w-32 h-32 object-cover"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
              >
                &times;
              </button>
            </div>
          ))}
          {images.length > 0 && (
            <label htmlFor="image-upload" className="cursor-pointer">
              <img className="w-32 h-32" src={addImages} alt="Add Images" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[101vh]">
      <div className="h-20"></div>
      <div className="border-4 flex-grow flex justify-center items-center">
        <div className="flex flex-col xl:flex-row w-full">
          <TsawerDar />
          <Ma3loumat />
          <div className="xl:w-1/3 w-full border">
            <h1 className="text-center text-lg my-6">localisation mta3 dar</h1>
            <div className="flex flex-col gap-4">
              <div className="flex w-fit m-auto border">
                <TunisiaMap1
                  buttonStyle="text-[#6D6D6D]  px-4 py-2"
                  setWilaya1={setWilaya}
                  setMo3tamdiya1={setMo3tamdiya}
                  wilaya1={wilaya}
                  mo3tamdiya1={mo3tamdiya}
                />
              </div>
              <input
                type="text"
                placeholder="esm l7ouma wla nahj"
                value={houma}
                onChange={(e) => setHouma(e.target.value)}
                className=" block border px-4 py-2 w-[90%] rounded-lg m-auto"
                required
              />
              <input
                className=" block border px-4 py-2 w-[90%] rounded-lg m-auto"
                type="text"
                placeholder="esm 9ahwa wla restaurant wla haja ma3roufa greba ml dar"
                value={griba}
                onChange={(e) => setGriba(e.target.value)}
                required
              />
            </div>
            <h1 className="text-center text-lg my-6">Soum dar</h1>
            <div className="flex justify-center items-center gap-4">
              <input
                className=" block border px-4 py-2 w-32 rounded-lg no-arrows"
                type="number"
                placeholder="450 dt"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                required
              />
              <h1>/</h1>
              <div className="relative inline-block text-left">
                <div
                  className="flex items-center px-4 border cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <button className="  text-[#6D6D6D]  px-4 py-2">
                    {prixOption}
                  </button>
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </a>
                </div>
                {isOpen && (
                  <div className="absolute right-0 z-10 w-full mt-2 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <button
                        onClick={() => handleOptionClick("moins")}
                        className="block px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        moins
                      </button>
                      <button
                        onClick={() => handleOptionClick("jours")}
                        className="block px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        jours
                      </button>
                      <button
                        onClick={() => handleOptionClick("semaines")}
                        className="block px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        semaines
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-14">
              <button
                className={`mt-4 px-4 py-2 text-white ${
                  isFormValid()
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                } rounded`}
                onClick={handleSubmit}
                disabled={!isFormValid()}
              >
                Publier
              </button>
            </div>
          </div>
        </div>
        {connect && <Connect onClose={() => setConnect(false)} />}
        {validateNumber && (
          <AddNumber onClose={() => setValidateNumber(false)} />
        )}
      </div>
    </div>
  );
};

export default Publication;
