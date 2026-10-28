import { useCallback, useEffect, useState } from "react";

type Quote = { text: string; author: string };

export function useQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("https://dummyjson.com/quotes/random");
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setQuote({ text: data.quote, author: data.author });
    } catch {
      setError("Could not load the quote. Please check your internet.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { quote, loading, error, reload: load };
}