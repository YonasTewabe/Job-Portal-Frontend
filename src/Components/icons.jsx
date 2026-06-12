/**
 * Lucide-based icon set — consistent stroke weight and sizing app-wide.
 */
import {
  LuArrowDown,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
  LuArrowUpDown,
  LuBell,
  LuBriefcase,
  LuBuilding2,
  LuCalendar,
  LuChevronRight,
  LuCheckCircle,
  LuUserCircle,
  LuXCircle,
  LuClipboardList,
  LuClock,
  LuCreditCard,
  LuDollarSign,
  LuDownload,
  LuEye,
  LuEyeOff,
  LuFileText,
  LuHeadphones,
  LuHome,
  LuKeyRound,
  LuLayoutDashboard,
  LuList,
  LuLogOut,
  LuMail,
  LuMapPin,
  LuMenu,
  LuMessageSquare,
  LuPencil,
  LuPhone,
  LuPlus,
  LuRefreshCw,
  LuSearch,
  LuSend,
  LuTarget,
  LuTrash2,
  LuTrendingUp,
  LuUserPlus,
  LuUsers,
  LuX,
} from "react-icons/lu";

const DEFAULT_SIZE = 18;
const DEFAULT_STROKE = 1.75;

function createIcon(IconComponent) {
  const Wrapped = ({
    size = DEFAULT_SIZE,
    strokeWidth = DEFAULT_STROKE,
    className = "",
    ...props
  }) => (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={`shrink-0 ${className}`.trim()}
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
    />
  );
  Wrapped.displayName = IconComponent.displayName ?? IconComponent.name;
  return Wrapped;
}

export const HomeIcon = createIcon(LuHome);
export const BriefcaseIcon = createIcon(LuBriefcase);
export const UserPlusIcon = createIcon(LuUserPlus);
export const ListIcon = createIcon(LuList);
export const UsersIcon = createIcon(LuUsers);
export const BuildingIcon = createIcon(LuBuilding2);
export const DashboardIcon = createIcon(LuLayoutDashboard);
export const MenuIcon = createIcon(LuMenu);
export const CloseIcon = createIcon(LuX);
export const MessageIcon = createIcon(LuMessageSquare);
export const LogoutIcon = createIcon(LuLogOut);
export const UserCircleIcon = createIcon(LuUserCircle);
export const ArrowLeftIcon = createIcon(LuArrowLeft);
export const ArrowRightIcon = createIcon(LuArrowRight);
export const MapPinIcon = createIcon(LuMapPin);
export const ClockIcon = createIcon(LuClock);
export const DollarIcon = createIcon(LuDollarSign);
export const PhoneIcon = createIcon(LuPhone);
export const MailIcon = createIcon(LuMail);
export const PlusIcon = createIcon(LuPlus);
export const TrashIcon = createIcon(LuTrash2);
export const EditIcon = createIcon(LuPencil);
export const KeyIcon = createIcon(LuKeyRound);
export const DownloadIcon = createIcon(LuDownload);
export const FileTextIcon = createIcon(LuFileText);
export const CheckCircleIcon = createIcon(LuCheckCircle);
export const XCircleIcon = createIcon(LuXCircle);
export const SearchIcon = createIcon(LuSearch);
export const BellIcon = createIcon(LuBell);
export const ChevronRightIcon = createIcon(LuChevronRight);
export const SortIcon = createIcon(LuArrowUpDown);
export const SortUpIcon = createIcon(LuArrowUp);
export const SortDownIcon = createIcon(LuArrowDown);
export const RefreshIcon = createIcon(LuRefreshCw);
export const EyeIcon = createIcon(LuEye);
export const EyeOffIcon = createIcon(LuEyeOff);
export const TargetIcon = createIcon(LuTarget);
export const TrendingUpIcon = createIcon(LuTrendingUp);
export const ClipboardIcon = createIcon(LuClipboardList);
export const SendIcon = createIcon(LuSend);
export const HeadsetIcon = createIcon(LuHeadphones);
export const CreditCardIcon = createIcon(LuCreditCard);
export const CalendarIcon = createIcon(LuCalendar);

/** Decorative icon for empty states */
export const EmptyStateIcon = ({ icon: Icon, className = "" }) => (
  <div
    className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-500 ${className}`}
  >
    <Icon size={26} strokeWidth={1.5} />
  </div>
);
