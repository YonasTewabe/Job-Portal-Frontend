/* eslint-disable react-refresh/only-export-components */
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import { Page, Card, SectionTitle, InfoRow, Btn } from "../Components/ui";
import { FaEdit, FaKey, FaTrash, FaFilePdf } from "react-icons/fa";

const Account = ({ deleteUser }) => {
  const user = useLoaderData();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const role = authUser?.role;

  const onDelete = (userId) => {
    Swal.fire({
      title: "Delete account?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(userId);
          toast.success("Account deleted");
          logout();
          navigate("/");
        } catch { toast.error("Unable to delete account."); }
      }
    });
  };

  return (
    <Page>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
      </div>

      <div className="grid gap-5">
        {role === "user" && (
          <>
            <Card>
              <SectionTitle>Personal</SectionTitle>
              <InfoRow label="Full Name" value={user.fullname} />
              <InfoRow label="Age"       value={user.age} />
              <InfoRow label="Sex"       value={user.sex} />
            </Card>

            <Card>
              <SectionTitle>Education</SectionTitle>
              <InfoRow label="Degree"     value={user.degree} />
              <InfoRow label="University" value={user.university} />
              <InfoRow label="Experience" value={user.experience} />
              <div className="pt-4">
                {user.cv ? (
                  <button
                    onClick={() => window.open(`/api/applicants/cv/${user.cv}`, "_blank")}
                    className={Btn.secondary("gap-2 text-sm")}
                  >
                    <FaFilePdf className="text-red-500" size={14} /> Download CV
                  </button>
                ) : (
                  <p className="text-sm text-gray-400">No CV uploaded</p>
                )}
              </div>
            </Card>

            <Card>
              <SectionTitle>Contact</SectionTitle>
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Phone" value={`+251 ${user.userPhone}`} />
            </Card>
          </>
        )}

        {role === "hr" && (
          <Card>
            <SectionTitle>Company</SectionTitle>
            <InfoRow label="Company Name"  value={user.companyname} />
            <InfoRow label="Description"   value={user.companydescription} />
            <InfoRow label="Contact Email" value={user.contactemail} />
            <InfoRow label="Phone"         value={`+251 ${user.companyPhone}`} />
          </Card>
        )}

        {/* Actions */}
        <Card>
          <SectionTitle>Account Actions</SectionTitle>
          <div className="flex flex-col gap-3 pt-1">
            {(role === "user" || role === "hr") && (
              <Link
                to={role === "user" ? `/UpdateUser/${user.id}` : `/CompanyInfo/${user.id}`}
                className={Btn.primary("gap-2")}
              >
                <FaEdit size={13} /> Update Information
              </Link>
            )}
            {(role === "user" || role === "hr" || role === "admin") && (
              <Link to={`/changepassword/${user.id}`} className={Btn.secondary("gap-2")}>
                <FaKey size={13} /> Change Password
              </Link>
            )}
            {(role === "user" || role === "hr") && (
              <button onClick={() => onDelete(user.id)} className={Btn.danger("gap-2")}>
                <FaTrash size={13} /> Delete Account
              </button>
            )}
          </div>
        </Card>
      </div>
    </Page>
  );
};

const userLoader = async ({ params }) => {
  const res = await axios.get(`/api/users/${params.id}`);
  return res.data;
};

export { Account, userLoader };
export default Account;
