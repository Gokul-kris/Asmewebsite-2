function $(id) {
  return document.getElementById(id);
}

let thumbs = new ThumbProvider();

thumbs.init().then(() => {
  console.log("ThumbProvider initialized");
  renderEvents();
});

function renderEvents() {
  thumbs.latest(0).then((e) => renderEvent(e, 0));
  thumbs.latest(1).then((e) => renderEvent(e, 1));
  thumbs.latest(2).then((e) => renderEvent(e, 2));
  thumbs.latest(3).then((e) => renderEvent(e, 3));
}

async function renderEvent(event, pos) {
  if (!event) {
    $("tabs-" + (pos + 1)).innerHTML = "<h4>Nothing Here :)</h4>";
    return;
  }
  let button =
    event.status == 0
      ? `<a href="${event.link}">${event.action}</a></div>`
      : "";
  const url = await thumbs.url(event.poster);
  $(
    "tabs-" + (pos + 1)
  ).innerHTML = `<img src="${url}"><h4>${event.name}</h4><p>${event.write_up}</p><div class="main-button">${button}`;
}
