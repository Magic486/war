// Firebase配置（替换为你的实际配置）
const firebaseConfig = {
  apiKey: "AIzaSyBhwtMp-MVb7Wr1czVWv6JLH5n_2WRK8Xs",
  authDomain: "myblog-497ab.firebaseapp.com",
  projectId: "myblog-497ab",
  storageBucket: "myblog-497ab.firebasestorage.app",
  messagingSenderId: "105478274500",
  appId: "1:105478274500:web:024b2b594efc4c8e3c3891",
};

// 初始化Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// 博客文章数据
const blogPosts = [
  {
    title: "我的第一个前端网页",
    date: "2025-02-16",
    content: "这是我的博客开篇文章，记录一切的起源...",
    tags: ["随笔"],
  },
];

// 通用笔记处理模块
const noteModule = (() => {
  // 初始化笔记监听
  const initNotes = () => {
    return db
      .collection("notes")
      .where("public", "==", true)
      .orderBy("date", "desc")
      .onSnapshot(handleSnapshot);
  };

  // 处理实时更新
  const handleSnapshot = (snapshot) => {
    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    }));

    // 根据当前页面渲染内容
    if (document.getElementById("notesList")) {
      renderNotesPage(notes);
    }
    if (document.getElementById("recentNotes")) {
      renderHomePage(notes);
    }
  };

  // 渲染笔记页面
  const renderNotesPage = (notes) => {
    const container = document.getElementById("notesList");
    container.innerHTML = notes
      .map(
        (note) => `
            <div class="note-item">
                <div class="note-header">
                    <span class="note-date">${formatDate(note.date)}</span>
                    <button onclick="deleteNote('${note.id}')">删除</button>
                </div>
                <div class="note-content">${note.content}</div>
            </div>
        `
      )
      .join("");
  };

  // 渲染首页最近笔记
  const renderHomePage = (notes) => {
    const container = document.getElementById("recentNotes");
    const recentNotes = notes.slice(0, 3);
    container.innerHTML = recentNotes
      .map(
        (note) => `
            <div class="home-note-item">
                <div class="note-meta">
                    <span class="note-date">${formatDate(
                      note.date,
                      true
                    )}</span>
                </div>
                <div class="note-preview">${truncateContent(
                  note.content,
                  50
                )}</div>
                <small>来自共享社区</small>
            </div>
        `
      )
      .join("");
  };

  // 格式日期
  const formatDate = (date, short = false) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: short ? undefined : "2-digit",
      minute: short ? undefined : "2-digit",
    };
    return date.toLocaleString("zh-CN", options);
  };

  // 内容截断
  const truncateContent = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return { initNotes };
})();

// 初始化博客
function initBlog() {
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = blogPosts
    .map(
      (post, index) => `
        <article class="post-card" style="animation-delay: ${index * 0.1}s">
            <h2>${post.title}</h2>
            <div class="meta">
                <span class="date">${post.date}</span>
                ${post.tags
                  .map((tag) => `<span class="tag">${tag}</span>`)
                  .join("")}
            </div>
            <p>${post.content}</p>
            <div class="post-footer">
                <button class="read-more" onclick="toggleReadMore(this)">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
        </article>
    `
    )
    .join("");
}

async function saveNote() {
  const content = document.getElementById("noteContent").value.trim();
  if (!content) {
    alert("笔记内容不能为空");
    return;
  }

  try {
    // 添加加载状态
    const saveBtn = document.querySelector(".note-editor button");
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
    saveBtn.disabled = true;

    // 添加带错误处理的数据保存
    await db.collection("notes").add({
      content: content,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      public: true,
      createdAt: new Date().toISOString(), // 添加调试字段
    });

    document.getElementById("noteContent").value = "";
  } catch (error) {
    console.error("保存失败详情:", error);
    alert(`保存失败: ${error.message}`);
  } finally {
    saveBtn.innerHTML = "保存笔记";
    saveBtn.disabled = false;
  }
}

// 删除笔记
async function deleteNote(id) {
  if (confirm("确定要删除此笔记吗？")) {
    try {
      await db.collection("notes").doc(id).delete();
    } catch (error) {
      console.error("删除失败:", error);
      alert("删除失败，请检查权限");
    }
  }
}

// 页面初始化
document.addEventListener("DOMContentLoaded", () => {
  // 初始化公共模块
  noteModule.initNotes();

  // 初始化博客页面
  if (document.getElementById("posts")) {
    initBlog();
  }
});
