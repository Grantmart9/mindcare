import { CrisisResource } from "@/lib/types";

export const crisisResources: CrisisResource[] = [
  {
    id: "988-suicide",
    name: "988 Suicide & Crisis Lifeline",
    type: "hotline",
    phone: "988",
    description:
      "Free and confidential emotional support 24 hours a day, 7 days a week.",
    available24_7: true,
    country: "US",
  },
  {
    id: "crisis-text-line",
    name: "Crisis Text Line",
    type: "hotline",
    phone: "Text HOME to 741741",
    description: "Free, 24/7 crisis support via text message.",
    available24_7: true,
    country: "US",
  },
  {
    id: "nami-helpline",
    name: "NAMI Helpline",
    type: "hotline",
    phone: "1-800-950-NAMI (6264)",
    description:
      "National Alliance on Mental Illness helpline for information and support.",
    available24_7: false,
    country: "US",
  },
  {
    id: "trans-lifeline",
    name: "Trans Lifeline",
    type: "hotline",
    phone: "877-565-8860",
    description: "Peer support hotline run by and for trans people.",
    available24_7: false,
    country: "US",
  },
  {
    id: "veterans-crisis",
    name: "Veterans Crisis Line",
    type: "hotline",
    phone: "988 then Press 1",
    description: "Confidential support for veterans and their families.",
    available24_7: true,
    country: "US",
  },
  {
    id: "betterhelp",
    name: "BetterHelp",
    type: "website",
    website: "https://www.betterhelp.com",
    description: "Online therapy platform with licensed therapists.",
    available24_7: false,
    country: "Global",
  },
  {
    id: "talkspace",
    name: "Talkspace",
    type: "website",
    website: "https://www.talkspace.com",
    description: "Online therapy and counseling services.",
    available24_7: false,
    country: "Global",
  },
  {
    id: "psychology-today",
    name: "Psychology Today",
    type: "website",
    website: "https://www.psychologytoday.com",
    description:
      "Find therapists, psychiatrists, and mental health professionals.",
    available24_7: false,
    country: "Global",
  },
];

export const getResourcesByCountry = (country: string): CrisisResource[] => {
  return crisisResources.filter(
    (resource) => resource.country === country || resource.country === "Global"
  );
};

export const getHotlineResources = (): CrisisResource[] => {
  return crisisResources.filter((resource) => resource.type === "hotline");
};

export const getEmergencyResources = (): CrisisResource[] => {
  return crisisResources.filter((resource) => resource.available24_7);
};
