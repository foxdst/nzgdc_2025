let loaded = false;
let loading = null;
let apiData = null;

function parseTime(date, t) {
   let time = t.match( /(\d+)(?::(\d\d))?\s*(p?)/ );
   date.setHours( parseInt(time[1]) + (time[3] ? 12 : 0));
   date.setMinutes( parseInt(time[2]) || 0);
   return date;
}

const API = {
  Get: () => {
    return fetch('https://n8n.rascality.nz/webhook/9a4c6003-0874-45ba-9d06-a49375fb632b')
    .then(response => {
      if (!response.ok) {
        console.log('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}

class Speaker {
  static template;

  name;
  image;
  tagline;
  description;

  element;

  constructor(data) {
    this.name = data["name"];
    this.image = data["mainImage"];
    this.tagline = data["strings"]["companyAndPosition"]
    this.description = data["strings"]["copy"]
    this.element = Speaker.template.cloneNode(true);
  }

  setName() {
    let nameEl = this.element.querySelector('.name');
    if (nameEl != null) {
      nameEl.classList.remove('preFade');
      nameEl.classList.remove('preSlide');
      nameEl.innerText = this.name;
    }
  }

  setImage() {
    let image = this.element.querySelector('.speaker__image img')
    if (image != null) {
      image.src = this.image;
      image.alt = this.name;
    }
  }

  setDescription() {
    let descriptionEl = this.element.querySelector('.description');
    if (descriptionEl != null) {
      if (this.description) {
        descriptionEl.classList.remove('preFade');
        descriptionEl.classList.remove('preSlide');
        descriptionEl.innerHTML = this.description;
      } else {
        descriptionEl.remove();
      }
    }
  }

  setTagline() {
    let taglineEl = this.element.querySelector('.tagline');
    if (taglineEl != null) {
      taglineEl.classList.remove('preFade');
      taglineEl.classList.remove('preSlide');
      taglineEl.innerText = this.tagline;
    }
  }

  render(parent) {
    this.setName();
    this.setImage();
    this.setTagline();
    this.setDescription();

    this.element.classList.remove('layout');
    parent.appendChild(this.element);
  }
}

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

  constructor(date, event) {
    this.name = event['name'];
    if (event['strings']) {
      this.title = event['strings']['1']; // Has the short title.;
      let startTime = event['strings']['startTime'];
      let endTime = event['strings']['endTime'];
      if (startTime) this.start = parseTime(new Date(date.getTime()), startTime);
      if (endTime) this.end = parseTime(new Date(date.getTime()), endTime);
      this.copy = event['strings']['copy'];
      this.studio = event['strings']['7']; // See if it is always '7';
      this.hiddenTime = false;
    }

    let streams = event['streams'];
    streams.forEach((stream) => {
      this.stream = Streams[stream];
    });

    if (this.stream) {
      this.streamClass = this.stream.split(' ')[0].toLowerCase();
    } else {
      this.stream = 'General'
      this.streamClass = 'general';
    }

    this.buildElement();
  }

  buildElement() {
    this.element = ScheduleEvent.template.cloneNode(true);
    this.setTime();
    this.setSpeaker();
    this.setOrganisation();
    this.setTitle();
    this.setType();
  }

  setTime() {
    let nameEl = this.element.querySelector('.event_time');
    if (nameEl != null && !this.hiddenTime) {
      nameEl.classList.remove('preFade');
      nameEl.classList.remove('preSlide');
      let hours = this.start.getHours()
      let hoursStr = hours < 10 ? "0" + hours.toString() : hours.toString();
      let minutes = this.start.getMinutes();
      let minutesStr = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
      nameEl.innerText = hoursStr + "." + minutesStr;
    }
  }

  setSpeaker() {
    let nameEl = this.element.querySelector('.event_speaker');
    if (nameEl != null) {
      if (this.speaker != null) {
        nameEl.classList.remove('preFade');
        nameEl.classList.remove('preSlide');
        nameEl.innerText = this.speaker ?? '';
      } else {
        nameEl.remove();
      }
    }
  }

  setOrganisation() {
    let nameEl = this.element.querySelector('.event_org');
    if (nameEl != null) {
      if (this.studio != null) {
        nameEl.classList.remove('preFade');
        nameEl.classList.remove('preSlide');
        nameEl.innerText = this.studio ?? '';
      } else {
        nameEl.remove();
      }
    }
  }

  setTitle() {
    let nameEl = this.element.querySelector('.event_name');
    if (nameEl != null) {
      nameEl.classList.remove('preFade');
      nameEl.classList.remove('preSlide');
      nameEl.innerText = this.title;
    }
  }

  setType() {
    let nameEl = this.element.querySelector('.event_type.name');
    if (nameEl != null) {
      nameEl.classList.remove('preFade');
      nameEl.classList.remove('preSlide');
      nameEl.innerText = this.stream;
    }

    let background = this.element.querySelector('.event_type_block');
    if (background != null) {
      background.className = `event_type_block ${this.streamClass}`
    }
  }

  render() {
    if (this.title && this.title != "...") {
      ScheduleEvent.parent.append(this.element);
    }
  }
}

const DaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
    this.id = day['id'];
    this.name = day['name'];
    this.dateMs = Date.parse(day['strings']['date']);
    this.date = new Date(Date.parse(day['strings']['date']));

    this.events = [];
    let children = day['children'];
    let previousEvent = null;
    for (let i = 0; i < children.length; i++) {
      let scheduleEvent = new ScheduleEvent(this.date, children[i]);
      if (previousEvent != null && scheduleEvent.start === previousEvent.start) {
        scheduleEvent.hiddenTime = true;
      }
      this.events.push(scheduleEvent)
    }

    this.showEvents = this.showEvents.bind(this);
    this.buildElement();
  }

  buildElement() {
    this.element = ScheduleDay.template.cloneNode(true);
    this.setTitle();
    this.element.addEventListener('click', () => {
      document.querySelectorAll('.active_day').forEach((value) => value.classList.remove('active_day'));
      this.element.classList.add('active_day');
      this.showEvents();
    });
  }

  setTitle() {
    let nameEl = this.element.querySelector('.day_title');
    if (nameEl != null) {
      nameEl.classList.remove('preFade');
      nameEl.classList.remove('preSlide');
      nameEl.innerText = DaysOfWeek[this.date.getDay()] + " " + this.date.getDate();
    }
  }

  showEvents() {
    let parent = ScheduleEvent.parent;
    while (parent.firstChild) parent.removeChild(parent.firstChild);
    this.events.forEach((event) => event.render());
  }

  render() {
    ScheduleDay.parent.append(this.element);
  }
}

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
    let days = data['days'];
    this.days = days.map((dayData) => new ScheduleDay(dayData)).filter((day) => day.events.length > 0);
  }

  render() {
    this.days.forEach((day) => day.render());
    if (this.days.length > 0) {
      this.days[0].showEvents();
    }
  }
}

function Load() {
  if (!loaded) {
    if (loading) {
      return loading
    } else {
      loading = API.Get().then((json) => {
        loaded = true;
        loading = null;
        apiData = json['data'];
        return apiData;
      });
      return loading;
    }
  } else {
    return Promise.resolve(apiData);
  }
}

let Streams = {};

function LoadSchedule() {
  document.addEventListener("DOMContentLoaded", () => {
    ScheduleEvent.parent = document.querySelector('.events');
    ScheduleEvent.template = document.querySelector('.event_block');
    ScheduleEvent.template.remove();

    ScheduleDay.parent = document.querySelector('.schedule_days');
    ScheduleDay.template = document.querySelector('.schedule_day');
    ScheduleDay.template.remove();

    Load().then((json) => {
      Streams = json['streams'];
      let schedule = Schedule.load(json["schedule"]);
      schedule.render();
    });
  })
}

function LoadSpeakers() {
  document.addEventListener("DOMContentLoaded", () => {
    let element = document.querySelector('.speakers');
    Speaker.template = element.querySelector('.speaker');
    Speaker.template.remove();

    Load().then((json) => {
      let children = json['speakers']
      let speakers = [];
      for (let i = 0; i < children.length; i++) {
        speakers.push(new Speaker(children[i]));
      }

      speakers.map((speaker) => {
        speaker.render(element);
      });
    });
  });
}




