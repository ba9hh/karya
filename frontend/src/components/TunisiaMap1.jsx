import { useState } from "react";
import tunisiaMap from "../assets/images/tunisiaMap.png";
import wilayat from "../data/wilayat";
import mo3tamdiyat from "../data/mo3tamdiyat";
const TunisiaMap1 = ({
  buttonStyle,
  setWilaya1,
  setMo3tamdiya1,
  wilaya1,
  mo3tamdiya1,
}) => {
  const [wilaya, setWilaya] = useState("Wilaya");
  const [mo3tamdiya, setMo3tamdiya] = useState("Mo3tamdiya");
  const [wilayaIndex, setWilayaIndex] = useState(0);

  const handleWilayaClick = (state, index) => {
    setWilaya(state);
    setWilayaIndex(index);
  };
  const handleMo3tamdiyaClick = (state) => {
    setMo3tamdiya(state);
  };

  const [isOpenWilaya, setIsOpenWilaya] = useState(false);
  const [isOpenMo3tamdiya, setIsOpenMo3tamdiya] = useState(false);

  const wilayaPopup = () => {
    setIsOpenWilaya(!isOpenWilaya);
  };
  const mo3tamdiyaPopup = () => {
    if (wilaya == "Wilaya") {
      wilayaPopup();
    } else {
      setIsOpenMo3tamdiya(!isOpenMo3tamdiya);
    }
  };
  const handleNext0 = () => {
    wilayaPopup();
    mo3tamdiyaPopup();
    setWilaya1(wilaya);
  };
  const handleNext1 = () => {
    mo3tamdiyaPopup();

    setMo3tamdiya1(mo3tamdiya);
  };
  return (
    <div className="relative">
      <div className="flex">
        {[
          { value: wilaya1, onClick: wilayaPopup },
          { value: mo3tamdiya1, onClick: mo3tamdiyaPopup },
        ].map(({ value, onClick }, idx) => (
          <div key={idx} className="flex items-center px-4">
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

      {isOpenWilaya && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-4/5 p-6 bg-white rounded-lg shadow-lg">
            <button
              onClick={wilayaPopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-center mb-14">
              e5tar lwilaya
            </h2>
            <div className="flex">
              <div className="w-1/2 flex flex-col justify-center items-center gap-4 border ">
                <div className="flex flex-wrap gap-4 justify-center w-3/4">
                  {wilayat.map((wilay, index) => (
                    <button
                      key={wilay}
                      onClick={() => handleWilayaClick(wilay, index)}
                      className={`px-4 py-2 border  rounded-md ${
                        wilaya == wilay
                          ? "border-blue-700 text-blue-700"
                          : "hover:border-black"
                      }`}
                    >
                      {wilay}
                    </button>
                  ))}
                </div>
              </div>
              <div className=" flex items-center justify-center w-1/2 ">
                <img className="h-96" src={tunisiaMap} />
              </div>
            </div>
            <div className="flex justify-between w-1/2">
              <button
                onClick={wilayaPopup}
                className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Close
              </button>
              <button
                onClick={handleNext0}
                className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {isOpenMo3tamdiya && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-4/5 p-6 bg-white rounded-lg shadow-lg">
            <button
              onClick={mo3tamdiyaPopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-center mb-14">
              e5tar lmo3tamdiya
            </h2>
            <div className="flex">
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
            </div>
            <div className="flex justify-between w-1/2">
              <button
                onClick={mo3tamdiyaPopup}
                className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Close
              </button>
              <button
                onClick={handleNext1}
                className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TunisiaMap1;
