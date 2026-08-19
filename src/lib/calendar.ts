/**
 * Booking flow.
 *
 * Three steps on one screen: choose a day, choose a time, leave details.
 * Each step reveals the next rather than navigating, so the visitor never
 * loses the session they were looking at.
 */
import { gsap, onCleanup, prefersReducedMotion } from "./motion";
import { getMonth, getDay, submitBooking, iso } from "./availability";

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
const DOW = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export function initCalendar(): void {
  const root = document.querySelector<HTMLElement>("[data-calendar]");
  if (!root) return;

  const slug = root.dataset.slug || "";
  const grid = root.querySelector<HTMLElement>("[data-cal-grid]")!;
  const label = root.querySelector<HTMLElement>("[data-cal-month]")!;
  const prev = root.querySelector<HTMLButtonElement>("[data-cal-prev]")!;
  const next = root.querySelector<HTMLButtonElement>("[data-cal-next]")!;
  const slotWrap = root.querySelector<HTMLElement>("[data-slots]")!;
  const slotList = root.querySelector<HTMLElement>("[data-slot-list]")!;
  const slotDate = root.querySelector<HTMLElement>("[data-slot-date]")!;
  const details = root.querySelector<HTMLElement>("[data-details]")!;
  const form = root.querySelector<HTMLFormElement>("[data-booking-form]")!;
  const summary = root.querySelector<HTMLElement>("[data-summary]")!;
  const done = root.querySelector<HTMLElement>("[data-confirmed]")!;
  const reduced = prefersReducedMotion();

  const today = new Date();
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  let chosenDate: string | null = null;
  let chosenTime: string | null = null;

  const reveal = (el: HTMLElement) => {
    el.hidden = false;
    if (reduced) return;
    gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
  };

  const renderMonth = () => {
    const y = view.getFullYear(), m = view.getMonth();
    label.textContent = `${MONTHS[m]} ${y}`;
    // Never let anyone page back before the current month.
    prev.disabled = y === today.getFullYear() && m === today.getMonth();

    const cells = getMonth(slug, y, m);
    grid.innerHTML = "";

    DOW.forEach((d) => {
      const h = document.createElement("span");
      h.className = "label !text-[0.5rem] grid place-items-center py-2 opacity-60";
      h.textContent = d;
      grid.appendChild(h);
    });

    cells.forEach((cell) => {
      if (!cell) { grid.appendChild(document.createElement("span")); return; }
      const d = new Date(cell.date + "T00:00:00");
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.date = cell.date;
      b.disabled = cell.closed;
      b.textContent = String(d.getDate());
      b.className =
        "cal-day relative grid aspect-square place-items-center rounded-[10px] font-mono text-[0.82rem] " +
        "tabular-nums transition-all duration-400 " +
        (cell.closed
          ? "text-bone/18 cursor-not-allowed"
          : "text-bone/85 hover:text-chalk hover:bg-ash/60 cursor-pointer");
      if (!cell.closed) {
        const dot = document.createElement("span");
        dot.className = "absolute bottom-1.5 h-[3px] w-[3px] rounded-full bg-bronze/70";
        b.appendChild(dot);
      }
      grid.appendChild(b);
    });

    // Re-selecting keeps the highlight when paging back to the same month.
    if (chosenDate) markDay(chosenDate);
  };

  const markDay = (date: string) => {
    grid.querySelectorAll<HTMLElement>("[data-date]").forEach((el) => {
      const on = el.dataset.date === date;
      el.dataset.chosen = String(on);
      el.classList.toggle("is-chosen", on);
    });
  };

  const openSlots = (date: string) => {
    chosenDate = date;
    chosenTime = null;
    markDay(date);

    const d = new Date(date + "T00:00:00");
    slotDate.textContent = d.toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long",
    });

    const day = getDay(slug, d);
    slotList.innerHTML = "";
    day.slots.forEach((s) => {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.time = s.time;
      b.disabled = !s.available;
      b.textContent = s.time;
      b.className =
        "slot rounded-full border px-4 py-2.5 font-mono text-[0.78rem] tabular-nums transition-all duration-400 " +
        (s.available
          ? "border-ash bg-stone/50 text-bone hover:border-bronze/60 hover:text-chalk"
          : "border-ash/40 text-bone/20 line-through cursor-not-allowed");
      slotList.appendChild(b);
    });

    reveal(slotWrap);
    slotWrap.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  };

  const chooseTime = (time: string) => {
    chosenTime = time;
    slotList.querySelectorAll<HTMLElement>("[data-time]").forEach((el) => {
      el.classList.toggle("is-chosen", el.dataset.time === time);
    });
    if (chosenDate) {
      const d = new Date(chosenDate + "T00:00:00");
      summary.textContent = `${d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} at ${time}`;
    }
    reveal(details);
    details.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  };

  grid.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-date]");
    if (b && !(b as HTMLButtonElement).disabled) openSlots(b.dataset.date!);
  });
  slotList.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-time]");
    if (b && !(b as HTMLButtonElement).disabled) chooseTime(b.dataset.time!);
  });

  prev.addEventListener("click", () => {
    view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
    renderMonth();
  });
  next.addEventListener("click", () => {
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    renderMonth();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!chosenDate || !chosenTime) return;
    const fd = new FormData(form);
    const btn = form.querySelector<HTMLButtonElement>("[type=submit]")!;
    btn.disabled = true;
    btn.dataset.busy = "true";

    const res = await submitBooking({
      slug,
      date: chosenDate,
      time: chosenTime,
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      notes: String(fd.get("notes") || ""),
    });

    btn.disabled = false;
    delete btn.dataset.busy;

    if (!res.ok) {
      const err = root.querySelector<HTMLElement>("[data-error]");
      if (err) { err.textContent = res.message || "Something went wrong."; err.hidden = false; }
      return;
    }

    const ref = done.querySelector<HTMLElement>("[data-ref]");
    if (ref) ref.textContent = res.reference || "";
    const when = done.querySelector<HTMLElement>("[data-when]");
    if (when) when.textContent = summary.textContent;

    form.hidden = true;
    reveal(done);
    done.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  });

  renderMonth();
  onCleanup(() => { grid.innerHTML = ""; });
}
