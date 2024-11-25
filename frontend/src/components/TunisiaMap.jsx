import { useState } from "react";
import tunisiaMap from "../assets/images/tunisiaMap.png";
import wilayat from "../data/wilayat";
import mo3tamdiyat from "../data/mo3tamdiyat";

const Popup = ({
  isOpen,
  onClose,
  title,
  children,
  nextAction,
  backAction,
  cbon,
}) => {
  if (!isOpen) return null; // Only render if the popup is open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-4/5 p-6 bg-white rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center mb-14">{title}</h2>

        <div className="flex">{children}</div>

        <div className="flex">
          <div className="flex justify-between w-1/2">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Annule
              </button>
              <button
                className="mt-4 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                onClick={cbon}
              >
                Cbon
              </button>
            </div>

            <div className="flex gap-3">
              <button
                className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={backAction}
              >
                {"<<"}
              </button>
              <button
                onClick={nextAction}
                className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TunisiaMap = ({
  buttonStyle,
  setWilaya1,
  setMo3tamdiya1,
  setChkon1,
  setChambre1,
  wilaya1,
  mo3tamdiya1,
  chkon1,
  chambre1,
}) => {
  const chkonList = [
    "c'est pour une famille",
    "c'est pour des etudiants",
    "c'est pour des voyageurs",
  ];

  const [wilaya, setWilaya] = useState(null);
  const [mo3tamdiya, setMo3tamdiya] = useState(null);
  const [chkon, setChkon] = useState(null);
  const [chambre, setChambre] = useState(null);
  const [wilayaIndex, setWilayaIndex] = useState(0);

  console.log(wilaya);
  const handleWilayaClick = (state, index) => {
    if (wilaya == state) {
      setWilaya(null);
      setWilayaIndex(0);
    } else {
      setWilaya(state);
      setWilayaIndex(index);
    }
  };
  const handleMo3tamdiyaClick = (state) => {
    if (mo3tamdiya == state) {
      setMo3tamdiya(null);
    } else {
      setMo3tamdiya(state);
    }
  };
  const handleChkonClick = (state) => {
    if (chkon == state) {
      setChkon(null);
    } else {
      setChkon(state);
    }
  };

  const [isOpenWilaya, setIsOpenWilaya] = useState(false);
  const [isOpenMo3tamdiya, setIsOpenMo3tamdiya] = useState(false);
  const [isOpenChkon, setIsOpenChkon] = useState(false);
  const [isOpenChambre, setIsOpenChambre] = useState(false);

  /***********************/

  const chkonPopup = () => {
    setIsOpenChkon(!isOpenChkon);
  };
  const chambrePopup = () => {
    setIsOpenChambre(!isOpenChambre);
  };
  const wilayaPopup = () => {
    setIsOpenWilaya(!isOpenWilaya);
  };
  const mo3tamdiyaPopup = () => {
    if (wilaya) {
      setIsOpenMo3tamdiya(!isOpenMo3tamdiya);
    } else {
      wilayaPopup();
    }
  };

  /**********************/
  const handleNext0 = () => {
    if (wilaya) {
      wilayaPopup();
      mo3tamdiyaPopup();
      setWilaya1(wilaya);
    } else {
      wilayaPopup();
      chkonPopup();
      setWilaya1("wilaya");
    }
  };
  const handleNext1 = () => {
    if (mo3tamdiya) {
      mo3tamdiyaPopup();
      chkonPopup();
      setMo3tamdiya1(mo3tamdiya);
    } else {
      mo3tamdiyaPopup();
      chkonPopup();
      setMo3tamdiya1("mo3tamdiya");
    }
  };
  const handleNext2 = () => {
    if (chkon) {
      chkonPopup();
      chambrePopup();
      setChkon1(chkon);
    } else {
      chkonPopup();
      chambrePopup();
      setChkon1("lchkon dar");
    }
  };
  const handleNext3 = () => {
    if (chambre === null) {
      chambrePopup();
      setChambre1("nbr de chambres");
    } else {
      setChambre1(chambre);
      chambrePopup();
    }
  };
  const handleCbon0 = () => {
    if (wilaya) {
      wilayaPopup();
      setWilaya1(wilaya);
    } else {
      wilayaPopup();
      setWilaya1("wilaya");
    }
  };
  const handleCbon1 = () => {
    if (mo3tamdiya) {
      mo3tamdiyaPopup();
      setMo3tamdiya1(mo3tamdiya);
    } else {
      mo3tamdiyaPopup();
      setMo3tamdiya1("mo3tamdiya");
    }
  };
  const handleCbon2 = () => {
    if (chkon) {
      chkonPopup();
      setChkon1(chkon);
    } else {
      chkonPopup();
      setChkon1("lchkon dar");
    }
  };
  const handleCbon3 = () => {
    if (chambre === null) {
      chambrePopup();
      setChambre1("nbr de chambres");
    } else {
      setChambre1(chambre);
      chambrePopup();
    }
  };
  /**********************/
  const handleBack0 = () => {
    if (mo3tamdiya) {
      mo3tamdiyaPopup();
      wilayaPopup();
      setMo3tamdiya1(mo3tamdiya);
    } else {
      mo3tamdiyaPopup();
      wilayaPopup();
      setMo3tamdiya1("mo3tamdiya");
    }
  };
  const handleBack1 = () => {
    if (mo3tamdiya1 !== "mo3tamdiya") {
      if (chkon) {
        chkonPopup();
        mo3tamdiyaPopup();
        setChkon1(chkon)
      }else{
        chkonPopup();
        mo3tamdiyaPopup();
        setChkon1("lchkon dar")
      }
    } else {
      if (chkon) {
        chkonPopup();
        wilayaPopup();
        setChkon1(chkon)
      }else{
        chkonPopup();
        wilayaPopup();
        setChkon1("lchkon dar")
      }
    }
  };
  const handleBack2 = () => {
    if (chambre === null) {
      chambrePopup();
      chkonPopup();
      setChambre1("nbr de chambres");
    } else {
      setChambre1(chambre);
      chambrePopup();
      chkonPopup();
    }
    
  };

  /************************/
  const onClose0 = () => {
    wilayaPopup();
    setWilaya(null);
    setMo3tamdiya(null);
    setChkon(null);
    setChambre(null);
    setWilaya1("wilaya");
    setMo3tamdiya1("mo3tamdiya");
    setChkon1("lchkon dar");
    setChambre1("nbr de chambres");
  };
  const onClose1 = () => {
    mo3tamdiyaPopup();
    setWilaya(null);
    setMo3tamdiya(null);
    setChkon(null);
    setChambre(null);
    setWilaya1("wilaya");
    setMo3tamdiya1("mo3tamdiya");
    setChkon1("lchkon dar");
    setChambre1("nbr de chambres");
  };
  const onClose2 = () => {
    chkonPopup();
    setWilaya(null);
    setMo3tamdiya(null);
    setChkon(null);
    setChambre(null);
    setWilaya1("wilaya");
    setMo3tamdiya1("mo3tamdiya");
    setChkon1("lchkon dar");
    setChambre1("nbr de chambres");
  };
  const onClose3 = () => {
    chambrePopup();
    setWilaya(null);
    setMo3tamdiya(null);
    setChkon(null);
    setChambre(null);
    setWilaya1("wilaya");
    setMo3tamdiya1("mo3tamdiya");
    setChkon1("lchkon dar");
    setChambre1("nbr de chambres");
  };

  /***********************/
  const incrementCount = () => {
    if (chambre === null) {
      setChambre(0);
    } else {
      setChambre(chambre + 1);
    }
  };

  // Function to decrease the count
  const decrementCount = () => {
    if (chambre > 0) {
      // Ensures the  count doesn't go below 1
      setChambre(chambre - 1);
    } else {
      setChambre(null);
    }
  };
  /********************/
  return (
    <div className="relative">
      <div className="flex">
        {[
          {
            value: wilaya1,
            defaultValue: "wilaya",
            onClick: wilayaPopup,
            onDelete: () => {
              setWilaya1("wilaya");
              setWilaya(null);
            },
          },
          {
            value: mo3tamdiya1,
            defaultValue: "mo3tamdiya",
            onClick: mo3tamdiyaPopup,
            onDelete: () => {
              setMo3tamdiya1("mo3tamdiya");
              setMo3tamdiya(null);
            },
          },
          {
            value: chkon1,
            defaultValue: "lchkon dar",
            onClick: chkonPopup,
            onDelete: () => {
              setChkon1("lchkon dar");
              setChkon(null);
            },
          },
          {
            value: chambre1,
            defaultValue: "nbr de chambres",
            onClick: chambrePopup,
            onDelete: () => {
              setChambre1("nbr de chambres");
              setChambre(null);
            },
          },
        ].map(({ value, defaultValue, onClick, onDelete }, idx) => (
          <div key={idx} className="flex items-center px-4">
            {value !== defaultValue && (
              <button
                onClick={onDelete}
                className="border px-2 text-red-500 mr-1"
              >
                x
              </button>
            )}
            <button className={buttonStyle} onClick={onClick}>
              {value}
            </button>
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
          </div>
        ))}
      </div>

      <Popup
        isOpen={isOpenWilaya}
        onClose={onClose0}
        cbon={handleCbon0}
        title="e5tar lwilaya"
        nextAction={handleNext0}
      >
        <div className="w-1/2 flex flex-col justify-center items-center gap-4 border">
          <div className="flex flex-wrap gap-4 justify-center w-3/4">
            {wilayat.map((wilay, index) => (
              <button
                key={wilay}
                onClick={() => handleWilayaClick(wilay, index)}
                className={`px-4 py-2 border rounded-md ${
                  wilaya === wilay
                    ? "border-blue-700 text-blue-700"
                    : "hover:border-black"
                }`}
              >
                {wilay}
              </button>
            ))}
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <img className="h-96" src={tunisiaMap} alt="Map of Tunisia" />
        </div>
      </Popup>

      <Popup
        isOpen={isOpenMo3tamdiya}
        onClose={onClose1}
        cbon={handleCbon1}
        title="e5tar lmo3tamdiya"
        nextAction={handleNext1}
        backAction={handleBack0}
      >
        <div className="w-1/2 flex flex-col justify-center items-center gap-4 border ">
          <div className="flex flex-wrap gap-4 justify-center w-3/4">
            {mo3tamdiyat[wilayaIndex].map((mo3) => (
              <button
                key={mo3}
                onClick={() => handleMo3tamdiyaClick(mo3)}
                className={`px-4 py-2 border  rounded-md ${
                  mo3tamdiya == mo3
                    ? "border-blue-700 text-blue-700"
                    : "hover:border-black"
                }`}
              >
                {mo3}
              </button>
            ))}
          </div>
        </div>
        <div className=" flex items-center justify-center w-1/2 ">
          <img className="h-96" src={tunisiaMap} />
        </div>
      </Popup>

      <Popup
        isOpen={isOpenChkon}
        onClose={onClose2}
        cbon={handleCbon2}
        title="e5tar lchkon"
        nextAction={handleNext2}
        backAction={handleBack1}
      >
        <div className="w-1/2 flex flex-col justify-center items-center gap-4 border ">
          <div className="flex flex-col gap-4 justify-center w-3/4">
            {chkonList.map((chkonn) => (
              <button
                key={chkonn}
                onClick={() => handleChkonClick(chkonn)}
                className={`px-4 py-2 border  rounded-md ${
                  chkon == chkonn
                    ? "border-blue-700 text-blue-700"
                    : "hover:border-black"
                }`}
              >
                {chkonn}
              </button>
            ))}
          </div>
        </div>
        <div className=" flex items-center justify-center w-1/2 ">
          <img className="h-96" src={tunisiaMap} />
        </div>
      </Popup>

      <Popup
        isOpen={isOpenChambre}
        onClose={onClose3}
        cbon={handleCbon3}
        title="nbr de chambre"
        nextAction={handleNext3}
        backAction={handleBack2}
      >
        <div className="w-1/2 flex flex-col justify-center items-center gap-4 border ">
          <div className="flex flex-col gap-4 justify-center items-center border w-3/4 py-3">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">nbr de chambres :</span>
              <button
                onClick={decrementCount}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 h-fit w-6 rounded "
              >
                -
              </button>

              <span>{chambre}</span>

              <button
                onClick={incrementCount}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 h-fit w-6 rounded "
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className=" flex items-center justify-center w-1/2 ">
          <img className="h-96" src={tunisiaMap} />
        </div>
      </Popup>
    </div>
  );
};

export default TunisiaMap;
