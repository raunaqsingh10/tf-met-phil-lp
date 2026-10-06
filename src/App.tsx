import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent, UIEvent } from 'react'
import { LeadSheet } from './LeadSheet'
import { captureAttribution } from './lib/attribution'
import './styles.css'

const stories = [
  {
    place: 'Moalboal',
    feature: false,
    title: 'Start with adventure.',
    description: 'Get into the water for Moalboal’s Sardine Run, take on Kawasan Falls and canyoneering, then slow things down with beach and café time.',
    image: '/media/photos/moalboal-sardine-run.jpg',
    alt: 'A dense school of sardines swimming underwater in Moalboal, Philippines',
    width: 1800,
    height: 1200,
  },
  {
    place: 'Coron',
    feature: false,
    title: 'Take the adventure out to the islands.',
    description: 'Spend the day on a private bangka exploring Coron’s lagoons, reefs and island stops, then head up to Mt. Tapyas for sunset.',
    image: '/media/photos/coron-experience.jpg',
    alt: 'Aerial view of limestone islands, boats and turquoise water in the Philippines',
    width: 1800,
    height: 1350,
  },
  {
    place: 'El Nido',
    feature: false,
    title: 'Slow down in paradise.',
    description: 'Kayak through Big Lagoon, explore Small Lagoon, spend time around 7 Commandos and the surrounding beaches, with room for town time, beach time and a night out if you feel like it.',
    image: '/media/photos/el-nido-experience.jpg',
    alt: 'Kayakers paddling between tropical limestone cliffs on turquoise water',
    width: 1800,
    height: 1350,
  },
  {
    place: 'Manila',
    feature: true,
    title: 'Finish with a change of pace in Manila.',
    description: 'After days of islands, lagoons and beaches, close out the trip in the capital before your journey home. A final shift in scenery to round off eight days across the Philippines.',
    image: '/media/photos/manila-experience.jpg',
    alt: 'Manila Bay and the surrounding city skyline at sunset',
    width: 1800,
    height: 1013,
  },
]

const socialMoments = [
  {
    image: '/media/social/met-social-two-travellers-enjoying.jpg',
    alt: 'Two travellers share a playful moment in helmets before a water adventure.',
    width: 856,
    height: 1836,
    objectPosition: 'center 40%',
  },
  {
    image: '/media/social/met-social-dinner-table.jpg',
    alt: 'A group of MET travellers sharing dinner around a table.',
    width: 1086,
    height: 1448,
    objectPosition: 'center',
  },
  {
    image: '/media/social/met-social-airport.jpg',
    alt: 'A group of MET travellers smiling together at the airport.',
    width: 1448,
    height: 1086,
    objectPosition: 'center',
  },
]

const planningItems = [
  'Flights & island transfers', 'Stays', 'Local transport',
  'Experiences', 'Pre-trip support', 'Dedicated MET host',
]

const curationSteps = [
  {
    title: 'Tell us a little about yourself',
    description: 'Share how you like to travel, what you are looking for and what you want from the experience.',
  },
  {
    title: 'MET reviews the fit',
    description: 'The team looks at whether the trip and the kind of group being put together are likely to be a good match.',
  },
  {
    title: 'Speak with the MET team',
    description: 'Ask your questions, understand the experience better and let the team get to know what you are looking for.',
  },
  {
    title: 'Get approved, then reserve your place',
    description: 'Your place is reserved only after MET approves you for the trip.',
  },
]

const alternatives = [
  { title: 'Wait for friends', description: 'Plans can keep getting pushed because dates, budgets and destinations do not align.' },
  { title: 'Travel solo', description: 'You get complete freedom, but not everyone wants to experience the whole trip alone.' },
  { title: 'Open group tour', description: 'The itinerary may be organised, but you usually have little say in who ends up in the group.' },
  { title: 'Travel with MET', description: 'The trip is planned and the group is intentionally curated before travellers are approved.' },
]

const soloSupport = [
  { title: 'Meet the group before departure', description: 'A virtual group introduction helps everyone put faces to names before the trip starts.' },
  { title: 'Get to know people before you travel', description: 'Where practical, MET also organises a pre-trip meetup or dinner so your first interaction does not have to happen at the airport.' },
  { title: 'Thoughtful roommate matching', description: 'If you are sharing a room, MET helps match roommates based on preferences instead of leaving it completely random.' },
  { title: 'A MET host throughout the trip', description: 'The host helps with introductions, participation and making it easier for people to settle into the group.' },
]

const proof = [
  {
    question: '“What if I don’t naturally talk to strangers?”',
    image: '/media/proof/message-1.webp',
    height: 324,
    alt: 'Past MET traveller: “I’m usually not the person who walks up and starts talking to strangers. But somehow this group made it very easy. Turkey was such a great experience, and the people made the whole trip even better.”',
  },
  {
    question: '“Will I actually enjoy the people?”',
    image: '/media/proof/message-4.webp',
    height: 287,
    alt: 'Past MET traveller: “Honestly, the people were one of the best parts of the trip. Everyone was quite chilled out, friendly and had interesting stories to share.”',
  },
  {
    question: '“What if I’m coming alone?”',
    image: '/media/proof/message-3.webp',
    height: 253,
    alt: 'Past MET traveller: “Had a really good time. Loved the group and the whole vibe. I’d definitely do another MET trip, even if I’m going alone again.”',
  },
  {
    question: '“Would I do another MET trip?”',
    image: '/media/proof/message-2.webp',
    height: 253,
    alt: 'Past MET traveller: “Bali was a proper experience! Good food, beaches, some crazy nights and most importantly a really nice bunch of people. Thanks for putting it all together. Next trip, I’m in.”',
  },
]

const offerItems = [
  {
    title: 'An 8-day Philippines adventure',
    description: 'Moalboal, Coron, El Nido and Manila, with the major island, water and adventure experiences already built into the route.',
  },
  {
    title: 'The travel moving parts handled',
    description: 'International and domestic flights under the planned itinerary, stays, internal transfers, inter-island travel, airport pickups and the listed experiences.',
  },
  {
    title: 'A curated group to experience it with',
    description: 'Every traveller goes through MET’s curation process before approval, rather than the group simply being filled by whoever pays first.',
  },
  {
    title: 'A smoother way to join solo',
    description: 'Pre-trip introductions, a meetup where practical, roommate matching and a dedicated MET host throughout the trip.',
  },
  {
    title: 'Support before you leave',
    description: 'Visa and travel preparation guidance, packing support, flight coordination and help getting ready for the trip.',
  },
]

const disqualifiers = [
  {
    title: 'You are looking for dating or hookups',
    description: 'MET is built around travel, genuine social connection and shared experiences. It is explicitly not a dating trip.',
  },
  {
    title: 'Your only priority is finding the cheapest Philippines package',
    description: 'There will always be cheaper ways to book flights and hotels. MET is for people who also value the group, curation, hosting and the experience around the itinerary.',
  },
  {
    title: 'You want a completely private or customised holiday',
    description: 'This is a group experience with a planned route and shared activities, not a private itinerary that changes around every individual preference.',
  },
  {
    title: 'You want to keep entirely to yourself',
    description: 'You do not need to be the loudest or most extroverted person in the group, but you should be open to meeting people and participating in the experience.',
  },
  {
    title: 'You are not comfortable respecting the group and its boundaries',
    description: 'The comfort of the people travelling together matters. Respectful behaviour and consideration for the group are non-negotiable.',
  },
]

const faqs = [
  {
    question: 'Who else will be on the trip?',
    answers: [
      'MET does not fill the group simply with whoever pays first. Every traveller goes through a curation process before being approved, with the aim of putting together a group of people who are joining for the right reasons and are comfortable being part of a shared travel experience.',
      'You will also get introduced to the group before departure, so you are not meeting everyone for the first time at the airport.',
    ],
  },
  {
    question: 'Can I join if I am coming alone?',
    answers: [
      'Absolutely. The experience is designed to make joining solo feel natural.',
      'There is a pre-trip group introduction, an in-person meetup or dinner where practical, roommate matching based on preferences, and a dedicated MET host throughout the trip to help people settle into the group.',
    ],
  },
  {
    question: 'What does the ₹1,74,000 include?',
    answers: [
      'The trip includes the planned international and domestic flights, accommodation, inter-island travel, airport and internal transfers, listed activities and experiences, travel preparation support and a dedicated MET host.',
      'Personal expenses, additional meals or activities outside the confirmed package, single-room upgrades and significant alternate-city fare differences may be extra.',
    ],
  },
  {
    question: 'How does MET think about safety and comfort on the trip?',
    answers: [
      'No group trip can promise that nothing unexpected will ever happen. What MET can do is reduce unnecessary uncertainty.',
      'The group is curated before approval, the trip has a dedicated MET host, the route and major logistics are organised in advance, and MET sets clear expectations around respectful behaviour and group boundaries.',
    ],
  },
  {
    question: 'What happens if I am interested? Do I need to pay anything now?',
    answers: [
      'No.',
      'Start by getting the complete Philippines trip details. If you want to explore it further, you can speak with the MET team, ask your questions and understand whether the experience is likely to be a good fit.',
      'Only after MET approves you for the trip do you reserve your place with ₹30,000. The remaining amount is split into two instalments.',
    ],
  },
]

function App() {
  const [leadOpen, setLeadOpen] = useState(false)
  const [stickyVisible, setStickyVisible] = useState(false)
  const [heroPlaying, setHeroPlaying] = useState(false)
  const [heroVideoFailed, setHeroVideoFailed] = useState(false)
  const [soloPhotoIndex, setSoloPhotoIndex] = useState(0)
  const heroCtaRef = useRef<HTMLButtonElement>(null)
  const finalCtaRef = useRef<HTMLButtonElement>(null)
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const soloCarouselRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => { captureAttribution() }, [])

  useEffect(() => {
    const hero = heroCtaRef.current
    const final = finalCtaRef.current
    if (!hero || !final) return
    let heroVisible = true
    let finalVisible = false
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) heroVisible = entry.isIntersecting
        if (entry.target === final) finalVisible = entry.isIntersecting
      })
      setStickyVisible(!heroVisible && !finalVisible)
    })
    observer.observe(hero)
    observer.observe(final)
    return () => observer.disconnect()
  }, [])

  const closeLead = useCallback(() => {
    setLeadOpen(false)
    requestAnimationFrame(() => returnFocusRef.current?.focus())
  }, [])
  function openLead(event: MouseEvent<HTMLButtonElement>) {
    returnFocusRef.current = event.currentTarget
    setLeadOpen(true)
  }
  function toggleHeroVideo() {
    const video = heroVideoRef.current
    if (!video) return
    if (video.paused) {
      void video.play().catch(() => setHeroPlaying(false))
    } else {
      video.pause()
    }
  }
  function updateSoloPhoto(event: UIEvent<HTMLDivElement>) {
    const carousel = event.currentTarget
    const nextIndex = Math.round(carousel.scrollLeft / carousel.clientWidth)
    setSoloPhotoIndex(nextIndex)
  }
  function showSoloPhoto(index: number) {
    const carousel = soloCarouselRef.current
    if (!carousel) return
    carousel.scrollTo({ left: carousel.clientWidth * index, behavior: 'auto' })
  }

  return (
    <>
      <header className="site-header" inert={leadOpen}>
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="MET, back to top">
            <img className="brand-icon" src="/media/brand/met-icon.webp" alt="" width="118" height="120" />
            <img className="brand-wordmark" src="/media/brand/met-wordmark.webp" alt="MET" width="280" height="104" />
          </a>
          <span className="header-trip">Philippines 2026</span>
        </div>
      </header>

      <main id="top" inert={leadOpen}>
        <section className="hero content-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">18–26 December 2026</p>
            <h1 id="hero-title">This December, island-hop the Philippines.</h1>
            <p className="lede">Swim with sardines in Moalboal, chase waterfalls, island-hop through Coron and explore El Nido’s lagoons, all with a curated group of travellers.</p>
            <div className="hero-facts">
              <span>8 Days / 7 Nights</span><span>₹1,74,000</span><span>Join solo or with a friend</span>
            </div>
            <button className="button button-primary hero-cta" ref={heroCtaRef} type="button" onClick={openLead}>Get the Philippines Trip Details</button>
            <p className="micro hero-micro">Get the complete itinerary, inclusions and trip details sent to you. No payment or commitment required.</p>
          </div>
          <figure className="hero-media">
            <video
              ref={heroVideoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/media/video/met-hero-poster.webp"
              width="900"
              height="900"
              aria-label="Philippines island and underwater trip footage"
              onPlay={() => setHeroPlaying(true)}
              onPause={() => setHeroPlaying(false)}
              onError={() => setHeroVideoFailed(true)}
            >
              <source src="/media/video/met-hero.webm" type="video/webm" />
              <source src="/media/video/met-hero.mp4" type="video/mp4" />
            </video>
            {!heroVideoFailed && (
              <button className="hero-video-toggle" type="button" onClick={toggleHeroVideo} aria-label={heroPlaying ? 'Pause hero video' : 'Play hero video'}>
                <span aria-hidden="true">{heroPlaying ? '❚❚' : '▶'}</span>
                {heroPlaying ? 'Pause' : 'Play'}
              </button>
            )}
            <figcaption className="media-label">Philippines · MET</figcaption>
          </figure>
        </section>

        <section className="section section-white" aria-labelledby="snapshot-title">
          <div className="content-width">
            <p className="eyebrow">Trip snapshot</p>
            <h2 id="snapshot-title">Your Philippines trip at a glance</h2>
            <div className="stats">
              <div className="stat"><strong>18 to 26 December</strong><span>8 Days / 7 Nights</span></div>
              <div className="stat"><strong>₹1,74,000</strong><span>Per person</span></div>
              <div className="stat"><strong>4 Stops</strong><span>Moalboal, Coron, El Nido and Manila</span></div>
              <div className="stat"><strong>Curated Group Trip</strong><span>Join solo or with a friend</span></div>
            </div>
            <div className="curated-note">
              <strong>Travel with a thoughtfully selected group.</strong>
              <p>MET curates the group before travellers are approved to reserve their place.</p>
            </div>
            <div className="route-wrap">
              <div className="route-head"><strong>Your 8-day route</strong><span>Moalboal → Coron → El Nido → Manila</span></div>
              <figure className="route-map">
                <img
                  src="/media/maps/philippines-island-hopping-route.webp"
                  alt="Map of the itinerary: Moalboal for 2 nights, Coron for 2 nights, El Nido for 2 nights, and Manila for 1 night."
                  width="1122"
                  height="1402"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="section experience" aria-labelledby="experience-title">
          <div className="content-width">
            <div className="section-intro">
              <p className="eyebrow">The experience</p>
              <h2 id="experience-title">This is what your December in the Philippines could look like.</h2>
              <p className="body">Swim through Moalboal’s famous Sardine Run. Chase waterfalls at Kawasan. Spend your days island-hopping through Coron’s turquoise lagoons. Kayak through El Nido, slow down on the beach, catch sunsets and end the day with good food and good company.</p>
              <p className="body">It is eight days designed to give you different sides of the Philippines, with adventure, island time, beaches, social moments and enough space to actually enjoy where you are.</p>
            </div>
            <div className="stories">
              {stories.map((story) => (
                <article className={`story${story.feature ? ' story-feature' : ''}`} key={story.place}>
                  <div className="story-media"><img src={story.image} alt={story.alt} loading="lazy" decoding="async" width={story.width} height={story.height} /><span className="media-label">{story.place}</span></div>
                  <div className="story-copy"><p className="story-kicker">{story.place}</p><h3>{story.title}</h3><p>{story.description}</p></div>
                </article>
              ))}
            </div>
            <div className="editorial-note">
              <h3>More than a list of places to tick off</h3>
              <p className="body">The route is put together to balance adventure, islands, beaches, social time and moments to simply enjoy the Philippines instead of rushing from one attraction to the next.</p>
              <p className="body">And because this is a MET trip, you are not just joining an itinerary. You are experiencing it with a curated group and a dedicated MET host throughout the journey.</p>
            </div>
          </div>
        </section>

        <section className="section section-stone section-compact" aria-labelledby="planning-title">
          <div className="content-width planning-layout">
            <div><p className="eyebrow">The planning</p><h2 id="planning-title">Just show up ready to enjoy the Philippines.</h2><p className="body">An 8-day, multi-stop Philippines trip means flights, island transfers, stays, airport pickups, local transport, activities and timings all need to line up. MET has already put the key moving parts together so you can spend less time figuring things out and more time enjoying the trip.</p></div>
            <div className="planning-list">
              {planningItems.map((item) => <div className="planning-item" key={item}><span className="tick" aria-hidden="true">✓</span><span>{item}</span></div>)}
            </div>
          </div>
        </section>

        <section className="section section-sand" aria-labelledby="problem-title">
          <div className="content-width narrow-content">
            <p className="eyebrow">The real problem</p>
            <h2 id="problem-title">You know you want to travel. The hard part is finding who to go with.</h2>
            <p className="body">Your friends are busy. Someone cannot get leave. Someone wants a different destination. Someone has a different budget. And before you know it, another trip gets pushed to “later.”</p>
            <p className="body">Or maybe you already know you want to travel, but you simply do not have the right person to go with.</p>
            <p className="small problem-lead">You are not the only one. These are the kinds of things travellers tell MET:</p>
            <div className="problem-quotes">
              <p>“Everyone’s busy with work.”</p>
              <p>“It’s so difficult to get everyone’s dates to match.”</p>
              <p>“I want to go, but I don’t have anyone to go with.”</p>
            </div>
            <p className="body">Going solo is not for everyone. But joining a random group of strangers can feel like an even bigger gamble.</p>
            <p className="problem-question">Who will be in the group? Will you actually enjoy spending eight days together? Will the atmosphere feel comfortable and respectful? Or will you spend ₹1.74L on an incredible destination with people you would never have chosen to travel with?</p>
            <p className="bridge">Because on a group trip, the itinerary is only half the experience.</p>
          </div>
        </section>

        <section className="section section-white" aria-labelledby="curation-title">
          <div className="content-width narrow-content">
            <p className="eyebrow">The MET difference</p>
            <h2 id="curation-title">A great trip is not just about where you go. It is about who you go with.</h2>
            <p className="body">The same beaches, lagoons and experiences can feel completely different depending on the people around you. The right group adds energy, conversations, shared moments and people to enjoy the experience with. The wrong group can make even an incredible itinerary feel uncomfortable.</p>
            <div className="reframe"><p>That is why MET does not only curate the trip. We curate the group too.</p></div>
            <figure className="social-photo difference-photo">
              <img src="/media/social/met-social-people-selfie-boat.jpg" alt="MET travellers share a selfie aboard a boat on a sunny day." width="1448" height="1086" loading="lazy" decoding="async" />
            </figure>
            <p className="body">This is not an open group where anyone who pays gets added to the trip. Every traveller goes through MET’s curation process before being approved to join.</p>
            <div className="timeline">
              {curationSteps.map((step, index) => <div className="timeline-step" key={step.title}><span className="timeline-num" aria-hidden="true">{index + 1}</span><div><strong>{step.title}</strong><span>{step.description}</span></div></div>)}
            </div>
            <div className="curation-close"><strong>Because filling seats is not the goal. Building the right group is.</strong><p className="body">MET is intentionally selective about who joins so the character of the group is not left entirely to chance.</p></div>
            <div className="alternatives">
              <h3>Your options look a little different</h3>
              {alternatives.map((option) => <div className="alt-row" key={option.title}><strong>{option.title}</strong><span>{option.description}</span></div>)}
            </div>
            <p className="bridge">You do not have to wait for everyone else’s calendar to align. You need a trip worth taking and people worth experiencing it with.</p>
          </div>
        </section>

        <section className="section section-compact" aria-labelledby="solo-title">
          <div className="content-width narrow-content">
            <p className="eyebrow">Coming solo</p>
            <h2 id="solo-title">Coming solo is completely normal here.</h2>
            <p className="solo-thought">A lot of the hesitation around joining a group trip alone comes from one thought: <em>“What if I reach the airport and everyone already knows each other?”</em></p>
            <p className="body">MET is designed to reduce that awkwardness before the trip even begins.</p>
            <figure className="social-carousel">
              <div className="social-carousel-track" role="region" aria-roledescription="carousel" aria-label="Scenes from past MET trips" tabIndex={0} ref={soloCarouselRef} onScroll={updateSoloPhoto}>
                {socialMoments.map((moment, index) => (
                  <div className="social-carousel-slide" role="group" aria-roledescription="slide" aria-label={`Slide ${index + 1} of ${socialMoments.length}`} key={moment.image}>
                    <img src={moment.image} alt={moment.alt} width={moment.width} height={moment.height} style={{ objectPosition: moment.objectPosition }} loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
              <div className="social-carousel-pagination" role="group" aria-label="Choose a past MET trip photo">
                {socialMoments.map((moment, index) => (
                  <button className={soloPhotoIndex === index ? 'social-carousel-dot is-active' : 'social-carousel-dot'} type="button" aria-label={`Show photo ${index + 1} of ${socialMoments.length}`} aria-pressed={soloPhotoIndex === index} onClick={() => showSoloPhoto(index)} key={moment.image} />
                ))}
              </div>
              <figcaption className="social-caption">Scenes from past MET trips</figcaption>
            </figure>
            <div className="solo-grid">
              {soloSupport.map((item) => <div className="solo-item" key={item.title}><strong>{item.title}</strong><span>{item.description}</span></div>)}
            </div>
            <p className="body">So whether you come by yourself or with a friend, you are joining an experience designed to make meeting the group feel natural from the start.</p>
            <p className="solo-close">Come solo. Experience it together.</p>
          </div>
        </section>

        <section className="section section-stone" aria-labelledby="proof-title">
          <div className="content-width">
            <div className="section-intro"><p className="eyebrow">Real traveller proof</p><h2 id="proof-title">Still wondering what the group will actually feel like?</h2><p className="body">These are real messages from people who have travelled with MET before.</p></div>
            <div className="proof-grid">
              {proof.map((item) => <div className="proof-item" key={item.question}><p className="proof-question">{item.question}</p><div className="proof-frame"><img src={item.image} width="760" height={item.height} alt={item.alt} loading="lazy" decoding="async" /></div></div>)}
            </div>
          </div>
        </section>

        <section className="section offer-section" aria-labelledby="offer-title">
          <div className="content-width offer-layout">
            <div>
              <p className="eyebrow">The complete experience</p>
              <h2 id="offer-title">More than flights and hotels. This is the whole experience.</h2>
              <p className="body">You could look at this trip as flights, hotels and activities. But that would miss a big part of what MET has actually put together.</p>
              <p className="body offer-intro">For ₹1,74,000 per person, you are getting:</p>
              <div className="offer-list">
                {offerItems.map((item) => <div className="offer-item" key={item.title}><strong>{item.title}</strong><span>{item.description}</span></div>)}
              </div>
            </div>
            <div className="price-wrap">
              <div className="price">₹1,74,000</div><div className="price-sub">per person</div>
              <div className="payments">
                <div className="payment"><strong>₹30,000</strong><span>After approval, to reserve your place</span></div>
                <div className="payment"><strong>₹72,000</strong><span>45 days before departure</span></div>
                <div className="payment"><strong>₹72,000</strong><span>30 days before departure</span></div>
              </div>
              <p className="apply-first">Apply first. Pay only after you are approved.</p>
              <p className="body">You do not need to pay anything just to find out more or speak with MET.</p>
              <button className="button button-primary" type="button" onClick={openLead}>Get the Philippines Trip Details</button>
              <p className="micro">Get the complete itinerary, inclusions, payment details and next steps.</p>
            </div>
          </div>
        </section>

        <section className="section section-sand" aria-labelledby="not-for-title">
          <div className="content-width narrow-content">
            <p className="eyebrow">Protecting the group</p>
            <h2 id="not-for-title">Not every traveller is right for a MET trip. That is intentional.</h2>
            <p className="body">The group experience only works when people join for the right reasons. That is why MET is comfortable saying no when someone is not right for the trip.</p>
            <h3 className="no-fit-heading">This probably is not the trip for you if...</h3>
            <div className="no-fit-list">
              {disqualifiers.map((item) => <div className="no-fit" key={item.title}><strong>{item.title}</strong><span>{item.description}</span></div>)}
            </div>
            <p className="disq-close">If you want a great Philippines trip and care just as much about the people you experience it with, you will understand why MET is selective.</p>
          </div>
        </section>

        <section className="section section-white" aria-labelledby="faq-title">
          <div className="content-width narrow-content">
            <p className="eyebrow">FAQs</p>
            <h2 id="faq-title">Still have a few questions?</h2>
            <div className="faq">
              {faqs.map((item) => <details key={item.question}><summary>{item.question}</summary><div className="faq-answer">{item.answers.map((answer) => <p key={answer}>{answer}</p>)}</div></details>)}
            </div>
          </div>
        </section>

        <section className="section final-cta-section" aria-labelledby="final-title">
          <div className="content-width final-cta-layout">
            <figure className="social-photo final-cta-image">
              <img src="/media/social/met-social-under-waterfall.jpg" alt="MET travellers gather beneath a waterfall after a water adventure." width="1448" height="1086" loading="lazy" decoding="async" />
            </figure>
            <div className="final-cta">
              <p className="eyebrow">Next step</p>
              <h2 id="final-title">Could this be your December trip?</h2>
              <p className="body">Get the complete Philippines trip details sent to you so you can go through the itinerary, inclusions, pricing and how the MET experience works at your own pace.</p>
              <button className="button button-light" ref={finalCtaRef} type="button" onClick={openLead}>Get the Philippines Trip Details</button>
              <p className="micro">No payment. No commitment. Just the details.</p>
              <p className="small">If you want to explore the trip further after that, you can choose to speak with the MET team, ask your questions and understand the next steps.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" inert={leadOpen}>
        <p>MET · Philippines Social Adventure · 18 to 26 December 2026</p>
      </footer>

      <div className={`sticky-cta${stickyVisible && !leadOpen ? ' sticky-cta-visible' : ''}`} aria-hidden={!stickyVisible || leadOpen} inert={leadOpen}>
        <div><strong>18–26 Dec · ₹1.74L</strong><span>Philippines Social Adventure</span></div>
        <button type="button" onClick={openLead} tabIndex={stickyVisible && !leadOpen ? 0 : -1}>Get Trip Details</button>
      </div>

      {leadOpen && <LeadSheet onClose={closeLead} />}
    </>
  )
}

export default App
