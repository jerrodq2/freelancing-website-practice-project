'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FlaggedFreelancerReviews = require(`${process.cwd()}/src/models/flagged_freelancer_reviews`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const FreelancerReviews = require(`${process.cwd()}/src/models/freelancer_reviews`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe('Flagged Freelancer Reviews Model', () => {

	describe('has a create method', () => {

	});


	describe('has a findOne method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on freelancer_review_id, client_who_flagged, and freelancer_who_flagged', () => {

	});
});
