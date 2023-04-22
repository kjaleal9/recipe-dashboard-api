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

// GET all versions of every created recipe
router.get("/", (req, res) => {
  console.time("Get all recipes");

  if (enviornment === "Local") {
    res.json(recipes);
  }

  console.timeEnd("Get all recipes");
});

// GET the highest version recipes
router.get("/latest", (req, res) => {
  console.time("Get latest recipes");

  function groupRecipes(rows) {
    function groupBy(objectArray, property) {
      return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
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

  console.timeEnd("Get latest recipes");
});

// GET a single recipe based on RID and version
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

  console.timeEnd("Get single recipe");
});

// GET procedure of a recipe with RID and version as params
// Return is object that includes procedure, required process classes,
// and process class phases for the recipe
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

  const sortedProcedure = procedure.sort((a, b) => a.Step - b.Step);

  console.log(sortedProcedure);

  const processClassPhaseIDs = [
    ...new Set(procedure.map((row) => row.ProcessClassPhase_ID)),
  ].filter((value) => value !== "NULL");

  const selectedProcessClassPhases = ProcessClassPhase.filter((phase) =>
    processClassPhaseIDs.includes(phase.ID)
  );

  const hydratedProcedure = {
    procedure: sortedProcedure,
    RER: selectedRER,
    processClassPhases: selectedProcessClassPhases,
  };

  res.json(hydratedProcedure);

  console.timeEnd("Get recipe procedure");
});

// POST add a new recipe
router.post("/", (req, res) => {
  if (enviornment === "Local") {
    recipes.push(req.body);
    res.json(req.body);
  }
});

// DELETE a recipe with RID and version in the request body
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

  console.timeEnd("Delete recipe");
});

module.exports = router;
