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
router.get("/users/me", tokenVerify, user.getMyData.bind(user));
router.get("/users", tokenVerify, user.getAll.bind(user));
router.get("/users/:user_id", tokenVerify, user.getById.bind(user));
router.get("/teams/", tokenVerify, squad.getAll.bind(squad));
router.get("/teams/:team_id", tokenVerify, squad.getById.bind(squad));
router.get("/teams/:team_id/members", tokenVerify, squad.getAllMembersSquad.bind(squad));

// Rotas POST
router.post("/login", user.login.bind(user));
router.post("/users", tokenVerify, user.post.bind(user));
router.post("/teams", tokenVerify, squad.post.bind(squad));
router.post("/teams/:team_id/member/:user_id", tokenVerify, user.addMemberToTeam.bind(user));

// Rotas PATCH
router.patch("/users/:user_id", tokenVerify, user.updateUserById.bind(user));
router.patch("/teams/:team_id", tokenVerify, squad.updateSquadById.bind(squad));

// Rotas DELETE
router.delete("/teams/:team_id/member/:user_id", user.removeUserFromSquad.bind(user));
router.delete("/users/:user_id", user.delUserById.bind(user));
router.delete("/teams/:teams_id", squad.delSquadById.bind(squad));
router.delete("/logout", user.logout.bind(user));

export { router };
 