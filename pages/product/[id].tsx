import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import wrapper from "../../store";
import { RootState } from "../../store/reducer";

export default function ProductDetail() {
  // useEffect(() => {
  //   const authApiHandler = async () => {
  //     console.log(process.env.NEXT_PUBLIC_SERVER_URL);
  //     try {
  //       const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth`);
  //       console.log("res", response.data);
  //     } catch (e) {
  //       if (axios.isAxiosError(e)) {
  //         console.log(e.request.status);
  //       }
  //     }
  //   };
  //   authApiHandler();
  // }, []);

  const user = !!useSelector((state: RootState) => state.user.me.id);
  console.log(user);
  const router = useRouter();
  console.log(router.query.id);
  return <div>ProductDetail</div>;
}
