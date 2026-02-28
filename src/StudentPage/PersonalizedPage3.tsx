import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PersonalizedPage3() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/personalized?lesson=3", { replace: true });
  }, [navigate]);

  return null;
}