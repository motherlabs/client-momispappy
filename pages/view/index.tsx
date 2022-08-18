import axios from "axios";
import type { NextPage } from "next";
import { useCallback, useState } from "react";

import Brand from "../../components/Brand";
import Category from "../../components/Category";
import Header from "../../components/Header";
import Product from "../../components/Product";
import Setting from "../../components/Setting";

const Home: NextPage = () => {
  const [view, setView] = useState<"product" | "order">("product");
  const [url, setUrl] = useState("");

  return (
    <div className="">
      <Header setView={setView} view={view} />
      <div className="pt-[64px]">
        {view === "product" && (
          <div className="">
            <Category />
            <Brand />
            <Setting />
            <Product />
          </div>
        )}
        {view === "order" && (
          <div className="">
            {Array.from({ length: 40 }).map((_, index) => (
              <div key={index}>order</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
