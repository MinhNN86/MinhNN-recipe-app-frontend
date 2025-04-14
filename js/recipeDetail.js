// sideBar
document.addEventListener("DOMContentLoaded", function () {
  // Xử lý sidebar
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
  //Load username
  const loginAccountData = JSON.parse(localStorage.getItem("loginAccountData"));
  document.querySelector(
      ".firstHeader .username"
  ).textContent = `${loginAccountData.username}`;
});

//Đăng xuất tài khoản
document
    .querySelector(".sideBar .signOut")
    .addEventListener("click", function () {
      localStorage.removeItem("loginAccountData");
      window.location.href = "signIn.html";
    });

// lấy dữ liệu
let loginAccountData = JSON.parse(localStorage.getItem("loginAccountData"));
const currentRecipeId = JSON.parse(localStorage.getItem("currentRecipeId"));
const recipesData = JSON.parse(localStorage.getItem("recipesData"));
let renderRecipesData = recipesData.find(
    (recipe) => recipe.id === currentRecipeId
);

displayRecipeDetails(renderRecipesData);

// hiển thị dữ liệu
function displayRecipeDetails(recipe) {
  const foodData = JSON.parse(localStorage.getItem("foodData")) || [];
  const loginAccountData = JSON.parse(localStorage.getItem("loginAccountData"));
  // chỉnh sửa được nếu là dữ liệu của mình
  if (recipe.author === loginAccountData.username) {
    document.querySelector(".communityRecipes").innerHTML = `
      <img
        src="../assets/recipes/iconMyRecipes.png"
        alt=""
        height="14px"
      />
      <div class="myRecipes">My recipes</div>
    `;
  }

  //kiểm tra có phải recipe mình thích chưa
  const favoriteRecipeData = JSON.parse(
      localStorage.getItem("favoriteRecipeData")
  );
  let favoriteRecipeAccount = favoriteRecipeData.find(
      (e) => e.accountId === loginAccountData.id
  );
  if (favoriteRecipeAccount.idRecipeFavorite.includes(recipe.id)) {
    document.querySelector(".infoLeft .recipeLike").innerHTML = `
    <img
      src="../assets/home/addFavoriteRecipes.png"
      alt=""
      width="14px"
    />
    <div></div>
    `;
  } else {
    document.querySelector(".infoLeft .recipeLike").innerHTML = `
    <img
      src="../assets/home/favoriteRecipes.png"
      alt=""
      width="14px"
    />
    <div></div>
    `;
  }

  document.querySelector(".infoLeft .renderAddFavorite").innerHTML = `
    <div class="addFavorite" data-id="${recipe.id}"->
    <img
      src="../assets/home/addFavoriteRecipes.png"
      alt=""
      width="14px"
    />
    <div>Add to favorite</div>
  `;

  document.querySelector(
      ".recipeMenu .recipePicture img"
  ).src = `${recipe.coverSrc}`;
  document.querySelector(".recipeLike div").textContent = `${recipe.likes}`;
  const categoryName = recipe.category.map((e) => e.name).join(", ");
  document.querySelector(
      ".categoryRecipe span"
  ).textContent = `${categoryName}`;
  document.getElementById("inputName").value = recipe.name;
  document.querySelector(
      ".infoValue.description"
  ).textContent = `${recipe.description}`;
  document.getElementById("inputAuthor").value = recipe.author;
  document.getElementById("inputTotalTime").value = recipe.totalTime;
  document.getElementById("inputPreparationTime").value =
      recipe.preparationTime;
  document.getElementById("inputFinalWeight").value = recipe.finalWeight;
  document.getElementById("inputPortions").value = recipe.portions;

  // thêm thực phẩm
  let addIngredientValue = "";
  recipe.ingredients.forEach((ingredientId) => {
    const food = foodData.find((e) => e.id === ingredientId);
    if (!food) {
      return;
    }
    addIngredientValue += `<div>${food.name}</div>`;
  });
  document.querySelector(".ingredientValue").innerHTML = "";
  document.querySelector(".ingredientValue").innerHTML = addIngredientValue;

  document.querySelector(
      ".stepCook .stepValue"
  ).textContent = `${recipe.cookingMethods}`;

  // tính tổng dinh dưỡng món ăn
  let totalEnergy = 0;
  let totalFat = 0;
  let totalCarbohydrate = 0;
  let totalProtein = 0;
  let totalFiber = 0;
  let totalSodium = 0;
  let totalVitaminA = 0;
  let totalVitaminB6 = 0;
  let totalVitaminB12 = 0;
  let totalVitaminC = 0;
  let totalVitaminD = 0;
  let totalVitaminE = 0;
  let totalVitaminK = 0;
  let totalSugars = 0;
  let totalCalcium = 0;
  let totalIron = 0;
  let totalMagnesium = 0;
  let totalPhosphorus = 0;
  let totalPotassium = 0;
  let totalZinc = 0;
  let totalCopper = 0;
  let totalFluoride = 0;
  let totalManganese = 0;
  let totalSelenium = 0;
  let totalThiamin = 0;
  let totalRiboflavin = 0;
  let totalNiacin = 0;
  let totalPantothenicAcid = 0;
  let totalFolate = 0;
  recipe.ingredients.forEach((ingredientId) => {
    const food = foodData.find((e) => e.id === ingredientId);

    if (food) {
      // Cộng dồn các giá trị dinh dưỡng
      totalEnergy += +(food.macronutrients.energy || 0).toFixed(0);
      totalFat += +(food.macronutrients.fat || 0).toFixed(0);
      totalCarbohydrate += +(food.macronutrients.carbohydrate || 0).toFixed(0);
      totalProtein += +(food.macronutrients.protein || 0).toFixed(0);
      totalFiber += +(food.micronutrients.fiber || 0).toFixed(0);
      totalSodium += +(food.micronutrients.sodium || 0).toFixed(0);
      totalVitaminA += +(food.micronutrients.vitaminA || 0).toFixed(0);
      totalVitaminB6 += +(food.micronutrients.vitaminB6 || 0).toFixed(0);
      totalVitaminB12 += +(food.micronutrients.vitaminB12 || 0).toFixed(0);
      totalVitaminC += +(food.micronutrients.vitaminC || 0).toFixed(0);
      totalVitaminD += +(food.micronutrients.vitaminD || 0).toFixed(0);
      totalVitaminE += +(food.micronutrients.vitaminE || 0).toFixed(0);
      totalVitaminK += +(food.micronutrients.vitaminK || 0).toFixed(0);
      totalSugars += +(food.micronutrients.sugars || 0).toFixed(0);
      totalCalcium += +(food.micronutrients.calcium || 0).toFixed(0);
      totalIron += +(food.micronutrients.iron || 0).toFixed(0);
      totalMagnesium += +(food.micronutrients.magnesium || 0).toFixed(0);
      totalPhosphorus += +(food.micronutrients.phosphorus || 0).toFixed(0);
      totalPotassium += +(food.micronutrients.potassium || 0).toFixed(0);
      totalZinc += +(food.micronutrients.zinc || 0).toFixed(0);
      totalCopper += +(food.micronutrients.copper || 0).toFixed(0);
      totalFluoride += +(food.micronutrients.fluoride || 0).toFixed(0);
      totalManganese += +(food.micronutrients.manganese || 0).toFixed(0);
      totalSelenium += +(food.micronutrients.selenium || 0).toFixed(0);
      totalThiamin += +(food.micronutrients.thiamin || 0).toFixed(0);
      totalRiboflavin += +(food.micronutrients.riboflavin || 0).toFixed(0);
      totalNiacin += +(food.micronutrients.niacin || 0).toFixed(0);
      totalPantothenicAcid += +(
          food.micronutrients.pantothenicAcid || 0
      ).toFixed(0);
      totalFolate += +(food.micronutrients.folateTotal || 0).toFixed(0);
    }
  });
  document.querySelector(".kcalValue").textContent = `${totalEnergy}`;
  //Fat
  if (totalFat === 0) {
    document.getElementById("fatCircle").innerHTML = `
      <div class="circle zeroValue">
        <div class="circleValue">0<span>g</span></div>
      </div>
      <p>Fat</p>
    `;
  } else {
    document.getElementById("fatCircle").innerHTML = `
      <div class="circle red">
        <div class="circleValue">${totalFat}<span>g</span></div>
      </div>
      <p>Fat</p>
    `;
  }
  //Carbohydrate
  if (totalCarbohydrate === 0) {
    document.getElementById("carbohydrateCircle").innerHTML = `
    <div class="circle zeroValue">
      <div class="circleValue">0<span>g</span></div>
    </div>
    <p>Carbohydrate</p>
    `;
  } else {
    document.getElementById("carbohydrateCircle").innerHTML = `
    <div class="circle orange">
      <div class="circleValue">${totalCarbohydrate}<span>g</span></div>
    </div>
    <p>Carbohydrate</p>
    `;
  }
  //protein
  if (totalCarbohydrate === 0) {
    document.getElementById("proteinCircle").innerHTML = `
    <div class="circle zeroValue">
      <div class="circleValue">0<span>g</span></div>
    </div>
    <p>Protein</p>
    `;
  } else {
    document.getElementById("proteinCircle").innerHTML = `
    <div class="circle green">
      <div class="circleValue">${totalProtein}<span>g</span></div>
    </div>
    <p>Protein</p>
    `;
  }
  //Fiber
  if (totalCarbohydrate === 0) {
    document.getElementById("fiberCircle").innerHTML = `
    <div class="circle zeroValue">
      <div class="circleValue">0<span>g</span></div>
    </div>
    <p>Fiber</p>
    `;
  } else {
    document.getElementById("fiberCircle").innerHTML = `
    <div class="circle blue">
      <div class="circleValue">${totalFiber}<span>g</span></div>
    </div>
    <p>Fiber</p>
    `;
  }

  // renderPieChart
  const xValues = ["Fat", "Carbohydrate", "Protein"];
  const yValues = [totalFat, totalCarbohydrate, totalProtein];
  const barColors = ["#DB4965", "#EA9F77", "#1AB394"];

  new Chart("myChart", {
    type: "pie",
    data: {
      labels: xValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: yValues,
        },
      ],
    },
    options: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 12,
          fontColor: "#000000",
          fontSize: 12,
          padding: 15,
        },
      },
    },
  });

  // renderMacronutrientsData
  document.getElementById("macronutrientsValue").innerHTML = `
  <div class="recipeDetailsTitle">
    <h2>Macronutrients per portion</h2>
    <p>Macronutrients distribution of the recipe</p>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Sodium</span>
    <span class="nutrientValue">${totalSodium} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Vitamin A</span>
    <span class="nutrientValue">${totalVitaminA} <span>ug</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Vitamin B-6</span>
    <span class="nutrientValue">${totalVitaminB6} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Vitamin B-12</span>
    <span class="nutrientValue">${totalVitaminB12} <span>ug</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Vitamin C</span>
    <span class="nutrientValue">${totalVitaminC} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Vitamin D (D2 + D3)</span>
    <span class="nutrientValue">${totalVitaminD} <span>ug</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Vitamin E</span>
    <span class="nutrientValue">${totalVitaminE} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Vitamin K</span>
    <span class="nutrientValue">${totalVitaminK} <span>ug</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Sugars</span>
    <span class="nutrientValue">${totalSugars} <span>g</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Calcium</span>
    <span class="nutrientValue">${totalCalcium} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Iron</span>
    <span class="nutrientValue">${totalIron} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Magnesium</span>
    <span class="nutrientValue">${totalMagnesium} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Phosphorus</span>
    <span class="nutrientValue">${totalPhosphorus} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Potassium</span>
    <span class="nutrientValue">${totalPotassium} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Zinc</span>
    <span class="nutrientValue">${totalZinc} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Copper</span>
    <span class="nutrientValue">${totalCopper} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Fluoride</span>
    <span class="nutrientValue">${totalFluoride} <span>ug</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Manganese</span>
    <span class="nutrientValue">${totalManganese} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Selenium</span>
    <span class="nutrientValue">${totalSelenium} <span>ug</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Thiamin</span>
    <span class="nutrientValue">${totalThiamin} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Riboflavin</span>
    <span class="nutrientValue">${totalRiboflavin} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Niacin</span>
    <span class="nutrientValue">${totalNiacin} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Pantothenic acid</span>
    <span class="nutrientValue">${totalPantothenicAcid} <span>mg</span></span>
  </div>
  <div class="nutrientItem">
    <span class="nutrientName">Folate, total</span>
    <span class="nutrientValue">${totalFolate} <span>ug</span></span>
  </div>
  `;
}

// gán sự kiện thích
document
    .querySelector(".infoLeft .renderAddFavorite")
    .addEventListener("click", function () {
      // Lấy dữ liệu
      let addFavorite = document.querySelector(
          ".infoLeft .renderAddFavorite .addFavorite"
      );
      const recipeId = +addFavorite.getAttribute("data-id");
      const loginAccountData = JSON.parse(
          localStorage.getItem("loginAccountData")
      );
      let favoriteRecipeData = JSON.parse(
          localStorage.getItem("favoriteRecipeData")
      );
      let recipesData = JSON.parse(localStorage.getItem("recipesData"));

      const recipe = recipesData.find((e) => e.id === recipeId);
      // tìm danh sách yêu thích của người dùng
      let favoriteRecipeAccount = favoriteRecipeData.find(
          (e) => e.accountId === loginAccountData.id
      );

      if (favoriteRecipeAccount.idRecipeFavorite.includes(recipeId)) {
        Swal.fire({
          title: "Thông báo",
          text: "Bạn đã yêu thích công thức này",
          icon: "info",
        });
      } else {
        favoriteRecipeAccount.idRecipeFavorite.push(recipeId);
        recipe.likes++;

        // lưu dữ liệu
        localStorage.setItem("recipesData", JSON.stringify(recipesData));
        localStorage.setItem(
            "favoriteRecipeData",
            JSON.stringify(favoriteRecipeData)
        );

        // render lại trang
        document.querySelector(".infoLeft .recipeLike img").src =
            "../assets/home/addFavoriteRecipes.png";
        document.querySelector(".recipeLike div").textContent = recipe.likes;
      }
    });
