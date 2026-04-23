import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export function meta() {
  return [
    { title: "Silver Guide - Articles" },
    { name: "description", content: "Learn & Protect — guides for seniors" },
  ];
}

export default function Articles() {
  return (
    <>
      <Navbar />

      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-3 fw-bold mb-3">Learn &amp; Protect</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '800px' }}>
            Welcome to our library of guides. Whether you want to master new technology or learn how to stay safe
            online, we have simple instructions to help you every step of the way.
          </p>
        </div>

        {/* Technology Basics */}
        <div className="row">
          <div className="col-12 mt-5">
            <h2 className="text-center border-bottom pb-3 mb-4">Technology Basics</h2>
          </div>
        </div>
        <div className="row g-4 justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card article-card shadow-sm">
              <img src="/imgs/ai_tutorial.png" className="card-img-top" alt="AI Interface" />
              <div className="card-body d-flex flex-column p-4">
                <h4 className="card-title fw-bold">Understanding AI Helpers</h4>
                <p className="card-text text-muted flex-grow-1">
                  Learn how tools like ChatGPT and digital assistants can help you write emails, plan trips, and answer
                  questions instantly.
                </p>
                <Link to="/ai-tutorial" className="btn btn-primary btn-read mt-3">
                  Read Guide
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card article-card shadow-sm">
              <img src="/imgs/mobile_photography.png" className="card-img-top" alt="Taking a photo" />
              <div className="card-body d-flex flex-column p-4">
                <h4 className="card-title fw-bold">Master Your Mobile Camera</h4>
                <p className="card-text text-muted flex-grow-1">
                  Beautiful photos are just a click away. We show you how to focus, use flash, and share photos with your
                  family.
                </p>
                <a href="#" className="btn btn-primary btn-read mt-3">Read Guide</a>
              </div>
            </div>
          </div>
        </div>

        {/* Scam Awareness */}
        <div className="row">
          <div className="text-center col-12 mt-5">
            <h2 className="border-bottom pb-3 mb-4">Scam Awareness</h2>
          </div>
        </div>
        <div className="row g-4 justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card article-card shadow-sm">
              <img src="/imgs/it_scam_warning.png" className="card-img-top" alt="Scam Warning" />
              <div className="card-body d-flex flex-column p-4">
                <h4 className="card-title fw-bold">The "IT Support" Scam</h4>
                <p className="card-text text-muted flex-grow-1">
                  Did a popup say your computer is infected? Learn why you should never call the number on the screen.
                </p>
                <a href="#" className="btn btn-primary btn-read mt-3">Stay Safe</a>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card article-card shadow-sm">
              <img src="/imgs/phishing_alert.png" className="card-img-top" alt="Phishing Email" />
              <div className="card-body d-flex flex-column p-4">
                <h4 className="card-title fw-bold">Spotting Phishing Emails</h4>
                <p className="card-text text-muted flex-grow-1">
                  Is that email really from your bank? We teach you how to check sender addresses and avoid suspicious
                  links.
                </p>
                <a href="#" className="btn btn-primary btn-read mt-3">Stay Safe</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
