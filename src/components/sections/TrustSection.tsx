// import { Shield, Users, Clock, Eye, Download, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";

// const trustPoints = [
//   {
//     icon: Shield,
//     title: "Client Data Handling",
//     description: "Least-privilege access by default. We only request permissions essential for the project scope.",
//   },
//   {
//     icon: Users,
//     title: "Sub-processors Transparency",
//     description: "We provide a clear list of all third-party tools and services used in your project.",
//   },
//   {
//     icon: Clock,
//     title: "Retention & Deletion",
//     description: "Client data is retained only for project duration + 30 days. Full deletion on request.",
//   },
//   {
//     icon: Eye,
//     title: "Human Oversight for AI",
//     description: "All AI features include human review checkpoints. No fully autonomous decisions on sensitive data.",
//   },
// ];

// export function TrustSection() {
//   const handleDownloadClick = () => {
//     window.dispatchEvent(new CustomEvent("analytics", { detail: { event: "trust_pack_download" } }));
//   };

//   return (
//     <section id="trust" className="py-20 lg:py-28 bg-background">
//       <div className="container mx-auto px-4 lg:px-6">
//         {/* Header */}
//         <div className="text-center max-w-2xl mx-auto mb-16">
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
//             Trust & <span className="text-gradient-brand">Compliance</span>
//           </h2>
//           <p className="text-lg text-muted-foreground">
//             Security and compliance aren't afterthoughts — they're built in from day one.
//           </p>
//         </div>

//         {/* Trust Grid - 4 items in 2x2 */}
//         <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
//           {trustPoints.map((point, index) => (
//             <div
//               key={index}
//               className="p-6 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
//             >
//               <div className="space-y-4">
//                 <div className="p-3 rounded-xl bg-muted w-fit">
//                   <point.icon className="w-6 h-6 text-secondary" />
//                 </div>
//                 <h3 className="text-lg font-bold text-foreground">{point.title}</h3>
//                 <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* CTA */}
//         <div className="text-center space-y-4">
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button variant="hero" size="lg" asChild>
//               <Link to="/trust">
//                 View full Trust & Compliance page
//                 <ArrowRight className="w-4 h-4 ml-2" />
//               </Link>
//             </Button>
//             <Button variant="outline" size="lg" onClick={handleDownloadClick} asChild>
//               <a href="/trust-pack.pdf" download>
//                 <Download className="w-4 h-4 mr-2" />
//                 Download Trust Pack (PDF)
//               </a>
//             </Button>
//           </div>
//           <p className="text-xs text-muted-foreground">
//             Not legal advice. For compliance questions, consult a qualified legal professional.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }

import { Shield, Users, Clock, Eye, Download, ArrowRight, FileText, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const trustPoints = [
  {
    icon: Shield,
    title: "Access control (least privilege)",
    description:
      "Role-based access by default. We only request the minimum permissions needed for your scoped delivery.",
  },
  {
    icon: Users,
    title: "Sub-processors list (transparent)",
    description:
      "We’ll share the tools/services involved in your delivery and notify material changes with reasonable notice.",
  },
  {
    icon: Clock,
    title: "Retention & deletion",
    description:
      "Project data retained for delivery + a short post-completion window, then returned or deleted on request.",
  },
  {
    icon: Siren,
    title: "Incident response readiness",
    description:
      "Documented incident handling and client notification approach for events affecting your data.",
  },
  {
    icon: FileText,
    title: "DPA ready for processor work",
    description:
      "UK/EU-friendly DPA available for engagements where we process personal data on your behalf.",
  },
  {
    icon: Eye,
    title: "AI transparency + human oversight",
    description:
      "Clear disclosure where AI is used. Human review checkpoints for sensitive or high-impact use cases.",
  },
];

const trustHighlights = [
  "DPA available for processor engagements",
  "Sub-processor list + change notifications",
  "EU SCCs + UK Addendum where applicable",
  "Retention & deletion on completion",
  "Incident response & notification approach",
  "AI transparency with human oversight",
];

export function TrustSection() {
  const handleDownloadClick = () => {
    window.dispatchEvent(
      new CustomEvent("analytics", { detail: { event: "trust_pack_download" } })
    );
  };

  return (
    <section id="trust" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Trust & <span className="text-gradient-brand">Compliance</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Security and compliance aren’t afterthoughts — they’re built in from day one.
          </p>
        </div>

        {/* Content row: grid + highlights box (matches your /trust hero pattern) */}
        {/* <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start max-w-6xl mx-auto mb-10"> */}
          {/* Trust Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustPoints.map((point, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-muted w-fit">
                    <point.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{point.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          
        {/* </div> */}

        {/* CTA */}
        <div className="text-center space-y-3 pt-14">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/trust">
                View full Trust & Compliance page
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <Button variant="outline" size="lg" onClick={handleDownloadClick} asChild>
              <a href="/trust-pack.pdf" download>
                <Download className="w-4 h-4 mr-2" />
                Download Trust Pack (PDF)
              </a>
            </Button>
          </div>

          {/* Procurement-friendly micro-CTA */}
          <div className="text-sm text-muted-foreground">
            Need vendor review docs?{" "}
            <Link to="/contact" className="text-secondary hover:underline">
              Request DPA / Security questionnaire
            </Link>
            .
          </div>

          <p className="text-xs text-muted-foreground">
            Not legal advice. For compliance questions, consult a qualified legal professional.
          </p>
        </div>
      </div>
    </section>
  );
}
