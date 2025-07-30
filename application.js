let loaded = false;
let loading = null;
let apiData = null;

////////////////////////////////////////////////////////////////////////////////////////////////
// Animation for the event title in the NZGDC Schedule Page? //
function setElementsInnerText(element, value, remove = false) {
  if (element != null) {
    element.classList.remove("preFade");
    element.classList.remove("preSlide");
    element.innerText = value;
  } else if (remove) {
    element.remove();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
// Assign event image details //
function setImageDetails(element, src, alt) {
  if (element != null) {
    element.src = src; // Image source link
    element.alt = alt; // Image alt text
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
// I'll be honest, idk why this needs to be setup. Is Entegy API unable to give us time? //
function parseTime(date, t) {
  let time = t.match(/(\d+)(?::(\d\d))?\s*(p?)/);
  date.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
  date.setMinutes(parseInt(time[2]) || 0);
  return date;
}
////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
// Event Duration ??? //
function compareDate(date1, date2) {
  if (date1 != null) {
    if (date2 != null) {
      if (date1.getTime() > date2.getTime()) {
        return 1;
      } else if (date1.getTime() == date2.getTime()) {
        return 0;
      } else {
        return -1;
      }
    } else {
      return 1;
    }
  } else if (date2 != null) {
    return -1;
  } else {
    return 0;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Actual Entegy API //
const API = {
  Get: () => {
    return fetch(
      "https://n8n.rascality.nz/webhook/9a4c6003-0874-45ba-9d06-a49375fb632b",
    )
      .then((response) => {
        if (!response.ok) {
          console.log(
            "APP: Network response was not ok " + response.statusText,
          );
        }
        return response.json();
      })
      .catch((error) => {
        console.error("APP: Error:", error);
      });
  },
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Speaker Details //
class Speaker {
  static template;

  name;
  image;
  tagline;
  description;

  element;
  expanded;
  popupElement;

  constructor(data) {
    this.name = data["name"];
    this.image = data["mainImage"];
    this.tagline = data["strings"]["companyAndPosition"];
    this.description = data["strings"]["copy"];
    this.expanded = false;

    this.element = Speaker.template.cloneNode(true);
    this.popupElement = this.element.querySelector(".popup");

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
  }

  setName() {
    setElementsInnerText(this.element.querySelector(".name"), this.name);
    setElementsInnerText(this.element.querySelector(".popup__name"), this.name);
  }

  setImage() {
    setImageDetails(
      this.element.querySelector(".speaker__image img"),
      this.image,
      this.name,
    );
    setImageDetails(
      this.element.querySelector(".popup__speaker__image img"),
      this.image,
      this.name,
    );
  }

  setDescription() {
    setElementsInnerText(
      this.element.querySelector(".description"),
      this.description,
      true,
    );
    setElementsInnerText(
      this.element.querySelector(".popup__description"),
      this.description,
      true,
    );
  }

  setTagline() {
    setElementsInnerText(this.element.querySelector(".tagline"), this.tagline);
    setElementsInnerText(
      this.element.querySelector(".popup__tagline"),
      this.tagline,
    );
  }

  expand(e) {
    if (!this.expanded) {
      this.expanded = true;
      this.popupElement.classList.add("show");
    }
    e.stopImmediatePropagation();
    return true;
  }

  collapse(e) {
    if (this.expanded) {
      this.expanded = false;
      this.popupElement.classList.remove("show");
    }
    e.stopImmediatePropagation();
    return true;
  }

  attachClickListeners() {
    this.element.addEventListener("click", (e) => this.expand(e));
    this.popupElement.addEventListener("click", (e) => this.collapse(e));
  }

  render(parent) {
    this.setName();
    this.setImage();
    this.setTagline();
    this.setDescription();
    this.attachClickListeners();

    this.element.classList.remove("layout");
    parent.appendChild(this.element);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Event Details //
class ScheduleEvent {
  static parent;
  static template;

  title;
  name;
  start;
  end;
  copy;
  speaker;
  studio;
  stream;
  streamClass;

  element;
  hiddenTime;
  popupElement;
  expanded;

  constructor(date, event) {
    this.name = event["name"];
    if (event["strings"]) {
      this.title = event["strings"]["1"]; // Has the short title.;
      let startTime = event["strings"]["startTime"];
      let endTime = event["strings"]["endTime"];
      if (startTime)
        this.start = parseTime(new Date(date.getTime()), startTime);
      if (endTime) this.end = parseTime(new Date(date.getTime()), endTime);
      this.copy = event["strings"]["copy"];
      this.studio = event["strings"]["7"]; // See if it is always '7';
      this.hiddenTime = false;
    }

    let streams = event["streams"];
    streams.forEach((stream) => {
      this.stream = Streams[stream];
    });

    if (this.stream) {
      this.streamClass = this.stream.split(" ")[0].toLowerCase();
    } else {
      this.stream = "General";
      this.streamClass = "general";
    }

    this.expanded = false;

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);

    this.buildElement();
  }

  hide() {
    this.hiddenTime = true;
    this.setTime();
  }

  buildElement() {
    this.element = ScheduleEvent.template.cloneNode(true);
    this.popupElement = this.element.querySelector(".popup");

    this.setTime();
    this.setSpeaker();
    this.setOrganisation();
    this.setTitle();
    this.setType();
    this.setDescription();

    this.attachClickListeners();
  }

  getTimeText() {
    let hours = this.start.getHours();
    let hoursStr = hours < 10 ? "0" + hours.toString() : hours.toString();
    let minutes = this.start.getMinutes();
    let minutesStr =
      minutes < 10 ? "0" + minutes.toString() : minutes.toString();
    return hoursStr + "." + minutesStr;
  }

  setTime() {
    let nameEl = this.element.querySelector(".event_time");
    if (nameEl != null && !this.hiddenTime) {
      nameEl.parentNode.classList.remove("hidden_time");
      setElementsInnerText(nameEl, this.getTimeText());
    } else {
      nameEl.parentNode.classList.add("hidden_time");
    }
  }

  compareTime(other) {
    let diff = compareDate(this.start, other.start);
    if (diff === 0) {
      return compareDate(this.end, other.end);
    }
    return diff;
  }

  sameTime(other) {
    return (
      this.start != null &&
      other.start != null &&
      this.start.getTime() === other.start.getTime()
    );
  }

  setSpeaker() {
    let nameEl = this.element.querySelector(".event_speaker");
    if (nameEl != null) {
      if (this.speaker != null) {
        setElementsInnerText(nameEl, this.speaker ?? "");
      } else {
        nameEl.remove();
      }
    }
  }

  setOrganisation() {
    let nameEl = this.element.querySelector(".event_org");
    if (nameEl != null) {
      if (this.studio != null) {
        setElementsInnerText(nameEl, this.studio ?? "");
      } else {
        nameEl.remove();
      }
    }
  }

  setTitle() {
    setElementsInnerText(this.element.querySelector(".event_name"), this.title);
    setElementsInnerText(
      this.element.querySelector(".popup__schedule__title"),
      this.title,
    );
  }

  setDescription() {
    setElementsInnerText(
      this.element.querySelector(".popup__schedule__description"),
      this.copy,
    );
  }

  setType() {
    setElementsInnerText(
      this.element.querySelector(".event_type"),
      this.stream,
    );
    setElementsInnerText(
      this.element.querySelector(".popup__schedule__tag"),
      this.stream,
    );

    let background = this.element.querySelector(".event_type_block");
    if (background != null) {
      background.className = `event_type_block ${this.streamClass}`;
    }

    let popupType = this.element.querySelector(".popup__schedule__tag");
    if (popupType != null) {
      popupType.className = `popup__schedule__tag ${this.streamClass}`;
    }
  }

  expand(e) {
    if (!this.expanded) {
      this.expanded = true;
      this.popupElement.classList.add("show");
    }
    e.stopImmediatePropagation();
    return true;
  }

  collapse(e) {
    if (this.expanded) {
      this.expanded = false;
      this.popupElement.classList.remove("show");
    }
    e.stopImmediatePropagation();
    return true;
  }

  attachClickListeners() {
    this.element.addEventListener("click", (e) => this.expand(e));
    this.popupElement.addEventListener("click", (e) => this.collapse(e));
  }

  render() {
    if (this.title && this.title != "...") {
      ScheduleEvent.parent.append(this.element);
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Is this even necessary??? //
const DaysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Day Schedule Class? //
class ScheduleDay {
  static parent;
  static template;

  id;
  name;
  date;
  dateMs;
  events;

  element;

  constructor(day) {
    this.id = day["id"];
    this.name = day["name"];
    this.dateMs = Date.parse(day["strings"]["date"]);
    this.date = new Date(Date.parse(day["strings"]["date"]));

    this.events = [];
    let children = day["children"];
    for (let i = 0; i < children.length; i++) {
      let scheduleEvent = new ScheduleEvent(this.date, children[i]);
      if (scheduleEvent != null) {
        this.events.push(scheduleEvent);
      }
    }

    this.events = this.events.sort((a, b) => a.compareTime(b));

    let i = 0;
    if (this.events.length > 0) {
      let previousEvent = this.events[i];
      for (i = 1; i < this.events.length; i++) {
        let scheduleEvent = this.events[i];
        if (scheduleEvent.sameTime(previousEvent)) {
          scheduleEvent.hide();
        }
        previousEvent = scheduleEvent;
      }
    }

    this.showEvents = this.showEvents.bind(this);
    this.buildElement();
  }

  buildElement() {
    this.element = ScheduleDay.template.cloneNode(true);
    this.setTitle();
    this.element.addEventListener("click", () => {
      document
        .querySelectorAll(".active_day")
        .forEach((value) => value.classList.remove("active_day"));
      this.showEvents();
    });
  }

  setTitle() {
    let nameEl = this.element.querySelector(".day_title");
    if (nameEl != null) {
      nameEl.classList.remove("preFade");
      nameEl.classList.remove("preSlide");
      nameEl.innerText =
        DaysOfWeek[this.date.getDay()] + " " + this.date.getDate();
    }
  }

  showEvents() {
    let parent = ScheduleEvent.parent;
    while (parent.firstChild) parent.removeChild(parent.firstChild);
    this.element.classList.add("active_day");
    this.events.forEach((event) => event.render());
  }

  render() {
    ScheduleDay.parent.append(this.element);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Parent Schedule Function? //
class Schedule {
  static _schedule;

  days;

  static instance() {
    return this._schedule;
  }

  static load(data) {
    this._schedule = new Schedule(data);
    return this._schedule;
  }

  constructor(data) {
    let days = data["days"];
    this.days = days
      .map((dayData) => new ScheduleDay(dayData))
      .filter((day) => day.events.length > 0);
  }

  render() {
    this.days.forEach((day) => day.render());
    if (this.days.length > 0) {
      this.days[0].showEvents();
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Load Entegy API details into... whatever called element is being loaded I guess? //
function Load() {
  if (!loaded) {
    if (loading) {
      return loading;
    } else {
      loading = API.Get().then((json) => {
        if (json != null) {
          loaded = true;
          loading = null;
          apiData = json["data"];
          return apiData;
        } else {
          loading = null;
        }
      });

      return loading;
    }
  } else {
    return Promise.resolve(apiData);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Should these be down here? //
let Streams = {};
let displayedSchedule = false;
let displayedSpeakers = false;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Animation or something??? //
function waitForElement(ele, callback) {
  let elements = document.querySelectorAll(ele);
  if (elements.length > 0) {
    callback(elements);
  } else {
    setTimeout(() => {
      waitForElement(ele, callback);
    }, 100);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function that's called by LoadSchedule(), which can't be included due to some wacky web sync stuff //
function displaySchedule() {
  if (displayedSchedule) return;

  displayedSchedule = true;
  ScheduleEvent.parent = document.querySelector(".events");

  let parent = ScheduleEvent.parent.parentElement;
  while (parent != null && parent.nodeName != "SECTION") {
    parent = parent.parentElement;
  }
  if (parent != null) {
    parent.style["z-index"] = 1000;
  }

  ScheduleEvent.template = document.querySelector(".event_block");
  ScheduleEvent.template.remove();

  ScheduleDay.parent = document.querySelector(".schedule_days");
  ScheduleDay.template = document.querySelector(".schedule_day");
  ScheduleDay.template.remove();

  Load().then((json) => {
    Streams = json["streams"];
    let schedule = Schedule.load(json["schedule"]);
    schedule.render();
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function that's executed from NZGDC Programme Page //
function LoadSchedule() {
  waitForElement(".events", (val) => {
    displaySchedule();
  });

  document.addEventListener("DOMContentLoaded", () => {
    displaySchedule();
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function called by LoadSpeakers(), which again needs to be separated from web sync stuff //
function displaySpeakers() {
  if (displayedSpeakers) return;

  displayedSpeakers = true;
  let element = document.querySelector(".speakers");

  let parent = element.parentElement;
  while (parent != null && parent.nodeName != "SECTION") {
    parent = parent.parentElement;
  }
  if (parent != null) {
    parent.style["z-index"] = 1000;
  }

  Speaker.template = document.querySelector(".speaker_layout");
  Speaker.template.remove();

  Load().then((json) => {
    let children = json["speakers"];
    let speakers = [];
    for (let i = 0; i < children.length; i++) {
      speakers.push(new Speaker(children[i]));
    }

    speakers.map((speaker) => {
      speaker.render(element);
    });
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function that's executed from NZGDC Speakers page? //
function LoadSpeakers() {
  waitForElement(".speaker", (val) => {
    displaySpeakers();
  });

  document.addEventListener("DOMContentLoaded", () => {
    displaySpeakers();
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
