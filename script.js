let selectedMode = "bus";
let selectedJourney = null;

const routes = [
    {
        mode: "bus",
        from: "Hyderabad",
        to: "Bengaluru",
        name: "TransitGo Express",
        departure: "21:00",
        arrival: "06:00",
        duration: "9h",
        price: 899
    },
    {
        mode: "bus",
        from: "Hyderabad",
        to: "Goa",
        name: "Coastal Dreamliner",
        departure: "18:30",
        arrival: "07:15",
        duration: "12h 45m",
        price: 1499
    },
    {
        mode: "bus",
        from: "Chennai",
        to: "Bengaluru",
        name: "City Connect",
        departure: "07:00",
        arrival: "13:30",
        duration: "6h 30m",
        price: 799
    },
    {
        mode: "train",
        from: "Delhi",
        to: "Mumbai",
        name: "Metro City Express",
        departure: "16:30",
        arrival: "08:50",
        duration: "16h 20m",
        price: 1299
    },
    {
        mode: "train",
        from: "Bengaluru",
        to: "Chennai",
        name: "Southern Rail Express",
        departure: "06:00",
        arrival: "11:50",
        duration: "5h 50m",
        price: 549
    },
    {
        mode: "train",
        from: "Hyderabad",
        to: "Visakhapatnam",
        name: "Coastal Rail Journey",
        departure: "20:00",
        arrival: "07:00",
        duration: "11h",
        price: 699
    }
];

function localDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

const dateInput = document.getElementById("date");

const today = localDateString(new Date());

dateInput.min = today;
dateInput.value = today;


// SWITCH BETWEEN BUS AND TRAIN

function selectMode(mode) {

    selectedMode = mode;

    document.getElementById("busTab")
        .classList.toggle("active", mode === "bus");

    document.getElementById("trainTab")
        .classList.toggle("active", mode === "train");

    document.getElementById("resultsSection").hidden = true;
}


// SEARCH TICKETS

document.getElementById("searchForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const source = document.getElementById("source")
            .value.trim().toLowerCase();

        const destination = document.getElementById("destination")
            .value.trim().toLowerCase();

        const journeyDate = dateInput.value;

        if (!source || !destination || !journeyDate) {
            alert("Please fill in all journey details.");
            return;
        }

        if (source === destination) {
            alert("Departure and destination must be different.");
            return;
        }

        if (journeyDate < localDateString(new Date())) {
            alert("Please select today or a future date.");
            return;
        }

        const matchingRoutes = routes.filter(route => {

            return (
                route.mode === selectedMode &&
                route.from.toLowerCase() === source &&
                route.to.toLowerCase() === destination
            );

        });

        displayResults(matchingRoutes);

    });


// DISPLAY SEARCH RESULTS

function displayResults(matchingRoutes) {

    const resultsSection =
        document.getElementById("resultsSection");

    const resultsContainer =
        document.getElementById("results");

    const summary =
        document.getElementById("searchSummary");

    resultsContainer.replaceChildren();

    resultsSection.hidden = false;

    summary.textContent =
        `${matchingRoutes.length} demo ride(s) found`;

    if (matchingRoutes.length === 0) {

        const message = document.createElement("p");

        message.textContent =
            "No demo routes found for this journey. " +
            "Try Hyderabad to Bengaluru, Hyderabad to Goa, " +
            "or Delhi to Mumbai.";

        resultsContainer.appendChild(message);

        resultsSection.scrollIntoView({
            behavior: "smooth"
        });

        return;
    }

    matchingRoutes.forEach(route => {

        const card = document.createElement("div");

        card.className = "result-card";

        const title = document.createElement("h3");
        title.textContent =
            `${route.mode === "bus" ? "🚌" : "🚆"} ${route.name}`;

        const cities = document.createElement("p");
        cities.textContent = `${route.from} → ${route.to}`;

        const times = document.createElement("p");
        times.textContent =
            `🕒 ${route.departure} → ${route.arrival}`;

        const duration = document.createElement("p");
        duration.textContent = `⏱️ ${route.duration}`;

        const price = document.createElement("div");
        price.className = "result-price";

        const passengers = Number(
            document.getElementById("passengers").value
        );

        price.textContent =
            `₹${(route.price * passengers).toLocaleString("en-IN")}`;

        const button = document.createElement("button");
        button.textContent = "Book Demo Ticket →";

        button.addEventListener("click", () => {
            openBooking(route);
        });

        card.append(
            title,
            cities,
            times,
            duration,
            price,
            button
        );

        resultsContainer.appendChild(card);

    });

    resultsSection.scrollIntoView({
        behavior: "smooth"
    });

}


// QUICK SEARCH FROM POPULAR ROUTES

function quickSearch(from, to, mode) {

    document.getElementById("source").value = from;
    document.getElementById("destination").value = to;

    selectMode(mode);

    document.getElementById("booking").scrollIntoView({
        behavior: "smooth"
    });

    document.getElementById("searchForm")
        .requestSubmit();

}


// OPEN BOOKING MODAL

function openBooking(route) {

    selectedJourney = route;

    const passengers = Number(
        document.getElementById("passengers").value
    );

    const total = route.price * passengers;

    const details =
        document.getElementById("bookingDetails");

    details.textContent =
        `${route.from} → ${route.to} | ` +
        `${passengers} passenger(s) | ` +
        `Total: ₹${total.toLocaleString("en-IN")}`;

    document.getElementById("bookingForm").hidden = false;

    document.getElementById("bookingConfirmation").hidden = true;

    document.getElementById("bookingModal").hidden = false;

}


// CLOSE MODAL

function closeModal() {

    document.getElementById("bookingModal").hidden = true;

}


// CONFIRM DEMO BOOKING

document.getElementById("bookingForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        if (!selectedJourney) {
            return;
        }

        const name =
            document.getElementById("passengerName").value.trim();

        const email =
            document.getElementById("passengerEmail").value.trim();

        if (!name || !email) {
            alert("Please enter your name and email.");
            return;
        }

        const reference =
            "TG" + Date.now().toString().slice(-8);

        const confirmation =
            document.getElementById("bookingConfirmation");

        confirmation.replaceChildren();

        const heading = document.createElement("h3");
        heading.textContent = "🎉 Demo Booking Confirmed!";

        const referenceText = document.createElement("p");
        referenceText.textContent =
            `Your demo reference: ${reference}`;

        const notice = document.createElement("p");
        notice.textContent =
            "This is a practice booking. " +
            "No real ticket has been issued.";

        confirmation.append(
            heading,
            referenceText,
            notice
        );

        confirmation.hidden = false;

        document.getElementById("bookingForm").hidden = true;

    });


// CLOSE MODAL ON OUTSIDE CLICK

document.getElementById("bookingModal")
    .addEventListener("click", function(event) {

        if (event.target === this) {
            closeModal();
        }

    });
