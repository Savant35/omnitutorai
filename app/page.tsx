import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList";
import CTA from "@/components/CTA";
import { getRecentSessions, getPopularCompanions } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";

export const revalidate = 3600  // check if the data has changed every hour
export const dynamic    = 'force-dynamic'


const Page = async () => {
  const [companions, recentSessions] = await Promise.all([
    getPopularCompanions(3),
    getRecentSessions(10),
  ])


  return (
    <main>
      <h1>Popular Tutors</h1>

      <section className="home-section">
        {companions.map((companion) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={getSubjectColor(companion.subject)}
          />
        ))}

      </section>

      <section className="home-section">
        <CompanionList
          title="Recently completed sessions"
          companions={recentSessions}
          classNames="w-2/3 max-lg:w-full"
        />
        <CTA />
      </section>
    </main>
  )
}

export default Page