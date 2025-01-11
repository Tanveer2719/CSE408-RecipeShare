import Image from "next/image";
import searchlogo from "./../../public/search.svg";
import Search from "./Search";
import ImageSlider from "./ImageSlider";
import UploadButton from "./UploadButton";
import { SearchButton, SearchBlogButton } from "./SearchButton";

const RightBar = () => {
  return (
    <div className="flex flex-col items-center mt-8">
      <Search/>
      <div className="container mx-auto ">
        <ImageSlider />
      </div>
      {/* <div className="mt-8 bg-[#eff3f4] w-10/12 flex flex-col h-3/6">
        <p className="p-[20px] text-xl block font-bold">Trending For You</p>
      </div> */}
      <UploadButton />
    </div>
  );
};

export default RightBar;