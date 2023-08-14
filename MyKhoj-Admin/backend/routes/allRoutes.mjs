import { Router } from "express";
import loginController from "../controllers/userController.mjs";
import bodyParserMiddleware from "../middlewares/bodyParserMiddleware.mjs"
import { authorize } from "../middlewares/jwtAuthMiddleware.mjs";

const router = Router();

// Login route
router.post('/login', bodyParserMiddleware, loginController.userAuth);
router.post('/forgotPassword', bodyParserMiddleware, loginController.forgotPassword);
router.put('/updatePassword', bodyParserMiddleware, loginController.updatePassword);
router.put('/userUpdate/:id', bodyParserMiddleware, authorize, loginController.userUpdate);
// router.delete('/userDelete/:id', loginController.userDelete);

router.post('/userAdd', bodyParserMiddleware, authorize, loginController.userAdd);

router.post('/isUnique', bodyParserMiddleware, loginController.isUnique);

//Catch-all route for unmatched routes
router.use("*", (req, res) => {
  const url = req.originalUrl.substring(1);
  let response = '';

  if (url.length > 0) {
    response = `Sorry, There Is No Function Defined For ${url}`;
  } else {
    response = 'Sorry, You Did Not Provide Any Function';
  }

  res.status(404).send(response);
});

export default router;