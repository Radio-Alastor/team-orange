import type { TeamMemberId } from "../i18n/types";

export interface TeamMember {
  id: TeamMemberId;
  img: string;
  video: string;
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "christine",
    img: "/imgs/ElderlyChristine.jpg",
    video: "/videos/OldChristineVid.mp4",
    portfolioUrl: "https://radio-alastor.github.io/christine-portfolio/",
    linkedinUrl: "https://www.linkedin.com/in/christine-portfolio/",
    githubUrl: "https://github.com/Radio-Alastor",
  },
  {
    id: "ekhong",
    img: "/imgs/ElderlyEkHong.jpg",
    video: "/videos/OldEkHongVid.mp4",
    portfolioUrl: "https://krenova.github.io/krenova-portfolio/",
    linkedinUrl: "https://sg.linkedin.com/in/ekhong-lim",
    githubUrl: "https://github.com/krenova/",
    bio: "Data & Technology Consultant."
  },
  {
    id: "kelvin",
    img: "/imgs/ElderlyKelvin.jpg",
    video: "/videos/OldKelvinVid.mp4",
    portfolioUrl: "https://kelvinsu1983.github.io/kelvin-portfolio/",
    linkedinUrl: "https://www.linkedin.com/in/kelvin-su-59332515a/",
    githubUrl: "https://github.com/KelvinSu1983",
  },
  {
    id: "kimshee",
    img: "/imgs/ElderlyKimShee.jpg",
    video: "/videos/OldKimSheeVid.mp4",
    portfolioUrl: "https://kslee008.github.io/portfolio_v2",
    linkedinUrl: "https://www.linkedin.com/in/kim-shee-lee-b1378288/",
    githubUrl: "https://github.com/kslee008",
  },
];
