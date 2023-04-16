const express = require("express");
const cors = require("cors");
const knex = require("knex");
const {
  Recipe,
  Material,
  MaterialClass,
  ProcessClass,
  RecipeEquipmentRequirement,
} = require("./LocalDatabase/TPMDB");



const enviornment = "Local";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    port: 5432,
    password: "pizza",
    database: "TPMDB",
  },
  useNullAsDefault: true,
});

const app = express();

app.use(express.json());
app.use(cors());

const recipes = Recipe.map((recipe) => {
  var matchingMaterial = Material.find((material) => {
    return material.SiteMaterialAlias === recipe.ProductID;
  });
  return Object.assign({}, recipe, matchingMaterial);
});

app.get("/recipes", (req, res) => {
  console.time("Get all recipes");

  if (enviornment === "Local") {
    res.json(recipes);
  }
  if (enviornment === "Production") {
    db.select(
      "RID",
      "Version",
      "RecipeType",
      "Description",
      "Status",
      "ProductID",
      "Name",
      "VersionDate",
      "BatchSizeMin",
      "BatchSizeMax",
      "BatchSizeNominal"
    )
      .from("Recipe")
      .leftOuterJoin("Material", function () {
        this.on("ProductID", "=", "SiteMaterialAlias");
      })
      .where("RecipeType", "=", "Master")
      .orderBy([{ column: "RID" }, { column: "Version", order: "desc" }])
      .then((data) => {
        // data.map((recipe, index) => (recipe['ID'] = index));
        res.json(data);
      });
  }
  console.timeEnd("Get all recipes");
});

app.get("/recipes/latest", (req, res) => {
  console.time("Get latest recipes");

  function groupRecipes(rows) {
    function groupBy(objectArray, property) {
      return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        // Add object to list for given key's value
        acc[key].push(obj);
        return acc;
      }, {});
    }

    const groupedRecipes = groupBy(rows, "RID");

    return Object.keys(groupedRecipes).map((key) =>
      groupedRecipes[key].reduce((max, recipe) =>
        max["Version"] > recipe["Version"] ? max : recipe
      )
    );
  }

  if (enviornment === "Local") {
    const groupedRecipes = groupRecipes(recipes);
    res.json(groupedRecipes);
  }
  if (enviornment === "Production") {
    db.select(
      "RID",
      "Version",
      "RecipeType",
      "Description",
      "Status",
      "ProductID",
      "Name",
      "VersionDate",
      "BatchSizeMin",
      "BatchSizeMax",
      "BatchSizeNominal"
    )
      .from("Recipe")
      .leftOuterJoin("Material", function () {
        this.on("ProductID", "=", "SiteMaterialAlias");
      })
      .where("RecipeType", "=", "Master")
      .orderBy([{ column: "RID" }, { column: "Version", order: "desc" }])
      .then((data) => {
        //data.map((recipe, index) => (recipe['ID'] = index));

        const groupedRecipes = groupRecipes(data);
        res.json(groupedRecipes);
      });
  }
  console.timeEnd("Get latest recipes");
});

app.get("/recipes/:RID/:ver", (req, res) => {
  console.time("Get single recipe");

  if (enviornment === "Local") {
    res.json(
      recipes.recipes.filter(
        (recipe) =>
          recipe.RID === req.params.RID && recipe.Version === +req.params.ver
      )
    );
  }
  if (enviornment === "Production") {
    db.select(
      "RID",
      "Version",
      "RecipeType",
      "Description",
      "Status",
      "ProductID",
      "Name",
      "VersionDate"
    )
      .from("Recipe")
      .leftOuterJoin("Material", function () {
        this.on("ProductID", "=", "SiteMaterialAlias");
      })
      .where("RID", "=", req.params.RID)
      .andWhere("Version", "=", req.params.ver)
      .then((data) => {
        res.json(data);
      });
  }
  console.timeEnd("Get single recipe");
});

app.post("/recipes", (req, res) => {
  if (enviornment === "Local") {
    recipes.push(req.body);
    res.json(req.body);
  }
  if (enviornment === "Production") {
    db.insert(req.body)
      .into("Recipe")
      .then(res.json(req.body))
      .catch((error) => res.json(error));
  }
});

app.delete("/recipes", (req, res) => {
  console.time("Delete recipe");
  if (enviornment === "Local") {
    const deleteIndex = recipes.recipes.findIndex(
      (recipe) =>
        recipe.RID === req.body.RID && recipe.Version === req.body.Version
    );

    recipes.splice(deleteIndex, 1);
    res.json(recipes);
  }
  if (enviornment === "Production") {
    db.where({ RID: req.body.RID, Version: req.body.Version })
      .from("Recipe")
      .del()
      .then((data) => res.json(data))
      .catch((error) => console.log(error));
  }
  console.timeEnd("Delete recipe");
});

app.get("/materials", (req, res) => {
  console.time("Get all materials");
  if (enviornment === "Local") {
    res.json(Material);
  }
  if (enviornment === "Production") {
    db.select("ID", "SiteMaterialAlias", "Name", "MaterialClass_ID")
      .from("Material")
      .then((data) => {
        res.json(data);
      });
  }
  console.timeEnd("Get all materials");
});

app.get("/material-classes", (req, res) => {
  console.time("Get all material classes");
  if (enviornment === "Local") {
    res.json(MaterialClass);
  }
  if (enviornment === "Production") {
    db.select("ID", "Name", "Description")
      .from("MaterialClass")
      .then((data) => {
        res.json(data);
      });
  }
  console.timeEnd("Get all material classes");
});

app.get("/process-classes", (req, res) => {
  console.time("Get all process classes");
  if (enviornment === "Local") {
    res.json(ProcessClass);
  }
  if (enviornment === "Production") {
    db.select("ID", "Name", "Description", "ProcessGroup_ID")
      .from("ProcessClass")
      .then((data) => {
        res.json(data);
      });
  }
  console.timeEnd("Get all process classes");
});

app.get("/process-classes/required", (req, res) => {
  console.time("Get all process class requirements");
  if (enviornment === "Local") {
    res.json(RecipeEquipmentRequirement);
  }
  if (enviornment === "Production") {
    db.select(
      "ID",
      "Recipe_RID",
      "Recipe_Version",
      "ProcessClass_Name",
      "Equipment_Name",
      "IsMainBatchUnit"
    )
      .from("RecipeEquipmentRequirement")
      .then((data) => {
        res.json(data);
      });
  }
  console.timeEnd("Get all process class requirements");
});

app.listen(5000, () => {
  console.log("app is running on port 5000");
});
