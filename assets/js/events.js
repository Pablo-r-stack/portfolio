// selectors

const mailBtn = document.getElementById('navMail');
const cvBtn = document.getElementById('cvBtn');

//form data inputs
const form = document.querySelector('form');
const formInput = form.querySelectorAll('div input, textarea');
const btnSend = document.getElementById('btnSend');


//EVENTS 

//email clipboard copy
mailBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(mailBtn.innerText);
    addSuccesMsg(mailBtn, 'email copiado');
});


//CV DOWNLOAD
cvBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = 'https://drive.usercontent.google.com/uc?id=1Z-i_ddnpzvQEbmcZgdVIVNMjcACCit-L&export=download';
    link.download = 'curriculum.pdf'; // Nombre del archivo descargado
    link.click();
})

//Form validation & email sender

// Prevent special chars
formInput.forEach((field) => {
    field.addEventListener('keydown', (e) => {
        const forbiddenCharacters = /[#!=:&/()[\]]/;
        const char = e.key;
        if (forbiddenCharacters.test(char)) {
            deleteWarnMsg();
            e.preventDefault();           
            addWarnMsg(field, 'Caracteres ilegales');
        }
    })
})

// submit event
btnSend.addEventListener('click', (e) => {
    e.preventDefault();
    if(validateForm()){
    console.log(`email ready to send:
    name: ${name.value}
    email: ${mail.value}
    subject: ${subject.value}
    msg: ${msg.value}`);
    }
})

// Avoid empty info
const validateForm = (()=>{
    let valid = true;
    deleteWarnMsg();
    formInput.forEach((field)=>{
        if(field.value.trim() == ''){
            addWarnMsg(field, 'Por favor, completa este campo');
            valid = false;
        }
    })
    return valid;
})

const addWarnMsg = ((field, msg) => {

    const warningMessage = document.createElement('div');
    warningMessage.classList.add('warning-tooltip');
    warningMessage.textContent = msg;
    
    // Posicionar el mensaje de advertencia
    const inputRect = field.getBoundingClientRect();
    warningMessage.style.position = 'absolute';
    warningMessage.style.top = `${window.scrollY + inputRect.top}px`;
    warningMessage.style.left = `${window.scrollX + inputRect.left}px`;
    document.body.appendChild(warningMessage);
    
    // Ocultar el mensaje de advertencia después de 3 segundos
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

const addSuccesMsg =((field, msg)=>{
    const existingMsg = document.querySelector('.success-tooltip');
    if(existingMsg){
        existingMsg.remove();
    }

    const successMsg = document.createElement('div');

    successMsg.classList.add('success-tooltip');
    successMsg.style.width = `${field.offsetWidth}px`;
    successMsg.innerHTML = msg;

    field.style.display = 'none';
    field.parentElement.insertBefore(successMsg, field);

    setTimeout(()=>{
        successMsg.remove();
        field.style.display = 'flex';
    }, 3000);
});

