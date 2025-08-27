import { PortableText } from '@portabletext/react'
import { getClient } from '@/lib/sanity'
import { Meetup } from '@/types'
import { format, isPast } from 'date-fns'

async function getMeetups(): Promise<Meetup[]> {
  try {
    const query = `*[_type == "meetup"] | order(date desc)`
    const meetups = await getClient().fetch(query)
    return meetups
  } catch (error) {
    console.error('Failed to fetch meetups:', error)
    return []
  }
}

export default async function CalendarPage() {
  const meetups = await getMeetups()
  const upcomingMeetups = meetups.filter(meetup => !isPast(new Date(meetup.date)))
  const pastMeetups = meetups.filter(meetup => isPast(new Date(meetup.date)))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Meetup Calendar
      </h1>

      {upcomingMeetups.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Upcoming Meetups
          </h2>
          <div className="grid gap-6">
            {upcomingMeetups.map((meetup) => (
              <MeetupCard key={meetup._id} meetup={meetup} />
            ))}
          </div>
        </section>
      )}

      {pastMeetups.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Past Meetups
          </h2>
          <div className="grid gap-6">
            {pastMeetups.map((meetup) => (
              <MeetupCard key={meetup._id} meetup={meetup} isPast />
            ))}
          </div>
        </section>
      )}

      {meetups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No meetups scheduled yet. Check back soon or follow us on Instagram for updates!
          </p>
        </div>
      )}
    </div>
  )
}

function MeetupCard({ meetup, isPast = false }: { meetup: Meetup; isPast?: boolean }) {
  const date = new Date(meetup.date)
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${isPast ? 'opacity-75' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {meetup.title}
          </h3>
          
          <div className="space-y-2 text-gray-600 mb-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {format(date, 'EEEE, MMMM d, yyyy')} at {format(date, 'h:mm a')}
              </span>
            </div>
            
            {meetup.location && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{meetup.location}</span>
              </div>
            )}
            
            {meetup.maxParticipants && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>Max {meetup.maxParticipants} participants</span>
              </div>
            )}
          </div>
          
          {meetup.description && (
            <div className="prose prose-sm text-gray-700 mb-4">
              <PortableText value={meetup.description} />
            </div>
          )}
        </div>
        
        <div className="sm:ml-6 sm:flex-shrink-0">
          {!isPast && meetup.registrationUrl && (
            <a
              href={meetup.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Register
            </a>
          )}
          {isPast && (
            <span className="inline-block bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-sm">
              Completed
            </span>
          )}
        </div>
      </div>
    </div>
  )
}