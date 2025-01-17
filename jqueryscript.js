const stateObject = {
    "Gujarat": { "Navsari": [], "Surat": [], "Ahmedabad": [] },
    "Maharashtra": { "Mumbai": [], "Pune": [], "Nagpur": [] },
    "Rajasthan": { "Jaipur": [], "Jodhpur": [], "Jaisalmer": [] }
};

const globalData = [];

$(document).ready(function(){
$.each(stateObject, function(state){
    $('select[name="State"]').append(new Option(state, state));
});
$('select[name="State"').on("change", function(){
    const statesel = $(this).val();
    const citysel = $('select[name="City"]');
    citysel.empty().append(new Option("Select city",""));
    if(stateObject[statesel]){
        $.each(stateObject[statesel], function(city){
            citysel.append(new Option(city, city));
        });
    }
});

// to validate form
function validateForm($form) {
    let valid = true;
    const name = $form.find('input[name="Name"]').val().trim();
    const email = $form.find('input[name="Email"]').val();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const gender = $form.find('input[name="gender"]:checked').val();
    const hobbies = $form.find('input[type="checkbox"]:checked');
    const age = $form.find('input[name="Age"]').val();
    const state = $form.find('select[name="State"]').val();
    const city = $form.find('select[name="City"]').val();
    if (!name || !emailPattern.test(email) || !gender || hobbies.length === 0 || !age || age < 1 || age > 100 || !state || !city) {
        $(".error").text("* Fill up form with all data...");
        valid = false;
    } else {
        $(".error").text("");
    }
    return valid;
}

//add data to array object
$("#form2").on("submit", function(event){
    event.preventDefault();
    const $form = $(this);
    if(!validateForm($form)) return;
    const data = {
        name: $form.find('input[name="Name"]').val(),
        email: $form.find('input[name="Email"]').val(),
        gender: $form.find('input[name="gender"]:checked').val(),
        hobbies: Array.from($form.find('input[type="checkbox"]:checked')).map(hobby => hobby.value).join(", "),
        age: $form.find('input[name="Age"]').val(),
        state: $form.find('select[name="State"]').val(),
        city: $form.find('select[name="City"]').val()
    };
    globalData.push(data);
    addToTable(data);
    $form[0].reset();
});

// reset error message
$("#form2").on("reset", function(){
    $(".error").text(" ");
});

//add data into the table
function addToTable($data) {
    const row = `
        <tr>
            <td>${$data.name}</td>
            <td>${$data.email}</td>
            <td>${$data.gender}</td>
            <td>${$data.hobbies}</td>
            <td>${$data.age}</td>
            <td>${$data.state}</td>
            <td>${$data.city}</td>
            <td><button class="edit">Edit</button></td>
            <td><button class="delete">Delete</button></td>
        </tr>
    `;
    $("#data-table tbody").append(row);
}

// delete row from the table
$("#data-table").on("click", ".delete",function(){
    const rowIndex = $(this).closest("tr").index();
    globalData.splice(rowIndex, 1);
    $(this).closest("tr").remove();
});

// edit row data
$("#data-table").on("click", ".edit", function(){
    const rowIndex = $(this).closest("tr").index();
    const data = globalData[rowIndex];
    const $form = $("#form2");
    $form.find('input[name="Name"]').val(data.name);
    $form.find('input[name="Email"]').val(data.email);
    $form.find(`input[name="gender"][value="${data.gender}"]`).prop("checked", true);
    $form.find('input[type="checkbox"]').each(function(){
        $(this).prop("checked", data.hobbies.includes($(this).val()));
    });
    $form.find('input[name="Age"]').val(data.age);
    $form.find('select[name="State"]').val(data.state).change();
    $form.find('select[name="City"]').val(data.city);
    globalData.splice(rowIndex, 1);
    $(this).closest("tr").remove();
});

// seach name in table
$("#myInput").on("keyup", function(){
    const filter = $(this).val().toUpperCase();
    $("#data-table tbody tr").each(function(){
        const td = $(this).find("td").eq(0).text().toUpperCase();
        $(this).toggle(td.includes(filter));
    });
});

// sort table according to name
$("#sort").on("change", function(){
    const rows = Array.from($("#data-table tbody tr"));
    const sortOption = $(this).val();
    rows.sort(function (rowA, rowB){
        const nameA = $(rowA).find("td").eq(0).text().toLowerCase();
        const nameB = $(rowB).find("td").eq(0).text().toLowerCase();
        return sortOption === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    $("#data-table tbody").empty().append(rows);
});
});