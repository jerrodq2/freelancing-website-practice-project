'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FlaggedInvitations = require(`${process.cwd()}/src/models/flagged_invitations`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const Invitations = require(`${process.cwd()}/src/models/invitations`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe('Flagged Invitations Model', () => {

	describe('has a create method', () => {

	});


	describe('has a findOne method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on invitation_id and freelancer_who_flagged', () => {

	});
});
