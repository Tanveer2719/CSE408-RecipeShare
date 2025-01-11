import { useState, useRef, use } from 'react';
import { CustomButton } from '..';
import { Uploadfiles } from '@/Uploadfiles';
import { UpdateRecipeDataType,updateState,updatePercentage,updateMsg,updateLink } from '@/Types';
import Overlay from './Overlay';




const RecipeSteps:React.FC<{ updateRecipeData: UpdateRecipeDataType }> = ({updateRecipeData}) =>{
  // Now you can access app and storage like this
  const fileInputRef = useRef(null);
  

  type Step = {
    order: number;
    step: string;
    image: string | null; // Change from string | null to string
  };

  
  const [steps, setSteps] = useState<Step[]>([
    { order: 1, step: '', image: '' }, // Default step
  ]);


  const [selectedImage, setSelectedImage] = useState<File|null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const [percentage, setPercentage] = useState<number>(0);
  const [msg, setMsg] = useState<string>('Uploading...');
  const [downloadURL, setDownloadURL] = useState<string>('');

  const updateLink:updateLink = (value:string)=>{
    setDownloadURL(value);
  }

  const addStep = () => {
    setSteps([...steps, { order: steps.length + 1, step: '', image: '' }]);
  };

  const handleChange = (index:number, field:string, value:string) => {
    setSteps((prevSteps) => {
    const updatedSteps = prevSteps.map((step, i) => (i === index ? { ...step, [field]: value } : step));
    updateRecipeData('steps', updatedSteps);
    return updatedSteps;
  });
  };

  const deleteStep = (index: number)=> {
      const updatedSteps = [...steps];
      updatedSteps.splice(index, 1);
      setSteps(updatedSteps);
      updateRecipeData('steps', updatedSteps);
  };

  const updateState:updateState =(value:boolean)=>{
    setIsUploadingImage(value);
  }

  const updatePercentage:updatePercentage =(value:number)=>{ 
    setPercentage(value); 
  }

  const updateMsg:updateMsg = (value:string)=>{
    setMsg(value);
  }

  const handleImageUpload = async (index: number) => {

    if (!selectedImage){
      alert('No file selected');
      return;
    } 
    try {
      await Uploadfiles(selectedImage, updateState, updatePercentage, updateMsg, updateLink,
        ()=>{
          const updatedSteps = [...steps];
          updatedSteps[index].image = downloadURL;
          updateRecipeData('steps', updatedSteps);
        });
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setPercentage(0); // Reset progress after upload completion or failure
    }

    
    
  };

  return (
    <div>
      {isUploadingImage && <Overlay uploadProgress={percentage} msg={msg}   />}

      <div className="container mx-auto">
        <ol className="list-disc space-y-4">
          {steps.map((step, index) => (
            <li key={index} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={step.order}
                  onChange={(e) => handleChange(index, 'order', e.target.value)}
                  className="w-20 h-10 border p-2 bg-gray-200 text-lg font-medium rounded"
                  placeholder="Step #"
                  min={index + 1}
                  required
                />
                <textarea
                  value={step.step}
                  onChange={(e) => handleChange(index, 'step', e.target.value)}
                  className="w-full h-30 border p-2 bg-gray-200 rounded resize text-center"
                  placeholder="Step description"
                  required
                />
                <CustomButton
                  type="button"
                  title="Delete"
                  varient="btn_dark_red"
                  otherStyles="bg-red-500 text-white px-2 py-1 rounded h-10"
                  onClick={() => deleteStep(index)}
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
                        alert('error in file selection');
                      }
                    }}
                />

                <CustomButton
                    type="button"
                    title="Upload Image"
                    varient="btn_light_green"
                    otherStyles="bg-green-500 text-white px-4 py-1"
                    onClick={() => handleImageUpload(index)}
                />
              </div>
                {/* Add the image preview */}
                {step.image && (
                  <div className="flex justify-center">
                    <img
                      src={step.image}
                      alt="Step Image"
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
            title="Add Step"
            varient="btn_light_green"
            otherStyles="bg-blue-500 text-white px-4 py-2 rounded-full"
            onClick={() => addStep()}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeSteps;