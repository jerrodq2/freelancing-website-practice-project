'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const InappropriateFlags = require(`${process.cwd()}/src/models/inappropriate_flags`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const ClientReviews = require(`${process.cwd()}/src/models/client_reviews`);
const FreelancerReviews = require(`${process.cwd()}/src/models/freelancer_reviews`);
const Proposals = require(`${process.cwd()}/src/models/proposals`);
const Invitations = require(`${process.cwd()}/src/models/invitations`);
const { db, random, checkErr, _ } = require(`${process.cwd()}/test/src/helpers`);


describe('Inappropriate Flags Model', () => {

	describe('has a create method', () => {

	});


	describe('has a getAll method', () => {

	});


	describe('has a findOne method', () => {

	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on job_id, client_id, freelancer_id, client_review_id, freelancer_review_id, proposal_id, and invitation_id', () => {

	});
});
