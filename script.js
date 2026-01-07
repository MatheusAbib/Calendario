
        const calendarLoading = document.getElementById("calendar-loading");
        const calendarLoadingText = document.getElementById("calendar-loading-text");

        const calendarContent = document.getElementById("calendar-content");
        const monthYear = document.getElementById("month-year");
        const modal = document.getElementById("modal");
        const modalDate = document.getElementById("modal-date");
        const input = document.getElementById("event-input");
        const eventList = document.getElementById("event-list");
        const holidaysLoading = document.getElementById("holidays-loading");
        const holidayCountEl = document.getElementById("holiday-count");
        const eventCountEl = document.getElementById("event-count");
        const holidayModal = document.getElementById("holiday-modal");
        const holidayModalName = document.getElementById("holiday-modal-name");
        const holidayModalDate = document.getElementById("holiday-modal-date");
        const holidayModalClose = document.getElementById("holiday-modal-close");
        const holidayModalAddEvent = document.getElementById("holiday-modal-add-event");
        const appTitleYear = document.getElementById("current-year");
        const currentDateDisplay = document.getElementById("current-date-display");
        const nextHolidayDisplay = document.getElementById("next-holiday-display");
        const nextHolidayDays = document.getElementById("next-holiday-days");
        
        const saveBtn = document.getElementById("save");
        const deleteBtn = document.getElementById("delete");
        const closeBtn = document.getElementById("close");
        const prevBtn = document.getElementById("prev");
        const nextBtn = document.getElementById("next");
        const themeToggle = document.getElementById("theme-toggle");
        const todayBtn = document.getElementById("today-btn");
        const refreshHolidaysBtn = document.getElementById("refresh-holidays");
        const eventListToggle = document.getElementById("event-list-toggle");
        
        const recurrenceToggle = document.getElementById("recurrence-toggle");
        const recurrenceOptions = document.getElementById("recurrence-options");
        const recurrenceTypeRadios = document.querySelectorAll('input[name="recurrence-type"]');
        const weeklyOptions = document.getElementById("weekly-options");
        const monthlyOptions = document.getElementById("monthly-options");
        const recurrenceEndSelect = document.getElementById("recurrence-end");
        const recurrenceCountInput = document.getElementById("recurrence-count");
        const recurrenceEndDateInput = document.getElementById("recurrence-end-date");


        const confirmModal = document.getElementById("confirm-modal");
        const confirmTitle = document.getElementById("confirm-title");
        const confirmMessage = document.getElementById("confirm-message");
        const confirmYesBtn = document.getElementById("confirm-yes");
        const confirmNoBtn = document.getElementById("confirm-no");

        let confirmCallback = null;
        let confirmType = 'info';
        
        let currentDate = new Date();
        let selectedDate = null;
        let events = JSON.parse(localStorage.getItem("events")) || {};
        let recurringEvents = JSON.parse(localStorage.getItem("recurringEvents")) || {};
        let dynamicHolidays = JSON.parse(localStorage.getItem("dynamicHolidays")) || {};
        let theme = localStorage.getItem("theme") || "light";
        let eventListVisible = true;
        let allHolidays = [];
        let isAnimating = false;
        let showSeasons = localStorage.getItem("showSeasons") === "true";

        const staticHolidays = {
            "1-1": "Ano Novo",
            "21-4": "Tiradentes",
            "1-5": "Dia do Trabalho",
            "7-9": "Independência do Brasil",
            "12-10": "Nossa Senhora Aparecida",
            "2-11": "Finados",
            "15-11": "Proclamação da República",
            "25-12": "Natal"
        };

        document.documentElement.setAttribute("data-theme", theme);
        themeToggle.innerHTML = theme === "dark" 
            ? '<i class="fas fa-sun"></i>  Tema Claro' 
            : '<i class="fas fa-moon"></i>  Tema Escuro';

        function updateAppTitle() {
            const year = currentDate.getFullYear();
            appTitleYear.textContent = year;
        }

        function updateCurrentDate() {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
            };
            const formattedDate = now.toLocaleDateString('pt-BR', options);
            currentDateDisplay.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        }

        function updateNextHoliday() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            let nextHoliday = null;
            let minDaysDiff = Infinity;
            
            allHolidays.forEach(holiday => {
                const holidayDate = new Date(holiday.date);
                holidayDate.setHours(0, 0, 0, 0);
                
                const timeDiff = holidayDate.getTime() - today.getTime();
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                
                if (daysDiff > 0 && daysDiff < minDaysDiff) {
                    minDaysDiff = daysDiff;
                    nextHoliday = holiday;
                }
            });
            
            if (nextHoliday) {
                const holidayDate = new Date(nextHoliday.date);
                const formattedDate = holidayDate.toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'short'
                }).replace('.', '');
                
                nextHolidayDisplay.textContent = `${formattedDate} - ${nextHoliday.name}`;
                
                if (minDaysDiff === 1) {
                    nextHolidayDays.textContent = "Amanhã!";
                } else {
                    nextHolidayDays.textContent = `Em ${minDaysDiff} dias`;
                }
            } else {
                nextHolidayDisplay.textContent = "Nenhum feriado encontrado";
                nextHolidayDays.textContent = "-";
            }
        }

        async function fetchHolidays(year) {
            holidaysLoading.style.display = "block";
            
            try {
                const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/BR`);
                if (!response.ok) throw new Error("Falha ao buscar feriados");
                
                const holidays = await response.json();
                const formattedHolidays = {};
                allHolidays = [];
                
                holidays.forEach(holiday => {
                    const date = new Date(holiday.date);
                    const adjustedDate = new Date(date.getTime() + (3 * 60 * 60 * 1000));
                    const key = `${adjustedDate.getDate()}-${adjustedDate.getMonth() + 1}`;
                    formattedHolidays[key] = holiday.localName;
                    
                    allHolidays.push({
                        date: adjustedDate,
                        name: holiday.localName,
                        key: key
                    });
                });
                
                dynamicHolidays = formattedHolidays;
                localStorage.setItem("dynamicHolidays", JSON.stringify(dynamicHolidays));
                
                holidaysLoading.style.display = "none";
                renderCalendar();
                renderEventList();
                updateNextHoliday();
                return true;
            } catch (error) {
                console.error("Erro ao buscar feriados:", error);
                holidaysLoading.style.display = "none";
                dynamicHolidays = staticHolidays;
                
                allHolidays = [];
                const currentYear = currentDate.getFullYear();
                
                Object.keys(staticHolidays).forEach(key => {
                    const [day, month] = key.split("-").map(Number);
                    const date = new Date(currentYear, month - 1, day);
                    
                    allHolidays.push({
                        date: date,
                        name: staticHolidays[key],
                        key: key
                    });
                });
                
                updateNextHoliday();
                return false;
            }
        }

        function generateRecurringEventsForDate(date) {
            const dateStr = formatDateKey(date);
            const generatedEvents = [];
            
            Object.keys(recurringEvents).forEach(recurringId => {
                const recurringEvent = recurringEvents[recurringId];
                const startDate = new Date(recurringEvent.startDate);
                startDate.setHours(0, 0, 0, 0);
                
                if (date < startDate) return;
                
                if (recurringEvent.endCondition === 'date') {
                    const endDate = new Date(recurringEvent.endDate);
                    if (date > endDate) return;
                } else if (recurringEvent.endCondition === 'count') {
                    let occurrences = 0;
                    const tempDate = new Date(startDate);
                    
                    while (tempDate <= date && occurrences < recurringEvent.occurrenceCount) {
                        if (shouldGenerateEventOnDate(recurringEvent, tempDate)) {
                            occurrences++;
                            if (formatDateKey(tempDate) === dateStr && occurrences <= recurringEvent.occurrenceCount) {
                                generatedEvents.push({
                                    ...recurringEvent,
                                    originalId: recurringId
                                });
                                break;
                            }
                        }
                        tempDate.setDate(tempDate.getDate() + 1);
                    }
                    return;
                }
                
                if (shouldGenerateEventOnDate(recurringEvent, date)) {
                    generatedEvents.push({
                        ...recurringEvent,
                        originalId: recurringId
                    });
                }
            });
            
            return generatedEvents;
        }

        function shouldGenerateEventOnDate(recurringEvent, date) {
            const startDate = new Date(recurringEvent.startDate);
            startDate.setHours(0, 0, 0, 0);
            
            if (date < startDate) return false;
            
            const diffTime = date.getTime() - startDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            switch (recurringEvent.type) {
                case 'daily':
                    return true;
                    
                case 'weekly':
                    if (!recurringEvent.daysOfWeek || recurringEvent.daysOfWeek.length === 0) {
                        return date.getDay() === startDate.getDay();
                    }
                    return recurringEvent.daysOfWeek.includes(date.getDay().toString());
                    
                case 'monthly':
                    if (recurringEvent.monthlyOption === 'same-day') {
                        return date.getDate() === startDate.getDate();
                    } else {
                        const startWeek = Math.ceil(startDate.getDate() / 7);
                        const currentWeek = Math.ceil(date.getDate() / 7);
                        return date.getDay() === startDate.getDay() && startWeek === currentWeek;
                    }
                    
                case 'yearly':
                    return date.getDate() === startDate.getDate() && 
                           date.getMonth() === startDate.getMonth();
                    
                default:
                    return false;
            }
        }

        function formatDateKey(date) {
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }

       function calculateCalendarHeight() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    const totalCells = firstDay + lastDate;
    
    const rows = Math.ceil(totalCells / 7);
    
    const cellHeight = 120;
    const weekdayHeight = 48;
    const padding = 40;
    
    const totalHeight = (rows * cellHeight) + weekdayHeight + padding;
    
    return totalHeight;
}
 async function renderCalendar(showLoading = false) {
    if (showLoading) {
        toggleSpinner(true, "Carregando calendário...");
    }
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    updateAppTitle();
    monthYear.innerText = currentDate.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
    }).replace(/^./, c => c.toUpperCase());
    
    const calendarHeight = calculateCalendarHeight();
    calendarContent.style.height = calendarHeight + 'px';
    
    const monthContainer = document.createElement("div");
    monthContainer.className = "calendar-month current";
    monthContainer.dataset.year = year;
    monthContainer.dataset.month = month;
    monthContainer.style.height = calendarHeight + 'px';
    
    const weekdays = document.createElement("div");
    weekdays.className = "weekdays";
    weekdays.innerHTML = `
        <div>Dom</div>
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div>Sáb</div>
    `;
    monthContainer.appendChild(weekdays);
    
    const daysContainer = document.createElement("div");
    daysContainer.className = "days";
    
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    for (let i = 0; i < firstDay; i++) {
        daysContainer.appendChild(document.createElement("div"));
    }
    
    let holidayCount = 0;
    let personalEventCount = 0;
    
    for (let day = 1; day <= lastDate; day++) {
        const dateEl = document.createElement("div");
        const date = new Date(year, month, day);
        const dateKey = formatDateKey(date);
        const holidayKey = `${day}-${month + 1}`;
        
        const dayNumber = document.createElement("div");
        dayNumber.className = "day-number";
        dayNumber.textContent = day;
        dateEl.appendChild(dayNumber);
        
        const dayIndicators = document.createElement("div");
        dayIndicators.className = "day-indicators";
        
        let eventCount = 0;
        let hasHoliday = false;
        let hasPersonalEvent = false;
        
        if (dynamicHolidays[holidayKey]) {
            holidayCount++;
            hasHoliday = true;
            const holidayIndicator = createIndicator("holiday", dynamicHolidays[holidayKey], dateKey, day);
            dayIndicators.appendChild(holidayIndicator);
            eventCount++;
        }
        
        if (events[dateKey]) {
            personalEventCount++;
            hasPersonalEvent = true;
            const eventData = events[dateKey];
            const eventIndicator = createIndicator(
                eventData.category || "personal", 
                eventData.text, 
                dateKey, 
                day,
                eventData.isRecurring
            );
            dayIndicators.appendChild(eventIndicator);
            eventCount++;
        }
        
        const recurringEventsForDate = generateRecurringEventsForDate(date);
        recurringEventsForDate.forEach(recurringEvent => {
            personalEventCount++;
            hasPersonalEvent = true;
            const eventIndicator = createIndicator(
                recurringEvent.category || "personal", 
                recurringEvent.text, 
                dateKey, 
                day,
                true
            );
            dayIndicators.appendChild(eventIndicator);
            eventCount++;
        });
        
        // ADICIONAR INDICADOR DE ESTAÇÃO SE ATIVO
        if (showSeasons) {
            addSeasonIndicator(dateEl, date);
        }
        
        if (eventCount > 3) {
            dayIndicators.classList.add("compact-indicators");
        }
        
        dateEl.appendChild(dayIndicators);
        
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
        
        dateEl.onclick = (e) => {
            if (!e.target.closest('.indicator') && !e.target.closest('.season-indicator')) {
                if (hasHoliday && !hasPersonalEvent) {
                    openHolidayModal(dateKey, day, dynamicHolidays[holidayKey]);
                } else if (!hasHoliday && hasPersonalEvent) {
                    const recurringEvent = recurringEventsForDate[0];
                    if (recurringEvent) {
                        openRecurringEventModal(dateKey, day, recurringEvent);
                    } else {
                        openModal(dateKey, day);
                    }
                } else {
                    openModal(dateKey, day);
                }
            }
        };
        
        daysContainer.appendChild(dateEl);
    }
    
    monthContainer.appendChild(daysContainer);
    
    calendarContent.innerHTML = '';
    
    calendarContent.appendChild(monthContainer);
    
    holidayCountEl.textContent = holidayCount;
    eventCountEl.textContent = personalEventCount;
    renderEventList();
    
    // Adicionar/remover legenda das estações
    const seasonLegend = addSeasonLegend();
    if (showSeasons) {
        seasonLegend.classList.add('show');
    } else {
        seasonLegend.classList.remove('show');
    }
    
    if (showLoading) {
        setTimeout(() => {
            toggleSpinner(false);
        }, 500);
    }
}

        function createIndicator(type, tooltipText, dateKey, day, isRecurring = false) {
            const indicator = document.createElement("div");
            indicator.className = `indicator ${type}`;
            indicator.title = tooltipText;
            
            const icon = document.createElement("i");
            icon.className = type === "holiday" ? "fas fa-flag" : 
                            type === "work" ? "fas fa-briefcase" :
                            type === "health" ? "fas fa-heartbeat" :
                            type === "leisure" ? "fas fa-gamepad" : "fas fa-check";
            icon.style.pointerEvents = "none";
            
            const tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            tooltip.textContent = tooltipText + (isRecurring ? " 🔄" : "");
            tooltip.style.pointerEvents = "none";
            
            indicator.appendChild(icon);
            indicator.appendChild(tooltip);
            
            indicator.onclick = (e) => {
                e.stopPropagation();
                
                if (type === "holiday") {
                    const holidayKey = `${day}-${currentDate.getMonth() + 1}`;
                    openHolidayModal(dateKey, day, dynamicHolidays[holidayKey]);
                } else {
                    openModal(dateKey, day);
                }
            };
            
            indicator.addEventListener('mouseenter', function() {
                const tooltip = this.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.style.visibility = 'visible';
                    tooltip.style.opacity = '1';
                }
            });
            
            indicator.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                }
            });
            
            return indicator;
        }

        function renderEventList() {
            eventList.innerHTML = "";
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            
            const monthEvents = [];
            
            Object.keys(dynamicHolidays).forEach(key => {
                const [day, holidayMonth] = key.split("-").map(Number);
                if (holidayMonth === month) {
                    monthEvents.push({
                        date: new Date(year, month - 1, day),
                        text: dynamicHolidays[key],
                        type: 'holiday',
                        day: day,
                        isRecurring: false
                    });
                }
            });
            
            Object.keys(events).forEach(dateKey => {
                const [eventYear, eventMonth, eventDay] = dateKey.split("-").map(Number);
                
                if (eventYear === year && eventMonth === month) {
                    const eventData = events[dateKey];
                    monthEvents.push({
                        date: new Date(eventYear, eventMonth - 1, eventDay),
                        text: eventData.text,
                        type: eventData.category || 'personal',
                        day: eventDay,
                        isRecurring: false
                    });
                }
            });
            
            for (let day = 1; day <= 31; day++) {
                try {
                    const date = new Date(year, month - 1, day);
                    if (date.getMonth() !== month - 1) break;
                    
                    const recurringEventsForDate = generateRecurringEventsForDate(date);
                    recurringEventsForDate.forEach(recurringEvent => {
                        monthEvents.push({
                            date: date,
                            text: recurringEvent.text,
                            type: recurringEvent.category || 'personal',
                            day: day,
                            isRecurring: true,
                            originalId: recurringEvent.originalId
                        });
                    });
                } catch (e) {
                    break;
                }
            }
            
            monthEvents.sort((a, b) => a.day - b.day);
            
            monthEvents.forEach(event => {
                const listItem = document.createElement("li");
                listItem.className = `event-list-item ${event.type}-item`;
                
                const dateStr = event.date.toLocaleDateString("pt-BR", {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short'
                }).replace(/\./g, '');
                
                const badgeClass = `${event.type}-badge`;
                const badgeText = event.type === 'holiday' ? 'Feriado' :
                                 event.type === 'work' ? 'Trabalho' :
                                 event.type === 'health' ? 'Saúde' :
                                 event.type === 'leisure' ? 'Lazer' : 'Pessoal';
                
                listItem.innerHTML = `
                    <div class="event-date">${dateStr}</div>
                    <div class="event-text">${event.text} 
                        ${event.isRecurring ? '<span class="recurring-badge"><i class="fas fa-redo"></i> Recorrente</span>' : ''}
                    </div>
                    <span class="event-type-badge ${badgeClass}">${badgeText}</span>
                `;
                
                listItem.onclick = () => {
                    const day = event.day;
                    const dateKey = `${year}-${month}-${day}`;
                    
                    if (event.type === 'holiday') {
                        const holidayKey = `${day}-${month}`;
                        openHolidayModal(dateKey, day, dynamicHolidays[holidayKey]);
                    } else if (event.isRecurring) {
                        openRecurringEventModal(dateKey, day, event);
                    } else {
                        openModal(dateKey, day);
                    }
                };
                
                eventList.appendChild(listItem);
            });
            
            if (monthEvents.length === 0) {
                const listItem = document.createElement("li");
                listItem.className = "event-list-item";
                listItem.innerHTML = `
                    <div class="event-text" style="text-align: center; width: 100%;">
                        <i class="far fa-calendar-times" style="font-size: 1.2em; margin-right: 8px;"></i>
                        Nenhum compromisso ou feriado este mês
                    </div>`;
                eventList.appendChild(listItem);
            }
        }

        function openRecurringEventModal(dateKey, day, event) {
            showModalMessage("Evento Recorrente", `Evento recorrente: ${event.text}\n\nEste é um evento recorrente. Para editá-lo, você precisa excluir a série completa.`, 'info');
        }

        function openModal(dateKey, day) {
            selectedDate = dateKey;
            const [year, month] = dateKey.split("-");
            const formattedDate = new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).replace(/^./, c => c.toUpperCase());
            
            modalDate.innerText = formattedDate;
            
            const existingEvent = events[dateKey];
            if (existingEvent) {
                input.value = existingEvent.text;
                document.querySelector(`#category-${existingEvent.category || 'personal'}`).checked = true;
                
                if (existingEvent.recurringId) {
                    recurrenceToggle.checked = true;
                    recurrenceOptions.classList.add('show');
                }
                
                deleteBtn.style.display = "block";
            } else {
                input.value = "";
                document.querySelector('#category-personal').checked = true;
                recurrenceToggle.checked = false;
                recurrenceOptions.classList.remove('show');
                deleteBtn.style.display = "none";
                
                document.querySelector('#recurrence-daily').checked = true;
                weeklyOptions.classList.remove('show');
                monthlyOptions.classList.remove('show');
                recurrenceEndSelect.value = 'never';
                recurrenceCountInput.style.display = 'none';
                recurrenceEndDateInput.style.display = 'none';
            }
            
            modal.style.display = "flex";
            input.focus();
            holidayModal.style.display = "none";
        }

        function openHolidayModal(dateKey, day, holidayName) {
            selectedDate = dateKey;
            const [year, month] = dateKey.split("-");
            const formattedDate = new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).replace(/^./, c => c.toUpperCase());
            
            holidayModalName.textContent = holidayName;
            holidayModalDate.textContent = formattedDate;
            holidayModal.style.display = "flex";
            modal.style.display = "none";
        }

        recurrenceToggle.addEventListener('change', function() {
            if (this.checked) {
                recurrenceOptions.classList.add('show');
            } else {
                recurrenceOptions.classList.remove('show');
            }
        });

        recurrenceTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'weekly') {
                    weeklyOptions.classList.add('show');
                    monthlyOptions.classList.remove('show');
                } else if (this.value === 'monthly') {
                    weeklyOptions.classList.remove('show');
                    monthlyOptions.classList.add('show');
                } else {
                    weeklyOptions.classList.remove('show');
                    monthlyOptions.classList.remove('show');
                }
            });
        });

        recurrenceEndSelect.addEventListener('change', function() {
            if (this.value === 'count') {
                recurrenceCountInput.style.display = 'block';
                recurrenceEndDateInput.style.display = 'none';
            } else if (this.value === 'date') {
                recurrenceCountInput.style.display = 'none';
                recurrenceEndDateInput.style.display = 'block';
            } else {
                recurrenceCountInput.style.display = 'none';
                recurrenceEndDateInput.style.display = 'none';
            }
        });

        saveBtn.onclick = () => {
            if (!input.value.trim()) {
                showModalMessage("Atenção", "Por favor, digite uma descrição para o compromisso.", 'warning');
                return;
            }
            
            const category = document.querySelector('input[name="category"]:checked').value;
            const eventData = {
                text: input.value.trim(),
                category: category,
                date: selectedDate
            };
            
            if (recurrenceToggle.checked) {
                const recurrenceType = document.querySelector('input[name="recurrence-type"]:checked').value;
                const endCondition = recurrenceEndSelect.value;
                
                const recurringEvent = {
                    text: input.value.trim(),
                    category: category,
                    startDate: selectedDate,
                    type: recurrenceType,
                    endCondition: endCondition
                };
                
                if (recurrenceType === 'weekly') {
                    const selectedDays = [];
                    document.querySelectorAll('#weekly-options input[type="checkbox"]:checked').forEach(cb => {
                        selectedDays.push(cb.value);
                    });
                    recurringEvent.daysOfWeek = selectedDays;
                } else if (recurrenceType === 'monthly') {
                    recurringEvent.monthlyOption = document.getElementById('monthly-option').value;
                }
                
                if (endCondition === 'count') {
                    recurringEvent.occurrenceCount = parseInt(recurrenceCountInput.value) || 10;
                } else if (endCondition === 'date') {
                    recurringEvent.endDate = recurrenceEndDateInput.value;
                }
                
                const recurringId = 'recurring_' + Date.now();
                recurringEvents[recurringId] = recurringEvent;
                localStorage.setItem("recurringEvents", JSON.stringify(recurringEvents));
                
                delete events[selectedDate];
            } else {
                events[selectedDate] = eventData;
                deleteBtn.style.display = "block";
            }
            
            localStorage.setItem("events", JSON.stringify(events));
            closeModal();
        };

        deleteBtn.onclick = async () => {
                const shouldDelete = await showConfirmModal(
                    "Excluir Compromisso", 
                    "Tem certeza que deseja excluir este compromisso?",
                    'warning'
                );
                
                if (!shouldDelete) return;
                
                const eventData = events[selectedDate];
                
                if (eventData && eventData.recurringId) {
                    const deleteChoice = await showConfirmModal(
                        "Evento Recorrente",
                        "Este é um evento recorrente. Deseja excluir apenas este evento ou toda a série?\n\nClique em SIM para excluir toda a série.\nClique em NÃO para excluir apenas este evento.",
                        'warning'
                    );
                    
                    if (deleteChoice) {
                        const confirmSeries = await showConfirmModal(
                            "Confirmar Exclusão",
                            "Tem certeza que deseja excluir TODA a série de eventos recorrentes?\nEsta ação não pode ser desfeita.",
                            'error'
                        );
                        
                        if (confirmSeries) {
                            delete recurringEvents[eventData.recurringId];
                            localStorage.setItem("recurringEvents", JSON.stringify(recurringEvents));
                        }
                    } else {
                        if (!eventData.excludedDates) {
                            eventData.excludedDates = [];
                        }
                        eventData.excludedDates.push(selectedDate);
                        events[selectedDate] = eventData;
                        localStorage.setItem("events", JSON.stringify(events));
                    }
                } else {
                    delete events[selectedDate];
                    localStorage.setItem("events", JSON.stringify(events));
                }
                
                closeModal();
            };

        closeBtn.onclick = closeModal;

function closeModal() {
    modal.style.display = "none";
    renderCalendar(true);
}

        holidayModalClose.onclick = () => {
            holidayModal.style.display = "none";
        };

        holidayModalAddEvent.onclick = () => {
            holidayModal.style.display = "none";
            const [year, month, day] = selectedDate.split("-").map(Number);
            openModal(selectedDate, day);
        };

        themeToggle.onclick = () => {
            theme = theme === "light" ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
            
            themeToggle.innerHTML = theme === "dark" 
                ? '<i class="fas fa-sun"></i>  Tema Claro' 
                : '<i class="fas fa-moon"></i>  Tema Escuro';
        };

        eventListToggle.onclick = () => {
            const eventListSection = document.querySelector('.event-list-section');
            eventListVisible = !eventListVisible;
            
            if (window.innerWidth <= 767) {
                eventListSection.style.display = eventListVisible ? 'block' : 'none';
                eventListToggle.innerHTML = eventListVisible 
                    ? '<i class="fas fa-list"></i> Ocultar Compromissos' 
                    : '<i class="fas fa-list"></i> Mostrar Compromissos';
            }
        };

            prevBtn.onclick = () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar(true);
            };

            nextBtn.onclick = () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar(true);
            };

            todayBtn.onclick = () => {
                currentDate = new Date();
                renderCalendar(true);
                updateCurrentDate();
                updateNextHoliday();
            };

        refreshHolidaysBtn.onclick = () => {
            const year = currentDate.getFullYear();
            fetchHolidays(year);
        };

async function limparLocalStorage() {
    const shouldClear = await showConfirmModal(
        "Limpar Dados",
        "Tem certeza que deseja apagar todos os dados salvos?\n\nEsta ação não pode ser desfeita!",
        'error'
    );
    
    if (!shouldClear) return;
    
    toggleSpinner(true, "Limpando dados...");
    
    setTimeout(() => {
        localStorage.clear();
        events = {};
        recurringEvents = {};
        
        showModalMessage("Sucesso", "LocalStorage limpo com sucesso!", 'info');
        renderCalendar(true);
    }, 300);
}

        window.onclick = (event) => {
            if (event.target === modal) closeModal();
            if (event.target === holidayModal) holidayModal.style.display = "none";
            if (event.target === confirmModal) confirmModal.style.display = "none";
        };

document.addEventListener("DOMContentLoaded", () => {
    updateAppTitle();
    updateCurrentDate();
    updateYearProgress(); 
    fetchHolidays(currentDate.getFullYear());
    renderCalendar();
    
    if (window.innerWidth <= 767) {
        document.querySelector('.event-list-section').style.display = 'none';
        eventListToggle.innerHTML = '<i class="fas fa-list"></i> Mostrar Compromissos';
        eventListVisible = false;
    }
    
    setInterval(() => {
        updateCurrentDate();
        updateYearProgress(); // ADICIONAR AQUI TAMBÉM
    }, 60000);

    // Configurar botão de estações
const seasonToggle = document.getElementById('season-toggle');
seasonToggle.innerHTML = showSeasons 
    ? '<i class="fas fa-leaf"></i> Ocultar Estações' 
    : '<i class="fas fa-leaf"></i> Estações';
    
if (showSeasons) {
    seasonToggle.classList.add('active');
}

seasonToggle.addEventListener('click', () => {
    showSeasons = !showSeasons;
    localStorage.setItem("showSeasons", showSeasons);
    
    seasonToggle.innerHTML = showSeasons 
        ? '<i class="fas fa-leaf"></i> Ocultar Estações' 
        : '<i class="fas fa-leaf"></i> Estações';
    
    if (showSeasons) {
        seasonToggle.classList.add('active');
        renderCalendar(true);
    } else {
        seasonToggle.classList.remove('active');
        // Remover indicadores de estação
        removeSeasonIndicators();
        // Esconder legenda
        const seasonLegend = document.querySelector('.season-legend');
        if (seasonLegend) {
            seasonLegend.classList.remove('show');
        }
    }
});
});


function showModalMessage(title, message, type = 'info') {
    confirmTitle.innerHTML = `<i class="fas ${type === 'warning' ? 'fa-exclamation-triangle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i> ${title}`;
    confirmMessage.textContent = message;
    confirmYesBtn.textContent = "OK";
    confirmNoBtn.style.display = "none";
    
    confirmModal.style.display = "flex";
    
    return new Promise((resolve) => {
        confirmYesBtn.onclick = () => {
            confirmModal.style.display = "none";
            confirmNoBtn.style.display = "block";
            confirmYesBtn.textContent = "Sim";
            resolve(true);
        };
    });
}

function showConfirmModal(title, message, type = 'warning') {
    confirmTitle.innerHTML = `<i class="fas ${type === 'warning' ? 'fa-exclamation-triangle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i> ${title}`;
    confirmMessage.textContent = message;
    confirmYesBtn.textContent = "Sim";
    confirmNoBtn.style.display = "block";
    
    confirmModal.style.display = "flex";
    
    return new Promise((resolve) => {
        confirmYesBtn.onclick = () => {
            confirmModal.style.display = "none";
            resolve(true);
        };
        
        confirmNoBtn.onclick = () => {
            confirmModal.style.display = "none";
            resolve(false);
        };
    });
}

function toggleSpinner(show, text = "Atualizando...") {
    if (show) {
        calendarLoadingText.textContent = text;
        calendarLoading.classList.add("active");
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        todayBtn.disabled = true;
    } else {
        calendarLoading.classList.remove("active");
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        todayBtn.disabled = false;
    }
}

// Função para calcular e atualizar progresso do ano
function updateYearProgress() {
    const now = new Date();
    const year = now.getFullYear();
    
    // Primeiro dia do ano
    const yearStart = new Date(year, 0, 1);
    // Último dia do ano
    const yearEnd = new Date(year, 11, 31);
    
    // Total de milissegundos no ano
    const yearLength = yearEnd.getTime() - yearStart.getTime();
    // Milissegundos passados desde o início do ano
    const timePassed = now.getTime() - yearStart.getTime();
    
    // Calcular porcentagem
    const percentage = (timePassed / yearLength) * 100;
    
    // Formatar para 1 casa decimal
    const formattedPercentage = percentage.toFixed(1);
    
    // Calcular dias passados
    const daysPassed = Math.floor(timePassed / (1000 * 60 * 60 * 24)) + 1;
    // Calcular dias totais no ano (365 ou 366)
    const totalDays = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 366 : 365;
    
    // Atualizar display
    document.getElementById('year-progress-display').textContent = `${formattedPercentage}%`;
    document.getElementById('year-progress-days').textContent = `${daysPassed} de ${totalDays} dias`;
    
    // Retornar para possível uso futuro
    return {
        percentage: parseFloat(formattedPercentage),
        daysPassed: daysPassed,
        totalDays: totalDays
    };
}

// Consultor de Data
const consultantDateInput = document.getElementById('consultant-date');
const consultantCheckBtn = document.getElementById('consultant-check');
const consultantResult = document.getElementById('consultant-result');
const quickDateBtns = document.querySelectorAll('.quick-date-btn');

// Formatar data para exibição
function formatDateForDisplay(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('pt-BR', options);
}

// Formatar data curta
function formatShortDate(date) {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Obter nome do dia da semana
function getWeekdayName(date) {
    const weekdays = [
        'Domingo', 'Segunda-feira', 'Terça-feira', 
        'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return weekdays[date.getDay()];
}

// Calcular diferença em dias até hoje
function getDaysUntil(targetDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

// Mostrar resultado no consultor
// Atualize a função showConsultantResult para incluir a estação:
function showConsultantResult(date) {
    const formattedDate = formatDateForDisplay(date);
    const weekday = getWeekdayName(date);
    const shortDate = formatShortDate(date);
    const daysUntil = getDaysUntil(new Date(date));
    const season = getSeasonForDate(date); // Obter estação
    
    let daysText = '';
    if (daysUntil === 0) {
        daysText = '<strong>É hoje!</strong>';
    } else if (daysUntil > 0) {
        daysText = `<strong>${daysUntil} dia${daysUntil !== 1 ? 's' : ''} no futuro</strong>`;
    } else {
        const daysAgo = Math.abs(daysUntil);
        daysText = `<strong>${daysAgo} dia${daysAgo !== 1 ? 's' : ''} atrás</strong>`;
    }
    
    consultantResult.innerHTML = `
        <div class="result-content">
            <div class="result-date">${shortDate}</div>
            <div class="result-weekday">${weekday}</div>
            <div class="result-details">
                <div>${formattedDate}</div>
                <div style="margin-top: 10px; display: flex; align-items: center; gap: 8px; justify-content: center;">
                    <div class="legend-season-dot ${season.type}" style="margin: 0;"></div>
                    <span>${season.name}</span>
                </div>
                <div style="margin-top: 10px;">${daysText}</div>
            </div>
        </div>
    `;
    
    consultantResult.classList.add('active');
}

// Consultar data
consultantCheckBtn.addEventListener('click', () => {
    const dateValue = consultantDateInput.value;
    
    if (!dateValue) {
        showModalMessage("Atenção", "Por favor, selecione uma data.", 'warning');
        return;
    }
    
    const date = new Date(dateValue + 'T00:00:00');
    showConsultantResult(date);
});

// Tecla Enter no campo de data
consultantDateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        consultantCheckBtn.click();
    }
});

// Botões de datas rápidas
quickDateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const daysToAdd = parseInt(btn.dataset.days);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysToAdd);
        
        // Formatar para o input type="date" (YYYY-MM-DD)
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        
        consultantDateInput.value = `${year}-${month}-${day}`;
        showConsultantResult(targetDate);
    });
});

// Preencher com a data atual ao carregar
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    consultantDateInput.value = `${year}-${month}-${day}`;
    // Mostrar resultado para a data atual
    showConsultantResult(today);
});

// Funções para estações do ano
function getSeasonForDate(date) {
    const month = date.getMonth() + 1; // Janeiro = 1
    const day = date.getDate();
    
    // Hemisfério Sul (Brasil)
    // Primavera: 23/09 a 20/12
    // Verão: 21/12 a 20/03
    // Outono: 21/03 a 20/06
    // Inverno: 21/06 a 22/09
    
    if ((month === 9 && day >= 23) || month === 10 || month === 11 || (month === 12 && day <= 20)) {
        return {
            name: 'Primavera',
            type: 'spring',
            icon: 'fas fa-seedling',
            color: 'var(--spring)'
        };
    } else if ((month === 12 && day >= 21) || month === 1 || month === 2 || (month === 3 && day <= 20)) {
        return {
            name: 'Verão',
            type: 'summer',
            icon: 'fas fa-sun',
            color: 'var(--summer)'
        };
    } else if ((month === 3 && day >= 21) || month === 4 || month === 5 || (month === 6 && day <= 20)) {
        return {
            name: 'Outono',
            type: 'autumn',
            icon: 'fas fa-leaf',
            color: 'var(--autumn)'
        };
    } else {
        return {
            name: 'Inverno',
            type: 'winter',
            icon: 'fas fa-snowflake',
            color: 'var(--winter)'
        };
    }
}

// Adicionar indicador de estação a um dia do calendário (lado direito)
function addSeasonIndicator(dateEl, date) {
    const season = getSeasonForDate(date);
    
    const dayNumber = dateEl.querySelector('.day-number');
    if (!dayNumber) return season;
    
    // Adicionar a classe que indica que tem estação
    dayNumber.classList.add('with-season');
    
    // Adicionar o número do dia como atributo data
    const day = date.getDate();
    dayNumber.setAttribute('data-day', day);
    
    // Remover qualquer indicador de estação existente
    const existingIndicator = dayNumber.querySelector('.season-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    const seasonIndicator = document.createElement('span');
    seasonIndicator.className = `season-indicator season-${season.type}`;
    seasonIndicator.title = season.name;
    
    const icon = document.createElement('i');
    icon.className = season.icon;
    seasonIndicator.appendChild(icon);
    
    const tooltip = document.createElement('div');
    tooltip.className = 'season-tooltip';
    tooltip.textContent = season.name;
    seasonIndicator.appendChild(tooltip);
    
    // Adicionar o indicador ao .day-number
    dayNumber.appendChild(seasonIndicator);
    
    return season;
}

// Função para remover indicadores de estação
function removeSeasonIndicators() {
    const dayNumbers = document.querySelectorAll('.day-number');
    dayNumbers.forEach(dayNumber => {
        dayNumber.classList.remove('with-season');
        dayNumber.removeAttribute('data-day');
        
        // Remover o indicador de estação
        const seasonIndicator = dayNumber.querySelector('.season-indicator');
        if (seasonIndicator) {
            seasonIndicator.remove();
        }
    });
}

// Adicionar legenda das estações
function addSeasonLegend() {
    const calendarContainer = document.querySelector('.calendar-container');
    let legend = document.querySelector('.season-legend');
    
    if (!legend) {
        legend = document.createElement('div');
        legend.className = 'season-legend';
        legend.innerHTML = `
            <div class="legend-season-item">
                <div class="legend-season-dot spring"></div>
                <span>Primavera</span>
            </div>
            <div class="legend-season-item">
                <div class="legend-season-dot summer"></div>
                <span>Verão</span>
            </div>
            <div class="legend-season-item">
                <div class="legend-season-dot autumn"></div>
                <span>Outono</span>
            </div>
            <div class="legend-season-item">
                <div class="legend-season-dot winter"></div>
                <span>Inverno</span>
            </div>
        `;
        
        const indicatorsLegend = document.querySelector('.indicators-legend');
        if (indicatorsLegend) {
            calendarContainer.insertBefore(legend, indicatorsLegend);
        } else {
            calendarContainer.appendChild(legend);
        }
    }
    
    return legend;
}