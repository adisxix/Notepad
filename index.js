let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteId = null;
let deleteTargetId = null;

const notepad = document.getElementById('notepad');
const notesList = document.getElementById('notesList');
const wordCount = document.getElementById('wordCount');
const fontFamilySelect = document.getElementById('fontFamily');
const fontSizeSelect = document.getElementById('fontSize');
const shareBtn = document.getElementById('shareBtn');
const newNoteBtn = document.querySelector('[title="New Note"]');
const saveBtn = document.querySelector('[title="Save"]');
const deleteModal = document.getElementById('deleteModal');
const saveModal = document.getElementById('saveModal');
const shareModal = document.getElementById('shareModal');
const noteTemplate = document.getElementById('noteTemplate');
const themeToggle = document.getElementById('themeToggle');
const pageBody = document.getElementById('pageBody');
const headerBar = document.getElementById('headerBar');
const appShell = document.getElementById('appShell');
const toolbarBar = document.getElementById('toolbarBar');
const notesHeading = document.getElementById('notesHeading');
const fontFamilyLabel = document.getElementById('fontFamilyLabel');
const fontSizeLabel = document.getElementById('fontSizeLabel');
const wordCountWrap = document.getElementById('wordCountWrap');
const themeToggleWrap = document.getElementById('themeToggleWrap');
const mainContent = document.getElementById('mainContent');
const notesPanel = document.getElementById('notesPanel');
const deleteModalBox = document.getElementById('deleteModalBox');
const saveModalBox = document.getElementById('saveModalBox');
const shareModalBox = document.getElementById('shareModalBox');
const shareLinkInput = document.getElementById('shareLink');
const deleteYesBtn = document.getElementById('deleteYes');
const deleteNoBtn = document.getElementById('deleteNo');
const deletePrompt = document.getElementById('deletePrompt');
const saveTxtBtn = document.getElementById('saveTxt');
const savePdfBtn = document.getElementById('savePdf');
const saveDocxBtn = document.getElementById('saveDocx');
const closeSaveBtn = document.getElementById('closeSave');
const savePrompt = document.getElementById('savePrompt');
const sharePrompt = document.getElementById('sharePrompt');
const copyLinkBtn = document.getElementById('copyLink');
const closeShareBtn = document.getElementById('closeShare');
const themeToggleTrack = document.getElementById('themeToggleTrack');
const themeToggleThumb = document.getElementById('themeToggleThumb');
const saveModalButtons = [saveTxtBtn, savePdfBtn, saveDocxBtn];
const shareModalButtons = [copyLinkBtn, closeShareBtn];

const themeStorageKey = 'notepadTheme';
let isDarkMode = localStorage.getItem(themeStorageKey) === 'dark';

function applyTheme() {
const theme = isDarkMode
? {
body: '#2B1F12',
header: '#2B1F12',
shell: '#2B1F12',
main: '#2B1F12',
panel: '#2B1F12',
text: '#F5EBE1',
mutedText: '#D4995E',
border: '#896643',
toolbarText: '#F5EBE1',
textareaBg: '#2B1F12',
textareaText: '#F5EBE1',
selectBg: '#2B1F12',
selectText: '#F5EBE1',
modalBg: '#2B1F12',
modalText: '#F5EBE1',
noteBg: '#896643',
noteText: '#F5EBE1',
noteHover: '#D4995E',
inputBg: '#2B1F12',
inputText: '#F5EBE1',
inputBorder: '#D4995E',
buttonBg: '#896643',
buttonText: '#F5EBE1',
buttonHover: '#D4995E',
toggleTrack: 'linear-gradient(90deg, #2B1F12 0%, #896643 100%)',
toggleThumb: '#F5EBE1',
}
:
{
body: '#F5EBE1',
header: '#2B1F12',
shell: '#F5EBE1',
main: '#F5EBE1',
panel: '#F5EBE1',
text: '#2B1F12',
mutedText: '#D4995E',
border: '#2B1F12',
toolbarText: '#D4995E',
textareaBg: '#F5EBE1',
textareaText: '#2B1F12',
selectBg: 'transparent',
selectText: '#D4995E',
modalBg: '#F5EBE1',
modalText: '#2B1F12',
noteBg: '#D4995E',
noteText: '#F5EBE1',
noteHover: '#896643',
inputBg: '#F5EBE1',
inputText: '#2B1F12',
inputBorder: '#2B1F12',
buttonBg: '#D4995E',
buttonText: '#2B1F12',
buttonHover: '#896643',
toggleTrack: 'linear-gradient(90deg, #D4995E 0%, #896643 100%)',
toggleThumb: '#F5EBE1',
};

pageBody.style.backgroundColor = theme.body;
headerBar.style.backgroundColor = theme.header;
headerBar.style.color = '#F5EBE1';
appShell.style.backgroundColor = theme.shell;
appShell.style.borderColor = isDarkMode ? '#F5EBE1' : theme.border;
toolbarBar.style.backgroundColor = theme.header;
toolbarBar.style.color = theme.toolbarText;
notesHeading.style.borderColor = '#F5EBE1';
notesHeading.style.color = theme.toolbarText;
mainContent.style.backgroundColor = theme.main;
mainContent.style.borderColor = isDarkMode ? '#F5EBE1' : theme.border;
notesPanel.style.backgroundColor = theme.panel;
notesPanel.style.color = theme.text;
notesPanel.style.borderColor = isDarkMode ? '#F5EBE1' : theme.border;
notepad.style.backgroundColor = theme.textareaBg;
notepad.style.color = theme.textareaText;
notepad.style.borderColor = theme.border;
notepad.style.caretColor = theme.textareaText;
fontFamilySelect.style.backgroundColor = theme.selectBg;
fontFamilySelect.style.color = theme.selectText;
fontFamilySelect.style.borderColor = theme.inputBorder;
fontSizeSelect.style.backgroundColor = theme.selectBg;
fontSizeSelect.style.color = theme.selectText;
fontSizeSelect.style.borderColor = theme.inputBorder;
shareBtn.style.color = isDarkMode ? theme.text : '#D4995E';
newNoteBtn.style.color = isDarkMode ? theme.text : theme.mutedText;
saveBtn.style.color = isDarkMode ? theme.text : theme.mutedText;
wordCount.style.color = theme.mutedText;
fontFamilyLabel.style.color = theme.toolbarText;
fontSizeLabel.style.color = theme.toolbarText;
wordCountWrap.style.color = theme.toolbarText;
themeToggleWrap.style.color = theme.toolbarText;
deleteModalBox.style.backgroundColor = theme.modalBg;
deleteModalBox.style.color = theme.modalText;
deletePrompt.style.color = theme.modalText;
saveModalBox.style.backgroundColor = theme.modalBg;
saveModalBox.style.color = theme.modalText;
savePrompt.style.color = theme.modalText;
shareModalBox.style.backgroundColor = theme.modalBg;
shareModalBox.style.color = theme.modalText;
sharePrompt.style.color = theme.modalText;
shareLinkInput.style.backgroundColor = theme.inputBg;
shareLinkInput.style.color = theme.inputText;
shareLinkInput.style.borderColor = theme.inputBorder;
deleteYesBtn.style.color = theme.buttonText;
deleteNoBtn.style.color = theme.buttonText;
saveTxtBtn.style.color = '#F5EBE1';
savePdfBtn.style.color = '#F5EBE1';
saveDocxBtn.style.color = '#F5EBE1';
deleteYesBtn.style.backgroundColor = theme.buttonBg;
deleteNoBtn.style.backgroundColor = theme.buttonBg;
deleteYesBtn.onmouseenter = () => {
deleteYesBtn.style.backgroundColor = isDarkMode ? theme.buttonHover : '#896643';
};
deleteYesBtn.onmouseleave = () => {
deleteYesBtn.style.backgroundColor = theme.buttonBg;
};
deleteNoBtn.onmouseenter = () => {
deleteNoBtn.style.backgroundColor = isDarkMode ? theme.buttonHover : '#896643';
};
deleteNoBtn.onmouseleave = () => {
deleteNoBtn.style.backgroundColor = theme.buttonBg;
};
saveTxtBtn.style.backgroundColor = theme.buttonBg;
savePdfBtn.style.backgroundColor = theme.buttonBg;
saveDocxBtn.style.backgroundColor = theme.buttonBg;
copyLinkBtn.style.backgroundColor = theme.buttonBg;
closeShareBtn.style.backgroundColor = theme.buttonBg;
closeSaveBtn.style.color = theme.modalText;
copyLinkBtn.style.color = '#F5EBE1';
closeShareBtn.style.color = '#F5EBE1';
saveModalButtons.forEach(button => {
button.onmouseenter = () => {
button.style.backgroundColor = isDarkMode ? theme.buttonHover : '#896643';
};
button.onmouseleave = () => {
button.style.backgroundColor = theme.buttonBg;
};
});
shareModalButtons.forEach(button => {
button.onmouseenter = () => {
button.style.backgroundColor = isDarkMode ? '#D4995E' : '#896643';
};
button.onmouseleave = () => {
button.style.backgroundColor = theme.buttonBg;
};
});
themeToggleTrack.style.background = theme.toggleTrack;
themeToggleTrack.style.boxShadow = isDarkMode ? '0 0 0 1px rgba(217, 119, 6, 0.45) inset' : '0 0 0 1px rgba(17, 24, 39, 0.5) inset';
themeToggleTrack.style.transition = 'background 200ms ease, box-shadow 200ms ease';
themeToggleTrack.style.backgroundImage = theme.toggleTrack;
themeToggleTrack.style.borderColor = isDarkMode ? '#896643' : '#D4995E';
themeToggleTrack.style.backgroundColor = isDarkMode ? '#896643' : '#D4995E';
themeToggleThumb.style.transform = isDarkMode ? 'translateX(2rem)' : 'translateX(0)';
themeToggleThumb.style.backgroundColor = '#F5EBE1';
themeToggleThumb.style.color = '#2B1F12';
themeToggleThumb.textContent = isDarkMode ? '☾' : '☀';

document.querySelectorAll('.fi-br-square-plus, .fi-sr-disk').forEach(icon => {
icon.style.color = isDarkMode ? '#F5EBE1' : '#D4995E';
});

document.querySelectorAll('#fontFamily option, #fontSize option').forEach(option => {
option.style.color = isDarkMode ? '#F5EBE1' : '#000000';
});

document.querySelectorAll('.note-item').forEach(noteEl => {
noteEl.style.backgroundColor = theme.noteBg;
noteEl.style.color = theme.noteText;
noteEl.style.borderColor = theme.border;
noteEl.onmouseenter = () => noteEl.style.backgroundColor = theme.noteHover;
noteEl.onmouseleave = () => noteEl.style.backgroundColor = theme.noteBg;
});

document.querySelectorAll('.note-delete').forEach(button => {
button.style.color = theme.noteText;
});

themeToggle.checked = isDarkMode;
}

function setThemeMode(darkMode) {
isDarkMode = darkMode;
localStorage.setItem(themeStorageKey, darkMode ? 'dark' : 'light');
applyTheme();
}

function openModal(modal) {
modal.classList.remove('hidden');
modal.classList.add('flex');
}

function closeModal(modal) {
modal.classList.remove('flex');
modal.classList.add('hidden');
}

function initApp() {
if (notes.length === 0) {
createNewNote();
} else {
loadNote(notes[0].id);
}
renderNotes();
}

function createNewNote() {
const maxNoteNumber = notes.reduce((max, note) => {
const match = /^Note\s+(\d+)$/i.exec(note.title);
return match ? Math.max(max, Number(match[1])) : max;
}, 0);

const newNote = {
id: Date.now(),
title: `Note ${maxNoteNumber + 1}`,
content: '',
fontFamily: 'monospace',
fontSize: '14',
};
notes.push(newNote);
saveNotes();
loadNote(newNote.id);
renderNotes();
}

function loadNote(id) {
const note = notes.find(n => n.id === id);
if (note) {
currentNoteId = id;
notepad.value = note.content;
fontFamilySelect.value = note.fontFamily;
fontSizeSelect.value = note.fontSize;
applyFontStyles();
updateWordCount();
}
}

function saveCurrentNote() {
if (currentNoteId) {
const note = notes.find(n => n.id === currentNoteId);
if (note) {
note.content = notepad.value;
note.fontFamily = fontFamilySelect.value;
note.fontSize = fontSizeSelect.value;
saveNotes();
}
}
}

function saveNotes() {
localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNotes() {
notesList.innerHTML = '';
notes.forEach(note => {
const noteEl = noteTemplate.content.firstElementChild.cloneNode(true);

const titleEl = noteEl.querySelector('.note-title');
titleEl.textContent = note.title;
titleEl.onclick = () => {
saveCurrentNote();
loadNote(note.id);
renderNotes();
};

const deleteBtn = noteEl.querySelector('.note-delete');
deleteBtn.onclick = (e) => {
e.stopPropagation();
deleteTargetId = note.id;
openModal(deleteModal);
};

noteEl.appendChild(titleEl);
noteEl.appendChild(deleteBtn);
notesList.appendChild(noteEl);
});
}

function updateWordCount() {
const text = notepad.value.trim();
const words = text.length === 0 ? 0 : text.split(/\s+/).length;
wordCount.textContent = words;
}

function applyFontStyles() {
notepad.style.fontFamily = fontFamilySelect.value;
notepad.style.fontSize = fontSizeSelect.value + 'px';
}

function deleteNote() {
notes = notes.filter(n => n.id !== deleteTargetId);
saveNotes();
currentNoteId = null;
if (notes.length === 0) {
createNewNote();
} else {
loadNote(notes[0].id);
}
renderNotes();
closeModal(deleteModal);
}

function shareNote() {
if (currentNoteId) {
const note = notes.find(n => n.id === currentNoteId);
const encodedContent = btoa(unescape(encodeURIComponent(note.content)));
const baseUrl = window.location.href.split('?')[0];
const longShareLink = `${baseUrl}?note=${encodedContent}`;

shareLinkInput.value = 'Shortening link...';

fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(longShareLink)}`)
.then(response => response.json())
.then(data => {
if (data.shorturl) {
shareLinkInput.value = data.shorturl;
} else {
shareLinkInput.value = longShareLink;
console.warn('URL shortening failed, showing full URL');
}
})
.catch(error => {
console.error('Shortening error:', error);
shareLinkInput.value = longShareLink;
});

openModal(shareModal);
}
}

function copyShareLink() {
const shareLink = document.getElementById('shareLink');
shareLink.select();
document.execCommand('copy');
}

function saveAsText() {
saveCurrentNote();
const note = notes.find(n => n.id === currentNoteId);
const element = document.createElement('a');
element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(note.content));
element.setAttribute('download', `${note.title}.txt`);
element.style.display = 'none';
document.body.appendChild(element);
element.click();
document.body.removeChild(element);
closeModal(saveModal);
}

function saveAsPdf() {
saveCurrentNote();
const note = notes.find(n => n.id === currentNoteId);
const element = document.createElement('div');
element.innerHTML = `<p>${note.content.replace(/\n/g, '<br>')}</p>`;
const opt = {
margin: 10,
filename: `${note.title}.pdf`,
image: { type: 'jpeg', quality: 0.98 },
html2canvas: { scale: 2 },
jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
};
html2pdf().set(opt).from(element).save();
closeModal(saveModal);
}

function saveAsDocx() {
saveCurrentNote();
const note = notes.find(n => n.id === currentNoteId);

const fallbackSaveAsDoc = () => {
const content = `${note.content}`;
const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `${note.title}.doc`;
document.body.appendChild(a);
a.click();
window.URL.revokeObjectURL(url);
document.body.removeChild(a);
};

try {
if (!window.docx || !window.docx.Document || !window.docx.Packer) {
fallbackSaveAsDoc();
closeModal(saveModal);
return;
}

const doc = new window.docx.Document({
sections: [{
properties: {},
children: [
new window.docx.Paragraph({
text: note.content,
}),
],
}],
});

window.docx.Packer.toBlob(doc)
.then(blob => {
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `${note.title}.docx`;
document.body.appendChild(a);
a.click();
window.URL.revokeObjectURL(url);
document.body.removeChild(a);
})
.catch(() => {
fallbackSaveAsDoc();
});
} catch {
fallbackSaveAsDoc();
}

closeModal(saveModal);
}

newNoteBtn.addEventListener('click', () => {
saveCurrentNote();
createNewNote();
});

saveBtn.addEventListener('click', () => {
openModal(saveModal);
});

shareBtn.addEventListener('click', shareNote);

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

document.getElementById('copyLink').addEventListener('click', copyShareLink);
document.getElementById('closeShare').addEventListener('click', () => {
closeModal(shareModal);
});

themeToggle.addEventListener('change', () => {
setThemeMode(themeToggle.checked);
});

notepad.addEventListener('input', () => {
saveCurrentNote();
updateWordCount();
});

fontFamilySelect.addEventListener('change', () => {
applyFontStyles();
saveCurrentNote();
});

fontSizeSelect.addEventListener('change', () => {
applyFontStyles();
saveCurrentNote();
});

const params = new URLSearchParams(window.location.search);
const encodedNote = params.get('note');

if (encodedNote) {
try {
const decodedContent = decodeURIComponent(escape(atob(encodedNote)));
notepad.value = decodedContent;
notepad.disabled = true;
notepad.placeholder = 'This is a shared note (read-only)';
newNoteBtn.style.pointerEvents = 'none';
saveBtn.style.pointerEvents = 'none';
shareBtn.style.pointerEvents = 'none';
fontFamilySelect.style.pointerEvents = 'none';
fontSizeSelect.style.pointerEvents = 'none';
currentNoteId = null;
notesList.innerHTML = '';
updateWordCount();
setTimeout(() => autoResizeTextarea(), 50);
} catch (error) {
console.error('Failed to decode shared note:', error);
alert('Invalid shared note link');
}
}

function autoResizeTextarea() {
    notepad.style.height = 'auto';
    notepad.style.height = notepad.scrollHeight + 'px';
}

notepad.addEventListener('input', autoResizeTextarea);
notepad.addEventListener('change', autoResizeTextarea);

if (!encodedNote) {
initApp();
}
applyTheme();
autoResizeTextarea();
