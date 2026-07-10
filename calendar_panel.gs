// ============================================================
//  CALENDAR UPDATE PANEL — Google Apps Script
//  Reads your Google Calendar automatically and displays:
//    • Events added or changed in the last 7 days  ("Recent changes")
//    • All upcoming events for the next 4 weeks
//
//  HOW TO DEPLOY:
//  1. Go to script.google.com → New project → paste this whole file
//  2. Click Services (+) → add "Google Calendar API" (v3)
//  3. Click Deploy → New deployment → Type: Web app
//     - Execute as: Me
//     - Who has access: Anyone  (so the teacher can see it)
//  4. Copy the Web app URL
//  5. In your Google Site → Insert → Embed → By URL → paste the URL
// ============================================================

// ── CONFIG — edit these to match your setup ─────────────────
const CALENDAR_ID   = "primary";          // "primary" = your main Google Calendar
                                           // OR paste a specific calendar ID
const UPCOMING_DAYS = 28;                  // how many days ahead to show
const CHANGED_DAYS  = 7;                   // flag events modified within this many days
const STUDENT_NAME  = "Tam";              // shown in the panel header
// ────────────────────────────────────────────────────────────

function doGet() {
  const now     = new Date();
  const future  = new Date(now.getTime() + UPCOMING_DAYS * 24 * 60 * 60 * 1000);
  const recentCutoff = new Date(now.getTime() - CHANGED_DAYS * 24 * 60 * 60 * 1000);

  // ── Fetch events via Calendar API (gives us the `updated` field) ──
  let recentlyChanged = [];
  let upcoming        = [];

  try {
    const options = {
      timeMin:      now.toISOString(),
      timeMax:      future.toISOString(),
      singleEvents: true,
      orderBy:      "startTime",
      maxResults:   50,
    };
    const response = Calendar.Events.list(CALENDAR_ID, options);
    const events   = response.items || [];

    upcoming = events;

    // Flag events whose `updated` timestamp is within the cutoff
    recentlyChanged = events.filter(ev => {
      const updated = ev.updated ? new Date(ev.updated) : null;
      return updated && updated >= recentCutoff;
    });

    // Also catch events that START in the past but were updated recently
    // (e.g. a past event that got rescheduled into the future)
    const pastOptions = {
      timeMin:      recentCutoff.toISOString(),
      timeMax:      now.toISOString(),
      singleEvents: true,
      orderBy:      "updated",
      maxResults:   20,
    };
    const pastResponse = Calendar.Events.list(CALENDAR_ID, pastOptions);
    const pastEvents   = (pastResponse.items || []).filter(ev => {
      const updated = ev.updated ? new Date(ev.updated) : null;
      return updated && updated >= recentCutoff;
    });
    // Merge without duplicates
    pastEvents.forEach(pe => {
      if (!recentlyChanged.find(e => e.id === pe.id)) {
        recentlyChanged.push(pe);
      }
    });

  } catch (e) {
    return HtmlService.createHtmlOutput(errorHtml(e.message));
  }

  return HtmlService.createHtmlOutput(buildHtml(recentlyChanged, upcoming, now));
}

// ── HTML builder ─────────────────────────────────────────────
function buildHtml(changed, upcoming, now) {
  const updatedAt = formatTime(now);

  function eventRow(ev, highlight) {
    const start   = ev.start?.dateTime || ev.start?.date;
    const title   = ev.summary || "(No title)";
    const desc    = ev.description || "";
    const loc     = ev.location || "";
    const startDt = start ? new Date(start) : null;
    const isAllDay = !ev.start?.dateTime;

    const dateStr = startDt
      ? startDt.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })
      : "?";
    const timeStr = (!isAllDay && startDt)
      ? startDt.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })
      : "All day";

    const isToday  = startDt && startDt.toDateString() === now.toDateString();
    const isTomorrow = startDt && new Date(now.getTime() + 86400000).toDateString() === startDt.toDateString();

    const badge = highlight
      ? `<span class="badge changed">Recently changed</span>`
      : isToday
        ? `<span class="badge today">Today</span>`
        : isTomorrow
          ? `<span class="badge tomorrow">Tomorrow</span>`
          : "";

    const descHtml = desc ? `<div class="ev-desc">${escHtml(desc)}</div>` : "";
    const locHtml  = loc  ? `<div class="ev-loc">📍 ${escHtml(loc)}</div>` : "";

    return `
      <div class="ev-row ${highlight ? "ev-highlight" : ""}">
        <div class="ev-date">
          <span class="ev-day">${dateStr}</span>
          <span class="ev-time">${timeStr}</span>
        </div>
        <div class="ev-body">
          <div class="ev-title">${escHtml(title)} ${badge}</div>
          ${descHtml}${locHtml}
        </div>
      </div>`;
  }

  const changedHtml = changed.length
    ? changed.map(ev => eventRow(ev, true)).join("")
    : `<div class="empty">No changes in the last ${CHANGED_DAYS} days</div>`;

  const upcomingHtml = upcoming.length
    ? upcoming.map(ev => eventRow(ev, false)).join("")
    : `<div class="empty">No upcoming events in the next ${UPCOMING_DAYS} days</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, sans-serif;
    background: #fff;
    color: #111827;
    font-size: 13px;
    padding: 16px;
  }
  .panel-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 16px; padding-bottom: 10px;
    border-bottom: 2px solid #F3F4F6;
  }
  .panel-title { font-size: 15px; font-weight: 700; color: #1B5E34; }
  .panel-sub   { font-size: 11px; color: #9CA3AF; margin-top: 2px; }
  .refresh-btn {
    font-size: 11px; color: #6B7280; background: #F3F4F6;
    border: none; border-radius: 6px; padding: 4px 10px;
    cursor: pointer;
  }
  .refresh-btn:hover { background: #E5E7EB; }

  .section-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; color: #9CA3AF;
    margin: 16px 0 8px;
  }
  .ev-row {
    display: flex; gap: 10px;
    padding: 10px 10px;
    border-radius: 8px;
    margin-bottom: 6px;
    border: 1px solid #F3F4F6;
    background: #FAFAFA;
  }
  .ev-highlight {
    background: #FFF7ED;
    border-color: #FED7AA;
  }
  .ev-date {
    flex-shrink: 0; width: 78px;
    display: flex; flex-direction: column; gap: 2px;
  }
  .ev-day  { font-size: 12px; font-weight: 600; color: #374151; }
  .ev-time { font-size: 11px; color: #9CA3AF; }
  .ev-body { flex: 1; min-width: 0; }
  .ev-title {
    font-size: 13px; font-weight: 600; color: #111827;
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  }
  .ev-desc {
    font-size: 12px; color: #6B7280; margin-top: 3px;
    white-space: pre-wrap; line-height: 1.5;
  }
  .ev-loc { font-size: 11px; color: #9CA3AF; margin-top: 2px; }

  .badge {
    font-size: 10px; font-weight: 700; border-radius: 10px;
    padding: 1px 7px; white-space: nowrap;
  }
  .badge.changed  { background: #FEF3C7; color: #92400E; }
  .badge.today    { background: #D1FAE5; color: #065F46; }
  .badge.tomorrow { background: #DBEAFE; color: #1D4ED8; }

  .empty { font-size: 12px; color: #9CA3AF; padding: 8px 0; font-style: italic; }
  .divider { height: 1px; background: #F3F4F6; margin: 12px 0; }
  .footer { font-size: 11px; color: #D1D5DB; margin-top: 16px; text-align: right; }
</style>
</head>
<body>
<div class="panel-header">
  <div>
    <div class="panel-title">📅 Calendar Updates</div>
    <div class="panel-sub">${STUDENT_NAME}'s schedule — auto-synced</div>
  </div>
  <button class="refresh-btn" onclick="location.reload()">↻ Refresh</button>
</div>

<div class="section-label">🔔 Recent changes (last ${CHANGED_DAYS} days)</div>
${changedHtml}

<div class="divider"></div>

<div class="section-label">📆 Upcoming — next ${UPCOMING_DAYS} days</div>
${upcomingHtml}

<div class="footer">Auto-updated · Last loaded: ${updatedAt}</div>
</body>
</html>`;
}

// ── Helpers ──────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatTime(dt) {
  return dt.toLocaleString("en-AU", {
    day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit"
  });
}

function errorHtml(msg) {
  return `<div style="font-family:sans-serif;padding:16px;color:#991B1B;background:#FEF2F2;border-radius:8px;">
    <b>Calendar panel error</b><br/><small>${escHtml(msg)}</small><br/>
    <small style="color:#6B7280;margin-top:8px;display:block">
      Make sure you added the Google Calendar API advanced service (Services → Google Calendar API v3).
    </small>
  </div>`;
}
