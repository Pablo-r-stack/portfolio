// selectors
const mailBtn = document.getElementById('mailBtn');
const cvBtn = document.getElementById('cvBtn');

//form data inputs
const form = document.querySelector('form');
const formInput = form.querySelectorAll('div input, textarea');
const btnSend = document.getElementById('btnSend');


//EVENTS

//unfold menu when click a navlink

const toggler = document.getElementById('toggler');
const navLinks = document.querySelectorAll('.navLinks ul li:nth-child(-n+4) a');

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        toggler.checked = false;
    });
});

//dark-light toggler
const checkbox = document.querySelector('.checkbox');
checkbox.addEventListener('change', () => {
    document.documentElement.classList.toggle('light-mode', checkbox.checked);

    const newColor = checkbox.checked ? '#141319' : '#f3f1ff';

    // ParticleJS refresh
    pJSDom[0].pJS.particles.color.value = newColor;
    pJSDom[0].pJS.fn.particlesRefresh();
});

//email clipboard copy
const check = document.getElementById('check');
const envelope = document.getElementById('envelope');
const contour = document.getElementById('contour');

mailBtn.addEventListener('click', () => {
    const mail = 'pablor.velasco.suarez@gmail.com'

    navigator.clipboard.writeText(mail);
    addSuccesMsg(mailBtn, actualLang.tooltip.copyMail);

    check.style.opacity = '1'; // show check scope
    envelope.style.opacity = '0';
    contour.style.opacity = ' 0'

    setTimeout(() => {
        check.style.opacity = '0'; // Hide after 3s
        envelope.style.opacity = '1';
        contour.style.opacity = '1';
    }, 3000);
});


//CV DOWNLOAD
cvBtn.addEventListener('click', () => {
    const link = document.createElement('a');

    link.href = getCv(actualLang);
    link.download = 'curriculum.pdf';
    link.click();
})
//will return a diferent cv link based on actual lang
const getCv = ((actualLang) => {

    const cvEn = 'https://drive.usercontent.google.com/uc?id=1Z-i_ddnpzvQEbmcZgdVIVNMjcACCit-L&export=download';
    const cvEs = 'https://drive.usercontent.google.com/uc?id=1PExmlWGaoRN8RU4L2pam1ncfnXaHLt3R&export=download';
    const cvPt = 'https://drive.usercontent.google.com/uc?id=1qSRc0oQDXqArDZjas49y0HryXv3F_YsX&export=download';

    return (actualLang.lang === 'en' ? cvEn : actualLang.lang === 'es' ? cvEs : cvPt);
});

//Form validation & email sender

// Prevent special chars
formInput.forEach((field) => {
    field.addEventListener('keydown', (e) => {
        const forbiddenCharacters = /[#!=:&/()[\]]/;
        const char = e.key;
        if (forbiddenCharacters.test(char)) {
            deleteWarnMsg();
            e.preventDefault();
            addWarnMsg(field, actualLang.tooltip.illegal);
        }
    })
})

// submit event
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
        btnSend.textContent = actualLang.tooltip.sending;

        const serviceID = 'default_service';
        const templateID = 'template_kgf14rs';

        emailjs.sendForm(serviceID, templateID, form)
            .then(() => {
                btnSend.textContent = actualLang.tooltip.sent;
                btnSend.style.backgroundColor = 'green';
            }, (err) => {
                btnSend.textContent = 'Send Email';
                alert(JSON.stringify(err));
            });
    }
    setTimeout(() => {
        btnSend.textContent = actualLang.contact.form.btn;
        btnSend.style.backgroundColor = 'var(--btnColor)';
        //reset all formInput fields to be blank
        formInput.forEach((field) => field.value = '')
    }, 5000);
});

// Avoid empty info
const validateForm = (() => {
    let valid = true;
    deleteWarnMsg();
    formInput.forEach((field) => {
        if (field.value.trim() == '') {
            addWarnMsg(field, actualLang.tooltip.empty);
            valid = false;
        }
    })
    return valid;
})


//emerging tooltips
const addWarnMsg = ((field, msg) => {

    const parent = field.parentNode;
    console.log(parent);
    
    const warningMessage = document.createElement('div');
    warningMessage.classList.add('warning-tooltip');
    warningMessage.textContent = msg;


    warningMessage.style.position = 'absolute';
    
    parent.appendChild(warningMessage);

    setTimeout(() => {
        warningMessage.remove();
    }, 3000);
});

const deleteWarnMsg = (() => {
    const existingWarnings = document.querySelectorAll('.warning-tooltip');
    existingWarnings.forEach(warning => {
        warning.remove();
    });
});

const addSuccesMsg = ((field, msg) => {
    const existingMsg = document.querySelector('.success-tooltip');
    if (existingMsg) {
        existingMsg.remove();
    }

    const successMsg = document.createElement('div');

    successMsg.classList.add('success-tooltip');
    successMsg.style.width = `${field.style.width}px`;
    successMsg.innerHTML = msg;

    field.parentElement.appendChild(successMsg);

    setTimeout(() => {
        successMsg.remove();
    }, 3000);
});

//language settings:
// lang radio selectors
const langSelector = document.querySelectorAll('input[type="radio"][name="lang"]');

//variables initialized will be filled on domload
let actualLang = '';
let es = null;
let en = null;
let pt = null;


document.addEventListener('DOMContentLoaded', async () => {
    // call to lang fetch
    const langs = await getLangs();
    // setting up vars
    es = langs.es;
    en = langs.en;
    pt = langs.pt;

    actualLang = en;

    //will create cards and dom elements based on json info
    coursesCards(actualLang.formation.courses);
    projectCards(actualLang.experience.projects);

    //translate all elements based on actualLang
    translate(actualLang);
});

//lang radio btn event listener
langSelector.forEach((lang) => {
    lang.addEventListener('change', () => {
        lang.value === 'en' ? actualLang = en : lang.value === 'es' ? actualLang = es : actualLang = pt;
        translate(actualLang);
    })
})

// Fetch lang Json
const getLangs = async () => {
    try {
        const response = await fetch('assets/data/lang.json');
        const data = await response.json();
        console.log(data);

        const { es, en, pt } = data.languages;

        return { es, en, pt };
    } catch (error) {
        console.log('Something wrong happened (no response)');
        return {};
    }
};

//translate function based on data-i18n dom tags
function translate(actualLang) {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach((element) => {
        const key = element.getAttribute('data-i18n');
        // reduce keyname to match data tag
        const translation = key.split('.').reduce((obj, i) => obj[i], actualLang);

        // Update element based on actual value
        element.textContent = translation;
    })
}

//Dynamic generation cards function
const coursesCards = ((courses) => {
    const container = document.querySelector('#formation');
    courses.forEach((course, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
        <div class="card">
                <img src="${course.img}" alt="study">
                <h4 data-i18n="formation.courses.${index}.tittle">${course.tittle}</h4>
                <p>
                    <span data-i18n="formation.courses.${index}.year">${course.year} - </span>
                    <span data-i18n="formation.courses.${index}.academy">${course.academy}</span>
                </p>
        </div>
        `
        container.appendChild(card);
    })
})

const projectCards = ((projects) => {
    const container = document.querySelector('#experience');

    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.classList.add('card'); // Agregar la clase 'card' al div
        card.innerHTML = `
    <img src="${project.image}" alt="proyect-img">
    <h4 data-i18n="experience.projects.${index}.tittle">${project.tittle}</h4>
    <p data-i18n="experience.projects.${index}.desc">${project.desc}</p>
    <div>
    ${project.repo ? `<a href="${project.repo}" class="btn" data-i18n="experience.btns.repo">Repo</a>` : ''}
    ${project.demo ? `<a href="${project.demo}" class="btn" data-i18n="experience.btns.demo">Demo</a>` : ''}
    </div>
`
        container.appendChild(card);
    });
});



