// Replaces document.getElementById with $
function $(id) {
  return document.getElementById(id);
}

// Renders single event at index
function renderEvent(index) {
  // Adds a container for an  event
  const newEvent = document.createElement("div");
  newEvent.className = "event";
  newEvent.id = `event-${index}`;
  newEvent.onclick = (_) => toggleEvent(index);
  $("container").appendChild(newEvent);

  // Gets data of event
  thumbs.get(index).then(async (value) => {
    // Container gets removed if null
    if (value == null) {
      $(`event-${index}`).remove();
      return;
    }

    // Gets url of poster
    const posterURL = await thumbs.url(value.thumb);

    // Decides attributes of status chip
    const state =
      value.status == 0 ? "Open" : value.status == 1 ? "Closed" : "Ended";
    const chipColor =
      value.status == 0 ? "green" : value.status == 1 ? "blue" : "red";

    // Writes data to container
    $(
      `event-${index}`
    ).innerHTML = `<img class="poster" src="${posterURL}"><span class="card-footer"><p class="chip" style="background-color:${chipColor}">${state}</p><h1>${value.name}</h1></span><div id="event-${index}-data"></div>`;
  });
}

// ThumbProvider construction
let thumbs = new ThumbProvider();
let loaded = 0;
// Tries to Load 3 posts as soon as page loads
thumbs.init().then(() => {
  $("loading").remove();
  renderEvent(0);
  renderEvent(1);
  renderEvent(2);
  loaded += 3;
});

// Returns the fraction of scroll, 0 at start, 1 at end
function currentScrollFraction() {
  return (
    (document.documentElement.scrollTop + document.body.scrollTop) /
    (document.documentElement.scrollHeight -
      document.documentElement.clientHeight)
  );
}

// Expands or collapse event card
function toggleEvent(index) {
  if ($(`event-${index}-data`).innerHTML != "") {
    $(`event-${index}-data`).innerHTML = "";
    return;
  }
  selected = index;
  thumbs.event(index).then((value) => {
    var link =
      value.status == 0
        ? `<a href='${value.link}' target="_blank" class="link">${value.action}</a>`
        : "";
    $(
      `event-${index}-data`
    ).innerHTML = `<p class="write-up">${value.write_up}</p>${link}`;
  });
}

// Scroll event listner
window.onscroll = (e) => {
  // Loads more posts as user scrolls down
  if (currentScrollFraction() > 0.8 && loaded < thumbs.eventsCount) {
    renderEvent(loaded);
    loaded++;
  }
};
