const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const {
  Recipe,
  Material,
  RecipeEquipmentRequirement: RER,
  TPIBK_RecipeBatchData: recipeBatchData,
  ProcessClassPhase,
} = require("../LocalDatabase/TPMDB");
const enviornment = "Local";

const recipes = Recipe.map((recipe) => {
  var matchingMaterial = Material.find((material) => {
    return material.SiteMaterialAlias === recipe.ProductID;
  });
  return Object.assign({}, recipe, matchingMaterial);
});

router.get("/", (req, res) => {
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

router.get("/latest", (req, res) => {
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

router.get("/:RID/:ver", (req, res) => {
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

router.get("/:RID/:ver/procedure", (req, res) => {
  console.time("Get recipe procedure");

  const selectedProcedure = recipeBatchData.filter((row) => {
    return (
      row.Recipe_RID === req.params.RID &&
      row.Recipe_Version === +req.params.ver
    );
  });

  const selectedRER = RER.filter(
    (row) =>
      row.Recipe_RID === req.params.RID &&
      +row.Recipe_Version === +req.params.ver
  );
  const procedure = selectedProcedure.map((recipeStep) => {
    let uuid = uuidv4();
    return { ...recipeStep, ID: uuid };
  });
  const processClassPhaseIDs = [
    ...new Set(procedure.map((row) => row.ProcessClassPhase_ID)),
  ].filter((value) => value !== "NULL");

  const selectedProcessClassPhases = ProcessClassPhase.filter((phase) =>
    processClassPhaseIDs.includes(phase.ID)
  );

  const hydratedProcedure = {
    procedure: procedure,
    RER: selectedRER,
    processClassPhases: selectedProcessClassPhases,
  };

  res.json(hydratedProcedure);

  console.timeEnd("Get recipe procedure");
});

router.post("/", (req, res) => {
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

router.delete("/", (req, res) => {
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

module.exports = router;
