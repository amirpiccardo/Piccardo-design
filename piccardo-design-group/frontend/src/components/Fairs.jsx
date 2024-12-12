import React, { useState, useEffect } from "react";

function Fairs() {
  const [fairs, setFairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/fairs")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        setFairs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching fairs:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section className="py-5" style={sectionStyle}>
      <div className="container">
        <h2 className="text-center mb-5" style={headingStyle}>
          Le Nostre Fiere
        </h2>
        <p className="text-center mb-4" style={subHeadingStyle}>
          Scopri le fiere a cui i nostri partner partecipano quest'anno.
        </p>
        <p className="text-center mb-4" style={descriptionStyle}>
          Quest'anno, i nostri partner parteciperanno a diverse fiere
          prestigiose. Unitevi a noi per scoprire le ultime novità nel mondo del
          design e dell'innovazione.
        </p>

        <div className="row">
          {Array.isArray(fairs) &&
            fairs.map((fair) => (
              <div className="col-md-4 mb-4" key={fair._id}>
                <div className="card h-100" style={cardStyle}>
                  <div className="card-body">
                    <h5 className="card-title" style={cardTitleStyle}>
                      {fair.name}
                    </h5>
                    <p className="card-text" style={cardTextStyle}>
                      {fair.location}
                    </p>
                    <p className="card-text" style={cardTextStyle}>
                      {fair.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

const sectionStyle = {
  backgroundColor: "#f8f9fa",
  backgroundImage: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
  padding: "50px 0",
};

const headingStyle = {
  fontFamily: "Raleway, serif",
  fontWeight: "400",
  fontSize: "4rem",
  lineHeight: "1.4em",
  color: "#2c3e50",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
};

const subHeadingStyle = {
  fontFamily: "Georgia, serif",
  fontWeight: "400",
  fontSize: "1.5rem",
  color: "#2c3e50",
  marginBottom: "20px",
};

const descriptionStyle = {
  fontFamily: "Georgia, serif",
  fontWeight: "300",
  fontSize: "1.2rem",
  color: "#34495e",
  marginBottom: "40px",
};

const cardStyle = {
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  border: "none",
  borderRadius: "10px",
  transition: "transform 0.3s",
  backgroundColor: "#fff",
};

const cardTitleStyle = {
  fontFamily: "Georgia, serif",
  fontWeight: "700",
  fontSize: "1.5rem",
  color: "#2c3e50",
};

const cardTextStyle = {
  fontFamily: "Georgia, serif",
  fontWeight: "300",
  fontSize: "1rem",
  color: "#34495e",
};

export default Fairs;
