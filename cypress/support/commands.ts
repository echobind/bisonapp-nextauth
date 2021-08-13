import { Prisma } from '@prisma/client';
import { Chance } from 'chance';

import '@testing-library/cypress/add-commands';

const chance = new Chance();

// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/**
 *  Handles creating and logging in a user with a set of attributes
 *  This should be used to login in future e2e tests instead of the login form.
 */
function createUserAndLogin(args: Prisma.UserCreateInput) {
  const sessionToken = chance.string();
  const attrs = {
    sessions: {
      create: {
        accessToken: chance.string(),
        expires: chance.date({ year: new Date().getFullYear() + 1 }),
        sessionToken,
      }
    },
    ...args,
  };

  return cy.task('factory', { name: 'User', attrs }).then(() => {
    cy.setCookie('next-auth.session-token', sessionToken);
  });
}

Cypress.Commands.add('createUserAndLogin', createUserAndLogin);
