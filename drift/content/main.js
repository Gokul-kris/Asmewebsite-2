class ThumbProvider {
  // Should call to initialize connection; returns Promise
  async init() {
    this.db = firebase.firestore();
    this.storage = firebase.storage();
    this.cur_id = 0;
    this._thumbs = new Map();
    this._maxThumbGroup = 0;
    var doc = await thumbs.db.collection("state").doc("0").get();
    var state = doc.data();
    this.eventsCount = state["events_count"];
    this.serverStatus = state["server_status"];
    this.initialised = true;
    this.eventsPerGroup = 20;
    this.eventCache = new Map();
  }

  // Returns id of event from index; 0 -> latest event; total-1 -> oldest event;
  idfromIndex(index) {
    return this.eventsCount - index - 1;
  }

  // Returns an event at index; must be called after initialized
  async get(index) {
    // Throws error if not initialized
    if (!this.initialised) {
      console.error("Initialze the app by calling ThumbProvider.init()");
      return;
    }

    // Finds id and thumbnail group id
    const id = this.idfromIndex(index);
    const thumbGroupID = Math.floor(id / this.eventsPerGroup);

    // Loads thumb data if not in _thumbs
    while (thumbGroupID >= this._maxThumbGroup) {
      const response = await this.db
        .collection("thumbnails")
        .doc(this._maxThumbGroup.toString())
        .get();
      const data = response.data();
      for (const key in data) {
        this._thumbs[key] = data[key];
      }
      this._maxThumbGroup++;
    }

    return this._thumbs[id];
  }
  // Returns download url of posters
  async url(name) {
    return await this.storage.ref(`posters/${name}`).getDownloadURL();
  }
  // Data of an event
  async event(index) {
    if (this.eventCache[index] != null) {
      return this.eventCache[index];
    }
    const id = this.idfromIndex(index);
    const response = await this.db
      .collection("events")
      .doc(id.toString())
      .get();
    this.eventCache[index] = response.data();
    return response.data();
  }

  // Returns latest event of a type
  async latest(type) {
    const response = await this.db
      .collection("events")
      .where("type", "==", type)
      .orderBy("date", "desc")
      .limit(1)
      .get();
    if (response.docs[0] == undefined) {
      return null;
    }
    return response.docs[0].data();
  }
}
