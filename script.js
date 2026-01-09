  const searchMonthSelect = document.getElementById('search-month');
    const searchYearSelect = document.getElementById('search-year');
    const searchGoBtn = document.getElementById('search-go');
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
    const holidayInfo = document.getElementById("holiday-info");
    const holidayIcon = document.getElementById("holiday-icon");
    const holidayModalClose = document.getElementById("holiday-modal-close");
    const holidayModalAddEvent = document.getElementById("holiday-modal-add-event");
    const appTitleYear = document.getElementById("current-year");
    const headerCurrentDateDisplay = document.getElementById("header-current-date");
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

    let currentDate = new Date();
    let selectedDate = null;
    let events = JSON.parse(localStorage.getItem("events")) || {};
    let recurringEvents = JSON.parse(localStorage.getItem("recurringEvents")) || {};
    let dynamicHolidays = JSON.parse(localStorage.getItem("dynamicHolidays")) || {};
    let theme = localStorage.getItem("theme") || "light";
    let eventListVisible = true;
    let allHolidays = [];
    let showSeasons = localStorage.getItem("showSeasons") === "true";

    const dayTypes = {
        'Feriado Nacional': {
            color: '#e74c3c',
            icon: 'fas fa-flag',
            description: 'Feriado nacional obrigatório',
            cssClass: 'national'
        },
        'Facultativo': {
            color: '#f39c12',
            icon: 'fas fa-building',
            description: 'Ponto facultativo (consulte sua empresa/órgão)',
            cssClass: 'facultative'
        },
        'Feriado Religioso': {
            color: '#3498db',
            icon: 'fas fa-church',
            description: 'Feriado religioso',
            cssClass: 'religious'
        },
        'Feriado Estadual/Municipal': {
            color: '#9b59b6',
            icon: 'fas fa-landmark',
            description: 'Feriado local',
            cssClass: 'local'
        }
    };

    const staticHolidays = {
        "1-1": { name: "Ano Novo", type: "Feriado Nacional" },
        "21-4": { name: "Tiradentes", type: "Feriado Nacional" },
        "1-5": { name: "Dia do Trabalho", type: "Feriado Nacional" },
        "7-9": { name: "Independência do Brasil", type: "Feriado Nacional" },
        "12-10": { name: "Nossa Senhora Aparecida", type: "Feriado Nacional" },
        "2-11": { name: "Finados", type: "Feriado Nacional" },
        "15-11": { name: "Proclamação da República", type: "Feriado Nacional" },
        "25-12": { name: "Natal", type: "Feriado Nacional" },
        
        "20-11": { name: "Dia da Consciência Negra", type: "Facultativo" },
        "28-10": { name: "Dia do Servidor Público", type: "Facultativo" },
        "30-10": { name: "Reforma Protestante", type: "Facultativo" },
        "24-12": { name: "Véspera de Natal", type: "Facultativo" },
        "31-12": { name: "Véspera de Ano Novo", type: "Facultativo" },
        "6-1": { name: "Dia de Reis", type: "Facultativo" },
        "29-6": { name: "São Pedro", type: "Facultativo" },
        "8-12": { name: "Nossa Senhora da Conceição", type: "Feriado Religioso" },
        "1-11": { name: "Dia de Todos os Santos", type: "Feriado Religioso" },
        
        "9-7": { name: "Revolução Constitucionalista (SP)", type: "Feriado Estadual/Municipal" },
    };

    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.innerHTML = theme === "dark" 
        ? '<i class="fas fa-sun"></i> Tema Claro' 
        : '<i class="fas fa-moon"></i> Tema Escuro';

    function updateAppTitle() {
        const year = currentDate.getFullYear();
        appTitleYear.textContent = year;
    }

function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        timeZone: selectedTimezone || 'America/Sao_Paulo'
    };
    
    try {
        const formattedDate = now.toLocaleDateString('pt-BR', options);
        const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        
        // Atualizar no card HOJE
        if (currentDateDisplay) {
            currentDateDisplay.textContent = capitalizedDate;
        }
        
        // Atualizar no header (opcional - se quiser manter)
        if (headerCurrentDateDisplay) {
            headerCurrentDateDisplay.textContent = capitalizedDate;
        }
        
    } catch (error) {
        // Fallback sem timezone
        const optionsFallback = { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long'
        };
        const formattedDate = now.toLocaleDateString('pt-BR', optionsFallback);
        const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        
        if (currentDateDisplay) {
            currentDateDisplay.textContent = capitalizedDate;
        }
        
        if (headerCurrentDateDisplay) {
            headerCurrentDateDisplay.textContent = capitalizedDate;
        }
    }
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
                
                const holidayType = inferHolidayType(holiday.localName);
                formattedHolidays[key] = {
                    name: holiday.localName,
                    type: holidayType
                };
                
                allHolidays.push({
                    date: adjustedDate,
                    name: holiday.localName,
                    type: holidayType,
                    key: key
                });
            });
            
            Object.keys(staticHolidays).forEach(key => {
                if (!formattedHolidays[key]) {
                    formattedHolidays[key] = staticHolidays[key];
                    
                    const [day, month] = key.split("-").map(Number);
                    const date = new Date(year, month - 1, day);
                    
                    allHolidays.push({
                        date: date,
                        name: staticHolidays[key].name,
                        type: staticHolidays[key].type,
                        key: key
                    });
                }
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
                    name: staticHolidays[key].name,
                    type: staticHolidays[key].type,
                    key: key
                });
            });
            
            updateNextHoliday();
            return false;
        }
    }

function inferHolidayType(holidayName) {
    if (!holidayName) return 'Feriado Nacional';
    
    const lowerName = holidayName.toLowerCase();
    
    if (lowerName.includes('facultativo') || 
        lowerName.includes('ponto') || 
        lowerName.includes('servidor') ||
        lowerName.includes('consciência negra') ||
        lowerName.includes('consciencia negra') ||
        lowerName.includes('véspera') ||
        lowerName.includes('vespera') ||
        lowerName.includes('dia de reis') ||
        lowerName.includes('são pedro') ||
        lowerName.includes('sao pedro') ||
        lowerName.includes('carnaval')) {  
        return 'Facultativo';
    }
    
    if (lowerName.includes('corpus christi') || 
        lowerName.includes('sexta-feira santa') ||
        lowerName.includes('padroeira') ||
        lowerName.includes('apóstolo') ||
        lowerName.includes('apostolo') ||
        lowerName.includes('são') ||
        lowerName.includes('sao') ||
        lowerName.includes('nossa senhora') ||
        lowerName.includes('todos os santos') ||
        lowerName.includes('imaculada conceição')) {
        return 'Feriado Religioso';
    }
    
    if (lowerName.includes('estadual') || 
        lowerName.includes('municipal') ||
        lowerName.includes('aniversário') ||
        lowerName.includes('aniversario') ||
        lowerName.includes('fundação') ||
        lowerName.includes('revolução')) {
        return 'Feriado Estadual/Municipal';
    }
    
    return 'Feriado Nacional';
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
                            generatedEvents.push({ ...recurringEvent, originalId: recurringId });
                            break;
                        }
                    }
                    tempDate.setDate(tempDate.getDate() + 1);
                }
                return;
            }
            
            if (shouldGenerateEventOnDate(recurringEvent, date)) {
                generatedEvents.push({ ...recurringEvent, originalId: recurringId });
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
                return date.getDate() === startDate.getDate() && date.getMonth() === startDate.getMonth();
                
            default:
                return false;
        }
    }

    function formatDateKey(date) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }



    function createIndicator(type, tooltipText, dateKey, day, isRecurring = false, dayType = null) {
        const indicator = document.createElement("div");
        indicator.title = tooltipText;
        
        let indicatorType = type;
        if (dayType && dayTypes[dayType]) {
            indicatorType = dayTypes[dayType].cssClass;
            indicator.className = `indicator ${indicatorType}`;
            indicator.style.background = `linear-gradient(135deg, ${dayTypes[dayType].color}, ${darkenColor(dayTypes[dayType].color, 20)})`;
        } else {
            indicator.className = `indicator ${type}`;
        }
        
        const icon = document.createElement("i");
        if (dayType && dayTypes[dayType]) {
            icon.className = dayTypes[dayType].icon;
        } else {
            icon.className = type === "holiday" ? "fas fa-flag" : 
                            type === "work" ? "fas fa-briefcase" :
                            type === "health" ? "fas fa-heartbeat" :
                            type === "leisure" ? "fas fa-gamepad" : "fas fa-check";
        }
        icon.style.pointerEvents = "none";
        icon.style.fontSize = dayType === "Facultativo" ? "0.6em" : "0.7em";
        
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        
        let tooltipContent = tooltipText;
        if (dayType) {
            tooltipContent = `<strong style="display: block; margin-bottom: 4px;">${dayType}</strong>${tooltipText}`;
            if (dayTypes[dayType]?.description) {
                tooltipContent += `<br><small style="display: block; margin-top: 4px; font-style: italic;">${dayTypes[dayType].description}</small>`;
            }
        }
        
        if (isRecurring) {
            tooltipContent += '<br><small style="display: block; margin-top: 4px;"><i class="fas fa-redo" style="margin-right: 4px;"></i>Evento recorrente</small>';
        }
        
        tooltip.innerHTML = tooltipContent;
        
        indicator.appendChild(icon);
        indicator.appendChild(tooltip);
        
        function darkenColor(color, percent) {
            let r = parseInt(color.slice(1, 3), 16);
            let g = parseInt(color.slice(3, 5), 16);
            let b = parseInt(color.slice(5, 7), 16);
            
            r = Math.floor(r * (100 - percent) / 100);
            g = Math.floor(g * (100 - percent) / 100);
            b = Math.floor(b * (100 - percent) / 100);
            
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
        
        indicator.onclick = (e) => {
            e.stopPropagation();
            
            if (type === "holiday" || dayType) {
                const holidayKey = `${day}-${currentDate.getMonth() + 1}`;
                let holidayData = dynamicHolidays[holidayKey];
                
                if (typeof holidayData === 'string') {
                    holidayData = {
                        name: holidayData,
                        type: inferHolidayType(holidayData)
                    };
                }
                
                openHolidayModal(dateKey, day, holidayData);
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

    async function renderCalendar(showLoading = false) {
        if (showLoading) {
            toggleSpinner(true, "Carregando calendário...");
        }
        
        updateSearchFields();
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        updateAppTitle();
        monthYear.innerText = currentDate.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric"
        }).replace(/^./, c => c.toUpperCase());
        
        const monthContainer = document.createElement("div");
        monthContainer.className = "calendar-month current";
        monthContainer.dataset.year = year;
        monthContainer.dataset.month = month;
        
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
                
                let holidayData = dynamicHolidays[holidayKey];
                let holidayName = '';
                let holidayType = null;
                
                if (typeof holidayData === 'object' && holidayData !== null) {
                    holidayName = holidayData.name || holidayData;
                    holidayType = holidayData.type;
                } else {
                    holidayName = holidayData;
                    holidayType = inferHolidayType(holidayName);
                }
                
                const holidayIndicator = createIndicator("holiday", holidayName, dateKey, day, false, holidayType);
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
                    eventData.isRecurring || eventData.recurringId
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
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dateEl.classList.add("today");
            }
            
            dateEl.onclick = (e) => {
                if (!e.target.closest('.indicator') && !e.target.closest('.season-indicator')) {
                    const hasRealEvents = events[dateKey] || recurringEventsForDate.length > 0;
                    
                    if (hasHoliday && !hasRealEvents) {
                        let holidayData = dynamicHolidays[holidayKey];
                        
                        if (typeof holidayData === 'string') {
                            holidayData = {
                                name: holidayData,
                                type: inferHolidayType(holidayData)
                            };
                        }
                        
                        openHolidayModal(dateKey, day, holidayData);
                    } else if (!hasHoliday && hasRealEvents) {
                        const recurringEvent = recurringEventsForDate[0];
                        if (recurringEvent) {
                            openRecurringEventModal(dateKey, day, recurringEvent);
                        } else {
                            openModal(dateKey, day);
                        }
                    } else if (hasHoliday && hasRealEvents) {
                        const choice = confirm(`Este dia tem tanto feriado quanto compromissos pessoais.\n\nClique em OK para ver os compromissos ou Cancelar para ver o feriado.`);
                        
                        if (choice) {
                            const recurringEvent = recurringEventsForDate[0];
                            if (recurringEvent) {
                                openRecurringEventModal(dateKey, day, recurringEvent);
                            } else {
                                openModal(dateKey, day);
                            }
                        } else {
                            let holidayData = dynamicHolidays[holidayKey];
                            if (typeof holidayData === 'string') {
                                holidayData = {
                                    name: holidayData,
                                    type: inferHolidayType(holidayData)
                                };
                            }
                            openHolidayModal(dateKey, day, holidayData);
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

  function renderEventList() {
    eventList.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    const monthEvents = [];
    
    Object.keys(dynamicHolidays).forEach(key => {
        const [day, holidayMonth] = key.split("-").map(Number);
        if (holidayMonth === month) {
            const holidayData = dynamicHolidays[key];
            let holidayName = '';
            let holidayType = 'holiday';
            
            if (typeof holidayData === 'object') {
                holidayName = holidayData.name;
                holidayType = holidayData.type === 'Facultativo' ? 'facultative' :
                             holidayData.type === 'Feriado Religioso' ? 'religious' :
                             holidayData.type === 'Feriado Estadual/Municipal' ? 'local' : 'holiday';
            } else {
                holidayName = holidayData;
                const inferredType = inferHolidayType(holidayName);
                holidayType = inferredType === 'Facultativo' ? 'facultative' :
                             inferredType === 'Feriado Religioso' ? 'religious' :
                             inferredType === 'Feriado Estadual/Municipal' ? 'local' : 'holiday';
            }
            
            monthEvents.push({
                date: new Date(year, month - 1, day),
                text: holidayName,
                type: holidayType,
                day: day,
                isRecurring: false,
                originalType: typeof holidayData === 'object' ? holidayData.type : 'Feriado Nacional'
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
        
        // Formatar data para o novo layout
        const dateObj = new Date(event.date);
        const weekday = dateObj.toLocaleDateString("pt-BR", { 
            weekday: 'short' 
        }).replace('.', '').toUpperCase();
        const day = dateObj.getDate();
        
        // Determinar badge
        let badgeClass = '';
        let badgeText = '';
        
        if (event.type === 'facultative') {
            badgeClass = 'facultative-badge';
            badgeText = 'FACULTATIVO';
        } else if (event.type === 'religious') {
            badgeClass = 'religious-badge';
            badgeText = 'RELIGIOSO';
        } else if (event.type === 'local') {
            badgeClass = 'local-badge';
            badgeText = 'LOCAL';
        } else if (event.type === 'holiday') {
            badgeClass = 'holiday-badge';
            badgeText = 'FERIADO';
        } else {
            badgeClass = `${event.type}-badge`;
            badgeText = event.type === 'work' ? 'TRABALHO' :
                       event.type === 'health' ? 'SAÚDE' :
                       event.type === 'leisure' ? 'LAZER' : 'PESSOAL';
        }
        
        // Criar estrutura HTML
        listItem.innerHTML = `
            <div class="event-date">
                <span class="weekday">${weekday}</span>
                <span class="day">${day}</span>
            </div>
            <div class="event-text">${event.text}</div>
            <span class="event-type-badge ${badgeClass}">${badgeText}</span>
        `;
        
        // Adicionar badge recorrente se necessário
        if (event.isRecurring) {
            const eventTextDiv = listItem.querySelector('.event-text');
            const recurringBadge = document.createElement('span');
            recurringBadge.className = 'recurring-badge';
            recurringBadge.innerHTML = '<i class="fas fa-redo"></i> Recorrente';
            eventTextDiv.appendChild(recurringBadge);
        }
        
        // Configurar click handler
        listItem.onclick = () => {
            const day = event.day;
            const dateKey = `${year}-${month}-${day}`;
            
            if (event.type === 'holiday' || event.type === 'facultative' || event.type === 'religious' || event.type === 'local') {
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
        listItem.className = "event-list-item empty-state";
        listItem.innerHTML = `
            <div class="empty-state-content">
                <i class="far fa-calendar-times"></i>
                <div>
                    <p class="empty-state-title">Nenhum compromisso este mês</p>
                    <p class="empty-state-subtitle">Clique em um dia para adicionar um compromisso</p>
                </div>
            </div>
        `;
        eventList.appendChild(listItem);
    }
    
    // Atualizar contadores
    holidayCountEl.textContent = monthEvents.filter(e => ['holiday', 'facultative', 'religious', 'local'].includes(e.type)).length;
    eventCountEl.textContent = monthEvents.filter(e => ['personal', 'work', 'health', 'leisure'].includes(e.type)).length;
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

    function openHolidayModal(dateKey, day, holidayData) {
        selectedDate = dateKey;
        const [year, month] = dateKey.split("-");
        const formattedDate = new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).replace(/^./, c => c.toUpperCase());
        
        let holidayName = '';
        let holidayType = '';
        
        if (typeof holidayData === 'object') {
            holidayName = holidayData.name;
            holidayType = holidayData.type;
        } else {
            holidayName = holidayData;
            holidayType = inferHolidayType(holidayName);
        }
        
        holidayModalName.innerHTML = `${holidayName} 
            <span class="holiday-type-badge holiday-type-${holidayType.toLowerCase().replace(/[^a-z]/g, '-')}">
                ${holidayType}
            </span>`;
        
        holidayModalDate.textContent = formattedDate;
        
        holidayInfo.className = 'holiday-info';
        holidayIcon.className = 'holiday-icon';
        holidayModalName.className = 'holiday-name';
        
        if (holidayType === 'Facultativo') {
            holidayInfo.classList.add('facultative');
            holidayIcon.classList.add('facultative');
            holidayModalName.classList.add('facultative');
        } else if (holidayType === 'Feriado Religioso') {
            holidayInfo.classList.add('religious');
            holidayIcon.classList.add('religious');
            holidayModalName.classList.add('religious');
        } else if (holidayType === 'Feriado Estadual/Municipal') {
            holidayInfo.classList.add('local');
            holidayIcon.classList.add('local');
            holidayModalName.classList.add('local');
        }
        
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
            ? '<i class="fas fa-sun"></i> Tema Claro' 
            : '<i class="fas fa-moon"></i> Tema Escuro';
    };

    eventListToggle.onclick = () => {
        const eventListSection = document.querySelector('.event-list-section');
        eventListVisible = !eventListVisible;
        
        if (window.innerWidth <= 767) {
            eventListSection.style.display = eventListVisible ? 'block' : 'none';
            
            if (eventListVisible) {
                eventListToggle.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar';
                eventListToggle.classList.add('active');
            } else {
                eventListToggle.innerHTML = '<i class="fas fa-eye"></i> Mostrar';
                eventListToggle.classList.remove('active');
            }
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
            
            showModalMessage("Sucesso", "Limpo com sucesso!", 'info');
            renderCalendar(true);
        }, 300);
    }

    window.onclick = (event) => {
        if (event.target === modal) closeModal();
        if (event.target === holidayModal) holidayModal.style.display = "none";
        if (event.target === confirmModal) confirmModal.style.display = "none";
    };

    function initializeCurrentDate() {
    // Chamar imediatamente
    updateCurrentDate();
    updateLiveClock();
    
    // Configurar intervalo para atualizar a cada minuto
    setInterval(() => {
        updateCurrentDate();
        updateLiveClock();
    }, 60000);
    
    // Atualizar progresso do ano também
    updateYearProgress();
}

  document.addEventListener("DOMContentLoaded", () => {
    updateAppTitle();
    
    // Inicializar data e hora
    function initializeDateTime() {
        updateCurrentDate();
        updateLiveClock();
        updateYearProgress();
        
    }

    populateYearSelect();
    updateSearchFields();
    
    // Chamar imediatamente
    initializeDateTime();
    
    // Configurar timezone
    initTimezoneSelector();
    
    // Carregar dados
    fetchHolidays(currentDate.getFullYear());
    renderCalendar();
    
    // Atualizar relógio em tempo real
    setInterval(updateLiveClock, 1000);
    
    // Atualizar data e progresso a cada minuto
    setInterval(() => {
        updateCurrentDate();
        updateYearProgress();
    }, 60000);
    
    // Responsividade para mobile
    if (window.innerWidth <= 767) {
        const eventListSection = document.querySelector('.event-list-section');
        const mobileToggle = document.getElementById('mobile-event-toggle');
        
        eventListSection.style.display = 'block';
        
        if (mobileToggle) {
            mobileToggle.onclick = () => {
                const content = document.querySelectorAll('.event-list-header, #event-list');
                const isVisible = content[0].style.display !== 'none';
                
                content.forEach(el => {
                    el.style.display = isVisible ? 'none' : 'block';
                });
                
                if (isVisible) {
                    mobileToggle.innerHTML = '<i class="fas fa-eye"></i> Mostrar';
                } else {
                    mobileToggle.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar';
                }
            };
        }
        
        const mainToggleBtn = document.getElementById('event-list-toggle');
        if (mainToggleBtn) {
            mainToggleBtn.style.display = 'none';
        }
    }
    
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
        } else {
            seasonToggle.classList.remove('active');
            removeSeasonIndicators();
            const seasonLegend = document.querySelector('.season-legend');
            if (seasonLegend) {
                seasonLegend.classList.remove('show');
            }
        }

        
        renderCalendar(true);
    });

        searchGoBtn.addEventListener('click', goToSearchedMonth);

        // Também permitir pesquisa com Enter nos campos
        searchMonthSelect.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                goToSearchedMonth();
            }
        });

        searchYearSelect.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                goToSearchedMonth();
            }
        });

        // Atualizar campos de pesquisa quando navegar com botões
        prevBtn.addEventListener('click', () => {
            setTimeout(updateSearchFields, 100);
        });

        nextBtn.addEventListener('click', () => {
            setTimeout(updateSearchFields, 100);
        });

        todayBtn.addEventListener('click', () => {
            setTimeout(updateSearchFields, 100);
        });
    
    // Fallback de segurança para data
    setTimeout(() => {
        if (currentDateDisplay && currentDateDisplay.textContent === 'Carregando...') {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long',
                timeZone: selectedTimezone || 'America/Sao_Paulo'
            };
            
            try {
                const formattedDate = now.toLocaleDateString('pt-BR', options);
                currentDateDisplay.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
            } catch (error) {
                // Fallback sem timezone
                const optionsFallback = { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long'
                };
                const formattedDate = now.toLocaleDateString('pt-BR', optionsFallback);
                currentDateDisplay.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
            }
        }
        
        // Fallback para tempo no card
        if (document.getElementById('current-time-display') && 
            document.getElementById('current-time-display').textContent === '--:--:--') {
            const now = new Date();
            const timeZone = selectedTimezone || 'America/Sao_Paulo';
            
            try {
                const cardTimeString = now.toLocaleTimeString('pt-BR', {
                    timeZone: timeZone,
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                });
                document.getElementById('current-time-display').textContent = cardTimeString;
            } catch (error) {
                document.getElementById('current-time-display').textContent = 
                    now.toLocaleTimeString('pt-BR', {hour12: false, hour: '2-digit', minute: '2-digit'});
            }
        }
    }, 2000);
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

function updateYearProgress() {
    const now = new Date();
    const year = now.getFullYear();
    
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    
    const yearLength = yearEnd.getTime() - yearStart.getTime();
    const timePassed = now.getTime() - yearStart.getTime();
    
    const percentage = (timePassed / yearLength) * 100;
    const formattedPercentage = percentage.toFixed(1);
    
    const daysPassed = Math.floor(timePassed / (1000 * 60 * 60 * 24)) + 1;
    const totalDays = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 366 : 365;
    
    document.getElementById('year-progress-display').textContent = `${formattedPercentage}%`;
    document.getElementById('year-progress-days').textContent = `${daysPassed} de ${totalDays} dias`;
    
    // Atualizar barra de progresso
    const progressBar = document.getElementById('year-progress-bar');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
    
    return {
        percentage: parseFloat(formattedPercentage),
        daysPassed: daysPassed,
        totalDays: totalDays
    };
}

    const consultantDateInput = document.getElementById('consultant-date');
    const consultantCheckBtn = document.getElementById('consultant-check');
    const consultantResult = document.getElementById('consultant-result');
    const quickDateBtns = document.querySelectorAll('.quick-date-btn');

    function formatDateForDisplay(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('pt-BR', options);
    }

    function formatShortDate(date) {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    function getWeekdayName(date) {
        const weekdays = [
            'Domingo', 'Segunda-feira', 'Terça-feira', 
            'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
        ];
        return weekdays[date.getDay()];
    }

    function getDaysUntil(targetDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);
        
        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    }

    function showConsultantResult(date) {
        const formattedDate = formatDateForDisplay(date);
        const weekday = getWeekdayName(date);
        const shortDate = formatShortDate(date);
        const daysUntil = getDaysUntil(new Date(date));
        const season = getSeasonForDate(date);
        
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

    consultantCheckBtn.addEventListener('click', () => {
        const dateValue = consultantDateInput.value;
        
        if (!dateValue) {
            showModalMessage("Atenção", "Por favor, selecione uma data.", 'warning');
            return;
        }
        
        const date = new Date(dateValue + 'T00:00:00');
        showConsultantResult(date);
    });

    consultantDateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            consultantCheckBtn.click();
        }
    });

    quickDateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const daysToAdd = parseInt(btn.dataset.days);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + daysToAdd);
            
            const year = targetDate.getFullYear();
            const month = String(targetDate.getMonth() + 1).padStart(2, '0');
            const day = String(targetDate.getDate()).padStart(2, '0');
            
            consultantDateInput.value = `${year}-${month}-${day}`;
            showConsultantResult(targetDate);
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        
        consultantDateInput.value = `${year}-${month}-${day}`;
        showConsultantResult(today);
    });

    function getSeasonForDate(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
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

    function addSeasonIndicator(dateEl, date) {
        const season = getSeasonForDate(date);
        
        const dayNumber = dateEl.querySelector('.day-number');
        if (!dayNumber) return season;
        
        dayNumber.classList.add('with-season');
        
        const day = date.getDate();
        dayNumber.setAttribute('data-day', day);
        
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
        
        dayNumber.appendChild(seasonIndicator);
        
        return season;
    }

    function removeSeasonIndicators() {
        const dayNumbers = document.querySelectorAll('.day-number');
        dayNumbers.forEach(dayNumber => {
            dayNumber.classList.remove('with-season');
            dayNumber.removeAttribute('data-day');
            
            const seasonIndicator = dayNumber.querySelector('.season-indicator');
            if (seasonIndicator) {
                seasonIndicator.remove();
            }
        });
    }

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

let selectedTimezone = localStorage.getItem('timezone') || 'America/Sao_Paulo';

function initTimezoneSelector() {
    const timezoneSelect = document.getElementById('timezone-select');
    if (!timezoneSelect) return;
    
    timezoneSelect.value = selectedTimezone;
    
    timezoneSelect.addEventListener('change', function() {
        selectedTimezone = this.value;
        localStorage.setItem('timezone', selectedTimezone);
        updateLiveClock();
    });
}

function updateLiveClock() {
    try {
        const clockElement = document.getElementById('live-clock');
        const dateElement = document.getElementById('live-date');
        const currentTimeElement = document.getElementById('current-time-display');
        
        if (!clockElement || !dateElement) return;
        
        const now = new Date();
        const timeZone = selectedTimezone || 'America/Sao_Paulo';
        
        // Atualizar relógio principal
        const timeString = now.toLocaleTimeString('pt-BR', {
            timeZone: timeZone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const dateString = now.toLocaleDateString('pt-BR', {
            timeZone: timeZone,
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).replace(/\./g, '');
        
        const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        const timezoneName = getTimezoneDisplayName(timeZone);
        
        clockElement.textContent = timeString;
        dateElement.textContent = `${formattedDate} | ${timezoneName}`;
        
        // Atualizar hora no card HOJE
        if (currentTimeElement) {
            const cardTimeString = now.toLocaleTimeString('pt-BR', {
                timeZone: timeZone,
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            currentTimeElement.textContent = cardTimeString;
        }
        
        updateCurrentDate();
        
    } catch (error) {
        console.error('Erro ao atualizar relógio:', error);
        // Fallback básico
        const now = new Date();
        if (clockElement) {
            clockElement.textContent = now.toLocaleTimeString('pt-BR', {hour12: false});
        }
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('pt-BR');
        }
        if (currentDateDisplay) {
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            const formattedDate = now.toLocaleDateString('pt-BR', options);
            currentDateDisplay.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        }
    }
}

function getTimezoneDisplayName(timeZone) {
    const timezoneNames = {
        'America/Sao_Paulo': 'BRT (Brasília)',
        'America/Manaus': 'AMT (Manaus)',
        'America/Rio_Branco': 'ACT (Acre)',
        'America/Bahia': 'BRT (Bahia)',
        'America/Fortaleza': 'BRT (Fortaleza)',
        'America/Recife': 'BRT (Recife)',
        'America/Belem': 'BRT (Belém)',
        'America/Cuiaba': 'AMT (Cuiabá)',
        'America/Campo_Grande': 'AMT (Campo Grande)',
        'America/Porto_Velho': 'AMT (Porto Velho)',
        'America/Boa_Vista': 'AMT (Boa Vista)',
        'America/Santarem': 'BRT (Santarém)',
        'America/Araguaina': 'BRT (Araguaína)',
        'America/Maceio': 'BRT (Maceió)',
        'America/Eirunepe': 'ACT (Eirunepé)'
    };
    
    return timezoneNames[timeZone] || timeZone;
}

function createClockElements() {
    const appTitle = document.getElementById('app-title');
    if (!appTitle) return;
    
    if (document.getElementById('live-clock-container')) return;
    
    const clockHTML = `
        <div id="live-clock-container">
            <div id="live-clock" class="live-clock">--:--:--</div>
            <div id="live-date" class="live-date">Carregando...</div>
        </div>
    `;
    
    appTitle.insertAdjacentHTML('afterend', clockHTML);
}

function populateYearSelect() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10;
    const endYear = currentYear + 10;
    
    searchYearSelect.innerHTML = '<option value="">Ano</option>';
    
    for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        searchYearSelect.appendChild(option);
    }
    
    searchYearSelect.value = currentYear;
}

function updateSearchFields() {
    searchMonthSelect.value = currentDate.getMonth();
    searchYearSelect.value = currentDate.getFullYear();
}

function goToSearchedMonth() {
    const selectedMonth = searchMonthSelect.value;
    const selectedYear = searchYearSelect.value;
    
    if (selectedMonth === "" || selectedYear === "") {
        showModalMessage("Campos obrigatórios", "Por favor, selecione um mês e um ano.", 'warning');
        return;
    }
    
    currentDate = new Date(selectedYear, selectedMonth, 1);
    
    toggleSpinner(true, "Indo para " + getMonthName(selectedMonth) + " de " + selectedYear);
    
    setTimeout(() => {
        renderCalendar();
        updateSearchFields(); 
        toggleSpinner(false);
        
        
    }, 500);
}

function getMonthName(monthIndex) {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[monthIndex] || '';
}

function handleSearchKeyPress(e) {
    if (e.key === 'Enter') {
        goToSearchedMonth();
    }
}

function setupSearchAutoComplete() {
    // Quando selecionar um ano, sugerir o mês atual se não houver seleção
    searchYearSelect.addEventListener('change', function() {
        if (searchMonthSelect.value === "" && this.value !== "") {
            const currentMonth = new Date().getMonth();
            searchMonthSelect.value = currentMonth;
        }
    });
    
    // Quando selecionar um mês, sugerir o ano atual se não houver seleção
    searchMonthSelect.addEventListener('change', function() {
        if (searchYearSelect.value === "" && this.value !== "") {
            const currentYear = new Date().getFullYear();
            searchYearSelect.value = currentYear;
        }
    });
}

searchGoBtn.addEventListener('click', goToSearchedMonth);
searchMonthSelect.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        goToSearchedMonth();
    }
});
searchYearSelect.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        goToSearchedMonth();
    }
});