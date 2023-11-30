import React, { useState, useEffect, useContext } from 'react';

import { storage } from '../config/firebase';
import { getFirestore, collection, query, where, getDocs, doc, addDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, updateMetadata } from 'firebase/storage';

import "./Settings.sass"
import { Context } from '../Utilities/Context'

const Profile = () => {
  const db = getFirestore();

  let { user, setuser, id, setid } = useContext(Context)

  const [editfirstName, setEditfirstName] = useState('');
  const [editlastName, setEditlastName] = useState('');
  const [editemail, setEditEmail] = useState('');
  const [editpassword, setEditPassword] = useState('');
  const [editdept, setEditDept] = useState('');

  const [editimage, setEditImage] = useState(null);


  // collects every input in every field
  const updatedData = {
    first_name: editfirstName,
    last_name: editlastName,
    email: editemail,
  }

  // takes all updated value from the updatedData object
  const excludeEmptyStrings = (obj) => {
    let result = {};
    for (let [key, value] of Object.entries(obj)) {
      if (value !== '') {
        result[key] = value;
      }
    }
    return result;
  };


  const uploadImage = (file) => {
    const timestamp = new Date().getTime();
    const newFileName = `${timestamp}_${file.name}`;

    // Create a new File object with the modified name
    const modifiedFile = new File([file], newFileName);

    const storagePath = `images/${id}/'profile_picture'/${modifiedFile.name}`;
    const storageRef = ref(storage, storagePath);

    uploadBytes(storageRef, modifiedFile)
      .then(async (snapshot) => {
        console.log('Image uploaded successfully');

        // Set custom metadata with user ID and type
        const metadata = {
          customMetadata: {
            userId: id,
            imageType: 'profile_picture',
            timeStamp: timestamp,
          },
        };

        await updateMetadata(storageRef, metadata);
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  };


  const onSave = async (e) => {
    e.preventDefault();

    let collectedData = excludeEmptyStrings(updatedData)

    const collectionRef = collection(db, 'users');
    const q = query(collectionRef, where('userId', '==', id));

    uploadImage(editimage)
    if (Object.keys(collectedData).length === 0) {

    }
    else {
      getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach((docSnap) => {
            console.log(docSnap)

            // Found a document that matches the criteria
            const docRef = doc(db, 'users', docSnap.id);

            // Update the document
            updateDoc(docRef, collectedData)
              .then(() => {
                console.log('Document updated successfully');
              })
              .catch((error) => {
                console.error('Error updating document:', error);
              });
          });
        })
        .catch((error) => {
          console.error('Error querying Firestore:', error);
        });
    }
  }
  return (
    <div className='e_profile'>
      <div className='profile_one'>
        <span className='edit_one'>Edit Profile</span>
        <div className='edit_form'>
          <label>
            Edit first name
            <input
              type="text"
              value={editfirstName}
              placeholder='New First Name'
              onChange={(e) => setEditfirstName(e.target.value)}
            />
          </label>
          <label>
            Edit last name
            <input
              type="text"
              value={editlastName}
              placeholder='New Last Name'
              onChange={(e) => setEditlastName(e.target.value)}
            />
          </label>
          <label>
            Edit branch
            <input
              type="text"
              placeholder='New Name'
            />
          </label>
          <label>
            Edit e-mail
            <input
              type="email"
              value={editemail}
              placeholder='xxxxxxx@gmail.com'
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className='profile_one'>
        <span className='edit_one'>Passwords</span>
        <div className='edit_form'>
          <label>
            <input
              type="text"
              placeholder='Current Password'
            />
          </label>
          <label>
            <input
              type="text"
              placeholder='New Password'
            />
          </label>
        </div>
      </div>
      <div className='profile_one'>
        <span className='edit_one'>Display photo</span>
        <div className='set_profile_picture'>
          <input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files[0])} />
        </div>
      </div>
      <div className='save_or_not' onClick={onSave}>Save</div>
    </div>
  )
}

export default Profile
