import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import OpenedFilter from "./openedFilter";
const Filters = () => {
  const [open , setOpen] = useState(false);
  const [filter ,setFilter] =useState(null)
  
  const filters = [
    "type mta3 dar",
    "prix",
    "wilaya",
    "mo3tamdiya",
    "lchkon dar",
    "nbr de chambre",
    "autres",
  ];
  const Filter = ({ filterName, index }) => {
    const ref = useRef(null);
    const isView = useInView(ref, { once: true });
    const controls = useAnimation();
    useEffect(() => {
      if (isView) {
        controls.start("visible");
      }
    }, [isView]);
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ type: "spring", stiffness: 100, delay: index * 0.2 }}
      >
        <div
          className="flex gap-1 p-1 border rounded-full cursor-pointer"
          onClick={() => {setOpen(true)
            setFilter(filterName)
          }}
        >
          <h1 className="pl-3">{filterName}</h1>
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
      </motion.div>
    );
  };
  return (
    <div className="mt-8">
      <div className="flex justify-center items-center gap-3">
      <div className="flex-grow border-t border-gray-300"></div>
        {filters.map((filter, i) => (
          <Filter key={i} filterName={filter} index={i} />
        ))}
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      {open && <OpenedFilter open={open} setOpen={setOpen} filter={filter} />}
    </div>
  );
};

export default Filters;
