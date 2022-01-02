const noteDef = {
  id: null,
  title: null,
  body: null,
  lastSaved: null };


new Vue({
  el: '#app',
  data: {
    note: _.clone(noteDef),
    notes: JSON.parse(localStorage.getItem('notes')) || [],
    saveTimeout: null },

  computed: {
    wordCount() {
      if (!this.note.body || this.note.body.trim() === '') return 0;
      return this.note.body.trim().split(' ').length;
    },
    lastSaved() {
      if (!this.note.lastSaved) return 'Never';
      return moment(this.note.lastSaved).format('DD.MM.YYYY. H:mm:ss');
    },
    notesSorted() {
      return this.notes.sort((a, b) => {
        return a['lastSaved'] < b['lastSaved'];
      });
    } },

  methods: {
    storeNotes() {
      localStorage.setItem('notes', JSON.stringify(this.notes));
    },
    deleteNote(id) {
      if (id === this.note.id) this.clearCurrentNote();
      this.notes = this.notes.filter(note => {
        return note.id !== id;
      });
      this.storeNotes();
    },
    clearCurrentNote() {
      this.note = _.clone(noteDef);
    },
    openNote(note) {
      this.note = note;
    },
    saveNote() {
      this.touchLastSaved();
      if (!this.note.id) {
        this.note.id = Date.now();
        this.notes.unshift(this.note);
        return;
      }
      this.storeNotes();
      this.startSaveTimeout();
    },
    startSaveTimeout() {
      if (this.saveTimeout !== null) return;
      this.saveTimeout = setTimeout(() => {
        this.saveNote();
        this.clearSaveTimeout();
      }, 1000);
    },
    clearSaveTimeout() {
      clearInterval(this.saveTimeout);
      this.saveTimeout = null;
    },
    touchLastSaved() {
      this.note.lastSaved = Date.now();
    } } });