// đóng mở sidebar
document.addEventListener("DOMContentLoaded", function () {
  const btnCloseSidebar = document.querySelector(".btnCloseSidebar");
  const sideBar = document.querySelector(".sideBar");
  const headerContent = document.querySelector(".header-content");
  const textElements = document.querySelectorAll(".textPage, .textSignOut");
  const logoFull = document.querySelector(".logoFull");
  const logoIcon = document.querySelector(".logoIcon");

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

  // render lựa chọn nutrient
  const nutrients = ["Energy", "Fat", "Carbohydrate", "Protein"];
  let inputNutrient = document.getElementById("inputNutrient");
  inputNutrient.innerHTML = "";
  inputNutrient.innerHTML += `<option value="" selected>Sort by nutrient</option>`;
  nutrients.forEach((e) => {
    inputNutrient.innerHTML += `<option value="${e.toLowerCase()}">${e}</option>`;
  });

  // nếu không yêu thích món ăn nào thì thông báo
  const foodData = JSON.parse(localStorage.getItem("foodData"));
  if (foodData.length === 0) {
    Swal.fire({
      title: "Chưa có thực phẩm",
      text: "Click vào Create food để thêm nhé!",
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

// Modal
const modal = document.getElementById("foodModal");
const closeBtn = document.getElementById("closeBtn");
const createFoodModal = document.getElementById("createFoodModal");
const createFoodCloseBtn = document.getElementById("createFoodCloseBtn");

const cancelModalBtn = document.getElementById("cancelModal");
const saveModalBtn = document.getElementById("saveModal");

const cancelCreateFoodModalBtn = document.getElementById("cancelCreateFood");
const saveCreateFoodModalBtn = document.getElementById("saveCreateFood");
function openModal() {
  modal.classList.add("show");
  document.querySelector("#foodModal .modalContent").scrollTop = 0;
}
function closeModal() {
  modal.classList.remove("show");
}

// CreateFoodModal
function openCreateFoodModal() {
  createFoodModal.classList.add("show");
  document.querySelector("#createFoodModal .modalContent").scrollTop = 0;
  const loginAccountData = JSON.parse(localStorage.getItem("loginAccountData"));
  document.getElementById("inputSource").value = loginAccountData.username;
}

function closeCreateFoodModal() {
  createFoodModal.classList.remove("show");
}

document
  .getElementById("createFood")
  .addEventListener("click", openCreateFoodModal);

createFoodCloseBtn.addEventListener("click", closeCreateFoodModal);
cancelCreateFoodModalBtn.addEventListener("click", closeCreateFoodModal);
saveCreateFoodModalBtn.addEventListener("click", closeCreateFoodModal);

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
  if (event.target === createFoodModal) {
    closeCreateFoodModal();
  }
});

// render food card
let currentPage = 1;
function renderFoodCard(foodToRender) {
  const foodList = document.querySelector(".contentContainer .foodList");
  const paginationContainer = document.getElementById("pagination");
  const foodPerPage = 9;
  const totalPages = Math.ceil(foodToRender.length / foodPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  } else if (totalPages === 0) {
    currentPage = 1;
  }

  //phạm vi công thức hiển thị
  const startIndex = (currentPage - 1) * foodPerPage;
  const endIndex = Math.min(startIndex + foodPerPage, foodToRender.length);
  const currentPageFood = foodToRender.slice(startIndex, endIndex);

  foodList.innerHTML = "";
  currentPageFood.forEach((food) => {
    foodList.innerHTML += `
    <div class="foodCard" data-id="${food.id}">
      <div class="foodTitle">
        <div class="foodName">${food.name}</div>
        <div class="foodAuthor">${food.source}</div>
      </div>
      <div class="nutritionInfo">
        <div class="energy foodNutrition">
          <div class="nutritionValue">
            ${
              food.macronutrients.energy === "0"
                ? "-"
                : food.macronutrients.energy + " kcal"
            } 
          </div>
          <div>Energy</div>
        </div>
        <div class="fat foodNutrition">
          <div class="nutritionValue">
            ${
              food.macronutrients.fat === "0"
                ? "-"
                : food.macronutrients.fat + " g"
            } 
          </div>
          <div>Fat</div>
        </div>
        <div class="carbohydrate foodNutrition">
          <div class="nutritionValue">
            ${
              food.macronutrients.carbohydrate === "0"
                ? "-"
                : food.macronutrients.carbohydrate + " g"
            } 
          </div>
          <div>Carbohydrate</div>
        </div>
        <div class="protein foodNutrition">
          <div class="nutritionValue">
            ${
              food.macronutrients.protein === "0"
                ? "-"
                : food.macronutrients.protein + " g"
            } 
          </div>
          <div>Protein</div>
        </div>
      </div>
    </div>
    `;
  });

  //render phân trang
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
        renderFoodCard(foodToRender);
      }
    });
  document
    .querySelector("#pagination .nextPage")
    .addEventListener("click", function () {
      if (currentPage < totalPages) {
        currentPage++;
        renderFoodCard(foodToRender);
      }
    });

  document.querySelectorAll(".page-item").forEach((item) => {
    item.addEventListener("click", function () {
      currentPage = parseInt(this.getAttribute("data-page"));
      renderFoodCard(foodToRender);
    });
  });

  document.querySelectorAll(".foodCard").forEach((card) => {
    card.addEventListener("click", function () {
      const foodId = parseInt(this.getAttribute("data-id"));
      renderFoodModal(foodId);
      openModal();
    });
  });
}

//render Food Modal
function renderFoodModal(foodId) {
  let foodData = JSON.parse(localStorage.getItem("foodData"));
  let foodModal = document.getElementById("foodModal");
  let foodInfo = foodData.find((e) => e.id === foodId);
  foodModal.innerHTML = "";
  foodModal.innerHTML += `
  <div class="modalContent">
        <div class="closeBtn" id="closeBtn">
          <i class="fa-solid fa-xmark"></i>
        </div>
        <div class="modalTitle">
          <h1>Food information</h1>
          <p>Check and update the information about the food</p>
        </div>
        <div class="info1 tableInfo">
          <div class="nameCategory tableCol">
            <div class="name tableRow">
              <div class="nameValue">Name</div>
              <div class="value">
                <input type="text" value="${foodInfo.name}" disabled />
              </div>
            </div>
            <div class="category tableRow">
              <div class="nameValue">Category</div>
              <div class="value">
                <input
                  type="text"
                  value="${foodInfo.category}"
                  disabled
                />
              </div>
            </div>
          </div>

          <div class="sourceQuantity tableCol">
            <div class="source tableRow">
              <div class="nameValue">Source</div>
              <div class="value">
                <input type="text" value="${foodInfo.source}" disabled />
              </div>
            </div>
            <div class="quantity tableRow">
              <div class="nameValue">Quantity</div>
              <div class="value">
                <input type="text" value="${foodInfo.quantity}" disabled />
              </div>
              <div class="weightValue">grams</div>
            </div>
          </div>
        </div>

        <div class="info2">Nutritional value per 100 g</div>

        <div class="info3">
          <div class="infoTitle">Macronutrients</div>
          <div class="tableInfo">
            <div class="energyCarbohydrate tableCol">
              <div class="energy tableRow">
                <div class="nameValue">Energy</div>
                <div class="value">
                  <input type="text" value="${foodInfo.macronutrients.energy}" disabled />
                </div>
                <div class="weightValue">kcal</div>
              </div>
              <div class="carbohydrate tableRow">
                <div class="nameValue">Carbohydrate</div>
                <div class="value">
                  <input type="text" value="${foodInfo.macronutrients.carbohydrate}" disabled />
                </div>
                <div class="weightValue">g</div>
              </div>
            </div>

            <div class="fatProtein tableCol">
              <div class="fat tableRow">
                <div class="nameValue">Fat</div>
                <div class="value">
                  <input type="text" value="${foodInfo.macronutrients.fat}" disabled />
                </div>
                <div class="weightValue">g</div>
              </div>
              <div class="protein tableRow">
                <div class="nameValue">Protein</div>
                <div class="value">
                  <input type="text" value="${foodInfo.macronutrients.protein}" disabled />
                </div>
                <div class="weightValue">g</div>
              </div>
            </div>
          </div>
        </div>

        <div class="info4">
          <div class="infoTitle">Micronutrients</div>
          <div class="tableInfo">
            <div class="tableCol">
              <div class="tableRow">
                <div class="nameValue">Cholesterol</div>
                <input type="text" value="${foodInfo.micronutrients.cholesterol}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Water</div>
                <input type="text" value="${foodInfo.micronutrients.water}" disabled />
                <div class="weightValue">g</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Vitamin B-12</div>
                <input type="text" value="${foodInfo.micronutrients.vitaminB12}" disabled />
                <div class="weightValue">ug</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Vitamin E</div>
                <input type="text" value="${foodInfo.micronutrients.vitaminE}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Lactose</div>
                <input type="text" value="${foodInfo.micronutrients.lactose}" disabled />
                <div class="weightValue">g</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Sugars</div>
                <input type="text" value="${foodInfo.micronutrients.sugars}" disabled />
                <div class="weightValue">g</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Magnesium</div>
                <input type="text" value="${foodInfo.micronutrients.magnesium}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Zinc</div>
                <input type="text" value="${foodInfo.micronutrients.zinc}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Manganese</div>
                <input type="text" value="${foodInfo.micronutrients.manganese}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Riboflavin</div>
                <input type="text" value="${foodInfo.micronutrients.riboflavin}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Folate, total</div>
                <input type="text" value="${foodInfo.micronutrients.folateTotal}" disabled />
                <div class="weightValue">ug</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Fatty acids, total saturated</div>
                <input type="text" value="${foodInfo.micronutrients.fattyAcidsSaturated}" disabled />
                <div class="weightValue">g</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Chloride</div>
                <input type="text" value="${foodInfo.micronutrients.chloride}" disabled />
                <div class="weightValue">mg</div>
              </div>
            </div>

            <!-- col 2 -->
            <div class="tableCol">
              <div class="tableRow">
                <div class="nameValue">Fiber</div>
                <input type="text" value="${foodInfo.micronutrients.fiber}" disabled />
                <div class="weightValue">g</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Vitamin A</div>
                <input type="text" value="${foodInfo.micronutrients.vitaminA}" disabled />
                <div class="weightValue">ug</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Vitamin C</div>
                <input type="text" value="${foodInfo.micronutrients.vitaminC}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Vitamin K</div>
                <input type="text" value="${foodInfo.micronutrients.vitaminK}" disabled />
                <div class="weightValue">ug</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Alcohol</div>
                <input type="text" value="${foodInfo.micronutrients.alcohol}" disabled />
                <div class="weightValue">g</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Calcium</div>
                <input type="text" value="${foodInfo.micronutrients.calcium}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Phosphorus</div>
                <input type="text" value="${foodInfo.micronutrients.phosphorus}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Copper</div>
                <input type="text" value="${foodInfo.micronutrients.copper}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Selenium</div>
                <input type="text" value="${foodInfo.micronutrients.selenium}" disabled />
                <div class="weightValue">ug</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Niacin</div>
                <input type="text" value="${foodInfo.micronutrients.niacin}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Folic acid</div>
                <input type="text" value="${foodInfo.micronutrients.folicAcid}" disabled />
                <div class="weightValue">ug</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Fatty acids, total monounsaturated</div>
                <input type="text" value="${foodInfo.micronutrients.fattyAcidsMonounsaturated}" disabled />
                <div class="weightValue">g</div>
              </div>
            </div>

            <!-- col 3 -->
            <div class="tableCol">
              <div class="tableRow">
                <div class="nameValue">Sodium</div>
                <input type="text" value="${foodInfo.micronutrients.sodium}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Vitamin B-6</div>
                <input type="text" value="${foodInfo.micronutrients.vitaminB6}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Vitamin D (D2 + D3)</div>
                <input type="text" value="${foodInfo.micronutrients.vitaminD}" disabled />
                <div class="weightValue">ug</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Starch</div>
                <input type="text" value="${foodInfo.micronutrients.starch}" disabled />
                <div class="weightValue">g</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Caffeine</div>
                <input type="text" value="${foodInfo.micronutrients.caffeine}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Iron</div>
                <input type="text" value="${foodInfo.micronutrients.iron}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Potassium</div>
                <input type="text" value="${foodInfo.micronutrients.potassium}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Fluoride</div>
                <input type="text" value="${foodInfo.micronutrients.fluoride}" disabled />
                <div class="weightValue">ug</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Thiamin</div>
                <input type="text" value="${foodInfo.micronutrients.thiamin}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Pantothenic acid</div>
                <input type="text" value="${foodInfo.micronutrients.pantothenicAcid}" disabled />
                <div class="weightValue">mg</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Fatty acids, total trans</div>
                <input type="text" value="${foodInfo.micronutrients.fattyAcidsTrans}" disabled />
                <div class="weightValue">g</div>
              </div>
              <div class="tableRow">
                <div class="nameValue">Fatty acids, total polyunsaturated</div>
                <input type="text" value="${foodInfo.micronutrients.fattyAcidsPolyunsaturated}" disabled />
                <div class="weightValue">g</div>
              </div>
            </div>
          </div>
        </div>
        <div class="cancelSave">
          <div class="cancel" id="cancelModal">Cancel</div>
          <div class="save" id="saveModal">Save and close</div>
        </div>
      </div>
  `;

  document.getElementById("closeBtn").addEventListener("click", closeModal);
  document.getElementById("cancelModal").addEventListener("click", closeModal);
}

//Hàm in ra tất cả các thực phẩm
function renderFood() {
  const foodData = JSON.parse(localStorage.getItem("foodData"));
  renderFoodCard(foodData);
}

renderFood();

const foodData = JSON.parse(localStorage.getItem("foodData")) || [];
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

  // Lọc dữ liệu dựa trên cả tên và thể loại
  filteredFood = foodData.filter((food) => {
    const matchesName = food.name.toLowerCase().includes(searchFood);
    const matchesCategory =
      searchCategory === "" ||
      food.category.toLowerCase().includes(searchCategory);

    return matchesName && matchesCategory;
  });

  renderFoodCard(filteredFood);
}

// Gắn sự kiện cho cả hai input tìm kiếm
document
  .getElementById("searchFood")
  .addEventListener("input", searchNameCategory);
document
  .getElementById("searchCategory")
  .addEventListener("input", searchNameCategory);

// sắp xếp nutrient
let sortDirection = "desc";
// Thêm chức năng sắp xếp theo dinh dưỡng
document
  .getElementById("sortNutrientBtn")
  .addEventListener("click", function () {
    const nutrientSelect = document.getElementById("inputNutrient");
    const selectedNutrient = nutrientSelect.value;

    // Kiểm tra xem người dùng đã chọn chưa;
    if (!selectedNutrient) {
      return;
    }
    // Sắp xếp dữ liệu theo giá trị dinh dưỡng
    filteredFood.sort((a, b) => {
      let valueA = a.macronutrients[selectedNutrient] || 0;
      let valueB = b.macronutrients[selectedNutrient] || 0;

      // Chuyển sang dạng số để so sánh
      valueA = parseFloat(valueA);
      valueB = parseFloat(valueB);

      // Nếu giá trị là NaN, coi như là 0
      if (isNaN(valueA)) valueA = 0;
      if (isNaN(valueB)) valueB = 0;

      // Sắp xếp theo thứ tự hiện tại
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    });

    // Đảo ngược thứ tự sắp xếp cho lần click tiếp theo
    sortDirection = sortDirection === "asc" ? "desc" : "asc";

    // Hiển thị thực phẩm đã sắp xếp
    currentPage = 1;
    renderFoodCard(filteredFood);
  });

// Thêm thực phẩm
let saveCreateFoodBtn = document.getElementById("saveCreateFood");
saveCreateFoodBtn.addEventListener("click", function () {
  // Lấy thông tin từ form
  const loginAccountData = JSON.parse(localStorage.getItem("loginAccountData"));
  const name = document.getElementById("inputName").value.trim();
  const category = document.getElementById("inputCategory").value.trim();
  const quantity = document.getElementById("inputQuantity").value.trim();

  // Lấy thông tin macronutrients
  const energy =
    parseFloat(document.getElementById("inputEnergy").value) || "0";
  const carbohydrate =
    parseFloat(document.getElementById("inputCarbohydrate").value) || "0";
  const fat = parseFloat(document.getElementById("inputFat").value) || "0";
  const protein =
    parseFloat(document.getElementById("inputProtein").value) || "0";

  // Kiểm tra dữ liệu cơ bản
  if (!name || !category || !quantity) {
    Swal.fire({
      icon: "error",
      title: "Vui lòng điền đầy đủ thông tin",
      text: "Bạn thiếu thông tin cơ bản của món ăn",
    });
    return;
  }

  // Tạo đối tượng micronutrients
  const micronutrients = {
    cholesterol:
      parseFloat(document.getElementById("inputCholesterol").value) || "0",
    fiber: parseFloat(document.getElementById("inputFiber").value) || "0",
    sodium: parseFloat(document.getElementById("inputSodium").value) || "0",
    water: parseFloat(document.getElementById("inputWater").value) || "0",
    vitaminA: parseFloat(document.getElementById("inputVitaminA").value) || "0",
    vitaminB6:
      parseFloat(document.getElementById("inputVitaminB6").value) || "0",
    vitaminB12:
      parseFloat(document.getElementById("inputVitaminB12").value) || "0",
    vitaminC: parseFloat(document.getElementById("inputVitaminC").value) || "0",
    vitaminD: parseFloat(document.getElementById("inputVitaminD").value) || "0",
    vitaminE: parseFloat(document.getElementById("inputVitaminE").value) || "0",
    vitaminK: parseFloat(document.getElementById("inputVitaminK").value) || "0",
    starch: parseFloat(document.getElementById("inputStarch").value) || "0",
    lactose: parseFloat(document.getElementById("inputLactose").value) || "0",
    alcohol: parseFloat(document.getElementById("inputAlcohol").value) || "0",
    caffeine: parseFloat(document.getElementById("inputCaffeine").value) || "0",
    sugars: parseFloat(document.getElementById("inputSugars").value) || "0",
    calcium: parseFloat(document.getElementById("inputCalcium").value) || "0",
    iron: parseFloat(document.getElementById("inputIron").value) || "0",
    magnesium:
      parseFloat(document.getElementById("inputMagnesium").value) || "0",
    phosphorus:
      parseFloat(document.getElementById("inputPhosphorus").value) || "0",
    potassium:
      parseFloat(document.getElementById("inputPotassium").value) || "0",
    zinc: parseFloat(document.getElementById("inputZinc").value) || "0",
    copper: parseFloat(document.getElementById("inputCopper").value) || "0",
    fluoride: parseFloat(document.getElementById("inputFluoride").value) || "0",
    manganese:
      parseFloat(document.getElementById("inputManganese").value) || "0",
    selenium: parseFloat(document.getElementById("inputSelenium").value) || "0",
    thiamin: parseFloat(document.getElementById("inputThiamin").value) || "0",
    riboflavin:
      parseFloat(document.getElementById("inputRiboflavin").value) || "0",
    niacin: parseFloat(document.getElementById("inputNiacin").value) || "0",
    pantothenicAcid:
      parseFloat(document.getElementById("inputPantothenicAcid").value) || "0",
    folateTotal:
      parseFloat(document.getElementById("inputFolateTotal").value) || "0",
    folicAcid:
      parseFloat(document.getElementById("inputFolicAcid").value) || "0",
    fattyAcidsTrans:
      parseFloat(document.getElementById("inputTransFattyAcids").value) || "0",
    fattyAcidsSaturated:
      parseFloat(document.getElementById("inputSaturatedFattyAcids").value) ||
      "0",
    fattyAcidsMonounsaturated:
      parseFloat(
        document.getElementById("inputMonounsaturatedFattyAcids").value
      ) || "0",
    fattyAcidsPolyunsaturated:
      parseFloat(
        document.getElementById("inputPolyunsaturatedFattyAcids").value
      ) || "0",
    chloride: parseFloat(document.getElementById("inputChloride").value) || "0",
  };

  let foodData = JSON.parse(localStorage.getItem("foodData")) || [];

  let newId = 1;
  if (foodData.length > 0) {
    newId = Math.max(...foodData.map((food) => food.id)) + 1;
  }

  const newFood = {
    id: newId,
    name: name,
    source: loginAccountData.username,
    category: category,
    quantity: parseFloat(quantity),
    macronutrients: {
      energy: energy,
      carbohydrate: carbohydrate,
      fat: fat,
      protein: protein,
    },
    micronutrients: micronutrients,
  };

  foodData.push(newFood);

  localStorage.setItem("foodData", JSON.stringify(foodData));

  closeCreateFoodModal();
  renderFood();

  // reset form
  document.querySelectorAll("#createFoodModal input").forEach((input) => {
    input.value = "";
  });

  // Thông báo thành công
  Swal.fire({
    title: "Thêm thực phẩm thành công!",
    icon: "success",
  });
});

// Data
// const foodData = [
//   {
//     id: 1,
//     name: "Ackee, canned, drained",
//     source: "Minh Cuong Tran",
//     category: "Vegetables and Vegetable Products",
//     quantity: "100",
//     macronutrients: {
//       energy: 151,
//       carbohydrate: 0.8,
//       fat: 15.2,
//       protein: 2.9,
//     },
//     micronutrients: {
//       cholesterol: 0.0,
//       fiber: "",
//       sodium: 240.0,
//       water: 76.7,
//       vitaminA: "",
//       vitaminB6: 0.06,
//       vitaminB12: 0.0,
//       vitaminC: 30.0,
//       vitaminD: 0.0,
//       vitaminE: "",
//       vitaminK: "",
//       starch: 0.0,
//       lactose: 0.0,
//       alcohol: "",
//       caffeine: "",
//       sugars: 0.8,
//       calcium: 35.0,
//       iron: 0.7,
//       magnesium: 40.0,
//       phosphorus: 47.0,
//       potassium: 270.0,
//       zinc: 0.6,
//       copper: 0.27,
//       fluoride: "",
//       manganese: "",
//       selenium: "",
//       thiamin: 0.03,
//       riboflavin: 0.07,
//       niacin: 0.6,
//       pantothenicAcid: "",
//       folateTotal: 41.0,
//       folicAcid: "",
//       fattyAcidsTrans: 0.0,
//       fattyAcidsSaturated: "",
//       fattyAcidsMonounsaturated: "",
//       fattyAcidsPolyunsaturated: "",
//       chloride: 340.0,
//     },
//   },
//   {
//     id: 2,
//     name: "Broccoli, raw",
//     source: "USDA",
//     category: "Vegetables and Vegetable Products",
//     quantity: "100",
//     macronutrients: {
//       energy: 34,
//       carbohydrate: 6.6,
//       fat: 0.4,
//       protein: 2.8,
//     },
//     micronutrients: {
//       cholesterol: 0.0,
//       fiber: 2.6,
//       sodium: 33.0,
//       water: 89.3,
//       vitaminA: 31.0,
//       vitaminB6: 0.21,
//       vitaminB12: 0.0,
//       vitaminC: 89.2,
//       vitaminD: 0.0,
//       vitaminE: 0.78,
//       vitaminK: 101.6,
//       starch: 0.0,
//       lactose: 0.0,
//       alcohol: 0.0,
//       caffeine: 0.0,
//       sugars: 1.7,
//       calcium: 47.0,
//       iron: 0.73,
//       magnesium: 21.0,
//       phosphorus: 66.0,
//       potassium: 316.0,
//       zinc: 0.41,
//       copper: 0.05,
//       fluoride: "",
//       manganese: 0.21,
//       selenium: 2.5,
//       thiamin: 0.071,
//       riboflavin: 0.117,
//       niacin: 0.639,
//       pantothenicAcid: 0.573,
//       folateTotal: 63.0,
//       folicAcid: "",
//       fattyAcidsTrans: 0.0,
//       fattyAcidsSaturated: 0.04,
//       fattyAcidsMonounsaturated: 0.01,
//       fattyAcidsPolyunsaturated: 0.04,
//       chloride: "",
//     },
//   },
//   {
//     id: 3,
//     name: "Apple, raw, with skin",
//     source: "USDA",
//     category: "Fruits and Fruit Juices",
//     quantity: "100",
//     macronutrients: {
//       energy: 52,
//       carbohydrate: 13.8,
//       fat: 0.2,
//       protein: 0.3,
//     },
//     micronutrients: {
//       cholesterol: 0.0,
//       fiber: 2.4,
//       sodium: 1.0,
//       water: 85.6,
//       vitaminA: 3.0,
//       vitaminB6: 0.041,
//       vitaminB12: 0.0,
//       vitaminC: 4.6,
//       vitaminD: 0.0,
//       vitaminE: 0.18,
//       vitaminK: 2.2,
//       starch: 0.0,
//       lactose: 0.0,
//       alcohol: 0.0,
//       caffeine: 0.0,
//       sugars: 10.4,
//       calcium: 6.0,
//       iron: 0.12,
//       magnesium: 5.0,
//       phosphorus: 11.0,
//       potassium: 107.0,
//       zinc: 0.04,
//       copper: 0.027,
//       fluoride: 3.3,
//       manganese: 0.035,
//       selenium: 0.0,
//       thiamin: 0.017,
//       riboflavin: 0.026,
//       niacin: 0.091,
//       pantothenicAcid: 0.061,
//       folateTotal: 3.0,
//       folicAcid: "",
//       fattyAcidsTrans: 0.0,
//       fattyAcidsSaturated: 0.03,
//       fattyAcidsMonounsaturated: 0.01,
//       fattyAcidsPolyunsaturated: 0.05,
//       chloride: "",
//     },
//   },
//   {
//     id: 4,
//     name: "Chicken breast, roasted",
//     source: "USDA",
//     category: "Poultry Products",
//     quantity: "100",
//     macronutrients: {
//       energy: 165,
//       carbohydrate: 0.0,
//       fat: 3.6,
//       protein: 31.0,
//     },
//     micronutrients: {
//       cholesterol: 85.0,
//       fiber: 0.0,
//       sodium: 74.0,
//       water: 65.3,
//       vitaminA: 13.0,
//       vitaminB6: 0.6,
//       vitaminB12: 0.3,
//       vitaminC: 0.0,
//       vitaminD: 0.1,
//       vitaminE: 0.27,
//       vitaminK: 0.0,
//       starch: 0.0,
//       lactose: 0.0,
//       alcohol: 0.0,
//       caffeine: 0.0,
//       sugars: 0.0,
//       calcium: 15.0,
//       iron: 1.0,
//       magnesium: 29.0,
//       phosphorus: 220.0,
//       potassium: 256.0,
//       zinc: 1.0,
//       copper: 0.03,
//       fluoride: "",
//       manganese: 0.02,
//       selenium: 27.6,
//       thiamin: 0.07,
//       riboflavin: 0.1,
//       niacin: 13.7,
//       pantothenicAcid: 1.1,
//       folateTotal: 4.0,
//       folicAcid: "",
//       fattyAcidsTrans: 0.0,
//       fattyAcidsSaturated: 1.0,
//       fattyAcidsMonounsaturated: 1.2,
//       fattyAcidsPolyunsaturated: 0.8,
//       chloride: "",
//     },
//   },
//   {
//     id: 5,
//     name: "Brown rice, cooked",
//     source: "USDA",
//     category: "Cereal Grains and Pasta",
//     quantity: "100",
//     macronutrients: {
//       energy: 123,
//       carbohydrate: 25.6,
//       fat: 1.0,
//       protein: 2.7,
//     },
//     micronutrients: {
//       cholesterol: 0.0,
//       fiber: 1.6,
//       sodium: 4.0,
//       water: 70.0,
//       vitaminA: 0.0,
//       vitaminB6: 0.15,
//       vitaminB12: 0.0,
//       vitaminC: 0.0,
//       vitaminD: 0.0,
//       vitaminE: 0.11,
//       vitaminK: 0.6,
//       starch: 23.5,
//       lactose: 0.0,
//       alcohol: 0.0,
//       caffeine: 0.0,
//       sugars: 0.2,
//       calcium: 10.0,
//       iron: 0.56,
//       magnesium: 39.0,
//       phosphorus: 103.0,
//       potassium: 86.0,
//       zinc: 0.99,
//       copper: 0.11,
//       fluoride: "",
//       manganese: 1.09,
//       selenium: 9.8,
//       thiamin: 0.17,
//       riboflavin: 0.02,
//       niacin: 1.6,
//       pantothenicAcid: 0.29,
//       folateTotal: 9.0,
//       folicAcid: "",
//       fattyAcidsTrans: 0.0,
//       fattyAcidsSaturated: 0.26,
//       fattyAcidsMonounsaturated: 0.33,
//       fattyAcidsPolyunsaturated: 0.36,
//       chloride: "",
//     },
//   },
//   {
//     id: 6,
//     name: "Whole milk, 3.25% fat",
//     source: "USDA",
//     category: "Dairy and Egg Products",
//     quantity: "100",
//     macronutrients: {
//       energy: 61,
//       carbohydrate: 4.8,
//       fat: 3.3,
//       protein: 3.2,
//     },
//     micronutrients: {
//       cholesterol: 10.0,
//       fiber: 0.0,
//       sodium: 43.0,
//       water: 88.3,
//       vitaminA: 46.0,
//       vitaminB6: 0.04,
//       vitaminB12: 0.45,
//       vitaminC: 0.0,
//       vitaminD: 1.0,
//       vitaminE: 0.07,
//       vitaminK: 0.3,
//       starch: 0.0,
//       lactose: 5.1,
//       alcohol: 0.0,
//       caffeine: 0.0,
//       sugars: 5.1,
//       calcium: 113.0,
//       iron: 0.03,
//       magnesium: 10.0,
//       phosphorus: 84.0,
//       potassium: 132.0,
//       zinc: 0.37,
//       copper: 0.01,
//       fluoride: "",
//       manganese: "",
//       selenium: 1.5,
//       thiamin: 0.03,
//       riboflavin: 0.18,
//       niacin: 0.1,
//       pantothenicAcid: 0.34,
//       folateTotal: 5.0,
//       folicAcid: "",
//       fattyAcidsTrans: 0.12,
//       fattyAcidsSaturated: 1.86,
//       fattyAcidsMonounsaturated: 0.82,
//       fattyAcidsPolyunsaturated: 0.2,
//       chloride: "",
//     },
//   },
// ];
// localStorage.setItem("foodData", JSON.stringify(foodData));
