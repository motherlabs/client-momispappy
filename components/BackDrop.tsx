import React from "react";

type Props = {
  onCloseModal: () => void;
  backDropClassName?: string;
};

export default function BackDrop({ onCloseModal, backDropClassName }: Props) {
  return <div onClick={onCloseModal} className={`${backDropClassName} z-20 fixed inset-0 bg-black`}></div>;
}
