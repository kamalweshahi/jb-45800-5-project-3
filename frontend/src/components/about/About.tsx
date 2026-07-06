import { ArrowRight, BrainCircuit, Heart, MapPinned, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/use-auth'
import './About.css'

export default function About() {
  const { user } = useAuth()

  return (
    <div className="about-page">
      <section className="travel-hero">
        <div className="travel-hero-content">
          <p className="eyebrow">Your next story starts here</p>
          <h1>Find a vacation that feels made for you.</h1>
          <p>
            Voyanta brings inspiring destinations, clear trip details, saved favorites, and intelligent planning together in one calm place.
          </p>
          <div className="hero-actions">
            <Link className="button-link" to={user ? '/vacations' : '/register'}>
              {user ? 'Explore vacations' : 'Start exploring'} <ArrowRight size={18} />
            </Link>
            {!user && <Link className="button-secondary" to="/login">I already have an account</Link>}
          </div>
          <div className="hero-trust-row">
            <span><ShieldCheck size={18} /> Clear prices</span>
            <span><Heart size={18} /> Save favorites</span>
            <span><Sparkles size={18} /> Plan smarter</span>
          </div>
        </div>

        <div className="destination-collage" aria-label="Voyanta travel inspiration">
          <div className="collage-card collage-main">
            <span>Amalfi Coast</span>
            <strong>Slow mornings by the Mediterranean</strong>
          </div>
          <div className="collage-card collage-small collage-blue">
            <span>Kyoto</span>
            <strong>Culture in every quiet detail</strong>
          </div>
          <div className="collage-card collage-small collage-sunset">
            <span>Santorini</span>
            <strong>Golden-hour escapes</strong>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="section-heading">
          <p className="eyebrow">Travel with less friction</p>
          <h2>Everything you need before you book the feeling.</h2>
          <p>Compare dates and prices, keep track of the places you love, and turn a destination into a practical plan.</p>
        </div>
        <div className="feature-grid">
          <article>
            <MapPinned />
            <h3>Curated escapes</h3>
            <p>Explore trips with clear dates, pricing, descriptions, and live availability status.</p>
          </article>
          <article>
            <Heart />
            <h3>Your favorites</h3>
            <p>Like the vacations that stand out and return to a personal list whenever you are ready.</p>
          </article>
          <article>
            <BrainCircuit />
            <h3>AI trip planning</h3>
            <p>Choose a destination and receive an itinerary matched to the actual length of the vacation.</p>
          </article>
        </div>
      </section>

      <section className="story-section">
        <div>
          <p className="eyebrow">About Voyanta</p>
          <h2>Built around the way people actually dream about travel.</h2>
        </div>
        <p>
          We believe planning should feel exciting, not scattered. Voyanta is designed to make discovering, comparing, and organizing a getaway simple from the first idea to the final itinerary. Designed and developed by Kamal Weshahi.
        </p>
      </section>
    </div>
  )
}
