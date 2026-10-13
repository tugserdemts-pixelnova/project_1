let tasks = [];
let filter = "all";
try { tasks = JSON.parse(localStorage.getItem("tasks") || "[]"); } catch (e) { tasks = []; }

const list = document.getElementById("list");
const input = document.getElementById("input");

function save() {
  try { localStorage.setItem("tasks", JSON.stringify(tasks)); } catch (e) {}
}

function render() {
  const shown = tasks.filter(t => filter === "all" || (filter === "done" ? t.done : !t.done));
  list.innerHTML = "";
  if (!shown.length) {
    const p = document.createElement("li");
    p.className = "empty";
    p.textContent = tasks.length ? "No tasks in this view." : "No tasks yet. Add your first one above.";
    list.appendChild(p);
  }
  shown.forEach(t => {
    const li = document.createElement("li");
    if (t.done) li.className = "done";
    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.checked = t.done;
    cb.setAttribute("aria-label", "Mark done: " + t.text);
    cb.onchange = () => { t.done = cb.checked; save(); render(); };
    const label = document.createElement("span");
    label.textContent = t.text;
    const del = document.createElement("button");
    del.className = "del"; del.textContent = "Delete";
    del.setAttribute("aria-label", "Delete: " + t.text);
    del.onclick = () => { tasks = tasks.filter(x => x.id !== t.id); save(); render(); };
    li.append(cb, label, del);
    list.appendChild(li);
  });
  const left = tasks.filter(t => !t.done).length;
  document.getElementById("count").textContent = left + (left === 1 ? " task left" : " tasks left");
}

document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ id: Date.now(), text, done: false });
  input.value = "";
  save(); render();
});

document.querySelectorAll(".filters button").forEach(b => {
  b.onclick = () => {
    filter = b.dataset.f;
    document.querySelectorAll(".filters button").forEach(x => x.setAttribute("aria-pressed", x === b));
    render();
  };
});

document.getElementById("clear").onclick = () => {
  tasks = tasks.filter(t => !t.done);
  save(); render();
};

render();