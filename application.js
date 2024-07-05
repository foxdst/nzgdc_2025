const API = {
  endpoint: 'https://api.entegy.com.au/',
  projectId: 'unset',
  key1: 'unset',
  key2: 'unset',
  Get: (url, data) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `ApiKey ${API.key1}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        projectId: API.projectId,
        apiKey: API.key2,
        ...data
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}

const Template = {
  Speakers: 25
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

function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    setTimeout(() => waitForElement(selector, callback), 100);
  }
}

function LoadSpeakers(projectId, apiKey1, apiKey2) {
  API.projectId = projectId;
  API.key1 = apiKey1;
  API.key2 = apiKey2;

  waitForElement('.speakers', function(element) {
    Speaker.template = element.querySelector('.speaker');
    Speaker.template.remove();

    API.Get(API.endpoint + '/v2/Content', { templateId: Template.Speakers, moduleId: 1 }).then((json) => {
      let content = json["content"];
      let children = content["children"]
      let speakers = [];
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        if (child != null && child["templateType"] == "speaker") {
          speakers.push(new Speaker(child));
        }
      }

      speakers.map((speaker) => {
        speaker.render(element);
      });
    });
  });
}




