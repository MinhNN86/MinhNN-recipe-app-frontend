let accountData = JSON.parse(localStorage.getItem("accountData")) || [];
let rememberedAccount = JSON.parse(
  localStorage.getItem("rememberedAccount") || "null"
);

// Kiểm tra và điền thông tin tài khoản đã lưu khi trang tải
document.addEventListener("DOMContentLoaded", function () {
  if (rememberedAccount) {
    document.getElementById("inputEmail").value = rememberedAccount.email;
    document.getElementById("inputPassword").value = rememberedAccount.password;
    document.getElementById("rememberMe").checked = true;
  }
});

function showNotification(element) {
  element.style.display = "flex";
  element.classList.add("slide-in");
  setTimeout(() => {
    element.classList.remove("slide-in");
  }, 300);
}

function hideNotification(element) {
  element.classList.add("slide-out");
  setTimeout(() => {
    element.style.display = "none";
    element.classList.remove("slide-out");
  }, 300);
}

document.getElementById("btn-signIn").addEventListener("click", function () {
  let inputEmail = document.getElementById("inputEmail").value.trim();
  let inputPassword = document.getElementById("inputPassword").value.trim();
  let rememberMe = document.getElementById("rememberMe").checked;
  let inputError = document.getElementById("inputError");
  let pass = document.querySelector(".notification-Container .pass");
  let error = document.querySelector(".notification-Container .error");

  inputError.innerHTML = "";
  let check = true;

  if (inputEmail === "") {
    inputError.innerHTML += "Email không được bỏ trống <br />";
    check = false;
  }

  if (inputPassword === "") {
    inputError.innerHTML += "Mật khẩu không được bỏ trống <br />";
    check = false;
  }

  let checkAccount = accountData.filter((e) => e.email === inputEmail);

  if (checkAccount.length === 0) {
    inputError.innerHTML += "Email không tồn tại <br />";
    check = false;
  } else if (checkAccount[0].password !== inputPassword) {
    inputError.innerHTML += "Mật khẩu không hợp lệ <br />";
    check = false;
  }

  if (check) {
    hideNotification(error);
    // Xử lý "Remember me"
    if (rememberMe) {
      // Lưu thông tin đăng nhập
      localStorage.setItem(
        "rememberedAccount",
        JSON.stringify({
          email: inputEmail,
          password: inputPassword,
        })
      );
    } else {
      localStorage.removeItem("rememberedAccount");
    }
    //Lưu tài khoản đang được đăng nhập
    let loginAccount = accountData.filter((e) => e.email === inputEmail);
    let loginAccountData = {
      id: loginAccount[0].id,
      username: loginAccount[0].username,
    };
    localStorage.setItem("loginAccountData", JSON.stringify(loginAccountData));

    showNotification(pass);
    setTimeout(() => {
      window.location.href = "home.html";
    }, 2000);
  } else {
    document.getElementById("inputEmail").value = "";
    document.getElementById("inputPassword").value = "";
    document.getElementById("rememberMe").checked = false;
    showNotification(error);
    let btnClose = document.querySelector(".error .btn-close");
    btnClose.addEventListener("click", function () {
      hideNotification(error);
    });
    setTimeout(() => {
      hideNotification(error);
    }, 2000);
  }
});
