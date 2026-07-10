// ─── PASTE THIS INTO Code.gs IN YOUR APPS SCRIPT PROJECT ───────────────────

// ✏️ FILTER — only show calendars whose name contains one of these words (case-insensitive)
// Leave this empty [] to show ALL calendars
const SHOW_ONLY = [
  "My",
  // add more keywords if needed, e.g. "Grade 9", "English"
];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Calendar Changes')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getCalendarData() {
  const now       = new Date();
  const lookback  = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);  // 5 days ago
  const lookahead = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks ahead

  const changes  = [];
  const upcoming = [];

  const calendars = CalendarApp.getAllCalendars();

  calendars.forEach(function(cal) {
    // Skip calendars that are hidden or declined
    if (!cal.isSelected()) return;

    // Filter: skip calendars that don't contain any of the SHOW_ONLY keywords
    if (SHOW_ONLY.length > 0) {
      const name = cal.getName().toLowerCase();
      const match = SHOW_ONLY.some(function(kw) { return name.includes(kw.toLowerCase()); });
      if (!match) return;
    }

    var events = cal.getEvents(now, lookahead);

    events.forEach(function(event) {
      var created = event.getDateCreated();
      var updated = event.getLastUpdated();
      var start   = event.getStartTime();
      var end     = event.getEndTime();
      var allDay  = event.isAllDayEvent();

      var isNew     = created >= lookback;
      var isChanged = !isNew && (updated >= lookback);

      var item = {
        title:     event.getTitle(),
        start:     start.getTime(),
        end:       end.getTime(),
        allDay:    allDay,
        calendar:  cal.getName(),
        isNew:     isNew,
        isChanged: isChanged,
        description: event.getDescription() || '',
      };

      upcoming.push(item);
      if (isNew || isChanged) changes.push(item);
    });
  });

  // Sort both lists by start time
  changes.sort(function(a, b)  { return a.start - b.start; });
  upcoming.sort(function(a, b) { return a.start - b.start; });

  return JSON.stringify({ changes: changes, upcoming: upcoming, asOf: now.getTime() });
}
