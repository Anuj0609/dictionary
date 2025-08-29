"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface DictionaryResult {
  word: string;
  phonetic?: string;
  meanings: Meaning[];
}

function Loader() {
  return (
    <div className="flex justify-center mb-6">
      <svg className="animate-spin w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24">
        <circle className="text-pink-200" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );
}

export default function Home() {
  const MEANINGS_LIMIT = 2;
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<DictionaryResult[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (input.length < 2) {
      setResult([]);
      setError("");
      return;
    }
    const timer = setTimeout(() => {
      meaning(input);
    }, 500);
    return () => clearTimeout(timer);
  }, [input]);

  const meaning = async (word: string) => {
    try {
      setLoading(true);
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      const res = await axios.get(url);
      setResult(res.data);
      setError("");
    } catch (err) {
      setResult([]);
      setError("❌ No results found, try another word.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-300 via-yellow-200 to-green-200 p-4 sm:p-6 md:p-8">
      <div className="backdrop-blur-md bg-white/70 border border-yellow-400 shadow-2xl rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-md sm:max-w-lg md:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-pink-600 mb-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 select-none drop-shadow-lg">
          <span role="img" aria-label="dictionary" className="inline-block">📖</span>
          Mini Dictionary
          <span role="img" aria-label="sparkles" className="animate-pulse text-yellow-400">✨</span>
        </h1>
        <div className="relative mb-6 sm:mb-8">
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a word..."
            value={input}
            className="w-full pl-14 pr-6 py-3 sm:py-4 md:py-5 rounded-3xl bg-gradient-to-r from-pink-100 via-yellow-100 to-green-100 border border-pink-400 focus:ring-4 focus:ring-pink-300 outline-none text-md sm:text-lg md:text-xl shadow-lg placeholder-pink-400 transition-all"
          />
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none">
            <svg fill="none" viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7">
              <path stroke="currentColor" strokeWidth="2" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
          </span>
        </div>
        {loading && <Loader />}
        {error && (
          <p className="text-red-600 font-semibold text-base sm:text-lg mb-4 text-center select-none">{error}</p>
        )}
        {result.length > 0 && (
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4 justify-center">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-700 underline decoration-yellow-300 decoration-4 rounded-md px-3 py-1 sm:px-4 sm:py-1 shadow-lg select-text tracking-wide">
                {result[0].word}
              </span>
              {result[0].phonetic && (
                <span className="px-4 py-1 bg-yellow-300 text-pink-800 rounded-lg font-semibold text-sm sm:text-lg shadow-md select-text whitespace-nowrap">
                  {result[0].phonetic}
                </span>
              )}
            </div>
            {result[0].meanings.slice(0, MEANINGS_LIMIT).map((m: Meaning, i: number) => (
              <div
                key={i}
                className="bg-gradient-to-r from-pink-50 via-yellow-50 to-green-50 rounded-xl border-l-8 border-pink-400 p-4 sm:p-6 md:p-8 shadow-inner"
              >
                <span className="inline-block px-3 sm:px-4 py-1 mb-4 bg-pink-300 text-pink-900 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider select-none drop-shadow-sm">
                  {m.partOfSpeech}
                </span>
                {m.definitions.map((d: Definition, j: number) => (
                  <div key={j} className="mb-4 last:mb-0">
                    <p className="text-pink-800 text-base sm:text-lg md:text-lg leading-relaxed font-semibold select-text">
                      <b>Meaning:</b> {d.definition}
                    </p>
                    {d.example && (
                      <p className="italic text-yellow-700 pl-2 border-l-4 border-yellow-400 mt-1 select-text text-sm sm:text-base md:text-base">
                        <b>Example:</b> “{d.example}”
                      </p>
                    )}
                    {d.synonyms && d.synonyms.length > 0 && (
                      <p className="mt-2 text-pink-700 select-text text-sm sm:text-base md:text-base">
                        <b>Synonyms:</b> {d.synonyms.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
