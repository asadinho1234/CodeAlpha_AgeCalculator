class AgeCalculator {
  constructor() {
    this.birthdateInput = document.getElementById("birthdate")
    this.calculateBtn = document.getElementById("calculateBtn")
    this.resultSection = document.getElementById("resultSection")
    this.errorMessage = document.getElementById("errorMessage")

    this.yearsElement = document.getElementById("years")
    this.monthsElement = document.getElementById("months")
    this.daysElement = document.getElementById("days")
    this.totalDaysElement = document.getElementById("totalDays")
    this.totalHoursElement = document.getElementById("totalHours")
    this.totalMinutesElement = document.getElementById("totalMinutes")

    this.init()
  }

  init() {
    // Set max date to today
    const today = new Date().toISOString().split("T")[0]
    this.birthdateInput.max = today

    // Event listeners
    this.calculateBtn.addEventListener("click", () => this.calculateAge())
    this.birthdateInput.addEventListener("change", () => this.hideError())
    this.birthdateInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.calculateAge()
      }
    })

    // Auto-calculate on date change
    this.birthdateInput.addEventListener("change", () => {
      if (this.birthdateInput.value) {
        setTimeout(() => this.calculateAge(), 300)
      }
    })
  }

  calculateAge() {
    const birthdate = this.birthdateInput.value

    if (!birthdate) {
      this.showError("Please select your birth date")
      return
    }

    const birthDate = new Date(birthdate)
    const today = new Date()

    if (birthDate > today) {
      this.showError("Birth date cannot be in the future")
      return
    }

    if (birthDate.getFullYear() < 1900) {
      this.showError("Please enter a valid birth year")
      return
    }

    this.hideError()

    const ageData = this.getAgeDetails(birthDate, today)
    this.displayResults(ageData)

    // Add celebration effect for special ages
    this.addCelebrationEffect(ageData.years)
  }

  getAgeDetails(birthDate, currentDate) {
    let years = currentDate.getFullYear() - birthDate.getFullYear()
    let months = currentDate.getMonth() - birthDate.getMonth()
    let days = currentDate.getDate() - birthDate.getDate()

    // Adjust for negative days
    if (days < 0) {
      months--
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
      days += lastMonth.getDate()
    }

    // Adjust for negative months
    if (months < 0) {
      years--
      months += 12
    }

    // Calculate total days lived
    const totalDays = Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24))
    const totalHours = totalDays * 24
    const totalMinutes = totalHours * 60

    return {
      years,
      months,
      days,
      totalDays,
      totalHours: totalHours.toLocaleString(),
      totalMinutes: totalMinutes.toLocaleString(),
    }
  }

  displayResults(ageData) {
    // Animate numbers counting up
    this.animateNumber(this.yearsElement, ageData.years, 1000)
    this.animateNumber(this.monthsElement, ageData.months, 1200)
    this.animateNumber(this.daysElement, ageData.days, 1400)

    // Update additional info with delay for better UX
    setTimeout(() => {
      this.totalDaysElement.textContent = ageData.totalDays.toLocaleString()
      this.totalHoursElement.textContent = ageData.totalHours
      this.totalMinutesElement.textContent = ageData.totalMinutes
    }, 800)

    // Show result section with animation
    this.resultSection.classList.add("show")

    // Scroll to results on mobile
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        this.resultSection.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }, 500)
    }
  }

  animateNumber(element, targetNumber, duration) {
    const startNumber = 0
    const increment = targetNumber / (duration / 16) // 60fps
    let currentNumber = startNumber

    const timer = setInterval(() => {
      currentNumber += increment
      if (currentNumber >= targetNumber) {
        currentNumber = targetNumber
        clearInterval(timer)
      }
      element.textContent = Math.floor(currentNumber)
    }, 16)
  }

  showError(message) {
    this.errorMessage.querySelector("span").textContent = message
    this.errorMessage.classList.add("show")
    this.resultSection.classList.remove("show")

    // Auto-hide error after 5 seconds
    setTimeout(() => {
      this.hideError()
    }, 5000)
  }

  hideError() {
    this.errorMessage.classList.remove("show")
  }

  addCelebrationEffect(years) {
    // Special celebration for milestone ages
    const milestones = [18, 21, 25, 30, 40, 50, 60, 70, 80, 90, 100]

    if (milestones.includes(years)) {
      this.createConfetti()

      // Show special message
      setTimeout(() => {
        this.showMilestoneMessage(years)
      }, 1000)
    }
  }

  createConfetti() {
    const colors = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"]

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div")
        confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    animation: confettiFall 3s linear forwards;
                `

        document.body.appendChild(confetti)

        setTimeout(() => {
          confetti.remove()
        }, 3000)
      }, i * 50)
    }

    // Add confetti animation
    if (!document.querySelector("#confetti-style")) {
      const style = document.createElement("style")
      style.id = "confetti-style"
      style.textContent = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `
      document.head.appendChild(style)
    }
  }

  showMilestoneMessage(years) {
    const messages = {
      18: "🎉 Welcome to adulthood!",
      21: "🍾 Cheers to 21!",
      25: "🌟 Quarter century milestone!",
      30: "🎂 Three decades of awesome!",
      40: "💪 Fabulous at 40!",
      50: "🏆 Half a century of greatness!",
      60: "👑 Diamond years begin!",
      70: "🌺 Platinum milestone achieved!",
      80: "⭐ Eight decades of wisdom!",
      90: "🎊 Nine decades of incredible life!",
      100: "🎉 CENTURY CLUB! What an achievement!",
    }

    const message = messages[years]
    if (message) {
      const toast = document.createElement("div")
      toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 15px 20px;
                border-radius: 12px;
                font-weight: 600;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 1001;
                animation: slideIn 0.5s ease-out;
            `
      toast.textContent = message

      document.body.appendChild(toast)

      setTimeout(() => {
        toast.style.animation = "slideOut 0.5s ease-in forwards"
        setTimeout(() => toast.remove(), 500)
      }, 4000)

      // Add slide animations
      if (!document.querySelector("#toast-style")) {
        const style = document.createElement("style")
        style.id = "toast-style"
        style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `
        document.head.appendChild(style)
      }
    }
  }
}

// Initialize the calculator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AgeCalculator()
})

// Add some fun easter eggs
document.addEventListener("keydown", (e) => {
  // Konami code easter egg
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
  window.konamiIndex = window.konamiIndex || 0

  if (e.keyCode === konamiCode[window.konamiIndex]) {
    window.konamiIndex++
    if (window.konamiIndex === konamiCode.length) {
      // Easter egg activated!
      document.body.style.animation = "rainbow 2s infinite"
      setTimeout(() => {
        document.body.style.animation = ""
        window.konamiIndex = 0
      }, 10000)

      // Add rainbow animation
      if (!document.querySelector("#rainbow-style")) {
        const style = document.createElement("style")
        style.id = "rainbow-style"
        style.textContent = `
                    @keyframes rainbow {
                        0% { filter: hue-rotate(0deg); }
                        100% { filter: hue-rotate(360deg); }
                    }
                `
        document.head.appendChild(style)
      }
    }
  } else {
    window.konamiIndex = 0
  }
})
