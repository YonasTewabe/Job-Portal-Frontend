/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useParams, useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axiosInterceptor";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import { useAuth } from "../context/AuthContext";

// eslint-disable-next-line no-unused-vars
const EditJob = ({ updateJobSubmit }) => {
  const job = useLoaderData();
  const [title, setTitle] = useState(job.title);
  const [type, setType] = useState(job.type);
  const [location, setLocation] = useState(job.location);
  const [description, setDescription] = useState(job.description);
  const [requirement, setRequirement] = useState(job.requirement);
  const [salary, setSalary] = useState(job.salary);
  const [companyName, setCompanyName] = useState(job.companyName);
  const [companyDescription, setCompanyDescription] = useState(job.companyDescription);
  const [contactEmail, setContactEmail] = useState(job.contactEmail);
  const [companyPhone, setCompanyPhone] = useState(job.companyPhone);
  const [deadline, setDeadline] = useState(job.deadline);

  const { user: authUser } = useAuth();
  const myRole = authUser?.role;

  const navigate = useNavigate();
  const { id } = useParams();

  const submitForm = async (e) => {
    e.preventDefault();
  
    const updatedJob = {
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
    };
  
    try {
      const response = await axios.patch(`/api/jobs/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedJob),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update Job");
      }
  
      toast.success("Job Updated Successfully");
      navigate(`/job/${id}`);
    } catch (error) {
      toast.error("Failed to update Job. Please try again.");
      console.log(error.message);
    }
  };
  
  
  return (
    <>
    { myRole === "hr" ? (
    <section className='bg-indigo-50'>
      <div className='container m-auto max-w-2xl py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <form onSubmit={submitForm}>
            <h2 className='text-3xl text-center font-semibold mb-6'>
              Update Job
            </h2>

            <div className='mb-4'>
              <label
                htmlFor='type'
                className='block text-gray-700 font-bold mb-2'
              >
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
              <label className='block text-gray-700 font-bold mb-2'>
                Job Title
              </label>
              <input
                type='text'
                id='title'
                name='title'
                className='border rounded w-full py-2 px-3 mb-2'
                placeholder='eg. Beautiful Apartment In Miami'
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor='description'
                className='block text-gray-700 font-bold mb-2'
              >
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
              <label className='block text-gray-700 font-bold mb-2'>
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
              <label
                htmlFor='type'
                className='block text-gray-700 font-bold mb-2'
              >
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
              <label className='block text-gray-700 font-bold mb-2'>
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
              <label className='block text-gray-700 font-bold mb-2'>
                Application Deadline
              </label>
              <input
                type='date'
                id='deadline'
                name='deadline'
                className='border rounded w-full py-2 px-3 mb-2'
                placeholder='Application Deadline'
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <h3 className='text-2xl mb-5'>Company Info</h3>

            <div className='mb-4'>
              <label
                htmlFor='company'
                className='block text-gray-700 font-bold mb-2'
              >
                Company Name
              </label>
              <input
                type='text'
                id='company'
                name='company'
                className='border rounded w-full py-2 px-3'
                placeholder='Company Name'
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className='mb-4'>
              <label
                htmlFor='company_description'
                className='block text-gray-700 font-bold mb-2'
              >
                Company Description
              </label>
              <textarea
                id='company_description'
                name='company_description'
                className='border rounded w-full py-2 px-3'
                rows='4'
                placeholder='What does your company do?'
                required
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
              ></textarea>
            </div>
            

            <div className='mb-4'>
              <label
                htmlFor='contact_email'
                className='block text-gray-700 font-bold mb-2'
              >
                Contact Email
              </label>
              <input
                type='email'
                id='contact_email'
                name='contact_email'
                className='border rounded w-full py-2 px-3'
                placeholder='Email address for applicants'
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor='contact_phone'
                className='block text-gray-700 font-bold mb-2'
              >
                Contact Phone
              </label>
              <input
                type='tel'
                id='contact_phone'
                name='contact_phone'
                className='border rounded w-full py-2 px-3'
                placeholder='Phone Number for applicants'
                required
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
              />
            </div>


            <div>
              <button
                className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
                type='submit'
              >
                Update Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
      ): (
        <UnauthorizedAccess />

     )}
     </>
  );
};
export default EditJob;