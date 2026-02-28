import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PersonalizedPage2() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/personalized?lesson=2", { replace: true });
  }, [navigate]);

  return null;
}