
const touristList = JSON.parse(localStorage.getItem('touristList')) || [];
let editIndex = localStorage.getItem('editIndex');


function renderList() {
    const tbody = document.getElementById("tourist-list");
    if (tbody) {
        tbody.innerHTML = '';
        touristList.forEach((place, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${place.name}</td>
                <td>${place.address}</td>
                <td>${place.rating}</td>
                <td><img src="${place.pictureURL}" alt="Image" style="width: 100px;"></td>
                <td>
                    <button onclick="editTourist(${index})">Update</button>
                    <button onclick="deleteTourist(${index})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Convert image to Base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


async function submitForm() {
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const rating = document.getElementById("rating").value;
    const type = document.getElementById("type").value;
    const picture = document.getElementById("picture").files[0];

    let pictureURL = '';
    if (picture) {
        pictureURL = await toBase64(picture); // Convert picture to Base64
    }

    const touristPlace = {
        name,
        address,
        rating,
        type,
        pictureURL
    };

    // If editing an existing tourist place, update it; otherwise, add a new one
    if (editIndex !== null) {
        touristList[editIndex] = touristPlace;
        localStorage.removeItem('editIndex');
    } else {
        touristList.push(touristPlace);
    }

    // Save the updated tourist list in localStorage
    localStorage.setItem('touristList', JSON.stringify(touristList));
    window.location.href = 'tourist.html';
}

// Edit a tourist place (prefill the form with existing data)
function editTourist(index) {
    localStorage.setItem('editIndex', index);
    window.location.href = 'form.html';
}

// Delete a tourist place from the list
function deleteTourist(index) {
    touristList.splice(index, 1);
    localStorage.setItem('touristList', JSON.stringify(touristList));
    renderList();
}

// If on the form page, prefill the form if editing
if (document.getElementById("tourist-form")) {
    if (editIndex !== null) {
        const place = touristList[editIndex];
        document.getElementById("name").value = place.name;
        document.getElementById("address").value = place.address;
        document.getElementById("rating").value = place.rating;
        document.getElementById("type").value = place.type;
    }
}

// Load the list of tourist places when the page loads
window.onload = renderList;
