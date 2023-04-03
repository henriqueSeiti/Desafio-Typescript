import Router from "express";
import UserHandler from "../handler/user";
import SquadHandler from "../handler/squad";

const router = Router();
const user = new UserHandler();
const squad = new SquadHandler();

// Rotas GET
router.get("/users", user.getAll.bind(user));
router.get("/users/me", user.getMyData.bind(user));
router.get("/users/:user_id", user.getById.bind(user));
router.get("/teams/", squad.getAll.bind(squad));
router.get("/teams/:team_id", squad.getById.bind(squad));
router.get("/teams/:team_id/members", squad.getAllMembersSquad.bind(squad));

// Rotas POST
router.post("/login", user.login.bind(user));
router.post("/users", user.post.bind(user));
router.post("/teams", squad.post.bind(squad));
router.post("/teams/:team_id/member/:user_id", user.addMemberToTeam.bind(user));

// Rotas PATCH
router.patch("/users/:user_id");
router.patch("/teams/:team_id");

// Rotas DELETE
router.delete("/users/:user_id", user.delUserById.bind(user));
router.delete("/teams/:teams_id", squad.delSquadById.bind(squad));
router.delete("/teams/:team_id/member/:user_id", user.removeUserFromSquad.bind(user));
router.delete("/logout", user.logout.bind(user));

export { router };
