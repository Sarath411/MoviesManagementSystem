import request from "supertest";
import app from "../src/app";

const adminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZWMwNjc2MTk0ZjA5OTc0MmI2M2U2OCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwOTk3MTUxMywiZXhwIjoxNzEwMDU3OTEzfQ.qRl475cmJylcdtPDk4P7VUe8iOqp7e0MmL41BgHgNlM";
const userToken =
  "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZWMwOTJjYTEwNGQyZTIwZWVjZGJjZiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA5OTcxNTM4LCJleHAiOjE3MTAwNTc5Mzh9.QTE4jzHghSxwEtVHvF0xl1L-cO897a2dg9ArZyDhUWg";

describe("Movies API - Create Movie", () => {
  describe("POST /api/movies", () => {
    const newMovie = {
      title: "Test Movie",
      genre: "Test Genre",
      rating: 8,
      streamingLink: "http://example.com/movie",
    };

    it("should allow an admin to create a movie", async () => {
      const response = await request(app)
        .post("/api/movies")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newMovie)
        .expect(201); // Using 201 for Created status code

      expect(response.body).toHaveProperty(
        "message",
        "Movie added successfully"
      );
    });

    it("should not allow a regular user to create a movie", async () => {
      await request(app)
        .post("/api/movies")
        .set("Authorization", `Bearer ${userToken}`)
        .send(newMovie)
        .expect(403);
    });
  });
});
