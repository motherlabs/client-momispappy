import axios from "axios";

const URLtoFile = async (url: string, type: string) => {
  let convertURL: string;
  if (type === "") {
    convertURL = url;
  } else if (type === "블루독베이비") {
    convertURL = url.replace("https://looxloo.com", "/bluedog");
  }
  console.log("url check", url);
  console.log("convert check", convertURL!);
  const response = await fetch(convertURL!);
  const data = await response.blob();
  const ext = url.split(".").pop(); // url 구조에 맞게 수정할 것
  const filename = "momispappy"; // url 구조에 맞게 수정할 것
  const metadata = { type: `image/${ext}` };
  return new File([data], filename!, metadata);
};

const convertUtil = {
  URLtoFile,
};

export default convertUtil;
