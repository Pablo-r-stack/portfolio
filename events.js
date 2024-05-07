// selectors

const mailBtn = document.getElementById('navMail');
const cvBtn = document.getElementById('cvBtn');



//email clipboard copy
mailBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(mailBtn.innerText);
    alert(`mail copied to clipboard`);
});

cvBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = 'https://drive.usercontent.google.com/uc?id=1Z-i_ddnpzvQEbmcZgdVIVNMjcACCit-L&export=download';
    link.download = 'curriculum.pdf'; // Nombre del archivo descargado
    link.click();
})