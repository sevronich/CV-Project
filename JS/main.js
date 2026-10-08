function previewImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profileImg").src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function addItem(sectionId, className) {
  const container = document.querySelector(`#${sectionId} .items-container`);
  const firstItem = container.querySelector(`.${className}`);
  if (firstItem) {
    const newItem = firstItem.cloneNode(true);
    // Clear text in new item
    newItem.querySelectorAll("[contenteditable='true']").forEach((el) => (el.textContent = "[New Item]"));
    if (newItem.tagName === "LI" && newItem.querySelector("span")) {
      newItem.querySelector("span").textContent = "[New Skill]";
    }
    container.appendChild(newItem);
  }
}

// Smart Skill Bars: Update width based on text
const levelMap = {
  native: 100,
  expert: 95,
  proficient: 90,
  advanced: 85,
  good: 70,
  intermediate: 55,
  elementary: 40,
  basic: 30,
  beginner: 20,
  little: 15,
  limited: 25,
};

function updateSkillBars(e) {
  if (e.target.classList.contains("lang-level")) {
    const text = e.target.textContent.toLowerCase().trim();
    const bar = e.target.closest(".lang-item").querySelector(".bar-fill");
    if (bar) {
      // Check keywords
      for (let key in levelMap) {
        if (text.includes(key)) {
          bar.style.width = levelMap[key] + "%";
          return;
        }
      }
      // Check if user typed a percentage
      const match = text.match(/(\d+)%/);
      if (match) bar.style.width = match[1] + "%";
    }
  }
}

const cvContainer = document.querySelector(".cv");
function checkOverflow() {
  const isOverflowing = cvContainer.scrollHeight > cvContainer.clientHeight;
  if (isOverflowing) {
    cvContainer.classList.add("overflow-alert");
  } else {
    cvContainer.classList.remove("overflow-alert");
  }
}

// Automatically clear placeholder text wrapped in brackets [ ] on focus (even if icons are present)
document.body.addEventListener("focusin", (e) => {
  if (e.target.hasAttribute("contenteditable")) {
    const text = e.target.textContent.trim();
    // Match any text containing a bracketed placeholder like [Placeholder]
    if (/\[.*?\]/.test(text)) {
      e.target.dataset.placeholderHtml = e.target.innerHTML;
      e.target.dataset.placeholderText = text;
      // Replace only the [placeholder] part in the HTML to preserve icons/structures
      e.target.innerHTML = e.target.innerHTML.replace(/\[.*?\]/g, "");
    }
  }
});

// Restore placeholder if left empty on blur (except for title-bar)
document.body.addEventListener("focusout", (e) => {
  if (e.target.hasAttribute("contenteditable")) {
    if (e.target.dataset.placeholderHtml) {
      const currentTrimmedText = e.target.textContent.trim();
      const cleanedPlaceholderText = e.target.dataset.placeholderText.replace(/\[.*?\]/g, "").trim();
      
      // If the text is empty or matches the state without the bracketed text (meaning they didn't type anything new)
      if (currentTrimmedText === cleanedPlaceholderText || currentTrimmedText === "") {
        if (!e.target.classList.contains("title-bar")) {
          e.target.innerHTML = e.target.dataset.placeholderHtml;
        }
      }
    }
  }
});

// Clean pasted text to plain text (prevents dark background styling issues)
document.body.addEventListener("paste", (e) => {
  if (e.target.hasAttribute("contenteditable") || e.target.closest('[contenteditable="true"]')) {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }
});

document.body.addEventListener("input", (e) => {
  updateSkillBars(e);
  checkOverflow();
});

window.addEventListener("load", checkOverflow);

// ============================================================
// Dynamic Action Bar & Styles Injection
// ============================================================
function injectActionBar() {
    // 1. Inject Styles
    const style = document.createElement("style");
    style.innerHTML = `
        .cv-action-bar {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 12px;
            padding: 8px 16px;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 30px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            z-index: 999999;
            animation: slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideDown {
            from { transform: translate(-50%, -30px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
        .cv-action-bar button {
            padding: 8px 16px;
            border: none;
            border-radius: 20px;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .btn-action-download {
            background: #0f766e;
            color: white;
        }
        .btn-action-download:hover {
            background: #0d9488;
            transform: translateY(-1px);
        }
        .btn-action-clear {
            background: #be123c;
            color: white;
        }
        .btn-action-clear:hover {
            background: #e11d48;
            transform: translateY(-1px);
        }
        .btn-action-edit {
            background: #f1f5f9;
            color: #0f172a;
        }
        .btn-action-edit:hover {
            background: #cbd5e1;
            transform: translateY(-1px);
        }
        @media print {
            .cv-action-bar {
                display: none !important;
            }
        }
        .universal-additional-sections { margin-top: 18px; }
        .universal-additional-sections .imported-dynamic-section { margin: 0 0 18px; }
        .universal-additional-sections .imported-dynamic-section h2 {
            margin: 0 0 8px; padding: 7px 10px; background: #243b55; color: #fff;
            font-size: 11pt; line-height: 1; text-align: center; text-transform: uppercase;
        }
        .universal-additional-sections .imported-dynamic-section p {
            margin: 0; white-space: pre-line; font-size: 9pt; line-height: 1.45;
        }
    `;
    document.head.appendChild(style);

    // 2. Inject Button Bar
    const bar = document.createElement("div");
    bar.className = "cv-action-bar";
    bar.innerHTML = `
        <button class="btn-action-download" onclick="window.print()">⬇ PDF / ទាញយក</button>
        <button class="btn-action-clear">🗑 Clear / លុបទិន្នន័យ</button>
        <button class="btn-action-edit" onclick="location.href='editor.html'">✏️ Edit / កែសម្រួល</button>
    `;
    document.body.appendChild(bar);

    // Bind clear action
    bar.querySelector(".btn-action-clear").addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all CV data and start over? / តើអ្នកពិតជាចង់លុបទិន្នន័យ CV ទាំងអស់ ហើយចាប់ផ្ដើមឡើងវិញមែនទេ?")) {
            localStorage.removeItem("cv_builder_data");
            localStorage.removeItem("cv_profile_img");
            location.reload();
        }
    });

    // 3. Hide original template print/download buttons
    const oldBtns = document.querySelectorAll(".btn-pdf, button");
    oldBtns.forEach(b => {
        if (b.closest(".cv-action-bar")) return;
        const txt = (b.textContent || b.textContent || '').toLowerCase();
        if (txt.includes("pdf") || txt.includes("print") || txt.includes("export") || txt.includes("download")) {
            b.style.display = "none";
        }
    });
}

// ============================================================
// Universal Auto-fill Template from Editor Data
// ============================================================
function findSection(keywords) {
    const allElements = document.querySelectorAll("*");
    for (let kw of keywords) {
        for (let el of allElements) {
            if (el.id && el.id.toLowerCase().includes(kw)) {
                return el;
            }
        }
    }
    return null;
}

function fillListSection(sectionEl, itemsData, fillItemFn) {
    if (!sectionEl || !itemsData || itemsData.length === 0) return;
    const container = sectionEl.querySelector(".items-container");
    if (!container) return;
    
    const protoItem = container.querySelector(".item-container, .entry, .lang-item, .tech-item, li, div");
    if (!protoItem) return;
    
    const templateNode = protoItem.cloneNode(true);
    container.innerHTML = "";
    
    itemsData.forEach(itemData => {
        const newItem = templateNode.cloneNode(true);
        fillItemFn(newItem, itemData);
        container.appendChild(newItem);
    });
}

function fillExperienceItem(newItem, exp) {
    const titleEl = newItem.querySelector(".entry-title, .role, .p-entry-role, [class*='title'], [class*='role']") || 
                    Array.from(newItem.querySelectorAll("[contenteditable]")).find(el => el.textContent.includes("Title") || el.textContent.includes("Role") || el.textContent.includes("Position"));
    if (titleEl && exp.position) titleEl.textContent = exp.position;

    const orgEl = newItem.querySelector(".entry-org, .company, .p-entry-org, .entry-sub, [class*='org'], [class*='company'], [class*='sub']") ||
                  Array.from(newItem.querySelectorAll("[contenteditable]")).find(el => el.textContent.includes("Company") || el.textContent.includes("Organization"));
    if (orgEl && exp.company) orgEl.textContent = exp.company;

    const dateEl = newItem.querySelector(".entry-date, .duration, .p-entry-date, [class*='date'], [class*='duration'], [class*='year']") ||
                   Array.from(newItem.querySelectorAll("[contenteditable]")).find(el => el.textContent.includes("Year") || el.textContent.includes("Present") || el.textContent.includes("Date"));
    if (dateEl && exp.duration) dateEl.textContent = exp.duration;

    const listEl = newItem.querySelector("ul, ol");
    const descEl = newItem.querySelector(".entry-desc, .work-desc, .p-entry-bullets, [class*='desc'], [class*='bullet']");
    const bulletLines = (exp.details || "").split("\n").map(l => l.trim()).filter(l => l);
    
    if (listEl) {
        listEl.innerHTML = "";
        if (bulletLines.length > 0) {
            bulletLines.forEach(line => {
                const clean = line.replace(/^[•\-\*]\s*/, "").trim();
                const li = document.createElement("li");
                li.setAttribute("contenteditable", "true");
                li.textContent = clean;
                listEl.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.setAttribute("contenteditable", "true");
            li.textContent = "[Describe your achievement]";
            listEl.appendChild(li);
        }
    } else if (descEl) {
        if (bulletLines.length > 0) {
            descEl.innerHTML = bulletLines.map(line => {
                const clean = line.replace(/^[•\-\*]\s*/, "").trim();
                return `• ${clean}`;
            }).join("<br>");
        } else {
            descEl.textContent = "[Describe your achievement]";
        }
    } else {
        const fallback = Array.from(newItem.querySelectorAll("[contenteditable]")).find(el => el !== titleEl && el !== orgEl && el !== dateEl);
        if (fallback) {
            if (bulletLines.length > 0) {
                fallback.innerHTML = bulletLines.map(line => {
                    const clean = line.replace(/^[•\-\*]\s*/, "").trim();
                    return `• ${clean}`;
                }).join("<br>");
            } else {
                fallback.textContent = "[Describe your achievement]";
            }
        }
    }
}

function fillEducationItem(newItem, edu) {
    const degreeEl = newItem.querySelector(".entry-title, .role, [class*='title'], [class*='degree'], [class*='major']") || 
                     Array.from(newItem.querySelectorAll("[contenteditable]")).find(el => el.textContent.includes("Degree") || el.textContent.includes("Major"));
    if (degreeEl && edu.degree) degreeEl.textContent = edu.degree;

    const schoolEl = newItem.querySelector(".entry-org, .company, .p-entry-role, .entry-sub, [class*='org'], [class*='school'], [class*='university']") ||
                     Array.from(newItem.querySelectorAll("[contenteditable]")).find(el => el.textContent.includes("University") || el.textContent.includes("School"));
    if (schoolEl && edu.school) schoolEl.textContent = edu.school;

    const dateEl = newItem.querySelector(".entry-date, .duration, [class*='date'], [class*='duration'], [class*='year']") ||
                   Array.from(newItem.querySelectorAll("[contenteditable]")).find(el => el.textContent.includes("Year") || el.textContent.includes("Date"));
    if (dateEl && edu.year) dateEl.textContent = edu.year;
}

function fillLanguageItem(newItem, lang) {
    const editables = newItem.querySelectorAll("[contenteditable='true']");
    if (editables.length >= 2) {
        const first = editables[0];
        const second = editables[1];
        if (first.textContent.includes(":")) {
            first.textContent = lang.name + ":";
        } else {
            first.textContent = lang.name;
        }
        second.textContent = lang.level || "Native";
    } else if (editables.length === 1) {
        const el = editables[0];
        const templateText = el.textContent;
        if (templateText.includes(":")) {
            el.textContent = `${lang.name}: ${lang.level || 'Native'}`;
        } else if (templateText.includes("(") || templateText.includes(")")) {
            el.textContent = `${lang.name} (${lang.level || 'Native'})`;
        } else {
            el.textContent = `${lang.name} - ${lang.level || 'Native'}`;
        }
    } else {
        const nameEl = newItem.querySelector(".lang-name, [class*='name']");
        const lvlEl = newItem.querySelector(".lang-level, [class*='level']");
        if (nameEl) nameEl.textContent = lang.name;
        if (lvlEl) lvlEl.textContent = lang.level || "Native";
    }

    const bar = newItem.querySelector(".bar-fill, .p-bar-fill, [class*='bar-fill']");
    if (bar) {
        const lvlMap = { native: 100, professional: 80, advanced: 85, intermediate: 55, basic: 30, beginner: 20, fluent: 95, proficient: 90 };
        const lvl = lang.level ? lang.level.toLowerCase().trim() : "professional";
        const width = lvlMap[lvl] || 75;
        bar.style.width = width + "%";
    }
}

function fillSkillItem(newItem, skillName) {
    const parts = String(skillName).split(/\s*[|]\s*/);
    const displayName = parts[0] || skillName;
    const displayLevel = parts[1] || 'Advanced';
    const editables = newItem.querySelectorAll("[contenteditable='true']");
    if (editables.length >= 2) {
        editables[0].textContent = displayName;
        editables[1].textContent = displayLevel;
    } else if (editables.length === 1) {
        editables[0].textContent = displayName;
    } else {
        const nameEl = newItem.querySelector(".lang-name, [class*='name']");
        if (nameEl) nameEl.textContent = displayName;
    }
    const bar = newItem.querySelector(".bar-fill, .p-bar-fill, [class*='bar-fill']");
    if (bar) {
        bar.style.width = "85%";
    }
}

function fillTextItem(newItem, text) {
    const editable = newItem.querySelector("[contenteditable='true']") || newItem;
    if (editable) {
        const originalHtml = editable.innerHTML;
        if (originalHtml.startsWith("•") || originalHtml.startsWith("-") || originalHtml.trim().startsWith("&bull;")) {
            editable.textContent = `• ${text}`;
        } else {
            editable.textContent = text;
        }
    }
}

window.addEventListener("load", () => {
    const isInIframe = window.self !== window.top;

    if (!isInIframe) {
        // 1. Inject Action Bar
        injectActionBar();

        // 2. Setup Persistent Image Uploader
        const imgEl = document.querySelector("#profileImg, #profile-img, #exec-img, #p-img, .photo-wrap img, .photo-container img, .profile-photo img, .p-photo-wrap img");
        if (imgEl) {
            const container = imgEl.parentElement;
            if (container) {
                let fileInput = container.querySelector("input[type='file']");
                if (!fileInput) {
                    fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "image/*";
                    fileInput.style.display = "none";
                    container.appendChild(fileInput);
                }
                container.style.cursor = "pointer";
                container.onclick = (e) => {
                    if (e.target !== fileInput) {
                        fileInput.click();
                    }
                };
            }
        }

        document.addEventListener("change", (e) => {
            if (e.target.type === "file" && e.target.accept && e.target.accept.includes("image")) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        const img = document.querySelector("#profileImg, #profile-img, #exec-img, #p-img, .photo-wrap img, .photo-container img, .profile-photo img, .p-photo-wrap img");
                        if (img) img.src = evt.target.result;
                        localStorage.setItem("cv_profile_img", evt.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    }

    // Template cards are examples only. Never leak a user's saved CV/photo into
    // the same-origin preview iframes on the template selection page.
    if (isInIframe) return;

    const savedImg = localStorage.getItem("cv_profile_img");
    if (savedImg) {
        const img = document.querySelector("#profileImg, #profile-img, #exec-img, #p-img, .photo-wrap img, .photo-container img, .profile-photo img, .p-photo-wrap img");
        if (img) img.src = savedImg;
    }

    // 3. Auto-fill Data
    const saved = localStorage.getItem("cv_builder_data");
    if (!saved) return;

    let data;
    try { data = JSON.parse(saved); } catch(e) { return; }

    document.querySelectorAll('[data-cv-field]').forEach(el => {
        const key = el.dataset.cvField;
        if (key && data[key]) el.textContent = data[key];
    });

    // Compatibility layer for older templates that used sample names/titles
    // instead of the standard bracket placeholders.
    if (data.name) {
        const nameEl = document.querySelector('.cv header h1, .cv .header h1') ||
            document.querySelector('.cv h1') || document.querySelector('.cv .name, .cv .cv-name');
        if (nameEl && !nameEl.closest('.contact-list, .personal-list')) nameEl.textContent = data.name;
    }
    if (data.title) {
        const titleEl = document.querySelector('.cv header h2, .cv .header h2, .cv .job-title, .cv .professional-title, .cv [class*="role"]');
        if (titleEl) titleEl.textContent = data.title;
    }

    document.querySelectorAll('.cv [contenteditable="true"]').forEach(el => {
        const text = el.textContent.trim();
        if (data.email && /[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(text)) el.textContent = data.email;
        if (data.phone && /(?:\+?855|0)\s*\d[\d\s()-]{6,}/.test(text)) el.textContent = data.phone;
    });

    if (data.summary && !document.querySelector('[data-cv-field="summary"]')) {
        const summaryHeadings = Array.from(document.querySelectorAll('.cv h2, .cv h3, .cv .label, .cv .sec-title'));
        const heading = summaryHeadings.find(el => /about|summary|profile|objective/i.test(el.textContent));
        const section = heading?.closest('section, .section, .sec, .right-sec, .left-sec');
        const target = section ? Array.from(section.querySelectorAll('[contenteditable="true"], p, .entry-text')).find(el => el !== heading) : null;
        if (target) {
            target.textContent = data.summary;
            section.querySelectorAll('.obj-body').forEach(el => { if (el !== target) el.remove(); });
        }
    }

    let additionalHost = document.querySelector('[data-additional-sections]');
    if (!additionalHost && Array.isArray(data.additionalSections) && data.additionalSections.length) {
        additionalHost = document.createElement('div');
        additionalHost.setAttribute('data-additional-sections', '');
        additionalHost.className = 'universal-additional-sections';
        const preferredParent = document.querySelector('.cv .content, .cv .main-content, .cv .main, .cv .col-left') || document.querySelector('.cv');
        preferredParent?.appendChild(additionalHost);
    }
    if (additionalHost && Array.isArray(data.additionalSections)) {
        additionalHost.innerHTML = '';
        data.additionalSections.forEach(section => {
            if (!section || (!section.title && !section.content)) return;
            const wrapper = document.createElement('section');
            wrapper.className = 'section imported-dynamic-section';
            const heading = document.createElement('h2');
            heading.contentEditable = 'true';
            heading.textContent = section.title || 'Additional Information';
            const content = document.createElement('p');
            content.className = 'body-copy';
            content.contentEditable = 'true';
            content.textContent = section.content || '';
            wrapper.append(heading, content);
            additionalHost.appendChild(wrapper);
        });
    }

    // First, scan and replace editable placeholders heuristically
    const editables = document.querySelectorAll("[contenteditable='true']");
    editables.forEach(el => {
        const html = el.innerHTML;
        const txt = el.textContent.trim();
        
        if (txt.includes("[YOUR FULL NAME]") && data.name) {
            el.innerHTML = html.replace(/\[YOUR FULL NAME\]/g, data.name);
        }
        if ((txt.includes("[YOUR PROFESSIONAL TITLE]") || txt.includes("[YOUR TITLE]") || txt.includes("[YOUR ROLE]") || txt.includes("[Executive Job Position]")) && data.title) {
            el.innerHTML = html.replace(/\[YOUR PROFESSIONAL TITLE\]|\[YOUR TITLE\]|\[YOUR ROLE\]|\[Executive Job Position\]/g, data.title);
        }
        if (txt.includes("[your.email@example.com]") && data.email) {
            el.innerHTML = html.replace(/\[your\.email@example\.com\]/g, data.email);
        }
        if ((txt.includes("[Phone Number]") || txt.includes("[+855 00 000 000]") || txt.includes("[Your Phone Number]")) && data.phone) {
            el.innerHTML = html.replace(/\[Phone Number\]|\[\+855 00 000 000\]|\[Your Phone Number\]/g, data.phone);
        }
        if ((txt.includes("[Your Current Address]") || txt.includes("[City, Province]") || txt.includes("[City / Province]") || txt.includes("[District, Phnom Penh]") || txt.includes("[Address]")) && data.address) {
            el.innerHTML = html.replace(/\[Your Current Address\]|\[City, Province\]|\[City \/ Province\]|\[District, Phnom Penh\]|\[Address\]/g, data.address);
        }
        if (txt.includes("[Male / Female]") && data.gender) {
            el.innerHTML = html.replace(/\[Male \/ Female\]/g, data.gender);
        }
        if (txt.includes("[Date Month Year]") && data.dob) {
            el.innerHTML = html.replace(/\[Date Month Year\]/g, data.dob);
        }
        if (txt.includes("[Single / Married]") && data.marital) {
            el.innerHTML = html.replace(/\[Single \/ Married\]/g, data.marital);
        }
        if (txt.includes("[Nationality]") && data.nationality) {
            el.innerHTML = html.replace(/\[Nationality\]/g, data.nationality);
        }
        if (txt.includes("[City, Province]") && data.hometown) {
            el.innerHTML = html.replace(/\[City, Province\]/g, data.hometown);
        }
    });

    // ✅ Fix #2: Don't clear the title placeholder — leave it if no title was found
    // Users can manually edit it in the template

    // 4. Populate dynamic sections
    const expSec = findSection(['experience', 'work', 'exp']);
    if (expSec && data.experience && data.experience.length > 0) {
        // ✅ Fix #1: Only fill if experience array has actual items
        fillListSection(expSec, data.experience, fillExperienceItem);
    }
    // ✅ Fix #1: Never clear the section — leave placeholders intact if no data

    const eduSec = findSection(['education', 'edu']);
    if (eduSec && data.education) {
        fillListSection(eduSec, data.education, fillEducationItem);
    }

    const langSec = findSection(['languages', 'lang']);
    if (langSec && data.languages) {
        fillListSection(langSec, data.languages, fillLanguageItem);
    }

    const softSec = findSection(['soft-skills', 'soft']);
    const techSec = findSection(['tech-skills', 'software', 'tech', 'skills', 'expertise']);

    if (softSec && techSec && softSec === techSec) {
        // Single skills section: merge tech and soft skills
        const allSkills = [];
        if (data.techSkills) allSkills.push(...data.techSkills.split(/[,\n]/).map(s => s.trim()).filter(s => s));
        if (data.softSkills) allSkills.push(...data.softSkills.split(/[,\n]/).map(s => s.trim()).filter(s => s));
        
        fillListSection(techSec, allSkills, (newItem, skill) => fillSkillItem(newItem, skill));
    } else {
        if (techSec && data.techSkills) {
            const skills = data.techSkills.split(/[,\n]/).map(s => s.trim()).filter(s => s);
            fillListSection(techSec, skills, (newItem, skill) => fillSkillItem(newItem, skill));
        }
        if (softSec && data.softSkills) {
            const skills = data.softSkills.split(/[,\n]/).map(s => s.trim()).filter(s => s);
            fillListSection(softSec, skills, (newItem, skill) => fillTextItem(newItem, skill));
        }
    }

    const certSec = findSection(['awards', 'cert', 'honor']);
    if (certSec && data.certifications) {
        fillListSection(certSec, data.certifications, (newItem, cert) => {
            const text = [cert.name, cert.org, cert.year].filter(x => x).join(" - ");
            fillTextItem(newItem, text || "[Certificate Name]");
        });
    }

    // Every template must preserve imported data even when its original design
    // has no dedicated field. Add one compact fallback section containing only
    // values that are still absent after normal template mapping.
    const currentCv = document.querySelector('.cv');
    const currentText = () => currentCv?.textContent.replace(/\s+/g, ' ') || '';
    const missingLines = [];
    const addMissing = (label, value, probe = value) => {
        if (value && probe && !currentText().includes(probe)) missingLines.push(`${label}: ${value}`);
    };
    addMissing('Email', data.email);
    addMissing('Phone', data.phone);
    addMissing('Address', data.address);
    addMissing('Gender', data.gender);
    addMissing('Date of Birth', data.dob);
    addMissing('Marital Status', data.marital);
    addMissing('Nationality', data.nationality);
    addMissing('Hometown', data.hometown);
    addMissing('Professional Profile', data.summary);
    addMissing('Technical Skills', data.techSkills, data.techSkills?.split(',')[0]?.trim());
    addMissing('Soft Skills', data.softSkills, data.softSkills?.split(',')[0]?.trim());
    (data.education || []).forEach((item, index) => addMissing(`Education ${index + 1}`, [item.degree, item.school, item.year].filter(Boolean).join(' | '), item.degree));
    (data.languages || []).forEach(item => addMissing('Language', `${item.name} - ${item.level}`, item.name));
    (data.certifications || []).forEach(item => addMissing('Certification', [item.name, item.org, item.year].filter(Boolean).join(' | '), item.name));

    if (missingLines.length) {
        let fallbackHost = document.querySelector('[data-additional-sections]');
        if (!fallbackHost) {
            fallbackHost = document.createElement('div');
            fallbackHost.setAttribute('data-additional-sections', '');
            fallbackHost.className = 'universal-additional-sections';
            const parent = document.querySelector('.cv .content, .cv .main-content, .cv .main, .cv .col-left') || currentCv;
            parent?.appendChild(fallbackHost);
        }
        const fallback = document.createElement('section');
        fallback.className = 'section imported-dynamic-section imported-coverage-section';
        const heading = document.createElement('h2');
        heading.textContent = 'Additional CV Details';
        const body = document.createElement('p');
        body.className = 'body-copy';
        body.contentEditable = 'true';
        body.textContent = missingLines.join('\n');
        fallback.append(heading, body);
        fallbackHost.appendChild(fallback);
    }

    checkOverflow();
});
