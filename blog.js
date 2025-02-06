// 博客文章数据
const blogPosts = [
  {
    title: "我的第一篇博客",
    date: "2024-03-15",
    content: "这是我的博客开篇文章，记录技术学习历程...",
    tags: ["随笔", "学习"],
  },
  // 可添加更多文章
];

// 初始化博客
function initBlog() {
  const postsContainer = document.getElementById("posts");

  blogPosts.forEach((post) => {
    const postHTML = `
            <article class="post-card">
                <h2>${post.title}</h2>
                <div class="meta">
                    <span class="date">${post.date}</span>
                    ${post.tags
                      .map((tag) => `<span class="tag">${tag}</span>`)
                      .join("")}
                </div>
                <p>${post.content}</p>
            </article>
        `;
    postsContainer.innerHTML += postHTML;
  });
}

// 笔记功能
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNote() {
  const content = document.getElementById("noteContent").value;
  if (content) {
    const newNote = {
      id: Date.now(),
      content: content,
      date: new Date().toLocaleString(),
    };
    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));
    document.getElementById("noteContent").value = "";
    loadNotes();
  }
}

function loadNotes() {
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = notes
    .map(
      (note) => `
        <div class="note-item">
            <div class="note-date">${note.date}</div>
            <p>${note.content}</p>
            <button onclick="deleteNote(${note.id})">删除</button>
        </div>
    `
    )
    .join("");
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  localStorage.setItem("notes", JSON.stringify(notes));
  loadNotes();
}

// 初始化
if (document.getElementById("posts")) {
  initBlog();
}

if (document.getElementById("notesList")) {
  loadNotes();
}
