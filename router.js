const express = require("express");
const router = express.Router();
const control = require("./controllers/user-controller");
const control = require("../controller/reports-controller");
const complainController = require('../controller/complain-controller');
const sortpackagesController = require('../controllers/sortpaackage-controller');

router.get("/users", control.getUser);
router.post("/users", control.addUser);
router.put("/users", control.updateUser);
router.delete("/users", control.deleteUser);


router.get("/sortpackages", control.getSortpackage);
router.post("/sortpackages", control.addSortpackage);
router.put("/sortpackages", control.updateSortpackage);
router.delete("/sortpackages", control.deleteSortpackage);

router.get('/generate-report', control.generateReport)
router.get('/generate-report', complainController.generateReport);



/*// Fetch parcels
fetch("http://localhost:5000/api/sortpackages")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  }); add this in this front end code*/

  /* Fetch parcels
fetch("http://localhost:5000/api/sortpackages")
.then((res) => res.json())
.then((data) => {
  console.log(data);
});   add this in server.js*/
/*app.use("/api/sortpackages", parcelRoutes);*/



module.exports = router;
