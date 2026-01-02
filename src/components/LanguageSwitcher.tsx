// // import { useTranslation } from "react-i18next";
// // import { Globe } from "lucide-react";

// // const languages = [
// //   { code: "en", label: "EN", full: "English" },
// //   { code: "fr", label: "FR", full: "Français" },
// // ];

// // export function LanguageSwitcher() {
// //   const { i18n } = useTranslation();

// //   const currentLang = i18n.language?.startsWith("fr") ? "fr" : "en";

// //   const handleChange = (langCode: string) => {
// //     i18n.changeLanguage(langCode);
// //   };

// //   return (
// //     <div className="flex items-center gap-1">
// //       <Globe className="w-4 h-4 text-muted-foreground" />
// //       <div className="flex items-center rounded-lg bg-muted p-0.5">
// //         {languages.map((lang) => (
// //           <button
// //             key={lang.code}
// //             onClick={() => handleChange(lang.code)}
// //             className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
// //               currentLang === lang.code
// //                 ? "bg-background text-foreground shadow-sm"
// //                 : "text-muted-foreground hover:text-foreground"
// //             }`}
// //             aria-label={`Switch to ${lang.full}`}
// //           >
// //             {lang.label}
// //           </button>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// import { useTranslation } from "react-i18next";
// import { Globe } from "lucide-react";

// const languages = [
//   { code: "en", label: "EN", full: "English" },
//   { code: "fr", label: "FR", full: "Français" },
// ];

// export function LanguageSwitcher() {
//   const { i18n } = useTranslation();
//   const currentLang = i18n.language?.startsWith("fr") ? "fr" : "en";

//   const handleChange = (langCode: string) => {
//     i18n.changeLanguage(langCode);
//   };

//   // FR on the left, EN on the right (pill slides between them)
//   const isFR = currentLang === "fr";

//   return (
//     <div className="inline-flex items-center gap-1 shrink-0 self-center leading-none">
//       {/* Icon chip so icon size never affects the switcher height */}
//       <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl ">
//         <Globe className="h-4 w-4 text-muted-foreground" />
//       </span>

//       {/* Segmented control (fixed height; independent from siblings) */}
//       <div
//         className="relative inline-flex h-9 w-[92px] items-center rounded-xl border border-border bg-muted/60 p-1 overflow-hidden"
//         role="group"
//         aria-label="Language switcher"
//       >
//         {/* Sliding pill */}
//         <span
//           aria-hidden="true"
//           className={[
//             "absolute inset-y-1 start-1 w-[calc(50%-0.25rem)]",
//             "rounded-lg bg-background shadow-sm",
//             "transform transition-transform duration-200 ease-out",
//             "motion-reduce:transition-none",
//             // move pill to the RIGHT when EN is active
//             isFR ? "translate-x-0" : "translate-x-full",
//           ].join(" ")}
//         />

//         {languages.map((lang) => {
//           const active = currentLang === lang.code;
//           const inactive = lang.code === "en" ? "fr" : "en";

//           return (
//             <button
//               key={lang.code}
//               type="button"
//               onClick={() => handleChange(inactive)}
//               aria-label={`Switch to ${lang.full}`}
//               aria-pressed={active}
//               className={[
//                 "relative z-10 flex-1 h-full",
//                 "rounded-lg px-0 text-xs font-semibold",
//                 "transition-colors motion-reduce:transition-none",
//                 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
//                 active ? "text-foreground/45" : "text-muted-foreground hover:text-foreground",
//               ].join(" ")}
//             >
//               {lang.label}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const languages = [
  { code: "fr", label: "FR", full: "Français" }, // ✅ left
  { code: "en", label: "EN", full: "English" }, // ✅ right
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("fr") ? "fr" : "en";

  const isEN = currentLang === "en"; // EN is on the RIGHT

  const handleChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="inline-flex items-center gap-1 shrink-0 self-center leading-none">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl">
        <Globe className="h-4 w-4 text-muted-foreground" />
      </span>

      <div
        className="relative inline-flex h-9 w-[92px] items-center rounded-xl border border-border bg-muted/60 p-1 overflow-hidden"
        role="group"
        aria-label="Language switcher"
      >
        {/* Sliding pill */}
        <span
          aria-hidden="true"
          className={[
            "absolute inset-y-1 start-1 w-[calc(50%-0.25rem)]",
            "rounded-lg bg-background shadow-sm",
            "transform transition-transform duration-200 ease-out",
            "motion-reduce:transition-none",
            isEN ? "translate-x-full" : "translate-x-0", // ✅ move right when EN
          ].join(" ")}
        />

        {languages.map((lang) => {
          const active = currentLang === lang.code;

          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleChange(lang.code)} // ✅ FIX: click sets that language
              aria-label={`Switch to ${lang.full}`}
              aria-pressed={active} // toggle button semantics :contentReference[oaicite:1]{index=1}
              className={[
                "relative z-10 flex-1 h-full rounded-lg",
                "text-xs font-semibold",
                "transition-colors motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {lang.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
