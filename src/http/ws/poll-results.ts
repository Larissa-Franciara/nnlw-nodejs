import { FastifyInstance } from "fastify";
import { votting } from "../../utils/voting-pub-sub";
import z from "zod";

export async function pollResults(app: FastifyInstance) {
    app.get("/polls/:pollId/results", { websocket: true}, (conection, request) => {
        const voteOnPollParams = z.object({
            pollId: z.string().uuid(),
        });
        const { pollId } = voteOnPollParams.parse(request.params);
        votting.subscribe(pollId, (message) => {
            conection.socket.send(JSON.stringify(message))
        })
    });
}