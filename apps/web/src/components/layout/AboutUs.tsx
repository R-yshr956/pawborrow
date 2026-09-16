import '@/styles/About.css';

const stats = [
  { value: "2k+", label: "Happy borrowers" },
  { value: "150+", label: "Pets available" },
  { value: "1.2k+", label: "Successful bookings" },
  { value: "3", label: "Years serving QC" },
];

const team = [
  { name: "Elaiza Bugayong", role: "Seller", photo: "/images/team-elaiza.jpg" },
  { name: "Anthony Miguel Balungay", role: "Seller", photo: "/images/team-anthony.jpg" },
  { name: "Yu Miura", role: "Seller", photo: "/images/team-yu.jpg" },
  { name: "Reyniel", role: "Seller", photo: "/images/team-reyniel.jpg" },
  { name: "John Michael Vincent Uayan", role: "Seller", photo: "/images/team-john.jpg" },
];

const instagramPosts = [
  "/images/insta-1.jpg",
  "/images/insta-2.jpg",
  "/images/insta-3.jpg",
  "/images/insta-4.jpg",
];

export default function AboutUs() {
  return (
    <section id="about" className="section about">
      <div className="about__intro pt-5">
        <p className="eyebrow">PawBorrow &middot; About Us</p>
        <h2>
          Pet companionship, <span>without the long-term commitment.</span>
        </h2>
        <p className="about__lede">
          PawBorrow is a service-based platform built for Quezon City
          households who love animals but aren't ready to own one full-time.
          Browse verified pet profiles, check availability, and book a
          companionship session in minutes — every pet in our network is
          healthy, well-socialized, and cared for to a high standard.
        </p>
        <div className="about__stats">
          {stats.map((stat) => (
            <div className="about__stat" key={stat.label}>
              <span className="about__stat-value">{stat.value}</span>
              <span className="about__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="about__story">
        <div className="about__story-media">
          <img className="photo-tile" src="/images/pawpaw-logo.jpg" alt="PawPaw team logo" />
        </div>
        <div className="about__story-text">
          <h3>PawPaw</h3>
          <p className="about__story-title">Founder</p>
          <p>
            PawBorrow was created by Team PawPaw, a group of Information
            Technology students committed to developing digital solutions
            that create a positive social impact. Inspired by the growing
            number of people who love animals but can't keep pets of their
            own, Team PawPaw built PawBorrow to bridge that gap through a
            secure, user-friendly booking platform — combining technical
            know-how with a real commitment to animal welfare.
          </p>
          <p className="about__signature">PawPaw</p>
        </div>
      </div>

      <div className="about__team">
        <div className="section__head">
          <h3>Our Team</h3>
        </div>
        <div className="about__team-grid">
          {team.map((member) => (
            <div className="about__team-card" key={member.name}>
              <img className="photo-tile" src={member.photo} alt={member.name} />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div> 

      <div className="about__testimonials">
        <div className="section__head">
          <div>
            <p className="eyebrow">Testimonials</p>
            <h3>What people say about us</h3>
          </div>
          <div className="section__arrows">
            <button aria-label="Previous testimonial">‹</button>
            <button aria-label="Next testimonial">›</button>
          </div>
        </div>

        <div className="about__testimonial-content">
          <div className="about__testimonial-quote">
            <div className="about__stars">★★★★★</div>
            <p>
              "PawBorrow gave me the chance to enjoy the company of a pet
              without the long-term responsibility of owning one. The
              booking process was simple, the pets were clearly well cared
              for, and the entire experience was relaxing and enjoyable. I'd
              recommend PawBorrow to anyone looking for a safe, meaningful
              way to spend time with animals."
            </p>
            <p className="about__testimonial-author">
              Elaine Jean <span>Customer</span>
            </p>
          </div>
          <div className="about__testimonial-photo">
            <img src="/images/testimonial-elaine.jpg" alt="Elaine Jean with her borrowed dog" />
          </div>
        </div>

        <div className="about__video">
          <img src="/images/testimonial-video.jpg" alt="Customer testimonial video thumbnail" />
          <button className="about__play-btn" aria-label="Play testimonial video">▶</button>
        </div>
      </div>

      <div className="about__instagram">
  <h3>Follow our Instagram</h3>

  <a
    href="https://www.instagram.com/pawborrowpaw/"
    target="_blank"
    rel="noopener noreferrer"
    className="about__instagram-link"
  >
    @pawborrowpaw
  </a>

  <div className="about__instagram-grid">
    {instagramPosts.map((src, i) => (
      <img
        className="photo-tile"
        src={src}
        alt={`Instagram post ${i + 1}`}
        key={src}
      />
    ))}
  </div>
</div>
    </section>
  );
}