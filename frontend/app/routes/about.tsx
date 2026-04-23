import { useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export function meta() {
  return [{ title: "Silver Guide - About" }];
}

const TEAM = [
  { img: "/imgs/ElderlyChristine.jpg", video: "/videos/OldChristineVid.mp4", name: "Christine", role: "Lead Designer" },
  { img: "/imgs/ElderlyEkHong.jpg", video: "/videos/OldEkHongVid.mp4", name: "Ek Hong", role: "Database expert" },
  { img: "/imgs/ElderlyKelvin.jpg", video: "/videos/OldKelvinVid.mp4", name: "Kelvin", role: "AI expert" },
  { img: "/imgs/ElderlyKimShee.jpg", video: "/videos/OldKimSheeVid.mp4", name: "Kim Shee", role: "Infrastructure expert" },
];

function TeamCard({ member }: { member: (typeof TEAM)[number] }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="col-6 col-md-3">
      <div
        className="portrait-container border border-dark"
        onMouseEnter={() => videoRef.current?.play()}
        onMouseLeave={() => {
          const v = videoRef.current;
          if (v) { v.pause(); v.currentTime = 0; }
        }}
      >
        <img src={member.img} alt={member.name} className="team-img static-img" />
        <video ref={videoRef} className="team-video" muted loop playsInline>
          <source src={member.video} type="video/mp4" />
        </video>
      </div>
      <h4 className="mt-3 mb-0">{member.name}</h4>
      <p className="text-muted">{member.role}</p>
    </div>
  );
}

export default function About() {
  return (
    <>
      <Navbar />

      <div className="container my-5">
        {/* Our Purpose */}
        <div className="row align-items-center mb-5 py-4">
          <div className="col-md-6">
            <span
              className="badge rounded-pill px-4 py-2 mb-3 d-inline-block"
              style={{ backgroundColor: '#dfff6f', color: '#1a1a1a', border: '1px solid #1a1a1a' }}
            >
              our purpose
            </span>
            <h2 className="display-6 fw-bold">"Technology is for everyone."</h2>
            <p className="lead mt-3">
              We want ours to provide clear, step-by-step resources that make technology accessible, reduce fear, and
              build independence for seniors navigating the digital world.
            </p>
          </div>
          <div className="col-md-6 text-center">
            <div
              className="bg-light border rounded-4 d-flex align-items-center justify-content-center aboutimage1"
              style={{ height: '300px' }}
            />
          </div>
        </div>

        {/* What makes us different */}
        <h2 className="text-center mb-4">What makes us different</h2>

        <div className="p-4 mb-4 rounded-5 border border-dark" style={{ backgroundColor: '#dfff6f' }}>
          <div className="row align-items-center">
            <div className="col-8">
              <h3 className="fw-bold">Safe</h3>
              <p>
                The internet can be scary. We want you to have a reliable source to teach you how to spot these risks
                and protect your privacy.
              </p>
            </div>
            <div className="col-4 text-end">
              <div className="aboutimage2 bg-white border rounded-4 d-inline-block p-5" />
            </div>
          </div>
        </div>

        <div className="p-4 mb-4 rounded-5 border border-dark" style={{ backgroundColor: '#75adf6' }}>
          <div className="row align-items-center">
            <div className="col-8">
              <h3 className="fw-bold">Simple</h3>
              <p>
                With readable fonts, simple navigation and jargon-free instructions. Our interface is designed for
                seniors, like you, to build your digital skills!
              </p>
            </div>
            <div className="col-4 text-end">
              <div className="aboutimage3 bg-white border rounded-4 d-inline-block p-5" />
            </div>
          </div>
        </div>

        {/* Meet our team */}
        <div className="text-center py-5">
          <h2 className="mb-5">Meet our team</h2>
          <div className="row g-4 flex-nowrap overflow-auto pb-3">
            {TEAM.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
