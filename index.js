// Notes state
let notes = [];
try {
  const saved = localStorage.getItem('notes');
  if (saved) {
    notes = JSON.parse(saved);
  }
} catch (e) {
  notes = [];
}

let currentNoteId = null;
let deleteTargetId = null;

// DOM elements
const notepad = document.getElementById('notepad');
const notesList = document.getElementById('notesList');
const wordCount = document.getElementById('wordCount');
const fontFamilySelect = document.getElementById('fontFamily');
const fontSizeSelect = document.getElementById('fontSize');
const newNoteBtn = document.getElementById('newNoteBtn');
const saveBtn = document.getElementById('saveBtn');
const shareBtn = document.getElementById('shareBtn');
const deleteModal = document.getElementById('deleteModal');
const saveModal = document.getElementById('saveModal');
const shareModal = document.getElementById('shareModal');
const noteTemplate = document.getElementById('noteTemplate');
const themeToggle = document.getElementById('themeToggle');
const themeToggleThumb = document.getElementById('themeToggleThumb');
const shareLinkInput = document.getElementById('shareLink');
const copyLinkBtn = document.getElementById('copyLink');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const sidebarDrawer = document.getElementById('sidebarDrawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const notesCountBadge = document.getElementById('notesCountBadge');

// Theme management
const themeStorageKey = 'notepadTheme';
let isDarkMode = localStorage.getItem(themeStorageKey) === 'dark';

function applyTheme() {
  const theme = isDarkMode ? 'dark' : 'light';
  document.body.setAttribute('data-theme', theme);
  themeToggle.checked = isDarkMode;
  themeToggleThumb.textContent = isDarkMode ? '☾' : '☀';
}

function setThemeMode(darkMode) {
  isDarkMode = darkMode;
  localStorage.setItem(themeStorageKey, darkMode ? 'dark' : 'light');
  applyTheme();
}

// Drawer helpers
function openDrawer() {
  if (window.innerWidth < 768) {
    sidebarDrawer.classList.remove('-translate-x-full');
    sidebarDrawer.classList.add('translate-x-0');
    drawerBackdrop.classList.remove('hidden');
  } else {
    sidebarDrawer.classList.toggle('hidden');
  }
}

function closeDrawer() {
  sidebarDrawer.classList.remove('translate-x-0');
  sidebarDrawer.classList.add('-translate-x-full');
  drawerBackdrop.classList.add('hidden');
}

// Modal helpers
function openModal(modal) {
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal(modal) {
  modal.classList.remove('flex');
  modal.classList.add('hidden');
}

// Notes management
function initApp() {
  if (notes.length === 0) {
    createNewNote();
  } else {
    loadNote(notes[0].id);
    renderNotes();
  }
}

function createNewNote() {
  saveCurrentNote();

  const maxNoteNumber = notes.reduce((max, note) => {
    const match = /^Note\s+(\d+)$/i.exec(note.title);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  const newNote = {
    id: Date.now(),
    title: `Note ${maxNoteNumber + 1}`,
    content: '',
    fontFamily: fontFamilySelect.value || 'monospace',
    fontSize: fontSizeSelect.value || '14',
  };

  notes.unshift(newNote);
  saveNotes();
  loadNote(newNote.id);
  renderNotes();
  notepad.focus();
}

function loadNote(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  currentNoteId = id;
  notepad.value = note.content || '';
  fontFamilySelect.value = note.fontFamily || 'monospace';
  fontSizeSelect.value = note.fontSize || '14';

  applyFontStyles();
  updateWordCount();
  autoResizeTextarea();
}

function saveCurrentNote() {
  if (!currentNoteId) return;

  const note = notes.find((n) => n.id === currentNoteId);
  if (!note) return;

  note.content = notepad.value;
  note.fontFamily = fontFamilySelect.value;
  note.fontSize = fontSizeSelect.value;
  saveNotes();
}

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNotes() {
  notesList.innerHTML = '';

  if (notesCountBadge) {
    notesCountBadge.textContent = `${notes.length} note${notes.length === 1 ? '' : 's'}`;
  }

  notes.forEach((note) => {
    const noteEl = noteTemplate.content.firstElementChild.cloneNode(true);
    const titleEl = noteEl.querySelector('.note-title');
    const deleteBtn = noteEl.querySelector('.note-delete');

    titleEl.textContent = note.title;

    if (note.id === currentNoteId) {
      noteEl.classList.add('active-note');
    }

    // Switch note on card click
    noteEl.addEventListener('click', () => {
      if (currentNoteId !== note.id) {
        saveCurrentNote();
        loadNote(note.id);
        renderNotes();
      }
      if (window.innerWidth < 768) {
        closeDrawer();
      }
    });

    // Delete note action
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTargetId = note.id;
      openModal(deleteModal);
    });

    notesList.appendChild(noteEl);
  });
}

function deleteNote() {
  if (!deleteTargetId) return;

  notes = notes.filter((n) => n.id !== deleteTargetId);
  saveNotes();

  if (currentNoteId === deleteTargetId) {
    if (notes.length === 0) {
      createNewNote();
    } else {
      loadNote(notes[0].id);
    }
  }

  deleteTargetId = null;
  renderNotes();
  closeModal(deleteModal);
}

// Textarea helpers
function updateWordCount() {
  const text = notepad.value.trim();
  const count = text ? text.split(/\s+/).filter(Boolean).length : 0;
  wordCount.textContent = count;
}

function applyFontStyles() {
  notepad.style.fontFamily = fontFamilySelect.value;
  notepad.style.fontSize = fontSizeSelect.value + 'px';
}

function autoResizeTextarea() {
  notepad.style.height = 'auto';
  notepad.style.height = Math.max(300, notepad.scrollHeight) + 'px';
}

// Share functions
function shareNote() {
  if (!currentNoteId) return;

  const note = notes.find((n) => n.id === currentNoteId);
  if (!note) return;

  saveCurrentNote();

  let encoded;
  try {
    encoded = btoa(encodeURIComponent(note.content));
  } catch (e) {
    encoded = encodeURIComponent(note.content);
  }

  const baseUrl = window.location.href.split('?')[0];
  const longUrl = `${baseUrl}?note=${encoded}`;

  shareLinkInput.value = longUrl;
  openModal(shareModal);

  // Attempt URL shortening on web origins
  if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
    if (!baseUrl.includes('localhost') && !baseUrl.includes('127.0.0.1')) {
      fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.shorturl) {
            shareLinkInput.value = data.shorturl;
          }
        })
        .catch(() => {
          // Keep longUrl on failure
        });
    }
  }
}

function copyShareLink() {
  const text = shareLinkInput.value;
  if (!text) return;

  const performCopy = navigator.clipboard && navigator.clipboard.writeText
    ? navigator.clipboard.writeText(text)
    : new Promise((resolve) => {
        shareLinkInput.select();
        document.execCommand('copy');
        resolve();
      });

  performCopy.then(() => {
    const originalText = copyLinkBtn.textContent;
    copyLinkBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyLinkBtn.textContent = originalText;
    }, 1500);
  });
}

// File exports
function saveAsText() {
  saveCurrentNote();
  const note = notes.find((n) => n.id === currentNoteId);
  if (!note) return;

  const blob = new Blob([note.content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  closeModal(saveModal);
}

function saveAsPdf() {
  saveCurrentNote();
  const note = notes.find((n) => n.id === currentNoteId);
  if (!note) return;

  const container = document.createElement('div');
  container.style.padding = '24px';
  container.style.fontFamily = note.fontFamily || 'monospace';
  container.style.fontSize = (note.fontSize || 14) + 'px';
  container.style.lineHeight = '1.6';
  container.style.color = '#111827';
  container.style.whiteSpace = 'pre-wrap';
  container.textContent = note.content;

  const opt = {
    margin: 15,
    filename: `${note.title}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  };

  if (window.html2pdf) {
    html2pdf().set(opt).from(container).save().then(() => {
      closeModal(saveModal);
    }).catch(() => {
      closeModal(saveModal);
    });
  } else {
    closeModal(saveModal);
  }
}

function saveAsDocx() {
  saveCurrentNote();
  const note = notes.find((n) => n.id === currentNoteId);
  if (!note) return;

  const fallbackDoc = () => {
    const blob = new Blob([note.content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    closeModal(saveModal);
  };

  try {
    if (!window.docx || !window.docx.Document || !window.docx.Packer) {
      fallbackDoc();
      return;
    }

    const lines = note.content.split('\n');
    const paragraphs = lines.map((line) => {
      return new window.docx.Paragraph({
        children: [
          new window.docx.TextRun({
            text: line,
            font: note.fontFamily === 'serif' ? 'Times New Roman' : note.fontFamily === 'sans-serif' ? 'Arial' : 'Courier New',
            size: (parseInt(note.fontSize, 10) || 14) * 2,
          }),
        ],
      });
    });

    const doc = new window.docx.Document({
      sections: [{
        properties: {},
        children: paragraphs.length ? paragraphs : [new window.docx.Paragraph('')],
      }],
    });

    window.docx.Packer.toBlob(doc).then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${note.title}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      closeModal(saveModal);
    }).catch(() => {
      fallbackDoc();
    });
  } catch (e) {
    fallbackDoc();
  }
}

// Drawer toggles
hamburgerBtn.addEventListener('click', openDrawer);
if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

// Action bindings
newNoteBtn.addEventListener('click', () => {
  saveCurrentNote();
  createNewNote();
  if (window.innerWidth < 768) closeDrawer();
});

saveBtn.addEventListener('click', () => {
  openModal(saveModal);
  if (window.innerWidth < 768) closeDrawer();
});

shareBtn.addEventListener('click', () => {
  shareNote();
  if (window.innerWidth < 768) closeDrawer();
});

document.getElementById('deleteYes').addEventListener('click', deleteNote);
document.getElementById('deleteNo').addEventListener('click', () => {
  closeModal(deleteModal);
});

document.getElementById('saveTxt').addEventListener('click', saveAsText);
document.getElementById('savePdf').addEventListener('click', saveAsPdf);
document.getElementById('saveDocx').addEventListener('click', saveAsDocx);
document.getElementById('closeSave').addEventListener('click', () => {
  closeModal(saveModal);
});

copyLinkBtn.addEventListener('click', copyShareLink);
document.getElementById('closeShare').addEventListener('click', () => {
  closeModal(shareModal);
});

themeToggle.addEventListener('change', () => {
  setThemeMode(themeToggle.checked);
});

notepad.addEventListener('input', () => {
  saveCurrentNote();
  updateWordCount();
  autoResizeTextarea();
});

fontFamilySelect.addEventListener('change', () => {
  applyFontStyles();
  saveCurrentNote();
});

fontSizeSelect.addEventListener('change', () => {
  applyFontStyles();
  saveCurrentNote();
});

window.addEventListener('resize', () => {
  autoResizeTextarea();
  if (window.innerWidth >= 768) {
    sidebarDrawer.classList.remove('-translate-x-full', 'translate-x-0');
    drawerBackdrop.classList.add('hidden');
  } else {
    sidebarDrawer.classList.add('-translate-x-full');
  }
});

// Close modals & drawer when clicking outside or pressing Escape
[deleteModal, saveModal, shareModal].forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawer();
    closeModal(deleteModal);
    closeModal(saveModal);
    closeModal(shareModal);
  }
});

// Handle shared note links
const params = new URLSearchParams(window.location.search);
const encodedNote = params.get('note');

if (encodedNote) {
  try {
    let decodedContent;
    try {
      decodedContent = decodeURIComponent(atob(encodedNote));
    } catch (e) {
      decodedContent = decodeURIComponent(encodedNote);
    }

    notepad.value = decodedContent;
    notepad.disabled = true;
    notepad.placeholder = 'Shared note (read-only)';
    newNoteBtn.style.pointerEvents = 'none';
    saveBtn.style.pointerEvents = 'none';
    shareBtn.style.pointerEvents = 'none';
    fontFamilySelect.disabled = true;
    fontSizeSelect.disabled = true;
    currentNoteId = null;
    notesList.innerHTML = '<div class="p-2 text-xs sm:text-sm italic opacity-75">Viewing shared note</div>';
    updateWordCount();
    setTimeout(autoResizeTextarea, 50);
  } catch (error) {
    console.error('Failed to decode shared note:', error);
  }
}

// Initial setup
applyTheme();
if (!encodedNote) {
  initApp();
}
