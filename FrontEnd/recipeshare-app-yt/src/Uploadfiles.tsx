import {getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import firebase from './firebase';
import {updatePercentage,updateState, updateMsg, updateLink} from "./Types";


export const Uploadfiles = async(
    selectedImage:File, 
    updateState:updateState,
    updatePercentage:updatePercentage,
    updateMsg:updateMsg,
    updateLink:updateLink,
    callback: () => void // Callback function to be executed after upload
) => {
    updateState(true);
    const storage = firebase.storage;
    const file = selectedImage;
    const storageRef = ref(storage, `stepImages/${file.name}}`);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
        'state_changed',
        (snapshot)=> {
            const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            updatePercentage(progress);
            if(progress == 100)
                updateMsg('Upload completed');
            console.log(`Upload is ${progress}% done`);
        },
        (error)=>{
            alert('Error uploading file');
            updateState(false);
        },
        async ()=>{            
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);            
            updateState(false);
            updateLink(downloadURL);
            callback();
        }
        
    )
    
};