// sidebar
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
  //Load username
  const loginAccountData = JSON.parse(localStorage.getItem("loginAccountData"));
  document.querySelector(
      ".firstHeader .username"
  ).textContent = `${loginAccountData.username}`;
});

// render Category
function renderCategory() {
  let categoriesRecipeData = JSON.parse(
      localStorage.getItem("categoriesRecipeData") || "[]"
  );
  let chooseCategory = document.getElementById("chooseCategory");
  chooseCategory.innerHTML = "";
  chooseCategory.innerHTML += `<option value="" selected>Select Category</option>`;
  categoriesRecipeData.forEach((cat) => {
    chooseCategory.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
  });
}
document.addEventListener("DOMContentLoaded", function () {
  renderCategory();
  document
      .getElementById("chooseCategory")
      .addEventListener("change", function () {
        let valueCategory = document.getElementById("chooseCategory").value;
        if (valueCategory) {
          let inputCategory = document.getElementById("inputCategory");
          if (inputCategory.value) {
            inputCategory.value += ", ";
          }
          inputCategory.value += valueCategory;
          document.getElementById("chooseCategory").value = "";
        }
      });
  // reset list food
  document.querySelector(".recipeDetail .ingredientList").innerHTML = "";
  // render Author
  const loginAccountData = JSON.parse(localStorage.getItem("loginAccountData"));
  document.getElementById("inputAuthor").value = loginAccountData.username;

  // không cho add Recipe khi chưa có food
  if (!foodData || foodData.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Danh sách thực phẩm trống",
      text: "Hãy thêm thực phẩm trong mục Food",
    });
    setTimeout(() => {
      window.location.href = "food.html";
    }, 2500);
  }
});

//Đăng xuất tài khoản
document
    .querySelector(".sideBar .signOut")
    .addEventListener("click", function () {
      localStorage.removeItem("loginAccountData");
      window.location.href = "signIn.html";
    });

const foodData = JSON.parse(localStorage.getItem("foodData") || "[]");
let currentPage = 1;
// hàm render danh sách food
function renderFood(foodToRender) {
  let foodInfo = document.querySelector(".foodInfo");
  const paginationContainer = document.getElementById("pagination");
  const foodPerPage = 5;
  const totalPages = Math.ceil(foodToRender.length / foodPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  } else if (totalPages === 0) {
    currentPage = 1;
  }

  const startIndex = (currentPage - 1) * foodPerPage;
  const endIndex = Math.min(startIndex + foodPerPage, foodToRender.length);
  const currentPageFood = foodToRender.slice(startIndex, endIndex);

  foodInfo.innerHTML = "";
  foodInfo.innerHTML += `
      <div class="foodInfoHeader">
      <div class="text">Nutritional Information</div>
          <div class="foodNutrition">
              <div>Energy</div>
              <div>Fat</div>
              <div>Carboh…</div>
              <div>Protein</div>
              <span class="last"></span>
          </div>
      </div>`;
  currentPageFood.forEach((food) => {
    foodInfo.innerHTML += `
    <div class="foodValue">
        <div class="foodValueTitle">
            <h3>${food.name}</h3> 
            <div class="foodQuantitative">
                <div class="foodQuantity">${food.quantity}</div>
                <div class="foodPortion">grams</div>
                <div class="foodWeight">${food.quantity}g</div>
            </div>
        </div>
        <div class="foodNutrition">
            <div>${food.macronutrients.energy} <span>kcal</span></div>
            <div>${food.macronutrients.fat} <span>g</span></div>
            <div>${food.macronutrients.carbohydrate} <span>g</span></div>
            <div>${food.macronutrients.protein} <span>g</span></div>
        </div>
        <div class="addFood" id="iconAddFood" data-id="${food.id}"><i class="fa-solid fa-plus"></i></div>
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
      .querySelector(".pagination .backPage")
      .addEventListener("click", function () {
        if (currentPage > 1) {
          currentPage--;
          renderFood(foodToRender);
        }
      });
  document
      .querySelector(".pagination .nextPage")
      .addEventListener("click", function () {
        if (currentPage < totalPages) {
          currentPage++;
          renderFood(foodToRender);
        }
      });
  document.querySelectorAll(".page-item").forEach((item) => {
    item.addEventListener("click", function () {
      currentPage = parseInt(this.getAttribute("data-page"));
      renderFood(foodToRender);
    });
  });

  // hiệu ứng di chuột
  document.querySelectorAll(".foodValue").forEach((card) => {
    // khi hơ chuột vào
    card.addEventListener("mouseenter", function () {
      card.classList.add("foodValueChoose");
    });
    // Khi rời chuột ra
    card.addEventListener("mouseleave", function () {
      card.classList.remove("foodValueChoose");
    });
  });

  document.querySelectorAll(".foodValue .addFood").forEach((e) => {
    e.addEventListener("click", function () {
      const foodId = parseInt(this.getAttribute("data-id"));
      inputIngredient.push(foodId);
      getInputFoodData();
      renderFoodCard(inputIngredient);
      renderNutrient(inputIngredient);
      renderFinalWeight(inputIngredient);
    });
  });
}

// thêm thực phẩm
let inputIngredient = [];
// mảng các thông tin các thực phẩm có trong công thức
let inputFood = [];
// render danh sách food
renderFood(foodData);

// render card món ăn được thêm và xóa
function renderFoodCard(inputIngredient) {
  inputFood = inputIngredient.map((id) => {
    return foodData.find((food) => food.id === id);
  });
  let ingredientList = document.querySelector(".recipeDetail .ingredientList");
  ingredientList.innerHTML = "";
  for (let i = 0; i < inputFood.length; i++) {
    ingredientList.innerHTML += `
    <div class="ingredientCard">
      <div class="ingredientValue">
        <div class="list"> ${inputFood[i].name} (${inputFood[i].quantity} g) </div>
      </div>
      <div class="removeFood" data-id="${inputFood[i].id}">
        <img
          src="../assets/addRecipe/removeFood.png"
          alt=""
          height="18px"
        />
      </div>
    </div>
    `;
  }
  //gán vào nút xóa food
  document
      .querySelectorAll(".ingredientCard .removeFood")
      .forEach((card, index) => {
        card.addEventListener("click", function () {
          inputIngredient.splice(index, 1);
          getInputFoodData();
          renderFoodCard(inputIngredient);
          renderNutrient(inputIngredient);
          renderFinalWeight(inputIngredient);
        });
      });
}

//hàm in dinh dưỡng
function renderNutrient(inputIngredient) {
  if (inputIngredient.length === 0) {
    document.querySelector(".kcalValue").textContent = "0";
    document.getElementById("fatCircle").innerHTML = `
      <div class="circle zeroValue">
        <div class="circleValue">0<span>g</span></div>
      </div>
      <p>Fat</p>
    `;
    document.getElementById("carbohydrateCircle").innerHTML = `
      <div class="circle zeroValue">
        <div class="circleValue">0<span>g</span></div>
      </div>
      <p>Carbohydrate</p>
    `;
    document.getElementById("proteinCircle").innerHTML = `
      <div class="circle zeroValue">
        <div class="circleValue">0<span>g</span></div>
      </div>
      <p>Protein</p>
    `;
    document.getElementById("fiberCircle").innerHTML = `
      <div class="circle zeroValue">
        <div class="circleValue">0<span>g</span></div>
      </div>
      <p>Fiber</p>
    `;

    const oldCanvas = document.getElementById("addRecipeChart");
    if (oldCanvas) oldCanvas.remove();

    document.getElementById("macronutrientsValue").innerHTML = `
    <div class="recipeDetailsTitle">
      <h2>Macronutrients per portion</h2>
      <p>Macronutrients distribution of the recipe</p>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Sodium</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Vitamin A</span>
      <span class="nutrientValue">0 <span>ug</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Vitamin B-6</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Vitamin B-12</span>
      <span class="nutrientValue">0 <span>ug</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Vitamin C</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Vitamin D (D2 + D3)</span>
      <span class="nutrientValue">0 <span>ug</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Vitamin E</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Vitamin K</span>
      <span class="nutrientValue">0 <span>ug</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Sugars</span>
      <span class="nutrientValue">0 <span>g</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Calcium</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Iron</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Magnesium</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Phosphorus</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Potassium</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Zinc</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Copper</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Fluoride</span>
      <span class="nutrientValue">0 <span>ug</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Manganese</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Selenium</span>
      <span class="nutrientValue">0 <span>ug</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Thiamin</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Riboflavin</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Niacin</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Pantothenic acid</span>
      <span class="nutrientValue">0 <span>mg</span></span>
    </div>
    <div class="nutrientItem">
      <span class="nutrientName">Folate, total</span>
      <span class="nutrientValue">0 <span>ug</span></span>
    </div>
    `;
    return;
  }

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

  inputIngredient.forEach((ingredientId) => {
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
  if (totalProtein === 0) {
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
  if (totalFiber === 0) {
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
  const chartWrapper = document.getElementById("addRecipeChartWrapper");

  // Xóa canvas cũ nếu có
  const oldCanvas = document.getElementById("addRecipeChart");
  if (oldCanvas) oldCanvas.remove();

  // Tạo lại canvas mới
  const newCanvas = document.createElement("canvas");
  newCanvas.id = "addRecipeChart";
  newCanvas.width = 200;
  newCanvas.height = 200;
  chartWrapper.appendChild(newCanvas);
  const xValues = ["Fat", "Carbohydrate", "Protein"];
  const yValues = [totalFat, totalCarbohydrate, totalProtein];
  const barColors = ["#DB4965", "#EA9F77", "#1AB394"];

  new Chart(newCanvas, {
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

function renderFinalWeight(inputIngredient) {
  inputFood = inputIngredient.map((id) => {
    return foodData.find((food) => food.id === id);
  });
  let inputFinalWeight = document.getElementById("inputFinalWeight");
  let finalWeight = 0;
  inputFood.forEach((food) => {
    if (food) {
      finalWeight += +food.quantity;
    }
  });
  inputFinalWeight.value = finalWeight + " grams";
}

// render lựa chọn nutrient
document.addEventListener("DOMContentLoaded", function () {
  const nutrients = ["Energy", "Fat", "Carbohydrate", "Protein"];
  let inputNutrient = document.getElementById("inputNutrient");
  inputNutrient.innerHTML = "";
  inputNutrient.innerHTML += `<option value="" selected>Sort by nutrient</option>`;
  nutrients.forEach((e) => {
    inputNutrient.innerHTML += `<option value="${e.toLowerCase()}">${e}</option>`;
  });
});

// hàm tìm kiếm
let filteredFood = foodData;
function searchNameCategory() {
  currentPage = 1;
  const searchFood = document
      .getElementById("searchFood")
      .value.trim()
      .toLowerCase();
  const searchCategory = document
      .getElementById("searchCategory")
      .value.trim()
      .toLowerCase();
  const foodData = JSON.parse(localStorage.getItem("foodData")) || [];

  //Lọc dữ liệu dựa trên cả tên và thể loại
  filteredFood = foodData.filter((food) => {
    const matchesName = food.name.toLowerCase().includes(searchFood);
    const matchesCategory =
        searchCategory === "" ||
        food.category.toLowerCase().includes(searchCategory);
    return matchesName && matchesCategory;
  });

  renderFood(filteredFood);
}

// Gắn sự kiện cho cả hai input tìm kiếm
document
    .getElementById("searchFood")
    .addEventListener("input", searchNameCategory);
document
    .getElementById("searchCategory")
    .addEventListener("input", searchNameCategory);

// Sắp xếp nutrient
let sortDirection = "desc";
// Thêm chức năng sắp xếp theo dinh dưỡng
document
    .getElementById("sortNutrientBtn")
    .addEventListener("click", function () {
      const nutrientSelect = document.getElementById("inputNutrient");
      const selectedNutrient = nutrientSelect.value;

      //Kiểm tra xem người dùng đã chọn chưa
      if (!selectedNutrient) {
        return;
      }
      filteredFood.sort((a, b) => {
        let valueA = a.macronutrients[selectedNutrient] || 0;
        let valueB = b.macronutrients[selectedNutrient] || 0;

        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);

        if (isNaN(valueA)) valueA = 0;
        if (isNaN(valueB)) valueB = 0;

        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      });

      sortDirection = sortDirection === "asc" ? "desc" : "asc";

      currentPage = 1;
      renderFood(filteredFood);
    });

// Up ảnh món ăn
let instructAddImg = false;
document.querySelector(".addImgRecipe").addEventListener("click", function () {
  if (!instructAddImg) {
    Swal.fire({
      title: "Thêm ảnh",
      text: "Dán link ảnh món ăn (nên chọn ảnh nằm ngang để hiển thị đẹp hơn)",
      icon: "question",
    });
    instructAddImg = true;
  }
  let textAddImg = document.querySelector(".addImgRecipe .textAddImg");
  let inputLinkImg = document.querySelector(".addImgRecipe .inputLinkImg");
  let imgRecipe = document.querySelector(".addImgRecipe .imgRecipe");
  imgRecipe.style.display = "none";
  textAddImg.style.display = "none";
  inputLinkImg.style.display = "block";
  document
      .getElementById("inputLinkImg")
      .addEventListener("input", function () {
        // Lấy link ảnh
        let linkImg = this.value;

        // Thêm link ảnh vào thẻ img
        let addLinkImg = document.querySelector(".addImgRecipe .imgRecipe img");
        addLinkImg.src = linkImg;
        addLinkImg.style.display = "block";

        // hiển thị ảnh
        imgRecipe.style.display = "block";
      });
});

// Hàm lấy dữ liệu trong JS
function getInputFoodData() {
  return inputIngredient;
}
// thêm món ăn vào dữ liệu
document.getElementById("pushRecipe").addEventListener("click", function () {
  inputIngredient = getInputFoodData();
  if (inputIngredient.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Bạn chưa có thực phẩm trong công thức",
    });
    return;
  }
  // lấy thông tin của món ăn và kiểm tra
  let inputName = document.getElementById("inputName").value.trim();
  let inputDescription = document
      .getElementById("inputDescription")
      .value.trim();
  let inputTotalTime = document.getElementById("inputTotalTime").value.trim();
  let inputPreparationTime = document
      .getElementById("inputPreparationTime")
      .value.trim();
  let inputFinalWeight = document.getElementById("inputFinalWeight").value;
  let inputPortions = document.getElementById("inputPortions").value.trim();
  let inputCategory = document.getElementById("inputCategory").value.trim();
  let inputLinkImg = document.getElementById("inputLinkImg").value.trim();
  let inputCookingMethod = document
      .getElementById("inputCookingMethod")
      .value.trim();
  if (
      !inputName ||
      !inputDescription ||
      !inputTotalTime ||
      !inputPreparationTime ||
      !inputPortions ||
      !inputCategory ||
      !inputCookingMethod
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Bạn chưa điều đủ thông tin cơ bản của món ăn",
    });
    return;
  }
  // kiểm tra category có phải mới không
  checkCategory(inputCategory);

  // kiểm tra hình ảnh
  if (!inputLinkImg) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Bạn chưa thêm hình ảnh cho món ăn",
    });
    return;
  }
  // kiểm tra hình ảnh lỗi
  validateImage(inputLinkImg, function (isValid) {
    if (!isValid) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hình ảnh món ăn bị lỗi hoặc không tồn tại",
      });
      return;
    }
  });

  // thêm dữ liệu vào Data
  let inputRecipeId;
  const loginAccountData = JSON.parse(localStorage.getItem("loginAccountData"));
  let recipesData = JSON.parse(localStorage.getItem("recipesData")) || [];
  // thêm id
  if (recipesData.length === 0) {
    inputRecipeId = 1;
  } else {
    inputRecipeId = recipesData[recipesData.length - 1].id + 1;
  }
  // thêm category
  let dataCategoryPush = [];
  inputCategory.split(",").forEach((cat) => {
    dataCategoryPush.push({
      name: cat.trim(),
    });
  });
  recipesData.push({
    id: inputRecipeId,
    author: loginAccountData.username,
    category: dataCategoryPush,
    cookingMethods: `${inputCookingMethod}`,
    coverSrc: `${inputLinkImg}`,
    description: `${inputDescription}`,
    finalWeight: `${inputFinalWeight}`,
    ingredients: inputIngredient,
    likes: 0,
    name: `${inputName}`,
    portions: inputPortions,
    preparationTime: `${inputPreparationTime}`,
    totalTime: `${inputTotalTime}`,
  });
  // lưu dữ liệu
  localStorage.setItem("recipesData", JSON.stringify(recipesData));
  // Hiển thị thêm thành công
  Swal.fire({
    title: "Thêm công thức thành công",
    icon: "success",
  });
  // chuyển hướng đến trang đồ ăn
  setTimeout(() => {
    window.location.href = "recipes.html";
  }, 2500);
});

// hàm kiểm tra category có phải mới không
function checkCategory(inputCategory) {
  let inputCategoryArray = inputCategory.split(",").map((cat) => cat.trim());
  let categoriesRecipeData = JSON.parse(
      localStorage.getItem("categoriesRecipeData") || []
  );
  inputCategoryArray.forEach((category) => {
    if (!categoriesRecipeData.some((cat) => cat.name === category)) {
      categoriesRecipeData.push({
        id: categoriesRecipeData[categoriesRecipeData.length - 1].id + 1,
        name: category,
      });
    }
  });
  localStorage.setItem(
      "categoriesRecipeData",
      JSON.stringify(categoriesRecipeData)
  );
}

// hàm kiểm tra hình ảnh món ăn bị lỗi
function validateImage(url, callback) {
  const img = new Image();
  img.onload = function () {
    callback(true);
  };
  img.onerror = function () {
    callback(false);
  };
  img.src = url;
}
