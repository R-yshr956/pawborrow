export default function PetsHero() {
  return (
    <header className="pets-hero">
      <div className="pets-hero-content">
        <div className="pets-hero-text">
          <span className="eyebrow">PawBorrow</span>
          <h1>
            Friends come with
            <br />
            four paws
          </h1>
          <p>
            Browse available companions ready to share their love. Use the filters below to find the perfect match and all the gear you'll need.
          </p>
        </div>
        <div className="pets-hero-image">
          <div className="hero-blob" />
          {/* Replace with your real cat/dog photo */}
          <img src="/images/hero-pets.png" alt="Cat and dog" />
        </div>
      </div>
    </header>
  );
}