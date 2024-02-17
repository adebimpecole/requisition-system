import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

import iclose from "../assets/close.svg"

// function to close modal
export const CloseReq = () => {
    Swal.close()
}

// displays request information for view only
export const openRequest = (e) => {
    console.log(e)
    const swal = Swal.fire({
        html:
            "<div class='the_title'>" +
            "<span> " + e.title + "</span>" +
            "<img id='close' src='" + iclose + "' alt='alert_icon' style='cursor:pointer'/>" +
            "</div>" +
            '<div class="to_who">' +
            'ID - ' + e.requset_id +
            '</div>' +
            '<div class="the_description" >' +
            e.description +
            '</div>' +
            '<div class="other_details">' +
            '<span>Sent on the ' + e.date + '</span>' +
            '<span>Received on the ' + e.date + '</span>' +
            '<span>Seen by ' + e.date + '</span>' +
            '<span>Status - ' + e.status + '</span>' +
            '</div>' +
            "</span>",
        allowOutsideClick: false,
        showConfirmButton: false,
        customClass: {
            popup: 'popup',
            htmlContainer: 'container',
        },
    });
    // Close request
    const closeButton = document.getElementById('close');
    closeButton.addEventListener('click', () => CloseReq());
}
