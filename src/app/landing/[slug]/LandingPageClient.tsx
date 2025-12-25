"use client";

import { useState, useEffect } from "react";
import { IconRenderer } from "@/lib/icons";
import { ContactForm } from "@/components/landing/ContactForm";

interface Section {
  type: string;
  id: string;
  data: any;
  style?: any;
}

interface LandingPage {
  id: string;
  name: string;
  slug: string;
  sections: string; // JSON string
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  fontFamily: string;
}

interface LandingPageClientProps {
  landingPage: LandingPage;
}

export function LandingPageClient({ landingPage }: LandingPageClientProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const parsedSections = JSON.parse(landingPage.sections || "[]");
      setSections(parsedSections);
    } catch {
      setSections([]);
    }
  }, [landingPage.sections]);

  const renderSection = (section: Section) => {
    switch (section.type) {
      case "hero":
        return (
          <section
            key={section.id}
            className="py-20 px-4 text-center"
            style={{
              backgroundColor: section.style?.backgroundColor || landingPage.backgroundColor,
              color: section.style?.textColor || landingPage.textColor,
            }}
          >
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold mb-6">{section.data.title}</h1>
              <p className="text-2xl mb-8 opacity-90">{section.data.subtitle}</p>
              {section.data.ctaText && (
                <a
                  href={section.data.ctaUrl || "#"}
                  className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: landingPage.buttonColor,
                    color: landingPage.buttonTextColor,
                  }}
                >
                  {section.data.ctaText}
                </a>
              )}
            </div>
          </section>
        );

      case "features":
        return (
          <section
            key={section.id}
            className="py-16 px-4"
            style={{
              backgroundColor: section.style?.backgroundColor || "#f9fafb",
              color: section.style?.textColor || "#000000",
            }}
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">
                {section.data.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {section.data.items?.map((item: any, index: number) => (
                  <div key={index} className="text-center">
                    {item.icon && (
                      <div className="text-5xl mb-4 flex justify-center">
                        <IconRenderer iconValue={item.icon} size={48} />
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "testimonials":
        return (
          <section
            key={section.id}
            className="py-16 px-4"
            style={{
              backgroundColor: section.style?.backgroundColor || "#f9fafb",
              color: section.style?.textColor || "#000000",
            }}
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">
                {section.data.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {section.data.items?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 shadow-md border border-gray-200"
                  >
                    <p className="text-gray-700 mb-4 text-lg">"{item.text}"</p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: landingPage.buttonColor }}
                      >
                        {(item.name || "א")[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "about":
        return (
          <section
            key={section.id}
            className="py-16 px-4"
            style={{
              backgroundColor: section.style?.backgroundColor || "#ffffff",
              color: section.style?.textColor || "#000000",
            }}
          >
            <div className="max-w-4xl mx-auto">
              <div
                className={`flex items-center gap-8 ${
                  section.data.imagePosition === "left" ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {section.data.image && (
                  <img
                    src={section.data.image}
                    alt=""
                    className="w-64 h-64 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-4xl font-bold mb-6">{section.data.title}</h2>
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                    {section.data.content}
                  </p>
                </div>
              </div>
            </div>
          </section>
        );

      case "cta":
        return (
          <section
            key={section.id}
            className="py-20 px-4 text-center"
            style={{
              backgroundColor: section.style?.backgroundColor || landingPage.buttonColor,
              color: section.style?.textColor || landingPage.buttonTextColor,
            }}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">{section.data.title}</h2>
              {section.data.description && (
                <p className="text-xl mb-8 opacity-90">{section.data.description}</p>
              )}
              {section.data.ctaText && (
                <a
                  href={section.data.ctaUrl || "#"}
                  className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 bg-white text-indigo-600"
                >
                  {section.data.ctaText}
                </a>
              )}
            </div>
          </section>
        );

      case "faq":
        return (
          <section
            key={section.id}
            className="py-16 px-4"
            style={{
              backgroundColor: section.style?.backgroundColor || "#f9fafb",
              color: section.style?.textColor || "#000000",
            }}
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">
                {section.data.title}
              </h2>
              <div className="space-y-4">
                {section.data.items?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                  >
                    <h3 className="text-xl font-bold mb-3">{item.question}</h3>
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "contact-form":
        return (
          <section
            key={section.id}
            className="py-16 px-4"
            style={{
              backgroundColor: section.style?.backgroundColor || "#ffffff",
              color: section.style?.textColor || "#000000",
            }}
          >
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">
                {section.data.title}
              </h2>
              {section.data.description && (
                <p className="text-center text-gray-600 mb-8">
                  {section.data.description}
                </p>
              )}
              <ContactForm landingPageId={landingPage.id} formFields={section.data.formFields || []} />
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: landingPage.backgroundColor,
        color: landingPage.textColor,
        fontFamily: landingPage.fontFamily || "inherit",
      }}
    >
      {sections.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-2xl font-bold mb-4">דף נחיתה ריק</p>
            <p className="text-gray-600">אין סקשנים להצגה</p>
          </div>
        </div>
      ) : (
        <div className={`${mounted ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}>
          {sections.map((section) => renderSection(section))}
        </div>
      )}
    </div>
  );
}

