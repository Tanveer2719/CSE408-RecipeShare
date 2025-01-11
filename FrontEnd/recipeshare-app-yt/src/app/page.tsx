import RightBar from "@/components/RightBar";
import BlogList from "@/components/show"




export default async function Home() {

  // console.log(user)
  return (
    <div className="bg-container">
      <div className="bg-image" style={{ backgroundImage: `url("/home.avif")`}} > </div>
      <RightBar/>
      <BlogList/>
    </div>
  );
}