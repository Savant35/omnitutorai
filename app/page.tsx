import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList";
import CTA from "@/components/CTA";
import {getPopularCompanions, getUserSessions } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

export const revalidate = 3600  // check if the data has changed every hour
export const dynamic = 'force-dynamic'


const Page = async () => {
  const user = await currentUser();
  const [companions, recentSessions] = await Promise.all([
    getPopularCompanions(3),
    user?.id ? getUserSessions(user.id, 5) : Promise.resolve([]),
  ])


  return (
    <main>
      <h1>Popular Tutors</h1>
      {/* displays most popular tutor based on the number of sessions */}
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
        {/* If the user is logged in, show their recent sessions, otherwise prompt them to log in */}
        {user?.id ? (
          <CompanionList
            title="Recently completed sessions"
            companions={recentSessions}
            classNames="w-2/3 max-lg:w-full" />) : (
          <p>Login to see your recent completed sessions</p>)}
        <CTA />
      </section>
    </main>
  )
}

export default Page