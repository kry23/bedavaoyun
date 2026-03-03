"use client";

import { useState } from "react";
import type { GameGuideData } from "@/lib/game-guides";
import { getStepIllustration } from "./GameIllustrations";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <span>{question}</span>
        <svg
          className="w-5 h-5 flex-shrink-0 ml-3 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export function GameGuide({
  guide,
  faqTitle,
  gameSlug,
  locale,
}: {
  guide: GameGuideData;
  faqTitle: string;
  gameSlug: string;
  locale: "tr" | "en";
}) {
  return (
    <section className="mt-12 max-w-3xl mx-auto">
      {/* How to Play */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
        {guide.howToPlayTitle}
      </h2>

      <div className="grid gap-6 sm:gap-8 mb-12">
        {guide.steps.map((step, i) => {
          const illustration = getStepIllustration(gameSlug, i, locale);
          return (
            <div key={i} className="text-center">
              {/* Step number badge */}
              <div
                className="mx-auto w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg mb-3"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                }}
              >
                {i + 1}
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg sm:text-xl mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto mb-3">
                {step.description}
              </p>

              {/* Illustration */}
              {illustration && (
                <div className="flex justify-center">
                  <div className="inline-block p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
                    {illustration}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      {guide.faq.length > 0 && (
        <>
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
            {faqTitle}
          </h2>
          <div className="grid gap-3 mb-8">
            {guide.faq.map((item, i) => (
              <FaqItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
