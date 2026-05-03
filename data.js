const TIMELINE_DATA = [
  { month: "Jan", label: "January", phase: "Pre-Election", color: "#6366f1",
    title: "Election Year Begins", icon: "📅",
    events: ["State legislatures finalize election laws","Election officials begin planning","Candidate exploratory committees form","Campaign finance rules go into effect"],
    tip: "Most federal election cycles officially begin in January of the election year." },
  { month: "Feb", label: "February", phase: "Filing Opens", color: "#8b5cf6",
    title: "Candidate Filing Opens", icon: "📝",
    events: ["Candidates file official paperwork with election authorities","Pay filing fees or collect petition signatures","Declare party affiliation","FEC registration required for federal races"],
    tip: "Filing deadlines vary by state — some states close filing as early as February!" },
  { month: "Mar", label: "March", phase: "Primaries", color: "#a855f7",
    title: "Primary Season Begins", icon: "🏁",
    events: ["Super Tuesday — largest primary election day","Voters choose party nominees","State-by-state delegate allocation begins","Candidates who lose may drop out"],
    tip: "Super Tuesday in early March can effectively decide the presidential nominees." },
  { month: "Apr", label: "April", phase: "Campaigns", color: "#ec4899",
    title: "Campaign Ramps Up", icon: "📣",
    events: ["Primaries continue in remaining states","Q1 campaign finance reports due","Candidates hold rallies and town halls","Opposition research intensifies"],
    tip: "Campaign finance transparency laws require quarterly financial disclosures." },
  { month: "May", label: "May", phase: "Nominations", color: "#f43f5e",
    title: "Delegate Count Climbs", icon: "🔢",
    events: ["Late primary states vote","Frontrunners secure enough delegates","Some races called early","Voter registration deadlines approach in many states"],
    tip: "May is critical for securing enough delegates to clinch the nomination." },
  { month: "Jun", label: "June", phase: "Conventions Prep", color: "#f97316",
    title: "Primary Season Ends", icon: "🏆",
    events: ["Final primaries concluded","Party nominees emerge","Convention dates confirmed","VP selection process begins"],
    tip: "The last major primaries often wrap up in June, setting the stage for conventions." },
  { month: "Jul", label: "July", phase: "Conventions", color: "#eab308",
    title: "Party Conventions", icon: "🎉",
    events: ["Republican & Democratic National Conventions","Official party platform adopted","VP picks announced","Nominees formally accept the nomination"],
    tip: "Conventions historically give candidates a 'bounce' in the polls." },
  { month: "Aug", label: "August", phase: "General Campaign", color: "#84cc16",
    title: "General Election Campaign", icon: "🌐",
    events: ["Debates scheduled and confirmed","Voter registration drives peak","Campaign ads flood TV and social media","Battleground state focus intensifies"],
    tip: "August is peak voter registration season — make sure you're registered!" },
  { month: "Sep", label: "September", phase: "Debates", color: "#22c55e",
    title: "Presidential Debates", icon: "🎤",
    events: ["Presidential debates (typically 2-3)","VP debate","Fact-checkers analyze claims","Early voting begins in some states"],
    tip: "Debates can shift polling by several points and energize voter turnout." },
  { month: "Oct", label: "October", phase: "Early Voting", color: "#14b8a6",
    title: "Early Voting Opens", icon: "🗳️",
    events: ["Early in-person voting opens in most states","Mail-in ballot requests surge","Voter registration closes in many states","Final campaign sprint begins"],
    tip: "Over 40% of Americans now vote before Election Day via early or mail voting." },
  { month: "Nov", label: "November", phase: "Election Day", color: "#0ea5e9",
    title: "Election Day!", icon: "⭐",
    events: ["Election Day — first Tuesday after first Monday","Polls open 6AM–8PM (varies by state)","Results reported as polls close","Networks call races based on exit polls + returns"],
    tip: "By law, if you're in line when polls close, you still have the right to vote!" },
  { month: "Dec", label: "December", phase: "Certification", color: "#3b82f6",
    title: "Certification & Electoral College", icon: "📜",
    events: ["States certify their election results","Electors meet in state capitals to cast Electoral College votes","Congress receives certified results","Recounts and legal challenges resolved"],
    tip: "The Electoral College formally elects the President in mid-December." }
];

const STEPS_DATA = [
  { num: "01", icon: "📋", title: "Voter Registration",
    summary: "The essential first step — every eligible citizen must register before they can vote.",
    details: [
      { heading: "Who Can Register?", body: "U.S. citizens who are 18 years or older by Election Day. Some states allow pre-registration at 16–17." },
      { heading: "How to Register", body: "Online via your state's website, by mail using the National Voter Registration Form, or in person at the DMV, library, or election office." },
      { heading: "Deadlines", body: "Deadlines vary: 15–30 days before the election in most states. Some states offer same-day registration at the polls." },
      { heading: "Staying Registered", body: "If you move or change your name, you must update your registration. Check your status before each election." }
    ],
    tag: "Step 1" },
  { num: "02", icon: "🏛️", title: "Candidate Filing & Qualification",
    summary: "Aspiring candidates must officially declare and meet legal requirements before appearing on the ballot.",
    details: [
      { heading: "Filing Requirements", body: "Candidates must submit a Declaration of Candidacy form, pay a filing fee (or collect petition signatures), and register with the FEC for federal races." },
      { heading: "Ballot Access", body: "Third-party candidates often face stricter requirements: they may need thousands of petition signatures to qualify for the ballot." },
      { heading: "Financial Disclosures", body: "Federal candidates must disclose their finances regularly. Campaign contributions over $200 must be reported publicly." },
      { heading: "Eligibility Rules", body: "U.S. President: 35+ years old, natural-born citizen, 14-year U.S. resident. Senate: 30+, 9-year citizen. House: 25+, 7-year citizen." }
    ],
    tag: "Step 2" },
  { num: "03", icon: "🏁", title: "Primaries & Caucuses",
    summary: "Voters within each party select their preferred candidate to run in the general election.",
    details: [
      { heading: "Primary Elections", body: "State-run elections where registered party members vote for their preferred candidate. Results determine how many delegates each candidate receives." },
      { heading: "Caucuses", body: "Party-run meetings where voters publicly express their preference, often by physically grouping together. Iowa famously uses caucuses." },
      { heading: "Open vs. Closed Primaries", body: "Open: any registered voter can participate. Closed: only registered party members can vote. Semi-closed: rules vary." },
      { heading: "Delegates & Nomination", body: "Candidates accumulate delegates. Reaching the 'magic number' of delegates secures the party nomination for the general election." }
    ],
    tag: "Step 3" },
  { num: "04", icon: "📣", title: "Campaigns & Debates",
    summary: "Candidates make their case to the public through rallies, ads, and televised debates.",
    details: [
      { heading: "Campaign Strategy", body: "Candidates focus on swing states and key demographics. They hold rallies, run TV/digital ads, do media appearances, and canvass neighborhoods." },
      { heading: "Presidential Debates", body: "Typically 2–3 nationally televised debates organized by the nonpartisan Commission on Presidential Debates. VP candidates debate once." },
      { heading: "Campaign Finance", body: "Individual donors can give up to $3,300 per election to a campaign. Super PACs can raise unlimited funds but cannot coordinate directly with campaigns." },
      { heading: "Ground Game", body: "Campaigns organize volunteers to knock on doors, make phone calls, and drive voters to the polls — this 'ground game' can decide close elections." }
    ],
    tag: "Step 4" },
  { num: "05", icon: "🗳️", title: "Voting",
    summary: "Election Day — eligible voters cast ballots in person or by mail.",
    details: [
      { heading: "Election Day", body: "Federal elections are held on the first Tuesday after the first Monday in November. Polls typically open from 6 AM to 8 PM local time." },
      { heading: "Polling Places", body: "Voters go to their assigned polling location based on their registered address. Bring valid ID (required in many states)." },
      { heading: "Early & Mail-In Voting", body: "Most states offer early in-person voting 1–4 weeks before Election Day. Mail-in (absentee) ballots are available in all states; some states mail ballots to all registered voters automatically." },
      { heading: "Accessibility", body: "Polling places must be accessible to voters with disabilities. Provisional ballots are offered when eligibility is questioned." }
    ],
    tag: "Step 5" },
  { num: "06", icon: "📊", title: "Counting the Votes",
    summary: "After polls close, election workers carefully count every valid ballot.",
    details: [
      { heading: "Initial Count", body: "In-person votes are counted first, often using optical scan machines. Mail-in ballots may take longer due to signature verification requirements." },
      { heading: "Chain of Custody", body: "Strict protocols ensure ballots are tracked, secured, and not tampered with. Bipartisan teams of observers watch the counting process." },
      { heading: "Audits & Recounts", body: "Most states conduct post-election audits to verify results. If the margin is within a threshold (typically 0.5%), a recount may be triggered automatically or requested." },
      { heading: "When Results Are Called", body: "Media networks 'call' races based on statistical analysis of returned votes — not official results. Official results take days to weeks to certify." }
    ],
    tag: "Step 6" },
  { num: "07", icon: "📜", title: "Certification of Results",
    summary: "Government officials formally verify and certify the official vote count.",
    details: [
      { heading: "State Canvassing", body: "County boards submit results to the state. The state canvassing board reviews, verifies, and certifies the official tally." },
      { heading: "Certificates of Election", body: "States issue official Certificates of Ascertainment and Election to winning candidates and to the federal government." },
      { heading: "Electoral College", body: "In presidential elections, each state's certified results determine which slate of electors is appointed. Electors formally vote in December." },
      { heading: "Congressional Certification", body: "Congress meets in joint session in January to count Electoral College votes and formally declare the winner." }
    ],
    tag: "Step 7" },
  { num: "08", icon: "🎖️", title: "Inauguration & Taking Office",
    summary: "The winner is sworn in and begins their term of service.",
    details: [
      { heading: "Presidential Inauguration", body: "Held on January 20th following the election. The President-elect takes the Oath of Office at the U.S. Capitol and delivers an inaugural address." },
      { heading: "Congressional Swearing-In", body: "New Senators and Representatives are sworn in on January 3rd by the Vice President (Senate) and the Speaker of the House (House)." },
      { heading: "Transition of Power", body: "Outgoing officials brief incoming ones. Agency heads are nominated and confirmed. Staff transitions occur across all executive departments." },
      { heading: "State & Local Elections", body: "Governors, mayors, and state legislators are also inaugurated — timelines vary by state and jurisdiction." }
    ],
    tag: "Step 8" }
];

const QUIZ_DATA = [
  { q: "On what day are U.S. federal elections held?", opts: ["First Monday in November","First Tuesday after the first Monday in November","Second Tuesday in November","Last Tuesday in October"], ans: 1,
    exp: "By law (2 U.S.C. § 7), federal elections are held on the first Tuesday after the first Monday in November." },
  { q: "What is the minimum age to vote in a U.S. federal election?", opts: ["16","17","18","21"], ans: 2,
    exp: "The 26th Amendment (1971) lowered the voting age from 21 to 18 for all elections." },
  { q: "What does the Electoral College do?", opts: ["Counts all popular votes nationally","Formally elects the President and Vice President","Selects party nominees","Manages campaign finance rules"], ans: 1,
    exp: "The Electoral College is the body of electors established by the Constitution to formally elect the President and Vice President every four years." },
  { q: "What is a primary election?", opts: ["The general election where all voters choose the winner","A vote within a party to select its nominee for the general election","A recount of election results","The certification of election results"], ans: 1,
    exp: "A primary election lets registered party members vote to choose which candidate will represent their party in the general election." },
  { q: "How many Electoral College votes are needed to win the U.S. presidency?", opts: ["218","270","300","538"], ans: 1,
    exp: "There are 538 total electoral votes. A candidate needs a majority — 270 — to win the presidency." },
  { q: "What is a caucus?", opts: ["A method of voting by mail","A party meeting where voters openly express candidate preferences","A court challenge to election results","A type of campaign finance committee"], ans: 1,
    exp: "A caucus is a party-run meeting where voters publicly declare their support for candidates, often by physically standing in groups." },
  { q: "Which amendment to the U.S. Constitution gave women the right to vote?", opts: ["13th","15th","19th","24th"], ans: 2,
    exp: "The 19th Amendment, ratified in 1920, prohibited denying the right to vote based on sex, granting women's suffrage." },
  { q: "What is a 'Super PAC'?", opts: ["A large voting district","An independent expenditure committee that can raise unlimited campaign funds","A government election oversight body","A type of ballot measure"], ans: 1,
    exp: "Super PACs are independent expenditure committees that can raise unlimited funds to support or oppose candidates, but cannot coordinate directly with campaigns." },
  { q: "What happens if no presidential candidate wins 270 Electoral College votes?", opts: ["The election is held again","The popular vote winner becomes President","The House of Representatives chooses the President","The Senate chooses the President"], ans: 2,
    exp: "Under the 12th Amendment, if no candidate wins a majority of Electoral College votes, the House of Representatives chooses the President, with each state delegation getting one vote." },
  { q: "On what date is the U.S. Presidential Inauguration held?", opts: ["January 1","January 6","January 20","February 1"], ans: 2,
    exp: "The 20th Amendment set January 20 as Inauguration Day. The President-elect is sworn in at the U.S. Capitol." }
];

const AI_RESPONSES = {
  "register": { title: "Voter Registration", icon: "📋",
    body: "To register to vote in the U.S.:<br><br>1. <strong>Check eligibility</strong>: You must be a U.S. citizen, 18+ by Election Day, and a resident of your state.<br>2. <strong>Online</strong>: Visit your state's official election website or <a href='https://vote.gov' target='_blank'>vote.gov</a>.<br>3. <strong>By mail</strong>: Use the National Voter Registration Form.<br>4. <strong>In person</strong>: Visit the DMV, library, or election office.<br><br>⏰ <strong>Deadline</strong>: Usually 15–30 days before the election. Some states offer same-day registration!" },
  "electoral college": { title: "The Electoral College", icon: "🏛️",
    body: "The Electoral College is a group of 538 electors who formally elect the President. Here's how it works:<br><br>• Each state gets electors equal to its total congressional representatives (senators + house members).<br>• Most states use <strong>winner-take-all</strong>: whoever wins the popular vote in that state gets ALL its electors.<br>• A candidate needs <strong>270 of 538 electoral votes</strong> to win.<br>• If no one reaches 270, the <strong>House of Representatives</strong> chooses the President.<br><br>The system was designed by the Founders as a compromise between direct popular vote and congressional selection." },
  "count": { title: "How Votes Are Counted", icon: "📊",
    body: "Vote counting is a multi-step process:<br><br>1. <strong>Machine scanning</strong>: Most ballots are fed through optical scanners that tabulate results automatically.<br>2. <strong>Signature verification</strong>: Mail-in ballots require matching signatures before counting.<br>3. <strong>Provisional ballots</strong>: Reviewed and counted after eligibility is confirmed.<br>4. <strong>Bipartisan oversight</strong>: Teams from both parties observe counting to ensure fairness.<br>5. <strong>Audits</strong>: Random checks verify the machine count is accurate.<br>6. <strong>Official results</strong>: Certified by state authorities after all ballots are processed." },
  "tie": { title: "What Happens in a Tie?", icon: "⚖️",
    body: "A presidential tie (or no majority in the Electoral College) triggers a rare constitutional process:<br><br>• The <strong>House of Representatives</strong> votes to choose the President, with each <em>state delegation</em> getting one vote (50 votes total).<br>• The <strong>Senate</strong> votes to choose the Vice President.<br>• This has only happened twice: 1800 (Jefferson vs. Burr) and 1824 (Adams vs. Jackson).<br><br>For a tie in a Congressional race, some states hold runoff elections. In some local races, ties may be decided by coin flip or drawing lots!" },
  "default": { title: "Great Question!", icon: "💡",
    body: "That's an interesting election question! Here are some key facts that might help:<br><br>• <strong>Registration</strong>: You must register before most election deadlines (15–30 days prior).<br>• <strong>Voting</strong>: Election Day is the first Tuesday after the first Monday in November.<br>• <strong>Counting</strong>: Official results take days to weeks; media 'calls' are projections.<br>• <strong>Certification</strong>: States certify results before the Electoral College meets in December.<br><br>For specific questions about your state's election rules, visit <a href='https://vote.gov' target='_blank'>vote.gov</a> or your state's official election authority website." }
};

const ML_DATA = [
  { icon:"🔮", title:"Election Outcome Prediction", color:"#7c3aed", tag:"Forecasting",
    summary:"ML models ingest polls, economic indicators, historical voting patterns, and demographics to forecast winners weeks before Election Day.",
    points:["Random Forest & gradient boosting models analyse thousands of variables","Ensemble methods combine multiple forecasters to reduce error","Models are back-tested on past elections to validate accuracy","Uncertainty ranges are shown as probability distributions, not just a single winner"],
    risk:"Overconfident predictions can suppress voter turnout if people assume the winner is already decided.",
    example:"In 2020, ML models predicted Biden's win in Pennsylvania and Arizona 72+ hours before final counts." },
  { icon:"🕵️", title:"Voter Fraud Detection", color:"#0ea5e9", tag:"Security",
    summary:"Anomaly detection algorithms flag suspicious voting patterns, duplicate registrations, and irregular ballot submissions in real time.",
    points:["Graph neural networks detect coordinated inauthentic registration clusters","Signature verification models compare mail-in ballots to registration records","Time-series models flag precincts with turnout deviating from historical norms","NLP scans social media for coordinated disinformation campaigns"],
    risk:"False positives can wrongly flag legitimate voters, disproportionately affecting minority communities.",
    example:"Several U.S. states use ML signature-matching to verify mail-in ballots, reducing manual review by up to 80%." },
  { icon:"📰", title:"Sentiment & Disinformation Analysis", color:"#f59e0b", tag:"NLP",
    summary:"Natural language processing models monitor social media, news, and ads to detect sentiment shifts and flag potential disinformation.",
    points:["BERT & GPT-based classifiers detect misleading headlines and deepfakes","Sentiment analysis tracks real-time public opinion across demographics","Bot detection identifies inauthentic amplification of political content","Claim-verification pipelines cross-reference statements with fact-check databases"],
    risk:"ML models can be gamed by bad actors who craft content specifically to evade classifiers.",
    example:"Meta uses ML classifiers to flag election misinformation in 50+ languages ahead of major elections." },
  { icon:"📊", title:"Voter Turnout Modeling", color:"#10b981", tag:"Prediction",
    summary:"Campaigns and NGOs use ML to predict which eligible voters are likely to vote, and personalise outreach to maximise participation.",
    points:["Logistic regression & neural networks score each voter on turnout likelihood","Features include age, past voting history, location, and registration date","Models target low-propensity voters for door-knocking and phone-bank campaigns","A/B testing refines messaging based on real response rates"],
    risk:"Micro-targeting can suppress turnout in opposing demographics through negative messaging.",
    example:"Obama's 2012 campaign pioneered large-scale voter propensity modelling, helping millions of unlikely voters participate." },
  { icon:"🗺️", title:"Redistricting & Gerrymandering Analysis", color:"#ec4899", tag:"Geography",
    summary:"Computational geometry and optimisation algorithms help draw fair district boundaries — and detect when they've been drawn unfairly.",
    points:["Markov chain Monte Carlo simulations generate thousands of valid district maps","Efficiency gap metric quantifies how wasted votes favour one party","ML compares proposed maps to the ensemble to detect statistical outliers","GIS data combines census demographics with historical vote data"],
    risk:"The same tools can be weaponised to draw maximally gerrymandered districts more efficiently.",
    example:"In 2019, the Supreme Court used computational redistricting analysis as evidence in partisan gerrymandering cases." },
  { icon:"🎥", title:"Deepfake & Synthetic Media Detection", color:"#f43f5e", tag:"AI Safety",
    summary:"Computer vision models detect AI-generated audio and video of candidates saying things they never said.",
    points:["CNN and Vision Transformer models detect pixel-level inconsistencies","Audio models analyse vocal spectrograms for signs of voice cloning","Blockchain-based content provenance tracks origin and edits of media files","Real-time browser extensions warn users of suspected synthetic content"],
    risk:"As detection models improve, generation models adapt — making this an ongoing arms race.",
    example:"In the 2024 election cycle, multiple deepfake audio clips were detected and flagged within hours of publication." }
];

const COUNTRIES_DATA = {
  "Americas": [
    { flag:"🇺🇸", name:"United States", system:"Federal Republic", type:"Presidential", cycle:"4 years", method:"Electoral College", fact:"One of the few democracies to use an Electoral College rather than a direct popular vote for its president.", turnout:"~55–66%" },
    { flag:"🇨🇦", name:"Canada", system:"Federal Parliamentary", type:"Parliamentary", cycle:"Up to 5 years", method:"First-Past-The-Post", fact:"Canada's 338 ridings each elect one MP. The party winning the most seats forms the government.", turnout:"~62–68%" },
    { flag:"🇧🇷", name:"Brazil", system:"Federal Republic", type:"Presidential", cycle:"4 years", method:"Two-Round System", fact:"Voting is compulsory in Brazil for citizens aged 18–70. Turnout regularly exceeds 79%.", turnout:"~79–80%" },
    { flag:"🇲🇽", name:"Mexico", system:"Federal Republic", type:"Presidential", cycle:"6 years", method:"Direct Popular Vote", fact:"Mexico's president cannot be re-elected — ever. One six-year term is the constitutional limit.", turnout:"~52–63%" }
  ],
  "Europe": [
    { flag:"🇬🇧", name:"United Kingdom", system:"Constitutional Monarchy", type:"Parliamentary", cycle:"Up to 5 years", method:"First-Past-The-Post", fact:"650 constituencies each elect one MP. The Prime Minister is not directly elected — they lead the majority party.", turnout:"~67–69%" },
    { flag:"🇩🇪", name:"Germany", system:"Federal Republic", type:"Parliamentary", cycle:"4 years", method:"Mixed-Member Proportional", fact:"Voters cast two ballots — one for a local candidate and one for a party — producing a broadly proportional parliament.", turnout:"~76–79%" },
    { flag:"🇫🇷", name:"France", system:"Semi-Presidential Republic", type:"Semi-Presidential", cycle:"5 years", method:"Two-Round Runoff", fact:"If no candidate wins 50%+ in round one, the top two face a runoff. French presidents also hold significant executive power.", turnout:"~72–80%" },
    { flag:"🇸🇪", name:"Sweden", system:"Constitutional Monarchy", type:"Parliamentary", cycle:"4 years", method:"Proportional Representation", fact:"Sweden uses party-list PR. Parties need at least 4% of the national vote to enter parliament.", turnout:"~82–87%" }
  ],
  "Asia": [
    { flag:"🇮🇳", name:"India", system:"Federal Republic", type:"Parliamentary", cycle:"5 years", method:"First-Past-The-Post", fact:"The world's largest democracy with ~970 million eligible voters. Elections span multiple phases over several weeks.", turnout:"~67–68%" },
    { flag:"🇯🇵", name:"Japan", system:"Constitutional Monarchy", type:"Parliamentary", cycle:"4 years", method:"Mixed: FPTP + PR", fact:"Japan's lower house combines single-member districts with proportional representation party lists.", turnout:"~52–54%" },
    { flag:"🇰🇷", name:"South Korea", system:"Republic", type:"Presidential", cycle:"5 years", method:"Direct Popular Vote", fact:"South Korea's president serves a single five-year term with no possibility of re-election.", turnout:"~66–77%" },
    { flag:"🇸🇬", name:"Singapore", system:"Republic", type:"Parliamentary", cycle:"Up to 5 years", method:"FPTP & Group Representation", fact:"Group Representation Constituencies (GRC) require multi-member teams, ensuring minority representation in parliament.", turnout:"~93–96%" }
  ],
  "Africa": [
    { flag:"🇿🇦", name:"South Africa", system:"Republic", type:"Parliamentary", cycle:"5 years", method:"Party-List PR", fact:"Voters choose a party, not a candidate. Parties allocate seats to their ranked candidates after the vote.", turnout:"~66–73%" },
    { flag:"🇳🇬", name:"Nigeria", system:"Federal Republic", type:"Presidential", cycle:"4 years", method:"First-Past-The-Post", fact:"A winner must receive at least 25% of votes in at least 24 of the 36 states — a unique geographic spread requirement.", turnout:"~35–44%" },
    { flag:"🇬🇭", name:"Ghana", system:"Republic", type:"Presidential", cycle:"4 years", method:"Two-Round System", fact:"Regarded as one of Africa's most stable democracies with multiple peaceful transfers of power between rival parties.", turnout:"~79–85%" },
    { flag:"🇪🇹", name:"Ethiopia", system:"Federal Republic", type:"Parliamentary", cycle:"5 years", method:"First-Past-The-Post", fact:"Ethiopia's 2021 election saw 9,900+ candidates competing for 547 parliamentary seats — the most contested in the country's history.", turnout:"~90%" }
  ]
};

const ML_SCORES = {
  "Election Outcome Prediction":            { impact:88, accuracy:82, riskPct:55 },
  "Voter Fraud Detection":                  { impact:92, accuracy:76, riskPct:68 },
  "Sentiment & Disinformation Analysis":    { impact:85, accuracy:71, riskPct:62 },
  "Voter Turnout Modeling":                 { impact:79, accuracy:84, riskPct:58 },
  "Redistricting & Gerrymandering Analysis":{ impact:73, accuracy:90, riskPct:72 },
  "Deepfake & Synthetic Media Detection":   { impact:95, accuracy:68, riskPct:80 }
};

const COUNTRY_EXTRAS = {
  "United States": { voteAge:18, compulsory:false, turnoutNum:61, recentElection:2024 },
  "Canada":        { voteAge:18, compulsory:false, turnoutNum:65, recentElection:2025 },
  "Brazil":        { voteAge:16, compulsory:true,  turnoutNum:79, recentElection:2022 },
  "Mexico":        { voteAge:18, compulsory:false, turnoutNum:57, recentElection:2024 },
  "United Kingdom":{ voteAge:18, compulsory:false, turnoutNum:68, recentElection:2024 },
  "Germany":       { voteAge:18, compulsory:false, turnoutNum:77, recentElection:2025 },
  "France":        { voteAge:18, compulsory:false, turnoutNum:76, recentElection:2024 },
  "Sweden":        { voteAge:18, compulsory:false, turnoutNum:84, recentElection:2022 },
  "India":         { voteAge:18, compulsory:false, turnoutNum:67, recentElection:2024 },
  "Japan":         { voteAge:18, compulsory:false, turnoutNum:53, recentElection:2024 },
  "South Korea":   { voteAge:18, compulsory:false, turnoutNum:77, recentElection:2024 },
  "Singapore":     { voteAge:21, compulsory:true,  turnoutNum:95, recentElection:2025 },
  "South Africa":  { voteAge:18, compulsory:false, turnoutNum:66, recentElection:2024 },
  "Nigeria":       { voteAge:18, compulsory:false, turnoutNum:40, recentElection:2023 },
  "Ghana":         { voteAge:18, compulsory:false, turnoutNum:82, recentElection:2024 },
  "Ethiopia":      { voteAge:18, compulsory:false, turnoutNum:90, recentElection:2021 }
};

