/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import axios from "../axiosInterceptor";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import * as Yup from "yup";

const CompanyInfo = () => {
  const user = useLoaderData();
  const [companyname, setCompanyName] = useState(user.companyname || "");
  const [companydescription, setCompanyDescription] = useState(user.companydescription || "");
  const [companyPhone, setCompanyPhone] = useState(user.companyPhone || "");
  const [contactemail, setContactEmail] = useState(user.contactemail || "");
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const myRole = authUser?.role;

  const validationSchema = Yup.object().shape({
    companyname: Yup.string().required("Company Name is required"),
    companydescription: Yup.string().required("Company Description is required"),
    contactemail: Yup.string().email("Invalid email address").required("Email is required"),
    companyPhone: Yup.string().matches(/^[0-9]{9}$/, "Phone number must be 9 digits").required("Phone number is required"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("companyname", companyname);
    formData.append("companydescription", companydescription);
    formData.append("companyPhone", companyPhone);
    formData.append("contactemail", contactemail);

    try {
      await validationSchema.validate({
        companyname,
        companydescription,
        companyPhone,
        contactemail,
      }, { abortEarly: false });

      const response = await axios.patch(`/api/profile/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status !== 200) {
        throw new Error("Failed to update information");
      }
      toast.success("Information Updated Successfully");
      navigate(`/account/${id}`);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = {};
        error.inner.forEach(err => {
          errors[err.path] = err.message;
        });
        setFormErrors(errors);
      } else {
        toast.error("Failed to update information. Please try again.");
        console.log(error);
      }
    }
  };

  return (
    <>
      {myRole === "hr" ? (
        <section className="bg-indigo-50">
          <div className="container m-auto max-w-2xl py-24">
            <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
              <form onSubmit={handleSubmit}>
                <h2 className="text-3xl text-center font-semibold mb-6">
                  Complete Information
                </h2>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyname"
                    name="companyname"
                    className={`border rounded w-full py-2 px-3 ${formErrors.companyname ? "border-red-500" : ""}`}
                    placeholder="Company Name"
                    required
                    value={companyname}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  {formErrors.companyname && <div className="text-red-500">{formErrors.companyname}</div>}
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='description'
                    className='block text-gray-700 font-bold mb-2'
                  >
                    Company Description
                  </label>
                  <textarea
                    id='companydescription'
                    name='companydescription'
                    className={`border rounded w-full py-2 px-3 ${formErrors.companydescription ? "border-red-500" : ""}`}
                    rows='4'
                    placeholder='What does your company do?'
                    value={companydescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                  ></textarea>
                  {formErrors.companydescription && <div className="text-red-500">{formErrors.companydescription}</div>}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="contactemail"
                    name="contactemail"
                    className={`border rounded w-full py-2 px-3 ${formErrors.contactemail ? "border-red-500" : ""}`}
                    placeholder="Contact Email"
                    required
                    value={contactemail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                  {formErrors.contactemail && <div className="text-red-500">{formErrors.contactemail}</div>}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="userPhone"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="flex">
                    <span className="border rounded-l py-2 px-3 bg-gray-200">+251</span>
                    <input
                      type="number"
                      id="companyPhone"
                      name="companyPhone"
                      className={`border rounded w-full py-2 px-3 ${formErrors.companyPhone ? "border-red-500" : ""}`}
                      placeholder="Contact Phone"
                      required
                      value={companyPhone}
                      maxLength={9}
                      minLength={9}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                    />
                  </div>
                  {formErrors.companyPhone && <div className="text-red-500">{formErrors.companyPhone}</div>}
                </div>

                <div>
                  <button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Update Information
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : (
        <UnauthorizedAccess />
      )}
    </>
  );
};

export default CompanyInfo;
