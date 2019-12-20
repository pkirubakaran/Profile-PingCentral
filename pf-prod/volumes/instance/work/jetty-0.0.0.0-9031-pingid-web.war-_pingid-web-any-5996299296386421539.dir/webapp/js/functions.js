function toggle_visibility(id1, id2) {
	toggle_visibility_decide_focus(id1, id2, true);
}

function toggle_visibility_without_focus(id1, id2) {
	toggle_visibility_decide_focus(id1, id2, false);
}

function toggle_visibility_decide_focus(id1, id2, focus) {
	// when switching panels, always hide the error related divs
	var id = document.getElementById("form-errors");
	if(id != null) {
		id.style.display = 'none';
	}
    
	id = document.getElementById("otp-label");
	if(id != null) {
		id.classList.remove("form-error");
	}
    
	id = document.getElementById("modal-messages");
	if(id != null) {
		id.style.display = 'none';
	}
    
	var e = document.getElementById(id1);
	var e2 = document.getElementById(id2);
	if(e.style.display != 'none') {
		e.style.display = 'none';
		e2.style.display = 'block';
		if(e2.id == 'qrcode') {
			id = document.getElementById("OTP");
			id.value = "";
			if(focus) {
				id.focus();
			}
		}
	} else {
		e.style.display = 'block';
		e2.style.display = 'none';
	}
    
}

function selectDevice(element) {
    document.getElementById("qrcode-img").src = element.getAttribute('data-qrcode');
    var e = document.getElementById("deeplink-btn");
    if(e != null) {
    	var dataCode = element.getAttribute('data-code');
    	e.setAttribute("href", "pingid://offlineauth?code=".concat(dataCode));
    }
}

function validateOtp(otp) {
    var submitBtn = document.getElementById("sso");
    
    if (/^\d{6}$/.test(otp)) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
    
}

function setOtpFocus() {
    var qrPanel = document.getElementById("qrcode");
    if(qrPanel.style.display != 'none') {
        document.getElementById("OTP").focus();
    }
}
