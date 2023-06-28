let activeDay = null;
let eventsArr = localStorage.getItem('eventsArr') ? JSON.parse(localStorage.getItem('eventsArr')) : [];

const months = ["January", "February", "March", "April", "May", "June",
 "July", "August", "September", "October", "November", "December"];

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const monthDisplay = document.querySelector(".monthDisplay");
const daysContainer = document.querySelector(".days");
const prevButton = document.querySelector(".prev-btn");
const nextButton = document.querySelector(".next-btn");
const displayDay = document.querySelector(".event-day");
const displayDate = document.querySelector(".event-date");
const todayButton = document.querySelector(".today-btn");
const goToButton = document.querySelector(".goto-btn");
const goToInput = document.querySelector(".date-input");
const addEventButton = document.querySelector(".add-event");
const addEventWrapper = document.querySelector(".add-event-wrapper");
const closeButton = document.querySelector(".close-btn");
const eventName = document.querySelector(".event-name");
const eventTimeFrom = document.querySelector(".event-time-from");
const eventTimeTo = document.querySelector(".event-time-to");
const eventsContainer = document.querySelector(".events");
const submitEventButton = document.querySelector(".add-event-btn");

let today = new Date();
let day = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();

eventsArr = [
    {
        day: 28,
        month: 5,
        year: 2023,
        events: [{
            title: "Test Event",
            time: "10:00 AM",
        },{
            title: "Test Event 2",
            time: "11:00 AM",
    }]
    },{
        day: 30,
        month: 5,
        year: 2023,
        events: [{
            title: "Next Day",
            time: "15:00",
        }]
    }
];

//Renders Calendar
function renderCalendar() {
    const firstDayOfMonth = new Date(year, month, 1);   //Gives string for first day of current month
    const lastDayOfMonth = new Date(year, month+ 1, 0).getDay(); //Gives index of final day of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();   //Gives last day of the current month
    const prevMonthDay = new Date(year, month, 0);  //String of previous month
    const daysInPrev = prevMonthDay.getDate();
    //Gets the information about the current month and its first day. Example: Thursday, 6/1/2023
    const cleanDate = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    //Calculates the number of padding days a month should have. Example: 4 days for June. 
    const padding = weekdays.indexOf(cleanDate.split(', ')[0]);
    const prevPadStart = daysInPrev - padding;

    //Display the month and year at the top of the screen
    monthDisplay.innerHTML = months[month] + " " + year;
    

    //Empty days for rendering calendar each time.
    let days = "";

    //Renders Padding Days for previous month
    for(let i = prevPadStart + 1; i < daysInPrev + 1; i++) {
        days += `<div class = "day prev-date">${i}</div>`;
    }

    //Renders days for current month
    for(let i = 1; i <= daysInMonth; i++) {
        
        //If the date is today's date, give it special formatting. Set activeDay to this day by default.
        if(i  === new Date().getDate() && year === new Date().getFullYear() && month == new Date().getMonth()){
            
            days += `<div class = "day today active ">${i}</div>`;
            activeDay = i;
            selectedDate(i);
            displayEvents(i);
        }
        //Otherwise, render a normal day.
        else {
            days += `<div class = "day ">${i}</div>`;
        }
    }

    //Renders padding days for next month
    for(let i = 1; i <= (7 - lastDayOfMonth - 1); i++) {
        days += `<div class = "day next-date">${i}</div>`;
    }

    

    daysContainer.innerHTML = days;
    activeAdder();
};
renderCalendar();

//Decrements month and year value for changing months
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    renderCalendar();
};

//Increments month and year value for changing months
function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    renderCalendar();
};

//Controls previous and next buttons on calendar portion
prevButton.addEventListener("click", prevMonth);
nextButton.addEventListener("click", nextMonth);

renderCalendar();

//Re-renders calendar to be at the current date.
function jumpToToday() {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    renderCalendar();
    activeDay = today.getDate();
}

//Controls manually jumping to current date.
todayButton.addEventListener("click", () => {
    jumpToToday();
})

//Moderates the input text box for the Go-To box. Automatically adds a "/", only accepts numbers, and removes "/" when deleting.
goToInput.addEventListener("input", (inputDate) =>{
    goToInput.value = goToInput.value.replace(/[^0-9/]/g, "");
    if(goToInput.value.length === 2) {
        goToInput.value += "/";
    }
    if(goToInput.value.length > 7) {
        goToInput.value = goToInput.value.slice(0, 7);
    }
    if(inputDate.inputType === "deleteContentBackward") {
        if(goToInput.value.length === 3) {
            goToInput.value = goToInput.value.slice(0,2);
        }
    }
});

//CHeck to make sure date is valid. Slices it if necessary. Changes the month and year value then re-renders the calendar.
function jumpToDate() {
    const jumpInput = document.querySelector(".date-input");
    let jumpMonth = jumpInput.value.slice(0,2);
    const jumpYear = jumpInput.value.slice(3,7);
    if(jumpMonth > 12 || jumpYear.length < 4) {
        alert("Invalid Date");
        return;
    }
    if(jumpMonth < 9) {
        jumpMonth = jumpInput.value.slice(1,2);
    }
    month = jumpMonth - 1;
    year = jumpYear;
    renderCalendar();
}

//Button for Go-To box. Used for jumping to a user-input date.
goToButton.addEventListener("click", () => {
    jumpToDate();
})

//Updates righthand display with currently selected date
function selectedDate(monthDisplay) {
    const selectDay = new Date(year, month, monthDisplay);
    const selectDate = selectDay.toString().split(" ")[0];
    displayDay.innerHTML = selectDate;
    displayDate.innerHTML = monthDisplay + " " + months[month] + " " + year;
};

//Adds active to selected days. Removes active from all other days.
function activeAdder() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        //Remove active from all days.
        day.addEventListener("click", (clickedDay) => {
            selectedDate(clickedDay.target.innerHTML);
            displayEvents(Number(clickedDay.target.innerHTML));
            activeDay = Number(clickedDay.target.innerHTML);
            days.forEach((day) => {
                day.classList.remove("active");
            });
            //Move to previous month if it was a padding day for the previous month
            if(clickedDay.target.classList.contains("prev-date")) {
                prevMonth();
            }
            //Move to the next month if it was a madding day for the next month.
            else if(clickedDay.target.classList.contains("next-date")) {
                nextMonth();
            }
            //Add active to clicked day.
            clickedDay.target.classList.add("active");
        });
    });
};

//Enable or Disable the visibilty of the Add Event box.
addEventButton.addEventListener("click", () => {
    addEventWrapper.classList.toggle("active");
});

//Disable the visibility of the Add Event Box when clicking the Close button
closeButton.addEventListener("click", () => {
    addEventWrapper.classList.remove("active");
});

//Disable the visibility of the Add Event Box if clicking outside of it while it is active.
document.addEventListener(("click"), (clickedArea) => {
    if(!addEventWrapper.contains(clickedArea.target) && clickedArea.target != addEventButton) {
        addEventWrapper.classList.remove("active");
    }
});

//Limits the length of a new Event Name
eventName.addEventListener("input", () => {
    eventName.value = eventName.value.slice(0,50);
});

//Limits Event Time From to only numbers. Formats input and deleting
eventTimeFrom.addEventListener("input", (inputDate) => {
    if(eventTimeFrom.value.length === 2) {
        eventTimeFrom.value += ":";
    }
    if(eventTimeFrom.value.length > 5) {
        eventTimeFrom.value = eventTimeFrom.value.slice(0,5);
    }
    if(inputDate.inputType === "deleteContentBackward") {
        if(eventTimeFrom.value.length === 3) {
            eventTimeFrom.value = eventTimeFrom.value.slice(0,2);
        }
    }
});

//Limits Event Time To to only numbers. Formats input and deleting
eventTimeTo.addEventListener("input", (inputDate) => {
    if(eventTimeTo.value.length === 2) {
        eventTimeTo.value += ":";
    }
    if(eventTimeTo.value.length > 5) {
        eventTimeTo.value = eventTimeTo.value.slice(0,5);
    }
    if(inputDate.inputType === "deleteContentBackward") {
        if(eventTimeTo.value.length === 3) {
            eventTimeTo.value = eventTimeTo.value.slice(0,2);
        }
    }
});

function displayEvents(selectDate) {
    let events = "";
    eventsArr.forEach((event) => {
        if(selectDate === event.day && month === event.month && year === event.year) {
            event.events.forEach((event) =>{
                events += 
                `<div class="event">
                    <div class= "title">
                    <h3 class= "event-title">${event.title}</h3>
                    </div>
                 <div class="event-time">${event.time}</div>
                 </div>`;
            })
        }
        if(events === "") {
            events = `<div class = "no-event">
                        <h3>No Events</h3>
                        </div>`;
        }
    })
    eventsContainer.innerHTML = events;
};

//Add Events to eventsArr
submitEventButton.addEventListener("click", () => {
    const eTitle = eventName.value;
    const eFrom = eventTimeFrom.value;
    const eTo = eventTimeTo.value;
    if(eTitle === "" || eFrom === "" || eTo === "") {
        alert("Fill all required fields");
        return;
    }

    const newEvent = {
        title: eTitle,
        time: eFrom + " - " + eTo,
    };

    eventsArr.push({
        day: activeDay,
        month: month,
        year: year,
        events: [newEvent]
    });

    console.log(eventsArr);
})