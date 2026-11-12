# WayaX UI handoff: mobile app and web

UI only. This covers what the screens look like, what they say, and how they react to plan state. Backend, payments and APIs are out of scope; where the UI depends on backend data it is called out as **Backend sends**.

Date: 12 Nov 2026 · Repo: `nkrde/wayax-store` (branch `main`)

## 1. Links

| What | Link |
|---|---|
| Store (download, links) | https://wayax-store.netlify.app |
| Mobile app (prototype) | https://wayax-store.netlify.app/preview.html |
| Web app (prototype) | https://wayax-store.netlify.app/web/index.html |
| Demo flows (flow map beside the live mobile app) | https://wayax-store.netlify.app/demo.html |
| Slides: WayaX, the full app (flow maps for every screen) | https://claude.ai/artifact/353HtqzAbp51ma3yqbG79t |
| Slides: AI Usage as a Battery (usage model detail) | https://claude.ai/artifact/VbVyYgmqwzTfrqmS4HmwE5 |
| Figma: ads (Latest performance, 4 sizes, light and dark) | Waya-Apps file, frames "Latest performance / Dark" and "/ Light" |

The same site also deploys to Vercel (team Way) on every push once Vercel Authentication is turned off.

**How to test any state:** both apps have a "Plan state" demo menu (mobile: menu sheet > Plan state; web: "Plan state" button bottom right). It jumps to every plan state listed in section 5, plus "move to the next day" and "Monday push".

## 2. Files

| File | What it is |
|---|---|
| `preview.html` | Whole mobile app: screens, styles and script in one file |
| `sw.js` | Service worker. Bump `V` on every mobile change so installed copies refresh |
| `web/index.html` | Web app shell: sidebar, chat, third-screen panel, menu pages |
| `web/rsx.css` | Mobile screen styles scoped under `.rsx`, so web can host mobile screens (research, plan pages, About) |
| `web/plan.js`, `web/plan.css` | Web plans and AI usage: sidebar widget, banner, toast, sheets, plan pages |
| `index.html` | Store page |
| `demo.html` | Demo flows page (flow map + live phone) |
| `updates/latest.json`, `updates/history.json` | APK version info the store and app read |
| `assets/` | All icons, images and fonts used by both apps |

## 3. Design basics

**Type:** Sora for headings and numbers, Inter for body and UI.

**Colours used across both apps**

| Use | Hex |
|---|---|
| Ink / dark buttons | `#1C1C1E`, text `#171829` |
| Muted text | `#5F6680`, `#9AA0AD` |
| Waya purple (primary, rings, chips) | `#A05EC8`, light `#ECD3FD` |
| Waya gradient (buttons, CTA) | `#7065FB` to `#A05EC8` |
| Card outline gradient | `#8EC5FC` to `#B98CF5` to `#E9A0D0` to `#F6B98A` |
| Top-up teal | `#19B7AC`, light `#CBF5EF` |
| Limit amber | `#EDB168`, light `#FAE6D0` |
| Light banner | bg `#FFF7EC`, border `#FDE4C0`, text `#7A4A12` |
| Gains / losses | `#16A34A` / `#E5484D` |

**Toast:** dark pill `#1C1C1E`, white text, green tick, close ✕, top of screen, hides after 3.6 s or on any tap outside.
**Banner:** sits just above the ask bar. Light (amber) for warnings, dark for limits. Dark banners have one primary button and ✕.
**Sheet:** bottom sheet on mobile, centred popup on web. Title, one line of copy, controls, one primary black button, "Not now".

## 4. Screens

### Mobile (`preview.html`)
- **Getting in:** intro video > user type (New user, Migrated, Pro) > new user sign-up: Name, Email, Mobile, OTP, Age, City, Gender. Subscriber log in: Mobile, OTP.
- **Home:** two tabs in the top pill, **WayaX AI** and **In House**. Swipe right on WayaX AI opens the menu; swipe left on In House opens notifications.
- **WayaX AI:** greeting, ask bar (+ attach, effort Low/Medium/High), skill tags on the ask bar, saved prompts panel with bookmarks, bottom bar: Skills, History (chats), New chat, Watch To Buy, Portfolio. Waya Score pill opens the Waya Score popup.
- **In House:** Open / Exited calls, Today's and This week's recommendations, Free Recommendations, Market Trend, FII/DII chart, Content Bytes, Swing Trades, Baskets (detail with Overview / Constituents & Weights / Methodology), PMS. Non-subscribers see live calls blurred with "Unlock all features".
- **Menu:** plan card, AI usage row, Profile, Waya Score, Waya Apps, About, FAQs, Privacy, Terms, Logout.
- **Plan pages:** Explore plans, Active plan, AI Usage (with per-chat usage sheet), Top-ups sheet, Subscribe sheet.

### Web (`web/index.html`)
- Left sidebar (collapsible): new chat, skills, watch, portfolio, history, research, account. The AI usage ring sits at the bottom; account opens a dark drop-up (Edit profile, Waya Score Metrics, Apps, About, FAQs, Privacy, Terms, Logout).
- Centre: chat with the same ask bar as mobile (placeholder "Ask WayaX about stocks, entry zones, F&Q, portfolio analysis, track record.."), language picker (English, Hindi, Gujarati, Marathi, Punjabi, Kannada, Tamil, Telugu), effort menu, Explore Skills / WayaX Research / Saved Prompts chips.
- Third-screen panel (opens beside the chat): Skills, Watch To Buy, Portfolio, History, In House Research, AI Usage, Active plan, Explore plans, and menu pages (About, FAQs, Privacy, Terms, Waya Apps, Profile).
- The whole UI scales with the window: `z = clamp(min(width/1920, height/950), 0.8, 1.2)`.
- Combo plan page shows "Your plan covers FnO and MCX too · Check Waya Apps ›", which opens the Waya Apps page.

## 5. AI usage and plans (the main change in this round)

**Rule:** the UI only ever shows a **percentage**. Question counts and the daily rule appear only in toasts, banners and sheets.

### User types
| Type | What the ring shows | Resets |
|---|---|---|
| Free access (non-subscriber) | % of today's free use | Midnight |
| Pro / Migrated (Quarterly, Yearly, Combo) | % of this week | Monday 9:00 AM |
| Lapsed / no plan | No % ("See Plans") | n/a |

**Backend sends:** plan type, % used, and which message event to show. The 3-a-day count and the 7-day cycle are tracked by the backend only. The app never shows "Day X of 7".

### Free access: one day
| Moment | Ring | UI |
|---|---|---|
| First open | 0% | Toast: "Welcome · you get 3 free AI questions each day" |
| 1st answer | 33% | Nothing |
| 2nd answer | 67% | Light banner: "1 free question left today" · Subscribe |
| 3rd answer | 100% | Toast and dark banner: "You've used today's 3 free questions" / "Subscribe to Waya Pro for unlimited questions." · Subscribe |
| Asks again | 100% | Ask is blocked, subscribe sheet opens |
| Midnight | 0% | Toast: "You get 3 free questions today · or subscribe to Waya for unlimited" |
| Day 7, 3rd answer | 100% | Toast: "That was your last free question · subscribe to Waya Pro for unlimited questions" |
| Cycle over | none | Toast and dark banner: "Your free questions are over." / "Subscribe to Waya Pro for unlimited questions." Every ask opens the sheet |

### Subscribe sheet (one sheet, three headlines)
| Opened from | Title | Line |
|---|---|---|
| Menu / Subscribe | Get unlimited questions | Subscribe to Waya Pro, Yearly or Quarterly. |
| Today's 3 used | You've used today's 3 free questions | Subscribe to Waya Pro for unlimited questions. |
| Cycle over | Your free questions are over | Subscribe to Waya Pro, Yearly or Quarterly, for unlimited questions. |

Controls: Quarterly / Yearly switch, price (₹4,500 / ₹6,500), ticks (All live research Recommendations · Unlimited WayaX AI questions · Portfolio review, models, Watch To Buy), black button "Subscribe · ₹price", "Not now".

### Pro / Migrated
| Moment | UI |
|---|---|
| Migrated user's first open | Sheet: "Your plan now includes WayaX AI" with plan, Believer till, WayaX AI weekly limit, next renewal, "Try WayaX AI" |
| Weekly limit hit | Dark banner: "Weekly limit reached." "Resets Mon 9:00 AM." · Buy top-ups |
| Buy top-up | Toast: "+200% top-up added · used after your weekly limit" |
| Monday 9:00 | Push: "Your weekly AI usage is reset. You're back to 100% for this week." Then toast "Welcome back · your weekly allowance is fresh" |
| Subscribes or renews | Toast: "You're a Waya Believer · Yearly plan is active" / "Welcome back · your weekly AI usage is reset to 100%" |
| Plan ends | Toast: "Your Pro plan has ended · top-ups saved till 26 Mar" |

### Top-ups (same on mobile, web and sheets)
| Pack | Price | Label | Badge |
|---|---|---|---|
| +67% | ₹99 | Base pack | |
| +200% | ₹199 | 3× the ₹99 pack | Most popular · Save 33% |
| +670% | ₹499 | 10× the ₹99 pack | Save 50% |

Under the tiles: "↻ Anything left over moves to your next plan or top-up." Toggle: "Use automatically at limit". Valid 3 months, used only after the weekly limit.

### Where the % shows
- Mobile: ring around the menu button (appears after the first answer), menu AI usage row, Active plan ring, AI Usage page ("USED TODAY" for free, "OF TOTAL USED" for Pro).
- Web: sidebar ring (collapsed) and usage card (open sidebar), AI Usage hero card. For free users the hero card reads "Free usage resets every midnight." with a black **Subscribe to Waya Pro** button.
- Colour of the ring: purple normal, amber at limit, teal when a top-up is in use.

## 6. Other toasts in the app
"Profile saved." · "Changes not saved." · "Chat pinned to the top." · "Chat unpinned." · "Chat renamed." · "Chat deleted." · "You've been logged out." · "A new OTP is on its way." · "Location set to Mumbai, India." · "Upload from your broker's holdings statement is coming soon." · "Changing your photo is coming soon." · "Support chat is coming soon. Write to us at support@thewaya.com."

## 7. Other updates this round
- **Research dashboard (web and mobile):** redesigned Free Recommendations cards, Market Trend, FII/DII chart card (more inner space, taller), Content Bytes (88×88 thumbnails).
- **Web History** matches the Skills page layout with a "+ New Chat" footer; scrollbar sits outside the list box.
- **Web Watch To Buy and Portfolio** cards use the gradient outline and scale with the window.
- **Web About page** tuned for the side panel: smaller type, compact mission cards, Brand Ethics as cards, footer links and social buttons in rows, coverages in two columns.
- **Web Active plan page** no longer gets cut off (a saved-prompts style was clashing; now scoped to `.ppanel`).
- **Store page** trimmed to: app info, Download APK, Mobile version, Web version, WayaX demo flows, iPhone steps, What's new, QR.

## 8. Open items
1. **APK:** store still serves v1.6.19. A new APK needs the original signing key, otherwise users must uninstall first.
2. **Vercel:** turn off Vercel Authentication and share the production domain; then point the store QR and the app's update check at it and retire Netlify.
3. **Backend events** needed for the free cycle: welcome, 1 left, day limit, next day, last question, cycle over, plan ended, Monday reset.
4. Older slides in "AI Usage as a Battery" still show the earlier "Day X of 7" design; the new flow-map deck is the current reference.
