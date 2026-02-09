const book= document.querySelector('.book');
const form=document.querySelector('.form');
if (book && form) {
book.addEventListener("click",()=>{
if(form.style.display==="none"){
    form.style.display="block";
}else{
    form.style.display="none";
}
})}

function selectDriver() {
    sessionStorage.setItem('customerName', document.getElementById('name').value);
    sessionStorage.setItem('contact', document.getElementById('contact').value);
    sessionStorage.setItem('pickup', document.getElementById('pickup').value);
    sessionStorage.setItem('destination', document.getElementById('destination').value);
    sessionStorage.setItem('startDate', document.getElementById('pickdate').value);
    sessionStorage.setItem('endDate', document.getElementById('returndate').value);
    sessionStorage.setItem('carId', document.querySelector('select[name="carId"]').value);

    // Redirect to driver selection page
    window.location.href = '/select-driver';
}

// Restore values on form load
window.onload = () => {
    const driverId = sessionStorage.getItem('selectedDriverId');
    const driverName = sessionStorage.getItem('selectedDriverName');

    if (document.getElementById('name'))
        document.getElementById('name').value = sessionStorage.getItem('customerName') || '';
    if (document.getElementById('contact'))
        document.getElementById('contact').value = sessionStorage.getItem('contact') || '';
    if (document.getElementById('pickup'))
        document.getElementById('pickup').value = sessionStorage.getItem('pickup') || '';
    if (document.getElementById('destination'))
        document.getElementById('destination').value = sessionStorage.getItem('destination') || '';
    if (document.getElementById('pickdate'))
        document.getElementById('pickdate').value = sessionStorage.getItem('startDate') || '';
    if (document.getElementById('returndate'))
        document.getElementById('returndate').value = sessionStorage.getItem('endDate') || '';
    if (document.querySelector('select[name="carId"]'))
        document.querySelector('select[name="carId"]').value = sessionStorage.getItem('carId') || '';

    // Set selected driver
    if (driverId) {
        const driverInput = document.getElementById('driverId');
        if (driverInput) driverInput.value = driverId;

        let info = document.getElementById('selectedDriverInfo');
        if (!info) {
            info = document.createElement('p');
            info.id = 'selectedDriverInfo';
            document.querySelector('.form').prepend(info);
        }
        info.innerText = 'Selected Driver: ' + driverName;
    }
};