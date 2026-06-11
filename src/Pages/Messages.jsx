import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaComments, FaPaperPlane, FaHeadset, FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import Spinner from "../Components/Spinner";
import { Page, PageTitle, Card, Btn, inputCls, Empty, Badge } from "../Components/ui";

const PLATFORM_SUPPORT_META = {
  title: "Platform support",
  subtitle: "Application Tracker team",
};

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const ConversationItem = ({ conv, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors
      ${active ? "bg-brand-50 border-l-2 border-l-brand-500" : "hover:bg-gray-50 border-l-2 border-l-transparent"}`}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{conv.title}</p>
        <p className="text-xs text-gray-400 truncate">{conv.subtitle}</p>
        {conv.lastMessage && (
          <p className="text-xs text-gray-500 mt-1 truncate">
            {conv.lastMessage.isMine ? "You: " : ""}
            {conv.lastMessage.content}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {conv.lastMessageAt && (
          <span className="text-[10px] text-gray-400">{formatTime(conv.lastMessageAt)}</span>
        )}
        {conv.unreadCount > 0 && (
          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">
            {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
          </span>
        )}
      </div>
    </div>
  </button>
);

const Messages = () => {
  const { user } = useAuth();
  const { conversations, loading, refresh, openConversation, upsertConversation } = useChat();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedId = searchParams.get("conversation");
  const companyIdParam = searchParams.get("companyId");
  const applicationIdParam = searchParams.get("applicationId");
  const userIdParam = searchParams.get("userId");

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [opening, setOpening] = useState(false);
  const [activeConvMeta, setActiveConvMeta] = useState(null);
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [pendingApplicationId, setPendingApplicationId] = useState(null);
  const [pendingAppMeta, setPendingAppMeta] = useState(null);
  const [pendingSupportCompanyId, setPendingSupportCompanyId] = useState(null);
  const [pendingSupportMeta, setPendingSupportMeta] = useState(null);
  const [showNewPicker, setShowNewPicker] = useState(false);
  const [newPickerTab, setNewPickerTab] = useState("companies");
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [pendingUserId, setPendingUserId] = useState(null);
  const [pendingUserMeta, setPendingUserMeta] = useState(null);
  const [pendingUserPlatformSupport, setPendingUserPlatformSupport] = useState(false);
  const messagesContainerRef = useRef(null);
  const prevMessageCountRef = useRef(0);
  const pollRef = useRef(null);
  const initRef = useRef(false);

  const selected =
    conversations.find((c) => c.id === selectedId)
    ?? (activeConvMeta?.id === selectedId ? activeConvMeta : null)
    ?? (pendingApplicationId && pendingAppMeta ? pendingAppMeta : null)
    ?? (pendingSupportCompanyId && pendingSupportMeta ? pendingSupportMeta : null)
    ?? (pendingUserId && pendingUserMeta ? pendingUserMeta : null)
    ?? (pendingUserPlatformSupport ? PLATFORM_SUPPORT_META : null);

  const isChatOpen = Boolean(
    selectedId || pendingApplicationId || pendingSupportCompanyId || pendingUserId || pendingUserPlatformSupport
  );

  const loadApplicationMeta = useCallback(async (applicationId) => {
    const { data: app } = await axios.get(`/api/applications/${applicationId}`);
    const isApplicant = user?.role === "user";
    const companyName = app.job?.company?.name ?? "Company";
    const applicantName = app.applicant?.user?.name ?? "Applicant";
    return {
      applicationId,
      title: app.job?.title ?? "Job application",
      subtitle: isApplicant
        ? `${companyName} · Job application`
        : `${applicantName} · Job application`,
    };
  }, [user?.role]);

  const selectConversation = useCallback((id, meta = null) => {
    setPendingApplicationId(null);
    setPendingAppMeta(null);
    setPendingSupportCompanyId(null);
    setPendingSupportMeta(null);
    setPendingUserId(null);
    setPendingUserMeta(null);
    setPendingUserPlatformSupport(false);
    if (meta) setActiveConvMeta(meta);
    else if (id) {
      const found = conversations.find((c) => c.id === id);
      if (found) setActiveConvMeta(found);
    } else {
      setActiveConvMeta(null);
    }
    setSearchParams(id ? { conversation: id } : {});
  }, [setSearchParams, conversations]);

  const openJobChatView = useCallback(async (applicationId) => {
    setOpening(true);
    try {
      const { data: conv } = await axios.get(
        `/api/chat/conversations/by-application/${applicationId}`
      );
      setShowNewPicker(false);
      if (conv?.id) {
        setPendingApplicationId(null);
        setPendingAppMeta(null);
        setActiveConvMeta(conv);
        selectConversation(conv.id, conv);
        setSearchParams({ conversation: conv.id });
      } else {
        const meta = await loadApplicationMeta(applicationId);
        setPendingApplicationId(applicationId);
        setPendingAppMeta(meta);
        setActiveConvMeta(null);
        setMessages([]);
        setSearchParams({ applicationId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Could not open conversation");
    } finally {
      setOpening(false);
    }
  }, [loadApplicationMeta, selectConversation, setSearchParams]);

  const openUserPlatformSupportView = useCallback(async () => {
    setOpening(true);
    setShowNewPicker(false);
    try {
      const { data: conv } = await axios.get("/api/chat/conversations/user-support");
      if (conv?.id) {
        setPendingUserPlatformSupport(false);
        setActiveConvMeta(conv);
        selectConversation(conv.id, conv);
        setSearchParams({ conversation: conv.id });
        return;
      }
      setPendingUserPlatformSupport(true);
      setActiveConvMeta(null);
      setMessages([]);
      setSearchParams({ support: "platform" });
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Could not open platform support");
    } finally {
      setOpening(false);
    }
  }, [selectConversation, setSearchParams]);

  const loadCompanyMeta = useCallback(async (companyId) => {
    const { data: company } = await axios.get(`/api/companies/${companyId}`);
    const isSuperadmin = user?.role === "superadmin";
    return {
      companyId,
      title: isSuperadmin ? (company.name ?? "Company") : "Platform support",
      subtitle: isSuperadmin
        ? (company.admin?.name ?? "Company admin")
        : "Support",
    };
  }, [user?.role]);

  const openSupportChatView = useCallback(async (companyId = null) => {
    setOpening(true);
    setShowNewPicker(false);
    try {
      const { data: conv } = await axios.get("/api/chat/conversations/company-support", {
        params: companyId ? { companyId } : {},
      });
      if (conv?.id) {
        setPendingSupportCompanyId(null);
        setPendingSupportMeta(null);
        setActiveConvMeta(conv);
        selectConversation(conv.id, conv);
        setSearchParams({ conversation: conv.id });
        return;
      }

      let resolvedCompanyId = companyId;
      if (!resolvedCompanyId && user?.role === "company_admin") {
        const { data: company } = await axios.get("/api/companies/mine");
        resolvedCompanyId = company.id;
      }
      if (!resolvedCompanyId) return;

      const meta = await loadCompanyMeta(resolvedCompanyId);
      setPendingSupportCompanyId(resolvedCompanyId);
      setPendingSupportMeta(meta);
      setActiveConvMeta(null);
      setMessages([]);
      setSearchParams(
        user?.role === "superadmin"
          ? { companyId: resolvedCompanyId }
          : {}
      );
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Could not open support chat");
    } finally {
      setOpening(false);
    }
  }, [user?.role, loadCompanyMeta, selectConversation, setSearchParams]);

  const loadUserMeta = useCallback((profile) => ({
    userId: profile.user?.id ?? profile.userId,
    title: profile.fullname ?? profile.user?.name ?? "Job seeker",
    subtitle: profile.email ?? profile.user?.email ?? "User",
  }), []);

  const openUserChatView = useCallback(async (targetUserId) => {
    if (!targetUserId) return;
    setOpening(true);
    try {
      const { data: conv } = await axios.get("/api/chat/conversations/user-support", {
        params: { userId: targetUserId },
      });
      setShowNewPicker(false);
      if (conv?.id) {
        setPendingUserId(null);
        setPendingUserMeta(null);
        setActiveConvMeta(conv);
        selectConversation(conv.id, conv);
        setSearchParams({ conversation: conv.id });
      } else {
        let profile = users.find((u) => (u.user?.id ?? u.userId) === targetUserId);
        if (!profile) {
          try {
            const { data } = await axios.get("/api/applicants");
            profile = Array.isArray(data)
              ? data.find((p) => p.user?.id === targetUserId)
              : null;
          } catch {
            profile = null;
          }
        }
        const meta = profile
          ? loadUserMeta(profile)
          : { userId: targetUserId, title: "Job seeker", subtitle: "User" };
        setPendingUserId(targetUserId);
        setPendingUserMeta(meta);
        setActiveConvMeta(null);
        setMessages([]);
        setSearchParams({ userId: targetUserId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Could not open conversation");
    } finally {
      setOpening(false);
    }
  }, [users, loadUserMeta, selectConversation, setSearchParams]);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const { data } = await axios.get("/api/applicants");
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
      toast.error("Could not load registered users");
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const loadCompanies = useCallback(async () => {
    setCompaniesLoading(true);
    try {
      const { data } = await axios.get("/api/companies");
      setCompanies(Array.isArray(data) ? data : []);
    } catch {
      setCompanies([]);
      toast.error("Could not load companies");
    } finally {
      setCompaniesLoading(false);
    }
  }, []);

  const loadUserApplications = useCallback(async () => {
    setAppsLoading(true);
    try {
      const { data: applicant } = await axios.get("/api/applicants/me");
      const { data: apps } = await axios.get(`/api/applications?applicantId=${applicant.id}`);
      setApplications(Array.isArray(apps) ? apps : []);
    } catch {
      setApplications([]);
      toast.error("Could not load your applications");
    } finally {
      setAppsLoading(false);
    }
  }, []);

  const loadCompanyApplications = useCallback(async () => {
    setAppsLoading(true);
    try {
      const { data: company } = await axios.get("/api/companies/mine");
      const { data: apps } = await axios.get(`/api/applications?companyId=${company.id}`);
      setApplications(Array.isArray(apps) ? apps : []);
    } catch {
      setApplications([]);
      toast.error("Could not load applications for your jobs");
    } finally {
      setAppsLoading(false);
    }
  }, []);

  const handleOpenNewPicker = () => {
    setShowNewPicker(true);
    if (user.role === "user") {
      loadUserApplications();
    } else if (user.role === "superadmin") {
      setNewPickerTab("companies");
      loadCompanies();
      loadUsers();
    } else if (user.role === "company_admin") {
      loadCompanyApplications();
    }
  };

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setMessagesLoading(true);
    try {
      const { data } = await axios.get(`/api/chat/conversations/${conversationId}/messages`);
      setMessages(Array.isArray(data) ? data : []);
      await axios.patch(`/api/chat/conversations/${conversationId}/read`);
      refresh();
    } catch {
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (initRef.current) return;
    const supportParam = searchParams.get("support");
    if (
      !applicationIdParam
      && !(companyIdParam && user?.role === "superadmin")
      && !(userIdParam && user?.role === "superadmin")
      && !(supportParam === "platform" && user?.role === "user")
    ) return;

    initRef.current = true;
    const init = async () => {
      if (applicationIdParam) {
        await openJobChatView(applicationIdParam);
        return;
      }

      if (companyIdParam && user?.role === "superadmin") {
        await openSupportChatView(companyIdParam);
        return;
      }

      if (userIdParam && user?.role === "superadmin") {
        await openUserChatView(userIdParam);
        return;
      }

      if (supportParam === "platform" && user?.role === "user") {
        await openUserPlatformSupportView();
      }
    };
    init();
  }, [applicationIdParam, companyIdParam, userIdParam, searchParams, user?.role, openSupportChatView, openJobChatView, openUserChatView, openUserPlatformSupportView]);

  useEffect(() => {
    loadMessages(selectedId);
  }, [selectedId, loadMessages]);

  useEffect(() => {
    if (!selectedId) return undefined;

    pollRef.current = setInterval(() => loadMessages(selectedId), 5000);
    return () => clearInterval(pollRef.current);
  }, [selectedId, loadMessages]);

  useEffect(() => {
    const interval = setInterval(() => refresh(), 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    if (messages.length === 0) {
      prevMessageCountRef.current = 0;
      return;
    }
    const container = messagesContainerRef.current;
    if (!container) return;

    const grew = messages.length > prevMessageCountRef.current;
    prevMessageCountRef.current = messages.length;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: grew && messages.length > 1 ? "smooth" : "auto",
    });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    if (!selectedId && !pendingApplicationId && !pendingSupportCompanyId && !pendingUserId && !pendingUserPlatformSupport) return;

    setSending(true);
    try {
      let convId = selectedId;
      if (!convId && pendingApplicationId) {
        const conv = await openConversation({
          type: "job_application",
          applicationId: pendingApplicationId,
        });
        convId = conv.id;
        setPendingApplicationId(null);
        setPendingAppMeta(null);
        upsertConversation(conv);
        setActiveConvMeta(conv);
        setSearchParams({ conversation: conv.id });
      } else if (!convId && pendingSupportCompanyId) {
        const payload = { type: "company_support" };
        if (user.role === "superadmin") {
          payload.companyId = pendingSupportCompanyId;
        }
        const conv = await openConversation(payload);
        convId = conv.id;
        setPendingSupportCompanyId(null);
        setPendingSupportMeta(null);
        upsertConversation(conv);
        setActiveConvMeta(conv);
        setSearchParams({ conversation: conv.id });
      } else if (!convId && pendingUserPlatformSupport) {
        const conv = await openConversation({ type: "user_support" });
        convId = conv.id;
        setPendingUserPlatformSupport(false);
        upsertConversation(conv);
        setActiveConvMeta(conv);
        setSearchParams({ conversation: conv.id });
      } else if (!convId && pendingUserId) {
        const conv = await openConversation({
          type: "user_support",
          userId: pendingUserId,
        });
        convId = conv.id;
        setPendingUserId(null);
        setPendingUserMeta(null);
        upsertConversation(conv);
        setActiveConvMeta(conv);
        setSearchParams({ conversation: conv.id });
      }

      const { data } = await axios.post(`/api/chat/conversations/${convId}/messages`, {
        content: text,
      });
      setMessages((prev) => [...prev, data]);
      setDraft("");
      if (data.conversation) {
        upsertConversation(data.conversation);
        setActiveConvMeta(data.conversation);
      }
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (loading && conversations.length === 0 && !opening) {
    return (
      <Page>
        <div className="py-24"><Spinner loading /></div>
      </Page>
    );
  }

  return (
    <Page className="max-w-6xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <PageTitle>Messages</PageTitle>
          <p className="text-sm text-gray-500 mt-1">
            {user.role === "user"
              ? "Message employers per job application, or contact platform support"
              : user.role === "company_admin"
                ? "Message applicants per job application, or contact platform support"
                : "Message companies or job seekers directly, plus view contact inquiries"}
          </p>
        </div>
        {(user.role === "user" || user.role === "company_admin" || user.role === "superadmin") && (
          <button
            type="button"
            onClick={handleOpenNewPicker}
            disabled={opening}
            className={Btn.primary("gap-2 text-sm")}
          >
            <FaPlus size={12} /> New message
          </button>
        )}
      </div>

      {showNewPicker && user.role === "superadmin" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowNewPicker(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="New message"
          >
          <Card className="shadow-float p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">New message</h2>
                <p className="text-xs text-gray-500 mt-0.5">Message a company or a job seeker</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewPicker(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                aria-label="Close"
              >
                <FaTimes size={14} />
              </button>
            </div>
            <div className="flex border-b border-gray-100">
              <button
                type="button"
                onClick={() => setNewPickerTab("companies")}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors
                  ${newPickerTab === "companies"
                    ? "text-brand-700 border-b-2 border-brand-600 bg-brand-50/50"
                    : "text-gray-500 hover:text-gray-700"}`}
              >
                Companies
              </button>
              <button
                type="button"
                onClick={() => setNewPickerTab("users")}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors
                  ${newPickerTab === "users"
                    ? "text-brand-700 border-b-2 border-brand-600 bg-brand-50/50"
                    : "text-gray-500 hover:text-gray-700"}`}
              >
                Job seekers
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {newPickerTab === "companies" ? (
                companiesLoading ? (
                  <div className="py-12"><Spinner loading /></div>
                ) : companies.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-10 px-5">No companies found.</p>
                ) : (
                  companies.map((company) => (
                    <button
                      key={company.id}
                      type="button"
                      disabled={opening}
                      onClick={() => openSupportChatView(company.id)}
                      className="w-full text-left px-5 py-3.5 border-b border-gray-50 hover:bg-brand-50/50 transition-colors disabled:opacity-50"
                    >
                      <p className="text-sm font-semibold text-gray-900 truncate">{company.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {company.admin?.name ?? company.adminName ?? "Company admin"}
                      </p>
                    </button>
                  ))
                )
              ) : usersLoading ? (
                <div className="py-12"><Spinner loading /></div>
              ) : users.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10 px-5">No registered users found.</p>
              ) : (
                users.map((profile) => {
                  const id = profile.user?.id;
                  if (!id) return null;
                  return (
                    <button
                      key={profile.id ?? id}
                      type="button"
                      disabled={opening}
                      onClick={() => openUserChatView(id)}
                      className="w-full text-left px-5 py-3.5 border-b border-gray-50 hover:bg-brand-50/50 transition-colors disabled:opacity-50"
                    >
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {profile.fullname ?? profile.user?.name ?? "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {profile.email ?? profile.user?.email ?? "—"}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </Card>
          </div>
        </div>
      )}

      {showNewPicker && user.role === "company_admin" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowNewPicker(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="New message"
          >
          <Card className="shadow-float p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">New message</h2>
                <p className="text-xs text-gray-500 mt-0.5">Per job application or platform support</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewPicker(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                aria-label="Close"
              >
                <FaTimes size={14} />
              </button>
            </div>
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
              <button
                type="button"
                disabled={opening}
                onClick={() => { setShowNewPicker(false); openSupportChatView(); }}
                className="w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-xl border border-gray-200
                  bg-white hover:bg-brand-50/50 transition-colors disabled:opacity-50"
              >
                <FaHeadset className="text-brand-600 shrink-0" size={14} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Platform support</p>
                  <p className="text-xs text-gray-500">Message the super admin team</p>
                </div>
              </button>
            </div>
            <div className="px-5 py-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Applicants by job
              </p>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {appsLoading ? (
                <div className="py-12"><Spinner loading /></div>
              ) : applications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10 px-5">
                  No applications yet. When someone applies to your jobs, you can message them here per job.
                </p>
              ) : (
                applications.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    disabled={opening}
                    onClick={() => { setShowNewPicker(false); openJobChatView(app.id); }}
                    className="w-full text-left px-5 py-3.5 border-b border-gray-50 hover:bg-brand-50/50 transition-colors disabled:opacity-50"
                  >
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {app.job?.title ?? app.jobtitle ?? "Job"}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {app.applicant?.user?.name ?? app.applicantname ?? "Applicant"}
                    </p>
                    <div className="mt-1.5">
                      <Badge status={app.status} />
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>
          </div>
        </div>
      )}

      {showNewPicker && user.role === "user" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowNewPicker(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="New message"
          >
          <Card className="shadow-float p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">New message</h2>
                <p className="text-xs text-gray-500 mt-0.5">Per job application or platform support</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewPicker(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                aria-label="Close"
              >
                <FaTimes size={14} />
              </button>
            </div>
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
              <button
                type="button"
                disabled={opening}
                onClick={() => openUserPlatformSupportView()}
                className="w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-xl border border-gray-200
                  bg-white hover:bg-brand-50/50 transition-colors disabled:opacity-50"
              >
                <FaHeadset className="text-brand-600 shrink-0" size={14} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Platform support</p>
                  <p className="text-xs text-gray-500">Get help from the Application Tracker team</p>
                </div>
              </button>
            </div>
            <div className="px-5 py-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Employers by job
              </p>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {appsLoading ? (
                <div className="py-12"><Spinner loading /></div>
              ) : applications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10 px-5">
                  You have no applications yet. Apply to a job first, then you can message the employer here per job.
                </p>
              ) : (
                applications.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    disabled={opening}
                    onClick={() => { setShowNewPicker(false); openJobChatView(app.id); }}
                    className="w-full text-left px-5 py-3.5 border-b border-gray-50 hover:bg-brand-50/50 transition-colors disabled:opacity-50"
                  >
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {app.job?.title ?? "Job"}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {app.job?.company?.name ?? "Company"}
                    </p>
                    <div className="mt-1.5">
                      <Badge status={app.status} />
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>
          </div>
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[520px] max-h-[calc(100vh-12rem)]">
          {/* Conversation list */}
          <div className={`md:w-80 border-r border-gray-100 flex flex-col shrink-0
            ${isChatOpen ? "hidden md:flex" : "flex"}`}>
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <FaComments size={12} /> Conversations
              </p>
              {(user.role === "user" || user.role === "company_admin" || user.role === "superadmin") && (
                <button
                  type="button"
                  onClick={handleOpenNewPicker}
                  disabled={opening}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 disabled:opacity-50"
                >
                  + New
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-400">No conversations yet.</p>
                  {(user.role === "user" || user.role === "company_admin" || user.role === "superadmin") && (
                    <button
                      type="button"
                      onClick={handleOpenNewPicker}
                      disabled={opening}
                      className="mt-3 text-sm text-brand-600 hover:underline disabled:opacity-50"
                    >
                      Start a new message
                    </button>
                  )}
                </div>
              ) : (
                [...conversations]
                  .sort((a, b) => {
                    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
                    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
                    return bTime - aTime;
                  })
                  .map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    active={conv.id === selectedId}
                    onClick={() => selectConversation(conv.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Chat panel */}
          <div className={`flex-1 flex flex-col min-w-0
            ${!isChatOpen ? "hidden md:flex" : "flex"}`}>
            {!selected ? (
              user.role === "user" ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-3xl mb-3">💬</p>
                  <p className="text-sm text-gray-500 font-medium mb-4">
                    Select a conversation or start a new chat about a job you applied to.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenNewPicker}
                    disabled={opening}
                    className={Btn.primary("gap-2 text-sm disabled:opacity-50")}
                  >
                    <FaPlus size={12} /> New message
                  </button>
                </div>
              ) : user.role === "company_admin" || user.role === "superadmin" ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-3xl mb-3">💬</p>
                  <p className="text-sm text-gray-500 font-medium mb-4">
                    {user.role === "company_admin"
                      ? "Select a conversation or message an applicant about a specific job."
                      : "Select a conversation or message a company or job seeker."}
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenNewPicker}
                    disabled={opening}
                    className={Btn.primary("gap-2 text-sm disabled:opacity-50")}
                  >
                    <FaPlus size={12} /> New message
                  </button>
                </div>
              ) : (
                <Empty message="Select a conversation to start chatting." icon="💬" />
              )
            ) : (
              <>
                <div className="px-4 py-3 border-b border-gray-100 bg-white shrink-0 flex items-center gap-3">
                  <button
                    type="button"
                    className="md:hidden text-sm text-brand-600"
                    onClick={() => {
                      setPendingApplicationId(null);
                      setPendingAppMeta(null);
                      setPendingSupportCompanyId(null);
                      setPendingSupportMeta(null);
                      setPendingUserId(null);
                      setPendingUserMeta(null);
                      setPendingUserPlatformSupport(false);
                      selectConversation(null);
                    }}
                  >
                    ← Back
                  </button>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{selected.title}</p>
                    <p className="text-xs text-gray-400 truncate">{selected.subtitle}</p>
                  </div>
                </div>

                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/50"
                >
                  {messagesLoading && messages.length === 0 ? (
                    <div className="py-12"><Spinner loading /></div>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-12">
                      No messages yet. Say hello!
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm
                            ${msg.isMine
                              ? "bg-brand-600 text-white rounded-br-md"
                              : "bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-sm"}`}
                        >
                          {!msg.isMine && (
                            <p className="text-[10px] font-semibold text-gray-400 mb-0.5">
                              {msg.sender?.name}
                            </p>
                          )}
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${msg.isMine ? "text-brand-200" : "text-gray-400"}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {selected.replyable === false ? (
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-center shrink-0">
                    <p className="text-xs text-gray-500">
                      This is a one-way contact inquiry. Replies are not available in chat.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSend}
                    className="px-4 py-3 border-t border-gray-100 bg-white flex gap-2 shrink-0"
                  >
                    <input
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Type a message…"
                      className={inputCls()}
                      maxLength={5000}
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim() || sending}
                      className={Btn.primary("shrink-0 px-4 disabled:opacity-50")}
                      aria-label="Send message"
                    >
                      <FaPaperPlane size={14} />
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </Card>
    </Page>
  );
};

export default Messages;
