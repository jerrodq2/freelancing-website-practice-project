'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const ClientReviews = require(`${process.cwd()}/src/models/client_reviews`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, checkErr, _ } = require(`${process.cwd()}/test/src/helpers`);


describe('Client Reviews Model', () => {

	it('has a create method', async() => {

	});


	it('has a findOne method', async() => {

	});


	it('has an update method', async() => {

	});


	it('has a delete method', async() => {

	});


	it('has cascading delete on job_id, client_id, and freelancer_id', async() => {

	});
});
