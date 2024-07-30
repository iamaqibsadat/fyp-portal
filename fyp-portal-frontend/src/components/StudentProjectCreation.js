import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentSidebar from './StudentSideBar';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import SuccessModal from './SuccessModal';

const StudentProjectCreation = () => {
  const [formData, setFormData] = useState({
    projectTitle: '',
    description: '',
    projectType: '',
    supervisor: '',
    program: '',
    groupMembers: '',
    proposalUrl: ''
  });
  const [customProjectType, setCustomProjectType] = useState('');
  const [supervisors, setSupervisors] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/supervisors', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSupervisors(response.data);
      } catch (error) {
        console.error('Error fetching supervisors:', error.response?.data || error.message);
      }
    };

    fetchSupervisors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "projectType") {
      if (value === "Other") {
        setCustomProjectType('');
        setFormData({
          ...formData,
          projectType: 'Other'
        });
      } else {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCustomTypeChange = (e) => {
    setCustomProjectType(e.target.value);
    setFormData({
      ...formData,
      projectType: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;

    const storageRef = ref(storage, `proposals/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setUploading(true);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        snapshot => {
        },
        error => {
          console.error('Error uploading file:', error);
          setUploading(false);
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setUploading(false);
          resolve(url);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const proposalUrl = await handleUpload();
      const completeFormData = { ...formData, proposalUrl };
      const response = await axios.post('http://localhost:3000/api/projects', completeFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Project created successfully:', response.data);
      setIsModalOpen(true);
      setFormData({
        projectTitle: '',
        description: '',
        projectType: '',
        supervisor: '',
        program: '',
        groupMembers: '',
        proposalUrl: ''
      });
      setFile(null);
    } catch (error) {
      console.error('Error creating project:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-grow mt-16 md:mt-4 md:ml-4 p-6">
        <div className='container flex items-center justify-center w-full h-16 bg-gray-100 mt-16'>
          <span className='font-bold mr-2 text-lg'>Department Name:</span>
          <span className='text-lg'>Computer Science and IT</span>
        </div>

        <div className="max-w-4xl mx-auto mt-5 mb-36 p-6 md:p-8 bg-white shadow-md">
          <h2 className="text-2xl font-bold text-center text-white bg-[#6f5cc3] p-4">Project Creation Form</h2>

          <form className="bg-white shadow-md p-6 mt-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <div className="mb-4">
                  <label htmlFor="projectTitle" className="block text-sm font-semibold text-gray-700">Project Title:</label>
                  <input type="text" id="projectTitle" name="projectTitle" placeholder='Enter Project Title' className="mt-1 bg-gray-100 block w-full sm:text-sm p-2" value={formData.projectTitle} onChange={handleChange} required />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description:</label>
                  <textarea id="description" name="description" rows="4" placeholder='Write a brief Description' className="mt-1 bg-gray-100 block w-full sm:text-sm p-2" value={formData.description} onChange={handleChange} required></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="proposal" className="block text-sm font-semibold text-gray-700">Proposal:</label>
                  <input type="file" id="proposal" name="proposal" className="mt-1 bg-gray-100 block w-full sm:text-sm p-2" onChange={handleFileChange} required />
                </div>
              </div>
              <div className="col-span-1">
                <div className="mb-4">
                  <label htmlFor="projectType" className="block text-sm font-semibold text-gray-700">Project Type:</label>
                  <select id="projectType" name="projectType" className="mt-1 bg-gray-100 block w-full sm:text-sm p-2" value={formData.projectType} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="AI">Machine Learning Projects</option>
                    <option value="Security Projects">Security Projects</option>
                    <option value="Networking ProjectsFlutter">Networking Projects</option>
                    <option value="Web Development Projects">Web Development Projects</option>
                    <option value="Mobile App Development Projects">Mobile App Development Projects</option>
                    <option value="Game Development Projects">Game Development Projects</option>
                    <option value="Human-Computer Interaction">Human-Computer Interaction</option>
                    <option value="Bioinformatics Projects">Bioinformatics Projects</option>
                    <option value="Embedded Systems Projects">Embedded Systems Projects</option>
                    <option value="Cloud Computing Projects">Cloud Computing Projects</option>
                    <option value="Other">Other (Specify Below)</option>
                  </select>
                  {formData.projectType === "Other" && (
                    <input
                      type="text"
                      id="customProjectType"
                      name="customProjectType"
                      placeholder="Specify your project type"
                      value={customProjectType}
                      onChange={handleCustomTypeChange}
                      className="mt-1 bg-gray-100 block w-full sm:text-sm p-2"
                      required
                    />
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="supervisor" className="block text-sm font-semibold text-gray-700">Supervisor:</label>
                  <select id="supervisor" name="supervisor" className="mt-1 bg-gray-100 block w-full sm:text-sm p-2" value={formData.supervisor} onChange={handleChange} required>
                    <option value="">Select Supervisor</option>
                    {supervisors.map((supervisor) => (
                      <option key={supervisor._id} value={supervisor._id}>
                        {supervisor.profile?.fullName || 'Unnamed Supervisor'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="program" className="block text-sm font-semibold text-gray-700">Program:</label>
                  <select id="program" name="program" className="mt-1 bg-gray-100 block w-full sm:text-sm p-2" value={formData.program} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Bcs">Bcs</option>
                    <option value="Msc">Msc</option>
                    <option value="Phd">Phd</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="groupMembers" className="block text-sm font-semibold text-gray-700">Group Members:</label>
                  <input type="text" id="groupMembers" name="groupMembers" placeholder='20PWBCSXXX, 21PWBCSXXX, ...' className="mt-1 bg-gray-100 block w-full sm:text-sm p-2" value={formData.groupMembers} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button type="submit" className="bg-[#6f5cc3] hover:bg-[#58448c] text-white font-bold py-2 px-4 w-full">
                {uploading ? 'Uploading...' : 'APPLY'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <SuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default StudentProjectCreation;
