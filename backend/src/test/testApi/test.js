import request from "supertest";
import { app } from "../../socket/index.js";

describe("GET /api/auth/test", () => {

    it("should return status 200 and success message", async () => {

        const res = await request(app).get("/api/auth/test");

        expect(res.statusCode).toBe(200);

        expect(res.body).toEqual({
            message: "API hoạt động tốt"
        });

    });

});