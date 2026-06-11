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
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(userId);
          toast.success("Account deleted");
          logout();
          navigate("/login");
        } catch { toast.error("Unable to delete account."); }
      }
    });
  };

  return (
    <Page>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      {role === "user" && (
        <div className="grid gap-5">
          <Card>
            <SectionTitle>Personal</SectionTitle>
            <InfoRow label="Full Name"    value={user.fullname} />
            <InfoRow label="Age"          value={user.age} />
            <InfoRow label="Sex"          value={user.sex} />
          </Card>

          <Card>
            <SectionTitle>Education</SectionTitle>
            <InfoRow label="Degree"     value={user.degree} />
            <InfoRow label="University" value={user.university} />
            <InfoRow label="Experience" value={user.experience} />
            <div className="pt-3">
              {user.cv ? (
                <button onClick={() => window.open(`/api/applicants/cv/${user.cv}`, "_blank")}
                  className={Btn.secondary("gap-2")}>
                  <FaFilePdf className="text-red-500" /> Download CV
                </button>
              ) : <p className="text-sm text-gray-400">No CV uploaded</p>}
            </div>
          </Card>

          <Card>
            <SectionTitle>Contact</SectionTitle>
            <InfoRow label="Email"  value={user.email} />
            <InfoRow label="Phone"  value={`+251 ${user.userPhone}`} />
          </Card>
        </div>
      )}

      {role === "hr" && (
        <Card>
          <SectionTitle>Company</SectionTitle>
          <InfoRow label="Company Name"        value={user.companyname} />
          <InfoRow label="Description"         value={user.companydescription} />
          <InfoRow label="Contact Email"       value={user.contactemail} />
          <InfoRow label="Phone"               value={`+251 ${user.companyPhone}`} />
        </Card>
      )}

      {/* Action buttons */}
      <Card className="mt-5">
        <div className="flex flex-col gap-3">
          {(role === "user" || role === "hr") && (
            <Link
              to={role === "user" ? `/UpdateUser/${user.id}` : `/CompanyInfo/${user.id}`}
              className={Btn.primary("gap-2")}>
              <FaEdit /> Update Information
            </Link>
          )}
          {(role === "user" || role === "hr" || role === "admin") && (
            <Link to={`/changepassword/${user.id}`} className={Btn.success("gap-2")}>
              <FaKey /> Change Password
            </Link>
          )}
          {(role === "user" || role === "hr") && (
            <button onClick={() => onDelete(user.id)} className={Btn.danger("gap-2")}>
              <FaTrash /> Delete Account
            </button>
          )}
        </div>
      </Card>
    </Page>
  );
};

const userLoader = async ({ params }) => {
  const res = await axios.get(`/api/users/${params.id}`);
  return res.data;
};

export { Account, userLoader };
export default Account;
