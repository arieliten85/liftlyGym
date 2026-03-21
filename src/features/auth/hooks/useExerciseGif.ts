import { useEffect, useState } from "react";

const RAPIDAPI_KEY = "e0f9e1a06bmsh28912f0160bbad7p16165ajsn713f74afd59f";

const RAPIDAPI_HOST = "exercisedb.p.rapidapi.com";
const BASE_URL = `https://${RAPIDAPI_HOST}`;

const HEADERS = {
  "x-rapidapi-host": RAPIDAPI_HOST,
  "x-rapidapi-key": RAPIDAPI_KEY,
};

const cache: Record<string, string> = {};

const normalize = (name: string) => {
  const map: Record<string, string> = {
    dominadas: "pull up",
    remo_barra: "barbell row",
    jalon_al_pecho: "lat pulldown",
    curl_barra: "barbell curl",
  };

  return map[name] || name.replaceAll("_", " ");
};

export function useExerciseGif(exerciseName: string) {
  const [gifUrl, setGifUrl] = useState<string | null>(
    cache[exerciseName] || null,
  );
  const [loading, setLoading] = useState(!cache[exerciseName]);

  useEffect(() => {
    if (!exerciseName) return;

    if (cache[exerciseName]) {
      setGifUrl(cache[exerciseName]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchGif = async () => {
      try {
        setLoading(true);

        const query = normalize(exerciseName);

        // 1. Buscar ejercicio
        const res = await fetch(
          `${BASE_URL}/exercises/name/${encodeURIComponent(query)}`,
          { headers: HEADERS },
        );

        const data = await res.json();

        if (!data?.length) throw new Error("No results");

        const id = data[0].id;

        // 2. Descargar imagen como blob
        const imgRes = await fetch(
          `${BASE_URL}/image?exerciseId=${id}&resolution=180`,
          { headers: HEADERS },
        );

        const blob = await imgRes.blob();

        // 3. Convertir a base64
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64 = reader.result as string;

          cache[exerciseName] = base64;

          if (!cancelled) {
            setGifUrl(base64);
          }
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.log("Error con:", error, exerciseName);
        if (!cancelled) setGifUrl(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchGif();

    return () => {
      cancelled = true;
    };
  }, [exerciseName]);

  return { gifUrl, loading };
}
