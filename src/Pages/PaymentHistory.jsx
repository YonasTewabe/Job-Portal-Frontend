import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import NotFoundPage from "./NotFoundPage";
import { toast } from "../utils/toast";
import { Page, PageTitle, Card, Table, Tr, Td, Empty, inputCls, Btn } from "../Components/ui";
import { CreditCardIcon } from "../Components/icons";

const formatMoney = (amount, currency = "ETB") => `${Number(amount).toLocaleString()} ${currency}`;

const formatDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

const PaymentHistory = () => {
  const { user } = useAuth();
  const role = user?.role;
  const isSuperAdmin = role === "superadmin";
  const isCompanyAdmin = role === "company_admin";

  const [payments, setPayments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (!isSuperAdmin) return;
    axios
      .get("/api/companies")
      .then(({ data }) => setCompanies(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [isSuperAdmin]);

  useEffect(() => {
    if (!isSuperAdmin && !isCompanyAdmin) return;

    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (fromDate) params.set("from", fromDate);
        if (toDate) params.set("to", toDate);
        if (isSuperAdmin && companyId) params.set("companyId", companyId);

        const url = isSuperAdmin
          ? `/api/payments?${params.toString()}`
          : `/api/payments/mine?${params.toString()}`;

        const { data } = await axios.get(url);
        setPayments(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load payment history");
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isSuperAdmin, isCompanyAdmin, companyId, fromDate, toDate]);

  const totalAmount = useMemo(
    () => payments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [payments]
  );

  if (!isSuperAdmin && !isCompanyAdmin) return <NotFoundPage />;

  const headers = [
    { label: "Date", key: "date" },
    ...(isSuperAdmin ? [{ label: "Company", key: "company" }] : []),
    { label: "Job", key: "job" },
    { label: "Amount", key: "amount" },
    { label: "Payer", key: "payer" },
    { label: "Reference", key: "ref" },
    { label: "Status", key: "status" },
  ];

  const clearFilters = () => {
    setCompanyId("");
    setFromDate("");
    setToDate("");
  };

  return (
    <Page className="max-w-7xl">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <PageTitle>Payment history</PageTitle>
          <p className="text-sm text-gray-500 mt-1">
            {payments.length} payment{payments.length !== 1 ? "s" : ""}
            {payments.length > 0 && ` · Total ${formatMoney(totalAmount)}`}
          </p>
        </div>
        {isSuperAdmin && (
          <Link to="/superadmin/pricing" className={Btn.secondary("text-sm shrink-0")}>
            Set Job posting price
          </Link>
        )}
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isSuperAdmin && (
            <div>
              <label
                htmlFor="company-filter"
                className="block mb-1.5 text-sm font-medium text-gray-700"
              >
                Company
              </label>
              <select
                id="company-filter"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className={inputCls()}
              >
                <option value="">All companies</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="from-date" className="block mb-1.5 text-sm font-medium text-gray-700">
              From date
            </label>
            <input
              id="from-date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={inputCls()}
            />
          </div>
          <div>
            <label htmlFor="to-date" className="block mb-1.5 text-sm font-medium text-gray-700">
              To date
            </label>
            <input
              id="to-date"
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
              className={inputCls()}
            />
          </div>
          <div className="flex items-end">
            <button type="button" onClick={clearFilters} className={Btn.secondary("w-full")}>
              Clear filters
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="py-20">
            <Spinner loading />
          </div>
        ) : (
          <Table
            headers={headers}
            empty={
              payments.length === 0 ? (
                <Empty
                  message="No payments found for the selected filters."
                  icon={CreditCardIcon}
                />
              ) : null
            }
          >
            {payments.map((payment, i) => (
              <Tr key={payment.id} striped={i % 2 !== 0}>
                <Td className="text-xs text-gray-600 whitespace-nowrap">
                  {formatDateTime(payment.paidAt)}
                </Td>
                {isSuperAdmin && (
                  <Td className="font-medium text-gray-900 whitespace-nowrap">
                    {payment.companyName ?? "—"}
                  </Td>
                )}
                <Td>
                  <div className="text-sm font-medium text-gray-900">{payment.jobTitle}</div>
                  {payment.jobId && (
                    <Link
                      to={`/job/${payment.jobId}`}
                      className="text-xs text-brand-600 hover:text-brand-800 font-medium"
                    >
                      View job
                    </Link>
                  )}
                </Td>
                <Td className="font-semibold text-gray-900 whitespace-nowrap">
                  {formatMoney(payment.amount, payment.currency)}
                </Td>
                <Td>
                  <div className="text-sm text-gray-800">{payment.payerName}</div>
                  <div className="text-xs text-gray-500">{payment.payerEmail}</div>
                </Td>
                <Td className="text-xs text-gray-500 font-mono">{payment.txRef}</Td>
                <Td>
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                    bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize"
                  >
                    {payment.status}
                  </span>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </Page>
  );
};

export default PaymentHistory;
