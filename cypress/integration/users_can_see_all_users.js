describe("User page", () => {
    it("can see list of all registered users", () => {
      // sign in
      cy.visit("/sessions/new");
      cy.get("#email").type("someoneelse@example.com");
      cy.get("#password").type("Password1$");
      cy.get("#submit").click();

      cy.visit("/users/index");
      cy.get(".users").should("not.contain", "Testing User1");
    });


  });