import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const useQuery = () => {
  // custom hook to get the query params
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  return query;
};
