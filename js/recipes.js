// Hiệu ứng sidebar
document.addEventListener("DOMContentLoaded", function () {
  const btnCloseSidebar = document.querySelector(".btnCloseSidebar");
  const sideBar = document.querySelector(".sideBar");
  const headerContent = document.querySelector(".header-content");
  const textElements = document.querySelectorAll(".textPage, .textSignOut");
  const logoFull = document.querySelector(".logoFull");
  const logoIcon = document.querySelector(".logoIcon");

  // Trạng thái sidebar (mở = true, đóng = false)
  let sidebarOpen = true;

  btnCloseSidebar.addEventListener("click", function () {
    sidebarOpen = !sidebarOpen;

    if (!sidebarOpen) {
      // Thu gọn sidebar
      sideBar.classList.add("collapsed");
      headerContent.classList.add("expanded");

      // Ẩn text
      textElements.forEach((el) => {
        el.style.display = "none";
      });

      // Hiện logo icon, ẩn logo đầy đủ
      logoFull.style.display = "none";
      logoIcon.style.display = "block";
    } else {
      // Mở rộng sidebar
      sideBar.classList.remove("collapsed");
      headerContent.classList.remove("expanded");

      // Hiện text
      textElements.forEach((el) => {
        el.style.display = "block";
      });

      // Hiện logo đầy đủ, ẩn logo icon
      logoFull.style.display = "block";
      logoIcon.style.display = "none";
    }
  });

  //render Lượt thích recipe
  let foodLikes = 0;
  const loginAccountData = JSON.parse(localStorage.getItem("loginAccountData"));
  let username = loginAccountData.username;
  const recipesData = JSON.parse(localStorage.getItem("recipesData"));
  recipesData.forEach((recipe) => {
    if (recipe.author === username) {
      foodLikes += recipe.likes;
    }
  });
  document.getElementById("valueFavorite").textContent = `${foodLikes}`;

  //render tên đăng nhập trên góc
  document.querySelector(".firstHeader .username").textContent = `${username}`;

  // chưa có dữ liệu recipe thì popUp
  if (!recipesData || recipesData.length === 0) {
    Swal.fire({
      title: "Chưa có công thức trong Data",
      text: "Thêm công thức riêng của bạn ngay!",
      icon: "question",
    });
  }
});

//Đăng xuất tài khoản
document
  .querySelector(".sideBar .signOut")
  .addEventListener("click", function () {
    localStorage.removeItem("loginAccountData");
    window.location.href = "signIn.html";
  });

// chuyển hướng sang trang addRecipe
document.getElementById("addRecipe").addEventListener("click", function () {
  window.location.href = "addRecipe.html";
});

// hàm render recipe
let currentPage = 1;
function renderRecipes(recipesToRender) {
  const loginAccountData = JSON.parse(localStorage.getItem("loginAccountData"));
  const recipeList = document.querySelector(".contentContainer .recipesList");
  const paginationContainer = document.getElementById("pagination");
  const recipesPerPage = 6;
  const totalPages = Math.ceil(recipesToRender.length / recipesPerPage);

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = Math.min(
    startIndex + recipesPerPage,
    recipesToRender.length
  );
  const currentPageRecipes = recipesToRender.slice(startIndex, endIndex);

  // Xóa nội dung cũ trước khi render
  recipeList.innerHTML = "";

  currentPageRecipes.forEach((recipe) => {
    const categoryName = recipe.category
      .map((cat) => `<span>${cat.name}</span>`)
      .join(", ");

    // lọc những công thức mình đã thích
    let checkFavoriteRecipe = false;
    const favoriteRecipeData = JSON.parse(
      localStorage.getItem("favoriteRecipeData")
    );
    let listRecipeFavorite = [];
    let favoriteRecipeAccount = favoriteRecipeData.find(
      (e) => e.accountId === loginAccountData.id
    );
    listRecipeFavorite.push(...favoriteRecipeAccount.idRecipeFavorite);
    if (listRecipeFavorite.some((e) => e === recipe.id)) {
      checkFavoriteRecipe = true;
    } else {
      checkFavoriteRecipe = false;
    }

    // Tính giá trị dinh dưỡng
    const foodData = JSON.parse(localStorage.getItem("foodData"));
    let totalQuantity = 0;
    let totalEnergy = 0;
    let totalFat = 0;
    let totalCarbohydrate = 0;
    let totalProtein = 0;

    recipe.ingredients.forEach((ingredientId) => {
      const food = foodData.find((e) => e.id === ingredientId);
      if (food) {
        const quantity = +food.quantity || 0;
        totalQuantity += quantity;

        totalEnergy += ((food.macronutrients.energy || 0) * quantity) / 100;
        totalFat += ((food.macronutrients.fat || 0) * quantity) / 100;
        totalCarbohydrate +=
          ((food.macronutrients.carbohydrate || 0) * quantity) / 100;
        totalProtein += ((food.macronutrients.protein || 0) * quantity) / 100;
      }
    });

    // Quy đổi về 100g món ăn
    const energyPer100g = totalQuantity
      ? ((totalEnergy / totalQuantity) * 100).toFixed(0)
      : 0;
    const fatPer100g = totalQuantity
      ? ((totalFat / totalQuantity) * 100).toFixed(0)
      : 0;
    const carbohydratePer100g = totalQuantity
      ? ((totalCarbohydrate / totalQuantity) * 100).toFixed(0)
      : 0;
    const proteinPer100g = totalQuantity
      ? ((totalProtein / totalQuantity) * 100).toFixed(0)
      : 0;

    if (recipe.author === loginAccountData.username) {
      recipeList.innerHTML += `
      <div class="recipeCard" >
        <div class="recipeTag">
          <div class="recipeTagHeader">
            <img src="../assets/recipes/iconMyRecipes.png" alt="" width="14px" height="14px" />
            <div class="myRecipe">My recipes</div>
          </div>
          <div class="recipePicture">
            <img src="${recipe.coverSrc}" alt="Recipe Picture Error">
          </div>
        </div>
        <div class="recipeContent">
          <div class="recipeTitle">
            <div class="recipeName" data-id="${recipe.id}">${recipe.name}</div>
            <div class="recipeLike" data-id="${recipe.id}">
              ${
                checkFavoriteRecipe
                  ? `<img src="../assets/home/addFavoriteRecipes.png" alt="" width="13px" />`
                  : `<img src="../assets/home/favoriteRecipes.png" alt="" width="13px" />`
              }
              <div class="numOfLike" >${recipe.likes}</div>
            </div>
          </div>
          <div class="recipeAuthor">${recipe.author}</div>
          <div class="recipeCategory">
            <img src="../assets/home/categoryIcon.png" alt="" width="12px" />
            <div class="categoryName">${categoryName}</div>
          </div>
          <div class="nutritionInfo">
            <div class="weight">
              <div>by</div>
              <div>100g</div>
            </div>
            <div class="energy recipeNutrition">
              <div>Energy</div>
              <div class="nutritionValue">${energyPer100g} kcal</div>
            </div>
            <div class="fat recipeNutrition">
              <div>Fat</div>
              <div class="nutritionValue">${fatPer100g} g</div>
            </div>
            <div class="carbohydrate recipeNutrition">
              <div>Carbohydrate</div>
              <div class="nutritionValue">${carbohydratePer100g} g</div>
            </div>
            <div class="protein recipeNutrition">
              <div>Protein</div>
              <div class="nutritionValue">${proteinPer100g} g</div>
            </div>
          </div>
        </div>
      </div>
    `;
    } else {
      recipeList.innerHTML += `
      <div class="recipeCard" data-id="${recipe.id}">
      <div class="recipeTag">
        <div class="recipeTagHeader">
          <img src="../assets/home/communityRecipes.png" alt="" width="14px" height="14px" />
          <div class="communityRecipe">Community Recipes</div>
        </div>
        <div class="recipePicture">
          <img src="${recipe.coverSrc}" alt="Recipe Picture Error">
        </div>
      </div>
      <div class="recipeContent">
        <div class="recipeTitle">
          <div class="recipeName" data-id="${recipe.id}">${recipe.name}</div>
          <div class="recipeLike" data-id="${recipe.id}">
            ${
              checkFavoriteRecipe
                ? `<img src="../assets/home/addFavoriteRecipes.png" alt="" width="13px" />`
                : `<img src="../assets/home/favoriteRecipes.png" alt="" width="13px" />`
            }
            <div class="numOfLike" >${recipe.likes}</div>
          </div>
        </div>
        <div class="recipeAuthor">${recipe.author}</div>
        <div class="recipeCategory">
          <img src="../assets/home/categoryIcon.png" alt="" width="12px" />
          <div class="categoryName">${categoryName}</div>
        </div>
        <div class="nutritionInfo">
          <div class="weight">
            <div>by</div>
            <div>100g</div>
          </div>
          <div class="energy recipeNutrition">
            <div>Energy</div>
            <div class="nutritionValue">${energyPer100g} kcal</div>
          </div>
          <div class="fat recipeNutrition">
            <div>Fat</div>
            <div class="nutritionValue">${fatPer100g} g</div>
          </div>
          <div class="carbohydrate recipeNutrition">
            <div>Carbohydrate</div>
            <div class="nutritionValue">${carbohydratePer100g} g</div>
          </div>
          <div class="protein recipeNutrition">
            <div>Protein</div>
            <div class="nutritionValue">${proteinPer100g} g</div>
          </div>
        </div>
      </div>
    </div>
      `;
    }
  });

  // Render phân trang
  paginationContainer.innerHTML = "";
  paginationContainer.innerHTML += `<div class="backPage"><img src="../assets/home/backPage.png" alt="" height="13px" /></div>`;
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += `
      <div class="page-item${
        i === currentPage ? " active" : ""
      }" data-page="${i}">${i}</div>
    `;
  }
  paginationContainer.innerHTML += `<div class="nextPage"><img src="../assets/home/nextPage.png" alt="" height="13px" /></div>`;

  // Gắn sự kiện phân trang
  document
    .querySelector("#pagination .backPage")
    .addEventListener("click", function () {
      if (currentPage > 1) {
        currentPage--;
        renderRecipes(recipesToRender);
      }
    });

  document
    .querySelector("#pagination .nextPage")
    .addEventListener("click", function () {
      if (currentPage < totalPages) {
        currentPage++;
        renderRecipes(recipesToRender);
      }
    });

  document.querySelectorAll(".page-item").forEach((item) => {
    item.addEventListener("click", function () {
      currentPage = parseInt(this.getAttribute("data-page"));
      renderRecipes(recipesToRender);
    });
  });

  // Gắn sự kiện cho từng recipe card
  document.querySelectorAll(".recipeCard .recipeName").forEach((card) => {
    card.addEventListener("click", function () {
      const recipeId = card.getAttribute("data-id");
      localStorage.setItem("currentRecipeId", recipeId);
      window.location.href = "recipeDetail.html";
    });
  });

  // gắn sự kiện cho từng nút thích
  document.querySelectorAll(".recipeCard .recipeLike").forEach((like) => {
    like.addEventListener("click", function () {
      // Lấy dữ liệu
      const recipeId = +like.getAttribute("data-id");
      const loginAccountData = JSON.parse(
        localStorage.getItem("loginAccountData")
      );
      let favoriteRecipeData = JSON.parse(
        localStorage.getItem("favoriteRecipeData")
      );
      let recipesData = JSON.parse(localStorage.getItem("recipesData"));

      // Xử lý dữ liệu
      const recipe = recipesData.find((e) => e.id === recipeId);

      // Kiểm tra tác giả của công thức
      // if (recipe.author === loginAccountData.username) {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Oops...",
      //     text: "Không thể yêu thích công thức của bạn",
      //   });
      //   return;
      // }

      // Tìm danh sách yêu thích của người dùng
      let favoriteRecipeAccount = favoriteRecipeData.find(
        (e) => e.accountId === loginAccountData.id
      );

      if (favoriteRecipeAccount.idRecipeFavorite.includes(recipeId)) {
        // Hủy yêu thích
        favoriteRecipeAccount.idRecipeFavorite =
          favoriteRecipeAccount.idRecipeFavorite.filter(
            (id) => id !== recipeId
          );
        recipe.likes--;

        // Cập nhật giao diện nút thích
        like.querySelector("img").src = "../assets/home/favoriteRecipes.png";
      } else {
        // Thêm yêu thích
        favoriteRecipeAccount.idRecipeFavorite.push(recipeId);
        recipe.likes++;

        // Cập nhật giao diện nút thích
        like.querySelector("img").src = "../assets/home/addFavoriteRecipes.png";
      }

      // Lưu dữ liệu vào localStorage
      localStorage.setItem("recipesData", JSON.stringify(recipesData));
      localStorage.setItem(
        "favoriteRecipeData",
        JSON.stringify(favoriteRecipeData)
      );

      // Cập nhật số lượt thích hiển thị
      like.querySelector(".numOfLike").textContent = recipe.likes;
      // Cập nhật số lượt thích trên trang
      let foodLikes = 0;
      recipesData.forEach((recipe) => {
        if (recipe.author === loginAccountData.username) {
          foodLikes += recipe.likes;
        }
      });
      document.getElementById("valueFavorite").textContent = `${foodLikes}`;
    });
  });
}

// hàm in tất cả recipe
function renderAllRecipes() {
  const recipesData = JSON.parse(localStorage.getItem("recipesData"));
  renderRecipes(recipesData);
}

renderAllRecipes();

// render tìm kiếm
//render lựa chọn category
document.addEventListener("DOMContentLoaded", function () {
  let categoriesRecipeData = JSON.parse(
    localStorage.getItem("categoriesRecipeData")
  );
  let searchCategory = document.getElementById("searchCategory");
  searchCategory.innerHTML = "";
  searchCategory.innerHTML = `<option value="" selected>Category</option>`;
  categoriesRecipeData.forEach((e) => {
    searchCategory.innerHTML += `
    <option value="${e.name}">${e.name}</option>
    `;
  });
});

// render lựa chọn nutrient
document.addEventListener("DOMContentLoaded", function () {
  const nutrients = ["Energy", "Fat", "Carbohydrate", "Protein"];
  let inputNutrient = document.getElementById("searchNutrient");
  inputNutrient.innerHTML = "";
  inputNutrient.innerHTML += `<option value="" selected>Sort by nutrient</option>`;
  nutrients.forEach((e) => {
    inputNutrient.innerHTML += `<option value="${e.toLowerCase()}">${e}</option>`;
  });
});

// hàm tìm kiếm category và tên
const recipesData = JSON.parse(localStorage.getItem("recipesData"));
let filteredRecipes = recipesData;
function searchNameCategory() {
  currentPage = 1;
  const searchRecipe = document
    .getElementById("searchRecipe")
    .value.trim()
    .toLowerCase();
  const searchCategory = document.getElementById("searchCategory").value;

  // lọc dữ liệu
  filteredRecipes = recipesData.filter((recipe) => {
    const matchesName = recipe.name.toLowerCase().includes(searchRecipe);
    const matchesCategory =
      searchCategory === "" ||
      recipe.category.some((cat) => cat.name === searchCategory);

    return matchesName && matchesCategory;
  });

  renderRecipes(filteredRecipes);
}
document
  .getElementById("searchRecipe")
  .addEventListener("input", searchNameCategory);
document
  .getElementById("searchCategory")
  .addEventListener("change", searchNameCategory);

// Sắp xếp nutrient
let sortDirection = "desc";
// thêm chức năng sắp xếp theo dinh dưỡng
document
  .getElementById("sortNutrientBtn")
  .addEventListener("click", function () {
    const nutrientSelect = document.getElementById("searchNutrient");
    const selectedNutrient = nutrientSelect.value;

    if (!selectedNutrient) {
      return;
    }

    // Sắp xếp dữ liệu theo giá trị dinh dưỡng
    const foodData = JSON.parse(localStorage.getItem("foodData"));

    filteredRecipes.sort((a, b) => {
      // Tính toán giá trị dinh dưỡng cho công thức a
      let totalQuantityA = 0,
        totalNutrientA = 0;
      a.ingredients.forEach((ingredientId) => {
        const food = foodData.find((e) => e.id === ingredientId);
        if (food) {
          const quantity = +food.quantity || 0;
          totalQuantityA += quantity;

          if (selectedNutrient === "energy") {
            totalNutrientA +=
              ((food.macronutrients.energy || 0) * quantity) / 100;
          } else if (selectedNutrient === "fat") {
            totalNutrientA += ((food.macronutrients.fat || 0) * quantity) / 100;
          } else if (selectedNutrient === "carbohydrate") {
            totalNutrientA +=
              ((food.macronutrients.carbohydrate || 0) * quantity) / 100;
          } else if (selectedNutrient === "protein") {
            totalNutrientA +=
              ((food.macronutrients.protein || 0) * quantity) / 100;
          }
        }
      });

      // Tính toán giá trị dinh dưỡng cho công thức b
      let totalQuantityB = 0,
        totalNutrientB = 0;
      b.ingredients.forEach((ingredientId) => {
        const food = foodData.find((e) => e.id === ingredientId);
        if (food) {
          const quantity = +food.quantity || 0;
          totalQuantityB += quantity;

          if (selectedNutrient === "energy") {
            totalNutrientB +=
              ((food.macronutrients.energy || 0) * quantity) / 100;
          } else if (selectedNutrient === "fat") {
            totalNutrientB += ((food.macronutrients.fat || 0) * quantity) / 100;
          } else if (selectedNutrient === "carbohydrate") {
            totalNutrientB +=
              ((food.macronutrients.carbohydrate || 0) * quantity) / 100;
          } else if (selectedNutrient === "protein") {
            totalNutrientB +=
              ((food.macronutrients.protein || 0) * quantity) / 100;
          }
        }
      });

      // Quy đổi về giá trị dinh dưỡng trên 100g
      const valueA = totalQuantityA
        ? (totalNutrientA / totalQuantityA) * 100
        : 0;
      const valueB = totalQuantityB
        ? (totalNutrientB / totalQuantityB) * 100
        : 0;

      // Sắp xếp theo hướng được chọn
      return sortDirection === "desc" ? valueB - valueA : valueA - valueB;
    });

    sortDirection = sortDirection === "asc" ? "desc" : "asc";

    // Reset trang về 1 và render lại danh sách
    currentPage = 1;
    renderRecipes(filteredRecipes);
  });

// hiển thị món ăn của mình
document
  .getElementById("checkMyRecipes")
  .addEventListener("change", function () {
    currentPage = 1;
    const recipesData = JSON.parse(localStorage.getItem("recipesData"));
    const loginAccountData = JSON.parse(
      localStorage.getItem("loginAccountData")
    );

    if (this.checked) {
      // Nếu checkbox được chọn, chỉ hiển thị công thức của người dùng
      filteredRecipes = recipesData.filter(
        (recipe) => recipe.author === loginAccountData.username
      );
      if (filteredRecipes.length === 0) {
        Swal.fire({
          title: "Chưa có công thức?",
          text: "Thêm công thức riêng của bạn ngay!",
          icon: "question",
        });
        setTimeout(function () {
          window.location.href = "addRecipe.html";
        }, 1500);
      }
    } else {
      searchNameCategory();
      return;
    }

    renderRecipes(filteredRecipes);
  });
