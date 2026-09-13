
import { useNavigate } from "react-router-dom";
import "./FloatingHomeButton.css";
import { Home } from "lucide-react";

const FloatingHomeButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className={`fcbh`}
      onClick={() => navigate("/")}
    >

      <Home className="fcbh__icon" />
    </button>
  );
};

export default FloatingHomeButton;