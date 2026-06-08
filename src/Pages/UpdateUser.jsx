/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import axios from "../axiosInterceptor";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";

const UpdateUser = () => {
  const user = useLoaderData();
  const [fullname, setFullName] = useState(user.fullname || "");
  const [age, setAge] = useState(user.age || "");
  const [sex, setSex] = useState(user.sex || "");
  const [degree, setDegree] = useState(user.degree || "");
  const [university, setUniversity] = useState(user.university || "");
  const [experience, setExperience] = useState(user.experience || "None");
  const [cv, setCv] = useState(user.cv);
  const [userPhone, setUserPhone] = useState(user.userPhone || "");
  const { user: authUser } = useAuth();
  const myRole = authUser?.role;
  const navigate = useNavigate();
  const { id } = useParams();

  const validationSchema = Yup.object().shape({
    fullname: Yup.string().matches(/^[A-Za-z ]*$/, "Name can only contain letters").required("Full Name is required"),
    age: Yup.number().typeError("Age must be a number").required("Age is required").positive("Age must be a positive number").integer("Age must be an integer"),
    sex: Yup.string().oneOf(["Male", "Female"], "Invalid sex").required("Sex is required"),
    degree: Yup.string().required("Degree is required"),
    university: Yup.string().required("University is required"),
    experience: Yup.string().required("Experience is required"),
    userPhone: Yup.string().matches(/^[0-9]{9}$/, "Phone number must be 9 digits").required("Phone number is required"),
  });

  const [formErrors, setFormErrors] = useState({});

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate({ fullname, age, sex, degree, university, experience, userPhone, cv }, { abortEarly: false });

      const formData = new FormData();
      formData.append("file", cv);
      formData.append("fullname", fullname);
      formData.append("age", age);
      formData.append("sex", sex);
      formData.append("degree", degree);
      formData.append("university", university);
      formData.append("experience", experience);
      formData.append("userPhone", userPhone);

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
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setFormErrors(newErrors);
      } else {
        toast.error("Failed to update information. Please try again.");
        console.log(error);
      }
    }
  };

  return (
    <>
    {myRole === 'user' ? (
    <section className="bg-indigo-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                className={`border rounded w-full py-2 px-3 ${formErrors.fullname ? "border-red-500" : ""}`}
                placeholder="Full Name"
                required
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
              />
              {formErrors.fullname && (
                <div className="text-red-500 text-sm">{formErrors.fullname}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Age</label>
              <input
                type="text"
                id="age"
                name="age"
                className={`border rounded w-1/3 py-2 px-3 mb-2 ${formErrors.age ? "border-red-500" : ""}`}
                placeholder="Age"
                required
                value={age}
                maxLength={2}
                minLength={2}
                onChange={(e) => setAge(e.target.value)}
              />
              {formErrors.age && (
                <div className="text-red-500 text-sm">{formErrors.age}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Sex</label>
              <div className="flex items-center">
                <label className="mr-2">
                  <input
                    type="radio"
                    id="male"
                    name="sex"
                    value="Male"
                    checked={sex === "Male"}
                    onChange={(e) => setSex(e.target.value)}
                    className="mr-1"
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    id="female"
                    name="sex"
                    value="Female"
                    checked={sex === "Female"}
                    onChange={(e) => setSex(e.target.value)}
                    className="mr-1"
                  />
                  Female
                </label>
              </div>
              {formErrors.sex && (
                <div className="text-red-500 text-sm">{formErrors.sex}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Degree
              </label>
              <input
                type="text"
                id="degree"
                name="degree"
                className={`border rounded w-full py-2 px-3 mb-2 ${formErrors.degree ? "border-red-500" : ""}`}
                placeholder="Degree"
                required
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
              {formErrors.degree && (
                <div className="text-red-500 text-sm">{formErrors.degree}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                University
              </label>
              <input
                type="text"
                id="university"
                name="university"
                className={`border rounded w-full py-2 px-3 mb-2 ${formErrors.university ? "border-red-500" : ""}`}
                placeholder="University or College Attended"
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
              {formErrors.university && (
                <div className="text-red-500 text-sm">{formErrors.university}</div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="experience"
                className="block text-gray-700 font-bold mb-2"
              >
                Experience
              </label>
              <select
                id="experience"
                name="experience"
                className={`border rounded w-full py-2 px-3 ${formErrors.experience ? "border-red-500" : ""}`}
                value={experience}
                required
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="None">None</option>
                <option value="Less than 1 Year">Less than 1 Year</option>
                <option value="1 - 3 years">1 - 3 years</option>
                <option value="3 - 5 years">3 - 5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
              {formErrors.experience && (
                <div className="text-red-500 text-sm">{formErrors.experience}</div>
              )}
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
                  id="userPhone"
                  name="userPhone"
                  className={`border rounded w-full py-2 px-3 ${formErrors.userPhone ? "border-red-500" : ""}`}
                  placeholder="Contact Phone"
                  required
                  value={userPhone}
                  maxLength={9}
                  minLength={9}
                  onChange={(e) => setUserPhone(e.target.value)}
                />
              </div>
              {formErrors.userPhone && (
                <div className="text-red-500 text-sm">{formErrors.userPhone}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">CV</label>
              <input
                type="file"
                id="cv"
                name="cv"
                className={`border rounded w-full py-2 px-3 ${formErrors.cv ? "border-red-500" : ""}`}
                accept="application/pdf"
                onChange={(e) => setCv(e.target.files[0])}
              />
              {formErrors.cv && (
                <div className="text-red-500 text-sm">{formErrors.cv}</div>
              )}
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
      ): (
        <UnauthorizedAccess />

     )}
     </>
  );
};

export default UpdateUser;
