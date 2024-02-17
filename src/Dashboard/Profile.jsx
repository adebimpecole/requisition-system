import React, {useState, useEffect, useContext} from 'react';

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import './Settings.sass';
import {Context} from '../Utilities/Context';
import {
  uploadImage,
  updateFirestore,
  fetchDataFromFirestore,
} from '../config/firebaseFunctions';
import {excludeEmptyStrings} from '../config/functions';

const Profile = () => {
  const db = getFirestore();

  const {user, setuser, id, setid} = useContext(Context);

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
  };

  const onSave = async () => {
    // takes all updated value from the updatedData object
    const collectedData = excludeEmptyStrings(updatedData);

    console.log('updated');

    // upload image to firestore if an image was selected
    editimage == null ?
      console.log(true) :
      uploadImage(editimage, 'profile_picture', id);

    setEditImage(null);

    // checks for collected data and uploads it to firestore
    if (Object.keys(collectedData).length === 0) {
    } else {
      await updateFirestore('users', 'userId', id, collectedData);
    }
  };
  return (
    <div className="e_profile">
      <div className="profile_one">
        <span className="edit_one">Edit Profile</span>
        <div className="edit_form">
          <label>
            Edit first name
            <input
              type="text"
              value={editfirstName}
              placeholder="New First Name"
              onChange={(e) => setEditfirstName(e.target.value)}
            />
          </label>
          <label>
            Edit last name
            <input
              type="text"
              value={editlastName}
              placeholder="New Last Name"
              onChange={(e) => setEditlastName(e.target.value)}
            />
          </label>
          <label>
            Edit branch
            <input type="text" placeholder="New Name" />
          </label>
          <label>
            Edit e-mail
            <input
              type="email"
              value={editemail}
              placeholder="xxxxxxx@gmail.com"
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="profile_one">
        <span className="edit_one">Passwords</span>
        <div className="edit_form">
          <label>
            <input type="text" placeholder="Current Password" />
          </label>
          <label>
            <input type="text" placeholder="New Password" />
          </label>
        </div>
      </div>
      <div className="profile_one">
        <span className="edit_one">Display photo</span>
        <div className="set_profile_picture">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditImage(e.target.files[0])}
          />
        </div>
      </div>
      <div className="save_or_not" onClick={onSave}>
        Save
      </div>
    </div>
  );
};

export default Profile;
