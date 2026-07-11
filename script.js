/* ==========================================
   MOBILE MENU
========================================== */

const menuBtn = document.querySelector(".menu-btn");
const navbar = document.querySelector(".navbar");

if(menuBtn && navbar){

    menuBtn.addEventListener("click", () => {

        navbar.classList.toggle("active");

    });

}

/* ==========================================
   CLOSE MENU AFTER CLICK
========================================== */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navbar.classList.remove("active");

    });

});


/* ==========================================
   SMOOTH SCROLL
========================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});


/* ==========================================
   ACTIVE NAVIGATION
========================================== */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        if (pageYOffset >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});



/* ==========================================
   TESTIMONIAL SLIDER
========================================== */

const testimonials = document.querySelectorAll(".testimonial");

const prevBtn = document.getElementById("prevBtn");

const nextBtn = document.getElementById("nextBtn");

let currentSlide = 0;

function showSlide(index) {

    testimonials.forEach(slide => {

        slide.classList.remove("active");

    });

    testimonials[index].classList.add("active");

}

if(nextBtn){

nextBtn.addEventListener("click", () => {

    currentSlide++;

    if (currentSlide >= testimonials.length) {

        currentSlide = 0;

    }

    showSlide(currentSlide);

});

}

if(prevBtn){

prevBtn.addEventListener("click", () => {

    currentSlide--;

    if (currentSlide < 0) {

        currentSlide = testimonials.length - 1;

    }
    showSlide(currentSlide);

});
}

/* ==========================================
   AUTO SLIDER
========================================== */

setInterval(() => {

    currentSlide++;

    if (currentSlide >= testimonials.length) {

        currentSlide = 0;

    }

    showSlide(currentSlide);

}, 5000);


/* ==========================================
   SET MINIMUM DATE TO TODAY
========================================== */

const appointmentDate = document.getElementById("appointmentDate");

if (appointmentDate) {

    const today = new Date().toISOString().split("T")[0];

    appointmentDate.min = today;
}

/* ==========================================
   APPOINTMENT FORM VALIDATION
========================================== */

const appointmentForm = document.getElementById("appointmentForm");
const submitBtn = document.getElementById("submitBtn");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");

if (appointmentForm) {

    appointmentForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        successMessage.style.display = "none";
        errorMessage.style.display = "none";

        const patientName = document.getElementById("patientName").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const email = document.getElementById("email").value.trim();
        const age = document.getElementById("age").value.trim();
        const gender = document.getElementById("gender").value;
        const appointmentDate = document.getElementById("appointmentDate").value;
        const preferredTime = document.getElementById("preferredTime").value;
        const doctor = document.getElementById("doctor").value;
        const treatment = document.getElementById("treatment").value;
        const notes = document.getElementById("notes").value.trim();

        /* -----------------------------
           REQUIRED FIELDS
        ----------------------------- */

        if (
            !patientName ||
            !mobile ||
            !email ||
            !age ||
            !gender ||
            !appointmentDate ||
            !preferredTime ||
            !doctor ||
            !treatment
        ) {
            errorMessage.innerHTML = "Please fill all required fields.";
            errorMessage.style.display = "block";
            return;
        }

        /* -----------------------------
           PHONE VALIDATION
        ----------------------------- */

        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(mobile)) {
            errorMessage.innerHTML =
                "Please enter a valid 10-digit mobile number.";
            errorMessage.style.display = "block";
            return;
        }

        /* -----------------------------
           EMAIL VALIDATION
        ----------------------------- */

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            errorMessage.innerHTML =
                "Please enter a valid email address.";
            errorMessage.style.display = "block";
            return;
        }

        /* -----------------------------
           AGE VALIDATION
        ----------------------------- */

        const ageNumber = Number(age);

        if (ageNumber < 1 || ageNumber > 120) {

            errorMessage.innerHTML =
                "Age must be between 1 and 120.";

            errorMessage.style.display = "block";

            return;

        }

        /* -----------------------------
           DATE VALIDATION
        ----------------------------- */

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(appointmentDate);

        if (selectedDate < today) {

            errorMessage.innerHTML =
                "Past dates are not allowed.";

            errorMessage.style.display = "block";

            return;

        }

        /* -----------------------------
           LOADING STATE
        ----------------------------- */

        submitBtn.disabled = true;
        submitBtn.innerHTML = "Booking Appointment...";

       await saveAppointment({
    patientName,
    mobile,
    email,
    ageNumber,
    gender,
    appointmentDate,
    preferredTime,
    doctor,
    treatment,
    notes
});

submitBtn.disabled = false;
submitBtn.innerHTML = "Book Appointment";

    });

}

/* ==========================================
   SUPABASE CONFIGURATION
========================================== */

// Paste your Supabase Project URL here
const SUPABASE_URL = "https://xxxxxxxx.supabase.co";

// Paste your Supabase Anon Key here
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// Create Supabase client
let supabaseClient = null;

if(
    SUPABASE_URL !== "https://xxxxxxxx.supabase.co" &&
    SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY"
){

    supabaseClient = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

}

/* ==========================================
   SAVE APPOINTMENT
========================================== */

async function saveAppointment(data) {

    try {

        const { error } = await supabaseClient
            .from("appointments")
            .insert([
                {
                    patient_name: data.patientName,
                    mobile: data.mobile,
                    email: data.email,
                    age: data.ageNumber,
                    gender: data.gender,
                    appointment_date: data.appointmentDate,
                    preferred_time: data.preferredTime,
                    doctor: data.doctor,
                    treatment: data.treatment,
                    notes: data.notes
                }
            ]);

        if (error) throw error;

        successMessage.innerHTML =
            "✅ Appointment booked successfully!";

        successMessage.style.display = "block";
        errorMessage.style.display = "none";

        appointmentForm.reset();

        // Reset minimum date after reset
        if (appointmentDate) {
            appointmentDate.min = new Date()
                .toISOString()
                .split("T")[0];
        }

    } catch (err) {

        console.error("Supabase Error:", err);

        successMessage.style.display = "none";

        errorMessage.innerHTML =
            "❌ Unable to book appointment. Please try again.";

        errorMessage.style.display = "block";

    }
}

/* ===========================
   Animated Counters
=========================== */

const counters = document.querySelectorAll(".counter");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.dataset.target);

        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 100));

        function updateCounter() {

            current += increment;

            if (current < target) {

                counter.textContent = current.toLocaleString();
                requestAnimationFrame(updateCounter);

            } else {

                if (target === 98) {
                    counter.textContent = "98%";
                } else {
                    counter.textContent = target.toLocaleString() + "+";
                }

            }
        }

        updateCounter();

        observer.unobserve(counter);

    });

}, {
    threshold: 0.5
});

counters.forEach(counter => observer.observe(counter));

/* ================= BACK TO TOP ================= */

const backToTop = document.getElementById("backToTop");

if(backToTop){

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            backToTop.style.display = "block";

        } else {

            backToTop.style.display = "none";

        }

    });


    backToTop.addEventListener("click", () => {

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}


/* ================= LOADER ================= */

window.addEventListener("load", function () {

    const loader = document.getElementById("loader");

    setTimeout(() => {

        loader.classList.add("hide");

    }, 1800);

});

/* ================= SCROLL REVEAL ================= */

const revealElements = document.querySelectorAll(
    ".about, .service-card, .doctor-card, .gallery-item, .testimonial, .contact, .appointment"
);


const revealObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("active");

        }

    });

},{
    threshold:0.15
});


revealElements.forEach(element=>{

    element.classList.add("reveal");

    revealObserver.observe(element);

});