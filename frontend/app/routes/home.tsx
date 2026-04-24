import { useState } from "react";

export function meta() {
  return [
    { title: "Silver Guide" },
    { name: "description", content: "Helping seniors navigate the digital world" },
  ];
}

const CARDS = [
  { img: "/imgs/qr-code-scan1.jpeg", alt: "QR code scan", title: "Card title", text: "Some quick example text to build on the card title and make up the bulk of the cards content." },
  { img: "/imgs/online-ad1.jpeg", alt: "Online ad", title: "Card title", text: "Some quick example text to build on the card title and make up the bulk of the cards content." },
  { img: "/imgs/qr-code-scan1.jpeg", alt: "QR code scan", title: "Card title", text: "Some quick example text to build on the card title and make up the bulk of the cards content." },
  { img: "/imgs/qr-code-scan1.jpeg", alt: "QR code scan", title: "Card title", text: "Some quick example text to build on the card title and make up the bulk of the cards content." },
  { img: "/imgs/online-ad1.jpeg", alt: "Online ad", title: "Card title", text: "Some quick example text to build on the card title and make up the bulk of the cards content." },
  { img: "/imgs/qr-code-scan1.jpeg", alt: "QR code scan", title: "Card title", text: "Some quick example text to build on the card title and make up the bulk of the cards content." },
];

const TABS = ["Common tasks", "Scams"] as const;

export default function Home() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Common tasks");

  return (
    <>
      {/* Hero */}
      <div className="container col-xxl-8 px-4 py-5">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-10 col-sm-8 col-lg-6">
            <img
              src="/imgs/herobanner-img.jpeg"
              className="d-block mx-lg-auto img-fluid"
              alt="an elderly woman using her phone"
              width={700}
              height={500}
              loading="lazy"
            />
          </div>
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
              Responsive left-aligned hero with image
            </h1>
            <p className="lead">
              Quickly design and customize responsive mobile-first sites with Bootstrap, the world's most popular
              front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive
              prebuilt components, and powerful JavaScript plugins.
            </p>
          </div>
        </div>
      </div>

      {/* Start learning section */}
      <div className="px-4 py-5 my-5 text-center">
        <h1 className="display-5 fw-bold text-body-emphasis">Start learning here</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum illum sit consequatur neque aperiam
            consequuntur et sapiente dicta veniam tempore.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="py-5 container">
        <ul className="nav nav-tabs">
          {TABS.map((tab) => (
            <li key={tab} className="nav-item">
              <button
                type="button"
                className={`nav-link${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Cards */}
      <div className="album py-5">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {CARDS.map((card, i) => (
              <div key={i} className="col">
                <div className="card" style={{ width: '18rem' }}>
                  <img src={card.img} className="card-img-top" alt={card.alt} />
                  <div className="card-body">
                    <h5 className="card-title">{card.title}</h5>
                    <p className="card-text">{card.text}</p>
                    <a href="#" className="btn btn-primary">Go somewhere</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
}
