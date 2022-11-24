describe("User page", () => {
    it("can see list of all registered users and send friend request", () => {
      // sign in 
      cy.visit("/sessions/new");
      cy.get("#email").type("someoneelse@example.com");
      cy.get("#password").type("Password1$");
      cy.get("#submit").click();

      cy.visit("/users/index");
      cy.get(".users").should("not.contain", "Testing User1");

    
      cy.get(".users").find('button').first().should("contain", "Add Friend");
      cy.get(".users").find('button').first().click();
      cy.get(".users").find('button').first().should("contain", "Request Sent!");

      // user can sign in and approve friend request
      cy.get("input").click();
      cy.visit("/sessions/new");
      cy.get("#email").type("someone@example.com");
      cy.get("#password").type("password");
      cy.get("#submit").click();

      cy.visit("/users/index");
      cy.get(".users").find('button').first().should("contain", "Approve Friend Request!");
      cy.get(".users").find('button').first().click();
      cy.get(".users").find('button').first().should("contain", "UnFriend");


    });


  });