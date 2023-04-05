import Router from "express";
import UserHandler from "../handler/user";
import SquadHandler from "../handler/squad";
import tokenVerify from "../middleware/tokenVerify";

const router = Router();
const user = new UserHandler();
const squad = new SquadHandler();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos os usuários.
 *     description: Retorna uma lista de todos os usuários cadastrados no sistema.
 *     responses:
 *       200:
 *         description: Lista de usuários.
 */

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
router.patch("/users/:user_id", tokenVerify, user.updateUserById.bind(user));
router.patch("/teams/:team_id", tokenVerify, squad.updateSquadById.bind(squad));

// Rotas DELETE
router.delete("/users/:user_id");
router.delete("/teams/:teams_id");
router.delete("/teams/:team_id/member/:user_id");
router.delete("/logout", user.logout.bind(user));

export { router };
