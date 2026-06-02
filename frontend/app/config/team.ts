export interface TeamMember {
  img: string;
  video: string;
  name: string;
  role: string;
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  bio: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    img: "/imgs/ElderlyChristine.jpg",
    video: "/videos/OldChristineVid.mp4",
    name: "Christine",
    role: "Lead Designer",
    portfolioUrl: "https://radio-alastor.github.io/christine-portfolio/",
    linkedinUrl: "https://www.linkedin.com/in/christine-portfolio/",
    githubUrl: "https://github.com/Radio-Alastor",
    bio: "I'm passionate about using my organisational skills with my technical abilities to improve efficiency and support people behind the scenes."
  },
  {
    img: "/imgs/ElderlyEkHong.jpg",
    video: "/videos/OldEkHongVid.mp4",
    name: "Ek Hong",
    role: "Database expert",
    portfolioUrl: "https://krenova.github.io/krenova-portfolio/",
    linkedinUrl: "https://sg.linkedin.com/in/ekhong-lim",
    githubUrl: "https://github.com/krenova/",
    bio: "Data Science and Technology Consultant."
  },
  {
    img: "/imgs/ElderlyKelvin.jpg",
    video: "/videos/OldKelvinVid.mp4",
    name: "Kelvin",
    role: "AI expert",
    portfolioUrl: "https://kelvinsu1983.github.io/kelvin-portfolio/",
    linkedinUrl: "https://www.linkedin.com/in/kelvin-su-59332515a/",
    githubUrl: "https://github.com/KelvinSu1983",
    bio: "Passionate about building SaaS solutions and AI systems for real-world problems, I bring a proven track record in high-performance sales and entrepreneurial ventures."
  },
  {
    img: "/imgs/ElderlyKimShee.jpg",
    video: "/videos/OldKimSheeVid.mp4",
    name: "Kim Shee",
    role: "Infrastructure expert",
    portfolioUrl: "https://kslee008.github.io/portfolio_v2",
    linkedinUrl: "https://www.linkedin.com/in/kim-shee-lee-b1378288/",
    githubUrl: "https://github.com/kslee008",
    bio: "I am dedicated to bridging infrastructure discipline with new development knowledge to build secure, scalable applications for fintech and Web3, while delivering reliable solutions in mission critical environments during my mid-career transition into modern mobile and web development."
  },
];
