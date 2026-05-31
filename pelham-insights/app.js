/**
 * Pelham Insights LLC - Interactive Funnel & Lead Magnet
 * Follows modern web development best practices for accessibility, validation, and layout logic.
 */

document.addEventListener("DOMContentLoaded", () => {
  initScrollHeader();
  initMobileNav();
  initTabs();
  initWizard();
  initPlaybook();
  initSubpageAdvisory();
  initNewsletter();
  initSmoothScroll();
});

/**
 * 1. Fixed Header Scroll Shrinking Fallback
 * For browsers that do not support CSS scroll-driven animations
 */
function initScrollHeader() {
  const header = document.getElementById("main-header");
  
  // Feature detect native CSS scroll-driven animations
  const supportsScrollTimeline = CSS.supports && CSS.supports("(animation-timeline: scroll()) and (animation-range: 0% 100%)");
  
  if (!supportsScrollTimeline) {
    const checkScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    
    window.addEventListener("scroll", checkScroll);
    checkScroll(); // Initial check on load
  }
}

/**
 * 2. Mobile Menu Navigation
 */
function initMobileNav() {
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  
  if (!toggleBtn || !navMenu) return;
  
  toggleBtn.addEventListener("click", () => {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", !isExpanded);
    navMenu.classList.toggle("active");
  });

  // Close menu when a link is clicked
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      toggleBtn.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("active");
    });
  });
}

/**
 * 3. Tab System (Wizard vs Playbook)
 */
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");
  const headerWizardLink = document.getElementById("nav-wizard-link");
  const headerPlaybookLink = document.getElementById("nav-playbook-link");
  const heroWizardLink = document.getElementById("hero-primary-cta");
  const heroPlaybookLink = document.getElementById("hero-secondary-cta");

  const switchTab = (tabId) => {
    tabs.forEach(tab => {
      const isTarget = tab.id === tabId;
      tab.classList.toggle("active", isTarget);
      tab.setAttribute("aria-selected", isTarget ? "true" : "false");
    });

    panels.forEach(panel => {
      const targetPanelId = tabId.replace("tab-", "panel-");
      const isTarget = panel.id === targetPanelId;
      panel.classList.toggle("active", isTarget);
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      switchTab(tab.id);
    });
  });

  // Header and Hero link routing shortcuts
  const setupShortcuts = (triggerLink, tabId) => {
    if (!triggerLink) return;
    triggerLink.addEventListener("click", (e) => {
      e.preventDefault();
      switchTab(tabId);
      const target = document.getElementById("funnel-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

  setupShortcuts(headerWizardLink, "tab-wizard");
  setupShortcuts(headerPlaybookLink, "tab-playbook");
  setupShortcuts(heroWizardLink, "tab-wizard");
  setupShortcuts(heroPlaybookLink, "tab-playbook");
  
  // Sync the "Start Assessment" header action button
  const headerCta = document.getElementById("header-cta-btn");
  setupShortcuts(headerCta, "tab-wizard");
}

/**
 * 4. Multi-Step Business Assessment Wizard
 */
function initWizard() {
  const welcomeScreen = document.getElementById("wizard-welcome");
  const startBtn = document.getElementById("start-wizard-btn");
  const form = document.getElementById("assessment-form");
  const steps = document.querySelectorAll(".wizard-step");
  const progressIndicators = document.querySelectorAll(".progress-steps .step");
  const progressFill = document.getElementById("wizard-fill");
  
  const prevBtn = document.getElementById("wizard-prev-btn");
  const nextBtn = document.getElementById("wizard-next-btn");
  const submitBtn = document.getElementById("wizard-submit-btn");
  
  const loader = document.getElementById("wizard-loader");
  const resultsScreen = document.getElementById("wizard-results");
  
  let currentStep = 1;
  const totalSteps = 4;

  if (!startBtn || !form) return;

  // Begin Wizard Flow
  startBtn.addEventListener("click", () => {
    welcomeScreen.classList.add("hidden");
    form.classList.remove("hidden");
    updateNavigation();
  });

  // Step Navigation Actions
  nextBtn.addEventListener("click", () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
        updateNavigation();
      }
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
      updateNavigation();
    }
  });

  // Step Presentation States
  const showStep = (stepNumber) => {
    steps.forEach((step, idx) => {
      const stepId = idx + 1;
      step.classList.toggle("hidden", stepId !== stepNumber);
    });

    // Update steps visual indicators
    progressIndicators.forEach((indicator, idx) => {
      const stepId = idx + 1;
      indicator.classList.toggle("step-active", stepId === stepNumber);
      indicator.classList.toggle("step-complete", stepId < stepNumber);
      if (stepId === stepNumber) {
        indicator.setAttribute("aria-current", "step");
      } else {
        indicator.removeAttribute("aria-current");
      }
    });

    // Update linear progress bar width
    const percentage = ((stepNumber - 0.5) / totalSteps) * 100;
    progressFill.style.width = `${percentage}%`;
  };

  const updateNavigation = () => {
    prevBtn.classList.toggle("hidden", currentStep === 1);
    nextBtn.classList.toggle("hidden", currentStep === totalSteps);
    submitBtn.classList.toggle("hidden", currentStep !== totalSteps);
    
    if (currentStep === totalSteps) {
      submitBtn.removeAttribute("tabindex");
    } else {
      submitBtn.setAttribute("tabindex", "-1");
    }
  };

  // Form Field Validation using native ValidityState API
  const validateStep = (stepNumber) => {
    let isValid = true;
    
    // Clear old validation outputs
    document.querySelectorAll(".error-msg, .input-error").forEach(el => {
      el.textContent = "";
    });

    if (stepNumber === 1) {
      const vertical = form.querySelector('input[name="vertical"]:checked');
      if (!vertical) {
        const errorEl = document.getElementById("err-vertical");
        errorEl.textContent = "Please select a business vertical to continue.";
        isValid = false;
      }
    } else if (stepNumber === 2) {
      const revenue = form.querySelector('input[name="revenue"]:checked');
      if (!revenue) {
        const errorEl = document.getElementById("err-revenue");
        errorEl.textContent = "Please select your current annual revenue volume.";
        isValid = false;
      }
    } else if (stepNumber === 3) {
      const bottleneck = form.querySelector('input[name="bottleneck"]:checked');
      if (!bottleneck) {
        const errorEl = document.getElementById("err-bottleneck");
        errorEl.textContent = "Please select your primary operational bottleneck.";
        isValid = false;
      }
    }
    
    return isValid;
  };

  // Step 4 (Identity details) validation using native ValidityState
  const validateStep4 = () => {
    let isValid = true;
    
    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const phoneInput = document.getElementById("contact-phone");
    
    const errName = document.getElementById("err-name");
    const errEmail = document.getElementById("err-email");
    const errPhone = document.getElementById("err-phone");

    // Clear previous errors
    errName.textContent = "";
    errEmail.textContent = "";
    errPhone.textContent = "";

    // Name Validation
    if (!nameInput.checkValidity()) {
      if (nameInput.validity.valueMissing) {
        errName.textContent = "Please enter your full name.";
      } else if (nameInput.validity.tooShort) {
        errName.textContent = "Name must be at least 2 characters.";
      }
      isValid = false;
    }

    // Email Validation
    if (!emailInput.checkValidity()) {
      if (emailInput.validity.valueMissing) {
        errEmail.textContent = "Please enter your business email.";
      } else if (emailInput.validity.typeMismatch) {
        errEmail.textContent = "Please enter a valid email address (e.g. name@company.com).";
      }
      isValid = false;
    }

    // Phone Validation
    if (!phoneInput.checkValidity()) {
      if (phoneInput.validity.valueMissing) {
        errPhone.textContent = "Please enter your phone number.";
      } else if (phoneInput.validity.patternMismatch) {
        errPhone.textContent = "Please enter a valid 10-digit phone number (e.g. (555) 123-4567).";
      }
      isValid = false;
    }

    return isValid;
  };

  // Wizard Submission and Scoring Calculations
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateStep4()) return;

    // Honeypot spam check
    const honeypotVal = document.getElementById("website_verify").value;
    if (honeypotVal !== "") {
      console.warn("Spam submission blocked.");
      form.classList.add("hidden");
      resultsScreen.classList.remove("hidden");
      calculateResults({ vertical: "other_ops", revenue: "under_500k", bottleneck: "admin_systems", name: "Spam Bot" });
      return;
    }

    // Capture Form Data
    const formData = new FormData(form);
    const data = {
      vertical: formData.get("vertical"),
      revenue: formData.get("revenue"),
      bottleneck: formData.get("bottleneck"),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      timestamp: new Date().toISOString()
    };

    // Save lead to local db logs simulator
    saveLeadLocal("assessment", data);

    // Swap views for processing
    form.classList.add("hidden");
    loader.classList.remove("hidden");

    // Animate loader steps
    animateLoader(() => {
      loader.classList.add("hidden");
      resultsScreen.classList.remove("hidden");
      calculateResults(data);
    });
  });

  // Progress calculations and scanning text simulation
  const animateLoader = (callback) => {
    const step1 = document.getElementById("load-step-1");
    const step2 = document.getElementById("load-step-2");
    const step3 = document.getElementById("load-step-3");

    setTimeout(() => {
      step1.className = "complete";
      step2.className = "loading";
    }, 1200);

    setTimeout(() => {
      step2.className = "complete";
      step3.className = "loading";
    }, 2400);

    setTimeout(() => {
      step3.className = "complete";
    }, 3400);

    setTimeout(() => {
      callback();
    }, 4000);
  };

  // Scoring and Recommendation Engines
  const calculateResults = (data) => {
    let score = 75; // Baseline score
    
    // Revenue multiplier variables
    if (data.revenue === "under_500k") score -= 8;
    else if (data.revenue === "500k_2m") score += 2;
    else if (data.revenue === "2m_5m") score += 8;
    else if (data.revenue === "over_5m") score += 14;

    // Bottleneck deductions
    if (data.bottleneck === "merchant_invoicing") score -= 6;
    else if (data.bottleneck === "utility_overhead") score -= 3;
    else if (data.bottleneck === "admin_systems") score -= 8;
    else if (data.bottleneck === "advisory_expansion") score -= 4;

    // Cap score boundaries
    score = Math.max(45, Math.min(96, score));

    // Animate outcome circle progress ring
    const ring = document.getElementById("results-ring-progress");
    const scoreText = document.getElementById("results-score-text");
    const verdict = document.getElementById("results-verdict");
    const verdictDesc = document.getElementById("results-verdict-desc");
    
    const circumference = 2 * Math.PI * 45; // r=45
    const offset = circumference - (score / 100) * circumference;
    
    // Set circle values
    ring.style.strokeDasharray = `${circumference}`;
    
    setTimeout(() => {
      ring.style.strokeDashoffset = `${offset}`;
      // Animate score counter text
      animateCounter(scoreText, 0, score, 1500);
    }, 300);

    // Setup color gradients depending on score levels
    if (score < 60) {
      ring.style.stroke = "var(--accent-rose)";
      verdict.textContent = "High Risk Posture";
      verdict.style.color = "var(--accent-rose)";
    } else if (score < 80) {
      ring.style.stroke = "var(--accent-indigo)";
      verdict.textContent = "Moderate Leverage Opportunity";
      verdict.style.color = "var(--accent-indigo)";
    } else {
      ring.style.stroke = "var(--accent-teal)";
      verdict.textContent = "Strong Operational Alignment";
      verdict.style.color = "var(--accent-teal)";
    }

    // Set custom text recommendation strings
    const recSynergy = document.getElementById("rec-synergy-text");
    const recUtility = document.getElementById("rec-utility-text");
    const recConsulting = document.getElementById("rec-consulting-text");

    // Segment recommendations based on Vertical and Revenue scale
    if (data.vertical === "field_services") {
      recSynergy.innerHTML = `<strong>RooferLedger Model Alignment:</strong> Integrate your dispatch tools with RooferLedger's invoicing APIs to immediately shave up to 1.2% off standard card transaction costs and automate payment follow-up.`;
    } else if (data.vertical === "saas_software") {
      recSynergy.innerHTML = `<strong>Recoup Payment Friction:</strong> Setup customized ACH subscription cycles to mitigate traditional billing processing fees on accounts billed over $1,500/mo.`;
    } else {
      recSynergy.innerHTML = `<strong>Merchant Architecture Audit:</strong> Review active payment gateways. Migrating from aggregators to primary interchange networks could recoup $12,000 annually per $1M in revenue volume.`;
    }

    // Overhead recommendation segment
    if (data.revenue === "under_500k") {
      recUtility.textContent = "Begin monitoring commercial phone leases and recurring SaaS licenses. Consolidating legacy software platforms represents a quick 12% overhead reduction.";
    } else {
      recUtility.innerHTML = `<strong>CostUtilityHub Audit Audit:</strong> At your scale, vendor errors on electricity, telecom, and waste taxes accumulate. Submitting your past 24 months of bills to CostUtilityHub is completely contingency-based, requiring no upfront fees.`;
    }

    // Advisory recommendation segment
    if (data.revenue === "over_5m") {
      recConsulting.innerHTML = `<strong>Pelham Insights Systems Audit:</strong> Enterprise scaling requires ERP restructures and financial flow scaling. Set up an advisory audit session to map capital alignment.`;
    } else {
      recConsulting.textContent = "Connect with Pelham Insights operations advisors to establish growth KPIs, model capital constraints, and outline administrative overhead goals.";
    }

    verdictDesc.textContent = `Hello ${data.name.split(" ")[0]}. Your score of ${score}% indicates key operational inefficiencies. Review the tailored action plan below to mitigate leakage.`;

    // Advisory schedule actions
    const advisoryBtn = document.getElementById("wizard-advisory-btn");
    advisoryBtn.addEventListener("click", () => {
      advisoryBtn.disabled = true;
      advisoryBtn.textContent = "Routing to Advisor Calendar...";
      setTimeout(() => {
        alert("Redirecting to Pelham Insights advisory session booking page (Calendly simulation).");
        advisoryBtn.textContent = "Call Scheduled (Simulated)";
      }, 1000);
    });
  }

  // Simple number counter loop
  const animateCounter = (element, start, end, duration) => {
    let startTime = null;
    
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const val = Math.floor(progress * (end - start) + start);
      element.textContent = `${val}%`;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  };
}

/**
 * 5. Gated Playbook Opt-in and PDF Viewer Simulator
 */
function initPlaybook() {
  const form = document.getElementById("playbook-form");
  const optinLayout = document.getElementById("playbook-optin");
  const viewer = document.getElementById("playbook-viewer");
  const emailInput = document.getElementById("playbook-email");
  const errEmail = document.getElementById("err-playbook-email");

  const pdfPages = document.querySelectorAll(".pdf-page");
  const pageText = document.getElementById("pdf-current-page");
  const prevBtn = document.getElementById("pdf-prev-btn");
  const nextBtn = document.getElementById("pdf-next-btn");
  
  let currentPage = 1;
  const totalPages = 4;

  if (!form || !viewer) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errEmail.textContent = "";

    // Validation using ValidityState API
    if (!emailInput.checkValidity()) {
      if (emailInput.validity.valueMissing) {
        errEmail.textContent = "Please enter your business email.";
      } else if (emailInput.validity.typeMismatch) {
        errEmail.textContent = "Please enter a valid email address (e.g. name@company.com).";
      }
      return;
    }

    // Honeypot check
    const honeypotVal = document.getElementById("playbook_verify").value;
    if (honeypotVal !== "") {
      console.warn("Playbook download spam filtered.");
      optinLayout.classList.add("hidden");
      viewer.classList.remove("hidden");
      return;
    }

    const data = {
      email: emailInput.value,
      timestamp: new Date().toISOString()
    };

    // Save lead to local db logs
    saveLeadLocal("playbook", data);

    // Switch views to PDF reader
    optinLayout.classList.add("hidden");
    viewer.classList.remove("hidden");
    currentPage = 1;
    showPage(currentPage);
  });

  // PDF Page navigation triggers
  const showPage = (pageNumber) => {
    pdfPages.forEach(page => {
      const pageId = parseInt(page.getAttribute("data-page"), 10);
      page.classList.toggle("hidden", pageId !== pageNumber);
    });

    pageText.textContent = pageNumber;
    prevBtn.disabled = pageNumber === 1;
    nextBtn.disabled = pageNumber === totalPages;
  };

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      showPage(currentPage);
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      showPage(currentPage);
    }
  });

  // PDF viewer final advisory button actions
  const playbookCtaBtn = document.getElementById("playbook-advisory-btn");
  if (playbookCtaBtn) {
    playbookCtaBtn.addEventListener("click", () => {
      playbookCtaBtn.disabled = true;
      playbookCtaBtn.textContent = "Routing to Advisor Calendar...";
      setTimeout(() => {
        alert("Redirecting to Pelham Insights advisory session booking page (Calendly simulation).");
        playbookCtaBtn.textContent = "Call Scheduled (Simulated)";
      }, 1000);
    });
  }
}

/**
 * 6. Newsletter Signup
 */
function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("newsletter-email");
  const errEmail = document.getElementById("err-newsletter-email");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errEmail.textContent = "";

    // Validation using ValidityState API
    if (!emailInput.checkValidity()) {
      if (emailInput.validity.valueMissing) {
        errEmail.textContent = "Please enter your email address.";
      } else if (emailInput.validity.typeMismatch) {
        errEmail.textContent = "Please enter a valid email address.";
      }
      return;
    }

    // Honeypot check
    const honeypotVal = document.getElementById("newsletter_verify").value;
    if (honeypotVal !== "") {
      form.innerHTML = '<div class="success-message">Successfully subscribed to newsletter insights.</div>';
      return;
    }

    const data = {
      email: emailInput.value,
      timestamp: new Date().toISOString()
    };

    // Save lead to local db logs
    saveLeadLocal("newsletter", data);

    form.innerHTML = '<div class="success-message" style="color: var(--accent-teal); font-weight: 500; padding: 0.5rem 0;">Successfully subscribed to operator insights.</div>';
  });
}



/**
 * 8. Utility function: Smooth Scrolling
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      if (href === "#") return;
      
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
}

/**
 * Helper function: Log leads locally to localStorage for proof of database logging
 */
function saveLeadLocal(type, data) {
  try {
    const key = "pelham_leads";
    const existingLeads = JSON.parse(localStorage.getItem(key)) || [];
    existingLeads.push({ type, data });
    localStorage.setItem(key, JSON.stringify(existingLeads));
    console.log(`Lead Saved [${type}]:`, data);
    
    // Asynchronously forward to Web3Forms for email delivery to info@pelhaminsights.com
    sendToWeb3Forms(type, data);
  } catch (err) {
    console.error("Failed to save lead data to local storage", err);
  }
}

/**
 * Send lead details to Web3Forms target endpoint
 */
function sendToWeb3Forms(type, data) {
  const payload = {
    access_key: "bee7ba79-ba2f-4c91-bae9-5f5c33ff63f9",
    subject: `[Pelham Insights] New Submission: ${type.toUpperCase()}`,
    from_name: "Pelham Insights Website",
    submission_type: type,
    ...data
  };

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(res => {
    if (res.success) {
      console.log("Web3Forms submission successful:", res);
    } else {
      console.error("Web3Forms submission failed:", res);
    }
  })
  .catch(err => {
    console.error("Web3Forms network delivery error:", err);
  });
}




/**
 * 9. Standalone Pelham Advisory Subpage Estimator & Intake Form
 * Calculations, Validation and Storage.
 */
function initSubpageAdvisory() {
  const ebitdaSlider = document.getElementById("ebitda-range");
  const ebitdaDisplay = document.getElementById("ebitda-display");
  const checkboxes = document.querySelectorAll(".boost-cb");
  
  const boostDisplay = document.getElementById("subpage-boost-val");
  const gainDisplay = document.getElementById("subpage-gain-val");
  const totalDisplay = document.getElementById("subpage-total-val");

  const form = document.getElementById("subpage-advisory-form");

  // Conditional routing - exit if elements are missing
  if (!ebitdaSlider || !ebitdaDisplay || checkboxes.length === 0 || !boostDisplay || !gainDisplay || !totalDisplay) {
    return;
  }

  const updateCalculations = () => {
    const ebitda = parseFloat(ebitdaSlider.value);
    ebitdaDisplay.textContent = `$${ebitda.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

    let totalBoost = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) {
        totalBoost += parseFloat(cb.getAttribute("data-boost"));
      }
    });

    const baselineMultiple = 5.0;
    const valuationGain = ebitda * totalBoost;
    const targetValuation = ebitda * (baselineMultiple + totalBoost);

    boostDisplay.textContent = `+${totalBoost.toFixed(1)}x`;
    gainDisplay.textContent = `$${valuationGain.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    totalDisplay.textContent = `$${targetValuation.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  };

  ebitdaSlider.addEventListener("input", updateCalculations);
  checkboxes.forEach(cb => {
    cb.addEventListener("change", updateCalculations);
  });

  // Run initial calculation
  updateCalculations();

  if (form) {
    const companyInput = document.getElementById("subpage-company");
    const ownerInput = document.getElementById("subpage-owner");
    const ebitdaSelect = document.getElementById("subpage-ebitda");
    const timelineSelect = document.getElementById("subpage-timeline");
    const emailInput = document.getElementById("subpage-email");
    const phoneInput = document.getElementById("subpage-phone");

    const errCompany = document.getElementById("err-subpage-company");
    const errOwner = document.getElementById("err-subpage-owner");
    const errEbitda = document.getElementById("err-subpage-ebitda");
    const errTimeline = document.getElementById("err-subpage-timeline");
    const errEmail = document.getElementById("err-subpage-email");
    const errPhone = document.getElementById("err-subpage-phone");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Clear previous errors
      errCompany.textContent = "";
      errOwner.textContent = "";
      errEbitda.textContent = "";
      errTimeline.textContent = "";
      errEmail.textContent = "";
      errPhone.textContent = "";

      let isValid = true;

      // Company validation
      if (!companyInput.checkValidity()) {
        if (companyInput.validity.valueMissing) {
          errCompany.textContent = "Please enter your company name.";
        } else if (companyInput.validity.tooShort) {
          errCompany.textContent = "Company name must be at least 2 characters.";
        }
        isValid = false;
      }

      // Owner validation
      if (!ownerInput.checkValidity()) {
        if (ownerInput.validity.valueMissing) {
          errOwner.textContent = "Please enter the owner's name.";
        } else if (ownerInput.validity.tooShort) {
          errOwner.textContent = "Owner name must be at least 2 characters.";
        }
        isValid = false;
      }

      // EBITDA select validation
      if (!ebitdaSelect.checkValidity()) {
        errEbitda.textContent = "Please select your estimated EBITDA range.";
        isValid = false;
      }

      // Timeline select validation
      if (!timelineSelect.checkValidity()) {
        errTimeline.textContent = "Please select your target exit timeline.";
        isValid = false;
      }

      // Email validation
      if (!emailInput.checkValidity()) {
        if (emailInput.validity.valueMissing) {
          errEmail.textContent = "Please enter your business email.";
        } else if (emailInput.validity.typeMismatch) {
          errEmail.textContent = "Please enter a valid email address (e.g. name@company.com).";
        }
        isValid = false;
      }

      // Phone validation
      if (!phoneInput.checkValidity()) {
        if (phoneInput.validity.valueMissing) {
          errPhone.textContent = "Please enter your phone number.";
        } else if (phoneInput.validity.patternMismatch) {
          errPhone.textContent = "Please enter a valid phone number (e.g. (555) 123-4567).";
        }
        isValid = false;
      }

      if (!isValid) return;

      // Honeypot check
      const honeypotVal = document.getElementById("subpage_verify").value;
      if (honeypotVal !== "") {
        console.warn("Subpage advisory request spam filtered.");
        form.innerHTML = `
          <div class="success-message" style="color: var(--accent-teal); padding: 1.5rem; text-align: center; border: 1px solid rgba(20, 184, 166, 0.2); background: rgba(20, 184, 166, 0.05); border-radius: 8px;">
            <h5 style="margin-bottom: 0.5rem; color: #fff;">Audit Request Submitted!</h5>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Thank you. Our partners will reach out shortly.</p>
          </div>
        `;
        return;
      }

      const data = {
        company: companyInput.value,
        owner: ownerInput.value,
        ebitda: ebitdaSelect.value,
        timeline: timelineSelect.value,
        email: emailInput.value,
        phone: phoneInput.value,
        timestamp: new Date().toISOString()
      };

      // Save lead locally
      saveLeadLocal("advisory_exit_intake", data);

      form.innerHTML = `
        <div class="success-message" style="color: var(--accent-teal); padding: 1.5rem; text-align: center; border: 1px solid rgba(20, 184, 166, 0.2); background: rgba(20, 184, 166, 0.05); border-radius: 8px;">
          <h5 style="margin-bottom: 0.5rem; color: #fff;">Audit Request Submitted!</h5>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Thank you. Our operational partners will review your profile and reach out within 24 hours to schedule a confidential valuation review.</p>
        </div>
      `;
    });
  }
}
