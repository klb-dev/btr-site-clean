document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  console.log("Form found", form)
  const message = document.getElementById("formMessage");

    if (!form) {
    console.error("registrationForm not found in DOM");
    return;
    }

  // Show a temporary toast message
  function showToast(msg, success = true) {
    message.textContent = msg;
    message.style.color = success ? "green" : "red";
    message.style.fontWeight = "bold";
    message.classList.remove("hidden");
    setTimeout(() => {
      message.classList.add("hidden");
    }, 5000);
  }

  // Track number of child entries
  let childCount = 1;

  // Handle Add Child button
  const addBtn = document.getElementById("addChildBtn");
  addBtn.addEventListener("click", () => {
    if (childCount >= 4) {
      showToast("You can only register up to 4 children at once.", false);
      return;
    }

    childCount++;
    const container = document.getElementById("childrenContainer");

    const fieldset = document.createElement("fieldset");
    fieldset.className = "child-entry";
    fieldset.innerHTML = `
      <legend>Child ${childCount}</legend>
      <label>Child's Full Name: <input type="text" name="child_name" required /></label>
      <label>Age: <input type="number" name="age" min="1" max="18" required /></label>
      <label>Gender:
        <select name="gender" required>
          <option value="">Select</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="Other">Other</option>
        </select>
      </label>
      <label>
            Skate Level:
            <select name="skate_level" required>
              <option value="">Select</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </label>
      <label>School: <input type="text" name="school" required /></label>
    `;
    container.appendChild(fieldset);

    // Autofocus the new child's name input
    const newNameInput = fieldset.querySelector('input[name="child_name"]');
    if (newNameInput) {
      newNameInput.focus();
    }
  });

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect child entries
    const children = [];
    const childEntries = document.querySelectorAll(".child-entry");

    childEntries.forEach((entry) => {
      const child = {
        child_name: entry.querySelector('[name="child_name"]').value.trim(),
        age: entry.querySelector('[name="age"]').value.trim(),
        gender: entry.querySelector('[name="gender"]').value,
        skate_level: entry.querySelector('[name="skate_level"]').value.trim(),
        school: entry.querySelector('[name="school"]').value.trim()
      };

      if (Object.values(child).some(v => !v)) {
        showToast("Please fill out all child fields.", false);
        return;
      }

      children.push(child);
    });

    if (children.length === 0) {
      showToast("Please add at least one child.", false);
      return;
    }

    // Get event date
    const eventDateInput = document.getElementById("event_date");
      if (!eventDateInput || !eventDateInput.value) {
        showToast("Event date not found. Please reload the page.", false);
        return;
    }

    // Build payload
    const payload = {
      parent_name: form.querySelector('[name="parent_name"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      phone: form.querySelector('[name="phone"]').value.replace(/[^0-9]/g, ""),
      event_date: eventDateInput.value,
      children,
    };

    if (Object.values(payload).some(v => !v)) {
      showToast("Please fill out all parent fields.", false);
      return;
    }

    // Send to backend
    try {
      const response = await fetch("https://btr-backend-7f5r.onrender.com/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Server response:", result);

      if (!response.ok) throw new Error("Failed to submit");

      // Reset form and show confirmation message
      form.reset();
      document.getElementById("childrenContainer").innerHTML = "";

      const count = children.length;
      const childText = count === 1 ? "child" : "children";

      message.innerHTML = `
        <p style="color: var(--primary); font-weight: bold;">Thanks for registering your ${count} ${childText}.</p>
        <p><strong>Want to stay in the loop?</strong> 
        <a href="/#newsletter" style="color: var(--primary);">Click here to join our newsletter.</a></p>
      `;
      message.classList.remove("hidden");

      // Reset child entry UI
      childCount = 1;
      const initialFieldset = document.createElement("fieldset");
      initialFieldset.className = "child-entry";
      initialFieldset.innerHTML = `
        <legend>Child 1</legend>
        <label>Child's Full Name: <input type="text" name="child_name" required /></label>
        <label>Age: <input type="number" name="age" min="1" max="18" required /></label>
        <label>Gender:
          <select name="gender" required>
            <option value="">Select</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>Skate Level:
          <select name="skate_level" required>
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>
        <label>School: <input type="text" name="school" required /></label>
      `;
      document.getElementById("childrenContainer").appendChild(initialFieldset);
    } catch (err) {
      showToast("Error submitting form.", false);
      console.error(err);
    }
  });

  // Autofocus the first child name on page load
  const firstNameInput = document.querySelector('.child-entry input[name="child_name"]');
  if (firstNameInput) {
    firstNameInput.focus();
  }
});
