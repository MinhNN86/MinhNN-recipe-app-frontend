// sidebar
document.addEventListener("DOMContentLoaded", function () {
  const btnCloseSidebar = document.querySelector(".btnCloseSidebar");
  const sideBar = document.querySelector(".sideBar");
  const headerContent = document.querySelector(".header-content");
  const textElements = document.querySelectorAll(".textPage, .textSignOut");
  const logoFull = document.querySelector(".logo-full");
  const logoIcon = document.querySelector(".logo-icon");

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
    } else {
      // Mở rộng sidebar
      sideBar.classList.remove("collapsed");
      headerContent.classList.remove("expanded");

      // Hiện text
      textElements.forEach((el) => {
        el.style.display = "block";
      });
    }
  });
  //Load username
  const loginAccountData = JSON.parse(localStorage.getItem("loginAccountData"));
  document.querySelector(
      ".firstHeader .username"
  ).textContent = `${loginAccountData.username}`;

  //render lựa chọn nutrient
  const nutrients = ["Energy", "Fat", "Carbohydrate", "Protein"];
  let inputNutrient = document.getElementById("searchNutrient");
  inputNutrient.innerHTML = "";
  inputNutrient.innerHTML = `<option value="" selected>Sort by nutrient</option>`;
  nutrients.forEach((e) => {
    inputNutrient.innerHTML += `<option value="${e.toLowerCase()}">${e}</option>`;
  });

  // nếu không yêu thích món ăn nào thì thông báo
  const favoriteRecipeData = JSON.parse(
      localStorage.getItem("favoriteRecipeData")
  );
  let favoriteRecipe = favoriteRecipeData.find(
      (recipe) => recipe.accountId === loginAccountData.id
  );
  if (favoriteRecipe.idRecipeFavorite.length === 0) {
    Swal.fire({
      title: "Chưa có công thức yêu thích",
      text: "Vào phần Recipes để thêm nhé!",
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

// lấy dữ liệu
const favoriteRecipeData =
    JSON.parse(localStorage.getItem("favoriteRecipeData")) || [];
const recipeData = JSON.parse(localStorage.getItem("recipesData")) || [];
const loginAccountData = JSON.parse(localStorage.getItem("loginAccountData"));
let idAccountLogin = loginAccountData.id;
let currentPage = 1;

// Hàm in
function renderRecipes(recipesToRender) {
  // Lấy container hiển thị danh sách món ăn
  const recipesList = document.querySelector(".contentContainer .recipesList");
  const paginationContainer = document.getElementById("pagination");
  const recipesPerPage = 6;
  const totalPages = Math.ceil(recipesToRender.length / recipesPerPage);

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  // phạm vi công thức hiển thị
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = Math.min(
      startIndex + recipesPerPage,
      recipesToRender.length
  );
  const currentPageRecipes = recipesToRender.slice(startIndex, endIndex);

  recipesList.innerHTML = "";
  // Duyệt qua từng món ăn và tạo HTML
  currentPageRecipes.forEach((recipe) => {
    // Tạo chuỗi các category
    const categoryName = recipe.category
        .map((cat) => `<span>${cat.name}</span>`)
        .join(", ");

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

    recipesList.innerHTML += `
      <div class="recipeCard" data-id="${recipe.id}">
        <div class="recipeTag">
        <div class="recipeTagHeader">
          ${
        recipe.author === loginAccountData.username
            ? `<img src="../assets/recipes/iconMyRecipes.png" alt="" width="14px" height="14px" />
              <div class="myRecipe">My recipes</div>`
            : `<img src="../assets/home/communityRecipes.png" alt="" width="14px" height="14px" />
              <div class="communityRecipe">Community Recipes</div>`
    }
        </div>
        <div class="recipePicture">
          <img src="${recipe.coverSrc}" alt="Recipe Picture Error">
        </div>
      </div>
      <div class="recipeContent">
        <div class="recipeTitle">
          <div class="recipeName">${recipe.name}</div>
          <div class="recipeLike">
            <img src="../assets/home/addFavoriteRecipes.png" alt="" width="13px" />
            <div class="numOfLike">${recipe.likes}</div>
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
  });

  // render phân trang
  paginationContainer.innerHTML = "";
  paginationContainer.innerHTML += `<div class="backPage"><img src="../assets/home/backPage.png" alt="" height="13px" /></div>`;

  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += `
        <div class="page-item ${
        i === currentPage ? "active" : ""
    }" data-page="${i}">
          ${i}
        </div>
      `;
  }

  paginationContainer.innerHTML += `<div class="nextPage"><img src="../assets/home/nextPage.png" alt="" height="13px" /></div>`;

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

  document.querySelectorAll(".recipeCard").forEach((card) => {
    card.addEventListener("click", function () {
      const recipeId = card.getAttribute("data-id");
      localStorage.setItem("currentRecipeId", recipeId);
      window.location.href = "recipeDetail.html";
    });
  });
}

// Hàm in ra tất cả món ăn đã thích
function renderFavoriteRecipe() {
  // Lọc ra favorite của tài khoản đang đăng nhập
  const favoriteRecipe = favoriteRecipeData.find(
      (e) => e.accountId === idAccountLogin
  );
  if (!favoriteRecipe || !favoriteRecipe.idRecipeFavorite) {
    return;
  }
  // Lấy danh sách các món ăn từ id trong favorite
  const recipesToRender = favoriteRecipe.idRecipeFavorite.map((recipeId) => {
    return recipeData.find((recipe) => recipe.id === recipeId);
  });

  // Gọi hàm render chung
  renderRecipes(recipesToRender);
  return recipesToRender;
}

renderFavoriteRecipe();

// hàm tím kiếm category và tên
let filteredRecipes = renderFavoriteRecipe();
function searchNameCategory() {
  currentPage = 1;
  const searchRecipe = document
      .getElementById("searchRecipe")
      .value.trim()
      .toLowerCase();
  const searchCategory = document.getElementById("searchCategory").value;

  // lọc dữ liệu
  filteredRecipes = renderFavoriteRecipe().filter((recipe) => {
    const matchesName =
        searchRecipe === "" || recipe.name.toLowerCase().includes(searchRecipe);
    const matchesCategory =
        searchCategory === "" ||
        recipe.category.some((cat) => cat.name === searchCategory);

    return matchesName && matchesCategory;
  });

  renderRecipes(filteredRecipes);
}

// Gắn sự kiện tìm kiếm
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

// testData
// let recipesData = [
//   {
//     id: 1,
//     coverSrc:
//       "https://images.immediate.co.uk/production/volatile/sites/2/2017/09/OLI1017-TumericCauliflowerSalad_014532.jpg?quality=90&resize=556,505",
//     name: "Turmeric Roasted Cauliflower Salad (lowfodmap)",
//     description:
//       "Our roasted cauliflower salad with turmeric is low in calories and packed with punchy flavor.",
//     author: "Joana Jardim",
//     totalTime: "00:40",
//     preparationTime: "00:40",
//     finalWeight: "978.8 grams",
//     portions: 4,
//     likes: 134,
//     ingredients: [1, 2, 3], // 3 ingredients
//     cookingMethods:
//       "STEP 1 Heat the oven to 200C/fan 180C/gas 6. Put the cauliflower in an ovenproof dish or tin.",
//     category: [
//       { id: 1, name: "vegetarian" },
//       { id: 2, name: "appetizer" },
//     ],
//   },
//   {
//     id: 2,
//     coverSrc:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Ne9niCIuEcfJsCduQ08v4cm1BVSIdc3Gbw&s",
//     name: "Grilled Chicken with Lemon and Herbs",
//     description:
//       "Juicy grilled chicken breasts marinated in a lemon and herb sauce.",
//     author: "Carlos Mendes",
//     totalTime: "00:30",
//     preparationTime: "00:15",
//     finalWeight: "850 grams",
//     portions: 3,
//     likes: 198,
//     ingredients: [4, 5, 6, 1], // 4 ingredients
//     cookingMethods:
//       "STEP 1 Mix lemon juice, olive oil, and herbs. Marinate chicken for 15 minutes then grill until cooked.",
//     category: [
//       { id: 3, name: "grilled" },
//       { id: 4, name: "main course" },
//     ],
//   },
//   {
//     id: 3,
//     coverSrc:
//       "https://www.healthyfood.com/wp-content/uploads/2019/07/Creamy-pumpkin-soup.jpg",
//     name: "Creamy Pumpkin Soup",
//     description:
//       "A comforting and creamy soup made with roasted pumpkin and a touch of cream.",
//     author: "Lena Hart",
//     totalTime: "00:50",
//     preparationTime: "00:20",
//     finalWeight: "1100 grams",
//     portions: 4,
//     likes: 165,
//     ingredients: [2, 3, 7], // 3 ingredients
//     cookingMethods:
//       "STEP 1 Roast the pumpkin at 180C until soft. Blend with cream and season to taste.",
//     category: [
//       { id: 5, name: "soup" },
//       { id: 6, name: "vegetarian" },
//     ],
//   },
//   {
//     id: 4,
//     coverSrc: "https://cdn.tgdd.vn/2021/01/CookProduct/1200-1200x676-16.jpg",
//     name: "Spaghetti Aglio e Olio",
//     description: "Simple and classic Italian pasta with garlic and olive oil.",
//     author: "Marco Rossi",
//     totalTime: "00:20",
//     preparationTime: "00:10",
//     finalWeight: "600 grams",
//     portions: 2,
//     likes: 243,
//     ingredients: [1, 4, 5], // 3 ingredients
//     cookingMethods:
//       "STEP 1 Cook spaghetti. Sauté garlic in olive oil and toss with pasta.",
//     category: [
//       { id: 7, name: "pasta" },
//       { id: 1, name: "vegetarian" },
//     ],
//   },
//   {
//     id: 5,
//     coverSrc:
//       "https://www.eatingwell.com/thmb/PqRN1f14fA3zdvpFMGi7I19FCPU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/hearty-chickpea-spinach-stew-270568-1x1-b27d319be4504a39ba4d4184d1a3b2cb.jpg",
//     name: "Chickpea & Spinach Stew",
//     description:
//       "A hearty and healthy stew made with chickpeas, spinach, and warm spices.",
//     author: "Ayesha Noor",
//     totalTime: "00:45",
//     preparationTime: "00:20",
//     finalWeight: "900 grams",
//     portions: 3,
//     likes: 120,
//     ingredients: [6, 7, 2, 3], // 4 ingredients
//     cookingMethods:
//       "STEP 1 Sauté onions and garlic, add chickpeas and spinach, and simmer until flavors blend.",
//     category: [
//       { id: 8, name: "stew" },
//       { id: 1, name: "vegetarian" },
//     ],
//   },
//   {
//     id: 6,
//     coverSrc:
//       "https://www.funfoodfrolic.com/wp-content/uploads/2020/03/Tofu-Stir-Fry-Thumbnail.jpg",
//     name: "Tofu Stir-Fry with Veggies",
//     description:
//       "Colorful stir-fried vegetables tossed with crispy tofu in a savory sauce.",
//     author: "Minh Tran",
//     totalTime: "00:25",
//     preparationTime: "00:15",
//     finalWeight: "750 grams",
//     portions: 2,
//     likes: 177,
//     ingredients: [4, 1, 5], // 3 ingredients
//     cookingMethods:
//       "STEP 1 Fry tofu until golden. Add vegetables and stir-fry with sauce for 5 minutes.",
//     category: [
//       { id: 9, name: "stir-fry" },
//       { id: 1, name: "vegetarian" },
//     ],
//   },
//   {
//     id: 7,
//     coverSrc:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG4tEU7GPCnCsR5c-zvqeMJPqHIFmVilASSw&s",
//     name: "Baked Salmon with Dill",
//     description: "Tender salmon fillet baked with lemon slices and fresh dill.",
//     author: "Elena Petrova",
//     totalTime: "00:35",
//     preparationTime: "00:10",
//     finalWeight: "500 grams",
//     portions: 2,
//     likes: 210,
//     ingredients: [6, 2, 3], // 3 ingredients
//     cookingMethods:
//       "STEP 1 Preheat oven. Place salmon in foil with lemon and dill. Bake for 20 minutes.",
//     category: [
//       { id: 10, name: "seafood" },
//       { id: 4, name: "main course" },
//     ],
//   },
//   {
//     id: 8,
//     coverSrc:
//       "https://nomoneynotime.com.au/uploads/recipes/shutterstock_1926492050-1.jpg",
//     name: "Avocado Toast with Poached Egg",
//     description:
//       "A nourishing breakfast of wholegrain toast topped with smashed avocado and a poached egg.",
//     author: "Sarah Kim",
//     totalTime: "00:15",
//     preparationTime: "00:10",
//     finalWeight: "300 grams",
//     portions: 1,
//     likes: 156,
//     ingredients: [7, 1, 4], // 3 ingredients
//     cookingMethods:
//       "STEP 1 Toast bread, mash avocado, and top with a poached egg.",
//     category: [
//       { id: 11, name: "breakfast" },
//       { id: 1, name: "vegetarian" },
//     ],
//   },
//   {
//     id: 9,
//     coverSrc:
//       "https://embed.widencdn.net/img/beef/t9bwp7fitq/exact/Stuffed%20Peppers%20-%20NCBA%20Beef%20Aug%20202431717.jpg?keep=c&u=7fueml",
//     name: "Stuffed Bell Peppers",
//     description:
//       "Bell peppers filled with a tasty mix of rice, beans, and herbs.",
//     author: "James Lee",
//     totalTime: "01:00",
//     preparationTime: "00:25",
//     finalWeight: "1000 grams",
//     portions: 4,
//     likes: 188,
//     ingredients: [5, 6, 2, 3], // 4 ingredients
//     cookingMethods:
//       "STEP 1 Hollow bell peppers, fill with mix, and bake at 180C for 30-35 minutes.",
//     category: [
//       { id: 12, name: "baked" },
//       { id: 1, name: "vegetarian" },
//     ],
//   },
//   {
//     id: 10,
//     coverSrc:
//       "https://www.aforkstale.com/wp-content/uploads/mediterranean-quinoa-salad-with-feta.-4.jpg",
//     name: "Quinoa Salad with Feta and Olives",
//     description:
//       "A Mediterranean-inspired quinoa salad with feta cheese and olives.",
//     author: "Maria Papadopoulos",
//     totalTime: "00:25",
//     preparationTime: "00:20",
//     finalWeight: "680 grams",
//     portions: 3,
//     likes: 142,
//     ingredients: [4, 7, 1], // 3 ingredients
//     cookingMethods:
//       "STEP 1 Cook quinoa, let cool, and mix with feta, olives, and dressing.",
//     category: [
//       { id: 13, name: "salad" },
//       { id: 1, name: "vegetarian" },
//     ],
//   },
// ];

// localStorage.setItem("recipesData", JSON.stringify(recipesData));

// const categoriesRecipeData = [
//   {
//     id: 1,
//     name: "vegetarian",
//     description:
//       "Dishes that do not include meat, fish, or poultry, suitable for individuals who follow a vegetarian diet. These meals often incorporate vegetables, fruits, grains, legumes, nuts, and dairy products.",
//   },
//   {
//     id: 2,
//     name: "appetizer",
//     description:
//       "Small dishes served before the main course to stimulate the appetite.",
//   },
//   {
//     id: 3,
//     name: "vegan",
//     description:
//       "Plant-based recipes with no animal products, including dairy and eggs.",
//   },
//   {
//     id: 4,
//     name: "main course",
//     description: "The main dish in a meal, often more substantial and filling.",
//   },
//   {
//     id: 5,
//     name: "dessert",
//     description: "Sweet dishes typically served at the end of a meal.",
//   },
//   {
//     id: 6,
//     name: "low-carb",
//     description:
//       "Recipes with reduced carbohydrate content, often for weight or sugar control.",
//   },
//   {
//     id: 7,
//     name: "gluten-free",
//     description:
//       "Meals made without gluten, suitable for those with gluten intolerance.",
//   },
//   {
//     id: 8,
//     name: "breakfast",
//     description: "Recipes designed for the first meal of the day.",
//   },
//   {
//     id: 9,
//     name: "salad",
//     description:
//       "Cold or warm dishes primarily composed of vegetables, fruits, and other fresh ingredients.",
//   },
//   {
//     id: 10,
//     name: "soup",
//     description:
//       "Liquid-based dishes, either hot or cold, made with a variety of ingredients.",
//   },
// ];
// localStorage.setItem(
//   "categoriesRecipeData",
//   JSON.stringify(categoriesRecipeData)
// );
