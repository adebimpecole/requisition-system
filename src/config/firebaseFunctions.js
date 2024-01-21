
import { storage } from './firebase';
import { getFirestore, collection, query, where, getDocs, doc, addDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, updateMetadata, getDownloadURL } from 'firebase/storage';

const db = getFirestore();

// Function to fetch data from Firestore
export const fetchDataFromFirestore = async (the_collection, the_match1, the_match2) => {
  const collectionRef = collection(db, the_collection);
  const q = query(collectionRef, where(the_match1, "==", the_match2));

  try {
    const querySnapshot = await getDocs(q);

    const data = [];
    querySnapshot.forEach((docSnap) => {
      data.push(docSnap.data());
    });

    return data[0];
  } catch (error) {
    console.error("Error querying Firestore:", error);
    throw error;
  }
};


// Function to add data to Firestore
export const addToFirestore = async (the_colllection, data) => {
  const collectionRef = collection(db, the_colllection);

  await addDoc(collectionRef, data)
    .then(() => {
      console.log("Document added successfully");
    })
    .catch((error) => {
      console.error("Error adding document:", error);
    });

};

// Function to update data in Firestore
export const updateFirestore = async (the_colllection, the_match2, data) => {

  console.log(data)
  // Found a document that matches the criteria
  const docRef = doc(db, the_colllection, the_match2);

  // Update the document
  updateDoc(docRef, data)
    .then(() => {
      console.log("Document updated successfully");
    })
    .catch((error) => {
      console.error("Error updating document:", error);
    });

}

// Function to update data in Firestore
export const updateArrayFirestore = async (the_colllection, the_match1, the_match2, dataType, data) => {

  const collectionRef = collection(db, the_colllection);
  const q = query(collectionRef, where(the_match1, "==", the_match2));


  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (doc) => {
    try {
      const docRef = doc.ref;
      await updateDoc(docRef, {
        messages: arrayUnion(data),
      });
    } catch (error) {
      console.error(
        `Error adding document to '${type}' collection:`,
        error
      );
    }
  });
}

// Function to add image to Firestore
export const uploadImage = (file, type, id, reqID) => {
  return new Promise(async (resolve, reject) => {
    console.log(file)
    const timestamp = new Date().getTime();
    const newFileName = type === "request" ? `${reqID}_${file.name}` : `${timestamp}_${file.name}`;

    // Create a new File object with the modified name
    const modifiedFile = new File([file], newFileName);

    const storagePath = `images/${id}/${type}/${modifiedFile.name}`;
    const storageRef = ref(storage, storagePath);

    try {
      const snapshot = await uploadBytes(storageRef, modifiedFile);

      // Set custom metadata with user ID, type, and content type
      const metadata = {
        customMetadata: {
          userId: id,
          imageType: type,
          timeStamp: timestamp,
        },
        contentType: file.type, // Set the content type
      };
      await updateMetadata(storageRef, metadata);

      console.log('Image uploaded successfully');

      if (type === "request") {
        const downloadURL = await getDownloadURL(storageRef);
        console.log("yes", downloadURL);
        resolve(downloadURL);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      reject(error);
    }
  });
};
