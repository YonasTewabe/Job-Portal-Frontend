/* eslint-disable react-refresh/only-export-components */
import { toast } from "../utils/toast";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import { Page, Card, SectionTitle, InfoRow, Btn } from "../Components/ui";
import { EditIcon, KeyIcon, TrashIcon } from "../Components/icons";
import { confirmDelete } from "../utils/confirm";
import CvFileActions from "../Components/CvFileActions";

const Account = ({ deleteUser }) => {
  const user = useLoaderData();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const role = authUser?.role;

  const onDelete = async (userId) => {
    const result = await confirmDelete({
      title: "Delete account?",
      text: "This action cannot be undone.",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteUser(userId);
      toast.success("Account deleted");
      logout();
      navigate("/");
    } catch { toast.error("Unable to delete account."); }
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
              <InfoRow label="Date of Birth" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "—"} />
              <InfoRow label="Age" value={user.age ?? "—"} />
              <InfoRow label="Sex" value={user.sex} />
            </Card>

            <Card>
              <SectionTitle>Education</SectionTitle>
              {(user.educations?.length ? user.educations : []).map((edu, i) => (
                <InfoRow
                  key={i}
                  label={user.educations.length > 1 ? `Education ${i + 1}` : "Education"}
                  value={`${edu.degree} — ${edu.university}${edu.startDate ? ` (${edu.startDate}${edu.endDate ? ` – ${edu.endDate}` : " – Present"})` : ""}`}
                />
              ))}
              {(!user.educations || user.educations.length === 0) && (
                <InfoRow label="Education" value="—" />
              )}
            </Card>

            <Card>
              <SectionTitle>Work Experience</SectionTitle>
              {(user.experiences?.length ? user.experiences : []).map((exp, i) => (
                <InfoRow
                  key={i}
                  label={user.experiences.length > 1 ? `Role ${i + 1}` : "Role"}
                  value={`${exp.title} at ${exp.company}${exp.startDate ? ` (${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : " – Present"})` : ""}`}
                />
              ))}
              {(!user.experiences || user.experiences.length === 0) && (
                <InfoRow label="Experience" value="—" />
              )}
              <div className="pt-4">
                {user.cv ? (
                  <CvFileActions filename={user.cv} />
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

        {/* Actions */}
        <Card>
          <SectionTitle>Account Actions</SectionTitle>
          <div className="flex flex-col gap-3 pt-1">
            {role === "user" && (
              <Link to={`/UpdateUser/${authUser.userId}`} className={Btn.primary("gap-2")}>
                <EditIcon size={13} /> Update Information
              </Link>
            )}
            {role === "user" && (
              <Link to={`/changepassword/${authUser.userId}`} className={Btn.secondary("gap-2")}>
                <KeyIcon size={13} /> Change Password
              </Link>
            )}
            {role === "user" && (
              <button onClick={() => onDelete(authUser.userId)} className={Btn.danger("gap-2")}>
                <TrashIcon size={13} /> Delete Account
              </button>
            )}
          </div>
        </Card>
      </div>
    </Page>
  );
};

const userLoader = async ({ params }) => {
  const res = await axios.get("/api/applicants/me");
  return res.data;
};

export { Account, userLoader };
export default Account;
