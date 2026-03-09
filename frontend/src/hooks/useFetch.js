import { useState, useEffect, useCallback } from "react";

const useFetch = (url, interval = 2000) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetch_ = useCallback(() => {
    fetch(url).then((r) => r.json()).then(setData).catch(setError);
  }, [url]);

  useEffect(() => {
    fetch_();
    const t = setInterval(fetch_, interval);
    return () => clearInterval(t);
  }, [fetch_, interval]);

  return { data, error, refetch: fetch_ };
};

export default useFetch;
