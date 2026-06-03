import { useRef } from "react";
import { Link } from "react-router";
import { TEAM_MEMBERS, type TeamMember } from "../config/team";
import { useI18n } from "../i18n/I18nContext";

export function meta() {
  return [{ title: "Silver Guide - About" }];
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const checkboxId = `bio-check-${index}`;
  const profile = t.team[member.id];

  return (
    <div className="col-6 col-md-3">
      <div className="team-card">
        <a href={member.portfolioUrl} target="_blank" rel="noreferrer" className="portrait-link">
          <div
            className="portrait-container border border-dark"
            onMouseEnter={() => videoRef.current?.play()}
            onMouseLeave={() => {
              const v = videoRef.current;
              if (v) { v.pause(); v.currentTime = 0; }
            }}
          >
            <img src={member.img} alt={profile.name} className="team-img static-img" />
            <video ref={videoRef} className="team-video" muted loop playsInline>
              <source src={member.video} type="video/mp4" />
            </video>
          </div>
        </a>

        <h4 className="mt-3 mb-0">{profile.name}</h4>
        <p className="text-muted">{profile.role}</p>

        <div className="social-links mb-3">
          <a href={member.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-outline-dark btn-sm rounded-circle mx-1">
            <i className="bi bi-linkedin"></i>
          </a>
          <a href={member.githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline-dark btn-sm rounded-circle mx-1">
            <i className="bi bi-github"></i>
          </a>
        </div>

        <div className="bio-wrapper">
          <input type="checkbox" id={checkboxId} className="bio-toggle" />
          <p className="bio-text">{profile.bio}</p>
          <label
            htmlFor={checkboxId}
            className="bio-more-btn"
            data-read-more={t.about.readMore}
            data-read-less={t.about.readLess}
          />
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const { t } = useI18n();

  return (
    <>
      <div className="container my-5">
        <div className="row align-items-center mb-5 py-4">
          <div className="col-md-6">
            <span
              className="badge rounded-pill px-4 py-2 mb-3 d-inline-block"
              style={{ backgroundColor: '#dfff6f', color: '#1a1a1a', border: '1px solid #1a1a1a' }}
            >
              {t.about.purposeBadge}
            </span>
            <h2 className="display-6 fw-bold">{t.about.purposeQuote}</h2>
            <p className="lead mt-3">{t.about.purposeLead}</p>
          </div>
          <div className="col-md-6 text-center">
            <div
              className="bg-light border rounded-4 d-flex align-items-center justify-content-center aboutimage1"
              style={{ height: '300px' }}
            />
          </div>
        </div>

        <h2 className="text-center mb-4">{t.about.differentTitle}</h2>

        <div className="p-4 mb-4 rounded-5 border border-dark" style={{ backgroundColor: '#dfff6f' }}>
          <div className="row align-items-center">
            <div className="col-8">
              <h3 className="fw-bold">{t.about.safeTitle}</h3>
              <p>{t.about.safeBody}</p>
            </div>
            <div className="col-4 text-end">
              <div className="aboutimage2 bg-white border rounded-4 d-inline-block p-5" />
            </div>
          </div>
        </div>

        <div className="p-4 mb-4 rounded-5 border border-dark" style={{ backgroundColor: '#75adf6' }}>
          <div className="row align-items-center">
            <div className="col-8">
              <h3 className="fw-bold">{t.about.simpleTitle}</h3>
              <p>{t.about.simpleBody}</p>
            </div>
            <div className="col-4 text-end">
              <div className="aboutimage3 bg-white border rounded-4 d-inline-block p-5" />
            </div>
          </div>
        </div>

        <div className="text-center py-5">
          <h2 className="mb-5">{t.about.teamTitle}</h2>

          <div className="d-md-none text-muted mb-2 small">
            <i className="bi bi-arrow-left-right"></i> {t.about.scrollHint}
          </div>

          <div className="row g-4 flex-nowrap overflow-auto pb-4 custom-scrollbar">
            {TEAM_MEMBERS.map((member, index) => (
              <TeamCard key={member.id} member={member} index={index} />
            ))}
          </div>

          <div className="row mt-5">
            <div className="col-12">
              <div className="cta-box p-5 rounded-4 border border-2 border-dark" style={{ backgroundColor: '#f8f9fa' }}>
                <h3>{t.about.ctaTitle}</h3>
                <p className="lead">{t.about.ctaLead}</p>
                <Link to="/articles" className="btn btn-primary btn-lg px-5 mt-3 shadow-sm">
                  {t.about.ctaButton}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
