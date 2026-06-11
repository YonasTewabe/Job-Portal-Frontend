import ClipLoader from "react-spinners/ClipLoader";

const Spinner = ({ loading = true, size = 48 }) => (
  <div className="flex justify-center items-center py-10">
    <ClipLoader color="#2563eb" loading={loading} size={size} />
  </div>
);

export default Spinner;
