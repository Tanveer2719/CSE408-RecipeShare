import { useState, useRef } from 'react';
import { CustomButton } from '..';
import { getStorage } from "firebase/storage";
import app from "../firebase";
import { UploadTask, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import firebase from "../firebase";
type UpdateBlogDataType = (key: string, value: any) => void;


const BlogSteps:React.FC<{ updateBlogData: UpdateBlogDataType }> = ({updateBlogData}) =>{
  // Now you can access app and storage like this
  const storage = firebase.storage;
  const fileInputRef = useRef(null);
  

  type Section = {
    order: number;
    title: string;
    content: string;
    image: string | null; // Change from string | null to string
  };

  
  const [sections, setSections] = useState<Section[]>([
    { order: 1, title: '', content: '', image: '' }, // Default section
  ]);


  const [selectedImage, setSelectedImage] = useState<File|null>(null);
  const [uploadTask, setUploadTask] = useState<UploadTask|null>(null);
  const [imageUrl, setImageUrl] = useState<string|null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);


  const addSection = () => {
    setSections([...sections, { order: sections.length + 1, title: '', content: '', image: '' }]);
  };

  const handleChange = (index:number, field:string, value:string) => {
    setSections((prevSections) =>
      prevSections.map((section, i) => (i === index ? { ...section, [field]: value } : section)));
    updateBlogData('sections', sections);
  };

  const deleteSection = (index: number)=> {
      const updatedSections = [...sections];
      updatedSections.splice(index, 1);
      setSections(updatedSections);
      updateBlogData('sections', updatedSections);
  };

  const handleImageUpload = async (index: number) => {
    const file = selectedImage;

  
    if (!file){
      alert('No file selected');
      return;
    } 

    setIsUploadingImage(true);

    const storageRef = ref(storage, `sectionImages/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploadTask(uploadTask);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        console.log(snapshot);
      },
      (error) => {
        // Handle errors
        console.log(error);
      },
      async () => {
        // Complete
        alert('Image Upload is complete');
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);

        console.log(downloadURL);
        
        // update the sections array with the image url
        const updatedSections = [...sections];
        updatedSections[index].image = downloadURL;
        console.log(updatedSections[index]);
        setSections(updatedSections);
        updateBlogData('sections', sections);
        console.log(sections);
        setIsUploadingImage(false);
      }
    );   
  };



  return (
    <div className="container mx-auto">
      <ol className="list-disc space-y-4">
        {sections.map((section, index) => (
          <li key={index} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={section.order}
                onChange={(e) => handleChange(index, 'order', e.target.value)}
                className="w-20 h-10 border p-2 bg-gray-200 text-lg font-medium rounded"
                placeholder="Section #"
                min={index + 1}
                required
              />
              <textarea
                value={section.title}
                onChange={(e) => handleChange(index, 'title', e.target.value)}
                className="w-full h-30 border p-2 bg-gray-200 rounded resize text-center"
                placeholder="Section title"
                required
              />
              <textarea
                value={section.content}
                onChange={(e) => handleChange(index, 'content', e.target.value)}
                className="w-full h-30 border p-2 bg-gray-200 rounded resize text-center"
                placeholder="Section content"
                required
              />
              <CustomButton
                type="button"
                title="Delete"
                varient="btn_dark_red"
                otherStyles="bg-red-500 text-white px-2 py-1 rounded h-10"
                onClick={() => deleteSection(index)}
              />
            </div>

            {/* Image upload and preview in a separate row */}
            <div className="flex justify-center">
              {/* Add the image select option */}
              <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  placeholder='select image'
                  onChange={(event) => {
                    const file = event.target.files && event.target.files[0];
                    if (file) {
                      setSelectedImage(file);
                    }else{
                      console.log('error in file selection');
                    }
                  }}
              />

              <CustomButton
                  type="button"
                  title={isUploadingImage ? "Uploading...": "Upload Image"}
                  varient="btn_light_green"
                  otherStyles="bg-green-500 text-white px-4 py-1"
                  onClick={() => handleImageUpload(index)}
              />
            </div>
              
              {/* Add the image preview */}
              {section.image && (
                <div className="flex justify-center">
                  <img
                    src={section.image}
                    alt="Section Image"
                    className="w-24 h-24 object-cover"
                  />
                </div>
              )}

          </li>
        ))}
      </ol>
      <div className="flex justify-center mt-4">
        <CustomButton
          type="button"
          title="Add Section"
          varient="btn_light_green"
          otherStyles="bg-blue-500 text-white px-4 py-2 rounded-full"
          onClick={() => addSection()}
        />
      </div>
    </div>
  );
};

export default BlogSteps;
