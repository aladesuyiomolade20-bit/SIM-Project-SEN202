document.addEventListener('DOMContentLoaded', () => {
    const dispatchBtn = document.getElementById('dispatchBtn');
    const returnBtn = document.getElementById('returnBtn');
    const anonCheck = document.getElementById('anonCheck');
    const identityFields = document.getElementById('identityFields');

    if (anonCheck) {
        anonCheck.addEventListener('change', () => {
            identityFields.style.display = anonCheck.checked ? 'none' : 'block';
        });
    }

    if (dispatchBtn) {
        dispatchBtn.addEventListener('click', processIncidentLog);
    }

    if (returnBtn) {
        returnBtn.addEventListener('click', resetInterfaceContainer);
    }
});

function processIncidentLog() {
    const userRole = document.getElementById('userClass').value;
    const crimeTag = document.getElementById('infractionType').value;
    const locationString = document.getElementById('sceneLocation').value.trim();
    const isAnonymous = document.getElementById('anonCheck').checked;
    const ledgerTable = document.getElementById('ledgerRows');

    if (!locationString) {
        alert('Validation Alert: Incident location parameter cannot be left blank.');
        return;
    }

    let sourceEntity = 'Anonymous';
    if (!isAnonymous) {
        const name = document.getElementById('reporterName').value.trim();
        const dept = document.getElementById('reporterDept').value.trim();
        if (name && dept) {
            sourceEntity = `${name} (${dept})`;
        } else if (name) {
            sourceEntity = name;
        } else {
            sourceEntity = `Identified ${userRole}`;
        }
    } else {
        sourceEntity = `Anonymous (${userRole})`;
    }

    const referenceToken = generateSecureToken();

    const topRow = ledgerTable.insertRow(0);
    const col1 = topRow.insertCell(0);
    const col2 = topRow.insertCell(1);
    const col3 = topRow.insertCell(2);

    col1.innerHTML = `<strong>${crimeTag}</strong> <br><small style="color: #10b981;">Ref: ${referenceToken}</small>`;
    col2.innerText = locationString;
    col3.innerText = sourceEntity;

    renderMapBeacon();

    document.getElementById('tokenOutput').innerText = referenceToken;
    document.getElementById('entryPanel').style.display = 'none';
    document.getElementById('receiptPanel').style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetInterfaceContainer() {
    document.getElementById('crimeForm').reset();
    document.getElementById('identityFields').style.display = 'block';
    document.getElementById('receiptPanel').style.display = 'none';
    document.getElementById('entryPanel').style.display = 'block';
}

function generateSecureToken() {
    const characterSet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let computedString = '';
    for (let counter = 0; counter < 4; counter++) {
        computedString += characterSet.charAt(Math.floor(Math.random() * characterSet.length));
    }
    return `SIM-2026-${computedString}`;
}

function renderMapBeacon() {
    const viewport = document.querySelector('.geo-container');
    const baselineText = document.getElementById('mapMetaText');
    
    if (baselineText) {
        baselineText.innerText = "Recent reports plotted on the map:";
    }

    const node = document.createElement('div');
    node.className = 'radar-ping';
    
    const coordinateX = Math.floor(Math.random() * 80) + 10;
    const coordinateY = Math.floor(Math.random() * 50) + 20;
    
    node.style.position = 'absolute';
    node.style.left = `${coordinateX}%`;
    node.style.top = `${coordinateY}%`;
    node.style.margin = '0';

    viewport.appendChild(node);
}