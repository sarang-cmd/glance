export const site='https://glance-win.vercel.app';
export const github='https://github.com/sarang-cmd/glance';
export const nav=[['Widgets','/widgets'],['How it works','/how-it-works'],['Roadmap','/roadmap'],['FAQ','/faq']] as const;
export const pages:Record<string,{title:string;description:string}>={
'/':{title:'Your day. At a glance.',description:'Planned ad-free lock screen widgets for Windows 11. Battery stats, habits, calendar and tasks, with a local companion app.'},
'/widgets':{title:'Small widgets. Useful details.',description:'Explore interactive sample demos of the planned Glance widget families for Windows 11.'},
'/how-it-works':{title:'Local data. Native widgets.',description:'How Glance plans to use the Windows Widgets board, MSIX, Adaptive Cards and a local SQLite collector.'},
'/roadmap':{title:'A clear path to the first build.',description:'The Glance plan from the M0 lock screen spike to the M6 signed release. Nothing has shipped yet.'},
'/get-started':{title:'Follow the first build.',description:'Glance is in planning. Star the source on GitHub or join the double opt-in release list.'},
'/faq':{title:'A few things worth knowing.',description:'Answers about Glance availability, privacy, Windows support, battery data and planned integrations.'},
'/privacy':{title:'Privacy Policy',description:'Draft information on Glance product privacy and the website release list, infrastructure and optional analytics.'},
'/terms':{title:'Terms of Service',description:'Draft terms for the Glance project website and release list.'},
'/imprint':{title:'Imprint',description:'Draft owner and contact information for the Glance website, requiring legal review.'},
'/thank-you':{title:'Check your inbox.',description:'Confirm your email address to join the Glance release list.'},
'/confirm':{title:'Confirm your place.',description:'Confirm your subscription to the Glance release list.'},
'/unsubscribe':{title:'Your release list preferences.',description:'Unsubscribe from Glance release announcements.'}};
export const faq=[
['Can I download Glance now?','No. Glance is in planning, and no code has shipped yet. The first milestone tests a packaged widget with one button on the lock screen.'],
['Which Windows versions are planned?','Windows 11 is the target platform. The PRD targets Windows 11 26H2, build 26300.x. Windows 10, macOS and mobile are out of scope. Supported builds still need testing.'],
['Will I need the Microsoft Store?','No Microsoft Store distribution is planned for v1. Glance will use a signed MSIX package, with releases planned through GitHub Releases and winget. Personal sideloading uses Developer Mode.'],
['Where will my data live?','The product is designed to keep metrics, habits, events and settings in a local SQLite database. There is no Glance account, cloud sync or product telemetry. This website has separate release list and optional analytics practices.'],
['Will buttons work while the PC is locked?','This is unverified. M0 will test lock screen interactivity. Buttons may require unlock. Notification actions, the tray flyout and deep links are planned fallbacks. The website demos do not prove Windows behavior.'],
['Can Glance change my Google Calendar?','No. Calendar access is read-only for v1. Each user supplies their own Google OAuth client ID. The companion app is planned to include month and full-year browsing.'],
['What if my device does not report battery cycles?','Glance will show “not reported by this device” rather than guess. Battery health and cycle availability depend on the hardware and firmware.'],
['What can other people read on my lock screen?','The planned Full, Redacted and Counts only privacy modes control visible information globally and per widget. Titles can be hidden while progress remains visible.'],
['Is Glance open source?','Yes. The repository is licensed under MIT. Ideas and issues are welcome, especially from developers with experience building Windows widget providers.']
];
export const milestones=[
['M0','Spike','Minimal packaged widget, one button, sideloaded and pinned to the lock screen.','Document lock screen button behavior and confirm the Study with Sarang bridge format.'],
['M1','Battery+','Collector, SQLite, Battery+ widget, companion app shell and privacy modes.','BAT-1, BAT-2, BAT-4 and CORE-1 to CORE-5.'],
['M2','Habits','Habit engine, water presets, exercise adjustments and reminders, sessions and contribution graph.','WAT-1 to WAT-4, EXE-1 to EXE-5 and HAB-1 to HAB-4.'],
['M3','Study and focus','Study with Sarang integration, study ring and focus timer.','STU-1 to STU-3 and FOC-1.'],
['M4','Calendar and tasks','Google Calendar, year browser and built-in task list.','CAL-1 to CAL-3 and TSK-1 to TSK-3.'],
['M5','Combined and stats','Today card, system health, GitHub streak and weekly recap.','TDY-1, SYS-1, GH-1 and REC-1.'],
['M6','Release','Signing, winget and GitHub release, documentation and screenshots.','Public v1.0 on GitHub.']
];
