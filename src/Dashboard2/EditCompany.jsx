import React, {useState} from 'react'



const EditCompany = () => {
    const [editfirstName, setEditfirstName] = useState('');
  const [editemail, setEditEmail] = useState('');
  const [editpassword, setEditPassword] = useState('');
  const [editdept, setEditDept] = useState('');

  const [editimage, setEditImage] = useState(null);
  return (
    <div className='e_profile'>
      <div className='profile_one'>
        <span className='edit_one'>Edit Company Profile</span>
        <div className='edit_form'>
          <label>
            Edit name
            <input
              type="text"
              value={editfirstName}
              placeholder='New First Name'
              onChange={(e) => setEditfirstName(e.target.value)}
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
            Edit company e-mail
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
      <div className='save_or_not'>Save</div>
    </div>
  )
}

export default EditCompany
