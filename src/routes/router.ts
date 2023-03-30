import Router from "express";
import UserHandler from "../handler/user";
import SquadHandler from "../handler/squad";

const router = Router();
const user = new UserHandler();
const squad = new SquadHandler();

// Rotas GET
router.get("/users", user.get.bind(user));
router.get("/users/me");
router.get("/users/:user_id");
router.get("/teams/", squad.get.bind(squad));
router.get("/teams/:team_id");
router.get("/teams/:team_id/members")

// Rotas POST
router.post("/login");
router.post("/users")
router.post("/teams")
router.post("/teams/:team_id/member/:user_id")

// Rotas PATCH
router.patch("/users/:user_id");
router.patch("/teams/:team_id");

// Rotas DELETE
router.delete("/users/:user_id");
router.delete("/teams/:teams_id");
router.delete("/teams/:team_id/member/:user_id");
router.delete("/logout")

export { router };