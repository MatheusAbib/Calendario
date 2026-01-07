const daysEl = document.getElementById("days");
const monthYear = document.getElementById("month-year");
const modal = document.getElementById("modal");
const modalDate = document.getElementById("modal-date");
const input = document.getElementById("event-input");

const saveBtn = document.getElementById("save");
const deleteBtn = document.getElementById("delete");
const closeBtn = document.getElementById("close");

let currentDate = new Date();
let selectedDate = null;

const events = JSON.parse(localStorage.getItem("events")) || {};

const holidays = {
    "1-1": "Ano Novo",
    "21-4": "Tiradentes",
    "1-5": "Dia do Trabalho",
    "7-9": "Independência",
    "12-10": "Nossa Senhora",
    "2-11": "Finados",
    "15-11": "Proclamação",
    "25-12": "Natal"
};

function renderCalendar() {
    daysEl.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.innerText = currentDate.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        daysEl.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= lastDate; day++) {
        const dateEl = document.createElement("div");
        const dateKey = `${year}-${month + 1}-${day}`;

        dateEl.innerText = day;

        const date = new Date(year, month, day);
        if (date.getDay() === 0 || date.getDay() === 6) {
            dateEl.classList.add("weekend");
        }

        const today = new Date();
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dateEl.classList.add("today");
        }

        if (events[dateKey] || holidays[`${day}-${month + 1}`]) {
            dateEl.classList.add("event");
        }

        dateEl.onclick = () => openModal(dateKey, day);
        daysEl.appendChild(dateEl);
    }
}

function openModal(dateKey, day) {
    selectedDate = dateKey;
    modalDate.innerText = dateKey;
    input.value = events[dateKey] || "";
    modal.style.display = "flex";
}

saveBtn.onclick = () => {
    if (input.value.trim()) {
        events[selectedDate] = input.value;
    }
    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
};

deleteBtn.onclick = () => {
    delete events[selectedDate];
    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
};

closeBtn.onclick = closeModal;

function closeModal() {
    modal.style.display = "none";
    renderCalendar();
}

document.getElementById("prev").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
};

document.getElementById("next").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
};

renderCalendar();
