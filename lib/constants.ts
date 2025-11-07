export type EventItem = {
    image: string;
    title: string;
    slug: string,
    location: string,
    date: string, 
    time: string,
}


export const events: EventItem[] = [
  {
    image: '/images/event1.png',
    title: 'React Summit',
    slug: 'react-summit-2026',
    location: 'Amsterdam, Netherlands',
    date: 'Apr 14–16, 2026',
    time: '09:00 — 18:00 CEST',
  },
  {
    image: '/images/event2.png',
    title: 'Next.js Conf',
    slug: 'nextjs-conf-2026',
    location: 'San Francisco, CA, USA',
    date: 'May 12, 2026',
    time: '10:00 — 17:00 PDT',
  },
  {
    image: '/images/event3.png',
    title: 'JSConf EU',
    slug: 'jsconf-eu-2026',
    location: 'Lisbon, Portugal',
    date: 'Jun 3–5, 2026',
    time: '09:30 — 18:00 WEST',
  },
  {
    image: '/images/event4.png',
    title: 'Global Hackathon',
    slug: 'global-hackathon-2026',
    location: 'Remote / Hybrid',
    date: 'Jul 10–12, 2026',
    time: '24-hour sprint sessions',
  },
  {
    image: '/images/event5.png',
    title: 'PyCon US',
    slug: 'pycon-us-2026',
    location: 'Pittsburgh, PA, USA',
    date: 'Sep 2–6, 2026',
    time: '09:00 — 17:00 EDT',
  },
  {
    image: '/images/event6.png',
    title: 'DevOpsDays London',
    slug: 'devopsdays-london-2026',
    location: 'London, UK',
    date: 'Oct 20–21, 2026',
    time: '09:00 — 17:00 BST',
  },
];