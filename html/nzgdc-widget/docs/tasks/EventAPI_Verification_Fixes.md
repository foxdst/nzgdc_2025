Using the dataflow diagram, event data API documentation, and the README file from the HTML file directory for reference:

Can you review the JS codebase to ensure that the following data variables from the Event API are assigned correctly to the corresponding HTML elements:

displayName --> nzgdc-speaker-bioName-big, nzgdc-speaker-name-main, nzgdc-expanded-speaker-name, nzgdc-speaker-name-item

(position @ company) --> nzgdc-speaker-bioPosition-big, nzgdc-speaker-position-company-main, nzgdc-expanded-speaker-position

speakerImage --> nzgdc-speaker-headshot

web --> nzgdc-contact-website

email --> nzgdc-contact-email

---
So one of the major missing features from the existing codebase is that the Event Times Containers are supposed to be separating the Event Panels from each Schedule View into 'schedule blocks' (e.g. 9:00am to 10:00am events).

So they shouldn't be developed to be a 'generate-and-forget' element, the Event Times Containers elements should've been generated according to this order of instructions:

1. Load Event API details of all Events across each day, noting each of their 'startTime' and 'endTime'.
2. In each day, categorise Events Panels into 'schedule blocks' in chronological order (e.g. 9:00am to 10:00am, and 10:00am to 11:00am, etc.) according to their 'startTime'.
3. Calculate the duration of each Event Panels (endTime minus startTime), and order Events Panels in each 'schedule block' from those with the longest duration at the top, and those with the shortest duration at the bottom.
4. Then if multiple Event Panels have the same duration (e.g. 9:00am to 10:00am, 1 hour duration) sort the Event Panels in alphabetical order, according to its event title (nzgdc-title-text-main or nzgdc-title-text-big).

The design behaviour that should be seen across all of the schedule views is that the Event Times Containers are sectioning off event panels (and their respective panel rows) in accordance to these above instructions. And, as a result, the Event Times Containers need to be dynamically updated according to how the Event panels, and their time data, is assigned from the Event API.

---

I forgot to mention another feature to add:

Because there's two different Event Panel Designs: 'Big' and 'Main', in each 'schedule block' all of the 'big' Event Panel rows need to be ordered first (top), then the 'main' Event panel rows are placed underneath them - in which then all of the aforementioned instructions of sorting by duration and alphabetical order is then applied to all of the respective Event Panels rows.

HOWEVER, when the Event Panels are sorted by duration and subsequently alphabetical order, they should only be compared to respective Event Panels of the same type AND across the same type rows (e.g. an 'Main' Event Panel cannot compare its duration & event title to a 'Big' Event Panel, but it can compare itself to another 'Main' Event Panel on the same row, or the row above and/or below its current row).

Are you able to implement that unique functionality in respect to each 'Big' and 'Main' Event Panel row in each dynamic schedule block?
