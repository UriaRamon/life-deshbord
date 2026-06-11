const storageKey = "life-dashboard-v2";
const oldStorageKey = "life-dashboard-v1";
const planStartIso = "2026-06-14";
const runSessionTarget = 2;
const strengthSessionTarget = 2;
const spanishDailyTarget = 10;

const today = new Date();
const todayIso = toIsoDate(today);

const strengthA = [
  "Dips: 4 sets, stop 1-2 reps before failure",
  "Bulgarian Split Squat: 3 sets per leg, 10-12 reps",
  "TRX Chest Press: 3 sets, 10-15 reps",
  "Push-ups: 3 sets, stop 1-2 reps before failure",
  "Plank: 3 sets, 45-60 sec"
];

const strengthB = [
  "Pull-ups: 4 sets, stop 1-2 reps before failure",
  "TRX Row: 4 sets, 8-15 reps",
  "TRX Face Pull: 3 sets, 12-15 reps",
  "TRX Biceps Curl: 3 sets, 8-12 reps",
  "Hanging Knee Raises: 3 sets, 10-15 reps"
];

const runningWeeks = [
  {
    week: 1,
    quality: {
      warmup: "10 min easy run",
      main: "4 x 800m at 4:35-4:45 min/km",
      recovery: "2 min easy jog or walk between intervals",
      cooldown: "5-10 min easy run"
    },
    easy: "7 km easy at 5:15-5:40 min/km"
  },
  {
    week: 2,
    quality: {
      warmup: "10 min easy run",
      main: "4 x 800m at 4:35-4:45 min/km",
      recovery: "2 min easy jog or walk between intervals",
      cooldown: "5-10 min easy run"
    },
    easy: "8 km easy at 5:15-5:40 min/km"
  },
  {
    week: 3,
    quality: {
      warmup: "10 min easy run",
      main: "5 x 1000m at 4:35-4:45 min/km",
      recovery: "2 min easy jog or walk between intervals",
      cooldown: "5-10 min easy run"
    },
    easy: "9 km easy at 5:15-5:40 min/km"
  },
  {
    week: 4,
    quality: {
      warmup: "10 min easy run",
      main: "5 x 1000m at 4:35-4:45 min/km",
      recovery: "2 min easy jog or walk between intervals",
      cooldown: "5-10 min easy run"
    },
    easy: "10 km easy at 5:15-5:40 min/km"
  },
  {
    week: 5,
    quality: {
      warmup: "10 min easy run",
      main: "6 x 1000m at 4:30-4:40 min/km",
      recovery: "2 min easy jog or walk between intervals",
      cooldown: "5-10 min easy run"
    },
    easy: "11 km easy at 5:15-5:40 min/km"
  },
  {
    week: 6,
    quality: {
      warmup: "10 min easy run",
      main: "6 x 1000m at 4:30-4:40 min/km",
      recovery: "2 min easy jog or walk between intervals",
      cooldown: "5-10 min easy run"
    },
    easy: "12 km easy at 5:15-5:40 min/km"
  }
];

const trainingPlan = {
  startDate: planStartIso,
  currentFitness: [
    "Half marathon in February at 4:56 min/km",
    "Recent running has been limited",
    "Most recent run: 5 km at 5:11 min/km",
    "Plan is based on current fitness, not February peak fitness"
  ],
  goals: {
    priority: "Rebuild consistency and safely return to 20-25 km per week",
    shortTerm: "10 km at 4:45 min/km",
    longTerm: "Tel Aviv Half Marathon at 4:45 min/km",
    strength: "Gain muscle mass",
    spanish: "Hold conversations with local workers in Spain"
  },
  weeks: buildTrainingWeeks()
};

const sampleData = {
  tasks: [
    { id: createId(), title: "Plan this week's runs", due: todayIso, priority: "High", done: false },
    { id: createId(), title: "Review Spanish phrases", due: todayIso, priority: "Normal", done: false }
  ],
  shopping: [
    { id: createId(), name: "Greek yogurt", qty: "2", category: "Groceries", done: false },
    { id: createId(), name: "Coffee", qty: "1 bag", category: "Groceries", done: false }
  ],
  workouts: [],
  spanish: [],
  plan: clone(trainingPlan),
  planStatus: {},
  adaptiveReviews: []
};

let state = normalizeState(loadState());

const pageTitle = document.querySelector("#pageTitle");
const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

document.querySelector("#todayLabel").textContent = today.toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric"
});

document.querySelector("#taskDue").value = todayIso;
document.querySelector("#workoutDate").value = todayIso;
document.querySelector("#spanishDate").value = todayIso;

navLinks.forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.jump));
});

document.querySelector("#resetDemoButton")?.addEventListener("click", () => {
  state = normalizeState(clone(sampleData));
  saveState();
  render();
});

document.querySelector("#taskForm").addEventListener("submit", (event) => {
  event.preventDefault();
  state.tasks.unshift({
    id: createId(),
    title: document.querySelector("#taskTitle").value.trim(),
    due: document.querySelector("#taskDue").value,
    priority: document.querySelector("#taskPriority").value,
    done: false
  });
  event.target.reset();
  document.querySelector("#taskDue").value = todayIso;
  saveState();
  render();
});

document.querySelector("#shoppingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  state.shopping.unshift({
    id: createId(),
    name: document.querySelector("#shoppingName").value.trim(),
    qty: document.querySelector("#shoppingQty").value.trim(),
    category: document.querySelector("#shoppingCategory").value,
    done: false
  });
  event.target.reset();
  saveState();
  render();
});

document.querySelector("#workoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const type = document.querySelector("#workoutType").value;
  state.workouts.unshift({
    id: createId(),
    type,
    date: document.querySelector("#workoutDate").value,
    distance: type === "Running" ? Number(document.querySelector("#workoutDistance").value || 0) : 0,
    notes: document.querySelector("#workoutPace").value.trim()
  });
  event.target.reset();
  document.querySelector("#workoutDate").value = todayIso;
  saveState();
  render();
});

document.querySelector("#spanishForm").addEventListener("submit", (event) => {
  event.preventDefault();
  state.spanish.unshift({
    id: createId(),
    date: document.querySelector("#spanishDate").value,
    minutes: Number(document.querySelector("#spanishMinutes").value),
    topic: document.querySelector("#spanishTopic").value.trim(),
    notes: document.querySelector("#spanishNotes").value.trim()
  });
  event.target.reset();
  document.querySelector("#spanishDate").value = todayIso;
  saveState();
  render();
});

document.querySelector("#adaptiveForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const review = {
    id: createId(),
    date: todayIso,
    difficulty: document.querySelector("#reviewDifficulty").value,
    completed: document.querySelector("#reviewCompleted").value,
    pullups: Number(document.querySelector("#reviewPullups").value),
    dips: Number(document.querySelector("#reviewDips").value),
    recent5k: document.querySelector("#review5k").value.trim(),
    pain: document.querySelector("#reviewPain").value.trim()
  };
  review.recommendations = buildRecommendations(review);
  state.adaptiveReviews.unshift(review);
  event.target.reset();
  saveState();
  render();
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (!target.matches("[data-toggle]")) return;

  const [collection, id] = target.dataset.toggle.split(":");
  const item = state[collection].find((entry) => entry.id === id);
  if (item) item.done = target.checked;
  saveState();
  render();
});

document.addEventListener("click", (event) => {
  const completeButton = event.target.closest("[data-complete-plan]");
  if (completeButton) {
    const id = completeButton.dataset.completePlan;
    const current = state.planStatus[id]?.completed;
    state.planStatus[id] = current
      ? { completed: false, completedAt: "" }
      : { completed: true, completedAt: todayIso };
    saveState();
    render();
    return;
  }

  const button = event.target.closest("[data-delete]");
  if (!button) return;

  const [collection, id] = button.dataset.delete.split(":");
  state[collection] = state[collection].filter((entry) => entry.id !== id);
  saveState();
  render();
});

document.querySelector("#workoutType").addEventListener("change", (event) => {
  const distance = document.querySelector("#workoutDistance");
  distance.disabled = event.target.value === "Strength";
  distance.placeholder = event.target.value === "Strength" ? "Not needed" : "Km";
});

render();

function loadState() {
  const saved = localStorage.getItem(storageKey) || localStorage.getItem(oldStorageKey);
  if (!saved) return clone(sampleData);

  try {
    return JSON.parse(saved);
  } catch {
    return clone(sampleData);
  }
}

function normalizeState(raw) {
  const next = { ...clone(sampleData), ...raw };
  next.tasks = Array.isArray(next.tasks) ? next.tasks : [];
  next.shopping = Array.isArray(next.shopping) ? next.shopping : [];
  next.workouts = Array.isArray(next.workouts) ? next.workouts : [];
  next.spanish = Array.isArray(next.spanish) ? next.spanish.map((entry) => ({
    ...entry,
    topic: entry.topic || entry.activity || entry.focus || "Spanish practice",
    notes: entry.notes || ""
  })) : [];
  next.plan = raw?.plan?.weeks ? raw.plan : clone(trainingPlan);
  next.planStatus = next.planStatus || {};
  next.adaptiveReviews = Array.isArray(next.adaptiveReviews) ? next.adaptiveReviews : [];
  return next;
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function showPage(pageId) {
  pages.forEach((page) => page.classList.toggle("active", page.id === pageId));
  navLinks.forEach((link) => link.classList.toggle("active", link.dataset.page === pageId));
  pageTitle.textContent = pageId === "dashboard"
    ? "What should I do today?"
    : pageId === "training"
      ? "Training Plan"
      : pageId.charAt(0).toUpperCase() + pageId.slice(1);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function render() {
  const openTasks = state.tasks.filter((task) => !task.done);
  const todayTasks = openTasks.filter((task) => task.due === todayIso);
  const shoppingLeft = state.shopping.filter((item) => !item.done);
  const weekItems = getThisWeekPlanItems();
  const runDone = countCompleted(weekItems, "Running");
  const strengthDone = countCompleted(weekItems, "Strength");
  const spanishMinutes = getSpanishMinutesThisWeek();
  const spanishMonthMinutes = getSpanishMinutesThisMonth();
  const streak = getSpanishStreak(state.spanish);

  setText("#runSessionCount", `${runDone}/${runSessionTarget}`);
  setText("#strengthSessionCount", `${strengthDone}/${strengthSessionTarget}`);
  setText("#spanishWeekMinutes", `${spanishMinutes} min`);
  setText("#spanishMonthMinutes", `${spanishMonthMinutes} min`);
  setText("#spanishStreak", `${streak} ${streak === 1 ? "day" : "days"}`);
  setText("#runningProgressLabel", `${runDone} / ${runSessionTarget} sessions`);
  setText("#strengthWeekSummary", `${strengthDone} / ${strengthSessionTarget} strength sessions completed`);
  setText("#spanishWeekSummary", `${spanishMinutes} Spanish minutes this week`);
  setText("#spanishMonthSummary", `${spanishMonthMinutes} Spanish minutes this month`);
  setText("#taskSummary", `${openTasks.length} open`);
  setText("#shoppingSummary", `${shoppingLeft.length} remaining`);
  setText("#fitnessSummary", `This week: ${runDone}/${runSessionTarget} runs, ${strengthDone}/${strengthSessionTarget} strength`);
  setText("#spanishSummary", `${streak} day streak - ${spanishMinutes} min this week`);
  setText("#trainingWeekLabel", getCurrentPlanWeekLabel());
  setText("#planProgressSummary", `${getCompletedPlanCount()} complete`);
  setText("#adaptiveDueLabel", getAdaptiveDueLabel());

  document.querySelector("#runningProgressBar").style.width = `${Math.min(100, (runDone / runSessionTarget) * 100)}%`;

  renderTodayPlan();
  renderWeeklyCalendar();
  renderTrainingPlanList();
  renderRecommendations();
  renderList("#todayTasks", todayTasks, renderTask, "No tasks due today.");
  renderList("#openTasks", openTasks.slice(0, 5), renderTask, "No open tasks.");
  renderList("#shoppingPreview", shoppingLeft.slice(0, 5), renderShoppingItem, "Shopping list is clear.");
  renderList("#taskList", state.tasks, renderTask, "No tasks yet.");
  renderList("#shoppingList", state.shopping, renderShoppingItem, "No shopping items yet.");
  renderList("#workoutList", state.workouts, renderWorkout, "No workouts logged yet.");
  renderList("#spanishList", state.spanish, renderSpanishPractice, "No Spanish practice logged yet.");
}

function renderTodayPlan() {
  const container = document.querySelector("#todayPlan");
  container.innerHTML = "";
  const overdue = getPlanItems().filter((item) => item.date < todayIso && !isPlanCompleted(item.id));
  const todayItems = getPlanItems().filter((item) => item.date === todayIso);
  const nextItems = getPlanItems().filter((item) => item.date > todayIso);
  const visible = todayItems.length ? todayItems : overdue.length ? overdue.slice(0, 1) : nextItems.slice(0, 1);
  const heading = document.createElement("div");
  heading.className = "today-answer";
  heading.textContent = todayItems.length
    ? "Do this today"
    : overdue.length
      ? "Catch up on this missed workout"
      : "Nothing scheduled today. Next workout";
  container.appendChild(heading);

  if (overdue.length > 1) {
    const overdueBox = document.createElement("div");
    overdueBox.className = "notice";
    overdueBox.textContent = `${overdue.length - 1} more planned workout${overdue.length === 2 ? " is" : "s are"} overdue.`;
    container.appendChild(overdueBox);
  }

  if (!visible.length) {
    container.innerHTML += `<div class="empty">No planned workout found.</div>`;
    return;
  }

  visible.forEach((item) => container.appendChild(renderPlanCard(item, true)));
}

function renderWeeklyCalendar() {
  const container = document.querySelector("#weeklyCalendar");
  container.innerHTML = "";
  const start = getWeekStart(today);
  const weekItems = getThisWeekPlanItems();

  for (let index = 0; index < 7; index += 1) {
    const date = addDays(start, index);
    const iso = toIsoDate(date);
    const dayItems = weekItems.filter((item) => item.date === iso);
    const spanishDone = state.spanish.some((entry) => entry.date === iso);
    const card = document.createElement("article");
    card.className = `calendar-day${iso === todayIso ? " today" : ""}`;
    card.innerHTML = `
      <div class="calendar-date">${date.toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}</div>
      <div class="calendar-items"></div>
    `;
    const list = card.querySelector(".calendar-items");
    if (!dayItems.length) list.innerHTML = `<span class="muted">No workout</span>`;
    dayItems.forEach((item) => {
      const status = getPlanStatusLabel(item);
      list.innerHTML += `<span class="${status.className}">${item.shortTitle}: ${status.label}</span>`;
    });
    list.innerHTML += `<span class="${spanishDone ? "status-done" : "status-open"}">Spanish 10 min</span>`;
    container.appendChild(card);
  }
}

function renderTrainingPlanList() {
  const container = document.querySelector("#trainingPlanList");
  container.innerHTML = "";
  const items = getPlanItems()
    .filter((item) => item.date >= addIsoDays(todayIso, -7) || !isPlanCompleted(item.id))
    .slice(0, 18);
  items.forEach((item) => container.appendChild(renderPlanCard(item, false)));
}

function renderPlanCard(item, compact) {
  const status = getPlanStatusLabel(item);
  const article = document.createElement("article");
  article.className = `plan-card ${status.className}`;
  const actionText = isPlanCompleted(item.id) ? "Undo completed" : "Mark workout complete";
  article.innerHTML = `
    <div class="plan-card-main">
      <div class="plan-card-top">
        <strong>${item.title}</strong>
        <span class="pill">${status.label}</span>
      </div>
      <div class="item-meta">${formatFullDate(item.date)} · ${item.category}</div>
      <div class="plan-details"></div>
    </div>
    <button class="secondary-button" type="button" data-complete-plan="${item.id}">
      ${compact ? actionText : isPlanCompleted(item.id) ? "Undo" : "Mark done"}
    </button>
  `;
  const details = article.querySelector(".plan-details");
  if (item.category === "Running" && item.kind === "Quality") {
    details.innerHTML = `
      <p><strong>Warm-up:</strong> ${item.details.warmup}</p>
      <p><strong>Main set:</strong> ${item.details.main}</p>
      <p><strong>Recovery:</strong> ${item.details.recovery}</p>
      <p><strong>Cool-down:</strong> ${item.details.cooldown}</p>
    `;
  } else if (Array.isArray(item.details)) {
    details.innerHTML = `<ul>${item.details.map((line) => `<li>${line}</li>`).join("")}</ul>`;
  } else {
    details.innerHTML = `<p>${item.details}</p>`;
  }
  if (compact) article.classList.add("featured-plan");
  return article;
}

function renderRecommendations() {
  const box = document.querySelector("#recommendationBox");
  const latest = state.adaptiveReviews[0];
  if (!latest) {
    box.innerHTML = `<div class="empty">No adaptive review completed yet.</div>`;
    return;
  }
  box.innerHTML = `
    <h4>Latest recommendations from ${formatFullDate(latest.date)}</h4>
    <ul>${latest.recommendations.map((item) => `<li>${item}</li>`).join("")}</ul>
    <p class="helper-text">These are recommendations only. Confirm changes before adjusting the plan.</p>
  `;
}

function renderList(selector, items, renderer, emptyText) {
  const container = document.querySelector(selector);
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = `<div class="empty">${emptyText}</div>`;
    return;
  }

  items.forEach((item) => container.appendChild(renderer(item)));
}

function renderTask(task) {
  return createItem({
    done: task.done,
    toggle: `tasks:${task.id}`,
    title: task.title,
    meta: `${task.priority}${task.due ? ` - Due ${formatDate(task.due)}` : ""}`,
    deleteRef: `tasks:${task.id}`
  });
}

function renderShoppingItem(item) {
  return createItem({
    done: item.done,
    toggle: `shopping:${item.id}`,
    title: item.name,
    meta: `${item.category}${item.qty ? ` - ${item.qty}` : ""}`,
    deleteRef: `shopping:${item.id}`
  });
}

function renderWorkout(workout) {
  const detail = workout.type === "Running" ? `${formatNumber(workout.distance)} km` : "Strength";
  return createItem({
    title: `${workout.type} - ${formatDate(workout.date)}`,
    meta: `${detail}${workout.notes ? ` - ${workout.notes}` : ""}`,
    deleteRef: `workouts:${workout.id}`
  });
}

function renderSpanishPractice(entry) {
  return createItem({
    title: `${entry.minutes} minutes - ${formatDate(entry.date)}`,
    meta: `${entry.topic || "Spanish practice"}${entry.notes ? ` - ${entry.notes}` : ""}`,
    deleteRef: `spanish:${entry.id}`
  });
}

function createItem({ done = false, toggle, title, meta, deleteRef }) {
  const article = document.createElement("article");
  article.className = `item${done ? " done" : ""}`;
  const checkHtml = toggle
    ? `<input class="check" type="checkbox" ${done ? "checked" : ""} data-toggle="${toggle}" aria-label="Mark complete" />`
    : `<span></span>`;

  article.innerHTML = `
    ${checkHtml}
    <div>
      <div class="item-title"></div>
      <div class="item-meta"></div>
    </div>
    <button class="icon-button" type="button" data-delete="${deleteRef}" aria-label="Delete">x</button>
  `;
  article.querySelector(".item-title").textContent = title;
  article.querySelector(".item-meta").textContent = meta;
  return article;
}

function buildTrainingWeeks() {
  return runningWeeks.map((runWeek, index) => {
    const weekStart = addDays(parseIso(planStartIso), index * 7);
    return {
      week: runWeek.week,
      startDate: toIsoDate(weekStart),
      sessions: [
        {
          id: `w${runWeek.week}-strength-a`,
          date: toIsoDate(addDays(weekStart, 0)),
          category: "Strength",
          kind: "Workout A",
          shortTitle: "Strength A",
          title: "Strength Workout A",
          details: strengthA
        },
        {
          id: `w${runWeek.week}-run-quality`,
          date: toIsoDate(addDays(weekStart, 2)),
          category: "Running",
          kind: "Quality",
          shortTitle: "Quality run",
          title: "Running quality workout",
          details: runWeek.quality
        },
        {
          id: `w${runWeek.week}-strength-b`,
          date: toIsoDate(addDays(weekStart, 4)),
          category: "Strength",
          kind: "Workout B",
          shortTitle: "Strength B",
          title: "Strength Workout B",
          details: strengthB
        },
        {
          id: `w${runWeek.week}-run-easy`,
          date: toIsoDate(addDays(weekStart, 6)),
          category: "Running",
          kind: "Easy",
          shortTitle: "Easy run",
          title: "Easy run / long run",
          details: runWeek.easy
        }
      ]
    };
  });
}

function getPlanItems() {
  return state.plan.weeks.flatMap((week) => week.sessions).sort((a, b) => a.date.localeCompare(b.date));
}

function getThisWeekPlanItems() {
  const start = toIsoDate(getWeekStart(today));
  const end = addIsoDays(start, 7);
  return getPlanItems().filter((item) => item.date >= start && item.date < end);
}

function countCompleted(items, category) {
  return items.filter((item) => item.category === category && isPlanCompleted(item.id)).length;
}

function getCompletedPlanCount() {
  return getPlanItems().filter((item) => isPlanCompleted(item.id)).length;
}

function isPlanCompleted(id) {
  return Boolean(state.planStatus[id]?.completed);
}

function getPlanStatusLabel(item) {
  if (isPlanCompleted(item.id)) return { label: "Done", className: "status-done" };
  if (item.date < todayIso) return { label: "Overdue", className: "status-overdue" };
  if (item.date === todayIso) return { label: "Today", className: "status-today" };
  return { label: "Planned", className: "status-open" };
}

function getCurrentPlanWeekLabel() {
  const week = state.plan.weeks.find((entry) => {
    const end = addIsoDays(entry.startDate, 7);
    return todayIso >= entry.startDate && todayIso < end;
  });
  return week ? `Week ${week.week}` : todayIso < planStartIso ? "Plan starts Jun 14" : "Plan complete";
}

function getSpanishMinutesThisWeek() {
  const start = toIsoDate(getWeekStart(today));
  const end = addIsoDays(start, 7);
  return state.spanish
    .filter((entry) => entry.date >= start && entry.date < end)
    .reduce((total, entry) => total + Number(entry.minutes || 0), 0);
}

function getSpanishMinutesThisMonth() {
  const monthStart = `${todayIso.slice(0, 8)}01`;
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const monthEnd = toIsoDate(nextMonth);
  return state.spanish
    .filter((entry) => entry.date >= monthStart && entry.date < monthEnd)
    .reduce((total, entry) => total + Number(entry.minutes || 0), 0);
}

function getSpanishStreak(entries) {
  const dates = new Set(entries.map((entry) => entry.date));
  let streak = 0;
  const cursor = parseIso(todayIso);

  while (dates.has(toIsoDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getAdaptiveDueLabel() {
  const daysSinceStart = Math.floor((parseIso(todayIso) - parseIso(planStartIso)) / 86400000);
  if (daysSinceStart < 14) return "First review Jun 28";
  const reviewWindow = Math.floor(daysSinceStart / 14);
  const dueDate = toIsoDate(addDays(parseIso(planStartIso), reviewWindow * 14));
  const done = state.adaptiveReviews.some((review) => review.date >= dueDate);
  return done ? `Next review ${formatDate(addIsoDays(dueDate, 14))}` : "Review due";
}

function buildRecommendations(review) {
  const recommendations = [];
  const hasPain = !/^no\b|none|healthy|ok$/i.test(review.pain.trim());

  if (hasPain) {
    recommendations.push("Do not increase running or strength volume until pain is resolved.");
    recommendations.push("Keep easy running easy, and replace painful movements with pain-free alternatives.");
  } else if (review.difficulty === "Too easy" && review.completed === "Yes") {
    recommendations.push("Next block can progress slightly: add one interval or 1-2 km to the easy run.");
    recommendations.push("For strength, add reps within the target ranges before adding more sets.");
  } else if (review.difficulty === "Too hard" || review.completed === "No") {
    recommendations.push("Repeat the current block or reduce interval count by one for the next two weeks.");
    recommendations.push("Keep strength sets 2 reps before failure and protect consistency first.");
  } else {
    recommendations.push("Keep the next block close to the current plan and progress gradually.");
    recommendations.push("Aim for all 2 runs, all 2 strength sessions, and daily 10-minute Spanish practice.");
  }

  if (review.pullups >= 8) recommendations.push("Pull-ups are improving: consider harder tempo or one extra rep per set.");
  if (review.dips >= 10) recommendations.push("Dips are improving: build toward the top of each set without reaching failure.");
  recommendations.push(`Use recent 5 km result (${review.recent5k}) to confirm interval pace before changing targets.`);
  return recommendations;
}

function isThisWeek(dateValue) {
  const start = getWeekStart(today);
  const end = addDays(start, 7);
  const date = parseIso(dateValue);
  return date >= start && date < end;
}

function getWeekStart(date) {
  const start = new Date(date);
  const day = start.getDay() || 7;
  start.setDate(start.getDate() - day + 1);
  start.setHours(0, 0, 0, 0);
  return start;
}

function addIsoDays(dateValue, days) {
  return toIsoDate(addDays(parseIso(dateValue), days));
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function parseIso(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateValue) {
  return parseIso(dateValue).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}

function formatFullDate(dateValue) {
  return parseIso(dateValue).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

function formatNumber(value) {
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 1 });
}

function setText(selector, value) {
  document.querySelector(selector).textContent = value;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createId() {
  return globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
