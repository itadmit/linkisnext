"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FiGlobe, FiX } from "react-icons/fi";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { translations, Language } from "@/lib/i18n/translations";

const countryToLanguage: Record<string, Language> = {
  IL: "he",
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
  NZ: "en",
  SA: "ar",
  AE: "ar",
  EG: "ar",
  ES: "es",
  MX: "es",
  AR: "es",
  FR: "fr",
  BE: "fr",
  CH: "fr",
  DE: "de",
  AT: "de",
  IT: "it",
  PT: "pt",
  BR: "pt",
  RU: "ru",
  JP: "ja",
  KR: "ko",
  CN: "zh",
  TW: "zh",
  NL: "nl",
  PL: "pl",
  TR: "tr",
  SE: "sv",
  NO: "no",
  DK: "da",
  FI: "fi",
};

const countryNames: Record<string, string> = {
  IL: "Israel",
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  NZ: "New Zealand",
  SA: "Saudi Arabia",
  AE: "UAE",
  EG: "Egypt",
  ES: "Spain",
  MX: "Mexico",
  AR: "Argentina",
  FR: "France",
  BE: "Belgium",
  CH: "Switzerland",
  DE: "Germany",
  AT: "Austria",
  IT: "Italy",
  PT: "Portugal",
  BR: "Brazil",
  RU: "Russia",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  TW: "Taiwan",
  NL: "Netherlands",
  PL: "Poland",
  TR: "Turkey",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
};

export function CountryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState<string | null>(null);
  const { language, setLanguage, t } = useTranslation();

  useEffect(() => {
    // Check if user has already dismissed the modal
    const dismissed = localStorage.getItem("countryModalDismissed");
    if (dismissed) return;

    // Detect country using IP geolocation
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const countryCode = data.country_code;
        if (countryCode) {
          setCountry(countryCode);
          // Only show modal if not from Israel
          if (countryCode !== "IL") {
            setIsOpen(true);
          }
        }
      })
      .catch(() => {
        // Fallback: don't show modal if API fails
      });
  }, []);

  const handleStay = () => {
    setIsOpen(false);
    localStorage.setItem("countryModalDismissed", "true");
  };

  const handleSwitch = () => {
    const suggestedLang = countryToLanguage[country] || "en";
    setLanguage(suggestedLang);
    setIsOpen(false);
    localStorage.setItem("countryModalDismissed", "true");
  };

  if (!isOpen || !country) return null;

  const countryName = countryNames[country] || country;
  const suggestedLang = countryToLanguage[country] || "en";

  return (
    <Modal isOpen={isOpen} onClose={handleStay} title="">
      <div className="text-center p-6" dir={language === "he" ? "rtl" : "ltr"}>
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiGlobe className="text-indigo-600" size={32} />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 mb-2">
          {country === "IL"
            ? t("countryModal.title")
            : `${t("countryModal.titleOther")} ${countryName}`}
        </h3>
        <p className="text-zinc-600 mb-6">
          {country === "IL"
            ? "אנחנו ממליצים להשאר בעברית"
            : `We recommend switching to ${suggestedLang === "en" ? "English" : suggestedLang.toUpperCase()}`}
        </p>
        <div className="flex gap-3 justify-center">
          {country !== "IL" && (
            <Button onClick={handleSwitch} variant="secondary">
              {t("countryModal.switchToEnglish")}
            </Button>
          )}
          <Button onClick={handleStay}>
            {country === "IL" ? t("countryModal.stayInHebrew") : "Stay in current language"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

