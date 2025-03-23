import { useNavigate } from "react-router-dom";
const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/appointment/${doctor._id}`)}
      className="border border-blue-400 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
    >
      <img className="bg-blue-100" src={doctor.image} alt={doctor.name} />
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-green-500 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <p>Available</p>
        </div>
        <p className="text-gray-900 text-lg font-medium">{doctor.name}</p>
        <p className="text-gray-600 text-sm">{doctor.speciality}</p>
      </div>
    </div>
  );
};

export default DoctorCard;
