const form = document.querySelector("#add-todo-form");
form.addEventListener("submit", addList);

const ref = firebase.database().ref("userList");

function addList(event) {
    event.preventDefault();
    let title = document.getElementById("title").value;
    const currentUser = firebase.auth().currentUser
    ref.child(currentUser.uid).push({
        title,
    });
    console.log("Add list complete!");
    var toastContainer = document.querySelector(".toast-container");
    toastContainer.innerHTML += `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                    <img src="${currentUser.photoURL}" class="rounded me-2" alt="..." width='20px' height='20px'>
                    <strong class="me-auto">${currentUser.displayName}</strong>
                    <small class="text-muted">just now</small>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                    ${title}
                    </div>
                </div>`
    let toasts = toastContainer.querySelectorAll(".toast");
    console.log(toasts);
    let lastToast = toasts[toasts.length - 1]
    var toast = new bootstrap.Toast(lastToast)
    toast.show()
    document.getElementById("title").value = "";
    setTimeout(() => {
        toast.hide()
    }, 5000)
}

function readList(snapshot) {
    document.getElementById("name-list").innerHTML = "";
    snapshot.forEach((data) => {
        const id = data.key;
        const title = data.val().title;
        const newDiv =
            `<tr class=''>
        <th scope="row" class="">${profileName}</th>
        <td>${title}</td>
        <td><div class='col-1 d-inline-block text-end'><button type="button" class="btn btn-outline-danger btn-delete" data-id="${id}"><i class="bi bi-trash3"></i></button></div></td>
      </tr>`;
        document.getElementById("name-list").innerHTML += newDiv

        // `<li id=${id} class='list-group-item row'><div class='col-11 d-inline-block'>${title}</div><div class='col-1 d-inline-block text-end'><button type="button" class="btn btn-outline-danger btn-delete" data-id="${id}"><i class="bi bi-trash3"></i></button></div></li>`;
    })
    document.querySelectorAll("button.btn-delete").forEach((btn) => {
        btn.addEventListener("click", deleteList)
    })
}

// ref.on("value", (data) => {
//     readList(data)
// })

function deleteList(event) {
    const id = event.currentTarget.getAttribute('data-id');
    const currentUser = firebase.auth().currentUser;
    ref.child(currentUser.uid).child(id).remove();
    console.log(`delete on id: ${id}`);
}

function getList(user) {
    if (user) {
        ref.child(user.uid).on('value', (snapshot) => {
            readList(snapshot)
        })
    }
}

const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');

function setupUI(user) {
    if (user) {
        document.querySelector("#profile-image").innerHTML = `<img src='${user.photoURL}' width='40px' height='40px' style="border-radius: 50%">`
        profileName = document.querySelector("#profile-name").innerHTML = user.displayName
        loginItems.forEach((item) => {
            item.style.display = 'inline-block'
        })
        logoutItems.forEach((item) => {
            item.style.display = 'none'
        })
    } else {
        loginItems.forEach((item) => {
            item.style.display = 'none'
        })
        logoutItems.forEach((item) => {
            item.style.display = 'inline-block'
        })
    }
}