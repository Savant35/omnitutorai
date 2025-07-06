import Image from "next/image";
import Link from "next/link";
const CTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-badge">start learning your way</div>
      <h2 className="text-3xl font-bold">Build your own Tutor</h2>
      <p> Design a tutor tailored to your preferences—adapting content, feedback, and pacing to match your individual learning style.</p>
      {/*<Image 
      src="/images/cta.svg" 
      alt="CTA Image" width={362} height={232} 
      className="call to action image" /> */}
      <button className="btn-primary">
        <Image 
        src="/icons/plus.svg" 
        alt="plus icon" 
        width={16} height={16} />
        <Link href={"/companions/new"}>
        <p>Create a new Tutor</p>
        </Link>
      </button>
    </section>
  )
}

export default CTA