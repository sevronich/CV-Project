// ============================================================
// Step Navigation & Section Switching
// ============================================================
const stepsConfig = {
    personal:       { title: "Personal Info",          subtitle: "Basic details about you.",                         tip: "<strong>Pro Tip:</strong> ក្នុងផ្នែកព័ត៌មានទំនាក់ទំនង សូមប្រើអ៊ីមែលដែលមានលក្ខណៈអាជីព (ឧទាហរណ៍៖ name.last@email.com)។", strength: 15 },
    contact:        { title: "Contact Info",           subtitle: "How HR can reach you.",                            tip: "<strong>HR Insight:</strong> ប្រើលេខទូរស័ព្ទដែលអ្នកអាចទទួលបាន និងអ៊ីមែលអាជីព។",                                           strength: 30 },
    experience:     { title: "Work Experience",        subtitle: "Highlight your career achievements.",              tip: "<strong>Expert Tip:</strong> ផ្ដោតលើលទ្ធផល (ឧទាហរណ៍៖ បង្កើនការលក់បាន ២០%)។ លេខបញ្ជាក់ពីសមត្ថភាពបានច្បាស់ជាងអក្សរ។",    strength: 55 },
    education:      { title: "Education",              subtitle: "Your academic background.",                        tip: "<strong>Tip:</strong> ដាក់សញ្ញាប័ត្រចុងក្រោយបង្អស់មុនគេ។ GPA គួរដាក់បើវាខ្ពស់ (≥3.0)។",                                    strength: 70 },
    skills:         { title: "Skills & Languages",     subtitle: "Technical and soft skills.",                       tip: "<strong>HR Insight:</strong> ជំនាញបច្ចេកទេសគួរដាក់អ្វីដែលពាក់ព័ន្ធនឹងការងារដែលអ្នកស្វែងរក។",                            strength: 80 },
    certifications: { title: "Certifications",         subtitle: "Professional certifications and training.",        tip: "<strong>Tip:</strong> វិញ្ញាបនប័ត្រជួយបង្ហាញថាអ្នកមានការប្តេជ្ញាចិត្តក្នុងការរៀនសូត្រជាបន្ត។",                            strength: 90 },
    projects:       { title: "Projects & Interests",   subtitle: "Personal projects, volunteering, and hobbies.",   tip: "<strong>Tip:</strong> គម្រោងផ្ទាល់ខ្លួន និងការស្ម័គ្រចិត្តបង្ហាញពីចំណង់ចំណូលចិត្ត និងភាពសកម្មរបស់អ្នក។",                    strength: 100 }
};

const stepOrder = ['personal', 'contact', 'experience', 'education', 'skills', 'certifications', 'projects'];
let currentStepIndex = 0;

function switchToStep(stepId) {
    const idx = stepOrder.indexOf(stepId);
    if (idx === -1) return;
    currentStepIndex = idx;

    // Update nav
    document.querySelectorAll('.nav-step').forEach(s => s.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-step[data-step="${stepId}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Update form
    document.querySelectorAll('.step-form').forEach(f => f.classList.remove('active'));
    const form = document.getElementById('form-' + stepId);
    if (form) form.classList.add('active');

    // Update header
    const cfg = stepsConfig[stepId];
    if (cfg) {
        document.getElementById('current-step-name').innerText = cfg.title;
        document.getElementById('current-step-subtitle').innerText = cfg.subtitle;
        document.getElementById('assistant-tip').innerHTML = cfg.tip;
        document.getElementById('strength-bar').style.width = cfg.strength + '%';
    }

    // Update prev/next buttons
    document.getElementById('btn-prev').style.display = currentStepIndex === 0 ? 'none' : 'inline-flex';
    const nextBtn = document.getElementById('btn-next');
    if (currentStepIndex === stepOrder.length - 1) {
        nextBtn.innerHTML = 'Finish & Preview <i class="fas fa-check-double"></i>';
    } else {
        nextBtn.innerHTML = 'Next Step <i class="fas fa-arrow-right"></i>';
    }
}

// Nav click
document.querySelectorAll('.nav-step').forEach(step => {
    step.addEventListener('click', () => {
        saveAllToLocal();
        switchToStep(step.getAttribute('data-step'));
    });
});

// Next / Prev buttons
document.getElementById('btn-next').addEventListener('click', () => {
    saveAllToLocal();
    if (currentStepIndex === stepOrder.length - 1) {
        location.href = 'template1.html';
    } else {
        switchToStep(stepOrder[currentStepIndex + 1]);
    }
});
document.getElementById('btn-prev').addEventListener('click', () => {
    saveAllToLocal();
    if (currentStepIndex > 0) {
        switchToStep(stepOrder[currentStepIndex - 1]);
    }
});

// ============================================================
// Dynamic Entry Add/Remove (Experience, Education, Cert, Language)
// ============================================================
function removeEntry(btn) {
    const block = btn.closest('.entry-block') || btn.closest('.input-row');
    if (block) block.remove();
}

function addExperienceEntry() {
    const container = document.getElementById('experience-entries');
    const count = container.querySelectorAll('.entry-block').length + 1;
    const html = `
    <div class="entry-block">
        <div class="entry-block-header">
            <span class="entry-number">Experience #${count}</span>
            <button class="btn-remove-entry" onclick="removeEntry(this)" title="Remove"><i class="fas fa-trash"></i></button>
        </div>
        <div class="input-row">
            <div class="field"><label>Company / Organization</label><input type="text" class="exp-company" placeholder="e.g. Smart Axiata"></div>
            <div class="field"><label>Position / Title</label><input type="text" class="exp-position" placeholder="e.g. Software Engineer"></div>
        </div>
        <div class="input-row">
            <div class="field"><label>Duration</label><input type="text" class="exp-duration" placeholder="e.g. Jan 2022 - Present"></div>
        </div>
        <div class="field" style="margin-top:10px;"><label>Responsibilities & Achievements</label><textarea class="exp-details" rows="4" placeholder="• Led a team of 5 developers..."></textarea></div>
    </div>`;
    container.insertAdjacentHTML('beforeend', html);
}

function addEducationEntry() {
    const container = document.getElementById('education-entries');
    const count = container.querySelectorAll('.entry-block').length + 1;
    const html = `
    <div class="entry-block">
        <div class="entry-block-header">
            <span class="entry-number">Education #${count}</span>
            <button class="btn-remove-entry" onclick="removeEntry(this)" title="Remove"><i class="fas fa-trash"></i></button>
        </div>
        <div class="input-row">
            <div class="field"><label>University / School</label><input type="text" class="edu-school" placeholder="e.g. Royal University of Phnom Penh"></div>
            <div class="field"><label>Degree / Major</label><input type="text" class="edu-degree" placeholder="e.g. Bachelor of CS"></div>
        </div>
        <div class="input-row">
            <div class="field"><label>Year</label><input type="text" class="edu-year" placeholder="e.g. 2018 - 2022"></div>
            <div class="field"><label>GPA (optional)</label><input type="text" class="edu-gpa" placeholder="e.g. 3.5 / 4.0"></div>
        </div>
    </div>`;
    container.insertAdjacentHTML('beforeend', html);
}

function addCertEntry() {
    const container = document.getElementById('cert-entries');
    const count = container.querySelectorAll('.entry-block').length + 1;
    const html = `
    <div class="entry-block">
        <div class="entry-block-header">
            <span class="entry-number">Certification #${count}</span>
            <button class="btn-remove-entry" onclick="removeEntry(this)" title="Remove"><i class="fas fa-trash"></i></button>
        </div>
        <div class="input-row">
            <div class="field"><label>Certificate / Course Name</label><input type="text" class="cert-name" placeholder="e.g. AWS Cloud Practitioner"></div>
            <div class="field"><label>Issuing Organization</label><input type="text" class="cert-org" placeholder="e.g. Amazon"></div>
        </div>
        <div class="input-row">
            <div class="field"><label>Year Obtained</label><input type="text" class="cert-year" placeholder="e.g. 2023"></div>
        </div>
    </div>`;
    container.insertAdjacentHTML('beforeend', html);
}

function addLanguageEntry() {
    const container = document.getElementById('language-entries');
    const html = `
    <div class="input-row">
        <div class="field"><label>Language</label><input type="text" class="lang-name-input" placeholder="e.g. Chinese"></div>
        <div class="field"><label>Level</label>
            <select class="lang-level-input">
                <option value="Native">Native</option>
                <option value="Professional">Professional</option>
                <option value="Advanced">Advanced</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Basic</option>
                <option value="Little">Little</option>
                <option value="Limited">Limited</option>
                <option value="Beginner">Beginner</option>
            </select>
        </div>
    </div>`;
    container.insertAdjacentHTML('beforeend', html);
}

function addAdditionalSection(title = '', content = '') {
    const container = document.getElementById('additional-sections');
    if (!container) return;
    const block = document.createElement('div');
    block.className = 'entry-block additional-section-block';
    block.innerHTML = `
        <div class="entry-block-header">
            <span class="entry-number">Custom / Imported Section</span>
            <button class="btn-remove-entry" type="button" onclick="removeEntry(this)" title="Remove">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="field">
            <label>Section Title</label>
            <input type="text" class="additional-title" placeholder="e.g. References, Volunteer Work, Awards">
        </div>
        <div class="field" style="margin-top:10px;">
            <label>Section Content</label>
            <textarea class="additional-content" rows="5" placeholder="Imported content"></textarea>
        </div>`;
    block.querySelector('.additional-title').value = title;
    block.querySelector('.additional-content').value = content;
    container.appendChild(block);
}

// ============================================================
// Save All Data to LocalStorage
// ============================================================
function collectAllData() {
    const data = {};

    // Personal
    data.name        = val('cv-name');
    data.title       = val('cv-title');
    data.gender      = val('cv-gender');
    data.dob         = val('cv-dob');
    data.nationality = val('cv-nationality');
    data.marital     = val('cv-marital');
    data.summary     = val('cv-summary');

    // Contact
    data.email    = val('cv-email');
    data.phone    = val('cv-phone');
    data.address  = val('cv-address');
    data.hometown = val('cv-hometown');
    data.linkedin = val('cv-linkedin');
    data.social   = val('cv-social');

    // Experience (array)
    data.experience = [];
    document.querySelectorAll('#experience-entries .entry-block').forEach(block => {
        const item = {
            company:  block.querySelector('.exp-company')?.value || '',
            position: block.querySelector('.exp-position')?.value || '',
            duration: block.querySelector('.exp-duration')?.value || '',
            details:  block.querySelector('.exp-details')?.value || ''
        };
        if (Object.values(item).some(value => value.trim())) data.experience.push(item);
    });

    // Education (array)
    data.education = [];
    document.querySelectorAll('#education-entries .entry-block').forEach(block => {
        const item = {
            school: block.querySelector('.edu-school')?.value || '',
            degree: block.querySelector('.edu-degree')?.value || '',
            year:   block.querySelector('.edu-year')?.value || '',
            gpa:    block.querySelector('.edu-gpa')?.value || ''
        };
        if (Object.values(item).some(value => value.trim())) data.education.push(item);
    });

    // Skills
    data.techSkills = val('cv-tech-skills');
    data.softSkills = val('cv-soft-skills');

    // Languages (array)
    data.languages = [];
    const langNames = document.querySelectorAll('.lang-name-input');
    const langLevels = document.querySelectorAll('.lang-level-input');
    for (let i = 0; i < langNames.length; i++) {
        const n = langNames[i].value.trim();
        const l = langLevels[i]?.value || '';
        if (n) data.languages.push({ name: n, level: l });
    }

    // Certifications (array)
    data.certifications = [];
    document.querySelectorAll('#cert-entries .entry-block').forEach(block => {
        const item = {
            name: block.querySelector('.cert-name')?.value || '',
            org:  block.querySelector('.cert-org')?.value || '',
            year: block.querySelector('.cert-year')?.value || ''
        };
        if (Object.values(item).some(value => value.trim())) data.certifications.push(item);
    });

    // Projects & Hobbies
    data.projects = val('cv-projects');
    data.hobbies  = val('cv-hobbies');
    data.importedText = val('cv-imported-text');
    data.additionalSections = [];
    document.querySelectorAll('#additional-sections .additional-section-block').forEach(block => {
        const title = block.querySelector('.additional-title')?.value.trim() || '';
        const content = block.querySelector('.additional-content')?.value.trim() || '';
        if (title || content) data.additionalSections.push({ title: title || 'Additional Information', content });
    });

    return data;
}

function val(id) {
    const el = document.getElementById(id);
    if (!el) return '';
    if (el.tagName === 'SELECT') return el.value;
    return el.value || '';
}

function setVal(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = value ?? '';
}

function resetEditorForImport() {
    document.querySelectorAll('.form-area input:not([type="file"]), .form-area textarea').forEach(el => {
        el.value = '';
    });
    document.querySelectorAll('.form-area select').forEach(el => {
        el.selectedIndex = 0;
    });

    document.getElementById('experience-entries').innerHTML = '';
    document.getElementById('education-entries').innerHTML = '';
    document.getElementById('language-entries').innerHTML = '';
    document.getElementById('cert-entries').innerHTML = '';
    document.getElementById('additional-sections').innerHTML = '';

    // A new imported CV must never inherit somebody else's photo or partial data.
    localStorage.removeItem('cv_builder_data');
    localStorage.removeItem('cv_profile_img');
}

function ensureEmptyDynamicRows() {
    if (!document.querySelector('#experience-entries .entry-block')) addExperienceEntry();
    if (!document.querySelector('#education-entries .entry-block')) addEducationEntry();
    if (!document.querySelector('#language-entries .input-row')) addLanguageEntry();
    if (!document.querySelector('#cert-entries .entry-block')) addCertEntry();
}

function importDataCleanly(data) {
    resetEditorForImport();
    populateAllFromData(data && typeof data === 'object' ? data : {});
    ensureEmptyDynamicRows();
    saveAllToLocal();
}

function saveAllToLocal() {
    localStorage.setItem('cv_builder_data', JSON.stringify(collectAllData()));
}

// ============================================================
// Populate Form from Data Object
// ============================================================
function populateAllFromData(data) {
    // Personal
    setVal('cv-name', data.name);
    setVal('cv-title', data.title);
    setVal('cv-gender', data.gender);
    setVal('cv-dob', data.dob);
    setVal('cv-nationality', data.nationality);
    setVal('cv-marital', data.marital);
    setVal('cv-summary', data.summary);

    // Contact
    setVal('cv-email', data.email);
    setVal('cv-phone', data.phone);
    setVal('cv-address', data.address);
    setVal('cv-hometown', data.hometown);
    setVal('cv-linkedin', data.linkedin);
    setVal('cv-social', data.social);

    // Experience
    if (data.experience && data.experience.length > 0) {
        const container = document.getElementById('experience-entries');
        container.innerHTML = '';
        data.experience.forEach((exp, i) => {
            addExperienceEntry();
            const blocks = container.querySelectorAll('.entry-block');
            const block = blocks[blocks.length - 1];
            block.querySelector('.exp-company').value = exp.company || '';
            block.querySelector('.exp-position').value = exp.position || '';
            block.querySelector('.exp-duration').value = exp.duration || '';
            block.querySelector('.exp-details').value = exp.details || '';
        });
    }

    // Education
    if (data.education && data.education.length > 0) {
        const container = document.getElementById('education-entries');
        container.innerHTML = '';
        data.education.forEach((edu, i) => {
            addEducationEntry();
            const blocks = container.querySelectorAll('.entry-block');
            const block = blocks[blocks.length - 1];
            block.querySelector('.edu-school').value = edu.school || '';
            block.querySelector('.edu-degree').value = edu.degree || '';
            block.querySelector('.edu-year').value = edu.year || '';
            block.querySelector('.edu-gpa').value = edu.gpa || '';
        });
    }

    // Skills
    setVal('cv-tech-skills', data.techSkills);
    setVal('cv-soft-skills', data.softSkills);

    // Languages
    if (data.languages && data.languages.length > 0) {
        const container = document.getElementById('language-entries');
        container.innerHTML = '';
        data.languages.forEach(lang => {
            addLanguageEntry();
            const rows = container.querySelectorAll('.input-row');
            const row = rows[rows.length - 1];
            row.querySelector('.lang-name-input').value = lang.name || '';
            row.querySelector('.lang-level-input').value = lang.level || 'Professional';
        });
    }

    // Certifications
    if (data.certifications && data.certifications.length > 0) {
        const container = document.getElementById('cert-entries');
        container.innerHTML = '';
        data.certifications.forEach(cert => {
            addCertEntry();
            const blocks = container.querySelectorAll('.entry-block');
            const block = blocks[blocks.length - 1];
            block.querySelector('.cert-name').value = cert.name || '';
            block.querySelector('.cert-org').value = cert.org || '';
            block.querySelector('.cert-year').value = cert.year || '';
        });
    }

    // Projects & Hobbies
    setVal('cv-projects', data.projects);
    setVal('cv-hobbies', data.hobbies);
    setVal('cv-imported-text', data.importedText);
    const additionalContainer = document.getElementById('additional-sections');
    additionalContainer.innerHTML = '';
    (data.additionalSections || []).forEach(section => addAdditionalSection(section.title, section.content));
}

// Load from LocalStorage on startup
function loadFromLocal() {
    const saved = localStorage.getItem('cv_builder_data');
    if (saved) {
        try { populateAllFromData(JSON.parse(saved)); } catch(e) { console.error(e); }
    }
}

// ============================================================
// Export CV Data as JSON
// ============================================================
document.getElementById('export-btn').addEventListener('click', () => {
    saveAllToLocal();
    const data = localStorage.getItem('cv_builder_data') || '{}';
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "My_CV_Data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// ============================================================
// Clear Data
// ============================================================
function clearCVData() {
    if (confirm("Are you sure you want to clear all your CV data? This cannot be undone.")) {
        localStorage.removeItem('cv_builder_data');
        location.reload();
    }
}

// ============================================================
// Initialize
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocal();
    switchToStep('personal');
    checkPendingImport();
});

// Check if dashboard sent a pending file to process
async function checkPendingImport() {
    const pendingRaw = localStorage.getItem('cv_pending_import');
    if (!pendingRaw) return;
    localStorage.removeItem('cv_pending_import');

    try {
        const pending = JSON.parse(pendingRaw);
        const fileName = pending.name.toLowerCase();
        const response = await fetch(pending.data);
        const blob = await response.blob();
        const file = new File([blob], pending.name, { type: pending.type });

        if (fileName.endsWith('.pdf')) {
            showImportModal('Reading PDF file...', 'Extracting text from your CV document.');
            const text = await extractTextFromPDF(file);
            updateImportModal('Analyzing CV content...', 'Identifying all sections...', 90);
            const data = parseCVText(text);
            importDataCleanly(data);
            showImportSuccess('✅ PDF Import Complete!');
        } else if (/\.(png|jpe?g)$/i.test(fileName)) {
            showImportModal('Scanning image...', 'Using OCR. This may take 10-30 seconds.');
            // ✅ Fix #3: Save the image itself as profile photo
            localStorage.setItem('cv_profile_img', pending.data);
            const text = await extractTextFromImage(file);
            updateImportModal('Analyzing CV content...', 'Identifying all sections...', 90);
            const data = parseCVText(text);
            importDataCleanly(data);
            showImportSuccess('✅ Image Import Complete!');
        }
    } catch (err) {
        console.error('Pending import error:', err);
        showImportError('❌ Failed to process the imported file.');
    }
}

// ============================================================
// Import Modal UI helpers
// ============================================================
function showImportModal(message, detail) {
    const modal = document.getElementById('import-modal');
    modal.style.display = 'flex';
    document.getElementById('import-status').textContent = message || 'Processing...';
    document.getElementById('import-detail').textContent = detail || '';
    document.getElementById('import-progress-fill').style.width = '0%';
    document.getElementById('import-spinner').innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size:48px; color:#0f3d3e;"></i>';
}
function updateImportModal(message, detail, progress) {
    document.getElementById('import-status').textContent = message || '';
    if (detail) document.getElementById('import-detail').textContent = detail;
    if (progress !== undefined) document.getElementById('import-progress-fill').style.width = progress + '%';
}
function hideImportModal() { document.getElementById('import-modal').style.display = 'none'; }
function showImportSuccess(message) {
    document.getElementById('import-spinner').innerHTML = '<i class="fas fa-check-circle" style="font-size:48px; color:#2a9d8f;"></i>';
    document.getElementById('import-status').textContent = message;
    document.getElementById('import-progress-fill').style.width = '100%';
    setTimeout(hideImportModal, 2000);
}
function showImportError(message) {
    document.getElementById('import-spinner').innerHTML = '<i class="fas fa-times-circle" style="font-size:48px; color:#e74c3c;"></i>';
    document.getElementById('import-status').textContent = message;
    document.getElementById('import-detail').textContent = 'Please try a different file.';
    setTimeout(hideImportModal, 3000);
}

// ============================================================
// Advanced CV Text Parser (All 7 Sections)
// ============================================================
function parseCVText(text) {
    const result = {};
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !/^Professional Curriculum Vitae\s*\|/i.test(l));
    const fullText = text;
    const labeledValue = (labels) => {
        const escaped = labels.map(label => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const match = fullText.match(new RegExp(`(?:^|\\n)\\s*(?:${escaped})(?:\\s*[:：-]\\s*|\\s+)([^\\n]+)`, 'i'));
        return match ? match[1].trim() : '';
    };

    // ---- 1. Email ----
    const emailMatch = fullText.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) result.email = emailMatch[0];

    // ---- 2. Phone ----
    const labeledPhone = labeledValue(['phone', 'telephone', 'tel', 'mobile', 'contact number', 'លេខទូរស័ព្ទ']);
    if (labeledPhone && /\d/.test(labeledPhone)) result.phone = labeledPhone;
    const iconPhone = fullText.match(/(?:📞|☎)\s*([+0-9][\d\s().-]{7,18})/u);
    if (!result.phone && iconPhone) result.phone = iconPhone[1].trim();
    const phonePatterns = [/\+\d[\d\s().\-]{7,18}/, /(?:^|\n)\s*(0\d[\d\s().\-]{7,14})/m];
    for (const p of phonePatterns) {
        if (result.phone) break;
        const m = fullText.match(p);
        if (m) {
            const candidate = (m[1] || m[0]).trim();
            const digits = candidate.replace(/\D/g, '').length;
            const looksLikeYearRange = /\b(?:19|20)\d{2}\s*[-–—]\s*(?:19|20)\d{2}\b/.test(candidate);
            if (!looksLikeYearRange && digits >= 8 && digits <= 15) { result.phone = candidate; break; }
        }
    }

    // ---- 3. Name (first prominent line) ----
    const skipWords = ['curriculum vitae', 'cv', 'resume', 'personal', 'profile', 'contact', 'about me'];
    const labeledName = labeledValue(['full name', 'name', 'ឈ្មោះ', 'គោត្តនាម និងនាម']);
    if (labeledName) result.name = labeledName;
    for (const line of lines.slice(0, 12)) {
        if (result.name) break;
        const lower = line.toLowerCase();
        if (line.length < 3) continue;
        if (skipWords.some(w => lower === w || lower.startsWith(w + ':'))) continue;
        if (line.includes('@') || /^\+?\d[\d\s\-()]{6,}$/.test(line)) continue;
        if (/^https?:\/\//.test(line) || line.includes('www.')) continue;
        const wordCount = line.split(/\s+/).length;
        if (wordCount >= 2 && wordCount <= 5 && /^[A-Za-z\u1780-\u17FF\s.\-']+$/.test(line)) { result.name = line; break; }
    }
    if (!result.name && lines.length > 0 && lines[0].length <= 50) result.name = lines[0];

    // ---- 4. Professional Title ----
    const titleKw = ['developer','engineer','designer','manager','analyst','consultant','teacher','educator','specialist',
        'coordinator','assistant','director','intern','administrator','accountant','officer','supervisor','lead','senior',
        'junior','programmer','architect','student','freelancer','graphic','marketing','sales','data','full stack',
        'front end','back end','web','software','IT','project','product','business','human resource','hr','finance','creative'];
    const nameIdx = result.name ? lines.indexOf(result.name) : -1;
    const labeledTitle = labeledValue(['position apply for', 'position applied for', 'professional title', 'job title', 'position']);
    if (labeledTitle) result.title = labeledTitle;
    for (let i = Math.max(0, nameIdx + 1); i < Math.min(nameIdx + 6, lines.length); i++) {
        if (result.title) break;
        const lower = lines[i].toLowerCase();
        if (lines[i].includes('@') || /^\+?\d[\d\s\-()]{6,}$/.test(lines[i])) continue;
        if (titleKw.some(kw => lower.includes(kw))) { result.title = lines[i]; break; }
    }

    // ---- Section-based extraction ----
    const sectionHeaders = {
        experience: /^(work\s*experience|experience|professional\s*experience|employment(?:\s*history)?|career\s*history|បទពិសោធន៍|ការងារ|បទពិសោធន៍ការងារ)$/i,
        education: /^(education(?:\s*background)?|academic(?:\s*background)?|qualifications?|study\s*background|ការសិក្សា|ការអប់រំ|ប្រវត្តិការសិក្សា|កម្រិតវប្បធម៌)$/i,
        skills: /^(skills?|technical\s*skills?|competencies|tools?(?:\s*&\s*software)?|programming\s*skills?|ជំនាញ|ចំណេះដឹង|ជំនាញបច្ចេកទេស)$/i,
        softSkills: /^(soft\s*skills?|interpersonal\s*skills?|personal\s*skills?|ជំនាញទន់)$/i,
        languages: /^(languages?|linguistic\s*skills?|ភាសា)$/i,
        certifications: /^(?:(?:(?:awards?|honors?)\s*(?:&|and)\s*)?certifications?|training|awards?|licenses?|courses?|workshops?|វិញ្ញាបនប័ត្រ|វគ្គបណ្តុះបណ្តាល|សិក្ខាសាលា)$/i,
        projects: /^(projects?|volunteer(?:\s*work)?|extracurricular\s*activities|activities|interests?|hobbies|សកម្មភាព|គម្រោង|ចំណាប់អារម្មណ៍)$/i,
        personal: /^(personal\s*(details?|info(?:rmation)?)|about\s*me|objective|summary|profile|professional\s*profile|ព័ត៌មានផ្ទាល់ខ្លួន|ប្រវត្តិរូបសង្ខេប)$/i,
        contact: /^(contact(?:\s*details?|\s*information)?|reach\s*me|ទំនាក់ទំនង|ព័ត៌មានទំនាក់ទំនង)$/i,
        references: /^(references?|អ្នកធានា|ឯកសារយោង)$/i
    };

    // Find section boundaries
    const sections = {};
    const orderedSections = [];
    for (let i = 0; i < lines.length; i++) {
        for (const [key, regex] of Object.entries(sectionHeaders)) {
            if (regex.test(lines[i]) && lines[i].length < 60) {
                orderedSections.push({ key, startLine: i + 1 });
                break;
            }
        }
    }
    // Assign end lines
    for (let i = 0; i < orderedSections.length; i++) {
        const endLine = i < orderedSections.length - 1 ? orderedSections[i + 1].startLine - 1 : lines.length;
        sections[orderedSections[i].key] = lines.slice(orderedSections[i].startLine, endLine).join('\n');
    }

    // ---- 5. Location / Address ----
    const locationKw = ['phnom penh','siem reap','battambang','kampong','sihanoukville','cambodia','province','district',
        'commune','city','address','location','khan','sangkat','street','road','ភ្នំពេញ','សៀមរាប','បាត់ដំបង','កំពង់','ខេត្ត','ក្រុង','ស្រុក','ខណ្ឌ','សង្កាត់','ភូមិ','ផ្លូវ','ផ្ទះលេខ'];
    for (const line of lines) {
        const lower = line.toLowerCase();
        if (locationKw.some(kw => lower.includes(kw))) {
            let loc = line.replace(/^(address|location|current address|city|អាសយដ្ឋាន|ទីតាំង)\s*[:：]\s*/i, '').trim();
            if (loc.length > 3 && loc.length < 100) { result.address = loc; break; }
        }
    }
    const iconAddress = fullText.match(/📍\s*([^\n]+)/u);
    if (iconAddress) result.address = iconAddress[1].trim();

    // ---- 6. Gender ----
    const genderMatch = fullText.match(/\b(male|female|ប្រុស|ស្រី)\b/i);
    if (genderMatch) {
        const g = genderMatch[1].toLowerCase();
        result.gender = (g === 'ប្រុស' || g === 'male') ? 'Male' : (g === 'ស្រី' || g === 'female' ? 'Female' : 'Other');
    }

    // ---- 7. DOB ----
    const dobMatch = fullText.match(/(\d{1,2}[\s\/\-]\w+[\s\/\-]\d{4})/);
    if (dobMatch) result.dob = dobMatch[1];

    // ---- 8. Nationality ----
    const natMatch = fullText.match(/\b(nationality|citizen|សញ្ជាតិ)\s*[:：]?\s*(.+)/i);
    if (natMatch) result.nationality = natMatch[2].trim().split(/[,\n]/)[0].trim();

    const marital = labeledValue(['marital status', 'civil status', 'ស្ថានភាពគ្រួសារ']);
    if (marital) result.marital = marital;

    const hometown = labeledValue(['place of birth', 'hometown', 'birth place', 'ទីកន្លែងកំណើត']);
    if (hometown) result.hometown = hometown;

    // ---- 9. Social links ----
    const linkedinMatch = fullText.match(/linkedin\.com\/in\/[\w\-]+/i);
    if (linkedinMatch) result.linkedin = 'https://' + linkedinMatch[0];
    const social = labeledValue(['telegram', 'facebook', 'social', 'social media']);
    if (social) result.social = social;

    if (sections.personal) result.summary = sections.personal.trim();

    // ---- 10. Experience (structured) ----
    if (sections.experience) {
        result.experience = parseExperienceSection(sections.experience);
    }

    // ---- 11. Education (structured) ----
    if (sections.education) {
        result.education = parseEducationSection(sections.education);
    }

    // ---- 12. Skills ----
    if (sections.skills) {
        result.techSkills = parseSkillLevelSection(sections.skills);
    }
    if (sections.softSkills) {
        result.softSkills = sections.softSkills.replace(/\n/g, ', ').replace(/[•\-]/g, '').trim();
    }

    // ---- 13. Languages ----
    if (sections.languages) {
        result.languages = parseLanguagesSection(sections.languages);
    }

    // ---- 14. Certifications ----
    if (sections.certifications) {
        result.certifications = parseCertSection(sections.certifications);
    }

    // ---- 15. Projects / Hobbies ----
    if (sections.projects) {
        result.projects = sections.projects.trim();
    }

    // Detect headings that are not part of the editor's built-in schema and
    // create dynamic sections for them automatically.
    const knownHeadingAt = index => Object.values(sectionHeaders).some(regex => regex.test(lines[index]));
    const looksLikeHeading = (line, index) => {
        if (index < 8 || !line || line.length < 3 || line.length > 50) return false;
        if (line === result.name || line === result.title) return false;
        if (line.includes('@') || /https?:\/\//i.test(line) || /\d{4}\s*[-–—]/.test(line)) return false;
        const words = line.replace(/[:：]$/, '').trim().split(/\s+/);
        if (words.length > 7) return false;
        const letters = line.replace(/[^A-Za-z\u1780-\u17FF]/g, '');
        const uppercaseHeading = /[A-Za-z]/.test(letters) && letters === letters.toUpperCase();
        const colonHeading = /[:：]$/.test(line);
        return uppercaseHeading || colonHeading;
    };
    const allHeadingIndexes = [];
    for (let i = 0; i < lines.length; i++) {
        if (knownHeadingAt(i) || looksLikeHeading(lines[i], i)) allHeadingIndexes.push(i);
    }
    result.additionalSections = [];
    if (sections.references) {
        result.additionalSections.push({ title: 'References', content: sections.references.trim() });
    }
    for (let i = 0; i < allHeadingIndexes.length; i++) {
        const headingIndex = allHeadingIndexes[i];
        if (knownHeadingAt(headingIndex)) continue;
        const end = i < allHeadingIndexes.length - 1 ? allHeadingIndexes[i + 1] : lines.length;
        const content = lines.slice(headingIndex + 1, end).join('\n').trim();
        const title = lines[headingIndex].replace(/[:：]$/, '').trim();
        if (content && !result.additionalSections.some(section => section.title.toLowerCase() === title.toLowerCase())) {
            result.additionalSections.push({ title, content });
        }
    }

    // Always retain the full extraction. Any content the structured parser does
    // not understand remains visible and editable instead of being discarded.
    result.importedText = fullText.trim();

    return result;
}

function parseSkillLevelSection(text) {
    const lines = text.split('\n').map(line => line.replace(/^[•-]\s*/, '').trim()).filter(Boolean);
    const levels = new Set(['native','fluent','professional','advanced','intermediate','basic','beginner','elementary','proficient','little','limited']);
    const items = [];
    for (let i = 0; i < lines.length; i++) {
        const current = lines[i];
        const next = lines[i + 1];
        if (next && levels.has(next.toLowerCase())) {
            items.push(`${current} | ${next}`);
            i++;
        } else if (!levels.has(current.toLowerCase())) {
            items.push(current);
        }
    }
    return items.join(', ');
}

function parseExperienceSection(text) {
    const entries = [];
    const blocks = text.split(/\n\n+/);
    if (blocks.length <= 1) {
        // Treat the whole section as one experience
        entries.push({ company: '', position: '', duration: '', details: text.trim() });
    } else {
        for (const block of blocks) {
            const bLines = block.split('\n').map(l => l.trim()).filter(l => l);
            if (bLines.length === 0) continue;
            const entry = { company: '', position: '', duration: '', details: '' };
            // First line often has position/company
            entry.position = bLines[0] || '';
            if (bLines[1]) entry.company = bLines[1];
            // Look for date patterns
            for (const line of bLines) {
                if (/\d{4}/.test(line) && /[-–—]/.test(line)) { entry.duration = line; break; }
            }
            entry.details = bLines.slice(2).join('\n');
            entries.push(entry);
        }
    }
    return entries;
}

function parseEducationSection(text) {
    const entries = [];
    const blocks = text.split(/\n\n+/);
    for (const block of blocks) {
        const bLines = block.split('\n').map(l => l.trim()).filter(l => l);
        if (bLines.length === 0) continue;
        const entry = { school: '', degree: '', year: '', gpa: '' };
        entry.degree = bLines.find(line => /diploma|degree|bachelor|master|major|certificate|grade/i.test(line)) || bLines[0] || '';
        entry.school = bLines.find(line => /school|university|college|institute|academy/i.test(line) && !/diploma|degree|certificate/i.test(line)) || '';
        for (const line of bLines) {
            if (/\d{4}/.test(line) && /[-–—]/.test(line)) { entry.year = line; }
            const gpaMatch = line.match(/GPA\s*[:：]?\s*([\d.]+)/i);
            if (gpaMatch) entry.gpa = gpaMatch[1];
        }
        entries.push(entry);
    }
    return entries.length > 0 ? entries : [{ school: '', degree: text.trim(), year: '', gpa: '' }];
}

function parseLanguagesSection(text) {
    const langs = [];
    const langLines = text.split('\n').map(l => l.trim()).filter(l => l && l.length > 1);
    const levelKw = ['native','fluent','professional','advanced','intermediate','basic','beginner','elementary','proficient','little','limited'];
    for (let index = 0; index < langLines.length; index++) {
        const line = langLines[index];
        const parts = line.split(/[\-–—:,]/).map(p => p.replace(/[•]/g, '').trim()).filter(p => p);
        if (parts.length >= 2) {
            langs.push({ name: parts[0], level: parts[1] });
        } else if (parts.length === 1) {
            const words = parts[0].split(/\s+/);
            const level = words.find(w => levelKw.includes(w.toLowerCase()));
            const name = words.filter(w => !levelKw.includes(w.toLowerCase())).join(' ');
            const next = langLines[index + 1];
            const nextIsLevel = next && levelKw.includes(next.toLowerCase());
            if (!level && nextIsLevel) {
                langs.push({ name: parts[0], level: next });
                index++;
            } else if (level && !name && langs.length) {
                langs[langs.length - 1].level = level;
            } else {
                langs.push({ name: name || parts[0], level: level || 'Professional' });
            }
        }
    }
    return langs;
}

function parseCertSection(text) {
    const certs = [];
    const certLines = text.split('\n').map(l => l.trim()).filter(l => l && l.length > 2);
    for (const line of certLines) {
        const yearMatch = line.match(/\b(20\d{2}|19\d{2})\b/);
        certs.push({ name: line.replace(/\b\d{4}\b/g, '').replace(/[•\-]/g, '').trim(), org: '', year: yearMatch ? yearMatch[1] : '' });
    }
    return certs;
}

// ============================================================
// PDF Text Extraction (using pdf.js)
// ============================================================
async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        updateImportModal(`Reading PDF page ${i}/${pdf.numPages}...`, null, (i / pdf.numPages) * 80);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const content = await page.getTextContent();
        const textItems = content.items
            .filter(item => item.str && item.str.trim())
            .map(item => ({
                text: item.str.trim(),
                x: item.transform?.[4] || 0,
                y: item.transform?.[5] || 0,
                width: item.width || 0
            }));

        const itemsToText = items => {
            const visualLines = [];
            const yTolerance = 3;
            items
                .sort((a, b) => Math.abs(b.y - a.y) > yTolerance ? b.y - a.y : a.x - b.x)
                .forEach(item => {
                    let line = visualLines.find(candidate => Math.abs(candidate.y - item.y) <= yTolerance);
                    if (!line) {
                        line = { y: item.y, items: [] };
                        visualLines.push(line);
                    }
                    line.items.push(item);
                });
            visualLines.sort((a, b) => b.y - a.y);
            return visualLines.flatMap(line => {
                const sorted = line.items.sort((a, b) => a.x - b.x);
                const chunks = [[]];
                let previous = null;
                for (const item of sorted) {
                    const gap = previous ? item.x - (previous.x + previous.width) : 0;
                    if (previous && gap > Math.max(18, viewport.width * 0.035)) chunks.push([]);
                    chunks[chunks.length - 1].push(item.text);
                    previous = item;
                }
                return chunks.map(chunk => chunk.join(' '));
            }).join('\n');
        };

        // CVs commonly use a full-width header/footer with two independent body
        // columns. Reading by Y alone interleaves unrelated sections. Detect that
        // layout and read each column top-to-bottom instead.
        const headerCutoff = viewport.height * 0.86;
        const footerCutoff = viewport.height * 0.05;
        const columnSplit = viewport.width * 0.34;
        const headerItems = textItems.filter(item => item.y >= headerCutoff);
        const footerItems = textItems.filter(item => item.y <= footerCutoff);
        const bodyItems = textItems.filter(item => item.y < headerCutoff && item.y > footerCutoff);
        const leftItems = bodyItems.filter(item => item.x < columnSplit);
        const rightItems = bodyItems.filter(item => item.x >= columnSplit);
        const hasTwoColumns = leftItems.length >= 6 && rightItems.length >= 6;

        const pageText = hasTwoColumns
            ? [itemsToText(headerItems), itemsToText(leftItems), itemsToText(rightItems), itemsToText(footerItems)].filter(Boolean).join('\n')
            : itemsToText(textItems);
        fullText += pageText + '\n';
    }
    return fullText;
}

// ============================================================
// Image OCR Text Extraction (using Tesseract.js)
// ============================================================
async function extractTextFromImage(file) {
    const imageUrl = URL.createObjectURL(file);
    try {
        const result = await Tesseract.recognize(imageUrl, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    const pct = Math.round((m.progress || 0) * 80);
                    updateImportModal('Scanning image with OCR...', `Progress: ${pct}%`, pct);
                }
            }
        });
        URL.revokeObjectURL(imageUrl);
        return result.data.text;
    } catch (err) { URL.revokeObjectURL(imageUrl); throw err; }
}

// ============================================================
// Main Import File Handler
// ============================================================
document.getElementById('import-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileName = file.name.toLowerCase();

    // JSON
    if (fileName.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                importDataCleanly(data);
                alert("✅ CV Data Imported Successfully!");
            } catch (err) { alert("❌ Invalid JSON."); }
        };
        reader.readAsText(file);
        e.target.value = '';
        return;
    }

    // PDF
    if (fileName.endsWith('.pdf')) {
        showImportModal('Reading PDF file...', 'Extracting text from your CV.');
        try {
            const text = await extractTextFromPDF(file);
            updateImportModal('Analyzing CV content...', 'Identifying all sections...', 90);
            const data = parseCVText(text);
            importDataCleanly(data);
            showImportSuccess('✅ PDF Import Complete!');
        } catch (err) { console.error(err); showImportError('❌ Failed to read PDF.'); }
        e.target.value = '';
        return;
    }

    // Image
    if (/\.(png|jpe?g)$/i.test(fileName)) {
        showImportModal('Scanning image...', 'Using OCR. This may take 10-30 seconds.');
        try {
            // ✅ Fix #3: Save image as profile photo before OCR
            const imgReader = new FileReader();
            imgReader.onload = evt => localStorage.setItem('cv_profile_img', evt.target.result);
            imgReader.readAsDataURL(file);
            const text = await extractTextFromImage(file);
            updateImportModal('Analyzing CV content...', 'Identifying all sections...', 90);
            const data = parseCVText(text);
            importDataCleanly(data);
            showImportSuccess('✅ Image Import Complete!');
        } catch (err) { console.error(err); showImportError('❌ Failed to read image.'); }
        e.target.value = '';
        return;
    }

    alert('❌ Unsupported file type. Please use PDF, PNG, JPG, or JSON.');
    e.target.value = '';
});
