import clubsImg from '../assets/e44ee6e5998afdff950b5193547279ec__1_-removebg-preview 1.png';
import studentCrowdImg from '../assets/2acc38c1685de2826b32ec48f88ddd89-removebg-preview.png';

const BuildForBoth = () => {
  return (
    <section style={{
      width: '100%',
      padding: '5rem 2rem',
      background: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <style>{`
        .bfb-card {
          height: 519px;
        }
        .bfb-img-left {
          width: 110%;
          bottom: -20px;
        }
        .bfb-img-right {
          width: 100%;
          bottom: 0;
        }
        @media (max-width: 768px) {
          .bfb-card {
            height: 410px !important;
          }
          .bfb-img-left {
            width: 80% !important;
            bottom: -10px !important;
          }
          .bfb-img-right {
            width: 75% !important;
            bottom: 0 !important;
          }
        }
      `}</style>

      {/* ── HEADING ── */}
      <h2 style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
        fontWeight: 700,
        color: '#111',
        textAlign: 'center',
        lineHeight: 1.2,
        margin: '0 0 3rem 0',
        letterSpacing: '-0.02em',
      }}>
        Build for both,<br />
        <span style={{
          textDecoration: 'underline',
          textDecorationColor: '#e8a0bf',
          textUnderlineOffset: '6px',
          textDecorationThickness: '3px',
        }}>
          Students and Clubs
        </span>
      </h2>

      {/* ── TWO CARDS ── */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        width: '100%',
        maxWidth: '1000px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>

        {/* ── LEFT CARD: Students ── */}
        <div 
          className="bfb-card"
          style={{
            width: '100%',
            maxWidth: '420px',
            borderRadius: '24px',
            background: 'linear-gradient(180deg, #f0abfc 0%, #f9a8d4 50%, #fbcfe8 100%)',
            position: 'relative',
            overflow: 'hidden',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Rounded clip for the card bg */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: '24px',
            overflow: 'hidden',
            zIndex: 0,
          }}>
            {/* Group crowd covering bottom of pink card */}
            <img
              src={studentCrowdImg}
              alt="Students crowd"
              className="bfb-img-left"
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                objectFit: 'cover',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Label */}
          <span style={{
            display: 'inline-block',
            background: '#000',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '0.9rem',
            padding: '0.5rem 1.2rem',
            borderRadius: '999px',
            alignSelf: 'flex-start',
            marginBottom: '1.5rem',
            position: 'relative',
            zIndex: 2,
          }}>
            Students
          </span>

          {/* Bullet Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', position: 'relative', zIndex: 2 }}>
            {[
              { icon: '🔍', text: 'Discover events.' },
              { icon: '🚀', text: 'Build skills.' },
              { icon: '👤', text: 'Event gallery.' },
              { icon: '📋', text: 'Track events.' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                fontWeight: 500,
                color: '#fff',
              }}>
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>

        </div>

        {/* ── RIGHT CARD: Clubs & Initiatives ── */}
        <div 
          className="bfb-card"
          style={{
            width: '100%',
            maxWidth: '420px',
            borderRadius: '24px',
            background: '#111',
            position: 'relative',
            overflow: 'hidden',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Label */}
          <span style={{
            display: 'inline-block',
            background: '#333',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '0.9rem',
            padding: '0.5rem 1.2rem',
            borderRadius: '999px',
            alignSelf: 'flex-start',
            marginBottom: '1.5rem',
            border: '1px solid #555',
          }}>
            Clubs & Initiatives
          </span>

          {/* Bullet Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {[
              { icon: '📅', text: 'Create events.' },
              { icon: '👤', text: 'Manage registrations.' },
              { icon: '📈', text: 'Increase participation.' },
              { icon: '📊', text: 'Track analytics.' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                fontWeight: 500,
                color: '#aaa',
              }}>
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>

          {/* Clubs Illustration — covers full width from bottom */}
          <img
            src={clubsImg}
            alt="Clubs illustration"
            className="bfb-img-right"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              objectFit: 'cover',
              pointerEvents: 'none',
            }}
          />
        </div>

      </div>
    </section>
  );
};

export default BuildForBoth;
