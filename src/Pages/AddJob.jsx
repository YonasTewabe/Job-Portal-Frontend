/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axiosInterceptor";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import SuspendedAccount from "../Components/SuspendedAccount";
import { useAuth } from "../context/AuthContext";

// eslint-disable-next-line react/prop-types
const AddJob = ({ addJobSubmit }) => {
  const [user, setUser] = useState(null);
  const { user: authUser } = useAuth();
  const userId = authUser?.userId;
  const myRole = authUser?.role;
  const hrStatus = authUser?.hrStatus;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/profile/${userId}`);
        if (res.status === 200) {
          const userData = res.data;
          setUser(userData);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Fetch user data error:", error);
      }
    };

    if (userId && !user) {
      fetchUser();
    }
  }, [userId, user]);

  const companyName = user?.companyname || '';
  const companyDescription = user?.companydescription || '';
  const contactEmail = user?.contactemail || '';
  const companyPhone = user?.companyPhone || '';

  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/jobs/create", {
        title,
        type,
        location,
        description,
        requirement,
        salary,
        deadline,
        companyName,
        companyDescription,
        contactEmail,
        companyPhone,
        userId
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      addJobSubmit();
      toast.success('Job Added Successfully');
      return navigate('/jobs');
    } catch (error) {
      toast.error("Failed to add new job. Please try again.");
    }
  };

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Full-Time');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [requirement, setRequirement] = useState('');
  const [salary, setSalary] = useState('Negotiable');
  const [deadline, setDeadline] = useState('');

  return user ? (
    <>
      {myRole === 'hr' ? (
        hrStatus === "true" ? (
          <section className='bg-indigo-50'>
            <div className='container m-auto max-w-2xl py-24'>
              <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
                <form onSubmit={submitForm}>
                  <h2 className='text-3xl text-center font-semibold mb-6'>Add Job</h2>
                  <div className='mb-4'>
                    <label htmlFor='title' className='block text-gray-700 font-bold mb-2'>
                      Job Title
                    </label>
                    <input
                      type='text'
                      id='title'
                      name='title'
                      className='border rounded w-full py-2 px-3 mb-2'
                      placeholder='eg. Front-end Developer'
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='type' className='block text-gray-700 font-bold mb-2'>
                      Job Type
                    </label>
                    <select
                      id='type'
                      name='type'
                      className='border rounded w-full py-2 px-3'
                      required
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value='Full-Time'>Full-Time</option>
                      <option value='Part-Time'>Part-Time</option>
                      <option value='Remote'>Remote</option>
                      <option value='Internship'>Internship</option>
                    </select>
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='location' className='block text-gray-700 font-bold mb-2'>
                      Location
                    </label>
                    <input
                      type='text'
                      id='location'
                      name='location'
                      className='border rounded w-full py-2 px-3 mb-2'
                      placeholder='Company Location'
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='description' className='block text-gray-700 font-bold mb-2'>
                      Job Description
                    </label>
                    <textarea
                      id='description'
                      name='description'
                      className='border rounded w-full py-2 px-3'
                      rows='4'
                      placeholder='Add any job duties, expectations, requirements, etc'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='requirement' className='block text-gray-700 font-bold mb-2'>
                      Job Requirement
                    </label>
                    <input
                      type='text'
                      id='requirement'
                      name='requirement'
                      className='border rounded w-full py-2 px-3 mb-2'
                      placeholder='Experience or educational requirements'
                      required
                      value={requirement}
                      onChange={(e) => setRequirement(e.target.value)}
                    />
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='salary' className='block text-gray-700 font-bold mb-2'>
                      Salary
                    </label>
                    <select
                      id='salary'
                      name='salary'
                      className='border rounded w-full py-2 px-3'
                      value={salary}
                      required
                      onChange={(e) => setSalary(e.target.value)}
                    >
                      <option value='Negotiable'>Negotiable</option>
                      <option value='Under 10,000'>Under 10,000</option>
                      <option value='10,000 - 15,000'>10,000 - 15,000</option>
                      <option value='15,000 - 20,000'>15,000 - 20,000</option>
                      <option value='20,000 - 25,000'>20,000 - 25,000</option>
                      <option value='Over 25,000'>Over 25,000</option>
                    </select>
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='deadline' className='block text-gray-700 font-bold mb-2'>
                      Application Deadline
                    </label>
                    <input
                      type='date'
                      id='deadline'
                      name='deadline'
                      className='border rounded w-full py-2 px-3 mb-2'
                      required
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </div>
                  <div className='mb-4'>
                    <button
                      className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
                      type='submit'
                    >
                      Add Job
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        ) : (
          <SuspendedAccount />
        )
      ) : (
        <UnauthorizedAccess />
      )}
    </>
  ) : null;
};

export default AddJob;
