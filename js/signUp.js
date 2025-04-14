// Hàm hiển thị thông báo với CSS animation
function showNotification(element) {
  element.style.display = "flex";
  // Thêm class để chạy animation
  element.classList.add("slide-in");
  // Loại bỏ class sau khi animation kết thúc, để có thể dùng lại
  setTimeout(() => {
    element.classList.remove("slide-in");
  }, 300);
}

// Hàm ẩn thông báo với CSS animation
function hideNotification(element) {
  element.classList.add("slide-out");
  // Sau khi animation ẩn kết thúc, ẩn phần tử khỏi trang
  setTimeout(() => {
    element.style.display = "none";
    element.classList.remove("slide-out");
  }, 300);
}

let accountData = JSON.parse(localStorage.getItem("accountData")) || [];
let favoriteRecipeData =
    JSON.parse(localStorage.getItem("favoriteRecipeData")) || [];
document.getElementById("btn-singUp").addEventListener("click", function () {
  let error = document.querySelector(".error");
  let inputEmail = document.getElementById("inputEmail").value.trim();
  let inputUsername = document.getElementById("inputUsername").value.trim();
  let inputPassword = document.getElementById("inputPassword").value.trim();
  let inputConfirmPassword = document
      .getElementById("inputConfirmPassword")
      .value.trim();
  let inputError = document.getElementById("inputError");
  inputError.innerHTML = "";
  let check = true;

  // Kiểm tra username
  if (inputUsername === "") {
    inputError.innerHTML += "Username không được bỏ trống <br />";
    check = false;
  } else if (accountData.some((e) => e.username === inputUsername)) {
    inputError.innerHTML += "Username bị đã tồn tại <br />";
    check = false;
  }

  // Kiểm tra email
  if (inputEmail === "") {
    inputError.innerHTML += "Email không được bỏ trống <br />";
    check = false;
  } else if (!document.getElementById("inputEmail").checkValidity()) {
    inputError.innerHTML += "Email không đúng định dạng <br />";
    check = false;
  } else if (accountData.some((e) => e.email === inputEmail)) {
    inputError.innerHTML += "Email bị đã tồn tại <br />";
  }

  // Kiểm tra password
  if (inputPassword === "") {
    inputError.innerHTML += "Password không được bỏ trống <br />";
    check = false;
  } else if (inputPassword.length < 8) {
    inputError.innerHTML += "Mật khẩu phải có ít nhất 8 ký tự <br />";
    check = false;
  } else if (inputPassword !== inputConfirmPassword) {
    inputError.innerHTML += "Mật khẩu xác nhận không trùng khớp";
    check = false;
  }

  if (check) {
    hideNotification(error);
    let pass = document.querySelector(".pass");
    showNotification(pass);

    // Thêm id cho người dùng mới
    let inputAccountId =
        accountData.length > 0 ? accountData[accountData.length - 1].id + 1 : 1;

    accountData.push({
      id: inputAccountId,
      email: inputEmail,
      username: inputUsername,
      password: inputPassword,
    });
    localStorage.setItem("accountData", JSON.stringify(accountData));

    favoriteRecipeData.push({
      accountId: inputAccountId,
      idRecipeFavorite: [],
    });
    localStorage.setItem(
        "favoriteRecipeData",
        JSON.stringify(favoriteRecipeData)
    );
    setTimeout(function () {
      window.location.href = "signIn.html";
    }, 2000);
  } else {
    document.getElementById("inputEmail").value = "";
    document.getElementById("inputUsername").value = "";
    document.getElementById("inputPassword").value = "";
    document.getElementById("inputConfirmPassword").value = "";
    error.style.display = "flex";
    showNotification(error);

    let btnClose = document.querySelector(".error .btn-close");
    btnClose.onclick = function () {
      hideNotification(error);
    };
  }
});

// hàm kiểm tra mảng dữ liệu không có thì tạo
function checkDataBase() {
  let accountData = JSON.parse(localStorage.getItem("accountData"));
  let categoriesRecipeData = JSON.parse(
      localStorage.getItem("categoriesRecipeData")
  );
  let favoriteRecipeData = JSON.parse(
      localStorage.getItem("favoriteRecipeData")
  );
  let foodData = JSON.parse(localStorage.getItem("foodData"));
  let recipesData = JSON.parse(localStorage.getItem("recipesData"));

  if (!accountData || accountData.length === 0) {
    accountData = [];
  }
  if (!categoriesRecipeData || categoriesRecipeData.length === 0) {
    categoriesRecipeData = [
      {
        id: 1,
        name: "vegetarian",
      },
      {
        id: 2,
        name: "appetizer",
      },
      {
        id: 3,
        name: "vegan",
      },
      {
        id: 4,
        name: "main course",
      },
      {
        id: 5,
        name: "dessert",
      },
      {
        id: 6,
        name: "low-carb",
      },
      {
        id: 7,
        name: "gluten-free",
      },
      {
        id: 8,
        name: "breakfast",
      },
      {
        id: 9,
        name: "salad",
      },
      {
        id: 10,
        name: "soup",
      },
    ];
  }
  if (!favoriteRecipeData || favoriteRecipeData.length === 0) {
    favoriteRecipeData = [];
  }
  if (!foodData || foodData.length === 0) {
    foodData = [
      {
        id: 1,
        name: "Ackee, canned, drained",
        source: "Minh Cuong Tran",
        category: "Vegetables and Vegetable Products",
        quantity: "100",
        macronutrients: {
          energy: 151,
          carbohydrate: 0.8,
          fat: 15.2,
          protein: 2.9,
        },
        micronutrients: {
          cholesterol: 0.0,
          fiber: "",
          sodium: 240.0,
          water: 76.7,
          vitaminA: "",
          vitaminB6: 0.06,
          vitaminB12: 0.0,
          vitaminC: 30.0,
          vitaminD: 0.0,
          vitaminE: "",
          vitaminK: "",
          starch: 0.0,
          lactose: 0.0,
          alcohol: "",
          caffeine: "",
          sugars: 0.8,
          calcium: 35.0,
          iron: 0.7,
          magnesium: 40.0,
          phosphorus: 47.0,
          potassium: 270.0,
          zinc: 0.6,
          copper: 0.27,
          fluoride: "",
          manganese: "",
          selenium: "",
          thiamin: 0.03,
          riboflavin: 0.07,
          niacin: 0.6,
          pantothenicAcid: "",
          folateTotal: 41.0,
          folicAcid: "",
          fattyAcidsTrans: 0.0,
          fattyAcidsSaturated: "",
          fattyAcidsMonounsaturated: "",
          fattyAcidsPolyunsaturated: "",
          chloride: 340.0,
        },
      },
      {
        id: 2,
        name: "Broccoli, raw",
        source: "USDA",
        category: "Vegetables and Vegetable Products",
        quantity: "100",
        macronutrients: {
          energy: 34,
          carbohydrate: 6.6,
          fat: 0.4,
          protein: 2.8,
        },
        micronutrients: {
          cholesterol: 0.0,
          fiber: 2.6,
          sodium: 33.0,
          water: 89.3,
          vitaminA: 31.0,
          vitaminB6: 0.21,
          vitaminB12: 0.0,
          vitaminC: 89.2,
          vitaminD: 0.0,
          vitaminE: 0.78,
          vitaminK: 101.6,
          starch: 0.0,
          lactose: 0.0,
          alcohol: 0.0,
          caffeine: 0.0,
          sugars: 1.7,
          calcium: 47.0,
          iron: 0.73,
          magnesium: 21.0,
          phosphorus: 66.0,
          potassium: 316.0,
          zinc: 0.41,
          copper: 0.05,
          fluoride: "",
          manganese: 0.21,
          selenium: 2.5,
          thiamin: 0.071,
          riboflavin: 0.117,
          niacin: 0.639,
          pantothenicAcid: 0.573,
          folateTotal: 63.0,
          folicAcid: "",
          fattyAcidsTrans: 0.0,
          fattyAcidsSaturated: 0.04,
          fattyAcidsMonounsaturated: 0.01,
          fattyAcidsPolyunsaturated: 0.04,
          chloride: "",
        },
      },
      {
        id: 3,
        name: "Apple, raw, with skin",
        source: "USDA",
        category: "Fruits and Fruit Juices",
        quantity: "100",
        macronutrients: {
          energy: 52,
          carbohydrate: 13.8,
          fat: 0.2,
          protein: 0.3,
        },
        micronutrients: {
          cholesterol: 0.0,
          fiber: 2.4,
          sodium: 1.0,
          water: 85.6,
          vitaminA: 3.0,
          vitaminB6: 0.041,
          vitaminB12: 0.0,
          vitaminC: 4.6,
          vitaminD: 0.0,
          vitaminE: 0.18,
          vitaminK: 2.2,
          starch: 0.0,
          lactose: 0.0,
          alcohol: 0.0,
          caffeine: 0.0,
          sugars: 10.4,
          calcium: 6.0,
          iron: 0.12,
          magnesium: 5.0,
          phosphorus: 11.0,
          potassium: 107.0,
          zinc: 0.04,
          copper: 0.027,
          fluoride: 3.3,
          manganese: 0.035,
          selenium: 0.0,
          thiamin: 0.017,
          riboflavin: 0.026,
          niacin: 0.091,
          pantothenicAcid: 0.061,
          folateTotal: 3.0,
          folicAcid: "",
          fattyAcidsTrans: 0.0,
          fattyAcidsSaturated: 0.03,
          fattyAcidsMonounsaturated: 0.01,
          fattyAcidsPolyunsaturated: 0.05,
          chloride: "",
        },
      },
      {
        id: 4,
        name: "Chicken breast, roasted",
        source: "USDA",
        category: "Poultry Products",
        quantity: "100",
        macronutrients: {
          energy: 165,
          carbohydrate: 0.0,
          fat: 3.6,
          protein: 31.0,
        },
        micronutrients: {
          cholesterol: 85.0,
          fiber: 0.0,
          sodium: 74.0,
          water: 65.3,
          vitaminA: 13.0,
          vitaminB6: 0.6,
          vitaminB12: 0.3,
          vitaminC: 0.0,
          vitaminD: 0.1,
          vitaminE: 0.27,
          vitaminK: 0.0,
          starch: 0.0,
          lactose: 0.0,
          alcohol: 0.0,
          caffeine: 0.0,
          sugars: 0.0,
          calcium: 15.0,
          iron: 1.0,
          magnesium: 29.0,
          phosphorus: 220.0,
          potassium: 256.0,
          zinc: 1.0,
          copper: 0.03,
          fluoride: "",
          manganese: 0.02,
          selenium: 27.6,
          thiamin: 0.07,
          riboflavin: 0.1,
          niacin: 13.7,
          pantothenicAcid: 1.1,
          folateTotal: 4.0,
          folicAcid: "",
          fattyAcidsTrans: 0.0,
          fattyAcidsSaturated: 1.0,
          fattyAcidsMonounsaturated: 1.2,
          fattyAcidsPolyunsaturated: 0.8,
          chloride: "",
        },
      },
      {
        id: 5,
        name: "Brown rice, cooked",
        source: "USDA",
        category: "Cereal Grains and Pasta",
        quantity: "100",
        macronutrients: {
          energy: 123,
          carbohydrate: 25.6,
          fat: 1.0,
          protein: 2.7,
        },
        micronutrients: {
          cholesterol: 0.0,
          fiber: 1.6,
          sodium: 4.0,
          water: 70.0,
          vitaminA: 0.0,
          vitaminB6: 0.15,
          vitaminB12: 0.0,
          vitaminC: 0.0,
          vitaminD: 0.0,
          vitaminE: 0.11,
          vitaminK: 0.6,
          starch: 23.5,
          lactose: 0.0,
          alcohol: 0.0,
          caffeine: 0.0,
          sugars: 0.2,
          calcium: 10.0,
          iron: 0.56,
          magnesium: 39.0,
          phosphorus: 103.0,
          potassium: 86.0,
          zinc: 0.99,
          copper: 0.11,
          fluoride: "",
          manganese: 1.09,
          selenium: 9.8,
          thiamin: 0.17,
          riboflavin: 0.02,
          niacin: 1.6,
          pantothenicAcid: 0.29,
          folateTotal: 9.0,
          folicAcid: "",
          fattyAcidsTrans: 0.0,
          fattyAcidsSaturated: 0.26,
          fattyAcidsMonounsaturated: 0.33,
          fattyAcidsPolyunsaturated: 0.36,
          chloride: "",
        },
      },
      {
        id: 6,
        name: "Whole milk, 3.25% fat",
        source: "USDA",
        category: "Dairy and Egg Products",
        quantity: "100",
        macronutrients: {
          energy: 61,
          carbohydrate: 4.8,
          fat: 3.3,
          protein: 3.2,
        },
        micronutrients: {
          cholesterol: 10.0,
          fiber: 0.0,
          sodium: 43.0,
          water: 88.3,
          vitaminA: 46.0,
          vitaminB6: 0.04,
          vitaminB12: 0.45,
          vitaminC: 0.0,
          vitaminD: 1.0,
          vitaminE: 0.07,
          vitaminK: 0.3,
          starch: 0.0,
          lactose: 5.1,
          alcohol: 0.0,
          caffeine: 0.0,
          sugars: 5.1,
          calcium: 113.0,
          iron: 0.03,
          magnesium: 10.0,
          phosphorus: 84.0,
          potassium: 132.0,
          zinc: 0.37,
          copper: 0.01,
          fluoride: "",
          manganese: "",
          selenium: 1.5,
          thiamin: 0.03,
          riboflavin: 0.18,
          niacin: 0.1,
          pantothenicAcid: 0.34,
          folateTotal: 5.0,
          folicAcid: "",
          fattyAcidsTrans: 0.12,
          fattyAcidsSaturated: 1.86,
          fattyAcidsMonounsaturated: 0.82,
          fattyAcidsPolyunsaturated: 0.2,
          chloride: "",
        },
      },
    ];
  }
  if (!recipesData || recipesData.length === 0) {
    // Up dữ liệu mẫu
    recipesData = [
      {
        id: 1,
        coverSrc:
            "https://images.immediate.co.uk/production/volatile/sites/2/2017/09/OLI1017-TumericCauliflowerSalad_014532.jpg?quality=90&resize=556,505",
        name: "Turmeric Roasted Cauliflower Salad (lowfodmap)",
        description:
            "Our roasted cauliflower salad with turmeric is low in calories and packed with punchy flavor.",
        author: "Joana Jardim",
        totalTime: "00:40",
        preparationTime: "00:40",
        finalWeight: "978.8 grams",
        portions: 4,
        likes: 134,
        ingredients: [1, 2, 3], // 3 ingredients
        cookingMethods:
            "STEP 1 Heat the oven to 200C/fan 180C/gas 6. Put the cauliflower in an ovenproof dish or tin.",
        category: [
          { id: 1, name: "vegetarian" },
          { id: 2, name: "appetizer" },
        ],
      },
      {
        id: 2,
        coverSrc:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Ne9niCIuEcfJsCduQ08v4cm1BVSIdc3Gbw&s",
        name: "Grilled Chicken with Lemon and Herbs",
        description:
            "Juicy grilled chicken breasts marinated in a lemon and herb sauce.",
        author: "Carlos Mendes",
        totalTime: "00:30",
        preparationTime: "00:15",
        finalWeight: "850 grams",
        portions: 3,
        likes: 198,
        ingredients: [4, 5, 6, 1], // 4 ingredients
        cookingMethods:
            "STEP 1 Mix lemon juice, olive oil, and herbs. Marinate chicken for 15 minutes then grill until cooked.",
        category: [
          { id: 3, name: "grilled" },
          { id: 4, name: "main course" },
        ],
      },
      {
        id: 3,
        coverSrc:
            "https://www.healthyfood.com/wp-content/uploads/2019/07/Creamy-pumpkin-soup.jpg",
        name: "Creamy Pumpkin Soup",
        description:
            "A comforting and creamy soup made with roasted pumpkin and a touch of cream.",
        author: "Lena Hart",
        totalTime: "00:50",
        preparationTime: "00:20",
        finalWeight: "1100 grams",
        portions: 4,
        likes: 165,
        ingredients: [2, 3, 7], // 3 ingredients
        cookingMethods:
            "STEP 1 Roast the pumpkin at 180C until soft. Blend with cream and season to taste.",
        category: [
          { id: 5, name: "soup" },
          { id: 6, name: "vegetarian" },
        ],
      },
      {
        id: 4,
        coverSrc:
            "https://cdn.tgdd.vn/2021/01/CookProduct/1200-1200x676-16.jpg",
        name: "Spaghetti Aglio e Olio",
        description:
            "Simple and classic Italian pasta with garlic and olive oil.",
        author: "Marco Rossi",
        totalTime: "00:20",
        preparationTime: "00:10",
        finalWeight: "600 grams",
        portions: 2,
        likes: 243,
        ingredients: [1, 4, 5], // 3 ingredients
        cookingMethods:
            "STEP 1 Cook spaghetti. Sauté garlic in olive oil and toss with pasta.",
        category: [
          { id: 7, name: "pasta" },
          { id: 1, name: "vegetarian" },
        ],
      },
      {
        id: 5,
        coverSrc:
            "https://www.eatingwell.com/thmb/PqRN1f14fA3zdvpFMGi7I19FCPU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/hearty-chickpea-spinach-stew-270568-1x1-b27d319be4504a39ba4d4184d1a3b2cb.jpg",
        name: "Chickpea & Spinach Stew",
        description:
            "A hearty and healthy stew made with chickpeas, spinach, and warm spices.",
        author: "Ayesha Noor",
        totalTime: "00:45",
        preparationTime: "00:20",
        finalWeight: "900 grams",
        portions: 3,
        likes: 120,
        ingredients: [6, 7, 2, 3], // 4 ingredients
        cookingMethods:
            "STEP 1 Sauté onions and garlic, add chickpeas and spinach, and simmer until flavors blend.",
        category: [
          { id: 8, name: "stew" },
          { id: 1, name: "vegetarian" },
        ],
      },
      {
        id: 6,
        coverSrc:
            "https://www.funfoodfrolic.com/wp-content/uploads/2020/03/Tofu-Stir-Fry-Thumbnail.jpg",
        name: "Tofu Stir-Fry with Veggies",
        description:
            "Colorful stir-fried vegetables tossed with crispy tofu in a savory sauce.",
        author: "Minh Tran",
        totalTime: "00:25",
        preparationTime: "00:15",
        finalWeight: "750 grams",
        portions: 2,
        likes: 177,
        ingredients: [4, 1, 5], // 3 ingredients
        cookingMethods:
            "STEP 1 Fry tofu until golden. Add vegetables and stir-fry with sauce for 5 minutes.",
        category: [
          { id: 9, name: "stir-fry" },
          { id: 1, name: "vegetarian" },
        ],
      },
      {
        id: 7,
        coverSrc:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG4tEU7GPCnCsR5c-zvqeMJPqHIFmVilASSw&s",
        name: "Baked Salmon with Dill",
        description:
            "Tender salmon fillet baked with lemon slices and fresh dill.",
        author: "Elena Petrova",
        totalTime: "00:35",
        preparationTime: "00:10",
        finalWeight: "500 grams",
        portions: 2,
        likes: 210,
        ingredients: [6, 2, 3], // 3 ingredients
        cookingMethods:
            "STEP 1 Preheat oven. Place salmon in foil with lemon and dill. Bake for 20 minutes.",
        category: [
          { id: 10, name: "seafood" },
          { id: 4, name: "main course" },
        ],
      },
      {
        id: 8,
        coverSrc:
            "https://nomoneynotime.com.au/uploads/recipes/shutterstock_1926492050-1.jpg",
        name: "Avocado Toast with Poached Egg",
        description:
            "A nourishing breakfast of wholegrain toast topped with smashed avocado and a poached egg.",
        author: "Sarah Kim",
        totalTime: "00:15",
        preparationTime: "00:10",
        finalWeight: "300 grams",
        portions: 1,
        likes: 156,
        ingredients: [7, 1, 4], // 3 ingredients
        cookingMethods:
            "STEP 1 Toast bread, mash avocado, and top with a poached egg.",
        category: [
          { id: 11, name: "breakfast" },
          { id: 1, name: "vegetarian" },
        ],
      },
      {
        id: 9,
        coverSrc:
            "https://embed.widencdn.net/img/beef/t9bwp7fitq/exact/Stuffed%20Peppers%20-%20NCBA%20Beef%20Aug%20202431717.jpg?keep=c&u=7fueml",
        name: "Stuffed Bell Peppers",
        description:
            "Bell peppers filled with a tasty mix of rice, beans, and herbs.",
        author: "James Lee",
        totalTime: "01:00",
        preparationTime: "00:25",
        finalWeight: "1000 grams",
        portions: 4,
        likes: 188,
        ingredients: [5, 6, 2, 3], // 4 ingredients
        cookingMethods:
            "STEP 1 Hollow bell peppers, fill with mix, and bake at 180C for 30-35 minutes.",
        category: [
          { id: 12, name: "baked" },
          { id: 1, name: "vegetarian" },
        ],
      },
      {
        id: 10,
        coverSrc:
            "https://www.aforkstale.com/wp-content/uploads/mediterranean-quinoa-salad-with-feta.-4.jpg",
        name: "Quinoa Salad with Feta and Olives",
        description:
            "A Mediterranean-inspired quinoa salad with feta cheese and olives.",
        author: "Maria Papadopoulos",
        totalTime: "00:25",
        preparationTime: "00:20",
        finalWeight: "680 grams",
        portions: 3,
        likes: 142,
        ingredients: [4, 7, 1], // 3 ingredients
        cookingMethods:
            "STEP 1 Cook quinoa, let cool, and mix with feta, olives, and dressing.",
        category: [
          { id: 13, name: "salad" },
          { id: 1, name: "vegetarian" },
        ],
      },
    ];
  }

  localStorage.setItem("accountData", JSON.stringify(accountData));
  localStorage.setItem(
      "categoriesRecipeData",
      JSON.stringify(categoriesRecipeData)
  );
  localStorage.setItem(
      "favoriteRecipeData",
      JSON.stringify(favoriteRecipeData)
  );
  localStorage.setItem("foodData", JSON.stringify(foodData));
  localStorage.setItem("recipesData", JSON.stringify(recipesData));
}
document.addEventListener("DOMContentLoaded", checkDataBase());
