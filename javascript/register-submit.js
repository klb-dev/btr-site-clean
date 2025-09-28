document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const message = document.getElementById("formMessage");

  if (!form) {
    console.error("registrationForm not found in DOM");
    return;
  }

  function showToast(msg, success = true) {
    message.textContent = msg;
    message.style.color = success ? "green" : "red";
    message.style.fontWeight = "bold";
    message.classList.remove("hidden");
    setTimeout(() => {
      message.classList.add("hidden");
    }, 5000);
  }

  let childCount = 1;

  const reregisterChk = document.getElementById("reregisterChk");
  const reregisterHint = document.getElementById("reregisterHint");

  function setReturningMode(enabled) {
    document.querySelectorAll(".child-entry").forEach((entry) => {
      const name = entry.querySelector('[name="child_name"]');
      const age = entry.querySelector('[name="age"]');
      const gender = entry.querySelector('[name="gender"]');
      const level = entry.querySelector('[name="skate_level"]');
      const school = entry.querySelector('[name="school"]');

      name.required = true;
      [age, gender, level, school].forEach((i) => {
        if (i) i.required = !enabled;
      });

      [age, gender, level, school].forEach((i) => {
        if (!i) return;
        i.closest("label")?.classList.toggle("opacity-60", enabled);
      });
    });

    reregisterHint?.classList.toggle("hidden", !enabled);
  }

  reregisterChk?.addEventListener("change", (e) => {
    setReturningMode(e.target.checked);
  });

  setReturningMode(false);

  function normalizePhone(val) {
    return (val || "").replace(/[^0-9]/g, "");
  }

  // --- Adult mode visual cue ---
  function updateAdultMode(entry, age) {
    const schoolField = entry.querySelector('[name="school"]')?.closest("label");
    if (schoolField) {
      if (age >= 18) {
        schoolField.style.opacity = "0.5";
        schoolField.querySelector("input").required = false;
      } else {
        schoolField.style.opacity = "1";
        schoolField.querySelector("input").required = true;
      }
    }

    const parentField = document.querySelector('[name="parent_name"]')?.closest("label");
    if (parentField) {
      parentField.style.opacity = age >= 18 ? "0.5" : "1";
    }
  }

  function attachAgeListener(entry) {
    const ageInput = entry.querySelector('[name="age"]');
    ageInput.addEventListener("input", () => {
      const val = parseInt(ageInput.value, 10);
      if (!isNaN(val)) {
        updateAdultMode(entry, val);
      }
    });
  }

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
        </select>
      </label>
      <label>
        Skate Level:
        <select name="skate_level" required>
          <option value="">Select</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Teacher">Teacher</option>
        </select>
      </label>
      <label>School: <input type="text" name="school" required /></label>
    `;
    container.appendChild(fieldset);

    attachAgeListener(fieldset);

    const newNameInput = fieldset.querySelector('input[name="child_name"]');
    if (newNameInput) newNameInput.focus();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const eventDateInput = document.getElementById("event_date");
    if (!eventDateInput || !eventDateInput.value) {
      showToast("Event date not found. Please reload the page.", false);
      return;
    }

    const returning = reregisterChk?.checked === true;
    const parent_name = form.querySelector('[name="parent_name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const phone = normalizePhone(form.querySelector('[name="phone"]').value);

    // Build children from the form (unchanged logic except school for 18+)
    const children = [];
    document.querySelectorAll(".child-entry").forEach((entry) => {
      const ageVal = entry.querySelector('[name="age"]')?.value?.trim();
      const age = ageVal ? parseInt(ageVal, 10) : null;

      const child = {
        child_name: entry.querySelector('[name="child_name"]').value.trim(),
        age: ageVal,
        gender: entry.querySelector('[name="gender"]')?.value,
        skate_level: entry.querySelector('[name="skate_level"]')?.value?.trim(),
        school:
          age !== null && age >= 18
            ? null
            : entry.querySelector('[name="school"]')?.value?.trim(),
      };
      if (!child.child_name) return;
      children.push(child);
    });

    if (children.length === 0) {
      showToast("Please enter at least one child's name.", false);
      return;
    }

    // Validation: phone always; parent only if any child < 18
    const requireParent = children.some((c) => !c.age || parseInt(c.age, 10) < 18);
    if (!phone) {
      showToast("Please provide a phone number.", false);
      return;
    }
    if (requireParent && !parent_name) {
      showToast("Please provide parent name for minors.", false);
      return;
    }

    const event_date = eventDateInput.value;

    try {
      let totalCreated = 0;
      let quickCreated = 0;
      let fallbackCreated = 0;

      if (returning) {
        // 1) QUICK: try to reuse prior info by phone + child_name
        const quickPayload = {
          phone,
          event_date,
          children: children.map((c) => ({ child_name: c.child_name })),
        };

        const quickRes = await fetch(
          "https://btr-backend-7f5r.onrender.com/registration/quick",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quickPayload),
          }
        );

        const quickJson = await quickRes.json();
        if (!quickRes.ok) {
          throw new Error(quickJson?.message || "Quick re-register failed.");
        }

        quickCreated = Number(quickJson.created_count || 0);
        const unmatchedNames = (quickJson.unmatched || [])
          .map((u) => (u.child_name || "").trim())
          .filter(Boolean);

        // 2) FALLBACK: for only unmatched names, submit full records
        if (unmatchedNames.length > 0) {
          const fallbackChildren = children.filter((c) =>
            unmatchedNames.includes(c.child_name)
          );

          if (fallbackChildren.length > 0) {
            const fullPayload = {
              returning: false, // this is the full path
              phone,
              ...(requireParent ? { parent_name } : {}),
              email,
              event_date,
              children: fallbackChildren,
            };

            const fullRes = await fetch(
              "https://btr-backend-7f5r.onrender.com/registration",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fullPayload),
              }
            );
            const fullJson = await fullRes.json();
            if (!fullRes.ok) {
              throw new Error(fullJson?.message || "Fallback registration failed.");
            }
            // Server returns message like "N child(ren) registered."
            // Count via payload since we know how many we sent.
            fallbackCreated = fallbackChildren.length;
          }
        }

        totalCreated = quickCreated + fallbackCreated;
      } else {
        // Non-returning: send everything through the full path (unchanged)
        const payload = {
          returning: false,
          phone,
          ...(requireParent ? { parent_name } : {}),
          email,
          event_date,
          children,
        };

        const res = await fetch(
          "https://btr-backend-7f5r.onrender.com/registration",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Failed to submit");
        totalCreated = children.length;
      }

      // Success UI (keep your existing reset + message)
      form.reset();
      document.getElementById("childrenContainer").innerHTML = "";

      const count = totalCreated;
      const childText = count === 1 ? "child" : "children";
      message.innerHTML = `
        <p style="color: var(--primary); font-weight: bold;">
          Thanks for registering your ${count} ${childText}.
          ${returning ? `(Reused: ${quickCreated}${
        fallbackCreated ? `, New: ${fallbackCreated}` : ""
      })` : ""}
        </p>
        <p><strong>Want to stay in the loop?</strong>
        <a href="/#newsletter" style="color: var(--primary);">Click here to join our newsletter.</a></p>
      `;
      message.classList.remove("hidden");

      // Rebuild initial child fieldset (kept same as your original)
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

      // If you kept the age visual cue helper:
      if (typeof attachAgeListener === "function") {
        attachAgeListener(initialFieldset);
      }
    } catch (err) {
      showToast(err.message || "Error submitting form.", false);
      console.error(err);
    }
  });


  const firstNameInput = document.querySelector(
    '.child-entry input[name="child_name"]'
  );
  if (firstNameInput) firstNameInput.focus();

  // Attach listener to first child fieldset
  const firstChildEntry = document.querySelector(".child-entry");
  if (firstChildEntry) attachAgeListener(firstChildEntry);
});
