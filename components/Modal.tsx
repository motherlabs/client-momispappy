import React from "react";
import BackDrop from "./BackDrop";

type Props = {
  onCloseModal?: () => void;
  children: React.ReactChild;
  full?: boolean;
  wrapClassName?: string;
  isExit?: boolean;
  exitStyle?: string;
  backDropEvent?: () => void;
  className?: string;
  backDropClassName?: string;
  maxWidth?: string;
};

export default function Modal({ children, full = false, onCloseModal, wrapClassName = "", isExit = false, exitStyle = "", backDropEvent = () => {}, className = "", backDropClassName = "", maxWidth = "" }: Props) {
  return (
    <div className={`${wrapClassName} fixed inset-0 z-50 `}>
      <BackDrop backDropClassName={backDropClassName} onCloseModal={backDropEvent} />
      <div className="fixed z-50 inset-0 w-full top-[14%]">
        <div className="w-full text-white text-6xl text-center">MotherLabs</div>
      </div>
      <div className={` fixed z-50  ${full ? "bottom-0" : "top-2/4 -translate-y-2/4"} w-full flex justify-center z-50 `}>
        <div className={`${className} ${maxWidth} w-full ${full ? "px-0" : "px-4"}`}>
          <div className={` w-full bg-white pb-[2px]  ${full ? "rounded-t-lg" : "rounded-lg"}`}>
            {isExit && <div className={`flex w-full items-center justify-start ${exitStyle} `}>{/* <i className="fa-solid fa-xmark text-2xl" onClick={onCloseModal}></i> */}</div>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
